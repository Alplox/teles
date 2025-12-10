import { channelsList } from "../channelManager.js";
import { LS_KEY_ACTIVE_VIEW_MODE, LS_KEY_SAVED_CHANNELS_GRID_VIEW } from "../constants/index.js";
import { estaCargandoDesdeUrlCompartida, isDynamicUrlMode } from "../main.js";

let sharedParameterCleaned = false;

export const clearSharedUrlParameter = (force = false) => {
    try {
        const url = new URL(window.location.href);

        // If not forcing and no 'c' parameter, do nothing.
        if (!force && !url.searchParams.has('c')) return;

        if (!url.searchParams.has('c')) {
            sharedParameterCleaned = true;
            return;
        }

        url.searchParams.delete('c');
        window.history.replaceState({}, document.title, url.toString());
        sharedParameterCleaned = true;

    } catch (error) {
        console.error('[teles] Error clearing shared URL parameter:', error);
    }
};

export const getActiveChannelIds = () => {
    try {
        const payload = localStorage.getItem(LS_KEY_SAVED_CHANNELS_GRID_VIEW);
        if (!payload) return [];
        const data = JSON.parse(payload);
        if (!data || typeof data !== 'object') return [];
        return Object.keys(data);
    } catch (error) {
        console.error('[teles] Error getting active channels for dynamic URL:', error);
        return [];
    }
};

export const syncActiveChannelsParameter = () => {
    if (!isDynamicUrlMode) return;
    // In single view, never touch the 'c' parameter even if preference is active.
    if (localStorage.getItem(LS_KEY_ACTIVE_VIEW_MODE) === 'single-view') return;
    try {
        const currentUrl = new URL(window.location.href);
        const activeIds = getActiveChannelIds();

        if (!activeIds.length) {
            currentUrl.searchParams.delete('c');
        } else {
            currentUrl.searchParams.set('c', activeIds.join(','));
        }

        window.history.replaceState({}, document.title, currentUrl.toString());
        sharedParameterCleaned = true;
    } catch (error) {
        console.error('[teles] Error syncing dynamic URL:', error);
    }
};

/**
 * Manages manual changes made by the user on active channels
 * (add/remove, move position, etc.) and decides whether to sync or clear the `c` parameter.
 * Respects the initial load flow from a shared URL to avoid interference.
 * @param {Object} [options]
 * @param {boolean} [options.force=false]
 * @returns {void}
 */
export const registerManualChannelChange = ({ force = false } = {}) => {
    if (!force && estaCargandoDesdeUrlCompartida) return;

    // In "single view" mode we don't use dynamic URL or `c` parameter.
    if (localStorage.getItem(LS_KEY_ACTIVE_VIEW_MODE) === 'single-view') return;

    isDynamicUrlMode ? syncActiveChannelsParameter() : clearSharedUrlParameter(true);
}


/**
   * Retrieves the list of channel IDs shared via the `c` parameter in the URL.
   * Expected format is a comma-separated list, e.g.: ?c=24-horas,meganoticias,t13
   * @returns {string[]} Array of valid channel IDs.
   */
export const getChannelsFromUrl = () => {
    try {
        const url = new URL(window.location.href);
        const param = url.searchParams.get('c');
        if (!param) return [];

        return param
            .split(',')
            .map(id => id.trim())
            .filter(id => id.length > 0 && channelsList?.[id]);
    } catch (error) {
        console.error('[teles] Error reading shared channels from URL:', error);
        return [];
    }
}
