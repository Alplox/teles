/**
 * Favorites Manager
 * Handles adding, removing and retrieving favorite channels
 */

import { LS_KEY_FAVORITE_CHANNELS } from '../constants/localStorageKeys.js';

/**
 * Gets the list of favorite channel IDs
 * @returns {string[]} Array of favorite channel IDs
 */
export function getFavoriteChannels() {
    try {
        const favorites = localStorage.getItem(LS_KEY_FAVORITE_CHANNELS);
        return favorites ? JSON.parse(favorites) : [];
    } catch (error) {
        console.warn('[teles] Error reading favorites from localStorage:', error);
        return [];
    }
}

/**
 * Saves the favorites list to localStorage
 * @param {string[]} favorites - Array of favorite channel IDs
 */
export function saveFavorites(favorites) {
    try {
        localStorage.setItem(LS_KEY_FAVORITE_CHANNELS, JSON.stringify(favorites));
    } catch (error) {
        console.warn('[teles] Error saving favorites to localStorage:', error);
    }
}

/**
 * Checks if a channel is favorited
 * @param {string} channelId - Channel ID to check
 * @returns {boolean} True if channel is favorited
 */
export function isFavoritedChannel(channelId) {
    return getFavoriteChannels().includes(channelId);
}

/**
 * Toggles a channel as favorite
 * @param {string} channelId - Channel ID to toggle
 * @returns {boolean} True if channel is now favorited, false if removed from favorites
 */
export function toggleFavoriteChannel(channelId) {
    const favorites = getFavoriteChannels();
    const index = favorites.indexOf(channelId);

    if (index > -1) {
        // Remove from favorites
        favorites.splice(index, 1);
    } else {
        // Add to favorites
        favorites.unshift(channelId); // Add to beginning to maintain order
    }

    saveFavorites(favorites);
    return index === -1; // Return true if added, false if removed
}

/**
 * Adds a channel to favorites
 * @param {string} channelId - Channel ID to add
 */
function addToFavorites(channelId) {
    if (!isFavoritedChannel(channelId)) {
        const favorites = getFavoriteChannels();
        favorites.unshift(channelId);
        saveFavorites(favorites);
    }
}

/**
 * Removes a channel from favorites
 * @param {string} channelId - Channel ID to remove
 */
function removeFromFavorites(channelId) {
    const favorites = getFavoriteChannels();
    const filtered = favorites.filter(id => id !== channelId);
    saveFavorites(filtered);
}

/**
 * Clears all favorites
 */
function clearAllFavorites() {
    saveFavorites([]);
}
