import { channelsList, DEFAULT_SOURCE_ORIGIN } from "../channelManager.js";
import { CSS_CLASS_BUTTON_PRIMARY, CSS_CLASS_BUTTON_SECONDARY, COUNTRY_CODES, CATEGORIES_ICONS, ID_PREFIX_CONTAINERS_CHANNELS, LS_KEY_SHOW_CHANNELS_LOGO } from "../constants/index.js";
import { singleViewVideoContainer, tele } from "../main.js";
import { showToast, areAllSignalsEmpty, saveOriginalOrder, replaceActiveChannel, getActiveChannelIds, normalizeInput } from "./index.js";
import { getFavoriteChannels, toggleFavoriteChannel } from "./favoritesManager.js";


/** @type {string} SVG placeholder for channels with unknown country */
const SVG_UNKNOWN_COUNTRY = `
<svg width="24" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
    <rect width="16" height="16" rx="2" fill="#e0e0e0"/>
    <rect x="2" y="2" width="12" height="12" rx="1" fill="#bdbdbd"/>
    <text x="8" y="11" text-anchor="middle" font-size="8" fill="#757575">?</text>
</svg>
`;

const escapeHtml = (str) => String(str ?? '').replace(/[&<>"']/g, (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' })[m]);

const FLAG_CACHE_PREFIX = '_tflag_';

const fetchingFlags = new Set();

const resolveFlagSrc = (countryLower) => {
    const key = `${FLAG_CACHE_PREFIX}${countryLower}`;
    try {
        const cached = localStorage.getItem(key);
        if (cached) return cached;
    } catch { }
    if (!fetchingFlags.has(countryLower)) {
        fetchingFlags.add(countryLower);
        const url = `https://flagcdn.com/${countryLower}.svg`;
        const doFetch = () => {
            try { if (localStorage.getItem(key)) return; } catch { return; }
            fetch(url).then(r => { if (r.ok) return r.text() }).then(svg => {
                if (!svg) return;
                const dataUri = `data:image/svg+xml,${encodeURIComponent(svg)}`;
                try { localStorage.setItem(key, dataUri) } catch { }
            }).catch(() => { });
        };
        if (document.readyState === 'complete') doFetch();
        else addEventListener('load', doFetch, { once: true });
    }
    return `https://flagcdn.com/${countryLower}.svg`;
};

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
            const modal = document.querySelector('#modal-cambiar-canal');
            const previousChannel = modal?.dataset.channelSource;
            if (!previousChannel) {
                console.warn('[teles] There is no channel selected to replace in the "Change channel" modal.');
                return;
            }
            replaceActiveChannel(channelId, previousChannel);
            if (typeof bootstrap !== 'undefined' && bootstrap.Modal) {
                bootstrap.Modal.getInstance(modal)?.hide();
            }
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
        delegateEvents: true
    },
    {
        selector: '#single-view-channels-buttons-container',
        scenario: 'single-view',
        delegateEvents: true
    }
];

/**
 * Groups channels by their list origin for creating visible blocks.
 * Favorites are shown first as a special group.
 * @returns {[string, {id: string, data: Object}[]][], Set<string>} Array of [origin, channels] tuples and the favorites Set
 */
const groupChannelsByOrigin = () => {
    const groups = new Map();
    const favoriteChannels = getFavoriteChannels();
    const favoriteChannelsSet = new Set(favoriteChannels);

    // First pass: separate favorites from regular channels
    const favorites = [];
    const regularChannels = {};

    for (const channelId of Object.keys(channelsList)) {
        const data = channelsList[channelId];
        
        if (favoriteChannelsSet.has(channelId)) {
            // Add to favorites maintaining the saved order
            favorites.push({ id: channelId, data });
        } else {
            // Group by origin
            const origin = data?.listOrigin ?? DEFAULT_SOURCE_ORIGIN;
            if (!regularChannels[origin]) {
                regularChannels[origin] = [];
            }
            regularChannels[origin].push({ id: channelId, data });
        }
    }

    // If there are favorites, add them as the first group
    if (favorites.length > 0) {
        groups.set('<i class="bi bi-star-fill" style="color: #ffc107;"></i> Favoritos', favorites);
    }

    // Add regular channels grouped by origin
    const sortedOrigins = Object.keys(regularChannels).sort((a, b) => 
        a.localeCompare(b, 'es', { sensitivity: 'base' })
    );

    sortedOrigins.forEach(origin => {
        groups.set(origin, regularChannels[origin]);
    });

    return [Array.from(groups.entries()), favoriteChannelsSet];
};

