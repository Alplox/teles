/* 
  main v0.21
  by Alplox 
  https://github.com/Alplox/teles
*/

// MARK: import
import {
    fetchCargarCanales,
    cargarListaPersonalizadaM3U,
    cargarListaPersonalizadaDesdeTexto,
    restaurarListasPersonalizadas,
    listaCanales,
    obtenerListasPersonalizadas,
    actualizarListaPersonalizada,
    eliminarListaPersonalizada,
    aplicarListaPersonalizadaGuardada,
    obtenerPreferenciaCombinarCanales,
    establecerPreferenciaCombinarCanales
} from './canalesData.js';

import { crearFragmentCanal, cambiarSoloSeñalActiva } from './canalUI.js';

import {
    PREFIJOS_ID_CONTENEDORES_CANALES,
    VALOR_COL_FIJO_ESCRITORIO,
    VALOR_COL_FIJO_TELEFONO,
    registrarTraduccionVideojs,
    AUDIO_FAIL
} from './constants/index.js';
import {
    hideTextoBotonesOverlay,
    activarTooltipsBootstrap,
    removerTooltipsBootstrap,
    detectarTemaSistema,
    setCheckboxState,
    iniciarRevisarConexion,
    mostrarToast,
    playAudioSinDelay,
    obtenerCanalesPredeterminados,
    guardarCanalesEnLocalStorage,
    ajustarClaseBotonCanal,
    activarVisionUnica,
    desactivarVisionUnica,
    obtenerNumeroCanalesFila,
    borraPreferenciaSeñalInvalida,
    revisarSeñalesVacias,
    actualizarValorSlider,
    actualizarBotonesPersonalizarOverlay,
    crearBotonesParaCanales,
    crearBotonesParaModalCambiarCanal,
    ajustarVisibilidadBotonesQuitarTodaSeñal,
    ajustarNumeroDivisionesClaseCol,
    filtrarCanalesPorInput,
    ajustarClaseColTransmisionesPorFila,
    ordenarBotonesCanalesAscendente,
    ordenarBotonesCanalesDescendente,
    restaurarOrdenOriginalBotonesCanales,
    crearBotonesPaises,
    crearBotonesCategorias,
    addSortEventListener,
    actualizarBotonesFlotantes,
    clicBotonPosicionBotonesFlotantes,
    cargarOrdenVisionUnica,
    CONTAINER_INTERNO_VISION_UNICA,
    guardarOrdenPanelesVisionUnica,
    toggleClaseOrdenado,
    reemplazarCanalActivo
} from './helpers/index.js';

const debounce = (fn, delay = 150) => {
    let timeoutId;
    return (...args) => {
        if (timeoutId) clearTimeout(timeoutId);
        timeoutId = setTimeout(() => fn(...args), delay);
    };
};

const hideTextoBotonesOverlayDebounced = debounce(hideTextoBotonesOverlay, 150);

// MARK: querySelector Globales
const MAIN_NAVBAR = document.querySelector('#navbar');
export const CONTAINER_VISION_CUADRICULA = document.querySelector('#container-vision-cuadricula');
export const CONTAINER_VISION_UNICA = document.querySelector('#container-vision-unica');
export const CONTAINER_VIDEO_VISION_UNICA = document.querySelector('#container-video-vision-unica');
export const ICONO_SIN_SEÑAL_ACTIVA_VISION_UNICA = document.querySelector('#icono-sin-señal-vision-unica');

export const BOTON_ACTIVAR_VISION_UNICA = document.querySelector('#boton-activar-diseño-vision-unica');
export const BOTON_ACTIVAR_VISION_GRID = document.querySelector('#boton-activar-diseño-vision-grid');

export const MODAL_CAMBIAR_CANAL = document.querySelector('#modal-cambiar-canal');
export const LABEL_MODAL_CAMBIAR_CANAL = document.querySelector('#label-para-nombre-canal-cambiar');

const BOTON_EXPERIMENTAL = document.querySelector('#boton-experimental');
const BOTON_CARGAR_LISTA_PERSONALIZADA = document.querySelector('#boton-cargar-lista-personalizada');
const INPUT_URL_LISTA_PERSONALIZADA = document.querySelector('#input-url-lista-personalizada');
const TEXTAREA_LISTA_PERSONALIZADA = document.querySelector('#textarea-lista-personalizada');
const BOTON_PEGAR_LISTA_PERSONALIZADA = document.querySelector('#boton-pegar-lista-personalizada');
const CONTENEDOR_LISTAS_PERSONALIZADAS = document.querySelector('#contenedor-listas-personalizadas');
const TEXTO_LISTAS_VACIAS = CONTENEDOR_LISTAS_PERSONALIZADAS?.innerHTML ?? '<p class="text-secondary fs-smaller mb-0">No hay listas guardadas aún.</p>';
const CHECKBOX_COMBINAR_LISTAS_PERSONALIZADAS = document.querySelector('#checkbox-combinar-listas-personalizadas');
const SPAN_VALOR_COMBINAR_LISTAS_PERSONALIZADAS = document.querySelector('#span-valor-combinar-listas-personalizadas');

// MARK: LocalStorage
let lsModal = localStorage.getItem('modal-status') ?? 'show';
let lsNavbar = localStorage.getItem('navbar-display');
let lsEstiloVision = localStorage.getItem('diseño-seleccionado');

let lsPosicionBotonesFlotantes = localStorage.getItem('posicion-botones-flotante');
let lsTextoBotonesFlotantes = localStorage.getItem('texto-botones-flotantes');
let lsAlturaCanales = localStorage.getItem('uso-100vh');
let lsFondo = localStorage.getItem('tarjeta-fondo-display');
let lsReproductorM3u8 = localStorage.getItem('reproductor-m3u8') || 'videojs';

// MARK: PERSONALIZACIONES
// Navbar
const CHECKBOX_PERSONALIZAR_VISUALIZACION_NAVBAR = document.querySelector('#checkbox-personalizar-visualizacion-navbar');
const SPAN_VALOR_CHECKBOX_PERSONALIZAR_VISUALIZACION_NAVBAR = document.querySelector('#span-valor-visualizacion-navbar');

