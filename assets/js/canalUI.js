// Funciones para crear overlays y fragmentos de canal
import { listaCanales } from './canalesData.js';
import { LABEL_MODAL_CAMBIAR_CANAL, MODAL_CAMBIAR_CANAL, tele } from './main.js';

import {
    CODIGOS_PAISES,
    ICONOS_PARA_CATEGORIAS,
    AUDIO_POP,
    TWITCH_PARENT,
    LS_KEY_M3U8_PLAYER,
    LS_KEY_CHANNEL_SIGNAL_PREFERENCE
} from './constants/index.js';
import { 
    mostrarToast, 
    playAudioSinDelay, 
    hideTextoBotonesOverlay, 
    removerTooltipsBootstrap, 
    activarTooltipsBootstrap, 
    registrarCambioManualCanales, 
    limpiarRecursosTransmision 
} from './helpers/index.js';

// Funciones de UI de canales extraídas de main.js
function guardarSeñalPreferida(canalId, señalUtilizar = '', indexSeñalUtilizar = 0) {
    let lsPreferenciasSeñalCanales = JSON.parse(localStorage.getItem(LS_KEY_CHANNEL_SIGNAL_PREFERENCE)) || {};
    lsPreferenciasSeñalCanales[canalId] = { [señalUtilizar]: indexSeñalUtilizar };
    localStorage.setItem(LS_KEY_CHANNEL_SIGNAL_PREFERENCE, JSON.stringify(lsPreferenciasSeñalCanales));
}

export function crearIframe(canalId, tipoSeñalParaIframe, valorIndex = 0) {
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
    IFRAME_ELEMENT.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
    IFRAME_ELEMENT.title = nombre;
    if (tipoSeñalParaIframe === 'yt_id' || tipoSeñalParaIframe === 'yt_embed' || tipoSeñalParaIframe === 'yt_playlist') {
        IFRAME_ELEMENT.referrerPolicy = 'strict-origin-when-cross-origin';  // Debido a Error 153 con Youtube. Rompe otras señales iframe_url por eso lo filtramos antes.
    } else {
        IFRAME_ELEMENT.referrerPolicy = 'no-referrer';
    }

    // Almacenamos la instancia del iframe para usarla en el futuro para limpiar recursos
    DIV_ELEMENT._iframeElement = IFRAME_ELEMENT;
    DIV_ELEMENT.append(IFRAME_ELEMENT);
    return DIV_ELEMENT;
}


