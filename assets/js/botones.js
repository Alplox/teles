import { tele } from './main.js'
import {
    aplicarTema,
    mostrarToast,
    playAudioSinDelay,
    quitarTodoCanalActivo,
    obtenerCanalesPredeterminados
} from './helpers/index.js'
import {
    AUDIO_ESTATICA,
    AUDIO_FAIL,
    AUDIO_SUCCESS,
    AUDIO_TURN_ON,
} from './constants/index.js';

// MARK: Botón entendido modal descargo de responsabilidad
const BOTON_ENTENDIDO = document.querySelector('#boton-entendido');
BOTON_ENTENDIDO?.addEventListener('click', () => {
    localStorage.setItem('modal-status', 'hide');
});

// MARK: Botón PWA Install
let containerPwaInstall = document.querySelector('#pwa-install');
const BOTON_INSTALAR_PWA = document.querySelector('#boton-instalar-pwa');

// Ocultar botón PWA en Firefox
if (navigator.userAgent.toLowerCase().includes('firefox')) {
    BOTON_INSTALAR_PWA?.classList.add('d-none');
    if (containerPwaInstall) containerPwaInstall.style.display = 'none';
} else {
    BOTON_INSTALAR_PWA?.addEventListener('click', () => {
        try {
            containerPwaInstall?.showDialog?.(true); // con valor "true" para forzar aparición
        } catch (error) {
            console.error('Error al mostrar el diálogo de instalación PWA:', error);
        }
    });
}

// MARK: Botón tema
export const CHECKBOX_PERSONALIZAR_TEMA = document.querySelector('#checkbox-personalizar-tema');
CHECKBOX_PERSONALIZAR_TEMA?.addEventListener('change', () => {
    aplicarTema(CHECKBOX_PERSONALIZAR_TEMA.checked);
});

// MARK: Botón compartir
const DATOS_NAVIGATOR_SHARE = {
    title: 'teles',
    text: 'PWA Código Abierto para ver/comparar preseleccionadas transmisiones de noticias provenientes de Chile (y el mundo).',
    url: 'https://alplox.github.io/teles/'
};

/**
 * Genera una URL para compartir que incluye, cuando es posible, los canales activos
 * codificados en el parámetro `c` de la query string.
 * Se aplica un límite de seguridad tanto al número de canales como a la longitud total
 * de la URL para evitar problemas con navegadores/servidores.
 * @returns {string} URL lista para compartir.
 */
function obtenerUrlCompartirConCanalesActivos() {
    try {
        const urlBase = new URL(DATOS_NAVIGATOR_SHARE.url, window.location.href);

        const payload = localStorage.getItem('canales-vision-cuadricula');
        if (!payload) {
            urlBase.searchParams.delete('c');
            return urlBase.toString();
        }

        const datos = JSON.parse(payload);
        const ids = Object.keys(datos || {});
        if (!ids.length) {
            urlBase.searchParams.delete('c');
            return urlBase.toString();
        }

        const LIMITE_CANALES = 100;
        const idsLimitados = ids.slice(0, LIMITE_CANALES);

        urlBase.searchParams.set('c', idsLimitados.join(','));

        const LIMITE_URL = 1800;
        let urlFinal = urlBase.toString();
        if (urlFinal.length > LIMITE_URL) {
            // Si aun así se excede, vamos reduciendo canales hasta que la URL entre en el límite
            let canalesReducidos = idsLimitados.length;
            while (urlFinal.length > LIMITE_URL && canalesReducidos > 0) {
                canalesReducidos -= 5;
                const subset = idsLimitados.slice(0, Math.max(canalesReducidos, 1));
                if (!subset.length) break;
                urlBase.searchParams.set('c', subset.join(','));
                urlFinal = urlBase.toString();
            }
        }

        if (urlFinal.length > LIMITE_URL) {
            // Como último recurso, eliminamos el parámetro y usamos la URL base
            urlBase.searchParams.delete('c');
            return urlBase.toString();
        }

        return urlFinal;
    } catch (error) {
        console.error('[teles] Error al generar URL para compartir con canales activos:', error);
        return DATOS_NAVIGATOR_SHARE.url;
    }
}

const BOTON_COMPARTIR = document.querySelector('#boton-compartir');
const CONTENEDOR_BOTONES_COMPARTIR_RRSS = document.querySelector('#contenedor-botones-compartir');

