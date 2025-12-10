import { crearFragmentCanal } from "../canalUI.js";
import { channelsList } from "../canalesData.js";
import {
    AMBIENT_MUSIC,
    CSS_CLASS_BUTTON_PRIMARY,
    CSS_CLASS_BUTTON_SECONDARY,
    LS_KEY_ACTIVE_VIEW_MODE,
    LS_KEY_HORIZONTAL_WIDTH_VALUE,
    LS_KEY_SAVED_CHANNELS_GRID_VIEW
} from "../constants/index.js";

import {
    gridViewContainerEl,
    singleViewContainerEl,
    tele,
    widthRangeInputEl,
    widthRangeValueEl,
    checkboxElFullHeight,
    spanElFullHeight,
    spanElNumberChannelsPerRow,
    buttonsNumberChannelsPerRow,
    aplicarEstadoUrlDinamica,
    isDynamicUrlMode,
    checkboxElDynamicUrl,
    spanElDynamicUrlValue
} from "../main.js";

import {
    showToast,
    ajustarClaseBotonCanal,
    hideTextoBotonesOverlay,
    ajustarNumeroDivisionesClaseCol,
    registrarCambioManualCanales,
    limpiarParametroCompartidoEnUrl,
    limpiarRecursosTransmision,
    crearBotonesParaVisionUnica,
    cargarOrdenVisionUnica,
    adjustVisibilityButtonsRemoveAllActiveChannels
} from "../helpers/index.js";

import {
    obtainNumberOfChannelsPerRow,
    initializeBootstrapTooltips,
    disposeBootstrapTooltips
} from "../utils/index.js";

const BOTON_COPIAR_ENLACE_COMPARTIR_SETUP = document.querySelector('#boton-copiar-enlace-compartir-setup');
const INPUT_ENLACE_COMPARTIR_SETUP = document.querySelector('#input-enlace-compartir-setup');

export function activarVisionUnica() {
    try {
        if (!AMBIENT_MUSIC.paused) {
            adjustVisibilityButtonsRemoveAllActiveChannels();
        }

        cargarOrdenVisionUnica();
        const contenedorVision = document.querySelector('#single-view-channels-buttons-container');
        if (contenedorVision && !contenedorVision.querySelector('button[data-canal]')) {
            crearBotonesParaVisionUnica();
        }
        localStorage.setItem(LS_KEY_ACTIVE_VIEW_MODE, 'single-view');


        // En visión única limpiamos cualquier parámetro compartido `c`
        // y deshabilitamos controles pensados para la cuadrícula (URL dinámica y compartir setup).
        limpiarParametroCompartidoEnUrl(true);

        if (checkboxElDynamicUrl) {
            checkboxElDynamicUrl.disabled = true;
        }
        if (spanElDynamicUrlValue) {
            spanElDynamicUrlValue.dataset.textoPrevio = spanElDynamicUrlValue.textContent || '';
            spanElDynamicUrlValue.textContent = '[solo en visión cuadrícula]';
        }

        BOTON_COPIAR_ENLACE_COMPARTIR_SETUP?.setAttribute('disabled', 'disabled');
        INPUT_ENLACE_COMPARTIR_SETUP?.setAttribute('disabled', 'disabled');

        document.querySelectorAll('#single-view-channels-buttons-container button, #modal-cambiar-canal-channels-buttons-container button').forEach(botonCanalEnDOM => {
            botonCanalEnDOM.classList.replace(CSS_CLASS_BUTTON_PRIMARY, CSS_CLASS_BUTTON_SECONDARY);
        });

        const CANALES_ACTIVOS_EN_DOM = gridViewContainerEl.querySelectorAll('div[data-canal]');
        if (CANALES_ACTIVOS_EN_DOM.length > 0) {
            CANALES_ACTIVOS_EN_DOM.forEach(divCanal => {
                divCanal.innerHTML = ''; // limpia html en vez de remover para evitar activar observer
                divCanal.dataset.respaldo = divCanal.dataset.canal;
                divCanal.dataset.canal = `no-${divCanal.dataset.canal}`;
            });
        };

        gridViewContainerEl.classList.add('d-none');
        singleViewContainerEl.classList.remove('d-none');
        document.querySelector('nav .btn-group').classList.add('d-none');
        document.querySelector('nav a.gradient-text').classList.remove('d-none');

        let divBotonesFlotantes = document.querySelector('#grupo-botones-flotantes');
        divBotonesFlotantes.querySelector('.btn-indigo').classList.add('d-none');
        divBotonesFlotantes.querySelector('div.bg-light-subtle').classList.add('d-none');
        divBotonesFlotantes.querySelector('.btn-dark').classList.replace('rounded-end-5', 'rounded-pill');

        widthRangeInputEl.disabled = true;
        widthRangeValueEl.textContent = 'Deshabilitado';

        checkboxElFullHeight.disabled = true;
        spanElFullHeight.textContent = 'Deshabilitado';

        buttonsNumberChannelsPerRow.forEach(boton => { boton.disabled = true });
        spanElNumberChannelsPerRow.innerHTML = `Deshabilitado`;

        let lsCanales = JSON.parse(localStorage.getItem(LS_KEY_SAVED_CHANNELS_GRID_VIEW)) || {};

        if (Object.keys(lsCanales).length > 0) {
            try {
                if (channelsList[Object.keys(lsCanales)[0]]) {
                    tele.add(Object.keys(lsCanales)[0]);
                }
            } catch (error) {
                return console.error(`Error durante carga canales para modo single view. Error: ${error}`);
            }
        };

        document.querySelector('#boton-personalizar-boton-mover-overlay').classList.add('clase-vacia'); // esto es solo para mediaquery en css
    } catch (error) {
        console.error(`Error durante la activación del modo "Visión Única". Error: ${error}`);
        showToast({
            title: 'Ha ocurrido un error al intentar activar el modo "Visión Única".',
            body: `Error: ${error}`,
            type: 'danger',
            autohide: false,
            delay: 0,
            showReloadOnError: true
        })
        return
    }
}

