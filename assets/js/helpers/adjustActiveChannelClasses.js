import { CSS_CLASS_BUTTON_PRIMARY, LS_KEY_LAYOUT_FULL_HEIGHT_ENABLED, LS_KEY_BOOTSTRAP_COL_NUMBER, LS_KEY_ACTIVE_VIEW_MODE } from "../constants/index.js";
import { showToast } from "./index.js";
import { obtainNumberOfChannelsPerRow } from "../utils/index.js";

import {
    numberChannelsPerRowButtons,
    gridViewContainer
} from "../main.js";

/** @type {{ viewMode: string|null, colNumber: string|null, fullHeight: string|null }} Cached localStorage reads */
let cachedSettings = { viewMode: null, colNumber: null, fullHeight: null };

/**
 * Invalidates cached settings. Call after any localStorage write for these keys.
 */
export const invalidateCachedColumnSettings = () => {
    cachedSettings = { viewMode: null, colNumber: null, fullHeight: null };
};

/**
 * Assigns column classes to a transmission element, removing previous layout classes.
 * @param {HTMLElement} transmissionElement - The channel container element to modify.
 * @param {string[]} classesToAdd - List of CSS classes to add.
 * @returns {void}
 */
const assignColumnClasses = (transmissionElement, classesToAdd) => {
    if (!transmissionElement || !classesToAdd) return;
    const classesToRemove = ['col-12', 'col-6', 'col-4', 'col-3', 'col-2', 'col-1', 'col', 'vh-100', 'overflow-hidden'];
    transmissionElement.classList.remove(...classesToRemove);
    transmissionElement.classList.add(...classesToAdd);
};

/**
 * Adjusts the Bootstrap column classes for all active channels in the grid based on current settings.
 * Only applies to Grid View. Free View channels are managed exclusively by Gridstack.
 * @returns {void}
 */
export const adjustBootstrapColumnClasses = () => {
    try {
        if (typeof isMobile === 'undefined' || !gridViewContainer) return;

        // Skip entirely for Free View - Gridstack owns layout there
        if (cachedSettings.viewMode === null) {
            cachedSettings.viewMode = localStorage.getItem(LS_KEY_ACTIVE_VIEW_MODE) || 'grid-view';
        }
        if (cachedSettings.viewMode === 'free-view') return;

        const activeTransmissions = gridViewContainer.querySelectorAll('div[data-canal]');

        if (cachedSettings.colNumber === null) {
            cachedSettings.colNumber = JSON.parse(localStorage.getItem(LS_KEY_BOOTSTRAP_COL_NUMBER));
        }
        if (!cachedSettings.colNumber || isNaN(Number(cachedSettings.colNumber))) return;

        if (cachedSettings.fullHeight === null) {
            cachedSettings.fullHeight = JSON.parse(localStorage.getItem(LS_KEY_LAYOUT_FULL_HEIGHT_ENABLED));
        }
        const isFullHeightMode = cachedSettings.fullHeight;
        const fullHeightClasses = isFullHeightMode ? ['vh-100', 'overflow-hidden'] : [];

        if (isFullHeightMode) {
            gridViewContainer.classList.add('h-100');
        } else {
            gridViewContainer.classList.remove('h-100');
        }

        const channelsPerRow = obtainNumberOfChannelsPerRow();

        if (!isMobile.any) {
            // Desktop logic
            if (activeTransmissions.length < channelsPerRow && !isFullHeightMode) {
                for (const transmission of activeTransmissions) {
                    assignColumnClasses(transmission, [`col-${cachedSettings.colNumber}`]);
                }
            } else if (activeTransmissions.length < channelsPerRow) {
                for (const transmission of activeTransmissions) {
                    assignColumnClasses(transmission, ['col', ...fullHeightClasses]);
                }
            } else {
                for (const transmission of activeTransmissions) {
                    assignColumnClasses(transmission, [`col-${cachedSettings.colNumber}`]);
                    if (cachedSettings.colNumber === 12 || cachedSettings.colNumber === 6) {
                        transmission.classList.add(...fullHeightClasses);
                    }
                }
            }
        } else if (screen.orientation && screen.orientation.type === 'landscape-primary') {
            // Mobile Landscape
            if (activeTransmissions.length < channelsPerRow) {
                for (const transmission of activeTransmissions) {
                    assignColumnClasses(transmission, ['col', ...fullHeightClasses]);
                }
            } else {
                for (const transmission of activeTransmissions) {
                    assignColumnClasses(transmission, [`col-${cachedSettings.colNumber}`]);
                    if (cachedSettings.colNumber === 12 || cachedSettings.colNumber === 6) {
                        transmission.classList.add(...fullHeightClasses);
                    }
                }
            }
        } else {
            // Mobile Portrait / Default
            if (activeTransmissions.length < channelsPerRow) {
                for (const transmission of activeTransmissions) {
                    assignColumnClasses(transmission, ['col', ...fullHeightClasses]);
                }
            } else {
                for (const transmission of activeTransmissions) {
                    assignColumnClasses(transmission, [`col-${cachedSettings.colNumber}`]);
                }
            }
        }

    } catch (error) {
        console.error('[teles] Error adjusting "col" classes for active channels: ', error);
        showToast({
            title: 'Ha ocurrido un error al intentar ajustar el numero de canales por fila.',
            body: `Error: ${error}`,
            type: 'danger'
        });
    }
};


/**
 * Updates the grid layout based on the user's selected column count (channels per row).
 * Updates UI buttons, local storage, and reapplies active classes.
 * @param {string|number} columnValue - The Bootstrap column value (e.g. 12, 6, 4).
 * @returns {void}
 */
export const updateGridColumnConfiguration = (columnValue) => {
    if (!columnValue || isNaN(Number(columnValue))) return;

    const activeButton = document.querySelector(`#container-botones-personalizar-transmisiones-por-fila button[value='${columnValue}']`);

    if (activeButton) {
        numberChannelsPerRowButtons.forEach(btn => {
            btn.classList.replace(CSS_CLASS_BUTTON_PRIMARY, 'btn-light-subtle');
        });
        activeButton.classList.replace('btn-light-subtle', CSS_CLASS_BUTTON_PRIMARY);
    }

    localStorage.setItem(LS_KEY_BOOTSTRAP_COL_NUMBER, columnValue);
    invalidateCachedColumnSettings();
    adjustBootstrapColumnClasses();
};