CHECKBOX_PERSONALIZAR_VISUALIZACION_NAVBAR.addEventListener('click', () => {
    MAIN_NAVBAR.classList.toggle('d-none', !CHECKBOX_PERSONALIZAR_VISUALIZACION_NAVBAR.checked);
    setCheckboxState(CHECKBOX_PERSONALIZAR_VISUALIZACION_NAVBAR, SPAN_VALOR_CHECKBOX_PERSONALIZAR_VISUALIZACION_NAVBAR, 'navbar-display', CHECKBOX_PERSONALIZAR_VISUALIZACION_NAVBAR.checked);
});

// Overlay
export const CHECKBOX_PERSONALIZAR_VISUALIZACION_OVERLAY = document.querySelector('#checkbox-personalizar-visualizacion-overlay');
export const SPAN_VALOR_CHECKBOX_PERSONALIZAR_VISUALIZACION_OVERLAY = document.querySelector('#span-valor-visualizacion-overlay');
CHECKBOX_PERSONALIZAR_VISUALIZACION_OVERLAY.addEventListener('click', () => {
    document.body.classList.toggle('d-none__barras-overlay', !CHECKBOX_PERSONALIZAR_VISUALIZACION_OVERLAY.checked);
    setCheckboxState(CHECKBOX_PERSONALIZAR_VISUALIZACION_OVERLAY, SPAN_VALOR_CHECKBOX_PERSONALIZAR_VISUALIZACION_OVERLAY, 'overlay-display', CHECKBOX_PERSONALIZAR_VISUALIZACION_OVERLAY.checked);
    actualizarBotonesPersonalizarOverlay();
});

export const BOTONES_PERSONALIZAR_OVERLAY = document.querySelectorAll('.div-boton-personalizar-overlay');
BOTONES_PERSONALIZAR_OVERLAY.forEach(contenedorBoton => {
    let botonIndividual = contenedorBoton.querySelector('.btn-check');
    let datasetBoton = botonIndividual.dataset.botonoverlay
    botonIndividual.addEventListener('click', () => {
        localStorage.setItem(`${datasetBoton}`, botonIndividual.checked ? 'show' : 'hide');
        actualizarBotonesPersonalizarOverlay();
    });
});

const RADIOS_REPRODUCTOR_M3U8 = document.querySelectorAll('input[name="btnradio-reproductor-m3u8"]');
const SPAN_VALOR_REPRODUCTOR_M3U8 = document.querySelector('#span-valor-reproductor-m3u8');

if (!lsReproductorM3u8) {
    lsReproductorM3u8 = 'videojs';
    localStorage.setItem('reproductor-m3u8', lsReproductorM3u8);
}

RADIOS_REPRODUCTOR_M3U8.forEach(radio => {
    if (radio.value === lsReproductorM3u8) {
        radio.checked = true;
        if (SPAN_VALOR_REPRODUCTOR_M3U8) {
            SPAN_VALOR_REPRODUCTOR_M3U8.textContent = radio.dataset.descripcion || radio.value;
        }
    }
    radio.addEventListener('change', () => {
        if (!radio.checked) return;
        const valor = radio.value;
        const descripcion = radio.dataset.descripcion || valor;
        localStorage.setItem('reproductor-m3u8', valor);
        if (SPAN_VALOR_REPRODUCTOR_M3U8) {
            SPAN_VALOR_REPRODUCTOR_M3U8.textContent = descripcion;
        }

        try {
            const transmisionesActivas = document.querySelectorAll('div[data-canal]');
            const lsPreferenciasSeñalCanales = JSON.parse(localStorage.getItem('preferencia-señal-canales')) || {};

            transmisionesActivas.forEach(transmision => {
                const canalId = transmision.getAttribute('data-canal');
                if (!canalId) return;

                const datosCanal = listaCanales?.[canalId]?.señales;
                if (!datosCanal) return;

                let { iframe_url = [], m3u8_url = [], yt_id = '', yt_embed = '', yt_playlist = '', twitch_id = '' } = datosCanal;
                let señalUtilizar;
                let valorIndexArraySeñal = 0;

                if (Array.isArray(iframe_url) && iframe_url.length > 0) {
                    señalUtilizar = 'iframe_url';
                } else if (Array.isArray(m3u8_url) && m3u8_url.length > 0) {
                    señalUtilizar = 'm3u8_url';
                } else if (yt_id !== '') {
                    señalUtilizar = 'yt_id';
                } else if (yt_embed !== '') {
                    señalUtilizar = 'yt_embed';
                } else if (yt_playlist !== '') {
                    señalUtilizar = 'yt_playlist';
                } else if (twitch_id !== '') {
                    señalUtilizar = 'twitch_id';
                }

                if (lsPreferenciasSeñalCanales[canalId]) {
                    señalUtilizar = Object.keys(lsPreferenciasSeñalCanales[canalId])[0].toString();
                    valorIndexArraySeñal = Number(Object.values(lsPreferenciasSeñalCanales[canalId]));
                }

                if (señalUtilizar === 'm3u8_url') {
                    cambiarSoloSeñalActiva(canalId);
                }
            });
        } catch (error) {
            console.error('Error al intentar recargar canales tras cambiar reproductor m3u8:', error);
        }
    });
});

// Tamaño
export const INPUT_RANGE_PERSONALIZACION_TAMAÑO_VISION_CUADRICULA = document.querySelector('#input-range-tamaño-container-vision-cuadricula');
export const SPAN_VALOR_INPUT_RANGE = document.querySelector('#span-valor-input-range');

INPUT_RANGE_PERSONALIZACION_TAMAÑO_VISION_CUADRICULA.addEventListener('input', (event) => {
    SPAN_VALOR_INPUT_RANGE.innerHTML = `${event.target.value}%`;
    CONTAINER_VISION_CUADRICULA.style.maxWidth = `${event.target.value}%`;
    localStorage.setItem('valor-input-range', event.target.value);
    hideTextoBotonesOverlayDebounced();
});

// alternar altura canales
export const CHECKBOX_PERSONALIZAR_USO_100VH_CANALES = document.querySelector('#checkbox-personalizar-altura-canales');
export const SPAN_VALOR_CHECKBOX_PERSONALIZAR_USO_100VH_CANALES = document.querySelector('#span-valor-altura-canales');
const ICONO_PERSONALIZAR_USO_100VH_CANALES = document.querySelector('#icono-personalizar-altura-canales');