// Compartir sitio (sin configuración de canales)
if (navigator.share && BOTON_COMPARTIR) {
    BOTON_COMPARTIR.addEventListener('click', async () => {
        try {
            await navigator.share(DATOS_NAVIGATOR_SHARE);
        } catch (err) {
            console.error(`[teles] Error al compartir usando navigator.share: ${err}`);
        }
    });
} else {
    BOTON_COMPARTIR?.classList.add('d-none');
    CONTENEDOR_BOTONES_COMPARTIR_RRSS?.classList.replace('d-none', 'd-flex');
}

// MARK: Botones carga canales predeterminados
const cargarCanalesPredeterminados = () => {
    try {
        document.querySelectorAll('div[data-canal]').forEach(transmision => {
            tele.remove(transmision.dataset.canal);
        });
        playAudioSinDelay(AUDIO_TURN_ON);
        obtenerCanalesPredeterminados(isMobile?.any).forEach(canal => tele.add(canal));
    } catch (error) {
        console.error(`Error durante carga canales predeterminados. Error: ${error}`);
        mostrarToast(`
        <span class="fw-bold">Ha ocurrido un error al intentar cargar canales predeterminados.</span>
        <hr>
        <span class="bg-dark bg-opacity-25 px-2 rounded-3">Error: ${error}</span>
        <hr>
        Si error persiste tras recargar, prueba borrar tu almacenamiento local desde el panel "Personalización" o borrando la caché del navegador.
        <button type="button" class="btn btn-light rounded-pill btn-sm w-100 border-light mt-2" onclick="location.reload()"> Pulsa para recargar <i class="bi bi-arrow-clockwise"></i></button>`, 'danger', false)
        return
    }
};

export const BOTON_MODAL_CANALES_PREDETERMINADOS = document.querySelector('#boton-modal-cargar-canales-por-defecto');
export const BOTON_OFFCANVAS_CANALES_PREDETERMINADOS = document.querySelector('#boton-offcanvas-cargar-canales-por-defecto');

BOTON_MODAL_CANALES_PREDETERMINADOS?.addEventListener('click', cargarCanalesPredeterminados);
BOTON_OFFCANVAS_CANALES_PREDETERMINADOS?.addEventListener('click', cargarCanalesPredeterminados);

// MARK: Botones quitar
export const BOTON_MODAL_QUITAR_TODO_ACTIVO = document.querySelector('#boton-modal-quitar-todo-canal-activo');
export const BOTON_OFFCANVAS_QUITAR_TODO_ACTIVO = document.querySelector('#boton-offcanvas-quitar-todo-canal-activo');

BOTON_MODAL_QUITAR_TODO_ACTIVO?.addEventListener('click', quitarTodoCanalActivo);
BOTON_OFFCANVAS_QUITAR_TODO_ACTIVO?.addEventListener('click', quitarTodoCanalActivo);

// MARK: Botón borrar localstorage
const BOTON_BORRAR_LOCALSTORAGE = document.querySelector('#boton-borrar-localstorage');
BOTON_BORRAR_LOCALSTORAGE?.addEventListener('click', () => {
    try {
        quitarTodoCanalActivo();
        localStorage.clear();
        AUDIO_ESTATICA.volume = 0.8;
        AUDIO_ESTATICA.loop = true;
        AUDIO_ESTATICA.play();
        document.querySelector('#alerta-borrado-localstorage')?.classList.remove('d-none');
    } catch (error) {
        console.error('Error al intentar eliminar almacenamiento local sitio: ', error);
        mostrarToast(`
        <span class="fw-bold">Ha ocurrido un error al intentar eliminar el almacenamiento local del sitio.</span>
        <hr>
        <span class="bg-dark bg-opacity-25 px-2 rounded-3">Error: ${error}</span>
        <hr>
        Si error persiste tras recargar, prueba borrar la caché del navegador.
        <button type="button" class="btn btn-light rounded-pill btn-sm w-100 border-light mt-2" onclick="location.reload()"> Pulsa para recargar <i class="bi bi-arrow-clockwise"></i></button>
        `, 'danger', false);
        return
    }
});

// MARK: Botón fullscreen
function enterFullscreen() {
    const element = document.documentElement;
    try {
        if (element.requestFullscreen) {
            element.requestFullscreen();
        } else if (element.webkitRequestFullscreen) {
            element.webkitRequestFullscreen();
        } else if (element.mozRequestFullScreen) {
            element.mozRequestFullScreen();
        } else if (element.msRequestFullscreen) {
            element.msRequestFullscreen();
        }
    } catch (error) {
        console.error(`Error al solicitar entrar a pantalla completa. Error: ${error}`);
        mostrarToast(`
        <span class="fw-bold">Ha ocurrido un error al solicitar entrar a pantalla completa.</span>
        <hr>
        <span class="bg-dark bg-opacity-25 px-2 rounded-3">Error: ${error}</span>
        <hr>
        Si error persiste tras recargar, prueba borrar la caché del navegador.
        <button type="button" class="btn btn-light rounded-pill btn-sm w-100 border-light mt-2" onclick="location.reload()"> Pulsa para recargar <i class="bi bi-arrow-clockwise"></i></button>
        `, 'danger', false);
        return
    }
}

