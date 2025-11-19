import { crearFragmentCanal } from "../canalUI.js";
import { crearBotonesParaVisionUnica } from "./helperGenerarBotonesCanales.js";
import {
    CONTAINER_VISION_CUADRICULA,
    CONTAINER_VISION_UNICA,
    BOTON_ACTIVAR_VISION_UNICA,
    BOTON_ACTIVAR_VISION_GRID,
    tele,
    INPUT_RANGE_PERSONALIZACION_TAMAÑO_VISION_CUADRICULA,
    SPAN_VALOR_INPUT_RANGE,
    CHECKBOX_PERSONALIZAR_USO_100VH_CANALES,
    SPAN_VALOR_CHECKBOX_PERSONALIZAR_USO_100VH_CANALES,
    BOTONES_PERSONALIZAR_TRANSMISIONES_POR_FILA,
    CONTAINER_VIDEO_VISION_UNICA,
    SPAN_VALOR_TRANSMISIONES_POR_FILA,
    ICONO_SIN_SEÑAL_ACTIVA_VISION_UNICA,
    aplicarEstadoUrlDinamica,
    limpiarParametroCompartidoEnUrl,
    registrarCambioManualCanales,
} from "../main.js";

import {
    actualizarValorSlider,
    mostrarToast,
    activarTooltipsBootstrap,
    ajustarClaseBotonCanal,
    obtenerNumeroCanalesFila,
    actualizarBotonesPersonalizarOverlay,
    hideTextoBotonesOverlay,
    ajustarNumeroDivisionesClaseCol,
    removerTooltipsBootstrap,
} from "../helpers/index.js";
import { CLASE_CSS_BOTON_PRIMARIO, CLASE_CSS_BOTON_SECUNDARIO } from "../constants/index.js";
import { listaCanales } from "../canalesData.js";

const BOTON_COPIAR_ENLACE_COMPARTIR_SETUP = document.querySelector('#boton-copiar-enlace-compartir-setup');
const INPUT_ENLACE_COMPARTIR_SETUP = document.querySelector('#input-enlace-compartir-setup');
const CHECKBOX_URL_DINAMICA_PERSONALIZACION = document.querySelector('#checkbox-url-dinamica');
const SPAN_VALOR_URL_DINAMICA = document.querySelector('#span-valor-url-dinamica');

export function activarVisionUnica() {
    try {

        const contenedorVision = document.querySelector('#vision-unica-body-botones-canales');
        if (contenedorVision && !contenedorVision.querySelector('button[data-canal]')) {
            crearBotonesParaVisionUnica();
        }
        localStorage.setItem('diseño-seleccionado', 'vision-unica');

        BOTON_ACTIVAR_VISION_UNICA.classList.replace('btn-light-subtle', 'btn-indigo');
        BOTON_ACTIVAR_VISION_GRID.classList.replace('btn-indigo', 'btn-light-subtle');

        // En visión única limpiamos cualquier parámetro compartido `c`
        // y deshabilitamos controles pensados para la cuadrícula (URL dinámica y compartir setup).
        limpiarParametroCompartidoEnUrl(true);

        if (CHECKBOX_URL_DINAMICA_PERSONALIZACION) {
            CHECKBOX_URL_DINAMICA_PERSONALIZACION.disabled = true;
        }
        if (SPAN_VALOR_URL_DINAMICA) {
            SPAN_VALOR_URL_DINAMICA.dataset.textoPrevio = SPAN_VALOR_URL_DINAMICA.textContent || '';
            SPAN_VALOR_URL_DINAMICA.textContent = '[solo en visión cuadrícula]';
        }

        BOTON_COPIAR_ENLACE_COMPARTIR_SETUP?.setAttribute('disabled', 'disabled');
        INPUT_ENLACE_COMPARTIR_SETUP?.setAttribute('disabled', 'disabled');

        document.querySelectorAll('#vision-unica-body-botones-canales button, #modal-cambiar-canal-body-botones-canales button').forEach(botonCanalEnDOM => {
            botonCanalEnDOM.classList.replace(CLASE_CSS_BOTON_PRIMARIO, CLASE_CSS_BOTON_SECUNDARIO);
        });

        const CANALES_ACTIVOS_EN_DOM = CONTAINER_VISION_CUADRICULA.querySelectorAll('div[data-canal]');
        if (CANALES_ACTIVOS_EN_DOM.length > 0) {
            CANALES_ACTIVOS_EN_DOM.forEach(divCanal => {
                divCanal.innerHTML = ''; // limpia html en vez de remover para evitar activar observer
                divCanal.dataset.respaldo = divCanal.dataset.canal;
                divCanal.dataset.canal = `no-${divCanal.dataset.canal}`;
            });
        };

        CONTAINER_VISION_CUADRICULA.classList.add('d-none');
        CONTAINER_VISION_UNICA.classList.remove('d-none');
        document.querySelector('nav .btn-group').classList.add('d-none');
        document.querySelector('nav a.gradient-text').classList.remove('d-none');

        let divBotonesFlotantes = document.querySelector('#grupo-botones-flotantes');
        divBotonesFlotantes.querySelector('.btn-indigo').classList.add('d-none');
        divBotonesFlotantes.querySelector('div.bg-light-subtle').classList.add('d-none');
        divBotonesFlotantes.querySelector('.btn-dark').classList.replace('rounded-end-5', 'rounded-pill');

        actualizarBotonesPersonalizarOverlay();

        INPUT_RANGE_PERSONALIZACION_TAMAÑO_VISION_CUADRICULA.disabled = true;
        SPAN_VALOR_INPUT_RANGE.textContent = 'Deshabilitado';

        CHECKBOX_PERSONALIZAR_USO_100VH_CANALES.disabled = true;
        SPAN_VALOR_CHECKBOX_PERSONALIZAR_USO_100VH_CANALES.textContent = 'Deshabilitado';

        BOTONES_PERSONALIZAR_TRANSMISIONES_POR_FILA.forEach(boton => { boton.disabled = true });
        SPAN_VALOR_TRANSMISIONES_POR_FILA.innerHTML = `Deshabilitado`;

        let lsCanales = JSON.parse(localStorage.getItem('canales-vision-cuadricula')) || {};

        if (CONTAINER_VIDEO_VISION_UNICA.querySelector('div[data-canal]')) tele.remove(CONTAINER_VIDEO_VISION_UNICA.querySelector('div[data-canal]').dataset.canal);

        if (Object.keys(lsCanales).length > 0) {
            try {
                if (listaCanales[Object.keys(lsCanales)[0]]) {
                    tele.add(Object.keys(lsCanales)[0]);
                }
            } catch (error) {
                return console.error(`Error durante carga canales para modo vision unica. Error: ${error}`);
            }
        };

        document.querySelector('#boton-personalizar-boton-mover-overlay').classList.add('clase-vacia'); // esto es solo para mediaquery en css
    } catch (error) {
        console.error(`Error durante la activación del modo "Visión Única". Error: ${error}`);
        mostrarToast(`
        <span class="fw-bold">Ha ocurrido un error durante la activación del modo "Visión Única".</span>
        <hr>
        <span class="bg-dark bg-opacity-25 px-2 rounded-3">Error: ${error}</span>
        <hr>
        Si error persiste tras recargar, prueba borrar tu almacenamiento local desde el panel "Personalización" o borrando la caché del navegador.
        <button type="button" class="btn btn-light rounded-pill btn-sm w-100 border-light mt-2" onclick="location.reload()"> Pulsa para recargar <i class="bi bi-arrow-clockwise"></i></button>`, 'danger', false)
        return
    }
}

