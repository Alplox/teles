const darkMode = document.getElementById('darkMode');
const darkLabel = 'darkModeLabel';
const darkLang = 'Tema [Oscuro <i class="bi bi-moon-stars"></i>]';
const lightLang = 'Tema [Claro <i class="bi bi-sun"></i>]';

/* window.addEventListener('load', function () { */
    if (darkMode) {
        initTheme();
        darkMode.addEventListener('change', function () {
            resetTheme();
        });
    }
    detectSystemTheme(); // Llamada a la función para detectar el tema del sistema
/* }); */

function initTheme() {
    const darkThemeSelected = localStorage.getItem('darkMode') !== null && localStorage.getItem('darkMode') === 'dark';
    darkMode.checked = darkThemeSelected;
    applyTheme(darkThemeSelected);
}

function resetTheme() {
    if (darkMode.checked) {
        applyTheme(true);
        localStorage.setItem('darkMode', 'dark');
    } else {
        applyTheme(false);
        localStorage.setItem('darkMode', 'light');
    }
}

function applyTheme(isDarkMode) {
    if (isDarkMode) {
        document.documentElement.setAttribute('data-bs-theme', 'dark');
        document.getElementById(darkLabel).innerHTML = darkLang;
    } else {
        document.documentElement.removeAttribute('data-bs-theme');
        document.getElementById(darkLabel).innerHTML = lightLang;
    }
}

function detectSystemTheme() {
    const hasThemePreference = localStorage.getItem('darkMode');
    if (hasThemePreference === null) {
        const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");
        const isDarkMode = prefersDarkScheme.matches;
        if (isDarkMode) {
            darkMode.checked = true;
            applyTheme(true);
        }
    }
}

