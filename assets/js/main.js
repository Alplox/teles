/* 
  main v0.18
  by Alplox 
  https://github.com/Alplox/teles
*/

// MARK: import
import { activarTooltipsBootstrap, removerTooltipsBootstrap } from './controlTooltips.js';
import { hideTextoBotonesOverlay } from './hideTextoBotonesOverlay.js';
import {
    guardarOrdenOriginal,
    ordenarBotonesCanalesAscendente,
    ordenarBotonesCanalesDescendente,
    restaurarOrdenOriginalBotonesCanales
} from './ordenarBotones.js';
import { CODIGOS_PAISES } from './nombrePaises.js';
import { filtrarCanalesPorInput } from './filtroCanales.js';
import { alternarPosicionBotonesFlotantes, clicBotonPosicionBotonesFlotantes } from './moverBotonesFlotantes.js';
import { ajustarNumeroDivisionesClaseCol, ajustarClaseColTransmisionesPorFila } from './ajustarClasesCanalesActivos.js';
import { detectarTemaSistema } from './detectarTemaSistema.js';
import { ajustarVisibilidadBotonesQuitarTodaSeñal } from './ajustarVisibilidadBotonesQuitarTodaSeñal.js';

// MARK: Config
const URL_JSON_CANALES_PRINCIPAL = 'https://raw.githubusercontent.com/Alplox/json-teles/main/canales.json';
const URL_M3U_CANALES_IPTV = 'https://iptv-org.github.io/iptv/categories/news.m3u'; // revisar https://github.com/iptv-org/api
export const CLASE_CSS_BOTON_PRIMARIO = 'btn-indigo';
export const CLASE_CSS_BOTON_SECUNDARIO = 'btn-dark-subtle'
export const PREFIJOS_ID_CONTENEDORES_CANALES = ['modal-canales', 'offcanvas-canales', 'modal-cambiar-canal', 'vision-unica'];
const TWITCH_PARENT = 'alplox.github.io'
const ARRAY_CANALES_PREDETERMINADOS = ['24-horas', 'meganoticias', 't13'];
const ARRAY_CANALES_PREDETERMINADOS_EXTRAS = ['chv-noticias', 'galeria-cima', 'lofi-girl'];
const ICONOS_PARA_CATEGORIAS = {
    // Formato de https://github.com/iptv-org/iptv?tab=readme-ov-file#grouped-by-category
    'animation': '<i class="bi bi-emoji-laughing-fill" title="Icono dibujos animados"></i>',
    'auto': '<i class="bi bi-car-front" title="Icono auto"></i>',
    'business': '<i class="bi bi-kanban" title="Icono negocios"></i>',
    'classic': '<i class="bi bi-cassette" title="Icono clásico"></i>',
    'comedy': '<i class="bi bi-emoji-grin-fill" title="Icono comedia"></i>',
    'cooking': '<i class="bi bi-egg-fill" title="Icono huevo"></i>',
    'culture': '<i class="bi bi-globe" title="Icono cultura"></i>',
    'documentary': '<i class="bi bi-camera-reels" title="Icono documental"></i>',
    'education': '<i class="bi bi-book" title="Icono educación"></i>',
    'entertainment': '<i class="bi bi-hand-thumbs-up-fill" title="Icono entretenimiento"></i>',
    'family': '<i class="bi bi-people-fill" title="Icono familia"></i>',
    'general': '<i class="bi bi-tv" title="Icono general"></i>',
    'kids': '<i class="bi bi-emoji-smile-fill" title="Icono niños"></i>',
    'legislative': '<i class="bi bi-vector-pen" title="Icono legislativo"></i>',
    'lifestyle': '<i class="bi bi-house" title="Icono estilo de vida"></i>',
    'movies': '<i class="bi bi-camera-reels" title="Icono películas"></i>',
    'music': '<i class="bi bi-music-note-beamed" title="Icono música"></i>',
    'news': '<i class="bi bi-newspaper" title="Icono noticias"></i>',
    'outdoor': '<i class="bi bi-bicycle" title="Icono al aire libre"></i>',
    'relax': '<i class="bi bi-cup-hot" title="Icono relajado"></i>',
    'religious': '<i class="bi bi-tree" title="Icono religion"></i>',
    'science': '<i class="bi bi-rocket-takeoff" title="Icono ciencia"></i>',
    'series': '<i class="bi bi-badge-hd" title="Icono series"></i>',
    'shop': '<i class="bi bi-bag" title="Icono tienda"></i>',
    'sports': '<i class="bi bi-trophy" title="Icono deportes"></i>',
    'travel': '<i class="bi bi-airplane" title="Icono viaje"></i>',
    'weather': '<i class="bi bi-cloud-sun" title="Icono clima"></i>',
    'xxx': '<i class="bi bi-tv" title="Icono adultos"></i>',
    'undefined': '<i class="bi bi-tv" title="Icono indefinido"></i>',

    // Extras
    'radio': '<i class="bi bi-boombox" title="Icono radio"></i>',
    'camera': '<i class="bi bi-camera" title="Icono cámara"></i>'
};
const VALOR_COL_FIJO_ESCRITORIO = 4;
const VALOR_COL_FIJO_TELEFONO = 12;

// MARK: Audio
export const AUDIO_ESTATICA = new Audio('assets/sounds/DefectLineTransformer-por-blaukreuz.wav');
export const AUDIO_FAIL = new Audio('assets/sounds/Cancel-miss-chime-by-Raclure.wav');
export const AUDIO_SUCCESS = new Audio('assets/sounds/button-pressed-by-Pixabay.mp3');
const AUDIO_TV_SHUTDOWN = new Audio('assets/sounds/TV-Shutdown-por-MATRIXXX_.mp3');
export const AUDIO_TURN_ON = new Audio('assets/sounds/CRT-turn-on-notification-por-Coolshows101sound.mp3');
const AUDIO_POP = new Audio('assets/sounds/User-Interface-Clicks-and-Buttons-1-por-original_sound.mp3');

// MARK: querySelector Globales
const MAIN_NAVBAR = document.querySelector('#navbar');

export const CONTAINER_VISION_CUADRICULA = document.querySelector('#container-vision-cuadricula');
const CONTAINER_VISION_UNICA = document.querySelector('#container-vision-unica');
const CONTAINER_VIDEO_VISION_UNICA = document.querySelector('#container-video-vision-unica');
const ICONO_SIN_SEÑAL_ACTIVA_VISION_UNICA = document.querySelector('#icono-sin-señal-vision-unica');

const BOTON_ACTIVAR_VISION_UNICA = document.querySelector('#boton-activar-diseño-vision-unica');
const BOTON_ACTIVAR_VISION_GRID = document.querySelector('#boton-activar-diseño-vision-grid');

const MODAL_CAMBIAR_CANAL = document.querySelector('#modal-cambiar-canal');
const LABEL_MODAL_CAMBIAR_CANAL = document.querySelector('#label-para-nombre-canal-cambiar');

// MARK: Traducción videojs
if (videojs) {
    videojs.addLanguage("es", {
        "Play": "Reproducir",
        "Play Video": "Reproducir Vídeo",
        "Pause": "Pausa",
        "Current Time": "Tiempo reproducido",
        "Duration": "Duración total",
        "Remaining Time": "Tiempo restante",
        "Stream Type": "Tipo de secuencia",
        "LIVE": "DIRECTO",
        "Loaded": "Cargado",
        "Progress": "Progreso",
        "Fullscreen": "Pantalla completa",
        "Non-Fullscreen": "Pantalla no completa",
        "Mute": "Silenciar",
        "Unmute": "No silenciado",
        "Playback Rate": "Velocidad de reproducción",
        "Subtitles": "Subtítulos",
        "subtitles off": "Subtítulos desactivados",
        "Captions": "Subtítulos especiales",
        "captions off": "Subtítulos especiales desactivados",
        "Chapters": "Capítulos",
        "You aborted the media playback": "Ha interrumpido la reproducción del vídeo.",
        "A network error caused the media download to fail part-way.": "Un error de red ha interrumpido la descarga del vídeo.",
        "The media could not be loaded, either because the server or network failed or because the format is not supported.": "No se ha podido cargar el vídeo debido a un fallo de red o porque la transmisión dejo de estar disponible.",
        "The media playback was aborted due to a corruption problem or because the media used features your browser did not support.": "La reproducción de vídeo se ha interrumpido por un problema de corrupción de datos o porque el vídeo precisa funciones que su navegador no ofrece.",
        "No compatible source was found for this media.": "No se ha encontrado ninguna fuente compatible con este vídeo.",
        "Audio Player": "Reproductor de audio",
        "Video Player": "Reproductor de video",
        "Replay": "Volver a reproducir",
        "Seek to live, currently behind live": "Buscar en vivo, actualmente demorado con respecto a la transmisión en vivo",
        "Seek to live, currently playing live": "Buscar en vivo, actualmente reproduciendo en vivo",
        "Progress Bar": "Barra de progreso",
        "progress bar timing: currentTime={1} duration={2}": "{1} de {2}",
        "Descriptions": "Descripciones",
        "descriptions off": "descripciones desactivadas",
        "Audio Track": "Pista de audio",
        "Volume Level": "Nivel de volumen",
        "The media is encrypted and we do not have the keys to decrypt it.": "El material audiovisual está cifrado y no tenemos las claves para descifrarlo.",
        "Close": "Cerrar",
        "Modal Window": "Ventana modal",
        "This is a modal window": "Esta es una ventana modal",
        "This modal can be closed by pressing the Escape key or activating the close button.": "Esta ventana modal puede cerrarse presionando la tecla Escape o activando el botón de cierre.",
        ", opens captions settings dialog": ", abre el diálogo de configuración de leyendas",
        ", opens subtitles settings dialog": ", abre el diálogo de configuración de subtítulos",
        ", selected": ", seleccionado",
        "Close Modal Dialog": "Cierra cuadro de diálogo modal",
        ", opens descriptions settings dialog": ", abre el diálogo de configuración de las descripciones",
        "captions settings": "configuración de leyendas",
        "subtitles settings": "configuración de subtítulos",
        "descriptions settings": "configuración de descripciones",
        "Text": "Texto",
        "White": "Blanco",
        "Black": "Negro",
        "Red": "Rojo",
        "Green": "Verde",
        "Blue": "Azul",
        "Yellow": "Amarillo",
        "Magenta": "Magenta",
        "Cyan": "Cian",
        "Background": "Fondo",
        "Window": "Ventana",
        "Transparent": "Transparente",
        "Semi-Transparent": "Semitransparente",
        "Opaque": "Opaca",
        "Font Size": "Tamaño de fuente",
        "Text Edge Style": "Estilo de borde del texto",
        "None": "Ninguno",
        "Raised": "En relieve",
        "Depressed": "Hundido",
        "Uniform": "Uniforme",
        "Dropshadow": "Sombra paralela",
        "Font Family": "Familia de fuente",
        "Proportional Sans-Serif": "Sans-Serif proporcional",
        "Monospace Sans-Serif": "Sans-Serif monoespacio",
        "Proportional Serif": "Serif proporcional",
        "Monospace Serif": "Serif monoespacio",
        "Casual": "Informal",
        "Script": "Cursiva",
        "Small Caps": "Minúsculas",
        "Reset": "Restablecer",
        "restore all settings to the default values": "restablece todas las configuraciones a los valores predeterminados",
        "Done": "Listo",
        "Caption Settings Dialog": "Diálogo de configuración de leyendas",
        "Beginning of dialog window. Escape will cancel and close the window.": "Comienzo de la ventana de diálogo. La tecla Escape cancelará la operación y cerrará la ventana.",
        "End of dialog window.": "Final de la ventana de diálogo.",
        "{1} is loading.": "{1} se está cargando."
    });
}

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
    (CHECKBOX_PERSONALIZAR_VISUALIZACION_NAVBAR.checked ? checkboxOn : checkboxOff)(CHECKBOX_PERSONALIZAR_VISUALIZACION_NAVBAR, SPAN_VALOR_CHECKBOX_PERSONALIZAR_VISUALIZACION_NAVBAR, 'navbar-display');
});

