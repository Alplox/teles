/* 
  main v0.19
  by Alplox 
  https://github.com/Alplox/teles
*/

// MARK: import
import { fetchCargarCanales, fetchCargarCanalesIPTV, listaCanales } from './canalesData.js';
import { crearFragmentCanal } from './canalUI.js';
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
    quitarTodoCanalActivo,
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
    ajustarVisibilidadBotonesQuitarTodaSeñal,
    ajustarNumeroDivisionesClaseCol,
    filtrarCanalesPorInput,
    ajustarClaseColTransmisionesPorFila,
    ordenarBotonesCanalesAscendente,
    ordenarBotonesCanalesDescendente,
    restaurarOrdenOriginalBotonesCanales,
    crearBotonesPaises,
    addSortEventListener,
    actualizarBotonesFlotantes,
    clicBotonPosicionBotonesFlotantes,
    cargarOrdenVisionUnica,
    CONTAINER_INTERNO_VISION_UNICA,
    guardarOrdenPanelesVisionUnica,
    toggleClaseOrdenado,
    reemplazarCanalActivo
} from './helpers/index.js';

// MARK: querySelector Globales
const MAIN_NAVBAR = document.querySelector('#navbar');
export const CONTAINER_VISION_CUADRICULA = document.querySelector('#container-vision-cuadricula');
export const CONTAINER_VISION_UNICA = document.querySelector('#container-vision-unica');
export const CONTAINER_VIDEO_VISION_UNICA = document.querySelector('#container-video-vision-unica');
const ICONO_SIN_SEÑAL_ACTIVA_VISION_UNICA = document.querySelector('#icono-sin-señal-vision-unica');

const BOTON_ACTIVAR_VISION_UNICA = document.querySelector('#boton-activar-diseño-vision-unica');
const BOTON_ACTIVAR_VISION_GRID = document.querySelector('#boton-activar-diseño-vision-grid');

export const MODAL_CAMBIAR_CANAL = document.querySelector('#modal-cambiar-canal');
export const LABEL_MODAL_CAMBIAR_CANAL = document.querySelector('#label-para-nombre-canal-cambiar');

// MARK: LocalStorage
let lsModal = localStorage.getItem('modal-status') ?? 'show';
let lsNavbar = localStorage.getItem('navbar-display');
let lsEstiloVision = localStorage.getItem('diseño-seleccionado');

let lsPosicionBotonesFlotantes = localStorage.getItem('posicion-botones-flotante');
let lsTextoBotonesFlotantes = localStorage.getItem('texto-botones-flotantes');
let lsAlturaCanales = localStorage.getItem('uso-100vh');
let lsFondo = localStorage.getItem('tarjeta-fondo-display');

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

// Tamaño
export const INPUT_RANGE_PERSONALIZACION_TAMAÑO_VISION_CUADRICULA = document.querySelector('#input-range-tamaño-container-vision-cuadricula');
export const SPAN_VALOR_INPUT_RANGE = document.querySelector('#span-valor-input-range');

INPUT_RANGE_PERSONALIZACION_TAMAÑO_VISION_CUADRICULA.addEventListener('input', (event) => {
    SPAN_VALOR_INPUT_RANGE.innerHTML = `${event.target.value}%`;
    CONTAINER_VISION_CUADRICULA.style.maxWidth = `${event.target.value}%`;
    localStorage.setItem('valor-input-range', event.target.value);
    hideTextoBotonesOverlay();
});

// alternar altura canales
const CHECKBOX_PERSONALIZAR_USO_100VH_CANALES = document.querySelector('#checkbox-personalizar-altura-canales');
const SPAN_VALOR_CHECKBOX_PERSONALIZAR_USO_100VH_CANALES = document.querySelector('#span-valor-altura-canales');
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
const SPAN_VALOR_TRANSMISIONES_POR_FILA = document.querySelector('#span-valor-transmisiones-por-fila')
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

            // Buscar el elemento <video> dentro del contenedor específico del canal.
            // Esto es necesario para obtener la instancia de Video.js y poder destruirla correctamente antes de eliminar el DOM.
            // Evita que queden referencias vivas en memoria o que el reproductor siga ejecutando peticiones de red tras su remoción.
            let videoElement = transmisionPorRemover.querySelector('video');
            if (videoElement) {
                let player = videojs(videoElement.id);
                if (player) {
                    console.log(`Disposing player for canal "${canal}"...`);
                    player.dispose();
                }
            }

            removerTooltipsBootstrap();
            transmisionPorRemover.remove();

            if (localStorage.getItem('diseño-seleccionado') === 'vision-unica') ICONO_SIN_SEÑAL_ACTIVA_VISION_UNICA.classList.remove('d-none');

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
        const DIVS_SOBRE_SEÑALES = CONTAINER_VISION_CUADRICULA.querySelectorAll('.bg-transparent');
        DIVS_SOBRE_SEÑALES.forEach(divSobrepuesto => {
            divSobrepuesto.classList.toggle('pe-none'); // quita clase "pe-none" para poder abarcar todo el tamaño del div del canal para el threshold https://sortablejs.github.io/Sortable/#thresholds
        });
        removerTooltipsBootstrap(); // removemos ya que como el propio boton de mover tiene uno, de no quitarlo queda flotando tras mover div canal
    },
    onEnd: () => {
        activarTooltipsBootstrap();
        const DIVS_SOBRE_SEÑALES = CONTAINER_VISION_CUADRICULA.querySelectorAll('.bg-transparent');
        DIVS_SOBRE_SEÑALES.forEach(divSobrepuesto => {
            divSobrepuesto.classList.toggle('pe-none'); // para poder hacer clic en iframes o videojs
        });
        guardarCanalesEnLocalStorage()
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
            if (CONTAINER_VIDEO_VISION_UNICA) {
                const DIVS_SOBRE_SEÑALES = CONTAINER_VIDEO_VISION_UNICA.querySelectorAll('.bg-transparent');
                for (const divSobrepuesto of DIVS_SOBRE_SEÑALES) {
                    divSobrepuesto.classList.remove('pe-none');
                }
            }
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
            if (CONTAINER_VIDEO_VISION_UNICA) {
                const DIVS_SOBRE_SEÑALES = CONTAINER_VIDEO_VISION_UNICA.querySelectorAll('.bg-transparent');
                for (const divSobrepuesto of DIVS_SOBRE_SEÑALES) {
                    divSobrepuesto.classList.add('pe-none');
                }
            }
            toggleClaseOrdenado();
        } catch (e) {
            console.error('Error en onEnd Sortable:', e);
        }
    }
});

