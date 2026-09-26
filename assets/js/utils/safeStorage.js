/**
 * Safe wrappers around localStorage. These never throw: on failure they report
 * once to the console and return the caller's fallback.
 *
 * They exist because a bare `JSON.parse(localStorage.getItem(key))` at module
 * top-level turns one corrupted value into an uncaught SyntaxError that kills
 * the whole module graph, leaving an empty app with no error message and no way
 * to recover from the UI.
 */

/** Keys already reported as corrupted, to avoid flooding the console. */
const _reportedKeys = new Set();

/** @param {string} key @param {unknown} error */
const _reportOnce = (key, error) => {
    if (_reportedKeys.has(key)) return;
    _reportedKeys.add(key);
    console.warn(
        `[teles] Entrada de localStorage corrupta para "${key}", se usará el valor por defecto.`,
        error
    );
};

/**
 * Reads a raw string from localStorage without throwing.
 * @param {string} key
 * @param {string} [fallback='']
 * @returns {string}
 */
export const readRaw = (key, fallback = '') => {
    try {
        const value = localStorage.getItem(key);
        return value === null ? fallback : value;
    } catch (error) {
        // Private mode / storage disabled: run on in-memory defaults.
        _reportOnce(key, error);
        return fallback;
    }
};

/**
 * Parses a JSON value from localStorage without throwing.
 * @template T
 * @param {string} key
 * @param {T} fallback - Returned when the key is absent, unparseable, or null.
 * @returns {T}
 */
export const readJson = (key, fallback) => {
    let raw;
    try {
        raw = localStorage.getItem(key);
    } catch (error) {
        _reportOnce(key, error);
        return fallback;
    }
    if (raw === null || raw === undefined) return fallback;

    let parsed;
    try {
        parsed = JSON.parse(raw);
    } catch (error) {
        _reportOnce(key, error);
        return fallback;
    }
    return parsed === null || parsed === undefined ? fallback : parsed;
};

/**
 * Serializes and stores a value as JSON. Never throws.
 * @param {string} key
 * @param {unknown} value
 * @returns {boolean} True when the write succeeded.
 */
export const writeJson = (key, value) => {
    try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
    } catch (error) {
        // Most likely QuotaExceededError, or storage disabled.
        _reportOnce(key, error);
        return false;
    }
};

/**
 * Stores a plain string. Never throws.
 * @param {string} key
 * @param {string} value
 * @returns {boolean} True when the write succeeded.
 */
export const writeRaw = (key, value) => {
    try {
        localStorage.setItem(key, value);
        return true;
    } catch (error) {
        _reportOnce(key, error);
        return false;
    }
};
