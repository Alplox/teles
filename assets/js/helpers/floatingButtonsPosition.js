import { LS_KEY_FLOATING_BUTTONS_POSITION } from "../constants/localStorageKeys.js";
import { buttonsPositionFloatingButtons } from "../main.js";

/** @type {readonly string[]} Position classes to be removed before applying new ones */
const POSITION_CLASSES = Object.freeze([
    'top-0', 'top-50', 'bottom-0',
    'start-0', 'start-50', 'end-0',
    'translate-middle-x', 'translate-middle-y', 'translate-middle',
    'mb-3', 'mt-3'
]);

/**
 * Toggles the position of floating buttons by removing existing position classes
 * and adding new ones based on the provided parameters.
 * @param {string} topClass - Vertical position class (e.g., 'top-0', 'top-50', 'bottom-0')
 * @param {string} startClass - Horizontal position class (e.g., 'start-0', 'start-50', 'end-0')
 * @param {string} marginClass - Margin class (e.g., 'mb-3', 'mt-3')
 * @param {string} translateClass - Transform class (e.g., 'translate-middle-x')
 * @returns {void}
 */
const toggleFloatingButtonsPosition = (topClass, startClass, marginClass, translateClass) => {
    const floatingButtonsContainer = document.querySelector('#grupo-botones-flotantes');
    if (!floatingButtonsContainer) return;

    floatingButtonsContainer.classList.remove(...POSITION_CLASSES);

    // Filter valid string classes and add them using a Set to prevent duplicates
    const classesToAdd = [topClass, startClass, marginClass, translateClass]
        .filter(cls => typeof cls === 'string' && cls.trim() !== '');

    if (classesToAdd.length > 0) {
        floatingButtonsContainer.classList.add(...new Set(classesToAdd));
    }
};

/**
 * Handles click events on floating buttons position controls.
 * Updates the button position and persists the selection to localStorage.
 * @param {string} topClass - Vertical position class
 * @param {string} startClass - Horizontal position class
 * @param {string} [margin=''] - Margin class
 * @param {string} [translateClass=''] - Transform class
 * @returns {void}
 */
export const handleFloatingButtonsPositionClick = (topClass, startClass, margin = '', translateClass = '') => {
    toggleFloatingButtonsPosition(topClass, startClass, margin, translateClass);

    const selectedPosition = {
        top: typeof topClass === 'string' ? topClass : '',
        start: typeof startClass === 'string' ? startClass : '',
        margin: typeof margin === 'string' ? margin : '',
        translate: typeof translateClass === 'string' ? translateClass : ''
    };

    // Only save if position changed, with safe localStorage handling
    try {
        const currentPosition = localStorage.getItem(LS_KEY_FLOATING_BUTTONS_POSITION);
        const newPositionJson = JSON.stringify(selectedPosition);

        if (currentPosition !== newPositionJson) {
            localStorage.setItem(LS_KEY_FLOATING_BUTTONS_POSITION, newPositionJson);
        }
    } catch (error) {
        console.warn('[teles] The position of the floating buttons could not be saved to localStorage:', error);
    }
};

/**
 * Checks if a button matches the specified position configuration.
 * @param {HTMLInputElement} button - The button element with a dataset.position attribute
 * @param {string} top - Expected vertical position class
 * @param {string} start - Expected horizontal position class
 * @param {string} margin - Expected margin class
 * @param {string} translate - Expected transform class
 * @returns {boolean} True if the button matches the position configuration
 */
const isRepositionButton = (button, top, start, margin, translate) => {
    const positionParts = button.dataset.position.split(' ');
    return positionParts[0] === top
        && positionParts[1] === start
        && (positionParts[2] ?? '') === (margin ?? '')
        && (positionParts[3] ?? '') === (translate ?? '');
};

/**
 * Updates floating buttons position and synchronizes the checked state
 * of all position control buttons.
 * @param {string} top - Vertical position class
 * @param {string} start - Horizontal position class
 * @param {string} margin - Margin class
 * @param {string} translate - Transform class
 * @returns {void}
 */
export const updateFloatingButtons = (top, start, margin, translate) => {
    toggleFloatingButtonsPosition(top, start, margin, translate);

    buttonsPositionFloatingButtons.forEach(btn => {
        btn.checked = isRepositionButton(btn, top, start, margin, translate);
    });
};
