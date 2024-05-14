import { CHECKBOX_PERSONALIZAR_TEMA } from './botones.js'

const SPAN_VALOR_TEMA_ACTIVO = document.querySelector('#span-valor-tema');
const ICONO_PERSONALIZAR_TEMA = document.querySelector('#icono-personalizar-tema')

export function aplicarTema(esTemaOscuro) {
    if (esTemaOscuro) {
        CHECKBOX_PERSONALIZAR_TEMA.checked = true;
        document.documentElement.setAttribute('data-bs-theme', 'dark');
        SPAN_VALOR_TEMA_ACTIVO.textContent = 'Oscuro';
        ICONO_PERSONALIZAR_TEMA.classList.replace('bi-sun', 'bi-moon-stars')
        localStorage.setItem('theme', 'dark');
    } else {
        CHECKBOX_PERSONALIZAR_TEMA.checked = false;
        document.documentElement.setAttribute('data-bs-theme', 'light');
        SPAN_VALOR_TEMA_ACTIVO.textContent = 'Claro';
        ICONO_PERSONALIZAR_TEMA.classList.replace('bi-moon-stars', 'bi-sun')
        localStorage.setItem('theme', 'light');
    }
}

export function detectarTemaSistema() {
    const TEMA_LOCALSTORAGE = localStorage.getItem('theme');
    const PREFIERE_TEMA_OSCURO = window.matchMedia("(prefers-color-scheme: dark)").matches;
    aplicarTema(TEMA_LOCALSTORAGE === null ? PREFIERE_TEMA_OSCURO : TEMA_LOCALSTORAGE === 'dark');
}