import { PREFIJOS_ID_CONTENEDORES_CANALES } from './main.js'

// Almacenar el orden original de los botones
const ordenOriginal = {
    'modal-canales': [],
    'offcanvas-canales': [],
    'modal-cambiar-canal': [],
    'vision-unica': []
};

export function guardarOrdenOriginal(containerBotones) {
    const BOTONES_EN_CONTENEDOR = Array.from(document.querySelectorAll(`#${containerBotones} button`));
    for (const PREFIJO of PREFIJOS_ID_CONTENEDORES_CANALES) {
        if (containerBotones.startsWith(PREFIJO)) {
            ordenOriginal[PREFIJO] = BOTONES_EN_CONTENEDOR;
        }
    }
}

export function ordenarBotonesCanalesAscendente(containerBotones) {
    const BODY_CONTENEDOR_BOTONES = document.querySelector(`#${containerBotones}`);
    const BOTONES_EN_CONTENEDOR = Array.from(document.querySelectorAll(`#${containerBotones} button`));

    BOTONES_EN_CONTENEDOR.sort((a, b) => {
        return a.textContent.trim().localeCompare(b.textContent.trim());
    });

    BOTONES_EN_CONTENEDOR.forEach(botonCanal => {
        BODY_CONTENEDOR_BOTONES.append(botonCanal);
    });
}

export function ordenarBotonesCanalesDescendente(containerBotones) {
    const BODY_CONTENEDOR_BOTONES = document.querySelector(`#${containerBotones}`);
    const BOTONES_EN_CONTENEDOR = Array.from(document.querySelectorAll(`#${containerBotones} button`));

    BOTONES_EN_CONTENEDOR.sort((a, b) => {
        return b.textContent.trim().localeCompare(a.textContent.trim());
    });

    BOTONES_EN_CONTENEDOR.forEach(botonCanal => {
        BODY_CONTENEDOR_BOTONES.append(botonCanal);
    });
}

export function restaurarOrdenOriginalBotonesCanales(containerBotones) {
    const BODY_CONTENEDOR_BOTONES = document.querySelector(`#${containerBotones}`);
    let botonesOriginales;

    for (const PREFIJO of PREFIJOS_ID_CONTENEDORES_CANALES) {
        if (containerBotones.startsWith(PREFIJO)) {
            botonesOriginales = ordenOriginal[PREFIJO];

            BODY_CONTENEDOR_BOTONES.innerHTML = ''

            botonesOriginales.forEach(botonCanal => {
                BODY_CONTENEDOR_BOTONES.append(botonCanal);
            });
        }
    }
}