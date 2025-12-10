/* 
  main v0.22
  by Alplox 
  https://github.com/Alplox/teles
*/

// MARK: import
import {
    fetchCargarCanales,
    cargarListaPersonalizadaM3U,
    cargarListaPersonalizadaDesdeTexto,
    restaurarListasPersonalizadas,
    channelsList,
    obtenerPreferenciaCombinarCanales,
    establecerPreferenciaCombinarCanales,
    ARRAY_CANALES_PREDETERMINADOS,
    ARRAY_CANALES_PREDETERMINADOS_EXTRAS
} from './canalesData.js';

import {
    crearFragmentCanal,
    cambiarSoloSeñalActiva
} from './canalUI.js';

import {
    BOOTSTRAP_COL_NUMBER_DESKTOP,
    BOOTSTRAP_COL_NUMBER_MOBILE,
    LS_KEY_WELCOME_MODAL_VISIBILITY,
    LS_KEY_NAVBAR_VISIBILITY,
    LS_KEY_ACTIVE_VIEW_MODE,
    LS_KEY_LAYOUT_FULL_HEIGHT_ENABLED,
    LS_KEY_FLOATING_BUTTONS_TEXT_VISIBILITY,
    LS_KEY_M3U8_PLAYER_CHOICE,
    LS_KEY_LOGO_CARD_BACKGROUND_VISIBILITY,
    LS_KEY_DYNAMIC_URL,
    LS_KEY_FLOATING_BUTTONS_POSITION,
    LS_KEY_HORIZONTAL_WIDTH_VALUE,
    LS_KEY_CHANNEL_SIGNAL_PREFERENCE,
    LS_KEY_BOOTSTRAP_COL_NUMBER,
    LS_KEY_OVERLAY_VISIBILITY,
    LS_KEY_SAVED_CHANNELS_GRID_VIEW,
    OVERLAY_BUTTONS_CONFIG,
    CSS_CLASS_BUTTON_PRIMARY,
    AMBIENT_MUSIC
} from './constants/index.js';

import {
    hideTextoBotonesOverlay,
    detectThemePreferences,
    showToast,
    guardarCanalesEnLocalStorage,
    ajustarClaseBotonCanal,
    activarVisionUnica,
    desactivarVisionUnica,
    deleteInvalidSignalPreferences,
    areAllSignalsEmpty,
    crearBotonesParaCanales,
    adjustVisibilityButtonsRemoveAllActiveChannels,
    ajustarNumeroDivisionesClaseCol,
    ajustarClaseColTransmisionesPorFila,
    crearBotonesPaises,
    crearBotonesCategorias,
    actualizarBotonesFlotantes,
    clicBotonPosicionBotonesFlotantes,
    CONTAINER_INTERNO_VISION_UNICA,
    guardarOrdenPanelesVisionUnica,
    toggleClaseOrdenado,
    sincronizarParametroCanalesActivos,
    limpiarParametroCompartidoEnUrl,
    obtenerCanalesDesdeUrl,
    registrarCambioManualCanales,
    limpiarRecursosTransmision,
    syncCheckboxState,
    renderizarListasPersonalizadasUI,
    limpiarContenedoresListadosCanales,
    resincronizarEstadoVisualCanalesActivos,
    applyTheme
} from './helpers/index.js';

import {
    debounce,
    obtainNumberOfChannelsPerRow,
    registerVideojsTranslation,
    initializeBootstrapTooltips,
    disposeBootstrapTooltips
} from './utils/index.js';

// MARK: 📦 Exports
export let gridViewContainerEl;

export let singleViewContainerEl;
export let singleViewVideoContainerEl;

let singleViewNoSignalIconEl;

// URL dinámica
export let isDynamicUrlMode = false;
try { isDynamicUrlMode = JSON.parse(localStorage.getItem(LS_KEY_DYNAMIC_URL)) ?? false; } catch { }

export let estaCargandoDesdeUrlCompartida = false;

export let checkboxElDynamicUrl;
export let spanElDynamicUrlValue;
let iconElDynamicUrl;

export const aplicarEstadoUrlDinamica = (activo) => {
    if (!checkboxElDynamicUrl || !spanElDynamicUrlValue || !iconElDynamicUrl) return;
    checkboxElDynamicUrl.checked = activo;
    spanElDynamicUrlValue.textContent = activo ? '[habilitada]' : '[deshabilitada]';
    iconElDynamicUrl.classList.toggle('text-success', activo);
    iconElDynamicUrl.classList.toggle('text-secondary', !activo);
};

export let musicIcon;

export const obtenerCanalesPredeterminados = (isMobile) => {
    return isMobile ? ARRAY_CANALES_PREDETERMINADOS : ARRAY_CANALES_PREDETERMINADOS.concat(ARRAY_CANALES_PREDETERMINADOS_EXTRAS);
}

// Customization
// Number channels per row
export let spanElNumberChannelsPerRow;
export let buttonsNumberChannelsPerRow;
// Floating buttons
export let buttonsPositionFloatingButtons;
// Horizontal width
export let widthRangeInputEl;
export let widthRangeValueEl;

// Toggle full height
export let checkboxElFullHeight;
export let spanElFullHeight;





