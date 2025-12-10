import { crearFragmentCanal } from "../canalUI.js";
import { channelsList } from "../channelManager.js";
import {
    AMBIENT_MUSIC,
    CSS_CLASS_BUTTON_PRIMARY,
    CSS_CLASS_BUTTON_SECONDARY,
    LS_KEY_ACTIVE_VIEW_MODE,
    LS_KEY_HORIZONTAL_WIDTH_VALUE,
    LS_KEY_SAVED_CHANNELS_GRID_VIEW
} from "../constants/index.js";

import {
    gridViewContainerEl,
    singleViewContainerEl,
    tele,
    widthRangeInputEl,
    widthRangeValueEl,
    checkboxElFullHeight,
    spanElFullHeight,
    spanElNumberChannelsPerRow,
    buttonsNumberChannelsPerRow,
    aplicarEstadoUrlDinamica,
    isDynamicUrlMode,
    checkboxElDynamicUrl,
    spanElDynamicUrlValue
} from "../main.js";

import {
    showToast,
    adjustChannelButtonClass,
    hideOverlayButtonText,
    adjustBootstrapColumnClasses,
    registerManualChannelChange,
    clearSharedUrlParameter,
    cleanTransmissionResources,
    createButtonsForSingleView,
    loadSingleViewOrder,
    adjustVisibilityButtonsRemoveAllActiveChannels
} from "./index.js";

import {
    obtainNumberOfChannelsPerRow,
    initializeBootstrapTooltips,
    disposeBootstrapTooltips
} from "../utils/index.js";

/** @type {HTMLButtonElement|null} Button to copy share setup link */
const COPY_SHARE_LINK_BUTTON = document.querySelector('#boton-copiar-enlace-compartir-setup');

/** @type {HTMLInputElement|null} Input field for share setup link */
const SHARE_LINK_INPUT = document.querySelector('#input-enlace-compartir-setup');

/**
 * Disables grid view-specific controls when switching to single view mode.
 * Updates UI elements to indicate they are unavailable in single view.
 * @returns {void}
 */
const disableGridViewControls = () => {
    // Disable dynamic URL controls
    if (checkboxElDynamicUrl) {
        checkboxElDynamicUrl.disabled = true;
    }
    if (spanElDynamicUrlValue) {
        spanElDynamicUrlValue.dataset.textoPrevio = spanElDynamicUrlValue.textContent || '';
        spanElDynamicUrlValue.textContent = '[solo en visión cuadrícula]';
    }

    // Disable share setup controls
    COPY_SHARE_LINK_BUTTON?.setAttribute('disabled', 'disabled');
    SHARE_LINK_INPUT?.setAttribute('disabled', 'disabled');

    // Disable width range controls
    widthRangeInputEl.disabled = true;
    widthRangeValueEl.textContent = 'Deshabilitado';

    // Disable full height controls
    checkboxElFullHeight.disabled = true;
    spanElFullHeight.textContent = 'Deshabilitado';

    // Disable channels per row buttons
    buttonsNumberChannelsPerRow.forEach(btn => { btn.disabled = true; });
    spanElNumberChannelsPerRow.innerHTML = 'Deshabilitado';
};

/**
 * Enables grid view-specific controls when switching back from single view mode.
 * Restores UI elements to their previous or default state.
 * @returns {void}
 */
const enableGridViewControls = () => {
    // Enable dynamic URL controls
    if (checkboxElDynamicUrl) {
        checkboxElDynamicUrl.disabled = false;
    }
    if (spanElDynamicUrlValue) {
        const previousText = spanElDynamicUrlValue.dataset.textoPrevio;
        if (previousText) {
            spanElDynamicUrlValue.textContent = previousText;
        } else {
            aplicarEstadoUrlDinamica(isDynamicUrlMode);
        }
    }

    // Enable share setup controls
    COPY_SHARE_LINK_BUTTON?.removeAttribute('disabled');
    SHARE_LINK_INPUT?.removeAttribute('disabled');

    // Enable width range controls
    widthRangeInputEl.disabled = false;
    widthRangeValueEl.textContent = JSON.parse(localStorage.getItem(LS_KEY_HORIZONTAL_WIDTH_VALUE)) ?? 100;

    // Enable full height controls
    checkboxElFullHeight.disabled = false;
    spanElFullHeight.textContent = checkboxElFullHeight.checked ? 'Expandido' : 'Reducido';

    // Enable channels per row buttons
    buttonsNumberChannelsPerRow.forEach(btn => { btn.disabled = false; });
    spanElNumberChannelsPerRow.innerHTML = `${obtainNumberOfChannelsPerRow()}`;
};

