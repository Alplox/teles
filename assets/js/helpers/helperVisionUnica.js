import { crearFragmentCanal } from "../canalUI.js";
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
    ICONO_SIN_SEÑAL_ACTIVA_VISION_UNICA
} from "../main.js";
import {
    actualizarValorSlider,
    mostrarToast,
    activarTooltipsBootstrap,
    ajustarClaseBotonCanal,
    obtenerNumeroCanalesFila,
    actualizarBotonesPersonalizarOverlay,
    hideTextoBotonesOverlay,
    ajustarNumeroDivisionesClaseCol
} from "../helpers/index.js";
import { CLASE_CSS_BOTON_PRIMARIO, CLASE_CSS_BOTON_SECUNDARIO } from "../constants/index.js";
import { listaCanales } from "../canalesData.js";

export function activarVisionUnica() {
    try {
        localStorage.setItem('diseño-seleccionado', 'vision-unica');
        BOTON_ACTIVAR_VISION_UNICA.classList.replace('btn-light-subtle', 'btn-indigo');
        BOTON_ACTIVAR_VISION_GRID.classList.replace('btn-indigo', 'btn-light-subtle');

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

export function desactivarVisionUnica() {
    try {
        localStorage.setItem('diseño-seleccionado', 'vision-cuadricula');
        BOTON_ACTIVAR_VISION_UNICA.classList.replace('btn-indigo', 'btn-light-subtle');
        BOTON_ACTIVAR_VISION_GRID.classList.replace('btn-light-subtle', 'btn-indigo');

        if (CONTAINER_VIDEO_VISION_UNICA.querySelector('div[data-canal]')) tele.remove(CONTAINER_VIDEO_VISION_UNICA.querySelector('div[data-canal]').dataset.canal);

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
        } else {
            tele.cargaCanalesPredeterminados();
        }

        CONTAINER_VISION_CUADRICULA.classList.remove('d-none');
        CONTAINER_VISION_UNICA.classList.add('d-none');
        document.querySelector('nav .btn-group').classList.remove('d-none');
        document.querySelector('nav a.gradient-text').classList.add('d-none');

        let divBotonesFlotantes = document.querySelector('#grupo-botones-flotantes');
        divBotonesFlotantes.querySelector('.btn-indigo').classList.remove('d-none');
        divBotonesFlotantes.querySelector('div.bg-light-subtle').classList.remove('d-none');
        divBotonesFlotantes.querySelector('.btn-dark').classList.replace('rounded-pill', 'rounded-end-5',);

        actualizarBotonesPersonalizarOverlay();

        INPUT_RANGE_PERSONALIZACION_TAMAÑO_VISION_CUADRICULA.disabled = false;
        actualizarValorSlider();

        CHECKBOX_PERSONALIZAR_USO_100VH_CANALES.disabled = false;
        SPAN_VALOR_CHECKBOX_PERSONALIZAR_USO_100VH_CANALES.textContent = localStorage.getItem('uso-100vh') === 'activo' ? 'Expandido' : 'Reducido';

        BOTONES_PERSONALIZAR_TRANSMISIONES_POR_FILA.forEach(boton => { boton.disabled = false });
        SPAN_VALOR_TRANSMISIONES_POR_FILA.innerHTML = `${obtenerNumeroCanalesFila()}`;

        ajustarNumeroDivisionesClaseCol();

        document.querySelector('#boton-personalizar-boton-mover-overlay').classList.remove('clase-vacia');
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