import { channelsList, DEFAULT_SOURCE_ORIGIN } from "../channelManager.js";
import { CSS_CLASS_BUTTON_SECONDARY, COUNTRY_CODES, CATEGORIES_ICONS, ID_PREFIX_CONTAINERS_CHANNELS } from "../constants/index.js";
import { singleViewVideoContainer, tele } from "../main.js";
import { showToast, areAllSignalsEmpty, saveOriginalOrder, replaceActiveChannel } from "./index.js";

import { changeChannelModalEl } from "../canalUI.js";

/** @type {string} SVG placeholder for channels with unknown country */
const SVG_UNKNOWN_COUNTRY = `
<svg width="24" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
    <rect width="16" height="16" rx="2" fill="#e0e0e0"/>
    <rect x="2" y="2" width="12" height="12" rx="1" fill="#bdbdbd"/>
    <text x="8" y="11" text-anchor="middle" font-size="8" fill="#757575">?</text>
</svg>
`;

/** @type {string[]} Container IDs that are populated during initial load */
const MAIN_BUTTON_CONTAINER_IDS = [
    '#modal-canales-channels-buttons-container',
    '#offcanvas-canales-channels-buttons-container'
];

/**
 * @typedef {Object} ButtonScenario
 * @property {string} description - Description of the scenario behavior
 * @property {function({channelId: string, isSelecting: boolean, button?: HTMLButtonElement}): void} onSelect - Handler for button selection
 */

/**
 * Scenario configurations for handling button interactions.
 * Controls multi-selection and single-selection contexts.
 * @type {Object.<string, ButtonScenario>}
 */
const BUTTON_SCENARIOS = {
    grid: {
        description: 'Allows multiple active channels within the grid.',
        onSelect: ({ channelId, isSelecting }) => {
            if (!tele || typeof tele.add !== 'function' || typeof tele.remove !== 'function') {
                console.warn("[teles] Couldn't find 'tele' function to manage grid view.");
                return;
            }
            const action = isSelecting ? 'add' : 'remove';
            tele[action](channelId);
        }
    },
    change: {
        description: 'Replaces the active signal from the "Change channel" modal.',
        onSelect: ({ channelId }) => {
            const previousChannel = changeChannelModalEl?.dataset.channelSource;
            if (!previousChannel) {
                console.warn('[teles] There is no channel selected to replace in the "Change channel" modal.');
                return;
            }
            replaceActiveChannel(channelId, previousChannel);
        }
    },
    'single-view': {
        description: 'Only allows one active channel at a time in single view.',
        onSelect: ({ channelId, isSelecting }) => {
            if (!tele || typeof tele.add !== 'function' || typeof tele.remove !== 'function') {
                console.warn("[teles] Couldn't find 'tele' function to manage single view.");
                return;
            }
            if (!singleViewVideoContainer) return;

            if (!isSelecting) {
                tele.remove(channelId);
                return;
            }

            const currentChannel = singleViewVideoContainer.querySelector('div[data-canal]');
            if (currentChannel?.dataset.canal && currentChannel.dataset.canal !== channelId) {
                tele.remove(currentChannel.dataset.canal);
            }
            tele.add(channelId);
        }
    }
};

/**
 * @typedef {Object} ContainerConfig
 * @property {string} selector - CSS selector for the container
 * @property {keyof typeof BUTTON_SCENARIOS} scenario - Scenario key to apply
 * @property {boolean} delegateEvents - Whether to use event delegation
 * @property {boolean} [applyDismissAttribute] - Whether to add data-bs-dismiss attribute
 */

/**
 * Configuration mapping between containers and scenarios for event initialization.
 * @type {ContainerConfig[]}
 */
const BUTTON_CONTAINER_CONFIG = [
    {
        selector: '#modal-canales-channels-buttons-container',
        scenario: 'grid',
        delegateEvents: true
    },
    {
        selector: '#offcanvas-canales-channels-buttons-container',
        scenario: 'grid',
        delegateEvents: true
    },
    {
        selector: '#modal-cambiar-canal-channels-buttons-container',
        scenario: 'change',
        delegateEvents: false,
        applyDismissAttribute: true
    },
    {
        selector: '#single-view-channels-buttons-container',
        scenario: 'single-view',
        delegateEvents: false
    }
];

