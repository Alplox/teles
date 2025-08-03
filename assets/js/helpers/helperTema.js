import { CHECKBOX_PERSONALIZAR_TEMA } from '../botones.js'

const SPAN_VALOR_TEMA_ACTIVO = document.querySelector('#span-valor-tema');
const ICONO_PERSONALIZAR_TEMA = document.querySelector('#icono-personalizar-tema')
const THEME_DARK = 'dark';
const THEME_LIGHT = 'light';

export function aplicarTema(esTemaOscuro) {
    if (typeof document === 'undefined') return;
    if (esTemaOscuro) {
        if (CHECKBOX_PERSONALIZAR_TEMA) CHECKBOX_PERSONALIZAR_TEMA.checked = true;
        document.documentElement.setAttribute('data-bs-theme', THEME_DARK);
        if (SPAN_VALOR_TEMA_ACTIVO) SPAN_VALOR_TEMA_ACTIVO.textContent = 'Oscuro';
        ICONO_PERSONALIZAR_TEMA?.classList.replace('bi-sun', 'bi-moon-stars');
        if (localStorage.getItem('theme') !== THEME_DARK) localStorage.setItem('theme', THEME_DARK);
    } else {
        if (CHECKBOX_PERSONALIZAR_TEMA) CHECKBOX_PERSONALIZAR_TEMA.checked = false;
        document.documentElement.setAttribute('data-bs-theme', THEME_LIGHT);
        if (SPAN_VALOR_TEMA_ACTIVO) SPAN_VALOR_TEMA_ACTIVO.textContent = 'Claro';
        ICONO_PERSONALIZAR_TEMA?.classList.replace('bi-moon-stars', 'bi-sun');
        if (localStorage.getItem('theme') !== THEME_LIGHT) localStorage.setItem('theme', THEME_LIGHT);
    }
}

export function detectarTemaSistema() {
    const TEMA_LOCALSTORAGE = localStorage.getItem('theme');
    const PREFIERE_TEMA_OSCURO = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    aplicarTema(TEMA_LOCALSTORAGE === null ? PREFIERE_TEMA_OSCURO : TEMA_LOCALSTORAGE === THEME_DARK);
}