CHECKBOX_PERSONALIZAR_USO_100VH_CANALES.addEventListener('click', () => {
    CHECKBOX_PERSONALIZAR_USO_100VH_CANALES.checked
        ? (ICONO_PERSONALIZAR_USO_100VH_CANALES.classList.replace('bi-arrows-collapse', 'bi-arrows-vertical'),
            localStorage.setItem('uso-100vh', 'activo'),
            SPAN_VALOR_CHECKBOX_PERSONALIZAR_USO_100VH_CANALES.textContent = 'Expandido'
        )
        : (ICONO_PERSONALIZAR_USO_100VH_CANALES.classList.replace('bi-arrows-vertical', 'bi-arrows-collapse'),
            localStorage.setItem('uso-100vh', 'inactivo'),
            SPAN_VALOR_CHECKBOX_PERSONALIZAR_USO_100VH_CANALES.textContent = 'Reducido'
        );
    ajustarNumeroDivisionesClaseCol()
});

// Canales por fila
export const SPAN_VALOR_TRANSMISIONES_POR_FILA = document.querySelector('#span-valor-transmisiones-por-fila')
export const BOTONES_PERSONALIZAR_TRANSMISIONES_POR_FILA = document.querySelectorAll('#container-botones-personalizar-transmisiones-por-fila button');

BOTONES_PERSONALIZAR_TRANSMISIONES_POR_FILA.forEach(boton => {
    boton.addEventListener('click', () => {
        ajustarClaseColTransmisionesPorFila(boton.value)
        SPAN_VALOR_TRANSMISIONES_POR_FILA.innerHTML = `${obtenerNumeroCanalesFila()}`
        hideTextoBotonesOverlay()
    })
});

// Texto botones flotantes
const CHECKBOX_PERSONALIZAR_TEXTO_BOTONES_FLOTANTES = document.querySelector('#checkbox-personalizar-texto-botones-flotantes');
const SPAN_VALOR_CHECKBOX_PERSONALIZAR_TEXTO_BOTONES_FLOTANTES = document.querySelector('#span-valor-texto-en-botones-flotante');
const ICONO_PERSONALIZAR_TEXTO_BOTONES_FLOTANTES = document.querySelector('#icono-personalizar-texto-botones-flotantes');

const SPAN_BOTONES_FLOTANTES = document.querySelectorAll('#grupo-botones-flotantes button>span');

CHECKBOX_PERSONALIZAR_TEXTO_BOTONES_FLOTANTES.addEventListener('click', () => {
    SPAN_BOTONES_FLOTANTES.forEach(button => {
        button.classList.toggle('d-none', !CHECKBOX_PERSONALIZAR_TEXTO_BOTONES_FLOTANTES.checked);
    });
    setCheckboxState(CHECKBOX_PERSONALIZAR_TEXTO_BOTONES_FLOTANTES, SPAN_VALOR_CHECKBOX_PERSONALIZAR_TEXTO_BOTONES_FLOTANTES, 'texto-botones-flotantes', CHECKBOX_PERSONALIZAR_TEXTO_BOTONES_FLOTANTES.checked);
    CHECKBOX_PERSONALIZAR_TEXTO_BOTONES_FLOTANTES.checked
        ? ICONO_PERSONALIZAR_TEXTO_BOTONES_FLOTANTES.classList.replace('bi-square', 'bi-info-square')
        : ICONO_PERSONALIZAR_TEXTO_BOTONES_FLOTANTES.classList.replace('bi-info-square', 'bi-square');
});

// ocultar fondo
const CHECKBOX_PERSONALIZAR_VISUALIZACION_TARJETA_LOGO_BACKGROUND = document.querySelector('#checkbox-tarjeta-logo-background');
const SPAN_VALOR_CHECKBOX_PERSONALIZAR_VISUALIZACION_TARJETA_LOGO_BACKGROUND = document.querySelector('#span-valor-visualizacion-tarjeta-logo-background');
const ICONO_PERSONALIZAR_VISUALIZACION_TARJETA_LOGO_BACKGROUND = document.querySelector('#icono-personalizar-visualizacion-tarjeta-logo-background');
const CONTAINER_TARJETA_LOGO_BACKGROUND = document.querySelector('#container-tarjeta-logo-background');

CHECKBOX_PERSONALIZAR_VISUALIZACION_TARJETA_LOGO_BACKGROUND.addEventListener('click', () => {
    CONTAINER_TARJETA_LOGO_BACKGROUND.classList.toggle('d-none', !CHECKBOX_PERSONALIZAR_VISUALIZACION_TARJETA_LOGO_BACKGROUND.checked);
    setCheckboxState(CHECKBOX_PERSONALIZAR_VISUALIZACION_TARJETA_LOGO_BACKGROUND, SPAN_VALOR_CHECKBOX_PERSONALIZAR_VISUALIZACION_TARJETA_LOGO_BACKGROUND, 'tarjeta-fondo-display', CHECKBOX_PERSONALIZAR_VISUALIZACION_TARJETA_LOGO_BACKGROUND.checked);
    CHECKBOX_PERSONALIZAR_VISUALIZACION_TARJETA_LOGO_BACKGROUND.checked ? ICONO_PERSONALIZAR_VISUALIZACION_TARJETA_LOGO_BACKGROUND.classList.replace('bi-eye-slash', 'bi-eye') : ICONO_PERSONALIZAR_VISUALIZACION_TARJETA_LOGO_BACKGROUND.classList.replace('bi-eye', 'bi-eye-slash');
});

export const BOTONES_REPOSICIONAR_BOTONES_FLOTANTES = document.querySelectorAll('#grupo-botones-posicion-botones-flotantes .btn-check');

registrarTraduccionVideojs();