export function desactivarVisionUnica({ evitarCargaPredeterminados = false } = {}) {
    try {

        localStorage.setItem('diseño-seleccionado', 'vision-cuadricula');

        BOTON_ACTIVAR_VISION_UNICA.classList.replace('btn-indigo', 'btn-light-subtle');
        BOTON_ACTIVAR_VISION_GRID.classList.replace('btn-light-subtle', 'btn-indigo');

        const CANAL_ACTIVO_VISION_UNICA = CONTAINER_VISION_UNICA.querySelector('div[data-canal]');
        let canalActivoVisionUnica = CANAL_ACTIVO_VISION_UNICA?.dataset.canal;

        // tele.remove() alternativa, para evitar que guarde string vacio en localStorage
        try {
            if (!CANAL_ACTIVO_VISION_UNICA || !canalActivoVisionUnica) {
                console.warn(`[teles] Se intentó eliminar canal "${canalActivoVisionUnica}" pero no se encontró ninguna transmisión activa. Se actualizará solo el estado visual.`);
                return;
            }

            // Buscar el elemento <video> dentro del contenedor específico del canal.
            // Esto es necesario para obtener la instancia de Video.js y poder destruirla correctamente antes de eliminar el DOM.
            // Evita que queden referencias vivas en memoria o que el reproductor siga ejecutando peticiones de red tras su remoción.
            let videoElement = CANAL_ACTIVO_VISION_UNICA.querySelector('video');
            if (videoElement && videoElement.classList.contains('video-js')) {
                let player = videojs(videoElement);
                if (player) {
                    console.log(`Disposing player for canal "${canalActivoVisionUnica}"...`);
                    player.dispose();
                }
            }

            const clapprContainer = CANAL_ACTIVO_VISION_UNICA.querySelector('[contenedor-canal-cambio]');
            if (clapprContainer && clapprContainer._clapprPlayer && typeof clapprContainer._clapprPlayer.destroy === 'function') {
                try {
                    console.log(`Destroying Clappr player for canal "${canalActivoVisionUnica}"...`);
                    clapprContainer._clapprPlayer.destroy();
                } catch (errorClappr) {
                    console.error(`Error al destruir Clappr para canal "${canalActivoVisionUnica}":`, errorClappr);
                }
            }

            removerTooltipsBootstrap();
            CANAL_ACTIVO_VISION_UNICA.remove();

            ICONO_SIN_SEÑAL_ACTIVA_VISION_UNICA.classList.remove('d-none');

            ajustarClaseBotonCanal(canalActivoVisionUnica, false);
            activarTooltipsBootstrap();
            registrarCambioManualCanales();
        } catch (error) {
            console.error(`Error durante eliminación div de canal de vision unica con id: ${canalActivoVisionUnica}. Error: ${error}`);
            mostrarToast(`
                    <span class="fw-bold">Ha ocurrido un error durante la eliminación canal de vision unica con id: ${canalActivoVisionUnica}.</span>
                    <hr>
                    <span class="bg-dark bg-opacity-25 px-2 rounded-3">Error: ${error}</span>
                    <hr>
                    Si error persiste tras recargar, prueba borrar tu almacenamiento local desde el panel "Personalización" o borrando la caché del navegador.
                    <button type="button" class="btn btn-light rounded-pill btn-sm w-100 border-light mt-2" onclick="location.reload()"> Pulsa para recargar <i class="bi bi-arrow-clockwise"></i></button>`, 'danger', false)
            return
        }

        // Ajustar icono sin señal activa
        ICONO_SIN_SEÑAL_ACTIVA_VISION_UNICA.classList.remove('d-none');

        const CANALES_ACTIVOS_EN_DOM = CONTAINER_VISION_CUADRICULA.querySelectorAll('div[data-canal]');

        if (CANALES_ACTIVOS_EN_DOM.length > 0) {
            CANALES_ACTIVOS_EN_DOM.forEach(divCanal => {
                divCanal.dataset.canal = divCanal.dataset.respaldo;
                divCanal.append(crearFragmentCanal(divCanal.dataset.canal));
                ajustarClaseBotonCanal(divCanal.dataset.canal, true);
                activarTooltipsBootstrap();
                hideTextoBotonesOverlay();
                divCanal.removeAttribute('data-respaldo');
            });
        } else if (!evitarCargaPredeterminados) {
            tele.cargaCanalesPredeterminados();
        }

        CONTAINER_VISION_CUADRICULA.classList.remove('d-none');
        CONTAINER_VISION_UNICA.classList.add('d-none');
        document.querySelector('nav .btn-group').classList.remove('d-none');
        document.querySelector('nav a.gradient-text').classList.add('d-none');

        let divBotonesFlotantes = document.querySelector('#grupo-botones-flotantes');
        divBotonesFlotantes.querySelector('.btn-indigo').classList.remove('d-none');
        divBotonesFlotantes.querySelector('div.bg-light-subtle').classList.remove('d-none');
        divBotonesFlotantes.querySelector('.btn-dark').classList.replace('rounded-pill', 'rounded-end-5');

        actualizarBotonesPersonalizarOverlay();

        INPUT_RANGE_PERSONALIZACION_TAMAÑO_VISION_CUADRICULA.disabled = false;
        actualizarValorSlider();

        CHECKBOX_PERSONALIZAR_USO_100VH_CANALES.disabled = false;
        SPAN_VALOR_CHECKBOX_PERSONALIZAR_USO_100VH_CANALES.textContent = localStorage.getItem('uso-100vh') === 'activo' ? 'Expandido' : 'Reducido';

        BOTONES_PERSONALIZAR_TRANSMISIONES_POR_FILA.forEach(boton => { boton.disabled = false });
        SPAN_VALOR_TRANSMISIONES_POR_FILA.innerHTML = `${obtenerNumeroCanalesFila()}`;

        ajustarNumeroDivisionesClaseCol();

        document.querySelector('#boton-personalizar-boton-mover-overlay').classList.remove('clase-vacia');

        if (CHECKBOX_URL_DINAMICA_PERSONALIZACION) {
            CHECKBOX_URL_DINAMICA_PERSONALIZACION.disabled = false;
        }
        if (SPAN_VALOR_URL_DINAMICA) {
            const textoPrevio = SPAN_VALOR_URL_DINAMICA.dataset.textoPrevio;
            if (textoPrevio) {
                SPAN_VALOR_URL_DINAMICA.textContent = textoPrevio;
            } else {
                const preferenciaActiva = localStorage.getItem('preferencia-url-dinamica') === 'activa';
                aplicarEstadoUrlDinamica(preferenciaActiva);
            }
        }

        BOTON_COPIAR_ENLACE_COMPARTIR_SETUP?.removeAttribute('disabled');
        INPUT_ENLACE_COMPARTIR_SETUP?.removeAttribute('disabled');

        registrarCambioManualCanales({ forzar: true });
    } catch (error) {
        console.error(`Error durante la desactivación del modo "Visión Única". Error: ${error}`);
        mostrarToast(`
        <span class="fw-bold">Ha ocurrido un error durante la desactivación del modo "Visión Única".</span>
        <hr>
        <span class="bg-dark bg-opacity-25 px-2 rounded-3">Error: ${error}</span>
        <hr>
        Si error persiste tras recargar, prueba borrar tu almacenamiento local desde el panel "Personalización" o borrando la caché del navegador.
        <button type="button" class="btn btn-light rounded-pill btn-sm w-100 border-light mt-2" onclick="location.reload()"> Pulsa para recargar <i class="bi bi-arrow-clockwise"></i></button>`, 'danger', false)
        return
    }
}