/**
 * Renders channel groups into one or more containers.
 * @param {[string, {id: string, data: Object}[]][]} groups - Grouped channels by origin
 * @param {string[]} selectors - CSS selectors for target containers
 * @param {string[]} activeChannelIds - List of currently active channel IDs
 * @returns {void}
 */
const renderButtonsInContainers = (groups, selectors = [], activeChannelIds = [], favoriteChannelsSet = new Set()) => {
    selectors.forEach(selector => {
        const container = document.querySelector(selector);
        if (!container) return;

        container.innerHTML = '';
        const baseId = container.id || selector.replace('#', '') || 'grupo-canales';
        const fragment = buildChannelsFragment(groups, { baseId }, activeChannelIds, favoriteChannelsSet);
        container.append(fragment);
    });
};

/**
 * Builds a reusable DOM fragment containing grouped channel buttons.
 * @param {[string, {id: string, data: Object}[]][]} groups - Grouped channels
 * @param {Object} [options={}] - Configuration options
 * @param {string} [options.baseId='grupo-canales'] - Base ID for collapse elements
 * @param {string[]} activeChannelIds - List of currently active channel IDs
 * @returns {DocumentFragment} Fragment ready to be appended
 */
const buildChannelsFragment = (groups, { baseId = 'grupo-canales' } = {}, activeChannelIds = [], favoriteChannelsSet = new Set()) => {
    const fragment = document.createDocumentFragment();
    // Performance: read localStorage once here instead of once per button (N reads → 1 read)
    const showLogos = localStorage.getItem(LS_KEY_SHOW_CHANNELS_LOGO) === 'show';
    // Performance: use Set for O(1) lookups instead of array .includes() O(N)
    const activeSet = new Set(activeChannelIds);

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
            list.append(createChannelButton(id, data, activeSet, showLogos, favoriteChannelsSet));
        });

        const collapse = document.createElement('div');
        collapse.classList.add('mt-1', 'show', 'collapse');
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
 * @param {string[]} activeChannelIds - List of currently active channel IDs
 * @param {boolean} [showLogos=false] - Whether to show channel logos (read once by caller)
 * @returns {HTMLButtonElement} The created button element
 */
