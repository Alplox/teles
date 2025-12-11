import { getDefaultChannels, tele } from './main.js'
import {
    showToast,
    sortChannelButtonsAscending,
    sortChannelButtonsDescending,
    restoreOriginalChannelButtonsOrder,
    filterChannelsByInput,
    getActiveChannelIds,
} from './helpers/index.js'
import {
    AUDIO_STATIC,
    AUDIO_FAIL,
    AUDIO_SUCCESS,
    AUDIO_TURN_ON,
    LS_KEY_WELCOME_MODAL_VISIBILITY,
    CSS_CLASS_BUTTON_PRIMARY,
    ID_PREFIX_CONTAINERS_CHANNELS,
    LS_KEY_SAVED_CHANNELS_GRID_VIEW,
    AUDIO_TV_SHUTDOWN
} from './constants/index.js';
import { debounce, playAudio } from './utils/index.js';

// MARK: Button Welcome Modal
const buttonWelcomeModal = document.querySelector('#button-welcome-modal');
buttonWelcomeModal?.addEventListener('click', () => {
    localStorage.setItem(LS_KEY_WELCOME_MODAL_VISIBILITY, 'hide');
    playAudio(AUDIO_SUCCESS);
});

// MARK: Button PWA Install
let containerInstallPwa = document.querySelector('#pwa-install');
const buttonInstallPwa = document.querySelector('#button-pwa-install');

// Hide the button for unsupported browsers
if (navigator.userAgent.toLowerCase().includes('firefox')) {
    buttonInstallPwa?.classList.add('d-none');
    containerInstallPwa?.classList.add('d-none');
} else {
    buttonInstallPwa?.addEventListener('click', () => {
        try {
            containerInstallPwa?.showDialog?.(true); // "true" value to forced
        } catch (error) {
            console.error('[teles] Error at attempt to show PWA install dialog:', error);
        }
    });
}



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

        const payload = localStorage.getItem(LS_KEY_SAVED_CHANNELS_GRID_VIEW);
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
        console.error('[teles] Error at attempt to generate share URL with active channels:', error);
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
            console.error(`[teles] Error at attempt to share using navigator.share: ${err}`);
        }
    });
} else {
    BOTON_COMPARTIR?.classList.add('d-none');
    CONTENEDOR_BOTONES_COMPARTIR_RRSS?.classList.replace('d-none', 'd-flex');
}

// MARK: Botones carga canales predeterminados
const cargarCanalesPredeterminados = () => {
    try {
        removeAllChannels(false);
        playAudio(AUDIO_TURN_ON);
        getDefaultChannels(isMobile?.any).forEach(canal => tele.add(canal));
    } catch (error) {
        showToast({
            title: 'Error al cargar canales predeterminados',
            body: `Error: ${error}`,
            type: 'danger',
            autohide: false,
            delay: 0,
            showReloadOnError: true
        });
        return
    }
};

export const BUTTON_MODAL_LOAD_DEFAULT_CHANNELS = document.querySelector('#boton-modal-cargar-canales-por-defecto');
export const BUTTON_OFFCANVAS_LOAD_DEFAULT_CHANNELS = document.querySelector('#boton-offcanvas-cargar-canales-por-defecto');

BUTTON_MODAL_LOAD_DEFAULT_CHANNELS?.addEventListener('click', cargarCanalesPredeterminados);
BUTTON_OFFCANVAS_LOAD_DEFAULT_CHANNELS?.addEventListener('click', cargarCanalesPredeterminados);

// MARK: Botones quitar
const removeAllChannels = (withAudio = true) => {
    try {
        if (withAudio) playAudio(AUDIO_TV_SHUTDOWN)
        getActiveChannelIds().forEach(channelId => {
            if (channelId) tele.remove(channelId);
        });
    } catch (error) {
        console.error(`[teles] Error at attempt to remove all channels: ${error}`);
        showToast({
            title: 'Ha ocurrido un error al intentar quitar todos los canales.',
            body: `Error: ${error}`,
            type: 'danger',
            autohide: false,
            delay: 0,
            showReloadOnError: true
        });
        return
    }
};



