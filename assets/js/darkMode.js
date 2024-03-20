const darkMode = document.getElementById('darkMode');
const darkLabel = 'darkModeLabel';
const darkLang = 'Tema [Oscuro] <i class="bi bi-moon-stars bg-black px-2 py-1 rounded-circle"></i>';
const lightLang = 'Tema [Claro] <i class="bi bi-sun bg-white px-2 py-1 rounded-circle"></i>';

function resetTheme() {
    darkMode.checked ? applyTheme(true) : applyTheme(false);
}

function applyTheme(isDarkMode) {
    if (isDarkMode) {
        document.documentElement.setAttribute('data-bs-theme', 'dark');
        document.getElementById(darkLabel).innerHTML = darkLang;
        localStorage.setItem('darkMode', 'dark');
    } else {
        document.documentElement.setAttribute('data-bs-theme', 'light');
       /*  document.documentElement.removeAttribute('data-bs-theme'); */
        document.getElementById(darkLabel).innerHTML = lightLang;
        localStorage.setItem('darkMode', 'light');
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
    } else {
        const darkThemeSelected = localStorage.getItem('darkMode') !== null && localStorage.getItem('darkMode') === 'dark';
        darkMode.checked = darkThemeSelected;
        applyTheme(darkThemeSelected);
    }
}

detectSystemTheme(); // Llamada a la función para detectar el tema del sistema

darkMode.addEventListener('change', function () {
    resetTheme();
});