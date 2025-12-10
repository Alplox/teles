import { CSS_CLASS_BUTTON_PRIMARY, LS_KEY_LAYOUT_FULL_HEIGHT_ENABLED, LS_KEY_BOOTSTRAP_COL_NUMBER } from "../constants/index.js";
import { showToast } from "./index.js";
import { obtainNumberOfChannelsPerRow } from "../utils/index.js";

import {
    buttonsNumberChannelsPerRow,
    gridViewContainerEl
} from "../main.js";

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
 * Handles responsive behavior and full-height mode logic.
 * @returns {void}
 */
export const adjustBootstrapColumnClasses = () => {
    try {
        if (typeof isMobile === 'undefined' || !gridViewContainerEl) return;

        const activeTransmissions = gridViewContainerEl.querySelectorAll('div[data-canal]');
        const storedColNumber = JSON.parse(localStorage.getItem(LS_KEY_BOOTSTRAP_COL_NUMBER));

        if (!storedColNumber || isNaN(Number(storedColNumber))) return;

        const isFullHeightMode = JSON.parse(localStorage.getItem(LS_KEY_LAYOUT_FULL_HEIGHT_ENABLED));
        const fullHeightClasses = isFullHeightMode ? ['vh-100', 'overflow-hidden'] : [];

        if (isFullHeightMode) {
            gridViewContainerEl.classList.add('h-100');
        } else {
            gridViewContainerEl.classList.remove('h-100');
        }

        const channelsPerRow = obtainNumberOfChannelsPerRow();

        if (!isMobile.any) {
            // Desktop logic
            if (activeTransmissions.length < channelsPerRow && !isFullHeightMode) {
                for (const transmission of activeTransmissions) {
                    assignColumnClasses(transmission, [`col-${storedColNumber}`]);
                }
            } else if (activeTransmissions.length < channelsPerRow) {
                for (const transmission of activeTransmissions) {
                    assignColumnClasses(transmission, ['col', ...fullHeightClasses]);
                }
            } else {
                for (const transmission of activeTransmissions) {
                    assignColumnClasses(transmission, [`col-${storedColNumber}`]);
                    if (storedColNumber === 12 || storedColNumber === 6) {
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
                    assignColumnClasses(transmission, [`col-${storedColNumber}`]);
                    if (storedColNumber === 12 || storedColNumber === 6) {
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
                    assignColumnClasses(transmission, [`col-${storedColNumber}`]);
                }
            }
        }

    } catch (error) {
        console.error('Error adjusting "col" classes for active channels: ', error);
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
        buttonsNumberChannelsPerRow.forEach(btn => {
            btn.classList.replace(CSS_CLASS_BUTTON_PRIMARY, 'btn-light-subtle');
        });
        activeButton.classList.replace('btn-light-subtle', CSS_CLASS_BUTTON_PRIMARY);
    }

    localStorage.setItem(LS_KEY_BOOTSTRAP_COL_NUMBER, columnValue);
    adjustBootstrapColumnClasses();
};