// MARK: Manejo canales
export let tele = {
    add: (canal) => {
        try {
            if (!canal || !listaCanales?.[canal]) return console.error(`El canal "${canal}" proporcionado no es válido para ser añadido.`);
            const DIV_CANAL = document.createElement('div');
            DIV_CANAL.setAttribute('data-canal', canal);
            if (localStorage.getItem('diseño-seleccionado') === 'vision-unica') {
                DIV_CANAL.classList.add('position-relative', 'shadow', 'h-100', 'w-100');
                DIV_CANAL.append(crearFragmentCanal(canal));
                CONTAINER_VIDEO_VISION_UNICA.append(DIV_CANAL);
                ICONO_SIN_SEÑAL_ACTIVA_VISION_UNICA.classList.add('d-none');
            } else {
                DIV_CANAL.classList.add('position-relative', 'shadow');
                DIV_CANAL.append(crearFragmentCanal(canal));
                CONTAINER_VISION_CUADRICULA.append(DIV_CANAL);
                guardarCanalesEnLocalStorage();
            }
            ajustarClaseBotonCanal(canal, true);
            activarTooltipsBootstrap();
            hideTextoBotonesOverlay();
        } catch (error) {
            console.error(`Error durante creación div de canal con id: ${canal}. Error: ${error}`);
            mostrarToast(`
            <span class="fw-bold">Ha ocurrido un error durante la creación canal para ser insertado - id: ${canal}.</span>
            <hr>
            <span class="bg-dark bg-opacity-25 px-2 rounded-3">Error: ${error}</span>
            <hr>
            Si error persiste tras recargar, prueba borrar tu almacenamiento local desde el panel "Personalización" o borrando la caché del navegador.
            <button type="button" class="btn btn-light rounded-pill btn-sm w-100 border-light mt-2" onclick="location.reload()"> Pulsa para recargar <i class="bi bi-arrow-clockwise"></i></button>`, 'danger', false)
            return
        }
    },
    remove: (canal) => {

        try {
            if (!canal) return console.error(`El canal "${canal}" proporcionado no es válido para su eliminación.`);
            let transmisionPorRemover = document.querySelector(`div[data-canal="${canal}"]`);

            if (!transmisionPorRemover) {
                console.warn(`[teles] Se intentó eliminar canal "${canal}" pero no se encontró ninguna transmisión activa. Se actualizará solo el estado visual.`);
                ajustarClaseBotonCanal(canal, false);
                return;
            }

            // Buscar el elemento <video> dentro del contenedor específico del canal.
            // Esto es necesario para obtener la instancia de Video.js y poder destruirla correctamente antes de eliminar el DOM.
            // Evita que queden referencias vivas en memoria o que el reproductor siga ejecutando peticiones de red tras su remoción.
            let videoElement = transmisionPorRemover.querySelector('video');
            if (videoElement && videoElement.classList.contains('video-js')) {
                let player = videojs(videoElement);
                if (player) {
                    console.log(`Disposing player for canal "${canal}"...`);
                    player.dispose();
                }
            }

            const clapprContainer = transmisionPorRemover.querySelector('[contenedor-canal-cambio]');
            if (clapprContainer && clapprContainer._clapprPlayer && typeof clapprContainer._clapprPlayer.destroy === 'function') {
                try {
                    console.log(`Destroying Clappr player for canal "${canal}"...`);
                    clapprContainer._clapprPlayer.destroy();
                } catch (errorClappr) {
                    console.error(`Error al destruir Clappr para canal "${canal}":`, errorClappr);
                }
            }

            removerTooltipsBootstrap();
            transmisionPorRemover.remove();

            const esVisionUnica = CONTAINER_VIDEO_VISION_UNICA && CONTAINER_VIDEO_VISION_UNICA.contains(transmisionPorRemover);

            if (esVisionUnica || localStorage.getItem('diseño-seleccionado') === 'vision-unica') {
                ICONO_SIN_SEÑAL_ACTIVA_VISION_UNICA.classList.remove('d-none');
            } else {
                guardarCanalesEnLocalStorage();
            }

            ajustarClaseBotonCanal(canal, false);
            activarTooltipsBootstrap();
        } catch (error) {
            console.error(`Error durante eliminación div de canal con id: ${canal}. Error: ${error}`);
            mostrarToast(`
            <span class="fw-bold">Ha ocurrido un error durante la eliminación canal con id: ${canal}.</span>
            <hr>
            <span class="bg-dark bg-opacity-25 px-2 rounded-3">Error: ${error}</span>
            <hr>
            Si error persiste tras recargar, prueba borrar tu almacenamiento local desde el panel "Personalización" o borrando la caché del navegador.
            <button type="button" class="btn btn-light rounded-pill btn-sm w-100 border-light mt-2" onclick="location.reload()"> Pulsa para recargar <i class="bi bi-arrow-clockwise"></i></button>`, 'danger', false)
            return
        }
    },
    cargaCanalesPredeterminados: () => {
        let lsCanales = JSON.parse(localStorage.getItem('canales-vision-cuadricula')) || {};
        if (Object.keys(lsCanales).length === 0 && lsModal !== 'hide') {
            obtenerCanalesPredeterminados(isMobile.any).forEach(canal => tele.add(canal));
        } else {
            try {
                Object.keys(lsCanales).forEach(canal => {
                    if (revisarSeñalesVacias(canal)) {
                        document.querySelectorAll(`button[data-canal="${canal}"]`).forEach(boton => {
                            boton.classList.add('d-none');
                        });
                    } else {
                        tele.add(canal);
                    }
                });
            } catch (error) {
                console.error(`Error durante carga canales predeterminados. Error: ${error}`);
                mostrarToast(`
                <span class="fw-bold">Ha ocurrido un error durante la carga de canales predeterminados.</span>
                <hr>
                <span class="bg-dark bg-opacity-25 px-2 rounded-3">Error: ${error}</span>
                <hr>
                Si error persiste tras recargar, prueba borrar tu almacenamiento local desde el panel "Personalización" o borrando la caché del navegador.
                <button type="button" class="btn btn-light rounded-pill btn-sm w-100 border-light mt-2" onclick="location.reload()"> Pulsa para recargar <i class="bi bi-arrow-clockwise"></i></button>`, 'danger', false)
                return
            }
        };
    }
};

BOTON_ACTIVAR_VISION_UNICA.addEventListener('click', () => {
    if (localStorage.getItem('diseño-seleccionado') !== 'vision-unica') {
        activarVisionUnica();
    } else {
        playAudioSinDelay(AUDIO_FAIL);
        mostrarToast('Ya estas en modo visión única', 'info');
    }
})

BOTON_ACTIVAR_VISION_GRID.addEventListener('click', () => {
    if (localStorage.getItem('diseño-seleccionado') === 'vision-unica') {
        desactivarVisionUnica();
    } else {
        playAudioSinDelay(AUDIO_FAIL);
        mostrarToast('Ya estas en modo visión cuadrícula', 'info');
    }
})