/**
 * Groups channels by their list origin for creating visible blocks.
 * @returns {[string, {id: string, data: Object}[]][]} Array of [origin, channels] tuples
 */
const groupChannelsByOrigin = () => {
    const groups = new Map();

    for (const channelId of Object.keys(channelsList)) {
        const data = channelsList[channelId];
        const origin = data?.origenLista ?? DEFAULT_SOURCE_ORIGIN;

        if (!groups.has(origin)) {
            groups.set(origin, []);
        }
        groups.get(origin).push({ id: channelId, data });
    }

    return Array.from(groups.entries())
        .sort((a, b) => a[0].localeCompare(b[0], 'es', { sensitivity: 'base' }));
};

/**
 * Renders channel groups into one or more containers.
 * @param {[string, {id: string, data: Object}[]][]} groups - Grouped channels by origin
 * @param {string[]} selectors - CSS selectors for target containers
 * @returns {void}
 */
const renderButtonsInContainers = (groups, selectors = []) => {
    selectors.forEach(selector => {
        const container = document.querySelector(selector);
        if (!container) return;

        container.innerHTML = '';
        const baseId = container.id || selector.replace('#', '') || 'grupo-canales';
        const fragment = buildChannelsFragment(groups, { baseId });
        container.append(fragment);
    });
};

/**
 * Builds a reusable DOM fragment containing grouped channel buttons.
 * @param {[string, {id: string, data: Object}[]][]} groups - Grouped channels
 * @param {Object} [options={}] - Configuration options
 * @param {string} [options.baseId='grupo-canales'] - Base ID for collapse elements
 * @returns {DocumentFragment} Fragment ready to be appended
 */
const buildChannelsFragment = (groups, { baseId = 'grupo-canales' } = {}) => {
    const fragment = document.createDocumentFragment();

    groups.forEach(([origin, channels], index) => {
        const wrapper = document.createElement('div');
        wrapper.classList.add('grupo-canales-origen', 'mb-2', 'p-2', 'rounded-3', 'border', 'border-light-subtle', 'bg-dark-subtle');
        wrapper.setAttribute('data-origen-lista', origin);

        const collapseId = `${baseId}-origen-${index}`;

        const header = document.createElement('div');
        header.classList.add('d-flex', 'align-items-center', 'gap-1', 'flex-wrap');
        header.setAttribute('data-bs-toggle', 'collapse');
        header.setAttribute('data-bs-target', `#${collapseId}`);
        header.setAttribute('role', 'button');
        header.setAttribute('aria-expanded', 'true');
        header.setAttribute('aria-controls', collapseId);
        header.innerHTML = `
            <p class="badge rounded-pill text-bg-secondary text-wrap mb-0 w-100">${origin}</p>
            <small class="text-secondary">${channels.length} canales</small>
            <i class="bi bi-chevron-up ms-auto icono-estado-colapso"></i>
        `;

        const list = document.createElement('div');
        list.classList.add('modal-body-canales');
        channels.forEach(({ id, data }) => {
            list.append(createChannelButton(id, data));
        });

        const collapse = document.createElement('div');
        collapse.classList.add('mt-1', 'show');
        collapse.id = collapseId;
        collapse.append(list);

        // Icon state management for collapse
        const stateIcon = header.querySelector('.icono-estado-colapso');
        const updateIcon = (isOpen) => {
            if (!stateIcon) return;
            stateIcon.classList.toggle('bi-chevron-up', isOpen);
            stateIcon.classList.toggle('bi-chevron-down', !isOpen);
        };

        collapse.addEventListener('show.bs.collapse', () => updateIcon(true));
        collapse.addEventListener('hide.bs.collapse', () => updateIcon(false));
        updateIcon(true);

        wrapper.append(header, collapse);
        fragment.append(wrapper);
    });

    return fragment;
};

/**
 * Creates an individual button element for a channel.
 * @param {string} channelId - Unique channel identifier
 * @param {Object} channelData - Channel data object
 * @returns {HTMLButtonElement} The created button element
 */
