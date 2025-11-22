import { LS_KEY_FLOATING_BUTTONS_POSITION } from "../constants/localStorageKeys.js";
import { BOTONES_REPOSICIONAR_BOTONES_FLOTANTES } from "../main.js";

export function alternarPosicionBotonesFlotantes(topClass, startClass, marginClass, translateClass) {
    const divBotonesFlotantes = document.querySelector('#grupo-botones-flotantes');
    if (!divBotonesFlotantes) return;
    divBotonesFlotantes.classList.remove(
        'top-0', 'top-50', 'bottom-0',
        'start-0', 'start-50', 'end-0',
        'translate-middle-x', 'translate-middle-y', 'translate-middle',
        'mb-3', 'mt-3'
    );
    // Validar que los argumentos sean strings válidos y no duplicar clases
    const clasesPorAgregar = new Set();
    [topClass, startClass, marginClass, translateClass].forEach(clase => {
        if (typeof clase === 'string' && clase.trim() !== '') {
            clasesPorAgregar.add(clase);
        }
    });
    clasesPorAgregar.forEach(clase => divBotonesFlotantes.classList.add(clase));
}

export function clicBotonPosicionBotonesFlotantes(topClass, startClass, margin = '', translateClass = '') {
    alternarPosicionBotonesFlotantes(topClass, startClass, margin, translateClass);
    const posicionElegida = {
        top: typeof topClass === 'string' ? topClass : '',
        start: typeof startClass === 'string' ? startClass : '',
        margin: typeof margin === 'string' ? margin : '',
        translate: typeof translateClass === 'string' ? translateClass : ''
    };
    // Solo guardar si la posición cambió y manejar localStorage seguro
    try {
        const actual = localStorage.getItem(LS_KEY_FLOATING_BUTTONS_POSITION);
        if (!actual || actual !== JSON.stringify(posicionElegida)) {
            localStorage.setItem(LS_KEY_FLOATING_BUTTONS_POSITION, JSON.stringify(posicionElegida));
        }
    } catch (e) {
        console.warn('No se pudo guardar la posición de los botones flotantes en localStorage:', e);
    }
}

function esBotonReposicionar(boton, top, start, margin, translate) {
    const BOTON_DATASET_POSITION = boton.dataset.position.split(' ');
    return BOTON_DATASET_POSITION[0] === top && BOTON_DATASET_POSITION[1] === start && (BOTON_DATASET_POSITION[2] || '') === (margin || '') && (BOTON_DATASET_POSITION[3] || '') === (translate || '');
}

export function actualizarBotonesFlotantes(top, start, margin, translate) {
    alternarPosicionBotonesFlotantes(top, start, margin, translate);
    BOTONES_REPOSICIONAR_BOTONES_FLOTANTES.forEach(boton => {
        boton.checked = esBotonReposicionar(boton, top, start, margin, translate);
    });
}
