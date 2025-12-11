import { CSS_CLASS_BUTTON_PRIMARY, CSS_CLASS_BUTTON_SECONDARY } from "../constants/index.js";

/**
 * Adjusts the CSS class of channel buttons based on their active state.
 * @param {string} channelId - The ID of the channel.
 * @param {boolean} isActive - Whether the channel is active or not.
 */
export const adjustChannelButtonClass = (channelId, isActive) => {
    let buttons = document.querySelectorAll(`button[data-canal="${channelId}"]`);
    buttons.forEach(button => {
        if (isActive) {
            button.classList.replace(CSS_CLASS_BUTTON_SECONDARY, CSS_CLASS_BUTTON_PRIMARY);
        } else {
            button.classList.replace(CSS_CLASS_BUTTON_PRIMARY, CSS_CLASS_BUTTON_SECONDARY);
        }
    });
}
