import { channelsList } from "../channelManager.js";
import { gridViewContainerEl } from "../main.js";
import { showToast } from "../helpers/index.js";
import { LS_KEY_ACTIVE_VIEW_MODE, LS_KEY_SAVED_CHANNELS_GRID_VIEW } from "../constants/index.js";

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

        const activeChannelsInDom = gridViewContainerEl.querySelectorAll('div[data-canal]');
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
        // However, if DOM is empty, we probably want to save empty object to clear LS?
        // Original logic: "si no hay canales activos en DOM no guardar" (check original: if (CANALES_ACTIVOS_EN_DOM.length > 0 && Object.keys(lsCanales).length === 0))
        // This implies: if we found elements but none were valid, don't save.
        if (activeChannelsInDom.length > 0 && Object.keys(channelsToSave).length === 0) {
            return;
        }

        // Note: If DOM is empty (length 0), we proceed to save the empty object?
        // Original code didn't explicitly block empty DOM saving, but logical implication of `forEach` is empty object.
        // Let's verify original behavior: `CANALES_ACTIVOS_EN_DOM.forEach` won't run. `lsCanales` is {}. `length > 0` check fails.
        // So it saves `{}` to LS. Correct for "saving empty state".

        localStorage.setItem(LS_KEY_SAVED_CHANNELS_GRID_VIEW, JSON.stringify(channelsToSave));

        const alertElement = document.querySelector('#alerta-guardado-canales');
        if (alertElement) {
            alertElement.classList.remove('d-none');
            setTimeout(() => {
                alertElement.classList.add('d-none');
            }, 420);
        }
    } catch (error) {
        console.error('Error attempting to save channels to local storage:', error);
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