/**
 * Updates floating buttons visibility and styling for single view mode.
 * @param {boolean} isSingleView - Whether entering single view mode
 * @returns {void}
 */
const updateFloatingButtonsForViewMode = (isSingleView) => {
    const floatingButtonsContainer = document.querySelector('#grupo-botones-flotantes');
    if (!floatingButtonsContainer) return;

    const indigoButton = floatingButtonsContainer.querySelector('.btn-indigo');
    const lightSubtleDiv = floatingButtonsContainer.querySelector('div.bg-light-subtle');
    const darkButton = floatingButtonsContainer.querySelector('.btn-dark');

    if (isSingleView) {
        indigoButton?.classList.add('d-none');
        lightSubtleDiv?.classList.add('d-none');
        darkButton?.classList.replace('rounded-end-5', 'rounded-pill');
    } else {
        indigoButton?.classList.remove('d-none');
        lightSubtleDiv?.classList.remove('d-none');
        darkButton?.classList.replace('rounded-pill', 'rounded-end-5');
    }
};

/**
 * Updates navigation elements visibility based on view mode.
 * @param {boolean} isSingleView - Whether entering single view mode
 * @returns {void}
 */
const updateNavigationForViewMode = (isSingleView) => {
    const navButtonGroup = document.querySelector('nav .btn-group');
    const navGradientLink = document.querySelector('nav a.gradient-text');

    if (isSingleView) {
        navButtonGroup?.classList.add('d-none');
        navGradientLink?.classList.remove('d-none');
    } else {
        navButtonGroup?.classList.remove('d-none');
        navGradientLink?.classList.add('d-none');
    }
};

/**
 * Backs up active channels in grid view by clearing their content
 * and storing their IDs for later restoration.
 * @returns {void}
 */
const backupActiveChannels = () => {
    const activeChannelsInDOM = gridViewContainerEl.querySelectorAll('div[data-canal]');

    activeChannelsInDOM.forEach(channelDiv => {
        // Clear HTML instead of removing to avoid triggering observer
        channelDiv.innerHTML = '';
        channelDiv.dataset.respaldo = channelDiv.dataset.canal;
        channelDiv.dataset.canal = `no-${channelDiv.dataset.canal}`;
    });
};

/**
 * Restores backed up channels from grid view, recreating their content.
 * @returns {number} Number of channels restored
 */
const restoreBackedUpChannels = () => {
    const activeChannelsInDOM = gridViewContainerEl.querySelectorAll('div[data-canal]');

    activeChannelsInDOM.forEach(channelDiv => {
        channelDiv.dataset.canal = channelDiv.dataset.respaldo;
        channelDiv.append(crearFragmentCanal(channelDiv.dataset.canal));
        adjustChannelButtonClass(channelDiv.dataset.canal, true);
        initializeBootstrapTooltips();
        hideOverlayButtonText();
        channelDiv.removeAttribute('data-respaldo');
    });

    return activeChannelsInDOM.length;
};

/**
 * Resets channel button styles in single view and change channel modal.
 * Changes buttons from primary to secondary style.
 * @returns {void}
 */
const resetChannelButtonStyles = () => {
    const channelButtons = document.querySelectorAll(
        '#single-view-channels-buttons-container button, #modal-cambiar-canal-channels-buttons-container button'
    );

    channelButtons.forEach(button => {
        button.classList.replace(CSS_CLASS_BUTTON_PRIMARY, CSS_CLASS_BUTTON_SECONDARY);
    });
};

/**
 * Loads the first saved channel in single view mode.
 * @returns {void}
 */
const loadFirstSavedChannel = () => {
    const savedChannels = JSON.parse(localStorage.getItem(LS_KEY_SAVED_CHANNELS_GRID_VIEW)) || {};
    const channelIds = Object.keys(savedChannels);

    if (channelIds.length > 0) {
        try {
            const firstChannelId = channelIds[0];
            if (channelsList[firstChannelId]) {
                tele.add(firstChannelId);
            }
        } catch (error) {
            console.error(`Error loading channels for single view mode. Error: ${error}`);
        }
    }
};