function exitFullscreen() {
    try {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
    } catch (error) {
        console.error(`Error al solicitar salir de pantalla completa. Error: ${error}`);
        mostrarToast(`
        <span class="fw-bold">Ha ocurrido un error al solicitar salir de pantalla completa.</span>
        <hr>
        <span class="bg-dark bg-opacity-25 px-2 rounded-3">Error: ${error}</span>
        <hr>
        Si error persiste tras recargar, prueba borrar la caché del navegador.
        <button type="button" class="btn btn-light rounded-pill btn-sm w-100 border-light mt-2" onclick="location.reload()"> Pulsa para recargar <i class="bi bi-arrow-clockwise"></i></button>
        `, 'danger', false);
        return
    }
}

function isFullscreenSupported() {
    return !!(
        document.fullscreenEnabled
        || document.webkitFullscreenEnabled
        || document.mozFullScreenEnabled
        || document.msFullscreenEnabled
    );
}

function isFullscreen() {
    return isFullscreenSupported() && !!(
        document.fullscreenElement
        || document.webkitFullscreenElement
        || document.mozFullScreenElement
        || document.msFullscreenElement
        /* || window.innerHeight == screen.height */
    );
}

const BOTON_FULLSCREEN = document.querySelector('#boton-fullscreen');
BOTON_FULLSCREEN?.addEventListener('click', () => {
    isFullscreen() ? exitFullscreen() : enterFullscreen();
});

if (!isFullscreenSupported() && BOTON_FULLSCREEN?.parentElement?.parentElement) {
    BOTON_FULLSCREEN.parentElement.parentElement.classList.toggle('d-none');
}

function handleFullscreenChange() {
    if (!BOTON_FULLSCREEN) return;
    isFullscreen()
        ? (BOTON_FULLSCREEN.innerHTML = 'Salir pantalla completa <i class="bi bi-fullscreen-exit ms-auto"></i>', BOTON_FULLSCREEN.classList.replace('btn-light-subtle', 'btn-indigo'))
        : (BOTON_FULLSCREEN.innerHTML = 'Entrar pantalla completa <i class="bi bi-arrows-fullscreen ms-auto"></i>', BOTON_FULLSCREEN.classList.replace('btn-indigo', 'btn-light-subtle'));
}

/* window.addEventListener('resize', handleFullscreenChange); */

document.addEventListener('keydown', (event) => {
    if (event.key === 'F11') {
        event.preventDefault();
        isFullscreen() ? exitFullscreen() : enterFullscreen();
    }
});

document.addEventListener('fullscreenchange', handleFullscreenChange);
document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
document.addEventListener('mozfullscreenchange', handleFullscreenChange);
document.addEventListener('MSFullscreenChange', handleFullscreenChange);


// MARK: Botón copiar enlace sitio
const BOTON_COPIAR_ENLACE_COMPARTIR = document.querySelector('#boton-copiar-enlace-compartir');
const INPUT_ENLACE_COMPARTIR = document.querySelector('#input-enlace-compartir');