// MARK: otros
// plugin para mover canales en grid
new Sortable(CONTAINER_VISION_CUADRICULA, {
    animation: 350,
    handle: '.clase-para-mover',
    easing: "cubic-bezier(.17,.67,.83,.67)",
    ghostClass: 'marca-al-mover',
    onStart: () => {
        removerTooltipsBootstrap(); // evitamos tooltips flotando al mover
    },
    onEnd: () => {
        activarTooltipsBootstrap();
        guardarCanalesEnLocalStorage();
    }
});

new Sortable(CONTAINER_INTERNO_VISION_UNICA, {
    animation: 350,
    handle: '.clase-para-mover',
    easing: "cubic-bezier(.17,.67,.83,.67)",
    ghostClass: 'marca-al-mover',
    swapThreshold: 0.30,
    onStart: () => {
        try {
            removerTooltipsBootstrap();
        } catch (e) {
            console.error('Error en onStart Sortable:', e);
        }
    },
    onChange: () => {
        try {
            toggleClaseOrdenado();
        } catch (e) {
            console.error('Error en onChange Sortable:', e);
        }
    },
    onEnd: () => {
        try {
            guardarOrdenPanelesVisionUnica();
            activarTooltipsBootstrap();
            toggleClaseOrdenado();
        } catch (e) {
            console.error('Error en onEnd Sortable:', e);
        }
    }
});

// ocultar texto si el tamaño de los botones excede el tamaño del contenedor
window.addEventListener('resize', hideTextoBotonesOverlayDebounced);