const createChannelButton = (channelId, channelData) => {
    const { nombre, país } = channelData;
    const category = (channelData.categoría ?? '').toLowerCase();
    const categoryIcon = category && category in CATEGORIES_ICONS
        ? CATEGORIES_ICONS[category]
        : '<i class="bi bi-tv"></i>';

    const countryName = país && COUNTRY_CODES[país.toLowerCase()]
        ? COUNTRY_CODES[país.toLowerCase()]
        : 'Desconocido';

    const combinedSources = Array.isArray(channelData?.fuentesCombinadas)
        ? channelData.fuentesCombinadas.filter(Boolean)
        : [];
    const isCombinedSignal = channelData?.esSeñalCombinada === true && combinedSources.length > 1;
    const sourcesDescription = combinedSources.length > 0
        ? combinedSources.join(', ')
        : 'fuentes múltiples';

    const combinedBadge = isCombinedSignal
        ? `<span class="badge badge-señal-combinada" data-bs-toggle="tooltip" data-bs-title="Señales desde: ${sourcesDescription}"><i class="bi bi-shuffle"></i> Mix</span>`
        : '';

    const button = document.createElement('button');
    button.setAttribute('data-canal', channelId);
    button.setAttribute('data-country', countryName);
    button.setAttribute('data-category', category || 'undefined');

    if (isCombinedSignal) {
        button.classList.add('canal-combinado');
        button.dataset.fuentesCombinadas = sourcesDescription;
    }

    button.classList.add('btn', CSS_CLASS_BUTTON_SECONDARY, 'd-flex', 'justify-content-between', 'align-items-center', 'gap-2', 'text-start', 'rounded-3');

    if (areAllSignalsEmpty(channelId)) {
        button.classList.add('d-none');
    }

    const flagHtml = país && COUNTRY_CODES[país.toLowerCase()]
        ? `<img src="https://flagcdn.com/${país.toLowerCase()}.svg" alt="bandera ${countryName}" title="${countryName}" class="svg-bandera rounded-1">`
        : `<span class="svg-bandera rounded-1 h-100" title="Sin bandera para país [${countryName}]">${SVG_UNKNOWN_COUNTRY}</span>`;

    button.innerHTML = `
        <span class="flex-grow-1">${nombre}</span>
        ${flagHtml}
        ${categoryIcon}
        ${combinedBadge}`;

    return button;
};

/**
 * Initializes event delegation for channel button containers.
 * Ensures no duplicate listeners are registered on the same container.
 * @returns {void}
 */
const assignButtonEvents = () => {
    BUTTON_CONTAINER_CONFIG.forEach(config => {
        const container = document.querySelector(config.selector);
        if (!container || container.dataset.eventsInitialized === 'true') return;

        container.dataset.eventsInitialized = 'true';

        if (config.delegateEvents) {
            registerDelegatedEvents(container, config.scenario);
        } else {
            registerStaticEvents(container, config.scenario, {
                applyDismissAttribute: config.applyDismissAttribute
            });
        }
    });
};

/**
 * Configures event delegation for dynamic containers.
 * @param {HTMLElement} container - Container element
 * @param {keyof typeof BUTTON_SCENARIOS} scenarioKey - Scenario identifier
 * @returns {void}
 */
const registerDelegatedEvents = (container, scenarioKey) => {
    container.addEventListener('click', (event) => {
        const button = event.target.closest('button[data-canal]');
        if (!button || !container.contains(button)) return;

        handleButtonSelection(button, scenarioKey);
    });
};

/**
 * Configures direct listeners and observes changes for static containers.
 * @param {HTMLElement} container - Container element
 * @param {keyof typeof BUTTON_SCENARIOS} scenarioKey - Scenario identifier
 * @param {Object} [options={}] - Configuration options
 * @param {boolean} [options.applyDismissAttribute=false] - Whether to add dismiss attribute
 * @returns {void}
 */
