/**
 * Synchronizes the state of a checkbox, a status label, and a corresponding
 * `localStorage` entry to ensure they all reflect the same visibility value.
 *
 * @param {Object} params - Configuration object.
 * @param {HTMLInputElement} params.checkbox - The checkbox element whose `checked`
 *   property should match the `isVisible` value.
 * @param {HTMLElement} params.statusElement - The DOM element where the visibility
 *   status text (`[Visible]` or `[Oculto]`) will be displayed.
 * @param {string} params.storageKey - The key used to store the visibility state
 *   (`"show"` or `"hide"`) in `localStorage`.
 * @param {boolean} params.isVisible - Determines the target visibility state.
 *   When `true`, the checkbox is checked, the status label shows `[Visible]`,
 *   and `localStorage` is updated to `"show"`; otherwise, `"hide"`.
 *
 * @returns {void}
 *
 * @example
 * syncCheckboxState({
 *   checkbox: document.querySelector('#myCheckbox'),
 *   statusElement: document.querySelector('#myStatus'),
 *   storageKey: 'panelVisibility',
 *   isVisible: document.querySelector('#myCheckbox').checked
 * });
 */
export function syncCheckboxState({
    checkbox,
    statusElement,
    storageKey,
    isVisible
}) {
    if (!checkbox || !statusElement || !storageKey) {
        console.warn('[teles] syncCheckboxState received invalid arguments.');
        return;
    }

    const nextStorageValue = isVisible ? 'show' : 'hide';

    if (checkbox.checked !== isVisible) checkbox.checked = isVisible;

    if (statusElement.textContent !== (isVisible ? '[Visible]' : '[Oculto]')) {
        statusElement.textContent = isVisible ? '[Visible]' : '[Oculto]';
    }
    if (localStorage.getItem(storageKey) !== nextStorageValue) {
        localStorage.setItem(storageKey, nextStorageValue);
    }
}