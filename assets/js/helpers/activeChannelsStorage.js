import { LS_KEY_SAVED_CHANNELS_GRID_VIEW } from "../constants/index.js";

/**
 * Reads and parses the persisted active channels payload.
 * Supports the current ordered format and the legacy `{ [id]: name }` format.
 * @returns {Object|null} Parsed payload, or null when unavailable/invalid.
 */
export const readActiveChannelsStorage = () => {
    try {
        const payload = localStorage.getItem(LS_KEY_SAVED_CHANNELS_GRID_VIEW);
        if (!payload) return null;
        const parsed = JSON.parse(payload);
        return parsed && typeof parsed === 'object' ? parsed : null;
    } catch (error) {
        console.error('[teles] Error reading active channels from localStorage:', error);
        return null;
    }
};

/**
 * Returns active channel IDs in the explicit user display order.
 * The `order` array is required because object keys that look like integers
 * are enumerated before regular string keys by JavaScript.
 * @returns {string[]} Active channel IDs.
 */
export const getSavedActiveChannelIds = () => {
    const parsed = readActiveChannelsStorage();
    if (!parsed) return [];

    if (Array.isArray(parsed)) {
        return parsed.filter(channelId => typeof channelId === 'string' && channelId.length > 0);
    }

    if (Array.isArray(parsed.order)) {
        return parsed.order.filter(channelId => typeof channelId === 'string' && channelId.length > 0);
    }

    const legacyChannels = parsed.channels && typeof parsed.channels === 'object'
        ? parsed.channels
        : parsed;

    return Object.keys(legacyChannels);
};

/**
 * Creates the persisted active channels payload while preserving DOM/display order.
 * @param {{ id: string, name: string }[]} channels - Active channels in display order.
 * @returns {{ version: number, order: string[], channels: Object.<string, string> }}
 */
export const createActiveChannelsStoragePayload = (channels = []) => {
    const order = [];
    const channelsById = {};

    channels.forEach(({ id, name }) => {
        if (!id) return;
        order.push(id);
        channelsById[id] = name;
    });

    return {
        version: 2,
        order,
        channels: channelsById
    };
};