export function crearVideoJs(canalId, urlCarga) {
    const tipoReproductor = localStorage.getItem(LS_KEY_M3U8_PLAYER) || 'videojs';
    if (tipoReproductor === 'clappr' && typeof Clappr !== 'undefined') {
        const DIV_ELEMENT = document.createElement('div');
        DIV_ELEMENT.setAttribute('data-canal-cambio', canalId);
        DIV_ELEMENT.classList.add('ratio', 'ratio-16x9', 'h-100');
        const playerContainer = document.createElement('div');
        playerContainer.setAttribute('contenedor-canal-cambio', canalId);
        playerContainer.classList.add('position-absolute', 'p-0', 'w-100', 'h-100');
        DIV_ELEMENT.append(playerContainer);
        // Diferimos la inicialización para asegurar que el contenedor exista en el DOM
        setTimeout(() => {
            try {
                const clapprPlayer = new Clappr.Player({
                    source: urlCarga,
                    parent: playerContainer,
                    autoPlay: true,
                    mute: true,
                    width: '100%',
                    height: '100%'
                });
                // Almacenamos la instancia del reproductor para usarla en el futuro para limpiar recursos
                DIV_ELEMENT._clapprPlayer = clapprPlayer;
            } catch (error) {
                console.error(`Error al inicializar Clappr para canal con id: ${canalId}. Error: ${error}`);
                mostrarToast(`Error al inicializar Clappr para canal ${canalId}. Se usará Video.js.`, 'danger');
            }
        }, 0);

      
        return DIV_ELEMENT;
    }
    if (tipoReproductor === 'oplayer' && typeof OPlayer !== 'undefined') {
        const DIV_ELEMENT = document.createElement('div');
        DIV_ELEMENT.setAttribute('data-canal-cambio', canalId);
        DIV_ELEMENT.classList.add('ratio', 'ratio-16x9', 'h-100');
        const playerContainer = document.createElement('div');
        const oplayerId = `oplayer-${canalId}-${Date.now()}`;
        playerContainer.id = oplayerId;
        playerContainer.setAttribute('contenedor-canal-cambio', canalId);
        playerContainer.classList.add('position-absolute', 'p-0', 'w-100', 'h-100', 'overflow-hidden');
        DIV_ELEMENT.append(playerContainer);

        // Diferimos la inicialización de OPlayer para asegurar que el contenedor exista en el DOM
        setTimeout(() => {
            try {
                let instancia = OPlayer.make(`#${oplayerId}`, {
                    source: {
                        src: urlCarga,
                        title: canalId
                    },
                    autoplay: true,
                    muted: true
                });
                if (typeof OHls !== 'undefined') {
                    instancia = instancia.use([
                        OHls({
                            library: 'https://cdn.jsdelivr.net/npm/hls.js@0.14.17/dist/hls.min.js',
                            forceHLS: true
                        })
                    ]);
                }
                if (typeof OUI !== 'undefined') {
                    instancia = instancia.use([OUI()]);
                }
                instancia.create();
                // Almacenamos la instancia del reproductor para usarla en el futuro para limpiar recursos
                DIV_ELEMENT._oplayerPlayer = instancia;
            } catch (error) {
                console.error(`Error al inicializar OPlayer para canal con id: ${canalId}. Error: ${error}`);
                mostrarToast(`Error al inicializar OPlayer para canal ${canalId}. Se usará Video.js.`, 'danger');
            }
        }, 0);

       
        return DIV_ELEMENT;
    }
    const DIV_ELEMENT = document.createElement('div');
    DIV_ELEMENT.setAttribute('data-canal-cambio', canalId);
    DIV_ELEMENT.classList.add('ratio', 'ratio-16x9', 'h-100');
    const videoElement = document.createElement('video');
    videoElement.setAttribute('contenedor-canal-cambio', canalId);
    videoElement.classList.add('position-absolute', 'p-0', 'video-js', 'vjs-16-9', 'vjs-fill', 'overflow-hidden');
    videoElement.toggleAttribute('controls');
    DIV_ELEMENT.append(videoElement);
    try {
        videojs(videoElement).src({
            src: urlCarga,
        });
        videojs(videoElement).autoplay(true);
        videojs(videoElement).muted(true);
        // Almacenamos la instancia del reproductor para usarla en el futuro para limpiar recursos
        DIV_ELEMENT._videojsPlayer = videojs(videoElement);
    } catch (error) {
        console.error(`Error al inicializar Video.js para canal con id: ${canalId}. Error: ${error}`);
        mostrarToast(`Error al inicializar Video.js para canal ${canalId}. Se usará el siguiente canal.`, 'danger');
    }
    return DIV_ELEMENT;
}