// Overlay
const CHECKBOX_PERSONALIZAR_VISUALIZACION_OVERLAY = document.querySelector('#checkbox-personalizar-visualizacion-overlay');
const SPAN_VALOR_CHECKBOX_PERSONALIZAR_VISUALIZACION_OVERLAY = document.querySelector('#span-valor-visualizacion-overlay');
CHECKBOX_PERSONALIZAR_VISUALIZACION_OVERLAY.addEventListener('click', () => {
    document.body.classList.toggle('d-none__barras-overlay', !CHECKBOX_PERSONALIZAR_VISUALIZACION_OVERLAY.checked);
    (CHECKBOX_PERSONALIZAR_VISUALIZACION_OVERLAY.checked ? checkboxOn : checkboxOff)(CHECKBOX_PERSONALIZAR_VISUALIZACION_OVERLAY, SPAN_VALOR_CHECKBOX_PERSONALIZAR_VISUALIZACION_OVERLAY, 'overlay-display');
    actualizarBotonesPersonalizarOverlay();
});

const BOTONES_PERSONALIZAR_OVERLAY = document.querySelectorAll('.div-boton-personalizar-overlay');
BOTONES_PERSONALIZAR_OVERLAY.forEach(contenedorBoton => {
    let botonIndividual = contenedorBoton.querySelector('.btn-check');
    let datasetBoton = botonIndividual.dataset.botonoverlay
    botonIndividual.addEventListener('click', () => {
        localStorage.setItem(`${datasetBoton}`, botonIndividual.checked ? 'show' : 'hide');
        actualizarBotonesPersonalizarOverlay();
    });
});

// Tamaño
const INPUT_RANGE_PERSONALIZACION_TAMAÑO_VISION_CUADRICULA = document.querySelector('#input-range-tamaño-container-vision-cuadricula');
const SPAN_VALOR_INPUT_RANGE = document.querySelector('#span-valor-input-range');

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
    (CHECKBOX_PERSONALIZAR_TEXTO_BOTONES_FLOTANTES.checked ? checkboxOn : checkboxOff)(CHECKBOX_PERSONALIZAR_TEXTO_BOTONES_FLOTANTES, SPAN_VALOR_CHECKBOX_PERSONALIZAR_TEXTO_BOTONES_FLOTANTES, 'texto-botones-flotantes');

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
    (CHECKBOX_PERSONALIZAR_VISUALIZACION_TARJETA_LOGO_BACKGROUND.checked ? checkboxOn : checkboxOff)(CHECKBOX_PERSONALIZAR_VISUALIZACION_TARJETA_LOGO_BACKGROUND, SPAN_VALOR_CHECKBOX_PERSONALIZAR_VISUALIZACION_TARJETA_LOGO_BACKGROUND, 'tarjeta-fondo-display');
    CHECKBOX_PERSONALIZAR_VISUALIZACION_TARJETA_LOGO_BACKGROUND.checked ? ICONO_PERSONALIZAR_VISUALIZACION_TARJETA_LOGO_BACKGROUND.classList.replace('bi-eye-slash', 'bi-eye') : ICONO_PERSONALIZAR_VISUALIZACION_TARJETA_LOGO_BACKGROUND.classList.replace('bi-eye', 'bi-eye-slash');
});

// MARK: FETCH CANALES
/*
   _____          _   _          _      ______  _____ 
  / ____|   /\   | \ | |   /\   | |    |  ____|/ ____|
 | |       /  \  |  \| |  /  \  | |    | |__  | (___  
 | |      / /\ \ | . ` | / /\ \ | |    |  __|  \___ \ 
 | |____ / ____ \| |\  |/ ____ \| |____| |____ ____) |
  \_____/_/    \_\_| \_/_/    \_\______|______ _____/ 
*/
export let listaCanales;
/* let listaCanalesRespaldo; */