export function desactivarVisionUnica({ evitarCargaPredeterminados = false } = {}) {
    try {

        localStorage.setItem(LS_KEY_ACTIVE_VIEW_MODE, 'grid-view');

        const CANAL_ACTIVO_VISION_UNICA = singleViewContainerEl.querySelector('div[data-canal]');
        let canalActivoVisionUnica = CANAL_ACTIVO_VISION_UNICA?.dataset.canal;

        // tele.remove() alternativo, para evitar que guarde string vacio en localStorage
        try {
            if (CANAL_ACTIVO_VISION_UNICA !== null) {
                limpiarRecursosTransmision(CANAL_ACTIVO_VISION_UNICA);
                disposeBootstrapTooltips();
                CANAL_ACTIVO_VISION_UNICA.remove();
            }

            ajustarClaseBotonCanal(canalActivoVisionUnica, false);
            initializeBootstrapTooltips();
            registrarCambioManualCanales();
        } catch (error) {
            console.error(`Error durante eliminación de canal activo en modo "Visión Única". Error: ${error}`);
            showToast({
                title: 'Ha ocurrido un error durante eliminación de canal activo en modo "Visión Única".',
                body: `Error: ${error}`,
                type: 'danger',
                autohide: false,
                delay: 0,
                showReloadOnError: true
            })
            return
        }

        const CANALES_ACTIVOS_EN_DOM = gridViewContainerEl.querySelectorAll('div[data-canal]');

        if (CANALES_ACTIVOS_EN_DOM.length > 0) {
            CANALES_ACTIVOS_EN_DOM.forEach(divCanal => {
                divCanal.dataset.canal = divCanal.dataset.respaldo;
                divCanal.append(crearFragmentCanal(divCanal.dataset.canal));
                ajustarClaseBotonCanal(divCanal.dataset.canal, true);
                initializeBootstrapTooltips();
                hideTextoBotonesOverlay();
                divCanal.removeAttribute('data-respaldo');
            });
        } else if (!evitarCargaPredeterminados) {
            tele.cargaCanalesPredeterminados();
        }


        const hasActiveChannels = CANALES_ACTIVOS_EN_DOM.length > 0;

        if (!hasActiveChannels) {
            adjustVisibilityButtonsRemoveAllActiveChannels();
        }

        gridViewContainerEl.classList.remove('d-none');
        singleViewContainerEl.classList.add('d-none');
        document.querySelector('nav .btn-group').classList.remove('d-none');
        document.querySelector('nav a.gradient-text').classList.add('d-none');

        let divBotonesFlotantes = document.querySelector('#grupo-botones-flotantes');
        divBotonesFlotantes.querySelector('.btn-indigo').classList.remove('d-none');
        divBotonesFlotantes.querySelector('div.bg-light-subtle').classList.remove('d-none');
        divBotonesFlotantes.querySelector('.btn-dark').classList.replace('rounded-pill', 'rounded-end-5');

        widthRangeInputEl.disabled = false;
        widthRangeValueEl.textContent = JSON.parse(localStorage.getItem(LS_KEY_HORIZONTAL_WIDTH_VALUE)) ?? 100;

        checkboxElFullHeight.disabled = false;
        spanElFullHeight.textContent =
            checkboxElFullHeight.checked ? 'Expandido' : 'Reducido';

        buttonsNumberChannelsPerRow.forEach(boton => { boton.disabled = false });
        spanElNumberChannelsPerRow.innerHTML = `${obtainNumberOfChannelsPerRow()}`;

        ajustarNumeroDivisionesClaseCol();

        document.querySelector('#boton-personalizar-boton-mover-overlay').classList.remove('clase-vacia');

        if (checkboxElDynamicUrl) {
            checkboxElDynamicUrl.disabled = false;
        }
        if (spanElDynamicUrlValue) {
            const textoPrevio = spanElDynamicUrlValue.dataset.textoPrevio;
            if (textoPrevio) {
                spanElDynamicUrlValue.textContent = textoPrevio;
            } else {
                aplicarEstadoUrlDinamica(isDynamicUrlMode);
            }
        }

        BOTON_COPIAR_ENLACE_COMPARTIR_SETUP?.removeAttribute('disabled');
        INPUT_ENLACE_COMPARTIR_SETUP?.removeAttribute('disabled');

        registrarCambioManualCanales({ forzar: true });
    } catch (error) {
        console.error(`Error durante la desactivación del modo "Visión Única". Error: ${error}`);
        showToast({
            title: 'Ha ocurrido un error al intentar desactivar el modo "Visión Única".',
            body: `Error: ${error}`,
            type: 'danger',
            autohide: false,
            delay: 0,
            showReloadOnError: true
        });
        return
    }
}