const createChannelButton = (channelId, channelData, activeChannelIds = [], showLogos = false, favoriteChannelsSet = new Set()) => {
    const { name, country } = channelData;
    const category = (channelData.category ?? '').toLowerCase();
    const categoryIcon = category && category in CATEGORIES_ICONS
        ? CATEGORIES_ICONS[category]
        : '<i class="bi bi-tv"></i>';

    const countryLower = country?.toLowerCase();
    const countryName = countryLower && COUNTRY_CODES[countryLower]
        ? COUNTRY_CODES[countryLower]
        : 'Desconocido';

    const combinedSources = Array.isArray(channelData?.combinedSources)
        ? channelData.combinedSources.filter(Boolean)
        : [];
    const isCombinedSignal = channelData?.isCombinedSignal === true && combinedSources.length > 1;
    const sourcesDescription = combinedSources.length > 0
        ? combinedSources.join(', ')
        : 'fuentes múltiples';

    const combinedBadge = isCombinedSignal
        ? `<span class="badge badge-señal-combinada" data-bs-toggle="tooltip" data-bs-title="Señales desde: ${sourcesDescription}"><i class="bi bi-shuffle"></i> Mix</span>`
        : '';

    const isFavorited = favoriteChannelsSet.has(channelId);
    const starIcon = isFavorited
        ? '<i class="bi bi-star-fill" style="color: #ffc107;"></i>'
        : '<i class="bi bi-star" style="opacity: 0.5;"></i>';

    const button = document.createElement('button');
    button.setAttribute('data-canal', channelId);
    button.setAttribute('data-country', countryName);
    button.setAttribute('data-category', category || 'undefined');
    // Precompute normalized search text so filterChannelsByInput avoids per-keystroke NFD normalization
    button.dataset.normalized = normalizeInput(`${countryName} - ${name}`);

    if (isCombinedSignal) {
        button.classList.add('canal-combinado');
        button.dataset.combinedSources = sourcesDescription;
    }

    button.type = 'button';
    const isActive = activeChannelIds.has(channelId);
    const initialClass = isActive ? CSS_CLASS_BUTTON_PRIMARY : CSS_CLASS_BUTTON_SECONDARY;
    button.classList.add('btn', 'btn-sm', initialClass, 'd-flex', 'align-items-center', 'gap-2', 'rounded-3', 'w-100', 'text-start', 'btn-canal');

    if (areAllSignalsEmpty(channelId)) {
        button.classList.add('d-none');
    }

    const flagHtml = countryLower && COUNTRY_CODES[countryLower]
        ? `<img src="${resolveFlagSrc(countryLower)}" alt="bandera ${escapeHtml(countryName)}" title="${escapeHtml(countryName)}" class="svg-bandera rounded-1" loading="lazy" decoding="async" fetchpriority="low">`
        : `<span class="svg-bandera rounded-1 h-100" title="Sin bandera para país [${escapeHtml(countryName)}]">${SVG_UNKNOWN_COUNTRY}</span>`;

    const logoHtml = channelData.logo
        ? `<img src="${channelData.logo}" alt="logo ${escapeHtml(name)}" class="logo-canal-boton rounded-1 me-1" loading="lazy" onerror="this.style.display='none'">`
        : '';

    button.innerHTML = `
        ${logoHtml}
        <span class="flex-grow-1 text-truncate">${escapeHtml(name)}</span>
        ${flagHtml}
        ${categoryIcon}
        <span class="btn-favorite p-1 ms-auto" data-canal-favorite="${channelId}" title="${isFavorited ? 'Quitar de favoritos' : 'Añadir a favoritos'}" style="cursor: pointer; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
            ${starIcon}
        </span>
        ${combinedBadge}`;

    const flagImg = button.querySelector('img.svg-bandera');
    if (flagImg) {
        flagImg.addEventListener('error', () => {
            if (!flagImg.isConnected) return;
            const fallback = document.createElement('span');
            fallback.className = 'svg-bandera rounded-1 h-100';
            fallback.title = flagImg.title;
            fallback.innerHTML = SVG_UNKNOWN_COUNTRY;
            flagImg.replaceWith(fallback);
        }, { once: true });
    }

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
        registerDelegatedEvents(container, config.scenario);
    });
};

/**
 * Moves a channel button between groups (Favorites ↔ origin) across all containers.
 * Performs surgical DOM updates without full re-render, preserving filter state.
 * @param {string} channelId - The channel to move
 * @param {boolean} isFavorited - Whether the channel was just favorited
 * @returns {void}
 */
const moveChannelButton = (channelId, isFavorited) => {
    const FAVORITES_LABEL = '<i class="bi bi-star-fill" style="color: #ffc107;"></i> Favoritos';
    const channelData = channelsList[channelId];
    const origin = channelData?.listOrigin ?? DEFAULT_SOURCE_ORIGIN;

    for (const config of BUTTON_CONTAINER_CONFIG) {
        const container = document.querySelector(config.selector);
        if (!container) continue;

        const button = container.querySelector(`button[data-canal="${channelId}"]`);
        if (!button) continue;

        const sourceGroup = button.closest('.grupo-canales-origen');
        const targetOrigin = isFavorited ? FAVORITES_LABEL : origin;

        // Find existing target group
        let targetGroup = null;
        const allGroups = container.querySelectorAll('.grupo-canales-origen');
        for (const group of allGroups) {
            if (group.dataset.origenLista === targetOrigin) {
                targetGroup = group;
                break;
            }
        }

        if (targetGroup) {
            // Move button to existing target group
            const targetList = targetGroup.querySelector('.modal-body-canales');
            if (targetList) {
                targetList.append(button);
            }
        } else {
            // Create new group
            targetGroup = createGroup(targetOrigin, container.id);
            const targetList = targetGroup.querySelector('.modal-body-canales');
            if (targetList) {
                targetList.append(button);
            }
            // Insert favorites group at the top, origin groups in sorted position
            if (isFavorited) {
                container.prepend(targetGroup);
            } else {
                const firstRegularGroup = Array.from(allGroups).find(g =>
                    g.dataset.origenLista !== FAVORITES_LABEL
                );
                if (firstRegularGroup) {
                    container.insertBefore(targetGroup, firstRegularGroup);
                } else {
                    container.append(targetGroup);
                }
            }
        }

        // Update counts
        updateGroupCount(targetGroup);
        if (sourceGroup && sourceGroup !== targetGroup) {
            updateGroupCount(sourceGroup);
            // Remove source group if empty
            const sourceList = sourceGroup.querySelector('.modal-body-canales');
            if (sourceList && sourceList.children.length === 0) {
                sourceGroup.remove();
            }
        }
    }
};

