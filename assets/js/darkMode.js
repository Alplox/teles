const darkMode = document.getElementById('switch-theme');
const darkLabel = 'status-theme';
const darkLang = 'Tema <span class="fs-smaller text-secondary">[Oscuro]</span> <i class="bi bi-moon-stars bg-black px-2 py-1 rounded-circle ms-auto"></i>';
const lightLang = 'Tema <span class="fs-smaller text-secondary">[Claro]</span> <i class="bi bi-sun bg-white px-2 py-1 rounded-circle ms-auto"></i>';

function resetTheme() {
    darkMode.checked ? applyTheme(true) : applyTheme(false);
}

function applyTheme(isDarkMode) {
    if (isDarkMode) {
        document.documentElement.setAttribute('data-bs-theme', 'dark');
        document.getElementById(darkLabel).innerHTML = darkLang;
        localStorage.setItem('theme', 'dark');
    } else {
        document.documentElement.setAttribute('data-bs-theme', 'light');
        /*  document.documentElement.removeAttribute('data-bs-theme'); */
        document.getElementById(darkLabel).innerHTML = lightLang;
        localStorage.setItem('theme', 'light');
    }
}

function detectSystemTheme() {
    const hasThemePreference = localStorage.getItem('theme');
    if (hasThemePreference === null) {
        const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");
        const isDarkMode = prefersDarkScheme.matches;
        if (isDarkMode) {
            darkMode.checked = true;
            applyTheme(true);
        } else {
            applyTheme(false);
        }
    } else {
        const darkThemeSelected = localStorage.getItem('theme') !== null && localStorage.getItem('theme') === 'dark';
        darkMode.checked = darkThemeSelected;
        applyTheme(darkThemeSelected);
    }
}

detectSystemTheme(); // Llamada a la función para detectar el tema del sistema

darkMode.addEventListener('change', function () {
    resetTheme();
});