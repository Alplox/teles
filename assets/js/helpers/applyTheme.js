import { LS_KEY_THEME } from '../constants/index.js';

const LS_VALUE_DARK_THEME = 'dark';
const LS_VALUE_LIGHT_THEME = 'light';

export const applyTheme = (isDarkTheme) => {
    document.querySelector('#icon-bootstrap-current-theme').classList.replace(
        isDarkTheme ? 'bi-sun' : 'bi-moon-stars',
        isDarkTheme ? 'bi-moon-stars' : 'bi-sun'
    );
    document.querySelector('#checkbox-change-theme').checked = isDarkTheme;
    document.querySelector('#span-current-theme').textContent = isDarkTheme ? 'Oscuro' : 'Claro';
    document.documentElement.setAttribute('data-bs-theme', isDarkTheme ? LS_VALUE_DARK_THEME : LS_VALUE_LIGHT_THEME);
    localStorage.setItem(LS_KEY_THEME, isDarkTheme ? LS_VALUE_DARK_THEME : LS_VALUE_LIGHT_THEME);
}

export const detectThemePreferences = () => {
    const themeInLocalStorage = localStorage.getItem(LS_KEY_THEME);
    const prefersDarkTheme =  globalThis?.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false;
    applyTheme(themeInLocalStorage === null ? prefersDarkTheme : themeInLocalStorage === LS_VALUE_DARK_THEME);
}