// ocultar texto si el tamaño de los botones excede el tamaño del contenedor
window.addEventListener('resize', hideTextoBotonesOverlay);

// MARK: DOMContentLoaded
window.addEventListener('DOMContentLoaded', () => {
    detectarTemaSistema();
    iniciarRevisarConexion();
    MODAL_CAMBIAR_CANAL.addEventListener('shown.bs.modal', () => {
        document.querySelectorAll('#modal-cambiar-canal-body-botones-canales button').forEach(boton => {
            boton.addEventListener('click', () => reemplazarCanalActivo(boton.dataset.canal, LABEL_MODAL_CAMBIAR_CANAL.getAttribute('id-canal-cambio')));
        });
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
        ? (MAIN_NAVBAR.classList.remove('d-none'), setCheckboxState(CHECKBOX_PERSONALIZAR_VISUALIZACION_NAVBAR, SPAN_VALOR_CHECKBOX_PERSONALIZAR_VISUALIZACION_NAVBAR, 'navbar-display', true))
        : (MAIN_NAVBAR.classList.add('d-none'), setCheckboxState(CHECKBOX_PERSONALIZAR_VISUALIZACION_NAVBAR, SPAN_VALOR_CHECKBOX_PERSONALIZAR_VISUALIZACION_NAVBAR, 'navbar-display', false));

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

    async function cargaInicial() {
        try {
            await fetchCargarCanales();
            if (listaCanales) {
                crearBotonesParaCanales();
                crearBotonesPaises();
                borraPreferenciaSeñalInvalida();
                lsEstiloVision === 'vision-unica' ? activarVisionUnica() : tele.cargaCanalesPredeterminados();
                actualizarBotonesPersonalizarOverlay()
                ajustarClaseColTransmisionesPorFila(localStorage.getItem('numero-class-columnas-por-fila') ?? (isMobile.any ? VALOR_COL_FIJO_TELEFONO : VALOR_COL_FIJO_ESCRITORIO))
                hideTextoBotonesOverlay()
                activarTooltipsBootstrap();
                ajustarVisibilidadBotonesQuitarTodaSeñal();
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
        document.querySelector(`#${PREFIJO}-input-filtro`).addEventListener('input', (e) => {
            document.querySelector(`#${PREFIJO}-input-filtro`).focus()
            filtrarCanalesPorInput(e.target.value, bodyBotonesCanales);
        });
    }

    document.addEventListener('hidden.bs.toast', event => {
        event.target.remove()
    });

    localStorage.setItem('modo-experimental', 'inactivo');
    const BOTON_EXPERIMENTAL = document.querySelector('#boton-experimental');
    BOTON_EXPERIMENTAL.addEventListener('click', async () => {
        try {
            if (localStorage.getItem('modo-experimental') !== 'activo') {
                BOTON_EXPERIMENTAL.querySelector('span').textContent = 'Cargando...'
                await fetchCargarCanalesIPTV();
                localStorage.setItem('modo-experimental', 'activo');
                for (const PREFIJO of PREFIJOS_ID_CONTENEDORES_CANALES) {
                    document.querySelector(`#${PREFIJO}-body-botones-canales`).classList.add('border', 'border-warning', 'rounded-3')
                    document.querySelector(`#${PREFIJO}-body-botones-canales`).innerHTML = '';
                    document.querySelector(`#${PREFIJO}-collapse-botones-listado-filtro-paises`).innerHTML = '';
                };
                quitarTodoCanalActivo()
                crearBotonesParaCanales();
                crearBotonesPaises();

                mostrarToast('Modo experimental activado. Se han combinado listas de canales y sus señales m3u8.', 'warning')
            } else {
                playAudioSinDelay(AUDIO_FAIL);
                mostrarToast('Ya estas en modo experimental. Revisa los canales que se cargaron. Para regresar al modo normal recarga la página. <br> <button type="button" class="btn btn-light rounded-pill btn-sm w-100 border-light mt-2" onclick="location.reload()"> Pulsa para recargar <i class="bi bi-arrow-clockwise"></i></button>', 'info');
            }
        } catch (error) {
            console.error(`Error al intentar activar modo experimental. Error: ${error}`);
            mostrarToast(`
            <span class="fw-bold">Ha ocurrido un error al intentar activar modo experimental.</span>
            <hr>
            <span class="bg-dark bg-opacity-25 px-2 rounded-3">Error: ${error}</span>
            <hr>
            Si error persiste tras recargar, prueba borrar tu almacenamiento local desde el panel "Personalización" o borrando la caché del navegador.
            <button type="button" class="btn btn-light rounded-pill btn-sm w-100 border-light mt-2" onclick="location.reload()"> Pulsa para recargar <i class="bi bi-arrow-clockwise"></i></button>`, 'danger', false)
            return
        } finally {
            BOTON_EXPERIMENTAL.querySelector('span').textContent = 'Activar modo experimental canales IPTV'
        }
    });
});