import { channelsList } from "../channelManager.js";
import { showToast } from "../helpers/index.js";
import { LS_KEY_ACTIVE_VIEW_MODE, LS_KEY_SAVED_CHANNELS_GRID_VIEW } from "../constants/index.js";
import { gridViewContainer } from "../main.js";

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

        const activeChannelsInDom = gridViewContainer.querySelectorAll('div[data-canal]');
        const channelsToSave = {};

        activeChannelsInDom.forEach(channelDiv => {
            const channelId = channelDiv.dataset.canal;
            const channelData = channelId && channelsList[channelId];
            if (!channelData || !channelData.nombre) {
                return; // Ignore channels not defined in channelsList
            }
            channelsToSave[channelId] = channelData.nombre;
        });

        // If there are active channels in DOM but nothing valid to save, do not save (prevents saving empty state incorrectly)
        if (activeChannelsInDom.length > 0 && Object.keys(channelsToSave).length === 0) {
            return;
        }

        // If DOM is empty (length 0), we proceed to save the empty object. So it saves `{}` to LS. Correct for "saving empty state".
        localStorage.setItem(LS_KEY_SAVED_CHANNELS_GRID_VIEW, JSON.stringify(channelsToSave));

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
