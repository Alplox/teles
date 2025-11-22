import { CLASE_CSS_BOTON_PRIMARIO, LS_KEY_FULL_HEIGHT_MODE, LS_KEY_BOOTSTRAP_COL_NUMBER } from "../constants/index.js";
import { mostrarToast } from "./index.js";
import { obtainNumberOfChannelsPerRow } from "../utils/index.js";

import { 
    BOTONES_PERSONALIZAR_TRANSMISIONES_POR_FILA,
    CONTAINER_VISION_CUADRICULA
} from "../main.js";

function AsignarClaseColumna(transmisionPorModifica, clasesPorAñadir) {
    if (!transmisionPorModifica || !clasesPorAñadir) return;
    const clasesAEliminar = ['col-12', 'col-6', 'col-4', 'col-3', 'col-2', 'col-1', 'col', 'vh-100', 'overflow-hidden'];
    transmisionPorModifica.classList.remove(...clasesAEliminar);
    transmisionPorModifica.classList.add(...clasesPorAñadir);
}

export function ajustarNumeroDivisionesClaseCol() {
    try {
        if (typeof isMobile === 'undefined' || !CONTAINER_VISION_CUADRICULA) return;
        const transmisionesEnGrid = CONTAINER_VISION_CUADRICULA.querySelectorAll('div[data-canal]');
        const lsTransmisionesFila = JSON.parse(localStorage.getItem(LS_KEY_BOOTSTRAP_COL_NUMBER));
        if (!lsTransmisionesFila || isNaN(Number(lsTransmisionesFila))) return;
        
        const isFullHeightMode = JSON.parse(localStorage.getItem(LS_KEY_FULL_HEIGHT_MODE));
        const claseCienViewHeight = isFullHeightMode ? ['vh-100', 'overflow-hidden'] : [];
        
        if (isFullHeightMode) {
            CONTAINER_VISION_CUADRICULA.classList.add('h-100');
        } else {
            CONTAINER_VISION_CUADRICULA.classList.remove('h-100');
        }        
        const numCanalesFila = obtainNumberOfChannelsPerRow();
        
        if (!isMobile.any) {
            if (transmisionesEnGrid.length < numCanalesFila && !isFullHeightMode) {
                for (let transmisionActiva of transmisionesEnGrid) {
                    AsignarClaseColumna(transmisionActiva, [`col-${lsTransmisionesFila}`]);
                }
            } else if (transmisionesEnGrid.length < numCanalesFila) {
                for (let transmisionActiva of transmisionesEnGrid) {
                    AsignarClaseColumna(transmisionActiva, ['col', ...claseCienViewHeight]);
                }
            } else {
                for (let transmisionActiva of transmisionesEnGrid) {
                    AsignarClaseColumna(transmisionActiva, [`col-${lsTransmisionesFila}`]);
                    if (lsTransmisionesFila === 12 || lsTransmisionesFila === 6) transmisionActiva.classList.add(...claseCienViewHeight);
                }
            }
        } else if (screen.orientation && screen.orientation.type === 'landscape-primary') {
            if (transmisionesEnGrid.length < numCanalesFila) {
                for (let transmisionActiva of transmisionesEnGrid) {
                    AsignarClaseColumna(transmisionActiva, ['col', ...claseCienViewHeight]);
                }
            } else {
                for (let transmisionActiva of transmisionesEnGrid) {
                    AsignarClaseColumna(transmisionActiva, [`col-${lsTransmisionesFila}`]);
                    if (lsTransmisionesFila === 12 || lsTransmisionesFila === 6) transmisionActiva.classList.add(...claseCienViewHeight);
                }
            }
        } else {
            if (transmisionesEnGrid.length < numCanalesFila) {
                for (let transmisionActiva of transmisionesEnGrid) {
                    AsignarClaseColumna(transmisionActiva, ['col', ...claseCienViewHeight]);
                }
            } else {
                for (let transmisionActiva of transmisionesEnGrid) {
                    AsignarClaseColumna(transmisionActiva, [`col-${lsTransmisionesFila}`]);
                }
            }
        }
    } catch (error) {
        console.error('Error al ajustar clase "col" para canales activos: ', error);
        mostrarToast(`
        <span class="fw-bold">Ha ocurrido un error al intentar ajustar el numero de canales por fila.</span>
        <hr>
        <span class="bg-dark bg-opacity-25 px-2 rounded-3">Error: ${error}</span>
        <hr>
        Si error persiste tras recargar, prueba borrar tu almacenamiento local desde el panel "Personalización" o borrando la caché del navegador.
        <button type="button" class="btn btn-light rounded-pill btn-sm w-100 border-light mt-2" onclick="location.reload()"> Pulsa para recargar <i class="bi bi-arrow-clockwise"></i></button>
        `, 'danger', false);
        return;
    }
}

export function ajustarClaseColTransmisionesPorFila(columnaValue) {
    if (!columnaValue || isNaN(Number(columnaValue))) return;

    const botonDejarActivo = document.querySelector(`#container-botones-personalizar-transmisiones-por-fila button[value='${columnaValue}']`);
    if (!botonDejarActivo) return;
    BOTONES_PERSONALIZAR_TRANSMISIONES_POR_FILA.forEach(boton => {
        boton.classList.replace(CLASE_CSS_BOTON_PRIMARIO, 'btn-light-subtle');
    });
    botonDejarActivo.classList.replace('btn-light-subtle', CLASE_CSS_BOTON_PRIMARIO);
    JSON.stringify(localStorage.setItem(LS_KEY_BOOTSTRAP_COL_NUMBER, columnaValue));
    ajustarNumeroDivisionesClaseCol();
}