/**
 * Creates a new channel group DOM structure.
 * @param {string} origin - The origin label for the group
 * @param {string} baseId - Base ID for generating collapse IDs
 * @returns {HTMLDivElement} The created group wrapper
 */
const createGroup = (origin, baseId = 'grupo-canales') => {
    const collapseId = `${baseId}-origen-${Date.now()}`;

    const wrapper = document.createElement('div');
    wrapper.classList.add('grupo-canales-origen', 'mb-2', 'p-2', 'rounded-3', 'border', 'border-light-subtle', 'bg-dark-subtle');
    wrapper.setAttribute('data-origen-lista', origin);

    const header = document.createElement('div');
    header.classList.add('d-flex', 'align-items-center', 'gap-1', 'flex-wrap');
    header.setAttribute('data-bs-toggle', 'collapse');
    header.setAttribute('data-bs-target', `#${collapseId}`);
    header.setAttribute('role', 'button');
    header.setAttribute('aria-expanded', 'true');
    header.setAttribute('aria-controls', collapseId);
    header.innerHTML = `
        <p class="badge rounded-pill text-bg-secondary text-wrap mb-0 w-100">${origin}</p>
        <small class="text-secondary">0 canales</small>
        <i class="bi bi-chevron-up ms-auto icono-estado-colapso"></i>
    `;

    const list = document.createElement('div');
    list.classList.add('modal-body-canales');

    const collapse = document.createElement('div');
    collapse.classList.add('mt-1', 'show', 'collapse');
    collapse.id = collapseId;
    collapse.append(list);

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
    return wrapper;
};

/**
 * Updates the channel count badge in a group header.
 * @param {HTMLDivElement} group - The group wrapper element
 * @returns {void}
 */
const updateGroupCount = (group) => {
    if (!group) return;
    const list = group.querySelector('.modal-body-canales');
    const countEl = group.querySelector('small.text-secondary');
    if (list && countEl) {
        countEl.textContent = `${list.children.length} canales`;
    }
};

/**
 * Initializes event handlers for favorite star buttons.
 * Uses event delegation to handle dynamically created buttons.
 * @returns {void}
 */
/**
 * Configures event delegation for dynamic containers.
 * @param {HTMLElement} container - Container element
 * @param {keyof typeof BUTTON_SCENARIOS} scenarioKey - Scenario identifier
 * @returns {void}
 */
