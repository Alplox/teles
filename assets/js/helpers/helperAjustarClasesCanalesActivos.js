import { CSS_CLASS_BUTTON_PRIMARY, LS_KEY_LAYOUT_FULL_HEIGHT_ENABLED, LS_KEY_BOOTSTRAP_COL_NUMBER } from "../constants/index.js";
import { showToast } from "./index.js";
import { obtainNumberOfChannelsPerRow } from "../utils/index.js";

import {
    buttonsNumberChannelsPerRow,
    gridViewContainerEl
} from "../main.js";

function AsignarClaseColumna(transmisionPorModifica, clasesPorAñadir) {
    if (!transmisionPorModifica || !clasesPorAñadir) return;
    const clasesAEliminar = ['col-12', 'col-6', 'col-4', 'col-3', 'col-2', 'col-1', 'col', 'vh-100', 'overflow-hidden'];
    transmisionPorModifica.classList.remove(...clasesAEliminar);
    transmisionPorModifica.classList.add(...clasesPorAñadir);
}

export function ajustarNumeroDivisionesClaseCol() {
    try {
        if (typeof isMobile === 'undefined' || !gridViewContainerEl) return;
        const transmisionesEnGrid = gridViewContainerEl.querySelectorAll('div[data-canal]');
        const lsTransmisionesFila = JSON.parse(localStorage.getItem(LS_KEY_BOOTSTRAP_COL_NUMBER));
        if (!lsTransmisionesFila || isNaN(Number(lsTransmisionesFila))) return;

        const isFullHeightMode = JSON.parse(localStorage.getItem(LS_KEY_LAYOUT_FULL_HEIGHT_ENABLED));
        const claseCienViewHeight = isFullHeightMode ? ['vh-100', 'overflow-hidden'] : [];

        if (isFullHeightMode) {
            gridViewContainerEl.classList.add('h-100');
        } else {
            gridViewContainerEl.classList.remove('h-100');
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
        showToast({
            title: 'Ha ocurrido un error al intentar ajustar el numero de canales por fila.',
            body: `Error: ${error}`,
            type: 'danger'
        })
        return;
    }
}

export function ajustarClaseColTransmisionesPorFila(columnaValue) {
    if (!columnaValue || isNaN(Number(columnaValue))) return;

    const botonDejarActivo = document.querySelector(`#container-botones-personalizar-transmisiones-por-fila button[value='${columnaValue}']`);
    if (!botonDejarActivo) return;
    buttonsNumberChannelsPerRow.forEach(boton => {
        boton.classList.replace(CSS_CLASS_BUTTON_PRIMARY, 'btn-light-subtle');
    });
    botonDejarActivo.classList.replace('btn-light-subtle', CSS_CLASS_BUTTON_PRIMARY);
    JSON.stringify(localStorage.setItem(LS_KEY_BOOTSTRAP_COL_NUMBER, columnaValue));
    ajustarNumeroDivisionesClaseCol();
}