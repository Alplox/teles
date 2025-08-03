import { PREFIJOS_ID_CONTENEDORES_CANALES } from "../constants/index.js";

// Almacenar el orden original de los botones como identificadores únicos
const ordenOriginal = {
    'modal-canales': [],
    'offcanvas-canales': [],
    'modal-cambiar-canal': [],
    'vision-unica': []
};

export function guardarOrdenOriginal(containerBotones) {
    try {
        const BOTONES_EN_CONTENEDOR = Array.from(document.querySelectorAll(`#${containerBotones} button`));
        const ids = BOTONES_EN_CONTENEDOR.map(btn => btn.getAttribute('data-canal'));
        for (const PREFIJO of PREFIJOS_ID_CONTENEDORES_CANALES) {
            if (containerBotones.startsWith(PREFIJO)) {
                ordenOriginal[PREFIJO] = ids;
            }
        }
    } catch (e) {
        console.error('Error en guardarOrdenOriginal:', e);
        return;
    }
}

export function ordenarBotonesCanalesAscendente(containerBotones) {
    try {
        const BODY_CONTENEDOR_BOTONES = document.querySelector(`#${containerBotones}`);
        if (!BODY_CONTENEDOR_BOTONES) return;
        const BOTONES_EN_CONTENEDOR = Array.from(BODY_CONTENEDOR_BOTONES.querySelectorAll('button'));
        BOTONES_EN_CONTENEDOR.sort((a, b) => a.textContent.trim().localeCompare(b.textContent.trim()));
        const fragment = document.createDocumentFragment();
        BOTONES_EN_CONTENEDOR.forEach(botonCanal => {
            fragment.append(botonCanal);
        });
        BODY_CONTENEDOR_BOTONES.innerHTML = '';
        BODY_CONTENEDOR_BOTONES.append(fragment);
    } catch (e) {
        console.error('Error en ordenarBotonesCanalesAscendente:', e);
        return;
    }
}

export function ordenarBotonesCanalesDescendente(containerBotones) {
    try {
        const BODY_CONTENEDOR_BOTONES = document.querySelector(`#${containerBotones}`);
        if (!BODY_CONTENEDOR_BOTONES) return;
        const BOTONES_EN_CONTENEDOR = Array.from(BODY_CONTENEDOR_BOTONES.querySelectorAll('button'));
        BOTONES_EN_CONTENEDOR.sort((a, b) => b.textContent.trim().localeCompare(a.textContent.trim()));
        const fragment = document.createDocumentFragment();
        BOTONES_EN_CONTENEDOR.forEach(botonCanal => {
            fragment.append(botonCanal);
        });
        BODY_CONTENEDOR_BOTONES.innerHTML = '';
        BODY_CONTENEDOR_BOTONES.append(fragment);
    } catch (e) {
        console.error('Error en ordenarBotonesCanalesDescendente:', e);
        return;
    }
}

export function restaurarOrdenOriginalBotonesCanales(containerBotones) {
    try {
        const BODY_CONTENEDOR_BOTONES = document.querySelector(`#${containerBotones}`);
        if (!BODY_CONTENEDOR_BOTONES) return;
        let idsOriginales;
        for (const PREFIJO of PREFIJOS_ID_CONTENEDORES_CANALES) {
            if (containerBotones.startsWith(PREFIJO)) {
                idsOriginales = ordenOriginal[PREFIJO];
                break;
            }
        }
        if (!Array.isArray(idsOriginales)) return;
        const fragment = document.createDocumentFragment();
        idsOriginales.forEach(id => {
            const boton = BODY_CONTENEDOR_BOTONES.querySelector(`button[data-canal="${id}"]`);
            if (boton) fragment.append(boton);
        });
        BODY_CONTENEDOR_BOTONES.innerHTML = '';
        BODY_CONTENEDOR_BOTONES.append(fragment);
    } catch (e) {
        console.error('Error en restaurarOrdenOriginalBotonesCanales:', e);
        return;
    }
}