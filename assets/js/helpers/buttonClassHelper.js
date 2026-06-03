import { CSS_CLASS_BUTTON_PRIMARY, CSS_CLASS_BUTTON_SECONDARY, ID_PREFIX_CONTAINERS_CHANNELS } from "../constants/index.js";

/**
 * Adjusts the CSS class of channel buttons based on their active state.
 * Scoped to known button containers instead of full DOM scan.
 * @param {string} channelId - The ID of the channel.
 * @param {boolean} isActive - Whether the channel is active or not.
 */
export const adjustChannelButtonClass = (channelId, isActive) => {
    const newClass = isActive ? CSS_CLASS_BUTTON_PRIMARY : CSS_CLASS_BUTTON_SECONDARY;
    const oldClass = isActive ? CSS_CLASS_BUTTON_SECONDARY : CSS_CLASS_BUTTON_PRIMARY;

    for (const prefix of ID_PREFIX_CONTAINERS_CHANNELS) {
        const container = document.querySelector(`#${prefix}-channels-buttons-container`);
        if (!container) continue;
        const button = container.querySelector(`button[data-canal="${channelId}"]`);
        if (button) button.classList.replace(oldClass, newClass);
    }
}