// MARK: DOMContentLoaded
window.addEventListener('DOMContentLoaded', () => {
    detectarTemaSistema();
    iniciarRevisarConexion();
    MODAL_CAMBIAR_CANAL.addEventListener('shown.bs.modal', () => {
        const contenedorCambiar = document.querySelector('#modal-cambiar-canal-body-botones-canales');
        if (contenedorCambiar && !contenedorCambiar.querySelector('button[data-canal]')) {
            crearBotonesParaModalCambiarCanal();
        }
    });

    MODAL_CAMBIAR_CANAL.addEventListener('hidden.bs.modal', () => {
        LABEL_MODAL_CAMBIAR_CANAL.setAttribute('id-canal-cambio', '')
    });

    screen.orientation.addEventListener('change', () => {
        if (lsEstiloVision !== 'vision-unica') ajustarNumeroDivisionesClaseCol();
    });

    // Efecto glow en hover a logo del fondo
    const TARJETA_LOGO_BACKGROUND = document.querySelector('.tarjeta-logo-background');
    TARJETA_LOGO_BACKGROUND.onmousemove = e => {
        let rect = TARJETA_LOGO_BACKGROUND.getBoundingClientRect(),
            x = e.clientX - rect.left,
            y = e.clientY - rect.top;
        TARJETA_LOGO_BACKGROUND.style.setProperty('--mouse-x', `${x}px`);
        TARJETA_LOGO_BACKGROUND.style.setProperty('--mouse-y', `${y}px`);
    };

    if (lsModal !== 'hide') new bootstrap.Modal(document.querySelector('#modal-bienvenida')).show();

    // Navbar
    lsNavbar !== 'hide'
        ? (setCheckboxState(CHECKBOX_PERSONALIZAR_VISUALIZACION_NAVBAR, SPAN_VALOR_CHECKBOX_PERSONALIZAR_VISUALIZACION_NAVBAR, 'navbar-display', true))
        : (setCheckboxState(CHECKBOX_PERSONALIZAR_VISUALIZACION_NAVBAR, SPAN_VALOR_CHECKBOX_PERSONALIZAR_VISUALIZACION_NAVBAR, 'navbar-display', false));

    // Posición botones flotante

    BOTONES_REPOSICIONAR_BOTONES_FLOTANTES.forEach(boton => {
        boton.addEventListener('click', () => {
            const BOTON_DATASET_POSITION = boton.dataset.position.split(' ');
            clicBotonPosicionBotonesFlotantes(...BOTON_DATASET_POSITION);
        });
    });

    if (lsPosicionBotonesFlotantes) {
        const { top, start, margin, translate } = JSON.parse(lsPosicionBotonesFlotantes);
        actualizarBotonesFlotantes(top, start, margin, translate);
    } else {
        actualizarBotonesFlotantes('bottom-0', 'start-50', 'mb-3', 'translate-middle-x');
    }

    // Texto botones flotantes
    if (lsTextoBotonesFlotantes !== 'hide') {
        setCheckboxState(CHECKBOX_PERSONALIZAR_TEXTO_BOTONES_FLOTANTES, SPAN_VALOR_CHECKBOX_PERSONALIZAR_TEXTO_BOTONES_FLOTANTES, 'texto-botones-flotantes', true);
        ICONO_PERSONALIZAR_TEXTO_BOTONES_FLOTANTES.classList.replace('bi-square', 'bi-info-square');
    } else {
        SPAN_BOTONES_FLOTANTES.forEach((button) => {
            button.classList.toggle('d-none', !CHECKBOX_PERSONALIZAR_TEXTO_BOTONES_FLOTANTES.checked);
        });
        setCheckboxState(CHECKBOX_PERSONALIZAR_TEXTO_BOTONES_FLOTANTES, SPAN_VALOR_CHECKBOX_PERSONALIZAR_TEXTO_BOTONES_FLOTANTES, 'texto-botones-flotantes', false);
        ICONO_PERSONALIZAR_TEXTO_BOTONES_FLOTANTES.classList.replace('bi-info-square', 'bi-square');
    }

    // Tamaño
    actualizarValorSlider();
    SPAN_VALOR_TRANSMISIONES_POR_FILA.innerHTML = `${obtenerNumeroCanalesFila()}`

    // Altura
    if (lsAlturaCanales !== 'inactivo') {
        localStorage.setItem('uso-100vh', 'activo'),
            CHECKBOX_PERSONALIZAR_USO_100VH_CANALES.checked = true;
        ICONO_PERSONALIZAR_USO_100VH_CANALES.classList.replace('bi-arrows-collapse', 'bi-arrows-vertical');
        SPAN_VALOR_CHECKBOX_PERSONALIZAR_USO_100VH_CANALES.textContent = 'Expandido';
    } else {
        CHECKBOX_PERSONALIZAR_USO_100VH_CANALES.checked = false;
        ICONO_PERSONALIZAR_USO_100VH_CANALES.classList.replace('bi-arrows-vertical', 'bi-arrows-collapse');
        SPAN_VALOR_CHECKBOX_PERSONALIZAR_USO_100VH_CANALES.textContent = 'Reducido';
    }

    // tarjeta fondo
    if (lsFondo !== 'hide') {
        setCheckboxState(CHECKBOX_PERSONALIZAR_VISUALIZACION_TARJETA_LOGO_BACKGROUND, SPAN_VALOR_CHECKBOX_PERSONALIZAR_VISUALIZACION_TARJETA_LOGO_BACKGROUND, 'tarjeta-fondo-display', true)
        CONTAINER_TARJETA_LOGO_BACKGROUND.classList.toggle('d-none', !CHECKBOX_PERSONALIZAR_VISUALIZACION_TARJETA_LOGO_BACKGROUND.checked);
        ICONO_PERSONALIZAR_VISUALIZACION_TARJETA_LOGO_BACKGROUND.classList.replace('bi-eye-slash', 'bi-eye');
    } else {
        setCheckboxState(CHECKBOX_PERSONALIZAR_VISUALIZACION_TARJETA_LOGO_BACKGROUND, SPAN_VALOR_CHECKBOX_PERSONALIZAR_VISUALIZACION_TARJETA_LOGO_BACKGROUND, 'tarjeta-fondo-display', false)
        CONTAINER_TARJETA_LOGO_BACKGROUND.classList.toggle('d-none', !CHECKBOX_PERSONALIZAR_VISUALIZACION_TARJETA_LOGO_BACKGROUND.checked);
        ICONO_PERSONALIZAR_VISUALIZACION_TARJETA_LOGO_BACKGROUND.classList.replace('bi-eye', 'bi-eye-slash');
    }

    /**
     * Inicializa y sincroniza el switch para combinar canales similares entre listas personalizadas.
     * Actualiza el texto auxiliar y persiste la preferencia en localStorage.
     * @returns {void}
     */
    function inicializarPreferenciaCombinarListas() {
        if (!CHECKBOX_COMBINAR_LISTAS_PERSONALIZADAS || !SPAN_VALOR_COMBINAR_LISTAS_PERSONALIZADAS) {
            console.warn('[teles] No se encontró el control para combinar listas personalizadas.');
            return;
        }

        const obtenerEtiquetaEstado = (estado) => estado ? 'Combinar coincidencias' : 'Mantener listas separadas';

        const aplicarEstado = (estado) => {
            CHECKBOX_COMBINAR_LISTAS_PERSONALIZADAS.checked = estado;
            SPAN_VALOR_COMBINAR_LISTAS_PERSONALIZADAS.textContent = obtenerEtiquetaEstado(estado);
        };

        const estadoInicial = obtenerPreferenciaCombinarCanales();
        aplicarEstado(estadoInicial);

        CHECKBOX_COMBINAR_LISTAS_PERSONALIZADAS.addEventListener('change', () => {
            const nuevoEstado = CHECKBOX_COMBINAR_LISTAS_PERSONALIZADAS.checked;
            establecerPreferenciaCombinarCanales(nuevoEstado);
            aplicarEstado(nuevoEstado);
            mostrarToast(
                nuevoEstado
                    ? 'Se combinarán canales similares al importar listas personalizadas.'
                    : 'Se mantendrán separados los canales aun cuando existan coincidencias.',
                'info'
            );
        }, { once: false });
    }

    inicializarPreferenciaCombinarListas();

    /**
     * Obtiene la lista de IDs de canales compartidos a través del parámetro `c` en la URL.
     * El formato esperado es una lista separada por comas, por ejemplo: ?c=24-horas,meganoticias,t13
     * @returns {string[]} Arreglo de IDs de canales válidos.
     */
    function obtenerCanalesCompartidosDesdeUrl() {
        try {
            const url = new URL(window.location.href);
            const param = url.searchParams.get('c');
            if (!param) return [];

            return param
                .split(',')
                .map(id => id.trim())
                .filter(id => id.length > 0 && listaCanales?.[id]);
        } catch (error) {
            console.error('[teles] Error al leer canales compartidos desde la URL:', error);
            return [];
        }
    }

    async function cargaInicial() {
        try {
            await fetchCargarCanales();
            if (listaCanales) {
                const listasRestauradas = restaurarListasPersonalizadas();
                crearBotonesParaCanales();
                crearBotonesPaises();
                crearBotonesCategorias();
                borraPreferenciaSeñalInvalida();

                const urlActual = new URL(window.location.href);
                const paramCompartidos = urlActual.searchParams.get('c');
                const totalCanalesSolicitados = paramCompartidos
                    ? paramCompartidos
                        .split(',')
                        .map(id => id.trim())
                        .filter(id => id.length > 0).length
                    : 0;

                const canalesCompartidos = obtenerCanalesCompartidosDesdeUrl();

                if (canalesCompartidos.length > 0) {
                    canalesCompartidos.forEach(canalId => tele.add(canalId));

                    if (totalCanalesSolicitados > canalesCompartidos.length) {
                        const diferencia = totalCanalesSolicitados - canalesCompartidos.length;
                        mostrarToast(
                            `No todos los canales compartidos se pudieron cargar (se cargaron ${canalesCompartidos.length} de ${totalCanalesSolicitados}). Es posible que algunos provengan de listas personalizadas o modos que no están disponibles en este navegador.`,
                            'info'
                        );
                        console.info('[teles][compartir] Canales omitidos al cargar desde URL', {
                            totalSolicitados: totalCanalesSolicitados,
                            totalCargados: canalesCompartidos.length,
                            faltantes: diferencia
                        });
                    }
                } else {
                    lsEstiloVision === 'vision-unica' ? activarVisionUnica() : tele.cargaCanalesPredeterminados();
                }

                actualizarBotonesPersonalizarOverlay()
                ajustarClaseColTransmisionesPorFila(localStorage.getItem('numero-class-columnas-por-fila') ?? (isMobile.any ? VALOR_COL_FIJO_TELEFONO : VALOR_COL_FIJO_ESCRITORIO))
                hideTextoBotonesOverlay()
                activarTooltipsBootstrap();

                if (listasRestauradas > 0) {
                    renderizarListasPersonalizadasUI();
                }
            }
        } catch (error) {
            console.error(`Error durante carga inicial. Error: ${error}`);
            mostrarToast(`
            <span class="fw-bold">Ha ocurrido un error durante la carga inicial.</span>
            <hr>
            <span class="bg-dark bg-opacity-25 px-2 rounded-3">Error: ${error}</span>
            <hr>
            Si error persiste tras recargar, prueba borrar tu almacenamiento local desde el panel "Personalización" o borrando la caché del navegador.
            <button type="button" class="btn btn-light rounded-pill btn-sm w-100 border-light mt-2" onclick="location.reload()"> Pulsa para recargar <i class="bi bi-arrow-clockwise"></i></button>`, 'danger', false)
            return
        }
    }
    cargaInicial();

    cargarOrdenVisionUnica();

    // Ordenar botones canales
    for (const PREFIJO of PREFIJOS_ID_CONTENEDORES_CANALES) {
        addSortEventListener(`${PREFIJO}-boton-orden-ascendente`, `${PREFIJO}-body-botones-canales`, ordenarBotonesCanalesAscendente);
        addSortEventListener(`${PREFIJO}-boton-orden-descendente`, `${PREFIJO}-body-botones-canales`, ordenarBotonesCanalesDescendente);
        addSortEventListener(`${PREFIJO}-boton-orden-original`, `${PREFIJO}-body-botones-canales`, restaurarOrdenOriginalBotonesCanales);

        let bodyBotonesCanales = document.querySelector(`#${PREFIJO}-body-botones-canales`)
        const inputFiltro = document.querySelector(`#${PREFIJO}-input-filtro`);
        if (!inputFiltro) continue;

        const filtrarCanalesPorInputDebounced = debounce((valor) => {
            inputFiltro.focus();
            filtrarCanalesPorInput(valor, bodyBotonesCanales);
        }, 200);

        inputFiltro.addEventListener('input', (e) => {
            filtrarCanalesPorInputDebounced(e.target.value);
        });
    }

    document.addEventListener('hidden.bs.toast', event => {
        event.target.remove()
    });

    localStorage.setItem('modo-experimental', 'inactivo');

    renderizarListasPersonalizadasUI();

    function limpiarContenedoresListadosCanales({ resaltarExperimental = false } = {}) {
        for (const PREFIJO of PREFIJOS_ID_CONTENEDORES_CANALES) {
            const contenedorBotones = document.querySelector(`#${PREFIJO}-body-botones-canales`);
            const contenedorPaises = document.querySelector(`#${PREFIJO}-collapse-botones-listado-filtro-paises`);
            const contenedorCategorias = document.querySelector(`#${PREFIJO}-collapse-botones-listado-filtro-categorias`);
            if (contenedorBotones) {
                if (resaltarExperimental) {
                    contenedorBotones.classList.add('border', 'border-warning', 'rounded-3');
                }
                contenedorBotones.innerHTML = '';
            }
            if (contenedorPaises) {
                contenedorPaises.innerHTML = '';
            }
            if (contenedorCategorias) {
                contenedorCategorias.innerHTML = '';
            }
        }
    }

    function renderizarListasPersonalizadasUI() {
        if (!CONTENEDOR_LISTAS_PERSONALIZADAS) return;
        const listas = obtenerListasPersonalizadas();
        const urls = Object.keys(listas);
        if (!urls.length) {
            CONTENEDOR_LISTAS_PERSONALIZADAS.innerHTML = TEXTO_LISTAS_VACIAS;
            return;
        }
        const fragment = document.createDocumentFragment();
        urls.sort((a, b) => {
            const etiquetaA = listas[a]?.etiqueta || a;
            const etiquetaB = listas[b]?.etiqueta || b;
            return etiquetaA.localeCompare(etiquetaB, 'es', { sensitivity: 'base' });
        }).forEach(url => {
            fragment.append(crearTarjetaListaPersonalizada(url, listas[url]));
        });
        CONTENEDOR_LISTAS_PERSONALIZADAS.innerHTML = '';
        CONTENEDOR_LISTAS_PERSONALIZADAS.append(fragment);
    }

    function crearTarjetaListaPersonalizada(url, data = {}) {
        const card = document.createElement('div');
        card.classList.add('bg-body-secondary', 'bg-opacity-10', 'rounded-3', 'p-2', 'border', 'border-light-subtle', 'mb-2');
        const etiqueta = data.etiqueta || url;
        const pinned = data.pinned !== false;

        const encabezado = document.createElement('div');
        encabezado.classList.add('d-flex', 'justify-content-between', 'align-items-start', 'gap-2');

        const bloqueInfo = document.createElement('div');
        bloqueInfo.innerHTML = `
            <p class="fw-semibold mb-0">${etiqueta}</p>
            <small class="text-secondary">${url}</small><br>
            <small class="text-secondary">Actualizado: ${formatearFecha(data.actualizado)}</small>
        `;

        const bloqueAcciones = document.createElement('div');
        bloqueAcciones.classList.add('d-flex', 'flex-column', 'gap-1');

        const botonPin = document.createElement('button');
        botonPin.type = 'button';
        botonPin.className = `btn btn-sm ${pinned ? 'btn-success' : 'btn-outline-secondary'}`;
        botonPin.innerHTML = pinned ? '<i class="bi bi-pin-angle-fill"></i> Fijada' : '<i class="bi bi-pin-angle"></i> No fijada';
        botonPin.addEventListener('click', () => {
            const estadoActual = (obtenerListasPersonalizadas()[url]?.pinned !== false);
            const nuevoEstado = !estadoActual;
            actualizarListaPersonalizada(url, { pinned: nuevoEstado });
            renderizarListasPersonalizadasUI();
            mostrarToast(
                nuevoEstado ? `La lista "${etiqueta}" se restaurará al recargar.` : `La lista "${etiqueta}" ya no se restaurará automáticamente.`,
                nuevoEstado ? 'success' : 'info'
            );
        });

        const botonAplicar = document.createElement('button');
        botonAplicar.type = 'button';
        botonAplicar.className = 'btn btn-sm btn-outline-primary';
        botonAplicar.innerHTML = '<i class="bi bi-arrow-repeat"></i> Aplicar';
        botonAplicar.addEventListener('click', () => {
            const exito = aplicarListaPersonalizadaGuardada(url);
            if (exito) {
                limpiarContenedoresListadosCanales();
                crearBotonesParaCanales();
                crearBotonesPaises();
                crearBotonesCategorias();

                mostrarToast(`Lista "${etiqueta}" aplicada correctamente.`, 'success');
            } else {
                mostrarToast('No fue posible aplicar la lista seleccionada.', 'danger');
            }
        });

        const botonEliminar = document.createElement('button');
        botonEliminar.type = 'button';
        botonEliminar.className = 'btn btn-sm btn-outline-danger';
        botonEliminar.innerHTML = '<i class="bi bi-trash"></i> Quitar';
        botonEliminar.addEventListener('click', () => {
            if (!window.confirm(`¿Eliminar la lista "${etiqueta}" y sus canales asociados?`)) return;
            eliminarListaPersonalizada(url);
            const eliminados = eliminarCanalesPorFuente(url);
            limpiarContenedoresListadosCanales();
            crearBotonesParaCanales();
            crearBotonesPaises();
            crearBotonesCategorias();

            renderizarListasPersonalizadasUI();
            mostrarToast(`Lista eliminada. ${eliminados} canal(es) removidos.`, 'warning');
        });

        bloqueAcciones.append(botonPin, botonAplicar, botonEliminar);
        encabezado.append(bloqueInfo, bloqueAcciones);
        card.append(encabezado);
        return card;
    }

    function formatearFecha(fechaISO) {
        if (!fechaISO) return 'sin registro';
        try {
            return new Date(fechaISO).toLocaleString('es-CL', { dateStyle: 'short', timeStyle: 'short' });
        } catch {
            return fechaISO;
        }
    }

    function eliminarCanalesPorFuente(fuente) {
        if (!fuente || !listaCanales) return 0;
        let eliminados = 0;

        Object.keys(listaCanales).forEach(canalId => {
            if (listaCanales[canalId]?.fuenteLista === fuente) {
                try {
                    tele.remove?.(canalId);
                } catch (error) {
                    console.warn(`No se pudo remover canal activo ${canalId}:`, error);
                }
                delete listaCanales[canalId];
                eliminados++;
            }
        });
        return eliminados;
    }

    if (BOTON_CARGAR_LISTA_PERSONALIZADA && INPUT_URL_LISTA_PERSONALIZADA) {
        const textoOriginalBoton = BOTON_CARGAR_LISTA_PERSONALIZADA.innerHTML;
        const toggleEstadoBoton = (cargando) => {
            if (cargando) {
                BOTON_CARGAR_LISTA_PERSONALIZADA.disabled = true;
                BOTON_CARGAR_LISTA_PERSONALIZADA.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span> Cargando...';
            } else {
                BOTON_CARGAR_LISTA_PERSONALIZADA.disabled = false;
                BOTON_CARGAR_LISTA_PERSONALIZADA.innerHTML = textoOriginalBoton;
            }
        };

        BOTON_CARGAR_LISTA_PERSONALIZADA.addEventListener('click', async () => {
            const urlLista = INPUT_URL_LISTA_PERSONALIZADA.value.trim();
            if (!urlLista) {
                mostrarToast('Ingresa la URL a tu archivo .m3u antes de cargarla.', 'warning');
                INPUT_URL_LISTA_PERSONALIZADA.focus();
                return;
            }

            try {
                new URL(urlLista);
            } catch {
                mostrarToast('La URL ingresada no es válida. Verifica que comience con http(s)://', 'warning');
                INPUT_URL_LISTA_PERSONALIZADA.focus();
                return;
            }

            toggleEstadoBoton(true);
            try {
                await cargarListaPersonalizadaM3U(urlLista);
                limpiarContenedoresListadosCanales();
                crearBotonesParaCanales();
                crearBotonesPaises();
                crearBotonesCategorias();
                activarTooltipsBootstrap();

                renderizarListasPersonalizadasUI();
                mostrarToast('Lista personalizada cargada correctamente. Los nuevos canales se añadieron al final.', 'success');
            } catch (error) {
                console.error('Error al cargar lista personalizada M3U:', error);
                mostrarToast('No fue posible cargar la lista personalizada. Verifica la URL o si el servidor permite descargas (CORS).', 'danger');
            } finally {
                toggleEstadoBoton(false);
            }
        });
    }

    if (BOTON_PEGAR_LISTA_PERSONALIZADA && TEXTAREA_LISTA_PERSONALIZADA) {
        const textoOriginalBotonPegado = BOTON_PEGAR_LISTA_PERSONALIZADA.innerHTML;
        const toggleBotonPegado = (cargando) => {
            if (cargando) {
                BOTON_PEGAR_LISTA_PERSONALIZADA.disabled = true;
                BOTON_PEGAR_LISTA_PERSONALIZADA.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span> Procesando...';
            } else {
                BOTON_PEGAR_LISTA_PERSONALIZADA.disabled = false;
                BOTON_PEGAR_LISTA_PERSONALIZADA.innerHTML = textoOriginalBotonPegado;
            }
        };

        BOTON_PEGAR_LISTA_PERSONALIZADA.addEventListener('click', async () => {
            const contenidoLista = TEXTAREA_LISTA_PERSONALIZADA.value.trim();
            if (!contenidoLista) {
                mostrarToast('Pega el contenido completo de tu archivo .m3u antes de continuar.', 'warning');
                TEXTAREA_LISTA_PERSONALIZADA.focus();
                return;
            }

            toggleBotonPegado(true);
            try {
                const etiquetaManual = `Lista manual ${new Date().toLocaleString('es-CL', { dateStyle: 'short', timeStyle: 'short' })}`;
                await cargarListaPersonalizadaDesdeTexto(contenidoLista, { etiqueta: etiquetaManual });
                TEXTAREA_LISTA_PERSONALIZADA.value = '';
                limpiarContenedoresListadosCanales();
                crearBotonesParaCanales();
                crearBotonesPaises();
                crearBotonesCategorias();

                renderizarListasPersonalizadasUI();
                mostrarToast('Lista manual cargada correctamente. Los nuevos canales se añadieron al final.', 'success');
            } catch (error) {
                console.error('Error al procesar lista pegada manualmente:', error);
                mostrarToast(error?.message ?? 'No fue posible procesar el texto pegado. Revisa el formato del archivo .m3u.', 'danger');
            } finally {
                toggleBotonPegado(false);
            }
        });
    }

    ajustarVisibilidadBotonesQuitarTodaSeñal()
});