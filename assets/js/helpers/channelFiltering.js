import {
    CSS_CLASS_BUTTON_PRIMARY,
    ID_PREFIX_CONTAINERS_CHANNELS,
    COUNTRY_CODES
} from '../constants/index.js';
import { showToast } from './index.js';

/**
 * Normalizes a string by removing accents and converting to lowercase.
 * @param {string} input - The string to normalize.
 * @returns {string} The normalized string.
 */
function normalizeInput(input) {
    return input?.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase() ?? '';
}

/**
 * Toggles the visibility of a "No matches" alert message.
 * @param {HTMLElement} element - The alert element.
 * @param {boolean} shouldHide - Whether to hide the alert.
 * @param {string} textNotFound - The text that was not found (to display in the alert).
 * @returns {void}
 */
function toggleNoMatchesAlert(element, shouldHide, textNotFound) {
    if (!element) return;
    element.classList.toggle('d-none', shouldHide);
    const span = element.querySelector('span');
    if (span) span.textContent = textNotFound;
}

/**
 * Filters channel buttons based on search input, country, and category filters.
 * Updates visibility of buttons and groups, and shows an alert if no matches found.
 * 
 * @param {string} inputValue - The value from the search input.
 * @param {HTMLElement} channelButtonsContainer - The container element holding the channel buttons.
 * @returns {void}
 */
export function filterChannelsByInput(inputValue, channelButtonsContainer) {
    try {
        if (!channelButtonsContainer) return;

        const CONTAINER_ID = channelButtonsContainer.id;
        const NORMALIZED_INPUT = normalizeInput(inputValue);
        const CHANNEL_BUTTONS = channelButtonsContainer.querySelectorAll('button[data-canal]');

        for (const PREFIX of ID_PREFIX_CONTAINERS_CHANNELS) {
            if (CONTAINER_ID.startsWith(PREFIX)) {
                let hasMatch = false;
                let activeCountryFilter = 'all';
                let activeCategoryFilter = 'all';

                // Determine active Country Filter
                const countryFilterElements = document.querySelectorAll(`#${PREFIX}-collapse-botones-listado-filtro-paises [data-country]`);
                countryFilterElements.forEach(element => {
                    if (element.classList.contains(CSS_CLASS_BUTTON_PRIMARY)) {
                        const datasetValue = element.dataset.country ?? 'all';
                        activeCountryFilter = COUNTRY_CODES[datasetValue] ?? datasetValue;
                    }
                });

                // Determine active Category Filter
                const categoryFilterElements = document.querySelectorAll(`#${PREFIX}-collapse-botones-listado-filtro-categorias [data-category]`);
                categoryFilterElements.forEach(element => {
                    if (element.classList.contains(CSS_CLASS_BUTTON_PRIMARY)) {
                        activeCategoryFilter = element.dataset.category ?? 'all';
                    }
                });

                const groupVisibilityMap = new Map();

                CHANNEL_BUTTONS.forEach(button => {
                    if (!button) return;

                    const normalizedButtonContent = normalizeInput(`${button.dataset.country} - ${button.textContent}`);
                    const channelCategory = (button.dataset.category ?? 'undefined').toLowerCase();
                    const textMatches = normalizedButtonContent.includes(NORMALIZED_INPUT);
                    const groupContainer = button.closest('.grupo-canales-origen');

                    // Initialize group visibility as false if encountered for the first time
                    if (groupContainer && !groupVisibilityMap.has(groupContainer)) {
                        groupVisibilityMap.set(groupContainer, false);
                    }

                    const passesCountryFilter = activeCountryFilter === 'all' || button.dataset.country === activeCountryFilter;
                    const passesCategoryFilter = activeCategoryFilter === 'all' || channelCategory === activeCategoryFilter;

                    const shouldShow = textMatches && passesCountryFilter && passesCategoryFilter;

                    button.classList.toggle('d-none', !shouldShow);

                    if (shouldShow) {
                        hasMatch = true;
                        if (groupContainer) {
                            groupVisibilityMap.set(groupContainer, true);
                        }
                    }
                });

                // Update visibility of channel groups (origins)
                groupVisibilityMap.forEach((hasVisibleChannels, group) => {
                    if (!group) return;
                    group.classList.toggle('d-none', !hasVisibleChannels);
                });

                const alertElement = document.querySelector(`#${PREFIX}-mensaje-alerta`);
                toggleNoMatchesAlert(alertElement, hasMatch, NORMALIZED_INPUT);

                // Exit loop once the matching container prefix is found and processed
                break;
            }
        }
    } catch (error) {
        console.error(`Error filtering channels. Error: ${error}`);

        showToast({
            title: 'Ha ocurrido un error al intentar filtrar canales.',
            body: `Error: ${error}`,
            type: 'danger',
            autohide: false,
            delay: 0,
            showReloadOnError: true
        });
    }
}