BOTON_COPIAR_ENLACE_COMPARTIR?.addEventListener('click', async () => {
    try {
        INPUT_ENLACE_COMPARTIR?.select?.();

        if (navigator.clipboard && INPUT_ENLACE_COMPARTIR) {
            await navigator.clipboard.writeText(INPUT_ENLACE_COMPARTIR.value);
            playAudioSinDelay(AUDIO_SUCCESS);
            BOTON_COPIAR_ENLACE_COMPARTIR.innerHTML = 'Copiado exitoso! <i class="bi bi-clipboard-check"></i>';
            BOTON_COPIAR_ENLACE_COMPARTIR.classList.add('bg-success');
        } else {
            throw new Error('Clipboard API no soportada o input no encontrado');
        }
    } catch (error) {
        console.error('Error al copiar el enlace usando navigator.clipboard: ', error);
        try {
            document.execCommand('copy', false, INPUT_ENLACE_COMPARTIR?.value ?? DATOS_NAVIGATOR_SHARE.url);
            playAudioSinDelay(AUDIO_SUCCESS);
            BOTON_COPIAR_ENLACE_COMPARTIR.innerHTML = 'Copiado exitoso! <i class="bi bi-clipboard-check"></i>';
            BOTON_COPIAR_ENLACE_COMPARTIR.classList.add('bg-success');
        } catch (execError) {
            console.error('Error al copiar el enlace usando execCommand: ', execError);
            playAudioSinDelay(AUDIO_FAIL);
            BOTON_COPIAR_ENLACE_COMPARTIR.innerHTML = 'Copiado fallido! <i class="bi bi-clipboard-x"></i>';
            BOTON_COPIAR_ENLACE_COMPARTIR.classList.add('bg-danger');
            return;
        }
    } finally {
        setTimeout(() => {
            if (BOTON_COPIAR_ENLACE_COMPARTIR) {
                BOTON_COPIAR_ENLACE_COMPARTIR.innerHTML = 'Copiar enlace <i class="bi bi-clipboard"></i>';
                BOTON_COPIAR_ENLACE_COMPARTIR.classList.remove('bg-success', 'bg-danger');
            }
        }, 2000);
    }
});

// MARK: Botón copiar enlace configuración de canales
const BOTON_COPIAR_ENLACE_COMPARTIR_SETUP = document.querySelector('#boton-copiar-enlace-compartir-setup');
const INPUT_ENLACE_COMPARTIR_SETUP = document.querySelector('#input-enlace-compartir-setup');

/**
 * Actualiza el input de compartir configuración con la URL generada según
 * los canales activos actuales, respetando los límites internos de
 * obtenerUrlCompartirConCanalesActivos.
 * @returns {void}
 */
function actualizarInputCompartirSetup() {
    if (!INPUT_ENLACE_COMPARTIR_SETUP) return;
    INPUT_ENLACE_COMPARTIR_SETUP.value = obtenerUrlCompartirConCanalesActivos();
}

const OFFCANVAS_PERSONALIZACION = document.querySelector('#sidepanel');
OFFCANVAS_PERSONALIZACION?.addEventListener('shown.bs.offcanvas', () => {
    actualizarInputCompartirSetup();
});

BOTON_COPIAR_ENLACE_COMPARTIR_SETUP?.addEventListener('click', async () => {
    try {
        actualizarInputCompartirSetup();
        INPUT_ENLACE_COMPARTIR_SETUP?.select?.();

        if (navigator.clipboard && INPUT_ENLACE_COMPARTIR_SETUP) {
            await navigator.clipboard.writeText(INPUT_ENLACE_COMPARTIR_SETUP.value);
            playAudioSinDelay(AUDIO_SUCCESS);
            BOTON_COPIAR_ENLACE_COMPARTIR_SETUP.innerHTML = 'Copiado exitoso! <i class="bi bi-clipboard-check"></i>';
            BOTON_COPIAR_ENLACE_COMPARTIR_SETUP.classList.add('bg-success');
        } else {
            throw new Error('Clipboard API no soportada o input no encontrado');
        }
    } catch (error) {
        console.error('Error al copiar el enlace de configuración usando navigator.clipboard: ', error);
        try {
            const textoFallback = INPUT_ENLACE_COMPARTIR_SETUP?.value ?? obtenerUrlCompartirConCanalesActivos();
            document.execCommand('copy', false, textoFallback);
            playAudioSinDelay(AUDIO_SUCCESS);
            BOTON_COPIAR_ENLACE_COMPARTIR_SETUP.innerHTML = 'Copiado exitoso! <i class="bi bi-clipboard-check"></i>';
            BOTON_COPIAR_ENLACE_COMPARTIR_SETUP.classList.add('bg-success');
        } catch (execError) {
            console.error('Error al copiar el enlace de configuración usando execCommand: ', execError);
            playAudioSinDelay(AUDIO_FAIL);
            BOTON_COPIAR_ENLACE_COMPARTIR_SETUP.innerHTML = 'Copiado fallido! <i class="bi bi-clipboard-x"></i>';
            BOTON_COPIAR_ENLACE_COMPARTIR_SETUP.classList.add('bg-danger');
            return;
        }
    } finally {
        setTimeout(() => {
            if (BOTON_COPIAR_ENLACE_COMPARTIR_SETUP) {
                BOTON_COPIAR_ENLACE_COMPARTIR_SETUP.innerHTML = 'Copiar setup <i class="bi bi-clipboard"></i>';
                BOTON_COPIAR_ENLACE_COMPARTIR_SETUP.classList.remove('bg-success', 'bg-danger');
            }
        }, 2000);
    }
});