const registerStaticEvents = (container, scenarioKey, { applyDismissAttribute = false } = {}) => {
    const updateEvents = () => {
        const buttons = Array.from(container.querySelectorAll('button[data-canal]'));

        buttons.forEach(button => {
            const clonedButton = button.cloneNode(true);

            if (applyDismissAttribute) {
                clonedButton.setAttribute('data-bs-dismiss', 'modal');
            }

            clonedButton.addEventListener('click', () => handleButtonSelection(clonedButton, scenarioKey));
            button.replaceWith(clonedButton);
        });
    };

    updateEvents();

    const observer = new MutationObserver(() => {
        observer.disconnect();
        updateEvents();
        observer.observe(container, { childList: true, subtree: true });
    });

    observer.observe(container, { childList: true, subtree: true });
};

/**
 * Handles button selection based on the configured scenario.
 * @param {HTMLButtonElement} button - The clicked button
 * @param {keyof typeof BUTTON_SCENARIOS} scenarioKey - Scenario identifier
 * @returns {void}
 */
const handleButtonSelection = (button, scenarioKey) => {
    if (!button) return;

    const channelId = button.dataset.canal;
    if (!channelId) return;

    const isSelecting = button.classList.contains(CSS_CLASS_BUTTON_SECONDARY);

    executeScenario(scenarioKey, {
        button,
        channelId,
        isSelecting
    });
};

/**
 * Executes the action associated with a specific scenario.
 * @param {keyof typeof BUTTON_SCENARIOS} scenarioKey - Scenario identifier
 * @param {Object} context - Execution context
 * @param {HTMLButtonElement} context.button - The button element
 * @param {string} context.channelId - Channel identifier
 * @param {boolean} context.isSelecting - Whether selecting or deselecting
 * @returns {void}
 */
const executeScenario = (scenarioKey, context) => {
    const scenario = BUTTON_SCENARIOS[scenarioKey];

    if (!scenario) {
        console.warn(`[teles] There is no configuration for the scenario "${scenarioKey}".`);
        return;
    }

    scenario.onSelect(context);
};

/**
 * Renders channel buttons grouped by M3U list origin.
 * This is the main entry point for creating channel buttons on initial load.
 * @returns {void}
 */
export const createChannelButtons = () => {
    try {
        const groupedChannels = groupChannelsByOrigin();
        renderButtonsInContainers(groupedChannels, MAIN_BUTTON_CONTAINER_IDS);
        assignButtonEvents();

        for (const PREFIX of ID_PREFIX_CONTAINERS_CHANNELS) {
            saveOriginalOrder(`${PREFIX}-channels-buttons-container`);
        }
    } catch (error) {
        console.error(`[teles] Error creating channel buttons. Error: ${error}`);
        showToast({
            title: 'Ha ocurrido un error durante la creación de botones para los canales.',
            body: `Error: ${error}`,
            type: 'danger',
            autohide: false,
            delay: 0,
            showReloadOnError: true
        });

        for (const PREFIX of ID_PREFIX_CONTAINERS_CHANNELS) {
            document.querySelector(`#${PREFIX}-channels-buttons-container`)
                ?.insertAdjacentElement('afterend', insertarDivError(error, 'Ha ocurrido un error durante la creación de botones para los canales'));
        }
    }
};

/**
 * Renders channel buttons in the "Change channel" modal container on demand.
 * @returns {void}
 */
export const createButtonsForChangeChannelModal = () => {
    try {
        const groupedChannels = groupChannelsByOrigin();
        renderButtonsInContainers(groupedChannels, ['#modal-cambiar-canal-channels-buttons-container']);
        assignButtonEvents();
        saveOriginalOrder('modal-cambiar-canal-channels-buttons-container');
    } catch (error) {
        console.error('[teles] Error creating buttons for "Change channel" modal:', error);
    }
};

/**
 * Renders channel buttons in the Single View selection container on demand.
 * @returns {void}
 */
export const createButtonsForSingleView = () => {
    try {
        const groupedChannels = groupChannelsByOrigin();
        renderButtonsInContainers(groupedChannels, ['#single-view-channels-buttons-container']);
        assignButtonEvents();
        saveOriginalOrder('single-view-channels-buttons-container');
    } catch (error) {
        console.error('[teles] Error creating buttons for Single View:', error);
    }
};