/**
 * Activates single view mode, switching from grid view.
 * Backs up active channels, disables grid-specific controls,
 * and loads the first channel in single view.
 * @returns {void}
 */
export function activateSingleView() {
    try {
        // Stop ambient music playback controls if music is playing
        if (!AMBIENT_MUSIC.paused) {
            adjustVisibilityButtonsRemoveAllActiveChannels();
        }

        // Initialize single view channel buttons if not already present
        loadSingleViewOrder();
        const singleViewButtonsContainer = document.querySelector('#single-view-channels-buttons-container');
        if (singleViewButtonsContainer && !singleViewButtonsContainer.querySelector('button[data-canal]')) {
            createButtonsForSingleView();
        }

        localStorage.setItem(LS_KEY_ACTIVE_VIEW_MODE, 'single-view');

        // In single view, clear any shared parameter `c` and disable grid-specific controls
        clearSharedUrlParameter(true);
        disableGridViewControls();

        resetChannelButtonStyles();
        backupActiveChannels();

        // Toggle view containers visibility
        gridViewContainerEl.classList.add('d-none');
        singleViewContainerEl.classList.remove('d-none');

        updateNavigationForViewMode(true);
        updateFloatingButtonsForViewMode(true);

        loadFirstSavedChannel();

        // Add empty class for CSS media query purposes
        document.querySelector('#boton-personalizar-boton-mover-overlay')?.classList.add('clase-vacia');

    } catch (error) {
        console.error(`Error activating "Single View" mode. Error: ${error}`);
        showToast({
            title: 'Ha ocurrido un error al intentar activar el modo "Visión Única".',
            body: `Error: ${error}`,
            type: 'danger',
            autohide: false,
            delay: 0,
            showReloadOnError: true
        });
    }
}

/**
 * Deactivates single view mode, returning to grid view.
 * Restores backed up channels and re-enables grid-specific controls.
 * @param {Object} [options={}] - Configuration options
 * @param {boolean} [options.skipDefaultChannelsLoad=false] - If true, skips loading default channels when no backed up channels exist
 * @returns {void}
 */
export function deactivateSingleView({ skipDefaultChannelsLoad = false } = {}) {
    try {
        localStorage.setItem(LS_KEY_ACTIVE_VIEW_MODE, 'grid-view');

        // Remove active channel from single view
        const activeChannelInSingleView = singleViewContainerEl.querySelector('div[data-canal]');
        const activeChannelId = activeChannelInSingleView?.dataset.canal;

        // Alternative to tele.remove() to avoid saving empty string to localStorage
        try {
            if (activeChannelInSingleView !== null) {
                cleanTransmissionResources(activeChannelInSingleView);
                disposeBootstrapTooltips();
                activeChannelInSingleView.remove();
            }

            adjustChannelButtonClass(activeChannelId, false);
            initializeBootstrapTooltips();
            registerManualChannelChange();
        } catch (error) {
            console.error(`Error removing active channel in "Single View" mode. Error: ${error}`);
            showToast({
                title: 'Ha ocurrido un error durante eliminación de canal activo en modo "Visión Única".',
                body: `Error: ${error}`,
                type: 'danger',
                autohide: false,
                delay: 0,
                showReloadOnError: true
            });
            return;
        }

        // Restore backed up channels or load defaults
        const restoredChannelsCount = restoreBackedUpChannels();

        if (restoredChannelsCount === 0) {
            if (!skipDefaultChannelsLoad) {
                tele.cargaCanalesPredeterminados();
            }
            adjustVisibilityButtonsRemoveAllActiveChannels();
        }

        // Toggle view containers visibility
        gridViewContainerEl.classList.remove('d-none');
        singleViewContainerEl.classList.add('d-none');

        updateNavigationForViewMode(false);
        updateFloatingButtonsForViewMode(false);
        enableGridViewControls();
        adjustBootstrapColumnClasses();

        // Remove empty class used for CSS media query
        document.querySelector('#boton-personalizar-boton-mover-overlay')?.classList.remove('clase-vacia');

        registerManualChannelChange({ force: true });

    } catch (error) {
        console.error(`Error deactivating "Single View" mode. Error: ${error}`);
        showToast({
            title: 'Ha ocurrido un error al intentar desactivar el modo "Visión Única".',
            body: `Error: ${error}`,
            type: 'danger',
            autohide: false,
            delay: 0,
            showReloadOnError: true
        });
    }
}