const registerDelegatedEvents = (container, scenarioKey) => {
    container.addEventListener('click', (event) => {
        const favoriteButton = event.target.closest('span.btn-favorite');
        if (favoriteButton && container.contains(favoriteButton)) {
            event.stopPropagation();
            event.preventDefault();

            const channelId = favoriteButton.dataset.canalFavorite;
            if (!channelId) return;

            const wasAdded = toggleFavoriteChannel(channelId);

            const icon = favoriteButton.querySelector('i');
            if (icon) {
                icon.className = wasAdded
                    ? 'bi bi-star-fill'
                    : 'bi bi-star';
                icon.style.color = wasAdded ? '#ffc107' : '';
                icon.style.opacity = wasAdded ? '1' : '0.5';
            }

            favoriteButton.title = wasAdded
                ? 'Quitar de favoritos'
                : 'Añadir a favoritos';

            moveChannelButton(channelId, wasAdded);
            return;
        }

        const button = event.target.closest('button[data-canal]');
        if (!button || !container.contains(button)) return;

        handleButtonSelection(button, scenarioKey);
    });
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

/** @type {Set<string>} Tracks containers that have already been rendered. */
let renderedContainers = new Set();

/**
 * Clears the tracking of rendered containers.
 * Use this when a full re-render of all channel buttons is required.
 * @returns {void}
 */
export const clearRenderedContainers = () => {
    renderedContainers.clear();
};

/**
 * Renders channel buttons grouped by M3U list origin.
 * This is the main entry point for creating channel buttons.
 * Optional param allows rendering only for a specific container (lazy load).
 * @param {string} [specificPrefix] - Optional prefix to render only one container.
 * @returns {void}
 */
export const createChannelButtons = (specificPrefix) => {
    if (!channelsList) {
        console.warn('[teles] Cannot create channel buttons: channelsList is not loaded');
        renderChannelLoadError(specificPrefix);
        return;
    }
    try {
        const [groupedChannels, favoriteChannelsSet] = groupChannelsByOrigin();
        const targets = specificPrefix ? [specificPrefix] : ID_PREFIX_CONTAINERS_CHANNELS;
        const activeChannelIds = getActiveChannelIds();

        targets.forEach(prefix => {
            const containerId = `${prefix}-channels-buttons-container`;
            if (renderedContainers.has(containerId)) return;

            renderButtonsInContainers(groupedChannels, [`#${containerId}`], activeChannelIds, favoriteChannelsSet);
            renderedContainers.add(containerId);
            saveOriginalOrder(containerId);
        });

        assignButtonEvents();
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

        const targets = specificPrefix ? [specificPrefix] : ID_PREFIX_CONTAINERS_CHANNELS;
        for (const PREFIX of targets) {
            document.querySelector(`#${PREFIX}-channels-buttons-container`)
                ?.insertAdjacentElement('afterend', insertarDivError(error, 'Ha ocurrido un error durante la creación de botones para los canales'));
        }
    }
};

const renderChannelLoadError = (specificPrefix) => {
    const targets = specificPrefix ? [specificPrefix] : ID_PREFIX_CONTAINERS_CHANNELS;
    targets.forEach(prefix => {
        const container = document.getElementById(`${prefix}-channels-buttons-container`);
        if (!container || renderedContainers.has(container.id)) return;

        const wrapper = document.createElement('div');
        wrapper.className = 'd-flex flex-column align-items-center justify-content-center p-4 text-center text-wrap';
        wrapper.style.minHeight = '200px';
        wrapper.innerHTML = `
            <i class="bi bi-exclamation-triangle fs-1 text-danger mb-3"></i>
            <h6 class="text-danger fw-bold mb-2">No se pudieron cargar los canales</h6>
            <p class="text-secondary small mb-3">
                Error al obtener la lista de canales desde el servidor.
            </p>
            <div class="d-flex gap-2 flex-wrap justify-content-center">
                <button class="btn btn-outline-danger btn-sm rounded-pill reload-btn">
                    <i class="bi bi-arrow-clockwise"></i> Recargar p&aacute;gina
                </button>
                <a class="btn btn-outline-secondary btn-sm rounded-pill"
                   href="https://github.com/Alplox/teles/issues"
                   target="_blank" rel="noopener">
                    <i class="bi bi-github"></i> Reportar en GitHub
                </a>
            </div>`;
        wrapper.querySelector('.reload-btn').addEventListener('click', () => location.reload());
        container.appendChild(wrapper);
        renderedContainers.add(container.id);
    });
};

const insertarDivError = (error, message) => {
    const div = document.createElement('div');
    div.className = 'alert alert-danger';
    div.textContent = `${message}: ${error}`;
    return div;
}

/**
 * Renders channel buttons in the "Change channel" modal container on demand.
 * @returns {void}
 */
export const createButtonsForChangeChannelModal = () => {
    createChannelButtons('modal-cambiar-canal');
};

/**
 * Renders channel buttons in the Single View selection container on demand.
 * @returns {void}
 */
export const createButtonsForSingleView = () => {
    createChannelButtons('single-view');
};