// MARK: 📫 DOMContentLoaded
window.addEventListener('DOMContentLoaded', () => {
    registerVideojsTranslation();

    // querySelector
    singleViewNoSignalIconEl = document.querySelector('#icono-sin-señal-single-view');
    singleViewContainerEl = document.querySelector('#container-single-view');
    singleViewVideoContainerEl = document.querySelector('#container-video-single-view');
    gridViewContainerEl = document.querySelector('#container-vision-cuadricula');

    checkboxElDynamicUrl = document.querySelector('#checkbox-url-dinamica')
    spanElDynamicUrlValue = document.querySelector('#span-valor-url-dinamica');
    iconElDynamicUrl = document.querySelector('#icono-url-dinamica');

    // MARK: Customization
    // MARK: Navbar
    const navbarCheckboxEl = document.querySelector('#checkbox-personalizar-visualizacion-navbar');

    const sincronizarVisibilidadNavbar = (isNavbarVisible) => {
        if (!navbarCheckboxEl) { return }

        let navbarEl = document.querySelector('#navbar');
        let navbarSpanEl = document.querySelector('#span-valor-visualizacion-navbar');

        navbarEl?.classList.toggle('d-none', !isNavbarVisible);
        syncCheckboxState({
            checkbox: navbarCheckboxEl,
            statusElement: navbarSpanEl,
            storageKey: LS_KEY_NAVBAR_VISIBILITY,
            isVisible: isNavbarVisible
        });
    };

    navbarCheckboxEl?.addEventListener('click', () => {
        sincronizarVisibilidadNavbar(navbarCheckboxEl.checked);
    });

    sincronizarVisibilidadNavbar(localStorage.getItem(LS_KEY_NAVBAR_VISIBILITY) !== 'hide');

    // MARK: View mode
    const gridViewActivateButtonEl = document.querySelector('#boton-activar-diseño-vision-grid');
    const singleViewActivateButtonEl = document.querySelector('#boton-activar-diseño-single-view');

    singleViewActivateButtonEl.addEventListener('click', () => {
        if (localStorage.getItem(LS_KEY_ACTIVE_VIEW_MODE) !== 'single-view') {
            activarVisionUnica();
            singleViewActivateButtonEl.classList.replace('btn-light-subtle', CSS_CLASS_BUTTON_PRIMARY);
            gridViewActivateButtonEl.classList.replace(CSS_CLASS_BUTTON_PRIMARY, 'btn-light-subtle');
        } else {
            showToast({
                title: 'Ya estas en modo visión única',
                type: 'info'
            });
        }
    })

    gridViewActivateButtonEl.addEventListener('click', () => {
        if (localStorage.getItem(LS_KEY_ACTIVE_VIEW_MODE) === 'single-view') {
            desactivarVisionUnica();
            singleViewActivateButtonEl.classList.replace(CSS_CLASS_BUTTON_PRIMARY, 'btn-light-subtle');
            gridViewActivateButtonEl.classList.replace('btn-light-subtle', CSS_CLASS_BUTTON_PRIMARY);
        } else {
            showToast({
                title: 'Ya estas en modo visión cuadrícula',
                type: 'info'
            });
        }
    })


    // MARK: Overlay buttons 
    // buttons overlay; signals, move, change, web, close
    const overlayToggleItems = document.querySelectorAll('.overlay-toggle-item');
    // Optimización: Cacheamos referencias para evitar querySelector en cada llamada
    const overlayToggleCache = Array.from(overlayToggleItems).map(toggle => {
        const checkboxEl = toggle.querySelector('input[type="checkbox"]');
        const spanEl = toggle.querySelector('span');

        if (!checkboxEl || !spanEl) return null;

        const buttonConfig = OVERLAY_BUTTONS_CONFIG[checkboxEl.id];
        if (!buttonConfig) return null;

        return { checkboxEl, spanEl, buttonConfig };
    }).filter(item => item !== null);

    function actualizarBotonesPersonalizarOverlay() {
        try {
            const isOverlayVisible = localStorage.getItem(LS_KEY_OVERLAY_VISIBILITY) !== 'hide';

            // Optimización: Manipulamos la clase global una sola vez
            document.body.classList.toggle('d-none__barras-overlay', !isOverlayVisible);

            overlayToggleCache.forEach(({ checkboxEl, spanEl, buttonConfig }) => {
                if (isOverlayVisible) {
                    checkboxEl.disabled = false;

                    const isButtonVisible = localStorage.getItem(buttonConfig.storageKey) !== 'hide';
                    syncCheckboxState({
                        checkbox: checkboxEl,
                        statusElement: spanEl,
                        storageKey: buttonConfig.storageKey,
                        isVisible: isButtonVisible
                    });
                    document.body.classList.toggle(`d-none__barras-overlay__${buttonConfig.classSuffix}`, !isButtonVisible);
                } else {
                    checkboxEl.checked = false;
                    checkboxEl.disabled = true;
                    spanEl.textContent = '[Oculto]';
                }
            });

            syncCheckboxState({
                checkbox: CHECKBOX_PERSONALIZAR_VISUALIZACION_OVERLAY,
                statusElement: SPAN_VALOR_CHECKBOX_PERSONALIZAR_VISUALIZACION_OVERLAY,
                storageKey: LS_KEY_OVERLAY_VISIBILITY,
                isVisible: isOverlayVisible
            });

            hideTextoBotonesOverlay();
        } catch (error) {
            console.error(`Error durante actualización estado botones personalizar overlay. Error: ${error}`);
            showToast({
                title: 'Ha ocurrido un error durante la actualización del estado botones personalizar overlay.',
                body: `Error: ${error}`,
                type: 'danger',
            });
        }
    }

    // button for the whole overlay
    const CHECKBOX_PERSONALIZAR_VISUALIZACION_OVERLAY = document.querySelector('#checkbox-personalizar-visualizacion-overlay');
    const SPAN_VALOR_CHECKBOX_PERSONALIZAR_VISUALIZACION_OVERLAY = document.querySelector('#span-valor-visualizacion-overlay');
    CHECKBOX_PERSONALIZAR_VISUALIZACION_OVERLAY.addEventListener('click', () => {
        document.body.classList.toggle('d-none__barras-overlay', !CHECKBOX_PERSONALIZAR_VISUALIZACION_OVERLAY.checked);
        syncCheckboxState({
            checkbox: CHECKBOX_PERSONALIZAR_VISUALIZACION_OVERLAY,
            statusElement: SPAN_VALOR_CHECKBOX_PERSONALIZAR_VISUALIZACION_OVERLAY,
            storageKey: LS_KEY_OVERLAY_VISIBILITY,
            isVisible: CHECKBOX_PERSONALIZAR_VISUALIZACION_OVERLAY.checked
        });
        actualizarBotonesPersonalizarOverlay();
    });

    Object.values(OVERLAY_BUTTONS_CONFIG).forEach(button => {
        const botonIndividual = document.getElementById(button.id);
        if (!botonIndividual) return;

        botonIndividual.addEventListener('click', () => {
            localStorage.setItem(button.storageKey, botonIndividual.checked ? 'show' : 'hide');
            actualizarBotonesPersonalizarOverlay();
        });
    });

    // checkbox overlay visibility on start
    syncCheckboxState({
        checkbox: CHECKBOX_PERSONALIZAR_VISUALIZACION_OVERLAY,
        statusElement: SPAN_VALOR_CHECKBOX_PERSONALIZAR_VISUALIZACION_OVERLAY,
        storageKey: LS_KEY_OVERLAY_VISIBILITY,
        isVisible:
            localStorage.getItem(LS_KEY_OVERLAY_VISIBILITY) === null
                ? true
                : localStorage.getItem(LS_KEY_OVERLAY_VISIBILITY) !== 'hide'
    });
    actualizarBotonesPersonalizarOverlay();

    const hideTextoBotonesOverlayDebounced = debounce(hideTextoBotonesOverlay, 150);
    window.addEventListener('resize', hideTextoBotonesOverlayDebounced); // ocultar texto si el tamaño de los botones excede el tamaño del contenedor

    // MARK: player for m3u8
    const lsReproductorM3u8 = localStorage.getItem(LS_KEY_M3U8_PLAYER_CHOICE) ?? 'videojs';
    const RADIOS_REPRODUCTOR_M3U8 = document.querySelectorAll('input[name="btnradio-reproductor-m3u8"]');
    const SPAN_VALOR_REPRODUCTOR_M3U8 = document.querySelector('#span-valor-reproductor-m3u8');

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
            localStorage.setItem(LS_KEY_M3U8_PLAYER_CHOICE, valor);
            if (SPAN_VALOR_REPRODUCTOR_M3U8) {
                SPAN_VALOR_REPRODUCTOR_M3U8.textContent = descripcion;
            }

            try {
                const transmisionesActivas = document.querySelectorAll('div[data-canal]');
                // Optimización: Parsear preferencias una sola vez fuera del bucle
                const lsPreferenciasSeñalCanales = JSON.parse(localStorage.getItem(LS_KEY_CHANNEL_SIGNAL_PREFERENCE)) || {};

                transmisionesActivas.forEach(transmision => {
                    const canalId = transmision.getAttribute('data-canal');
                    if (!canalId) return;

                    const datosCanal = channelsList?.[canalId]?.señales;
                    if (!datosCanal) return;

                    let señalUtilizar;

                    // 1. Prioridad: Preferencia guardada del usuario
                    if (lsPreferenciasSeñalCanales[canalId]) {
                        señalUtilizar = Object.keys(lsPreferenciasSeñalCanales[canalId])[0];
                    } else {
                        // 2. Default: Jerarquía de señales
                        const { iframe_url, m3u8_url, yt_id, yt_embed, yt_playlist, twitch_id } = datosCanal;

                        if (iframe_url?.length) señalUtilizar = 'iframe_url';
                        else if (m3u8_url?.length) señalUtilizar = 'm3u8_url';
                        else if (yt_id) señalUtilizar = 'yt_id';
                        else if (yt_embed) señalUtilizar = 'yt_embed';
                        else if (yt_playlist) señalUtilizar = 'yt_playlist';
                        else if (twitch_id) señalUtilizar = 'twitch_id';
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


    // MARK: Change theme
    detectThemePreferences();
    const themeCheckboxEl = document.querySelector('#checkbox-change-theme');
    themeCheckboxEl?.addEventListener('change', () => {
        applyTheme(themeCheckboxEl.checked);
    });

    // MARK: Slider horizontal width
    widthRangeInputEl = document.querySelector('#input-range-tamaño-container-vision-cuadricula');
    widthRangeValueEl = document.querySelector('#span-valor-input-range');
    /**
     * Sincroniza el ancho horizontal del contenedor de la vista de cuadrícula
     * @param {number} [newValue] - Nuevo valor de ancho (opcional)
     */
    const syncHorizontalWidthValue = (newValue) => {
        // Obtener o establecer el valor, con manejo de valores nulos/undefined
        const storedValue = localStorage.getItem(LS_KEY_HORIZONTAL_WIDTH_VALUE);
        const widthValue = newValue ?? (storedValue ? parseInt(storedValue, 10) : 100);

        // Actualizar localStorage solo si hay un nuevo valor
        if (newValue !== undefined) {
            localStorage.setItem(LS_KEY_HORIZONTAL_WIDTH_VALUE, widthValue);
        }

        // Aplicar los cambios
        const widthPercentage = `${widthValue}%`;
        widthRangeInputEl.value = widthValue;
        widthRangeValueEl.textContent = widthPercentage;
        gridViewContainerEl.style.maxWidth = widthPercentage;
    };

    widthRangeInputEl.addEventListener('input', (event) => {
        syncHorizontalWidthValue(event.target.value)
        hideTextoBotonesOverlayDebounced();
    });

    syncHorizontalWidthValue();


    // MARK: Checkbox use full height
    checkboxElFullHeight = document.querySelector('#checkbox-personalizar-altura-canales');
    spanElFullHeight = document.querySelector('#span-valor-altura-canales');
    const iconElFullHeight = document.querySelector('#icono-personalizar-altura-canales');

    checkboxElFullHeight.addEventListener('click', () => {
        checkboxElFullHeight.checked
            ? (iconElFullHeight.classList.replace('bi-arrows-collapse', 'bi-arrows-vertical'),
                JSON.stringify(localStorage.setItem(LS_KEY_LAYOUT_FULL_HEIGHT_ENABLED, true)),
                spanElFullHeight.textContent = 'Expandido'
            )
            : (iconElFullHeight.classList.replace('bi-arrows-vertical', 'bi-arrows-collapse'),
                JSON.stringify(localStorage.setItem(LS_KEY_LAYOUT_FULL_HEIGHT_ENABLED, false)),
                spanElFullHeight.textContent = 'Reducido'
            );
        ajustarNumeroDivisionesClaseCol()
    });

    let isFullHeightMode = true;
    try { isFullHeightMode = JSON.parse(localStorage.getItem(LS_KEY_LAYOUT_FULL_HEIGHT_ENABLED)) ?? true; } catch { }

    if (isFullHeightMode) {
        JSON.stringify(localStorage.setItem(LS_KEY_LAYOUT_FULL_HEIGHT_ENABLED, true));
        checkboxElFullHeight.checked = true;
        iconElFullHeight.classList.replace('bi-arrows-collapse', 'bi-arrows-vertical');
        spanElFullHeight.textContent = 'Expandido';
    } else {
        checkboxElFullHeight.checked = false;
        iconElFullHeight.classList.replace('bi-arrows-vertical', 'bi-arrows-collapse');
        spanElFullHeight.textContent = 'Reducido';
    }

    // MARK: Number channels per row
    spanElNumberChannelsPerRow = document.querySelector('#span-valor-transmisiones-por-fila');
    buttonsNumberChannelsPerRow = document.querySelectorAll('#container-botones-personalizar-transmisiones-por-fila button');

    buttonsNumberChannelsPerRow.forEach(btn => {
        btn.addEventListener('click', () => {
            console.log(btn.value);
            ajustarClaseColTransmisionesPorFila(btn.value)
            spanElNumberChannelsPerRow.innerHTML = `${obtainNumberOfChannelsPerRow()}`
            hideTextoBotonesOverlay()
        })
    });
    spanElNumberChannelsPerRow.innerHTML = `${obtainNumberOfChannelsPerRow()}`





    // MARK: Floating buttons position
    buttonsPositionFloatingButtons = document.querySelectorAll('#grupo-botones-posicion-botones-flotantes .btn-check');
    buttonsPositionFloatingButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const position = btn.dataset.position.split(' ');
            clicBotonPosicionBotonesFlotantes(...position);
        });
    });

    let floatingActionsPosition = localStorage.getItem(LS_KEY_FLOATING_BUTTONS_POSITION);
    if (floatingActionsPosition !== null) {
        const { top, start, margin, translate } = JSON.parse(floatingActionsPosition);
        actualizarBotonesFlotantes(top, start, margin, translate);
    } else {
        actualizarBotonesFlotantes('bottom-0', 'start-50', 'mb-3', 'translate-middle-x');
    }

    // MARK: Text on floating buttons
    const CHECKBOX_PERSONALIZAR_TEXTO_BOTONES_FLOTANTES = document.querySelector('#checkbox-personalizar-texto-botones-flotantes');
    const SPAN_VALOR_CHECKBOX_PERSONALIZAR_TEXTO_BOTONES_FLOTANTES = document.querySelector('#span-valor-texto-en-botones-flotante');
    const ICONO_PERSONALIZAR_TEXTO_BOTONES_FLOTANTES = document.querySelector('#icono-personalizar-texto-botones-flotantes');

    const SPAN_BOTONES_FLOTANTES = document.querySelectorAll('#grupo-botones-flotantes button>span');

    CHECKBOX_PERSONALIZAR_TEXTO_BOTONES_FLOTANTES.addEventListener('click', () => {
        SPAN_BOTONES_FLOTANTES.forEach(button => {
            button.classList.toggle('d-none', !CHECKBOX_PERSONALIZAR_TEXTO_BOTONES_FLOTANTES.checked);
        });
        syncCheckboxState({
            checkbox: CHECKBOX_PERSONALIZAR_TEXTO_BOTONES_FLOTANTES,
            statusElement: SPAN_VALOR_CHECKBOX_PERSONALIZAR_TEXTO_BOTONES_FLOTANTES,
            storageKey: LS_KEY_FLOATING_BUTTONS_TEXT_VISIBILITY,
            isVisible: CHECKBOX_PERSONALIZAR_TEXTO_BOTONES_FLOTANTES.checked
        });
        CHECKBOX_PERSONALIZAR_TEXTO_BOTONES_FLOTANTES.checked
            ? ICONO_PERSONALIZAR_TEXTO_BOTONES_FLOTANTES.classList.replace('bi-square', 'bi-info-square')
            : ICONO_PERSONALIZAR_TEXTO_BOTONES_FLOTANTES.classList.replace('bi-info-square', 'bi-square');
    });

    if (localStorage.getItem(LS_KEY_FLOATING_BUTTONS_TEXT_VISIBILITY) !== 'hide') {
        syncCheckboxState({
            checkbox: CHECKBOX_PERSONALIZAR_TEXTO_BOTONES_FLOTANTES,
            statusElement: SPAN_VALOR_CHECKBOX_PERSONALIZAR_TEXTO_BOTONES_FLOTANTES,
            storageKey: LS_KEY_FLOATING_BUTTONS_TEXT_VISIBILITY,
            isVisible: true
        });
        ICONO_PERSONALIZAR_TEXTO_BOTONES_FLOTANTES.classList.replace('bi-square', 'bi-info-square');
    } else {
        SPAN_BOTONES_FLOTANTES.forEach((button) => {
            button.classList.toggle('d-none', !CHECKBOX_PERSONALIZAR_TEXTO_BOTONES_FLOTANTES.checked);
        });
        syncCheckboxState({
            checkbox: CHECKBOX_PERSONALIZAR_TEXTO_BOTONES_FLOTANTES,
            statusElement: SPAN_VALOR_CHECKBOX_PERSONALIZAR_TEXTO_BOTONES_FLOTANTES,
            storageKey: LS_KEY_FLOATING_BUTTONS_TEXT_VISIBILITY,
            isVisible: false
        });
        ICONO_PERSONALIZAR_TEXTO_BOTONES_FLOTANTES.classList.replace('bi-info-square', 'bi-square');
    }


    // MARK: Dynamic URL
    checkboxElDynamicUrl?.addEventListener('click', () => {
        isDynamicUrlMode = checkboxElDynamicUrl.checked;
        localStorage.setItem(LS_KEY_DYNAMIC_URL, JSON.stringify(isDynamicUrlMode));
        aplicarEstadoUrlDinamica(isDynamicUrlMode);

        isDynamicUrlMode ? sincronizarParametroCanalesActivos() : limpiarParametroCompartidoEnUrl(true);
    });
    aplicarEstadoUrlDinamica(isDynamicUrlMode);


    const mergeCustomListsCheckboxEl = document.querySelector('#checkbox-combinar-listas-personalizadas');
    const mergeCustomListsValueSpanEl = document.querySelector('#span-valor-combinar-listas-personalizadas');

    /**
         * Inicializa y sincroniza el switch para combinar canales similares entre listas personalizadas.
         * Actualiza el texto auxiliar y persiste la preferencia en localStorage.
         * @returns {void}
         */
    function inicializarPreferenciaCombinarListas() {
        if (!mergeCustomListsCheckboxEl || !mergeCustomListsValueSpanEl) { return }

        const obtenerEtiquetaEstado = (estado) => estado ? 'Combinar coincidencias' : 'Mantener listas separadas';

        const aplicarEstado = (estado) => {
            mergeCustomListsCheckboxEl.checked = estado;
            mergeCustomListsValueSpanEl.textContent = obtenerEtiquetaEstado(estado);
        };

        const estadoInicial = obtenerPreferenciaCombinarCanales();
        aplicarEstado(estadoInicial);

        mergeCustomListsCheckboxEl.addEventListener('change', () => {
            const nuevoEstado = mergeCustomListsCheckboxEl.checked;
            establecerPreferenciaCombinarCanales(nuevoEstado);
            aplicarEstado(nuevoEstado);
        }, { once: false });
    }

    inicializarPreferenciaCombinarListas();


    renderizarListasPersonalizadasUI();


    const loadCustomListButtonEl = document.querySelector('#boton-cargar-lista-personalizada');
    const customListUrlInputEl = document.querySelector('#input-url-lista-personalizada');
    if (loadCustomListButtonEl && customListUrlInputEl) {
        const textoOriginalBoton = loadCustomListButtonEl.innerHTML;
        const toggleEstadoBoton = (cargando) => {
            if (cargando) {
                loadCustomListButtonEl.disabled = true;
                loadCustomListButtonEl.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span> Cargando...';
            } else {
                loadCustomListButtonEl.disabled = false;
                loadCustomListButtonEl.innerHTML = textoOriginalBoton;
            }
        };

        loadCustomListButtonEl.addEventListener('click', async () => {
            const urlLista = customListUrlInputEl.value.trim();
            if (!urlLista) {
                showToast({
                    body: 'Ingresa la URL a tu archivo .m3u antes de cargarla.',
                    type: 'warning'
                });
                customListUrlInputEl.focus();
                return;
            }

            try {
                new URL(urlLista);
            } catch {
                showToast({
                    title: 'La URL ingresada no es válida.',
                    body: 'Verifica que comience con https://',
                    type: 'danger'
                });
                customListUrlInputEl.focus();
                return;
            }

            toggleEstadoBoton(true);
            try {
                await cargarListaPersonalizadaM3U(urlLista);
                limpiarContenedoresListadosCanales();
                crearBotonesParaCanales();
                crearBotonesPaises();
                crearBotonesCategorias();
                resincronizarEstadoVisualCanalesActivos();
                initializeBootstrapTooltips();

                renderizarListasPersonalizadasUI();
                showToast({
                    title: 'Lista personalizada cargada correctamente.',
                    body: 'Los nuevos canales se añadieron a su lista.',
                    type: 'success'
                });
            } catch (error) {
                console.error('Error al cargar lista personalizada M3U:', error);
                showToast({
                    title: 'No fue posible cargar la lista personalizada.',
                    body: `Verifica la URL o si el servidor permite descargas (CORS). <br> Error: ${error}`,
                    type: 'danger',
                    autohide: false,
                    delay: 0,
                    allowHtml: true
                });
            } finally {
                toggleEstadoBoton(false);
            }
        });
    }

    const pasteCustomListButtonEl = document.querySelector('#boton-pegar-lista-personalizada');
    const customListTextareaEl = document.querySelector('#textarea-lista-personalizada');

    if (pasteCustomListButtonEl && customListTextareaEl) {
        const textoOriginalBotonPegado = pasteCustomListButtonEl.innerHTML;
        const toggleBotonPegado = (cargando) => {
            if (cargando) {
                pasteCustomListButtonEl.disabled = true;
                pasteCustomListButtonEl.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span> Procesando...';
            } else {
                pasteCustomListButtonEl.disabled = false;
                pasteCustomListButtonEl.innerHTML = textoOriginalBotonPegado;
            }
        };

        pasteCustomListButtonEl.addEventListener('click', async () => {
            const contenidoLista = customListTextareaEl.value.trim();
            if (!contenidoLista) {
                showToast({
                    body: 'Pega el contenido completo de tu archivo .m3u antes de continuar.',
                    type: 'warning'
                });
                customListTextareaEl.focus();
                return;
            }

            toggleBotonPegado(true);
            try {
                const etiquetaManual = `Lista manual ${new Date().toLocaleString('es-CL', { dateStyle: 'short', timeStyle: 'short' })}`;
                await cargarListaPersonalizadaDesdeTexto(contenidoLista, { etiqueta: etiquetaManual });
                customListTextareaEl.value = '';
                limpiarContenedoresListadosCanales();
                crearBotonesParaCanales();
                crearBotonesPaises();
                crearBotonesCategorias();
                resincronizarEstadoVisualCanalesActivos();

                renderizarListasPersonalizadasUI();
                showToast({
                    title: 'Lista manual cargada correctamente.',
                    body: 'Se añadieron los nuevos canales a su lista.',
                    type: 'success'
                });
            } catch (error) {
                console.error('Error al procesar lista pegada manualmente:', error);
                showToast({
                    title: 'No fue posible procesar el texto pegado.',
                    body: `Revisa el formato del archivo .m3u. Error: ${error.message}`,
                    type: 'danger',
                    autohide: false,
                    delay: 0,
                    showReloadOnError: true,
                    allowHtml: true
                });
            } finally {
                toggleBotonPegado(false);
            }
        });
    }

    // MARK: Background card
    const CHECKBOX_PERSONALIZAR_VISUALIZACION_TARJETA_LOGO_BACKGROUND = document.querySelector('#checkbox-tarjeta-logo-background');
    const SPAN_VALOR_CHECKBOX_PERSONALIZAR_VISUALIZACION_TARJETA_LOGO_BACKGROUND = document.querySelector('#span-valor-visualizacion-tarjeta-logo-background');
    const ICONO_PERSONALIZAR_VISUALIZACION_TARJETA_LOGO_BACKGROUND = document.querySelector('#icono-personalizar-visualizacion-tarjeta-logo-background');
    const CONTAINER_TARJETA_LOGO_BACKGROUND = document.querySelector('#container-tarjeta-logo-background');

    CHECKBOX_PERSONALIZAR_VISUALIZACION_TARJETA_LOGO_BACKGROUND.addEventListener('click', () => {
        CONTAINER_TARJETA_LOGO_BACKGROUND.classList.toggle('d-none', !CHECKBOX_PERSONALIZAR_VISUALIZACION_TARJETA_LOGO_BACKGROUND.checked);
        syncCheckboxState({
            checkbox: CHECKBOX_PERSONALIZAR_VISUALIZACION_TARJETA_LOGO_BACKGROUND,
            statusElement: SPAN_VALOR_CHECKBOX_PERSONALIZAR_VISUALIZACION_TARJETA_LOGO_BACKGROUND,
            storageKey: LS_KEY_LOGO_CARD_BACKGROUND_VISIBILITY,
            isVisible: CHECKBOX_PERSONALIZAR_VISUALIZACION_TARJETA_LOGO_BACKGROUND.checked
        });

        CHECKBOX_PERSONALIZAR_VISUALIZACION_TARJETA_LOGO_BACKGROUND.checked ? ICONO_PERSONALIZAR_VISUALIZACION_TARJETA_LOGO_BACKGROUND.classList.replace('bi-eye-slash', 'bi-eye') : ICONO_PERSONALIZAR_VISUALIZACION_TARJETA_LOGO_BACKGROUND.classList.replace('bi-eye', 'bi-eye-slash');
    });

    let logoCardBackgroundState = localStorage.getItem(LS_KEY_LOGO_CARD_BACKGROUND_VISIBILITY) ?? 'show';
    if (logoCardBackgroundState !== 'hide') {
        syncCheckboxState({
            checkbox: CHECKBOX_PERSONALIZAR_VISUALIZACION_TARJETA_LOGO_BACKGROUND,
            statusElement: SPAN_VALOR_CHECKBOX_PERSONALIZAR_VISUALIZACION_TARJETA_LOGO_BACKGROUND,
            storageKey: LS_KEY_LOGO_CARD_BACKGROUND_VISIBILITY,
            isVisible: true
        })
        CONTAINER_TARJETA_LOGO_BACKGROUND.classList.toggle('d-none', !CHECKBOX_PERSONALIZAR_VISUALIZACION_TARJETA_LOGO_BACKGROUND.checked);
        ICONO_PERSONALIZAR_VISUALIZACION_TARJETA_LOGO_BACKGROUND.classList.replace('bi-eye-slash', 'bi-eye');
    } else {
        syncCheckboxState({
            checkbox: CHECKBOX_PERSONALIZAR_VISUALIZACION_TARJETA_LOGO_BACKGROUND,
            statusElement: SPAN_VALOR_CHECKBOX_PERSONALIZAR_VISUALIZACION_TARJETA_LOGO_BACKGROUND,
            storageKey: LS_KEY_LOGO_CARD_BACKGROUND_VISIBILITY,
            isVisible: false
        })
        CONTAINER_TARJETA_LOGO_BACKGROUND.classList.toggle('d-none', !CHECKBOX_PERSONALIZAR_VISUALIZACION_TARJETA_LOGO_BACKGROUND.checked);
        ICONO_PERSONALIZAR_VISUALIZACION_TARJETA_LOGO_BACKGROUND.classList.replace('bi-eye', 'bi-eye-slash');
    }

    // MARK: Ambient music
    const toggleButton = document.querySelector('#ambient-music-toggle');
    const volumeSlider = document.querySelector('#ambient-music-volume');
    musicIcon = document.querySelector('#music-icon');

    toggleButton.addEventListener('click', () => {
        if (AMBIENT_MUSIC.paused) {
            AMBIENT_MUSIC.play().catch(e => console.error('Error playing audio:', e));
            AMBIENT_MUSIC.loop = true;
            AMBIENT_MUSIC.volume = volumeSlider.value / 100;
            musicIcon.classList.replace('bi-play-fill', 'bi-pause-fill');
        } else {
            AMBIENT_MUSIC.pause();
            musicIcon.classList.replace('bi-pause-fill', 'bi-play-fill');
        }
    });

    // Control de volumen
    volumeSlider.addEventListener('input', (e) => {
        AMBIENT_MUSIC.volume = e.target.value / 100;
    });

    // MARK: 🟢 Carga inicial
    async function cargaInicial() {
        try {
            await fetchCargarCanales();
            if (channelsList) {
                const listasRestauradas = restaurarListasPersonalizadas();
                crearBotonesParaCanales();
                crearBotonesPaises();
                crearBotonesCategorias();
                deleteInvalidSignalPreferences();

                const urlActual = new URL(window.location.href);
                const paramCompartidos = urlActual.searchParams.get('c');
                const totalCanalesSolicitados = paramCompartidos
                    ? paramCompartidos
                        .split(',')
                        .map(id => id.trim())
                        .filter(id => id.length > 0).length
                    : 0;

                const canalesCompartidos = obtenerCanalesDesdeUrl();

                if (canalesCompartidos.length > 0) {

                    estaCargandoDesdeUrlCompartida = true;

                    if (localStorage.getItem(LS_KEY_ACTIVE_VIEW_MODE) === 'single-view') {
                        desactivarVisionUnica({ evitarCargaPredeterminados: true });
                        singleViewActivateButtonEl.classList.replace(CSS_CLASS_BUTTON_PRIMARY, 'btn-light-subtle');
                        localStorage.setItem(LS_KEY_ACTIVE_VIEW_MODE, 'grid-view');
                    }
                    canalesCompartidos.forEach(canalId => tele.add(canalId));
                    estaCargandoDesdeUrlCompartida = false;

                    if (totalCanalesSolicitados > canalesCompartidos.length) {
                        const diferencia = totalCanalesSolicitados - canalesCompartidos.length;
                        showToast({
                            title: 'Canales omitidos al cargar desde URL',
                            body: `No todos los canales compartidos se pudieron cargar 
                                (se cargaron ${canalesCompartidos.length} de ${totalCanalesSolicitados}). 
                                Es posible que algunos provengan de listas personalizadas o modos 
                                que no están disponibles en este navegador.`,
                            type: 'info'
                        });
                        console.info('[teles][compartir] Canales omitidos al cargar desde URL', {
                            totalSolicitados: totalCanalesSolicitados,
                            totalCargados: canalesCompartidos.length,
                            faltantes: diferencia
                        });
                    }
                } else {

                    if (localStorage.getItem(LS_KEY_ACTIVE_VIEW_MODE) === 'single-view') {
                        activarVisionUnica();
                        singleViewActivateButtonEl.classList.replace('btn-light-subtle', CSS_CLASS_BUTTON_PRIMARY);
                        gridViewActivateButtonEl.classList.replace(CSS_CLASS_BUTTON_PRIMARY, 'btn-light-subtle');
                    } else {
                        tele.cargaCanalesPredeterminados();
                    }
                }

                /// actualizarBotonesPersonalizarOverlay()

                const lsBootstrapColNumber =
                    JSON.parse(localStorage.getItem(LS_KEY_BOOTSTRAP_COL_NUMBER)) ??
                    (isMobile.any ? BOOTSTRAP_COL_NUMBER_MOBILE : BOOTSTRAP_COL_NUMBER_DESKTOP);
                ajustarClaseColTransmisionesPorFila(lsBootstrapColNumber);
                hideTextoBotonesOverlay()
                initializeBootstrapTooltips();

                if (listasRestauradas > 0) {
                    renderizarListasPersonalizadasUI();
                }
            }
        } catch (error) {
            console.error(`Error durante carga inicial. Error: ${error}`);
            showToast({
                title: 'Error durante carga inicial',
                body: `Error: ${error}`,
                type: 'danger',
                showReloadOnError: true
            });
            return
        }
    }
    cargaInicial();

    adjustVisibilityButtonsRemoveAllActiveChannels()

    // Efecto glow en hover a logo del fondo
    const TARJETA_LOGO_BACKGROUND = document.querySelector('.tarjeta-logo-background');
    TARJETA_LOGO_BACKGROUND.onmousemove = e => {
        let rect = TARJETA_LOGO_BACKGROUND.getBoundingClientRect(),
            x = e.clientX - rect.left,
            y = e.clientY - rect.top;
        TARJETA_LOGO_BACKGROUND.style.setProperty('--mouse-x', `${x}px`);
        TARJETA_LOGO_BACKGROUND.style.setProperty('--mouse-y', `${y}px`);
    };

    screen.orientation.addEventListener('change', () => {
        if (localStorage.getItem(LS_KEY_ACTIVE_VIEW_MODE) !== 'single-view') ajustarNumeroDivisionesClaseCol();
    });

    document.addEventListener('hidden.bs.toast', event => {
        event.target.remove()
    });

    // MARK: otros
    // plugin para mover canales en grid
    new Sortable(gridViewContainerEl, {
        animation: 350,
        handle: '.clase-para-mover',
        easing: "cubic-bezier(.17,.67,.83,.67)",
        ghostClass: 'marca-al-mover',
        onStart: () => {
            disposeBootstrapTooltips(); // evitamos tooltips flotando al mover
        },
        onEnd: () => {
            initializeBootstrapTooltips();
            guardarCanalesEnLocalStorage();
            registrarCambioManualCanales();
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
                disposeBootstrapTooltips();
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
                initializeBootstrapTooltips();
                toggleClaseOrdenado();
                registrarCambioManualCanales();
            } catch (e) {
                console.error('Error en onEnd Sortable:', e);
            }
        }
    });


    let observerScheduled = false;

    const OBSERVER = new MutationObserver(() => {
        if (observerScheduled) return;
        observerScheduled = true;
        requestAnimationFrame(() => {
            observerScheduled = false;
            try {
                ajustarNumeroDivisionesClaseCol?.();
                adjustVisibilityButtonsRemoveAllActiveChannels?.();
            } catch (e) {
                console.error('Error observer', e);
            }
        });
    });

    const OBSERVER_CONFIG = {
        childList: true,
        subtree: false,
        attributes: false,
        characterData: false
    };

    if (gridViewContainerEl) {
        OBSERVER.observe(gridViewContainerEl, OBSERVER_CONFIG);
    }
});

