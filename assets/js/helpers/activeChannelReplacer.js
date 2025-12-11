import { crearFragmentCanal } from "../canalUI.js";
import { tele } from "../main.js";
import { showToast, adjustChannelButtonClass, saveChannelsToLocalStorage, registerManualChannelChange } from "../helpers/index.js";

/**
 * Replaces an active channel in the grid with a new one selected from the modal.
 * Maintains the container structure and updates the necessary states.
 * 
 * @param {string} replacementChannelId - The ID of the new channel to insert.
 * @param {string} existingChannelId - The ID of the currently active channel to be replaced.
 * @returns {void}
 */
export const replaceActiveChannel = (replacementChannelId, existingChannelId) => {
    try {
        const parentContainer = document.querySelector(`div[data-canal="${existingChannelId}"]`);

        if (parentContainer) {
            const existingContentDiv = document.querySelector(`div[data-canal-cambio="${existingChannelId}"]`);
            const existingOverlayBar = document.querySelector(`#overlay-de-canal-${existingChannelId}`);

            // Prevent duplicates: if the replacement channel is already active elsewhere in the grid or single view
            const duplicateChannelDiv = document.querySelector(`div[data-canal="${replacementChannelId}"]`);
            if (duplicateChannelDiv && parentContainer !== duplicateChannelDiv) {
                tele.remove(replacementChannelId);
            }

            // Remove old content
            existingContentDiv?.remove();
            existingOverlayBar?.remove();

            // Insert new content
            parentContainer.append(crearFragmentCanal(replacementChannelId));

            // Update parent attribute to reflect the new channel
            parentContainer.setAttribute('data-canal', replacementChannelId);

            // Update button styles and persistence
            adjustChannelButtonClass(existingChannelId, false);
            adjustChannelButtonClass(replacementChannelId, true);

            saveChannelsToLocalStorage();
            registerManualChannelChange();
        }
    } catch (error) {
        console.error(`Error at attempt to replace ${existingChannelId} with ${replacementChannelId}. Error: ${error}`);
        showToast({
            title: `Ha ocurrido un error al intentar cambiar canal: ${existingChannelId} por canal: ${replacementChannelId}.`,
            body: `Error: ${error}`,
            type: 'danger',
            autohide: false,
            delay: 0,
            showReloadOnError: true
        });
    }
};
