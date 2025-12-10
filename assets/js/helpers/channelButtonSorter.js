import { ID_PREFIX_CONTAINERS_CHANNELS } from "../constants/index.js";

/** @type {Object.<string, string[]>} Stores the original order of channel button IDs for different contexts */
const originalOrder = {
    'modal-canales': [],
    'offcanvas-canales': [],
    'modal-cambiar-canal': [],
    'single-view': []
};

/**
 * Saves the current order of channel buttons in a container to restore it later.
 * @param {string} containerId - The ID of the container element.
 * @returns {void}
 */
export function saveOriginalOrder(containerId) {
    try {
        const buttonsInContainer = Array.from(document.querySelectorAll(`#${containerId} button[data-canal]`));
        const ids = buttonsInContainer.map(btn => btn.getAttribute('data-canal'));

        for (const PREFIX of ID_PREFIX_CONTAINERS_CHANNELS) {
            if (containerId.startsWith(PREFIX)) {
                originalOrder[PREFIX] = ids;
            }
        }
    } catch (e) {
        console.error('Error in saveOriginalOrder:', e);
    }
}

/**
 * Internal reusable function to sort buttons within a container.
 * @param {string} containerId - Main container ID.
 * @param {function(HTMLElement, HTMLElement): number} compareFn - Comparison function for sorting.
 * @returns {void}
 */
function applySorting(containerId, compareFn) {
    try {
        const container = document.getElementById(containerId);
        if (!container) return;

        const channelGroups = Array.from(container.querySelectorAll('.grupo-canales-origen'));

        /**
         * Helper to sort and re-insert a list of buttons.
         * @param {HTMLElement} contextList - The container element (e.g., .modal-body-canales or main container).
         * @param {string} [buttonSelector='button[data-canal]'] - Selector to find buttons.
         */
        const sortAndReinsert = (contextList, buttonSelector = 'button[data-canal]') => {
            const buttons = Array.from(contextList.querySelectorAll(buttonSelector));
            if (!buttons.length) return;

            buttons.sort(compareFn);

            // Move existing elements (clearing innerHTML is not necessary)
            const fragment = document.createDocumentFragment();
            buttons.forEach(btn => fragment.append(btn));
            contextList.append(fragment);
        };

        if (channelGroups.length === 0) {
            // Case without groups (flat list)
            // Use 'button' for compatibility if data-canal attributes are missing
            sortAndReinsert(container, 'button');
        } else {
            // Case with groups (accordions/sections)
            channelGroups.forEach(group => {
                const list = group.querySelector('.modal-body-canales');
                if (list) sortAndReinsert(list);
            });
        }
    } catch (e) {
        console.error(`Error sorting containers (${containerId}):`, e);
    }
}

/**
 * Sorts channel buttons in ascending alphabetical order.
 * @param {string} containerId - The ID of the container element.
 * @returns {void}
 */
export function sortChannelButtonsAscending(containerId) {
    applySorting(containerId, (a, b) =>
        a.textContent.trim().localeCompare(b.textContent.trim())
    );
}

/**
 * Sorts channel buttons in descending alphabetical order.
 * @param {string} containerId - The ID of the container element.
 * @returns {void}
 */
export function sortChannelButtonsDescending(containerId) {
    applySorting(containerId, (a, b) =>
        b.textContent.trim().localeCompare(a.textContent.trim())
    );
}

/**
 * Restores the original order of channel buttons in a container.
 * @param {string} containerId - The ID of the container element.
 * @returns {void}
 */
export function restoreOriginalChannelButtonsOrder(containerId) {
    try {
        const container = document.querySelector(`#${containerId}`);
        if (!container) return;

        // Find original IDs based on container prefix
        let originalIds = null;
        for (const prefix of ID_PREFIX_CONTAINERS_CHANNELS) {
            if (containerId.startsWith(prefix)) {
                originalIds = originalOrder[prefix];
                break;
            }
        }
        if (!Array.isArray(originalIds)) return;

        const channelGroups = Array.from(container.querySelectorAll('.grupo-canales-origen'));

        /**
         * Helper to reorder lists based on saved IDs.
         * @param {HTMLElement} contextList - The list container.
         */
        const reorderAccordingToOriginal = (contextList) => {
            const buttonMap = new Map();
            // Index current buttons for fast access
            contextList.querySelectorAll('button[data-canal]').forEach(btn => {
                buttonMap.set(btn.getAttribute('data-canal'), btn);
            });

            const fragment = document.createDocumentFragment();

            // Reinsert in saved order
            originalIds.forEach(id => {
                const btn = buttonMap.get(id);
                if (btn) fragment.append(btn);
            });

            // If there are leftover buttons (new ones not present when saved), append them at the end
            if (fragment.children.length < buttonMap.size) {
                buttonMap.forEach((btn, id) => {
                    // If button is in DOM but not in fragment (wasn't in originalIds)
                    if (!fragment.contains(btn)) fragment.append(btn);
                });
            }

            contextList.append(fragment);
        };

        if (channelGroups.length === 0) {
            reorderAccordingToOriginal(container);
        } else {
            channelGroups.forEach(group => {
                const list = group.querySelector('.modal-body-canales');
                if (list) reorderAccordingToOriginal(list);
            });
        }

    } catch (e) {
        console.error('Error in restoreOriginalChannelButtonsOrder:', e);
    }
}