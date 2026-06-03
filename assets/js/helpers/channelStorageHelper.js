import { channelsList } from "../channelManager.js";
import { showToast } from "../helpers/index.js";
import { LS_KEY_ACTIVE_VIEW_MODE, LS_KEY_SAVED_CHANNELS_GRID_VIEW } from "../constants/index.js";
import { gridViewContainer, freeViewContainer } from "../main.js";
import { debounce } from "../utils/index.js";
import { createActiveChannelsStoragePayload } from "./activeChannelsStorage.js";

/**
 * Saves the list of currently active channels in the grid view to local storage.
 * Does not execute if the active view mode is 'single-view'.
 * Only saves if there are active channels present.
 * Shows a brief success alert upon saving.
 *
 * @returns {void}
 */
export const saveChannelsToLocalStorage = () => {
    try {
        // Do not execute if in single-view mode
        if (localStorage.getItem(LS_KEY_ACTIVE_VIEW_MODE) === 'single-view') {
            return;
        }

        // Use the correct container depending on current view mode
        const viewMode = localStorage.getItem(LS_KEY_ACTIVE_VIEW_MODE) || 'grid-view';
        const activeContainer = viewMode === 'free-view' ? freeViewContainer : gridViewContainer;
        const activeChannelsInDom = activeContainer.querySelectorAll('div[data-canal]');
        const channelsToSave = [];

        activeChannelsInDom.forEach(channelDiv => {
            const channelId = channelDiv.dataset.canal;
            const channelData = channelId && channelsList[channelId];
            if (!channelData || !channelData.name) {
                return; // Ignore channels not defined in channelsList
            }
            channelsToSave.push({
                id: channelId,
                name: channelData.name
            });
        });

        // If there are active channels in DOM but nothing valid to save, do not save (prevents saving empty state incorrectly)
        if (activeChannelsInDom.length > 0 && channelsToSave.length === 0) {
            return;
        }

        // If DOM is empty (length 0), save an empty ordered payload. Correct for "saving empty state".
        localStorage.setItem(LS_KEY_SAVED_CHANNELS_GRID_VIEW, JSON.stringify(createActiveChannelsStoragePayload(channelsToSave)));

        const alertElement = document.querySelector('#alerta-guardado-canales');
        if (alertElement) {
            alertElement.classList.remove('d-none');
            setTimeout(() => {
                alertElement.classList.add('d-none');
            }, 420);
        }
    } catch (error) {
        console.error('[teles] Error attempting to save channels to local storage:', error);
        showToast({
            title: 'Error al intentar guardar canales en el almacenamiento local.',
            body: `Error: ${error}`,
            type: 'danger',
            autohide: false,
            delay: 0,
            showReloadOnError: true
        });
    }
}

/**
 * Debounced version of saveChannelsToLocalStorage.
 * Batches rapid successive calls into a single localStorage write (300ms window).
 * Use this for per-action saves (tele.add, tele.remove, drag, etc.).
 * @type {() => void}
 */
export const saveChannelsToLocalStorageDebounced = debounce(saveChannelsToLocalStorage, 300);