async function fetchCargarCanales() {
    try {
        console.info('Probando carga archivo principal con canales');
        const response = await fetch(URL_JSON_CANALES_PRINCIPAL);
        listaCanales = await response.json();
        /* listaCanalesRespaldo = { ...listaCanales }; // Hacer una copia del objeto listaCanales */
    } catch (error) {
        console.error(`Error al cargar el archivo principal con canales. Error: ${error}`);

        document.querySelector('.fondo-global').classList.add('d-none');
        document.querySelector('main').classList.add('d-none');
        document.querySelector('#alerta-error-carga-canales').classList.remove('d-none');
        document.querySelector('#span-contenedor-error').innerHTML = `Mensaje error: ${error}`;

        for (const PREFIJO of PREFIJOS_ID_CONTENEDORES_CANALES) {
            document.querySelector(`#${PREFIJO}-body-botones-canales`).insertAdjacentElement('afterend', insertarDivError(error, 'Ha ocurrido un error durante la creación de botones para los canales'));
        }

        document.querySelector('#boton-borrar-localstorage-no-carga-canales').addEventListener('click', () => {
            try {
                quitarTodoCanalActivo();
                localStorage.clear();
                AUDIO_ESTATICA.volume = 0.8;
                AUDIO_ESTATICA.loop = true;
                AUDIO_ESTATICA.play();
                document.querySelector('#alerta-borrado-localstorage').classList.remove('d-none');
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
        })
        return
    };
}

async function fetchCargarCanalesIPTV() {
    console.info('Probando carga archivo m3u');
    const m3uResponse = await fetch(URL_M3U_CANALES_IPTV);
    const m3uData = await m3uResponse.text();
    const parseM3u = await M3U_A_JSON(m3uData);

    // Crear un mapa para indexar los canales por nombre
    const mapCanales = {};
    if (listaCanales) {
        for (const canal in listaCanales) {
            const nombreLista = listaCanales[canal].nombre ?? 'Canal sin nombre';
            mapCanales[nombreLista] = listaCanales[canal];
        }

        // Combinar los canales de parseM3u con los de listaCanales
        for (const nombreCanal in parseM3u) {
            const nombreParseM3u = parseM3u[nombreCanal].nombre ?? 'Canal sin nombre';
            const existingChannel = mapCanales[nombreParseM3u];

            if (existingChannel && sonNombresSimilares(existingChannel.nombre, nombreParseM3u)) {
                const newUrls = parseM3u[nombreCanal].señales.m3u8_url.filter(url => !existingChannel.señales.m3u8_url.includes(url));
                existingChannel.señales.m3u8_url.push(...newUrls);
            } else {
                listaCanales[nombreCanal] = parseM3u[nombreCanal];
            }
        }
    }
}

// MARK: Funciones
// Hacen una sola tarea
async function M3U_A_JSON(m3u) {
    const channels = {};
    const lines = m3u.split('\n').filter(line => line.trim() !== '');

    for (let i = 1; i < lines.length; i++) {
        const channelInfo = lines[i].match(/([^\s]+)="([^"]+)"/g);
        if (channelInfo) {
            const attributes = channelInfo.reduce((acc, attr) => {
                const [key, value] = attr.split('=');
                acc[key.replace(/"/g, '')] = value.replace(/"/g, '');
                return acc;
            }, {});

            //  const NOMBRE_CANAL = lines[i].match(/,([^,]+)$/)[1] ?? 'Nombre canal no encontrado'; //añade lo de (1080p) [24//7]
            const NOMBRE_CANAL = lines[i].match(/,([^,(]+)/)[1]?.trim() ?? 'Nombre canal no encontrado'; // no añade lo que este luego del primer "("

            const LOGO_IMG = attributes['tvg-logo'] ?? "";
            const GROUP_TITLE_ID = attributes['group-title']?.toLowerCase() ?? "";

            const TVG_ID = attributes['tvg-id'] ?? `canal-m3u8-${i}.`;
            const [NOMBRE_CANAL_PARA_ID, COUNTRY_ID = ""] = TVG_ID.toLowerCase().split('.');

            channels[NOMBRE_CANAL_PARA_ID] = {
                "nombre": NOMBRE_CANAL,
                "logo": LOGO_IMG,
                "señales": {
                    "iframe_url": [],
                    "m3u8_url": [lines[i + 1]],
                    "yt_id": "",
                    "yt_embed": "",
                    "yt_playlist": "",
                    "twitch_id": ""
                },
                "sitio_oficial": "",
                "categoría": GROUP_TITLE_ID,
                "país": COUNTRY_ID,
            };
        }
    }
    return channels;
}

function sonNombresSimilares(nombre1, nombre2) {
    const nombre1Lower = nombre1.toLowerCase();
    const nombre2Lower = nombre2.toLowerCase();
    return nombre1Lower.includes(nombre2Lower) || nombre2Lower.includes(nombre1Lower);
}

export function obtenerCanalesPredeterminados(isMobile) {
    return isMobile ? ARRAY_CANALES_PREDETERMINADOS : ARRAY_CANALES_PREDETERMINADOS.concat(ARRAY_CANALES_PREDETERMINADOS_EXTRAS);
}

export function playAudioSinDelay(audio) {
    audio.pause();  // https://stackoverflow.com/a/51573799
    audio.currentTime = 0;
    audio.play();
}

export function guardarCanalesEnLocalStorage() {
    try {
        const CANALES_ACTIVOS_EN_DOM = CONTAINER_VISION_CUADRICULA.querySelectorAll('div[data-canal]');
        localStorage.removeItem('canales-vision-cuadricula');
        let lsCanales = JSON.parse(localStorage.getItem('canales-vision-cuadricula')) || {};
        CANALES_ACTIVOS_EN_DOM.forEach(divCanal => {
            lsCanales[divCanal.dataset.canal] = listaCanales[divCanal.dataset.canal].nombre;
        });
        localStorage.setItem('canales-vision-cuadricula', JSON.stringify(lsCanales));

        document.querySelector('#alerta-guardado-canales').classList.remove('d-none');
        setTimeout(() => {
            document.querySelector('#alerta-guardado-canales').classList.add('d-none');
        }, 420);
    } catch (error) {
        console.error('Error al intentar guardar canales en el almacenamiento local: ', error);
        mostrarToast(`
        <span class="fw-bold">Error al intentar guardar canales en el almacenamiento local.</span>
        <hr>
        <span class="bg-dark bg-opacity-25 px-2 rounded-3">Error: ${error}</span>
        <hr>
        Si error persiste tras recargar, prueba borrar tu almacenamiento local desde el panel "Personalización" o borrando la caché del navegador.
        <button type="button" class="btn btn-light rounded-pill btn-sm w-100 border-light mt-2" onclick="location.reload()"> Pulsa para recargar <i class="bi bi-arrow-clockwise"></i></button>`, 'danger', false)
        return
    }
}

export function quitarTodoCanalActivo() {
    try {
        playAudioSinDelay(AUDIO_TV_SHUTDOWN)

        document.querySelectorAll('div[data-canal]').forEach(canalActivo => {
            const CANAL_A_REMOVER = canalActivo.dataset.canal;
            if (CANAL_A_REMOVER) {
                tele.remove(CANAL_A_REMOVER);
            }
        });
    } catch (error) {
        console.error(`Error al intentar quitar todos los canales. Error: ${error}`);
        mostrarToast(`
        <span class="fw-bold">Ha ocurrido un error al intentar quitar todos los canales.</span>
        <hr>
        <span class="bg-dark bg-opacity-25 px-2 rounded-3">Error: ${error}</span>
        <hr>
        Si error persiste tras recargar, prueba borrar tu almacenamiento local desde el panel "Personalización" o borrando la caché del navegador.
        <button type="button" class="btn btn-light rounded-pill btn-sm w-100 border-light mt-2" onclick="location.reload()"> Pulsa para recargar <i class="bi bi-arrow-clockwise"></i></button>`, 'danger', false)
        return
    }
};

export function mostrarToast(mensaje = '', tipo = 'secondary', autohideValue = true, delayValue = 3500) {
    const TOAST_CONTAINER = document.querySelector('#toast-container');
    const TOAST_DIV = document.createElement('div');
    TOAST_DIV.setAttribute('role', 'alert');
    TOAST_DIV.setAttribute('aria-live', 'assertive');
    TOAST_DIV.setAttribute('aria-atomic', 'true');
    TOAST_DIV.classList.add('toast', 'd-flex', 'align-items-center', 'border-0');

    let toastIcono = '<i class="bi bi-info-circle-fill"></i>';
    if (tipo === 'success') {
        TOAST_DIV.classList.add('bg-success', 'text-white');
        toastIcono = '<i class="bi bi-check-circle"></i>';
    } else if (tipo === 'warning') {
        TOAST_DIV.classList.add('bg-warning', 'text-dark');
        toastIcono = '<i class="bi bi-exclamation-circle"></i>';
    } else if (tipo === 'danger') {
        TOAST_DIV.classList.add('bg-danger', 'text-white');
        toastIcono = '<i class="bi bi-x-circle"></i>';
    } else if (tipo === 'info') {
        TOAST_DIV.classList.add('bg-info', 'text-dark');
        toastIcono = '<i class="bi bi-info-circle"></i>';
    } else if (tipo === 'primary') {
        TOAST_DIV.classList.add('bg-primary', 'text-white');
    } else if (tipo === 'secondary') {
        TOAST_DIV.classList.add('bg-secondary', 'text-white');
    } else {
        TOAST_DIV.classList.add('bg-secondary', 'text-white');
    }

    const TOAST_BODY = document.createElement('div');
    TOAST_BODY.innerHTML = `${toastIcono} ${mensaje}`;
    TOAST_BODY.classList.add('toast-body');

    const TOAST_BOTON_CERRAR = document.createElement('button');
    TOAST_BOTON_CERRAR.setAttribute('type', 'button');
    TOAST_BOTON_CERRAR.setAttribute('data-bs-dismiss', 'toast');
    TOAST_BOTON_CERRAR.setAttribute('aria-label', 'Close');
    TOAST_BOTON_CERRAR.classList.add('btn-close', 'btn-close-white', 'me-2', 'm-auto');
    TOAST_BOTON_CERRAR.addEventListener('click', () => {
        TOAST_DIV.remove();
    });

    TOAST_DIV.append(TOAST_BODY);
    TOAST_DIV.append(TOAST_BOTON_CERRAR);
    TOAST_CONTAINER.append(TOAST_DIV);

    const BOOTSTRAP_TOAST = new bootstrap.Toast(TOAST_DIV, { delay: Number(delayValue), autohide: autohideValue });
    BOOTSTRAP_TOAST.show();
}

export function obtenerNumeroCanalesFila() { // el numero, no el valor clase 'col-'
    let lsTransmisionesFila = localStorage.getItem('numero-class-columnas-por-fila');
    let seleccionTransmisionesFila;
    if (lsTransmisionesFila === '12') {
        seleccionTransmisionesFila = 1;
    } else if (lsTransmisionesFila === '6') {
        seleccionTransmisionesFila = 2;
    } else if (lsTransmisionesFila === '4') {
        seleccionTransmisionesFila = 3;
    } else if (lsTransmisionesFila === '3') {
        seleccionTransmisionesFila = 4;
    } else if (lsTransmisionesFila === '2') {
        seleccionTransmisionesFila = 6;
    } else if (lsTransmisionesFila === '1') {
        seleccionTransmisionesFila = 12;
    };
    return seleccionTransmisionesFila
}

function checkboxOn(checkbox, status, item) {
    checkbox.checked = true;
    status.textContent = '[Visible]';
    localStorage.setItem(item, 'show');
};

function checkboxOff(checkbox, status, item) {
    checkbox.checked = false;
    status.textContent = '[Oculto]';
    localStorage.setItem(item, 'hide');
};

function actualizarValorSlider() {
    let valorInputRange = parseInt(localStorage.getItem('valor-input-range') ?? 100);
    INPUT_RANGE_PERSONALIZACION_TAMAÑO_VISION_CUADRICULA.setAttribute('value', valorInputRange);
    SPAN_VALOR_INPUT_RANGE.textContent = `${valorInputRange}%`;
    CONTAINER_VISION_CUADRICULA.style.maxWidth = `${valorInputRange}%`;
}

function actualizarBotonesPersonalizarOverlay() {
    try {
        BOTONES_PERSONALIZAR_OVERLAY.forEach(contenedorBoton => {
            let botonIndividual = contenedorBoton.querySelector('.btn-check');
            let datasetBoton = botonIndividual.dataset.botonoverlay;
            let spanValorBoton = contenedorBoton.querySelector('span');
    
            if (localStorage.getItem('overlay-display') !== 'hide') {
                botonIndividual.disabled = false;
                document.body.classList.remove('d-none__barras-overlay');
                checkboxOn(CHECKBOX_PERSONALIZAR_VISUALIZACION_OVERLAY, SPAN_VALOR_CHECKBOX_PERSONALIZAR_VISUALIZACION_OVERLAY, 'overlay-display');
                if (localStorage.getItem(`${datasetBoton}`) === 'hide') {
                    botonIndividual.checked = false;
                    spanValorBoton.innerHTML = "[oculto]";
                    document.body.classList.add(`d-none__barras-overlay__${datasetBoton}`);
                } else {
                    botonIndividual.checked = true;
                    spanValorBoton.innerHTML = "[visible]";
                    document.body.classList.remove(`d-none__barras-overlay__${datasetBoton}`);
                };
            } else {
                botonIndividual.checked = false;
                botonIndividual.disabled = true;
                spanValorBoton.innerHTML = "[oculto]";
                document.body.classList.add('d-none__barras-overlay');
                checkboxOff(CHECKBOX_PERSONALIZAR_VISUALIZACION_OVERLAY, SPAN_VALOR_CHECKBOX_PERSONALIZAR_VISUALIZACION_OVERLAY, 'overlay-display');
            };
    
            hideTextoBotonesOverlay(); // siempre al final. Evalúa si botones overlay están haciendo desbordamiento
        });
    } catch (error) {
        console.error(`Error durante actualización estado botones personalizar overlay. Error: ${error}`);
        mostrarToast(`
        <span class="fw-bold">Ha ocurrido un error durante la actualización del estado botones personalizar overlay.</span>
        <hr>
        <span class="bg-dark bg-opacity-25 px-2 rounded-3">Error: ${error}</span>
        <hr>
        Si error persiste tras recargar, prueba borrar tu almacenamiento local desde el panel "Personalización" o borrando la caché del navegador.
        <button type="button" class="btn btn-light rounded-pill btn-sm w-100 border-light mt-2" onclick="location.reload()"> Pulsa para recargar <i class="bi bi-arrow-clockwise"></i></button>`, 'danger', false)
        return
    } 
}

// hacen varias tareas
function ajustarClaseBotonCanal(canal, esActivo) {
    let botones = document.querySelectorAll(`button[data-canal="${canal}"]`);
    botones.forEach(boton => {
        esActivo ? boton.classList.replace(CLASE_CSS_BOTON_SECUNDARIO, CLASE_CSS_BOTON_PRIMARIO) : boton.classList.replace(CLASE_CSS_BOTON_PRIMARIO, CLASE_CSS_BOTON_SECUNDARIO);
    });
}

function crearIframe(canalId, tipoSeñalParaIframe, valorIndex = 0) {
    valorIndex = Number(valorIndex)
    const DIV_ELEMENT = document.createElement('div');
    DIV_ELEMENT.classList.add('ratio', 'ratio-16x9', 'h-100');
    DIV_ELEMENT.setAttribute('data-canal-cambio', canalId);
    const { nombre, señales } = listaCanales[canalId];

    const URL_POR_TIPO_SEÑAL = {
        'iframe_url': señales.iframe_url && señales.iframe_url[valorIndex],
        'yt_id': señales.yt_id && `https://www.youtube-nocookie.com/embed/live_stream?channel=${señales.yt_id}&autoplay=1&mute=1&modestbranding=1&vq=medium&showinfo=0`,
        'yt_embed': señales.yt_embed && `https://www.youtube-nocookie.com/embed/${señales.yt_embed}?autoplay=1&mute=1&modestbranding=1&showinfo=0`,
        'yt_playlist': señales.yt_playlist && `https://www.youtube-nocookie.com/embed/videoseries?list=${señales.yt_playlist}&autoplay=0&mute=0&modestbranding=1&showinfo=0`,
        'twitch_id': señales.twitch_id && `https://player.twitch.tv/?channel=${señales.twitch_id}&parent=${TWITCH_PARENT}`
    };

    const IFRAME_ELEMENT = document.createElement('iframe');
    IFRAME_ELEMENT.src = URL_POR_TIPO_SEÑAL[tipoSeñalParaIframe];
    IFRAME_ELEMENT.classList.add('pe-auto');
    IFRAME_ELEMENT.setAttribute('contenedor-canal-cambio', canalId);
    IFRAME_ELEMENT.allowFullscreen = true;
    IFRAME_ELEMENT.title = nombre;
    IFRAME_ELEMENT.referrerPolicy = 'no-referrer';

    DIV_ELEMENT.append(IFRAME_ELEMENT);
    return DIV_ELEMENT;
}

function crearVideoJs(canalId, urlCarga) {
    const DIV_ELEMENT = document.createElement('div');
    DIV_ELEMENT.setAttribute('data-canal-cambio', canalId);
    DIV_ELEMENT.classList.add('ratio', 'ratio-16x9', 'h-100');
    const videoElement = document.createElement('video');
    videoElement.setAttribute('contenedor-canal-cambio', canalId);
    videoElement.classList.add('position-absolute', 'p-0', 'video-js', 'vjs-16-9', 'vjs-fill', 'overflow-hidden');
    videoElement.toggleAttribute('controls');
    DIV_ELEMENT.append(videoElement);
    videojs(videoElement).src({
        src: urlCarga,
        controls: true,
    });
    videojs(videoElement).autoplay('muted');
    return DIV_ELEMENT;
}

function crearOverlay(canalId, tipoSeñalCargada, valorIndex = 0) {
    try {
        let { nombre = 'Nombre Canal', señales, sitio_oficial, país, categoría } = listaCanales[canalId];

        valorIndex = Number(valorIndex);
        categoría = categoría.toLowerCase();
        let iconoCategoria = categoría in ICONOS_PARA_CATEGORIAS ? ICONOS_PARA_CATEGORIAS[categoría] : '<i class="bi bi-tv"></i>';

        const FRAGMENT_OVERLAY = document.createDocumentFragment();
        const DIV_ELEMENT = document.createElement('div');
        DIV_ELEMENT.id = `overlay-de-canal-${canalId}`;
        DIV_ELEMENT.classList.add('position-absolute', 'w-100', 'h-100', 'bg-transparent', 'pe-none', 'me-1', 'd-flex', 'gap-2', 'justify-content-end', 'align-items-start', 'flex-wrap', 'top-0', 'end-0', 'barra-overlay');

        const BOTON_SELECCIONAR_SEÑAL_CANAL = document.createElement("button");
        BOTON_SELECCIONAR_SEÑAL_CANAL.id = 'overlay-boton-selecionar-señal'
        BOTON_SELECCIONAR_SEÑAL_CANAL.setAttribute('type', 'button');
        BOTON_SELECCIONAR_SEÑAL_CANAL.setAttribute('title', 'Seleccionar diferente señal');
        BOTON_SELECCIONAR_SEÑAL_CANAL.setAttribute('data-bs-toggle', 'dropdown');
        BOTON_SELECCIONAR_SEÑAL_CANAL.setAttribute('aria-expanded', 'false');

        BOTON_SELECCIONAR_SEÑAL_CANAL.innerHTML = '<span>Seleccionar señal</span><i class="bi bi-collection" data-bs-toggle="tooltip" data-bs-title="Seleccionar diferente señal"></i>';
        BOTON_SELECCIONAR_SEÑAL_CANAL.classList.add('btn', 'btn-sm', 'btn-dark-subtle', 'dropdown-toggle', 'd-flex', 'justify-content-center', 'align-items-center', 'gap-1', 'p-0', 'px-1', 'pe-auto', 'mt-1', 'rounded-3');

        const DROPDOWN_MENU_SELECCIONAR_SEÑAL_CANAL = document.createElement("ul");
        DROPDOWN_MENU_SELECCIONAR_SEÑAL_CANAL.classList.add('dropdown-menu');

        for (const key in señales) {
            let iconoSeñal = '<i class="bi bi-globe"></i>'
            if (key.startsWith('iframe_')) {
                iconoSeñal = '<i class="bi bi-globe"></i>'
            } else if (key.startsWith('m3u8_')) {
                iconoSeñal = '<i class="bi bi-play-btn"></i>'
            } else if (key.startsWith('yt_')) {
                iconoSeñal = '<i class="bi bi-youtube"></i>'
            } else if (key.startsWith('twitch_')) {
                iconoSeñal = '<i class="bi bi-twitch"></i>'
            }

            const value = señales[key];
            if (Array.isArray(value) && value.length > 0) {
                value.forEach((url, index) => {
                    const listItem = document.createElement("li");
                    listItem.classList.add('dropdown-item', 'pe-auto', 'py-2', 'user-select-none');
                    if (tipoSeñalCargada === key && valorIndex === index) listItem.classList.add('bg-indigo', 'fw-bold');
                    listItem.innerHTML = value.length === 1 ? `${iconoSeñal} ${key.split('_')[0]}` : `${iconoSeñal} ${key.split('_')[0]} <span class="fst-italic">${index}</span>`;
                    listItem.addEventListener("click", () => {
                        DROPDOWN_MENU_SELECCIONAR_SEÑAL_CANAL.querySelectorAll('.dropdown-item').forEach(item => {
                            item.classList.remove('bg-indigo', 'fw-bold');
                        });
                        listItem.classList.add('bg-indigo', 'fw-bold');
                        guardarSeñalPreferida(canalId, key.toString(), Number(index));
                        cambiarSoloSeñalActiva(canalId);
                    });
                    DROPDOWN_MENU_SELECCIONAR_SEÑAL_CANAL.append(listItem);
                });
            } else if (typeof value === "string" && value !== "") {
                const listItem = document.createElement("li");
                listItem.classList.add('dropdown-item', 'pe-auto', 'py-2', 'user-select-none');
                if (tipoSeñalCargada === key) listItem.classList.add('bg-indigo', 'fw-bold');
                listItem.innerHTML = `${iconoSeñal} ${key.replace('_', ' ')}`;
                listItem.addEventListener("click", () => {
                    DROPDOWN_MENU_SELECCIONAR_SEÑAL_CANAL.querySelectorAll('.dropdown-item').forEach(item => {
                        item.classList.remove('bg-indigo', 'fw-bold');
                    });
                    listItem.classList.add('bg-indigo', 'fw-bold');
                    guardarSeñalPreferida(canalId, key.toString());
                    cambiarSoloSeñalActiva(canalId);
                });
                DROPDOWN_MENU_SELECCIONAR_SEÑAL_CANAL.append(listItem);
            }
        }

        const BOTON_MOVER_CANAL = document.createElement('button');
        BOTON_MOVER_CANAL.id = 'overlay-boton-mover';
        BOTON_MOVER_CANAL.setAttribute('type', 'button');
        BOTON_MOVER_CANAL.setAttribute('title', 'Arrastrar y mover este canal');
        BOTON_MOVER_CANAL.setAttribute('data-bs-toggle', 'tooltip');
        BOTON_MOVER_CANAL.setAttribute('data-bs-title', 'Arrastrar y mover este canal');
        BOTON_MOVER_CANAL.innerHTML = '<span>Mover</span><i class="bi bi-arrows-move"></i>';
        BOTON_MOVER_CANAL.classList.add('btn', 'btn-sm', 'btn-dark-subtle', 'p-0', 'px-1', 'd-flex', 'gap-1', 'pe-auto', 'mt-1', 'rounded-3', 'clase-para-mover');

        const BOTON_CAMBIAR_CANAL = document.createElement('button');
        BOTON_CAMBIAR_CANAL.id = 'overlay-boton-cambiar';
        BOTON_CAMBIAR_CANAL.setAttribute('type', 'button');
        BOTON_CAMBIAR_CANAL.setAttribute('title', 'Cambiar este canal');
        BOTON_CAMBIAR_CANAL.setAttribute('data-bs-toggle', 'tooltip');
        BOTON_CAMBIAR_CANAL.setAttribute('data-bs-title', 'Cambiar este canal');
        BOTON_CAMBIAR_CANAL.setAttribute('data-button-cambio', canalId);
        BOTON_CAMBIAR_CANAL.innerHTML = '<span>Cambiar</span><i class="bi bi-arrow-repeat"></i>';
        BOTON_CAMBIAR_CANAL.classList.add('btn', 'btn-sm', 'btn-dark-subtle', 'p-0', 'px-1', 'd-flex', 'gap-1', 'pe-auto', 'mt-1', 'rounded-3');
        BOTON_CAMBIAR_CANAL.addEventListener('click', () => {
            LABEL_MODAL_CAMBIAR_CANAL.textContent = nombre;
            LABEL_MODAL_CAMBIAR_CANAL.setAttribute('id-canal-cambio', canalId);
            new bootstrap.Modal(MODAL_CAMBIAR_CANAL).show();
        });

        const BOTON_SITIO_OFICIAL_CANAL = document.createElement('a');
        BOTON_SITIO_OFICIAL_CANAL.id = 'overlay-boton-pagina-oficial';
        BOTON_SITIO_OFICIAL_CANAL.title = 'Ir a la página oficial de esta transmisión';
        if (tipoSeñalCargada === 'yt_id') sitio_oficial = `https://www.youtube.com/channel/${señales.yt_id}`;
        if (tipoSeñalCargada === 'twitch_id') sitio_oficial = `https://www.twitch.tv/${señales.twitch_id}`;
        BOTON_SITIO_OFICIAL_CANAL.href = sitio_oficial !== '' ? sitio_oficial : `https://www.qwant.com/?q=${nombre}+en+vivo`;
        BOTON_SITIO_OFICIAL_CANAL.setAttribute('role', 'button');
        BOTON_SITIO_OFICIAL_CANAL.setAttribute('data-bs-toggle', 'tooltip');
        BOTON_SITIO_OFICIAL_CANAL.setAttribute('data-bs-title', 'Ir a la página oficial de esta transmisión');
        BOTON_SITIO_OFICIAL_CANAL.rel = 'noopener nofollow noreferrer';
        BOTON_SITIO_OFICIAL_CANAL.innerHTML = `<span>
                ${nombre}
                ${país
                ? ` <img src="https://flagcdn.com/${país.toLowerCase()}.svg" alt="bandera ${CODIGOS_PAISES[país]}" title="${CODIGOS_PAISES[país]}" class="svg-bandera">`
                : ''}
                ${iconoCategoria
                ? ` ${iconoCategoria}`
                : ''}
                </span> <i class="bi bi-box-arrow-up-right"></i>`;
        BOTON_SITIO_OFICIAL_CANAL.classList.add('btn', 'btn-sm', 'btn-dark-subtle', 'p-0', 'px-1', 'd-flex', 'gap-1', 'pe-auto', 'mt-1', 'rounded-3', 'text-nowrap');

        const BOTON_QUITAR_CANAL = document.createElement('button');
        BOTON_QUITAR_CANAL.id = 'overlay-boton-quitar';
        BOTON_QUITAR_CANAL.setAttribute('aria-label', 'Close');
        BOTON_QUITAR_CANAL.setAttribute('type', 'button');
        BOTON_QUITAR_CANAL.setAttribute('title', 'Quitar canal');
        BOTON_QUITAR_CANAL.setAttribute('data-bs-toggle', 'tooltip');
        BOTON_QUITAR_CANAL.setAttribute('data-bs-title', 'Quitar canal');
        BOTON_QUITAR_CANAL.innerHTML = '<span>Quitar</span><i class="bi bi-x-circle"></i>';
        BOTON_QUITAR_CANAL.classList.add('btn', 'btn-sm', 'btn-danger', 'p-0', 'px-1', 'd-flex', 'gap-1', 'pe-auto', 'mt-1', 'rounded-3');
        BOTON_QUITAR_CANAL.addEventListener('click', () => {
            tele.remove(canalId);
            playAudioSinDelay(AUDIO_POP);
        });

        DIV_ELEMENT.append(BOTON_SELECCIONAR_SEÑAL_CANAL);
        DIV_ELEMENT.append(DROPDOWN_MENU_SELECCIONAR_SEÑAL_CANAL);
        DIV_ELEMENT.append(BOTON_MOVER_CANAL);
        DIV_ELEMENT.append(BOTON_CAMBIAR_CANAL);
        DIV_ELEMENT.append(BOTON_SITIO_OFICIAL_CANAL);
        DIV_ELEMENT.append(BOTON_QUITAR_CANAL);
        FRAGMENT_OVERLAY.append(DIV_ELEMENT);
        return FRAGMENT_OVERLAY;
    } catch (error) {
        console.error(`Error durante creación overlay para canal con id: ${canalId}. Error: ${error}`);
        mostrarToast(`
        <span class="fw-bold">Ha ocurrido un error durante la creación del overlay para el canal con id: ${canalId}.</span>
        <hr>
        <span class="bg-dark bg-opacity-25 px-2 rounded-3">Error: ${error}</span>
        <hr>
        Si error persiste tras recargar, prueba borrar tu almacenamiento local desde el panel "Personalización" o borrando la caché del navegador.
        <button type="button" class="btn btn-light rounded-pill btn-sm w-100 border-light mt-2" onclick="location.reload()"> Pulsa para recargar <i class="bi bi-arrow-clockwise"></i></button>`, 'danger')
        return
    } 
};

function guardarSeñalPreferida(canalId, señalUtilizar = '', indexSeñalUtilizar = 0) {
    let lsPreferenciasSeñalCanales = JSON.parse(localStorage.getItem('preferencia-señal-canales')) || {};
    lsPreferenciasSeñalCanales[canalId] = { [señalUtilizar]: indexSeñalUtilizar };
    localStorage.setItem('preferencia-señal-canales', JSON.stringify(lsPreferenciasSeñalCanales));
}

function clickCambioCanal(canalIdBotonPulsadoEnModal, canalIdExistente) {
    try {
        let divPadreACambiar = document.querySelector(`div[data-canal="${canalIdExistente}"]`)
        if (divPadreACambiar) {
            let divExistenteACambiar = document.querySelector(`div[data-canal-cambio="${canalIdExistente}"]`)
            let barraOverlayDeCanalACambiar = document.querySelector(`#overlay-de-canal-${canalIdExistente}`)
            // evitar duplicados si canal que va a quedar de reemplazo ya existe en grid
            if (document.querySelector(`div[data-canal="${canalIdBotonPulsadoEnModal}"]`) && divPadreACambiar !== document.querySelector(`div[data-canal="${canalIdBotonPulsadoEnModal}"]`)) {
                tele.remove(canalIdBotonPulsadoEnModal);
            };
    
            divExistenteACambiar.remove();
            barraOverlayDeCanalACambiar.remove();
    
            divPadreACambiar.append(crearFragmentCanal(canalIdBotonPulsadoEnModal));
            divPadreACambiar.setAttribute('data-canal', canalIdBotonPulsadoEnModal); // deja atributo con el canal que se deja activo tras cambio
            ajustarClaseBotonCanal(canalIdExistente, false);
            ajustarClaseBotonCanal(canalIdBotonPulsadoEnModal, true);
            if (localStorage.getItem('diseño-seleccionado') !== 'vision-unica') guardarCanalesEnLocalStorage();
        }
    } catch (error) {
        console.error(`Error intentar cambiar canal con id: ${canalIdExistente} por canal: ${canalIdBotonPulsadoEnModal}. Error: ${error}`);
        mostrarToast(`
        <span class="fw-bold">Ha ocurrido un error al intentar cambiar canal con id: ${canalIdExistente} por canal: ${canalIdBotonPulsadoEnModal}.</span>
        <hr>
        <span class="bg-dark bg-opacity-25 px-2 rounded-3">Error: ${error}</span>
        <hr>
        Si error persiste tras recargar, prueba borrar tu almacenamiento local desde el panel "Personalización" o borrando la caché del navegador.
        <button type="button" class="btn btn-light rounded-pill btn-sm w-100 border-light mt-2" onclick="location.reload()"> Pulsa para recargar <i class="bi bi-arrow-clockwise"></i></button>`, 'danger')
        return
    }
}

function cambiarSoloSeñalActiva(canalId) {
    try {
        if (!canalId) return console.error(`El canal "${canalId}" proporcionado no es válido para cambio señal.`);

        let divPadreACambiar = document.querySelector(`div[data-canal="${canalId}"]`);
        let divExistenteACambiar = divPadreACambiar.querySelector(`div[data-canal-cambio="${canalId}"]`);
        let barraOverlayDeCanalACambiar = divPadreACambiar.querySelector(`#overlay-de-canal-${canalId}`);

        divExistenteACambiar.remove();
        barraOverlayDeCanalACambiar.remove();

        divPadreACambiar.append(crearFragmentCanal(canalId));

        activarTooltipsBootstrap();
        hideTextoBotonesOverlay();
    } catch (error) {
        console.error(`Error al intentar cambiar señal para canal con id: ${canalId}. Error: ${error}`);
        mostrarToast(`
        <span class="fw-bold">Ha ocurrido un error al intentar cambiar señal para canal con id: ${canalId}.</span>
        <hr>
        <span class="bg-dark bg-opacity-25 px-2 rounded-3">Error: ${error}</span>
        <hr>
        Si error persiste tras recargar, prueba borrar tu almacenamiento local desde el panel "Personalización" o borrando la caché del navegador.
        <button type="button" class="btn btn-light rounded-pill btn-sm w-100 border-light mt-2" onclick="location.reload()"> Pulsa para recargar <i class="bi bi-arrow-clockwise"></i></button>`, 'danger')
        return
    } 
}

function revisarSeñalesVacias(canalId) {
    const señales = listaCanales?.[canalId]?.señales;
    if (señales) {
        const todasLasSeñalesVacias = Object.values(señales).every(señal => {
            if (typeof señal === 'undefined' || señal === null) {
                return true;
            } else if (Array.isArray(señal)) {
                return señal.length < 1;
            } else if (typeof señal === 'string') {
                return señal.trim() === '';
            }
        });
        if (todasLasSeñalesVacias) console.error(`${canalId} tiene todas sus señales vacías`);
        return todasLasSeñalesVacias;
    }
    return true; // Si no esta atributo señales, se considera que todas están vacías
}

function borraPreferenciaSeñalInvalida() {
    let lsPreferenciasSeñalCanales = JSON.parse(localStorage.getItem('preferencia-señal-canales')) || {};
    if (Object.keys(lsPreferenciasSeñalCanales).length !== 0) {
        for (const idCanalGuardado in lsPreferenciasSeñalCanales) {
            let tipoSeñalGuardada = Object.keys(lsPreferenciasSeñalCanales[idCanalGuardado])[0].toString();
            let valorIndexArraySeñal = Number(Object.values(lsPreferenciasSeñalCanales[idCanalGuardado]));

            if (!revisarSeñalesVacias(idCanalGuardado)) { // si no estan vacias
                if (tipoSeñalGuardada === 'iframe_url' || tipoSeñalGuardada === 'm3u8_url') {
                    if (listaCanales?.[idCanalGuardado]?.señales?.[tipoSeñalGuardada][valorIndexArraySeñal] === undefined) {
                        mostrarToast(`
                            Tú señal preferida para <span class="fw-bold">${idCanalGuardado}</span> (${tipoSeñalGuardada}[${valorIndexArraySeñal}]) 
                            dejo de estar disponible.<br><span class="fw-bold">Utilizará siguiente señal disponible</span>.`, 'warning', false);
                        delete lsPreferenciasSeñalCanales[idCanalGuardado];
                        localStorage.setItem('preferencia-señal-canales', JSON.stringify(lsPreferenciasSeñalCanales));
                    }
                } else {
                    if (listaCanales?.[idCanalGuardado]?.señales?.[tipoSeñalGuardada] === '') {
                        mostrarToast(`
                        Tú señal preferida para <span class="fw-bold">${idCanalGuardado}</span> (${tipoSeñalGuardada}[${valorIndexArraySeñal}]) 
                        dejo de estar disponible.<br><span class="fw-bold">Utilizará siguiente señal disponible</span>.`, 'warning', false);
                        delete lsPreferenciasSeñalCanales[idCanalGuardado];
                        localStorage.setItem('preferencia-señal-canales', JSON.stringify(lsPreferenciasSeñalCanales));
                    }
                }
            };
        }
    }
}

function crearFragmentCanal(canalId) {
    if (listaCanales[canalId]?.señales) {
        let { iframe_url = [], m3u8_url = [], yt_id = '', yt_embed = '', yt_playlist = '', twitch_id = '' } = listaCanales[canalId].señales;
        let lsPreferenciasSeñalCanales = JSON.parse(localStorage.getItem('preferencia-señal-canales')) || {};

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
            señalUtilizar = Object.keys(lsPreferenciasSeñalCanales[canalId])[0].toString()
            valorIndexArraySeñal = Number(Object.values(lsPreferenciasSeñalCanales[canalId]))
        }

        const FRAGMENT_CANAL = document.createDocumentFragment();
        if (señalUtilizar === 'm3u8_url') {
            FRAGMENT_CANAL.append(
                crearVideoJs(canalId, m3u8_url[valorIndexArraySeñal]),
                crearOverlay(canalId, 'm3u8_url', valorIndexArraySeñal)
            );
            return FRAGMENT_CANAL;
        } else {
            FRAGMENT_CANAL.append(
                crearIframe(canalId, señalUtilizar, valorIndexArraySeñal),
                crearOverlay(canalId, señalUtilizar, valorIndexArraySeñal)
            );
            return FRAGMENT_CANAL;
        }
    } else {
        console.error(`${canalId} no tiene señales definidas.`);
        mostrarToast(`
        <span class="fw-bold">${canalId}</span> no tiene señales definidas. 
        <br>Prueba recargando o borrar la caché del navegador.
        <button type="button" class="btn btn-danger rounded-pill btn-sm w-100 border-light mt-2" data-bs-toggle="modal"
            data-bs-target="#modal-reset">Probar reiniciar almacenamiento local</button>`, 'danger', false);
    }
}

function insertarDivError(mensajeError, mensajeExplicactivo) {
    let divError = document.createElement('div');
    divError.classList.add('bg-danger', 'p-3', 'rounded-3', 'shadow');
    divError.innerHTML = `<p>${mensajeExplicactivo}</p>
        <span class="bg-dark bg-opacity-25 px-2 rounded-3">Error: <em>${mensajeError}</em></span>
        <hr>
        <p>Si error persiste tras recargar, prueba borrar tu almacenamiento local desde el panel "Personalización" o borrando la caché del navegador.</p>
        <button type="button" class="btn btn-light rounded-pill btn-sm w-100 border-light mt-2" onclick="location.reload()"> Pulsa para recargar <i class="bi bi-arrow-clockwise"></i></button>`;
    return divError
}

function crearBotonesPaises() {
    try {
        const NUMERO_CANALES_CON_PAIS = Object.values(listaCanales).map(canal => {
            if (canal?.país !== '') {
                return canal.país.toLowerCase();
            } else {
                return 'Desconocido';
            }
        });

        const PAISES_SIN_REPETIRSE = [...new Set(NUMERO_CANALES_CON_PAIS)]

        const CONTEO_NUMERO_CANALES_POR_PAIS = NUMERO_CANALES_CON_PAIS.reduce((conteo, pais) => {
            conteo[CODIGOS_PAISES[pais] ?? 'Desconocido'] = (conteo[CODIGOS_PAISES[pais] ?? 'Desconocido'] || 0) + 1;
            return conteo;
        }, {});

        const PAISES_ORDENADOS = PAISES_SIN_REPETIRSE.filter(pais => CODIGOS_PAISES[pais]).sort((a, b) => {
            const codigoA = CODIGOS_PAISES[a].toLowerCase();
            const codigoB = CODIGOS_PAISES[b].toLowerCase();
            return codigoA.localeCompare(codigoB);
        });

        const FRAGMENT_BOTONES_PAISES = document.createDocumentFragment();
        for (const PAIS of PAISES_ORDENADOS) {
            if (CODIGOS_PAISES[PAIS]) {
                let nombrePais = CODIGOS_PAISES[PAIS];
                let cantidadCanales = CONTEO_NUMERO_CANALES_POR_PAIS[nombrePais] || 0;
                let botonPais = document.createElement('button');
                botonPais.setAttribute('type', 'button');
                botonPais.setAttribute('data-country', PAIS);
                botonPais.classList.add(
                    'btn', 'btn-outline-secondary',
                    'd-flex', 'justify-content-between', 'align-items-center',
                    'text-start', 'gap-2', 'w-100', 'm-0', 'rounded-3');
                botonPais.innerHTML =
                    `<span class="flex-grow-1">${nombrePais}</span>
                    <img src="https://flagcdn.com/${PAIS}.svg" alt="bandera ${nombrePais}" title="${nombrePais}" class="svg-bandera rounded-1">
                    <span class="badge bg-secondary">${cantidadCanales}</span>`;
                FRAGMENT_BOTONES_PAISES.append(botonPais);
            }
        }

        if (!PAISES_ORDENADOS.includes('Desconocido')) {
            let cantidadDesconocido = CONTEO_NUMERO_CANALES_POR_PAIS['Desconocido'] || 0;
            let botonDesconocido = document.createElement('button');
            botonDesconocido.setAttribute('type', 'button');
            botonDesconocido.setAttribute('data-country', 'Desconocido');
            botonDesconocido.classList.add('btn', 'btn-outline-secondary', 'd-flex', 'justify-content-between', 'align-items-center', 'text-start', 'gap-2', 'w-100', 'm-0', 'rounded-3');
            botonDesconocido.innerHTML =
                `<span class="flex-grow-1">Desconocido</span><span class="badge bg-secondary">${cantidadDesconocido}</span>`;
            FRAGMENT_BOTONES_PAISES.prepend(botonDesconocido);
        }

        const BOTON_MOSTRAR_TODO_PAIS = document.createElement('button');
            BOTON_MOSTRAR_TODO_PAIS.setAttribute('type', 'button');
            BOTON_MOSTRAR_TODO_PAIS.dataset.country = 'all'
            BOTON_MOSTRAR_TODO_PAIS.classList.add('btn', 'btn-indigo', 'd-flex', 'justify-content-between', 'align-items-center', 'text-start', 'gap-2', 'w-100', 'm-0', 'rounded-3')
            BOTON_MOSTRAR_TODO_PAIS.innerHTML =
                `<span class="flex-grow-1">Todos</span><span class="badge bg-secondary">${Object.keys(listaCanales).length}</span>`;
            FRAGMENT_BOTONES_PAISES.prepend(BOTON_MOSTRAR_TODO_PAIS)

        for (const PREFIJO of PREFIJOS_ID_CONTENEDORES_CANALES) {
            const contenedorBotonesFiltroPaises = document.querySelector(`#${PREFIJO}-collapse-botones-listado-filtro-paises`);
            contenedorBotonesFiltroPaises.append(FRAGMENT_BOTONES_PAISES.cloneNode(true));
            contenedorBotonesFiltroPaises.querySelectorAll('button').forEach(botonPaisEnDom => {
                botonPaisEnDom.addEventListener('click', () => {
                    try {
                        let country = botonPaisEnDom.dataset.country;
                        let filtro = CODIGOS_PAISES[country] || (country === 'Desconocido' ? 'Desconocido' : country === 'all' ? '' : '');

                        contenedorBotonesFiltroPaises.querySelectorAll('button').forEach(boton => {
                            boton.classList.replace(CLASE_CSS_BOTON_PRIMARIO, 'btn-outline-secondary');
                        });
                        botonPaisEnDom.classList.replace('btn-outline-secondary', CLASE_CSS_BOTON_PRIMARIO);
                        filtrarCanalesPorInput(filtro, document.querySelector(`#${PREFIJO}-body-botones-canales`));
                    } catch (error) {
                        contenedorBotonesFiltroPaises.querySelectorAll('button').forEach(boton => {
                            boton.classList.replace(CLASE_CSS_BOTON_PRIMARIO, 'btn-outline-secondary');
                        });
                        contenedorBotonesFiltroPaises.querySelector('button[data-country="all"]').classList.replace('btn-outline-secondary', CLASE_CSS_BOTON_PRIMARIO);
                        console.error(`Error al intentar activar filtro país. ${error}`);
                        mostrarToast(`
                        <span class="fw-bold">Ha ocurrido un error al intentar activar filtro país..</span>
                        <hr>
                        <span class="bg-dark bg-opacity-25 px-2 rounded-3">Error: ${error}</span>
                        <hr>
                        Si error persiste tras recargar, prueba borrar tu almacenamiento local desde el panel "Personalización" o borrando la caché del navegador.
                        <button type="button" class="btn btn-light rounded-pill btn-sm w-100 border-light mt-2" onclick="location.reload()"> Pulsa para recargar <i class="bi bi-arrow-clockwise"></i></button>`, 'danger', false);
                        return
                    }
                    
                });
            }); 
        }
    } catch (error) {
        console.error(`Error durante creación botones para filtros paises. ${error}`);
        mostrarToast(`
        <span class="fw-bold">Ha ocurrido un error durante la creación de botones para filtrado por país.</span>
        <hr>
        <span class="bg-dark bg-opacity-25 px-2 rounded-3">Error: ${error}</span>
        <hr>
        Si error persiste tras recargar, prueba borrar tu almacenamiento local desde el panel "Personalización" o borrando la caché del navegador.
        <button type="button" class="btn btn-light rounded-pill btn-sm w-100 border-light mt-2" onclick="location.reload()"> Pulsa para recargar <i class="bi bi-arrow-clockwise"></i></button>`, 'danger', false);
        
        for (const PREFIJO of PREFIJOS_ID_CONTENEDORES_CANALES) {
            document.querySelector(`#${PREFIJO}-collapse-botones-listado-filtro-paises`).insertAdjacentElement('afterend', insertarDivError(error, 'Ha ocurrido un error durante la creación de botones para filtro paises'));
        }
        return
    }
}

function crearBotonesParaCanales() {
    try {
        const FRAGMENT_BOTONES_CANALES = document.createDocumentFragment();
        for (const canal in listaCanales) {
            let { nombre, /* logo, */ país, categoría } = listaCanales[canal];
            categoría = categoría.toLowerCase();
            let iconoCategoria = categoría && categoría in ICONOS_PARA_CATEGORIAS ? ICONOS_PARA_CATEGORIAS[categoría] : '<i class="bi bi-tv"></i>';
            let nombrePais = país && CODIGOS_PAISES[país.toLowerCase()] ? CODIGOS_PAISES[país.toLowerCase()] : 'Desconocido';

            let botonCanal = document.createElement('button');
            botonCanal.setAttribute('data-canal', canal);
            botonCanal.setAttribute('data-country', `${nombrePais}`);
            botonCanal.classList.add('btn', CLASE_CSS_BOTON_SECUNDARIO, 'd-flex', 'justify-content-between', 'align-items-center', 'gap-2', 'text-start', 'rounded-3');
            if (revisarSeñalesVacias(canal)) botonCanal.classList.add('d-none');
            botonCanal.innerHTML =
                `<span class="flex-grow-1">${nombre}</span>
                    ${país ? `<img src="https://flagcdn.com/${país.toLowerCase()}.svg" alt="bandera ${nombrePais}" title="${nombrePais}" class="svg-bandera rounded-1">` : ''}
                    ${iconoCategoria ? `${iconoCategoria}` : ''}`;
            // ${logo ? `<img src="${logo}" alt="logo ${nombre}" title="logo ${nombre}" class="img-logos rounded-1">` : ''} 
            FRAGMENT_BOTONES_CANALES.append(botonCanal);
        }

        document.querySelector('#modal-canales-body-botones-canales').append(FRAGMENT_BOTONES_CANALES.cloneNode(true));
        document.querySelector('#offcanvas-canales-body-botones-canales').append(FRAGMENT_BOTONES_CANALES.cloneNode(true));
        document.querySelector('#modal-cambiar-canal-body-botones-canales').append(FRAGMENT_BOTONES_CANALES.cloneNode(true));
        document.querySelector('#vision-unica-body-botones-canales').append(FRAGMENT_BOTONES_CANALES.cloneNode(true));

        // Asignar eventos después de que los botones estén en el DOM
        document.querySelectorAll('#modal-canales-body-botones-canales button, #offcanvas-canales-body-botones-canales button').forEach(botonCanalEnDOM => {
            botonCanalEnDOM.addEventListener('click', () => {
                let accionBoton = botonCanalEnDOM.classList.contains(CLASE_CSS_BOTON_SECUNDARIO) ? 'add' : 'remove';
                tele[accionBoton](botonCanalEnDOM.dataset.canal);
            });
        });

        document.querySelectorAll('#modal-cambiar-canal-body-botones-canales button').forEach(botonCanalEnDOM => {
            botonCanalEnDOM.setAttribute('data-bs-dismiss', 'modal');
        });

        document.querySelectorAll('#vision-unica-body-botones-canales button').forEach(botonCanalEnDOM => {
            botonCanalEnDOM.addEventListener('click', () => {
                if (CONTAINER_VIDEO_VISION_UNICA.querySelector('div[data-canal]')) {
                    tele.remove(CONTAINER_VIDEO_VISION_UNICA.querySelector('div[data-canal]').dataset.canal)
                }

                let accionBoton = botonCanalEnDOM.classList.contains(CLASE_CSS_BOTON_SECUNDARIO) ? 'add' : 'remove';
                tele[accionBoton](botonCanalEnDOM.dataset.canal);
            });
        });

        for (const PREFIJO of PREFIJOS_ID_CONTENEDORES_CANALES) {
            guardarOrdenOriginal(`${PREFIJO}-body-botones-canales`);
        };

    } catch (error) {
        console.error(`Error durante creación botones para canales. Error: ${error}`);
        mostrarToast(`
        <span class="fw-bold">Ha ocurrido un error durante la creación de botones para los canales.</span>
        <hr>
        <span class="bg-dark bg-opacity-25 px-2 rounded-3">Error: ${error}</span>
        <hr>
        Si error persiste tras recargar, prueba borrar tu almacenamiento local desde el panel "Personalización" o borrando la caché del navegador.
        <button type="button" class="btn btn-light rounded-pill btn-sm w-100 border-light mt-2" onclick="location.reload()"> Pulsa para recargar <i class="bi bi-arrow-clockwise"></i></button>`, 'danger', false);

        for (const PREFIJO of PREFIJOS_ID_CONTENEDORES_CANALES) {
            document.querySelector(`#${PREFIJO}-body-botones-canales`).insertAdjacentElement('afterend', insertarDivError(error, 'Ha ocurrido un error durante la creación de botones para los canales'));
        }
    }
}

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


// MARK: Vision Unica
function activarVisionUnica() {
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

function desactivarVisionUnica() {
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

const CONTAINER_INTERNO_VISION_UNICA = document.querySelector('.vision-unica-grid');
const ID_EN_ORDEN_ORIGINAL = ['panel-canales-vision-unica', 'container-video-vision-unica'];

function guardarOrdenPanelesVisionUnica() {
    let ordenActual = Array.from(CONTAINER_INTERNO_VISION_UNICA.children).map(item => item.id);
    localStorage.setItem('orden-grid-vision-unica', JSON.stringify(ordenActual));
}

// Función para cargar el orden desde localStorage y aplicarlo a los elementos
function cargarOrdenVisionUnica() {
    try {
        let ordenGuardado = localStorage.getItem('orden-grid-vision-unica');
        if (ordenGuardado) {
            let elementosOrdenados = JSON.parse(ordenGuardado);
            elementosOrdenados.forEach(id => {
                let elemento = document.getElementById(id);
                CONTAINER_INTERNO_VISION_UNICA.append(elemento);
            });
            let esOrdenOriginal = JSON.stringify(ID_EN_ORDEN_ORIGINAL) === JSON.stringify(elementosOrdenados);
            CONTAINER_INTERNO_VISION_UNICA.classList.toggle('vision-unica-grid-reordenado', !esOrdenOriginal);
        } 
    } catch (error) {
        console.error(`Error durante la carga orden paneles para modo "Visión Única". Error: ${error}`);
        mostrarToast(`
        <span class="fw-bold">Ha ocurrido un error durante la carga orden paneles para modo "Visión Única".</span>
        <hr>
        <span class="bg-dark bg-opacity-25 px-2 rounded-3">Error: ${error}</span>
        <hr>
        Si error persiste tras recargar, prueba borrar tu almacenamiento local desde el panel "Personalización" o borrando la caché del navegador.
        <button type="button" class="btn btn-light rounded-pill btn-sm w-100 border-light mt-2" onclick="location.reload()"> Pulsa para recargar <i class="bi bi-arrow-clockwise"></i></button>`, 'danger', false)
        return
    } 
}

new Sortable(CONTAINER_INTERNO_VISION_UNICA, {
    animation: 350,
    handle: '.clase-para-mover',
    easing: "cubic-bezier(.17,.67,.83,.67)",
    ghostClass: 'marca-al-mover',
    swapThreshold: 0.30,
    onStart: () => {
        const DIVS_SOBRE_SEÑALES = CONTAINER_VIDEO_VISION_UNICA.querySelectorAll('.bg-transparent');
        DIVS_SOBRE_SEÑALES.forEach(divSobrepuesto => {
            divSobrepuesto.classList.remove('pe-none');
        });
        removerTooltipsBootstrap();
    },
    onChange: () => {
        let ordenActual = Array.from(CONTAINER_INTERNO_VISION_UNICA.children).map(item => item.id);
        let esOrdenOriginal = JSON.stringify(ID_EN_ORDEN_ORIGINAL) === JSON.stringify(ordenActual);
        CONTAINER_INTERNO_VISION_UNICA.classList.toggle('vision-unica-grid-reordenado', !esOrdenOriginal);
    },
    onEnd: () => {
        guardarOrdenPanelesVisionUnica();
        activarTooltipsBootstrap();
        const DIVS_SOBRE_SEÑALES = CONTAINER_VIDEO_VISION_UNICA.querySelectorAll('.bg-transparent');
        DIVS_SOBRE_SEÑALES.forEach(divSobrepuesto => {
            divSobrepuesto.classList.add('pe-none');
        });

        let ordenActual = Array.from(CONTAINER_INTERNO_VISION_UNICA.children).map(item => item.id);
        let esOrdenOriginal = JSON.stringify(ID_EN_ORDEN_ORIGINAL) === JSON.stringify(ordenActual);
        CONTAINER_INTERNO_VISION_UNICA.classList.toggle('vision-unica-grid-reordenado', !esOrdenOriginal);
    }
});

// ocultar texto si el tamaño de los botones excede el tamaño del contenedor
window.addEventListener('resize', hideTextoBotonesOverlay);

// Estado internet
function revisarConexion() {
    navigator.onLine
        ? document.querySelector('#alerta-internet-status').classList.add('d-none')
        : document.querySelector('#alerta-internet-status').classList.remove('d-none')
}

window.addEventListener('load', revisarConexion);
window.addEventListener('online', revisarConexion);
window.addEventListener('offline', revisarConexion);

// MARK: DOMContentLoaded
window.addEventListener('DOMContentLoaded', () => {
    detectarTemaSistema();

    MODAL_CAMBIAR_CANAL.addEventListener('shown.bs.modal', () => {
        document.querySelectorAll('#modal-cambiar-canal-body-botones-canales button').forEach(boton => {
            boton.addEventListener('click', () => clickCambioCanal(boton.dataset.canal, LABEL_MODAL_CAMBIAR_CANAL.getAttribute('id-canal-cambio')));
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
        ? (MAIN_NAVBAR.classList.remove('d-none'), checkboxOn(CHECKBOX_PERSONALIZAR_VISUALIZACION_NAVBAR, SPAN_VALOR_CHECKBOX_PERSONALIZAR_VISUALIZACION_NAVBAR, 'navbar-display'))
        : (MAIN_NAVBAR.classList.add('d-none'), checkboxOff(CHECKBOX_PERSONALIZAR_VISUALIZACION_NAVBAR, SPAN_VALOR_CHECKBOX_PERSONALIZAR_VISUALIZACION_NAVBAR, 'navbar-display'));

    // Posición botones flotante
    const BOTONES_REPOSICIONAR_BOTONES_FLOTANTES = document.querySelectorAll('#grupo-botones-posicion-botones-flotantes .btn-check');
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

    function actualizarBotonesFlotantes(top, start, margin, translate) {
        alternarPosicionBotonesFlotantes(top, start, margin, translate);
        BOTONES_REPOSICIONAR_BOTONES_FLOTANTES.forEach(boton => {
            boton.checked = esBotonReposicionar(boton, top, start, margin, translate);
        });
    }

    function esBotonReposicionar(boton, top, start, margin, translate) {
        const BOTON_DATASET_POSITION = boton.dataset.position.split(' ');
        return BOTON_DATASET_POSITION[0] === top && BOTON_DATASET_POSITION[1] === start && (BOTON_DATASET_POSITION[2] || '') === (margin || '') && (BOTON_DATASET_POSITION[3] || '') === (translate || '');
    }

    // Texto botones flotantes
    if (lsTextoBotonesFlotantes !== 'hide') {
        checkboxOn(CHECKBOX_PERSONALIZAR_TEXTO_BOTONES_FLOTANTES, SPAN_VALOR_CHECKBOX_PERSONALIZAR_TEXTO_BOTONES_FLOTANTES, 'texto-botones-flotantes');
        ICONO_PERSONALIZAR_TEXTO_BOTONES_FLOTANTES.classList.replace('bi-square', 'bi-info-square');
    } else {
        SPAN_BOTONES_FLOTANTES.forEach((button) => {
            button.classList.toggle('d-none', !CHECKBOX_PERSONALIZAR_TEXTO_BOTONES_FLOTANTES.checked);
        });
        checkboxOff(CHECKBOX_PERSONALIZAR_TEXTO_BOTONES_FLOTANTES, SPAN_VALOR_CHECKBOX_PERSONALIZAR_TEXTO_BOTONES_FLOTANTES, 'texto-botones-flotantes');
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
        checkboxOn(CHECKBOX_PERSONALIZAR_VISUALIZACION_TARJETA_LOGO_BACKGROUND, SPAN_VALOR_CHECKBOX_PERSONALIZAR_VISUALIZACION_TARJETA_LOGO_BACKGROUND, 'tarjeta-fondo-display')
        CONTAINER_TARJETA_LOGO_BACKGROUND.classList.toggle('d-none', !CHECKBOX_PERSONALIZAR_VISUALIZACION_TARJETA_LOGO_BACKGROUND.checked);
        ICONO_PERSONALIZAR_VISUALIZACION_TARJETA_LOGO_BACKGROUND.classList.replace('bi-eye-slash', 'bi-eye');
    } else {
        checkboxOff(CHECKBOX_PERSONALIZAR_VISUALIZACION_TARJETA_LOGO_BACKGROUND, SPAN_VALOR_CHECKBOX_PERSONALIZAR_VISUALIZACION_TARJETA_LOGO_BACKGROUND, 'tarjeta-fondo-display')
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
    function addSortEventListener(buttonId, containerId, sortFunction) {
        const BOTON_AÑADIR_EVENTO = document.querySelector(`#${buttonId}`);
        BOTON_AÑADIR_EVENTO.addEventListener('click', () => sortFunction(containerId));
    }

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