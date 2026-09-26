import { CSS_CLASS_BUTTON_PRIMARY, LS_KEY_LAYOUT_FULL_HEIGHT_ENABLED, LS_KEY_BOOTSTRAP_COL_NUMBER, LS_KEY_ACTIVE_VIEW_MODE } from "../constants/index.js";
import { showToast } from "./index.js";
import { obtainNumberOfChannelsPerRow, readJson } from "../utils/index.js";

import {
    numberChannelsPerRowButtons,
    gridViewContainer
} from "../main.js";

/**
 * Invalidates column settings cache. Call after any localStorage write for these keys.
 */
export const invalidateCachedColumnSettings = () => {
    viewModeCache = null; colNumberCache = null; fullHeightCache = null;
};

let viewModeCache = null;
let colNumberCache = null;
let fullHeightCache = null;

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
        const viewMode = viewModeCache ?? (viewModeCache = localStorage.getItem(LS_KEY_ACTIVE_VIEW_MODE) || 'grid-view');
        if (viewMode === 'free-view') return;

        const activeTransmissions = gridViewContainer.querySelectorAll('div[data-canal]');

        // readJson, not JSON.parse: this runs inside a MutationObserver callback,
        // where a throw would be silent.
        const colNumber = colNumberCache ?? (colNumberCache = readJson(LS_KEY_BOOTSTRAP_COL_NUMBER, null));
        if (!colNumber || isNaN(Number(colNumber))) return;

        const isFullHeightMode = fullHeightCache ?? (fullHeightCache = readJson(LS_KEY_LAYOUT_FULL_HEIGHT_ENABLED, null));
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
                    assignColumnClasses(transmission, [`col-${colNumber}`]);
                }
            } else if (activeTransmissions.length < channelsPerRow) {
                for (const transmission of activeTransmissions) {
                    assignColumnClasses(transmission, ['col', ...fullHeightClasses]);
                }
            } else {
                for (const transmission of activeTransmissions) {
                    assignColumnClasses(transmission, [`col-${colNumber}`]);
                    if (colNumber === 12 || colNumber === 6) {
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
                    assignColumnClasses(transmission, [`col-${colNumber}`]);
                    if (colNumber === 12 || colNumber === 6) {
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
                    assignColumnClasses(transmission, [`col-${colNumber}`]);
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