export const BUTTON_MODAL_REMOVE_ALL_ACTIVE_CHANNELS = document.querySelector('#boton-modal-quitar-todo-canal-activo');
export const BUTTON_OFFCANVAS_REMOVE_ALL_ACTIVE_CHANNELS = document.querySelector('#boton-offcanvas-quitar-todo-canal-activo');

BUTTON_MODAL_REMOVE_ALL_ACTIVE_CHANNELS?.addEventListener('click', removeAllChannels);
BUTTON_OFFCANVAS_REMOVE_ALL_ACTIVE_CHANNELS?.addEventListener('click', removeAllChannels);

// MARK: Botón borrar localstorage
const BOTON_BORRAR_LOCALSTORAGE = document.querySelector('#boton-borrar-localstorage');
BOTON_BORRAR_LOCALSTORAGE?.addEventListener('click', () => {
    try {
        const safeRemoveAllChannels = () => {
            if (typeof removeAllChannels !== 'function') return;
            try { removeAllChannels(); } catch (error) { console.error('[teles] removeAllChannels failed:', error); }
        };

        const safeClearLocalStorage = () => {
            if (!window.localStorage) return;
            try { localStorage.clear(); } catch (error) { console.error('[teles] localStorage.clear failed:', error); }
        };

        const safePlayStatic = async () => {
            if (!AUDIO_STATIC) return;
            try {
                AUDIO_STATIC.volume = 0.8;
                AUDIO_STATIC.loop = true;
                await AUDIO_STATIC.play();
            } catch (error) {
                console.error('[teles] AUDIO_STATIC.play() reject:', error);
            }
        };
        safeRemoveAllChannels();
        safeClearLocalStorage();
        safePlayStatic();

        document.querySelector('#alerta-borrado-localstorage')?.classList.remove('d-none');
    } catch (error) {
        console.error('[teles] Error at attempt to clear local storage: ', error);
        showToast({
            title: 'Error al intentar eliminar almacenamiento local',
            body: `Error: ${error}`,
            type: 'danger',
            autohide: false,
            delay: 0,
            showReloadOnError: true
        });
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
        console.error('[teles] Error at attempt to enter fullscreen: ', error);
        showToast({
            title: 'Error al solicitar entrar a pantalla completa',
            body: `Error: ${error}`,
            type: 'danger',
            autohide: false,
            delay: 0,
            showReloadOnError: true
        });
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
        console.error('[teles] Error at attempt to exit fullscreen: ', error);
        showToast({
            title: 'Error al solicitar salir de pantalla completa',
            body: `Error: ${error}`,
            type: 'danger',
            autohide: false,
            delay: 0,
            showReloadOnError: true
        });
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
        ? (BOTON_FULLSCREEN.innerHTML = 'Salir pantalla completa <i class="bi bi-fullscreen-exit ms-auto"></i>', BOTON_FULLSCREEN.classList.replace('btn-light-subtle', CSS_CLASS_BUTTON_PRIMARY))
        : (BOTON_FULLSCREEN.innerHTML = 'Entrar pantalla completa <i class="bi bi-arrows-fullscreen ms-auto"></i>', BOTON_FULLSCREEN.classList.replace(CSS_CLASS_BUTTON_PRIMARY, 'btn-light-subtle'));
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
            playAudio(AUDIO_SUCCESS);
            BOTON_COPIAR_ENLACE_COMPARTIR.innerHTML = 'Copiado exitoso! <i class="bi bi-clipboard-check"></i>';
            BOTON_COPIAR_ENLACE_COMPARTIR.classList.add('bg-success');
        } else {
            throw new Error('Clipboard API no soportada o input no encontrado');
        }
    } catch (error) {
        console.error('[teles] Error at attempt to copy link using navigator.clipboard: ', error);
        try {
            document.execCommand('copy', false, INPUT_ENLACE_COMPARTIR?.value ?? DATOS_NAVIGATOR_SHARE.url);
            playAudio(AUDIO_SUCCESS);
            BOTON_COPIAR_ENLACE_COMPARTIR.innerHTML = 'Copiado exitoso! <i class="bi bi-clipboard-check"></i>';
            BOTON_COPIAR_ENLACE_COMPARTIR.classList.add('bg-success');
        } catch (execError) {
            console.error('[teles] Error at attempt to copy link using execCommand: ', execError);
            playAudio(AUDIO_FAIL);
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
            playAudio(AUDIO_SUCCESS);
            BOTON_COPIAR_ENLACE_COMPARTIR_SETUP.innerHTML = 'Copiado exitoso! <i class="bi bi-clipboard-check"></i>';
            BOTON_COPIAR_ENLACE_COMPARTIR_SETUP.classList.add('bg-success');
        } else {
            throw new Error('Clipboard API no soportada o input no encontrado');
        }
    } catch (error) {
        console.error('[teles] Error at attempt to copy link using navigator.clipboard: ', error);
        try {
            const textoFallback = INPUT_ENLACE_COMPARTIR_SETUP?.value ?? obtenerUrlCompartirConCanalesActivos();
            document.execCommand('copy', false, textoFallback);
            playAudio(AUDIO_SUCCESS);
            BOTON_COPIAR_ENLACE_COMPARTIR_SETUP.innerHTML = 'Copiado exitoso! <i class="bi bi-clipboard-check"></i>';
            BOTON_COPIAR_ENLACE_COMPARTIR_SETUP.classList.add('bg-success');
        } catch (execError) {
            console.error('[teles] Error at attempt to copy link using execCommand: ', execError);
            playAudio(AUDIO_FAIL);
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

// Ordenar botones canales

// CACHE: Crear mapas de elementos DOM una sola vez al cargar
const sortButtonsCache = new Map();

// Inicializar cache para cada prefijo
function initSortButtonsCache(prefix) {
    if (sortButtonsCache.has(prefix)) return sortButtonsCache.get(prefix);

    const buttons = {
        'ascending': {
            input: document.getElementById(`${prefix}-btn-ascending-order`),
            label: null
        },
        'descending': {
            input: document.getElementById(`${prefix}-btn-descending-order`),
            label: null
        },
        'default': {
            input: document.getElementById(`${prefix}-btn-default-order`),
            label: null
        }
    };

    // Cachear también los labels
    Object.keys(buttons).forEach(key => {
        if (buttons[key].input) {
            buttons[key].label = document.querySelector(`label[for="${buttons[key].input.id}"]`);
        }
    });

    sortButtonsCache.set(prefix, buttons);
    return buttons;
}

// Versión optimizada de handleSortClick
const handleSortClick = (prefix, type, sortFn) => {
    const buttons = initSortButtonsCache(prefix);

    // 1. Actualizar estado visual de forma eficiente
    Object.entries(buttons).forEach(([key, { input, label }]) => {
        if (!input || !label) return;

        const isActive = key === type;

        if (isActive) {
            // Activar
            label.classList.remove('btn-outline-indigo');
            label.classList.add(CSS_CLASS_BUTTON_PRIMARY);
            input.checked = true;
        } else {
            // Desactivar
            label.classList.remove(CSS_CLASS_BUTTON_PRIMARY);
            label.classList.add('btn-outline-indigo');
            input.checked = false;
        }
    });

    // 2. Ejecutar ordenamiento en el siguiente frame (UN SOLO RAF)
    const containerId = `${prefix}-channels-buttons-container`;
    requestAnimationFrame(() => sortFn(containerId));
};

for (const PREFIJO of ID_PREFIX_CONTAINERS_CHANNELS) {
    document.querySelector(`#${PREFIJO}-btn-ascending-order`)?.addEventListener('click', () =>
        handleSortClick(PREFIJO, 'ascending', sortChannelButtonsAscending));

    document.querySelector(`#${PREFIJO}-btn-descending-order`)?.addEventListener('click', () =>
        handleSortClick(PREFIJO, 'descending', sortChannelButtonsDescending));

    document.querySelector(`#${PREFIJO}-btn-default-order`)?.addEventListener('click', () =>
        handleSortClick(PREFIJO, 'default', restoreOriginalChannelButtonsOrder));

    let bodyBotonesCanales = document.querySelector(`#${PREFIJO}-channels-buttons-container`)
    const inputFiltro = document.querySelector(`#${PREFIJO}-input-filtro`);
    if (!inputFiltro) continue;

    const filtrarCanalesPorInputDebounced = debounce((valor) => {
        inputFiltro.focus();
        filterChannelsByInput(valor, bodyBotonesCanales);
    }, 200);

    inputFiltro.addEventListener('input', (e) => {
        filtrarCanalesPorInputDebounced(e.target.value);
    });
}