export function crearOverlay(canalId, tipoSeñalCargada, valorIndex = 0) {
    try {
        let { nombre = 'Nombre Canal', señales, sitio_oficial, país, categoría } = listaCanales[canalId];

        valorIndex = Number(valorIndex);
        categoría = categoría.toLowerCase();
        let iconoCategoria = categoría in ICONOS_PARA_CATEGORIAS ? ICONOS_PARA_CATEGORIAS[categoría] : '<i class="bi bi-tv"></i>';

        const FRAGMENT_OVERLAY = document.createDocumentFragment();
        const DIV_ELEMENT = document.createElement('div');
        DIV_ELEMENT.id = `overlay-de-canal-${canalId}`;
        DIV_ELEMENT.classList.add('position-absolute', 'w-100', 'bg-transparent', 'me-1', 'd-flex', 'gap-2', 'justify-content-end', 'align-items-start', 'flex-wrap', 'top-0', 'end-0', 'barra-overlay');

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
        BOTON_SITIO_OFICIAL_CANAL.href = sitio_oficial !== '' ? sitio_oficial : `https://www.duckduckgo.com/?q=${nombre}+en+vivo`;
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
        <button type="button" class="btn btn-light rounded-pill btn-sm w-100 border-light mt-2" onclick="location.reload()"> Pulsa para recargar <i class="bi bi-arrow-clockwise"></i></button>`, 'danger');
        return;
    }
}

export function crearFragmentCanal(canalId) {
    if (listaCanales[canalId]?.señales) {
        let { iframe_url = [], m3u8_url = [], yt_id = '', yt_embed = '', yt_playlist = '', twitch_id = '' } = listaCanales[canalId].señales;
        let lsPreferenciasSeñalCanales = JSON.parse(localStorage.getItem(LS_KEY_CHANNEL_SIGNAL_PREFERENCE)) || {};

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
            const tipoPreferido = Object.keys(lsPreferenciasSeñalCanales[canalId])[0].toString();
            const indicePreferido = Number(Object.values(lsPreferenciasSeñalCanales[canalId]));
            const valorPreferido = listaCanales?.[canalId]?.señales?.[tipoPreferido];

            let preferenciaValida = false;
            if (Array.isArray(valorPreferido)) {
                preferenciaValida = valorPreferido[indicePreferido] !== undefined;
            } else if (typeof valorPreferido === 'string') {
                preferenciaValida = valorPreferido.trim() !== '';
            }

            if (preferenciaValida) {
                señalUtilizar = tipoPreferido;
                valorIndexArraySeñal = indicePreferido;
            } else {
                delete lsPreferenciasSeñalCanales[canalId];
                localStorage.setItem(LS_KEY_CHANNEL_SIGNAL_PREFERENCE, JSON.stringify(lsPreferenciasSeñalCanales));
            }
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

export function cambiarSoloSeñalActiva(canalId) {
    try {
        if (!canalId) return console.error(`El canal "${canalId}" proporcionado no es válido para cambio señal.`);

        let divPadreACambiar = document.querySelector(`div[data-canal="${canalId}"]`);
        let divExistenteACambiar = divPadreACambiar.querySelector(`div[data-canal-cambio="${canalId}"]`);
        let barraOverlayDeCanalACambiar = divPadreACambiar.querySelector(`#overlay-de-canal-${canalId}`);

        removerTooltipsBootstrap();

        limpiarRecursosTransmision(divPadreACambiar);

        divExistenteACambiar.remove();
        barraOverlayDeCanalACambiar.remove();

        divPadreACambiar.append(crearFragmentCanal(canalId));

        if (typeof activarTooltipsBootstrap === 'function') activarTooltipsBootstrap();
        if (typeof hideTextoBotonesOverlay === 'function') hideTextoBotonesOverlay();
        if (typeof registrarCambioManualCanales === 'function') registrarCambioManualCanales();

    } catch (error) {
        console.error(`Error al intentar cambiar señal para canal con id: ${canalId}. Error: ${error}`);
        mostrarToast(`
        <span class="fw-bold">Ha ocurrido un error al intentar cambiar señal para canal con id: ${canalId}.</span>
        <hr>
        <span class="bg-dark bg-opacity-25 px-2 rounded-3">Error: ${error}</span>
        <hr>
        Si error persiste tras recargar, prueba borrar tu almacenamiento local desde el panel "Personalización" o borrando la caché del navegador.
        <button type="button" class="btn btn-light rounded-pill btn-sm w-100 border-light mt-2" onclick="location.reload()"> Pulsa para recargar <i class="bi bi-arrow-clockwise"></i></button>`, 'danger');
        return;
    }
}