// MARK: 📺 Manejo canales
export let tele = {
    add: (canal) => {
        try {
            if (!canal || !channelsList?.[canal]) return console.error(`El canal "${canal}" proporcionado no es válido para ser añadido.`);
            const DIV_CANAL = document.createElement('div');
            DIV_CANAL.setAttribute('data-canal', canal);
            const esVisionUnica = localStorage.getItem(LS_KEY_ACTIVE_VIEW_MODE) === 'single-view';

            if (esVisionUnica) {
                // En visión única debe existir como máximo un canal activo.
                const canalEnUso = singleViewVideoContainerEl?.querySelector('div[data-canal]');
                if (canalEnUso && canalEnUso.dataset.canal && canalEnUso.dataset.canal !== canal) {
                    tele.remove(canalEnUso.dataset.canal);
                }

                DIV_CANAL.classList.add('position-relative', 'shadow', 'h-100', 'w-100');
                DIV_CANAL.append(crearFragmentCanal(canal));
                singleViewVideoContainerEl.append(DIV_CANAL);
                singleViewNoSignalIconEl.classList.add('d-none');
            } else {
                DIV_CANAL.classList.add('position-relative', 'shadow');
                DIV_CANAL.append(crearFragmentCanal(canal));
                gridViewContainerEl.append(DIV_CANAL);
                guardarCanalesEnLocalStorage();
            }
            ajustarClaseBotonCanal(canal, true);
            initializeBootstrapTooltips();
            hideTextoBotonesOverlay();
            registrarCambioManualCanales();
            ajustarNumeroDivisionesClaseCol();
        } catch (error) {
            console.error(`Error durante creación div de canal con id: ${canal}. Error: ${error}`);
            showToast({
                title: `Ha ocurrido un error durante la creación canal para ser insertado - ID: ${canal}.`,
                body: `Error: ${error}`,
                type: 'danger',
                autohide: false,
                delay: 0,
                showReloadOnError: true
            })
            return
        }
    },
    remove: (canal) => {
        try {
            if (!canal) return console.error(`El canal "${canal}" proporcionado no es válido para su eliminación.`);
            let transmisionPorRemover = document.querySelector(`div[data-canal="${canal}"]`);

            if (!transmisionPorRemover) {
                ajustarClaseBotonCanal(canal, false);
                return;
            }

            // Limpiar recursos antes de eliminar el contenedor; iframe, videojs, clappr, oplayer
            limpiarRecursosTransmision(transmisionPorRemover);
            // Remover tooltips; botones flotantes overlay
            disposeBootstrapTooltips();
            // Eliminar el contenedor del DOM
            transmisionPorRemover.remove();


            // Si es visión única, mostrar el icono de sin señal activa
            if (localStorage.getItem(LS_KEY_ACTIVE_VIEW_MODE) === 'single-view') {
                singleViewNoSignalIconEl.classList.remove('d-none');
            } else {
                guardarCanalesEnLocalStorage();
            }

            ajustarClaseBotonCanal(canal, false);
            initializeBootstrapTooltips();
            registrarCambioManualCanales();
        } catch (error) {
            console.error(`Error durante eliminación div de canal con id: ${canal}. Error: ${error}`);
            showToast({
                title: `Ha ocurrido un error durante la eliminación canal - ID: ${canal}.`,
                body: `Error: ${error}`,
                type: 'danger',
                autohide: false,
                delay: 0,
                showReloadOnError: true
            })
            return
        }
    },
    cargaCanalesPredeterminados: () => {
        let lsCanales = JSON.parse(localStorage.getItem(LS_KEY_SAVED_CHANNELS_GRID_VIEW)) || {};
        // Default
        if (Object.keys(lsCanales).length === 0 && localStorage.getItem(LS_KEY_WELCOME_MODAL_VISIBILITY) !== 'hide') {
            obtenerCanalesPredeterminados(isMobile.any).forEach(canal => tele.add(canal));
            new bootstrap.Modal(document.querySelector('#modal-bienvenida')).show();
            // Check saved    
        } else {
            try {
                Object.keys(lsCanales).forEach(canal => {
                    if (areAllSignalsEmpty(canal)) {
                        document.querySelectorAll(`button[data-canal="${canal}"]`).forEach(boton => {
                            boton.classList.add('d-none');
                        });
                        showToast({
                            title: `Canal ${canal} sin señales activas.`,
                            body: 'Se eliminará del listado.',
                            type: 'warning'
                        });
                    } else {
                        tele.add(canal);
                    }
                });
            } catch (error) {
                console.error(`Error durante carga canales predeterminados. Error: ${error}`);
                showToast({
                    title: `Ha ocurrido un error durante la carga de canales predeterminados.`,
                    body: `Error: ${error}`,
                    type: 'danger',
                    autohide: false,
                    delay: 0,
                    showReloadOnError: true
                })
                return
            }
        };
    }
};