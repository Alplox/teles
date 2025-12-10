import { LS_KEY_ORDER_SINGLE_VIEW_MAIN_CONTAINERS } from "../constants/index.js";
import { singleViewGridEl } from "../main.js";
import { showToast } from "./index.js";

/** @type {string[]} Original order of IDs for single view containers */
const ORIGINAL_ORDER_IDS = ['panel-canales-single-view', 'container-video-single-view'];

/**
 * Loads and applies the saved order of panels for the Single View mode.
 * If no saved order exists or it's invalid, it uses the original order.
 * Updates the 'single-view-grid-reordenado' class based on whether the order matches the original.
 * 
 * @returns {void}
 */
export function loadSingleViewOrder() {
    try {
        const savedOrder = localStorage.getItem(LS_KEY_ORDER_SINGLE_VIEW_MAIN_CONTAINERS);
        let orderToUse = ORIGINAL_ORDER_IDS;

        if (savedOrder) {
            try {
                const parsedOrder = JSON.parse(savedOrder);
                if (Array.isArray(parsedOrder) && parsedOrder.length === ORIGINAL_ORDER_IDS.length) {
                    orderToUse = parsedOrder;
                }
            } catch (e) {
                console.error(`Error parsing ${LS_KEY_ORDER_SINGLE_VIEW_MAIN_CONTAINERS}:`, e);
                localStorage.removeItem(LS_KEY_ORDER_SINGLE_VIEW_MAIN_CONTAINERS);
            }
        }

        orderToUse.forEach(id => {
            const element = document.getElementById(id);
            if (element) singleViewGridEl.appendChild(element);
        });

        const isOriginalOrder = JSON.stringify(ORIGINAL_ORDER_IDS) === JSON.stringify(getCurrentOrder());
        singleViewGridEl.classList.toggle('single-view-grid-reordenado', !isOriginalOrder);
    } catch (error) {
        console.error(`Error loading panel order for "Single View" mode. Error: ${error}`);
        showToast({
            title: 'Ha ocurrido un error durante la carga de orden de paneles para modo "Visión Única".',
            body: `Error: ${error}`,
            type: 'danger',
            autohide: false,
            delay: 0,
            showReloadOnError: true
        });
    }
}

/**
 * Saves the current order of panels in the Single View grid to localStorage.
 * @returns {void}
 */
export function saveSingleViewPanelsOrder() {
    const currentOrder = Array.from(singleViewGridEl.children).map(item => item.id);
    localStorage.setItem(LS_KEY_ORDER_SINGLE_VIEW_MAIN_CONTAINERS, JSON.stringify(currentOrder));
}

/**
 * Retrieves the current order of IDs in the Single View grid.
 * @returns {string[]} Array of element IDs.
 */
function getCurrentOrder() {
    return Array.from(singleViewGridEl.children).map(item => item.id);
}

/**
 * Toggles the 'single-view-grid-reordenado' class on the grid element.
 * The class is added if the current order differs from the original order.
 * @returns {void}
 */
export function toggleOrderedClass() {
    const currentOrder = getCurrentOrder();
    const isOriginalOrder = JSON.stringify(ORIGINAL_ORDER_IDS) === JSON.stringify(currentOrder);
    singleViewGridEl.classList.toggle('single-view-grid-reordenado', !isOriginalOrder);
}
