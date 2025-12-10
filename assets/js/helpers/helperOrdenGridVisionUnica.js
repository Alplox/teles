import { LS_KEY_ORDER_SINGLE_VIEW_MAIN_CONTAINERS } from "../constants/index.js";
import { showToast } from "./index.js";


export const CONTAINER_INTERNO_VISION_UNICA = document.querySelector('.single-view-grid');
const ID_EN_ORDEN_ORIGINAL = ['panel-canales-single-view', 'container-video-single-view'];

export function cargarOrdenVisionUnica() {
    try {
        const ordenGuardado = localStorage.getItem(LS_KEY_ORDER_SINGLE_VIEW_MAIN_CONTAINERS);
        let ordenAUsar = ID_EN_ORDEN_ORIGINAL;
        if (ordenGuardado) {
            try {
                const elementosOrdenados = JSON.parse(ordenGuardado);
                if (Array.isArray(elementosOrdenados) && elementosOrdenados.length === ID_EN_ORDEN_ORIGINAL.length) {
                    ordenAUsar = elementosOrdenados;
                }
            } catch (e) {
                console.error(`Error al parsear ${LS_KEY_ORDER_SINGLE_VIEW_MAIN_CONTAINERS}:`, e);
                localStorage.removeItem(LS_KEY_ORDER_SINGLE_VIEW_MAIN_CONTAINERS);
            }
        }
        ordenAUsar.forEach(id => {
            const elemento = document.getElementById(id);
            if (elemento) CONTAINER_INTERNO_VISION_UNICA.appendChild(elemento);
        });
        const esOrdenOriginal = JSON.stringify(ID_EN_ORDEN_ORIGINAL) === JSON.stringify(getOrdenActual());
        CONTAINER_INTERNO_VISION_UNICA.classList.toggle('single-view-grid-reordenado', !esOrdenOriginal);
    } catch (error) {
        console.error(`Error durante la carga orden paneles para modo "Visión Única". Error: ${error}`);
        showToast({
            title: 'Ha ocurrido un error durante la carga de orden de paneles para modo "Visión Única".',
            body: `Error: ${error}`,
            type: 'danger',
            autohide: false,
            delay: 0,
            showReloadOnError: true
        });
        return
    }
}

export function guardarOrdenPanelesVisionUnica() {
    let ordenActual = Array.from(CONTAINER_INTERNO_VISION_UNICA.children).map(item => item.id);
    localStorage.setItem(LS_KEY_ORDER_SINGLE_VIEW_MAIN_CONTAINERS, JSON.stringify(ordenActual));
}

function getOrdenActual() {
    return Array.from(CONTAINER_INTERNO_VISION_UNICA.children).map(item => item.id);
}
export function toggleClaseOrdenado() {
    const ordenActual = getOrdenActual();
    const esOrdenOriginal = JSON.stringify(ID_EN_ORDEN_ORIGINAL) === JSON.stringify(ordenActual);
    CONTAINER_INTERNO_VISION_UNICA.classList.toggle('single-view-grid-reordenado', !esOrdenOriginal);
}

