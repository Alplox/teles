import { channelsList } from "../channelManager.js";
import {
    CSS_CLASS_BUTTON_PRIMARY,
    COUNTRY_CODES,
    ID_PREFIX_CONTAINERS_CHANNELS,
} from "../constants/index.js";
import { filterChannelsByInput, showToast } from "./index.js";
import { syncCategoriesWithCountry } from "./syncFilters.js";

/**
 * Creates and renders country filter buttons for all configured channel containers.
 * Counts available channels per country and ensures consistent ordering.
 * Configures event listeners for country selection and synchronization with category filters.
 *
 * @returns {void}
 */
export function createCountryButtons() {
    try {
        const CHANNELS_WITH_COUNTRY = Object.values(channelsList).map(channel => {
            if (channel?.país !== '') {
                return channel.país.toLowerCase();
            } else {
                return 'Desconocido';
            }
        });

        const UNIQUE_COUNTRIES = [...new Set(CHANNELS_WITH_COUNTRY)];

        const CHANNEL_COUNT_BY_COUNTRY = CHANNELS_WITH_COUNTRY.reduce((count, country) => {
            count[COUNTRY_CODES[country] ?? 'Desconocido'] = (count[COUNTRY_CODES[country] ?? 'Desconocido'] || 0) + 1;
            return count;
        }, {});

        const SORTED_COUNTRIES = UNIQUE_COUNTRIES.filter(country => COUNTRY_CODES[country]).sort((a, b) => {
            const codeA = COUNTRY_CODES[a].toLowerCase();
            const codeB = COUNTRY_CODES[b].toLowerCase();
            return codeA.localeCompare(codeB);
        });

        const COUNTRY_OPTIONS = [];

        COUNTRY_OPTIONS.push({
            value: 'all',
            displayName: 'Todos los países',
            badge: Object.keys(channelsList).length,
            flag: null
        });

        for (const COUNTRY of SORTED_COUNTRIES) {
            if (!COUNTRY_CODES[COUNTRY]) continue;
            const countryName = COUNTRY_CODES[COUNTRY];
            const channelCount = CHANNEL_COUNT_BY_COUNTRY[countryName] || 0;
            COUNTRY_OPTIONS.push({
                value: COUNTRY,
                displayName: countryName,
                badge: channelCount,
                flag: `https://flagcdn.com/${COUNTRY}.svg`
            });
        }

        if (!SORTED_COUNTRIES.includes('Desconocido')) {
            const unknownCount = CHANNEL_COUNT_BY_COUNTRY['Desconocido'] || 0;
            COUNTRY_OPTIONS.push({
                value: 'Desconocido',
                displayName: 'Desconocido',
                badge: unknownCount,
                flag: null
            });
        }

        for (const PREFIX of ID_PREFIX_CONTAINERS_CHANNELS) {
            const countryFilterContainer = document.querySelector(`#${PREFIX}-collapse-botones-listado-filtro-paises`);
            if (!countryFilterContainer) continue;

            const dropdownWrapper = document.createElement('div');
            dropdownWrapper.classList.add('btn-group', 'dropdown');

            const toggleButton = document.createElement('button');
            toggleButton.setAttribute('type', 'button');
            toggleButton.classList.add('btn', 'btn-sm', 'btn-dark', 'dropdown-toggle', 'rounded-pill', 'text-truncate', 'text-start');
            toggleButton.dataset.bsToggle = 'dropdown';
            toggleButton.setAttribute('aria-expanded', 'false');
            toggleButton.innerHTML = '<i class="bi bi-flag"></i> País: Todos los países';

            const updateToggleState = (hasActiveFilter) => {
                if (hasActiveFilter) {
                    toggleButton.classList.remove('btn-dark');
                    if (!toggleButton.classList.contains(CSS_CLASS_BUTTON_PRIMARY)) {
                        toggleButton.classList.add(CSS_CLASS_BUTTON_PRIMARY);
                    }
                } else {
                    toggleButton.classList.remove(CSS_CLASS_BUTTON_PRIMARY);
                    if (!toggleButton.classList.contains('btn-dark')) {
                        toggleButton.classList.add('btn-dark');
                    }
                }
            };

            const dropdownMenu = document.createElement('ul');
            dropdownMenu.classList.add('dropdown-menu', 'p-2', 'rounded-4', 'mh-dropdown-filtros');

            const buildInputId = value => `${PREFIX}-filtro-pais-${value}`.replace(/\s+/g, '-').toLowerCase();

            const clearSelection = () => {
                dropdownMenu.querySelectorAll('label[data-country]').forEach(label => {
                    label.classList.remove(CSS_CLASS_BUTTON_PRIMARY);
                    if (!label.classList.contains('btn-outline-secondary')) {
                        label.classList.add('btn-outline-secondary');
                    }
                });
            };

            const activateLabel = label => {
                if (!label) return;
                if (label.dataset.country === 'all') {
                    label.classList.add(CSS_CLASS_BUTTON_PRIMARY);
                    label.classList.remove('btn-outline-secondary');
                    toggleButton.innerHTML = '<i class="bi bi-flag"></i> País: Todos los países';
                    updateToggleState(false);
                } else {
                    label.classList.replace('btn-outline-secondary', CSS_CLASS_BUTTON_PRIMARY);
                    const selectedName = label.querySelector('.flex-grow-1')?.textContent?.trim() || 'País';
                    toggleButton.innerHTML = `<i class="bi bi-flag"></i> País: ${selectedName}`;
                    updateToggleState(true);
                }
            };

            const handleFilterChange = selectedLabel => {
                try {
                    const channelButtonsContainer = document.querySelector(`#${PREFIX}-channels-buttons-container`);
                    const filterInput = document.querySelector(`#${PREFIX}-input-filtro`);
                    const searchValue = filterInput?.value ?? '';
                    const selectedCountryValue = selectedLabel?.dataset.country ?? 'all';

                    clearSelection();
                    activateLabel(selectedLabel);
                    syncCategoriesWithCountry(PREFIX, selectedCountryValue);
                    filterChannelsByInput(searchValue, channelButtonsContainer);
                } catch (error) {
                    console.error(`[teles] Error activating country filter: ${error}`);
                    clearSelection();
                    const allLabel = dropdownMenu.querySelector('label[data-country="all"]');
                    if (allLabel) {
                        allLabel.previousElementSibling.checked = true;
                        activateLabel(allLabel);
                    }

                    showToast({
                        title: 'Ha ocurrido un error al intentar activar filtro país.',
                        body: `Error: ${error}`,
                        type: 'danger',
                        autohide: false,
                        delay: 0,
                        showReloadOnError: true
                    });
                }
            };

            for (const option of COUNTRY_OPTIONS) {
                const li = document.createElement('li');
                li.classList.add('mb-1');

                const inputId = buildInputId(option.value);
                const input = document.createElement('input');
                input.setAttribute('type', 'radio');
                input.classList.add('btn-check');
                input.name = `${PREFIX}-filtro-pais`;
                input.id = inputId;
                input.autocomplete = 'off';
                input.dataset.country = option.value;

                const label = document.createElement('label');
                label.classList.add(
                    'btn', 'btn-sm', 'btn-outline-indigo', 'w-100', 'd-flex', 'justify-content-between', 'align-items-center',
                    'text-start', 'gap-2', 'rounded-3'
                );
                label.setAttribute('for', inputId);
                label.dataset.country = option.value;
                label.innerHTML = `
                    <span class="flex-grow-1 text-truncate">${option.displayName}</span>
                    ${option.flag ? `<img src="${option.flag}" alt="bandera ${option.displayName}" title="${option.displayName}" class="svg-bandera rounded-1">` : ''}
                    <span class="badge bg-secondary">${option.badge}</span>
                `;

                if (option.value === 'all') {
                    input.checked = true;
                    label.classList.add(CSS_CLASS_BUTTON_PRIMARY);
                } else {
                    label.classList.add('btn-outline-secondary');
                }

                input.addEventListener('change', () => handleFilterChange(label));

                li.append(input, label);
                dropdownMenu.append(li);
            }

            const lastElement = dropdownMenu.lastElementChild;
            if (lastElement) {
                lastElement.classList.remove('mb-1');
            }

            dropdownWrapper.append(toggleButton, dropdownMenu);
            countryFilterContainer.innerHTML = '';
            countryFilterContainer.append(dropdownWrapper);
        }
    } catch (error) {
        console.error(`[teles] Error creating buttons for country filter: ${error}`);
        showToast({
            title: 'Ha ocurrido un error durante la creación de botones para filtrado por país.',
            body: `Error: ${error}`,
            type: 'danger',
            autohide: false,
            delay: 0,
            showReloadOnError: true
        });

        const insertErrorDiv = (err, msg) => {
            const div = document.createElement('div');
            div.className = 'alert alert-danger';
            div.textContent = `${msg}: ${err}`;
            return div;
        };

        for (const PREFIX of ID_PREFIX_CONTAINERS_CHANNELS) {
            document.querySelector(`#${PREFIX}-channels-buttons-container`)?.insertAdjacentElement('afterend', insertErrorDiv(error, 'Ha ocurrido un error durante la creación de botones para filtro paises'));
        }
    }
}
