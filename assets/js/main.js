/* 
  main v0.22
  by Alplox 
  https://github.com/Alplox/teles
*/

// MARK: import
import {
    fetchLoadChannels,
    restoreChannelsFromMemory,
    loadPersonalizedM3UList,
    loadPersonalizedListFromText,
    restorePersonalizedLists,
    channelsList,
    getCombineChannelsPreference,
    setCombineChannelsPreference,
    DEFAULT_CHANNELS_ARRAY,
    EXTRA_DEFAULT_CHANNELS_ARRAY
} from './channelManager.js';


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
    hideOverlayButtonText,
    detectThemePreferences,
    showToast,
    saveChannelsToLocalStorage,
    adjustChannelButtonClass,
    activateSingleView,
    deactivateSingleView,
    deleteInvalidSignalPreferences,
    areAllSignalsEmpty,
    createChannelButtons,
    createButtonsForChangeChannelModal,
    createButtonsForSingleView,
    adjustVisibilityButtonsRemoveAllActiveChannels,
    saveOriginalOrder,
    adjustBootstrapColumnClasses,
    updateGridColumnConfiguration,
    createCountryButtons,
    createCategoryButtons,
    updateFloatingButtons,
    handleFloatingButtonsPositionClick,
    saveSingleViewPanelsOrder,
    toggleOrderedClass,
    syncActiveChannelsParameter,
    clearSharedUrlParameter,
    getChannelsFromUrl,
    registerManualChannelChange,
    cleanTransmissionResources,
    syncCheckboxState,
    applyTheme,
    clearChannelListContainers,
    resyncActiveChannelsVisualState,
    renderPersonalizedListsUI,
    getActiveChannelIds
} from './helpers/index.js';

import {
    debounce,
    obtainNumberOfChannelsPerRow,
    registerVideojsTranslation,
    initializeBootstrapTooltips,
    disposeBootstrapTooltips
} from './utils/index.js';

// MARK: 📦 Exports
export let gridViewContainer;

export let singleViewContainer;
export let singleViewGrid;
export let singleViewVideoContainer;

let singleViewNoSignalIcon;

// URL dinámica
export let isDynamicUrlMode = false;
try { isDynamicUrlMode = JSON.parse(localStorage.getItem(LS_KEY_DYNAMIC_URL)) ?? false; } catch { }

export let isLoadingFromSharedUrl = false;

export let dynamicUrlCheckbox;
export let dynamicUrlValueSpan;
let dynamicUrlIcon;

/**
 * Syncs the dynamic URL toggle UI with a given state.
 * UI strings remain in Spanish intentionally.
 * @param {boolean} enabled
 */
export const applyDynamicUrlState = (enabled) => {
    if (!dynamicUrlCheckbox || !dynamicUrlValueSpan || !dynamicUrlIcon) return;
    dynamicUrlCheckbox.checked = enabled;
    dynamicUrlValueSpan.textContent = enabled ? '[habilitada]' : '[deshabilitada]';
    dynamicUrlIcon.classList.toggle('text-success', enabled);
    dynamicUrlIcon.classList.toggle('text-secondary', !enabled);
};

export let musicIcon;

/**
 * Returns default channels set, adding extra defaults on desktop.
 * @param {boolean} isMobile
 * @returns {string[]}
 */
export const getDefaultChannels = (isMobile) => {
    return isMobile ? DEFAULT_CHANNELS_ARRAY : DEFAULT_CHANNELS_ARRAY.concat(EXTRA_DEFAULT_CHANNELS_ARRAY);
}

// Customization
// Number channels per row
export let numberChannelsPerRowSpan;
export let numberChannelsPerRowButtons;
// Floating buttons
export let floatingButtonsPositionButtons;
// Horizontal width
export let widthRangeInput;
export let widthRangeValue;

// Toggle full height
export let fullHeightCheckbox;
export let fullHeightSpan;





// MARK: 📫 DOMContentLoaded
window.addEventListener('DOMContentLoaded', () => {
    registerVideojsTranslation();

    // querySelector
    singleViewNoSignalIcon = document.querySelector('#icono-sin-señal-single-view');
    singleViewContainer = document.querySelector('#container-single-view');
    singleViewVideoContainer = document.querySelector('#container-video-single-view');
    gridViewContainer = document.querySelector('#container-vision-cuadricula');

    dynamicUrlCheckbox = document.querySelector('#checkbox-url-dinamica')
    dynamicUrlValueSpan = document.querySelector('#span-valor-url-dinamica');
    dynamicUrlIcon = document.querySelector('#icono-url-dinamica');

    // MARK: Customization
    // MARK: Navbar
    const navbarCheckboxEl = document.querySelector('#checkbox-personalizar-visualizacion-navbar');

    const syncNavbarVisibility = (isNavbarVisible) => {
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
        syncNavbarVisibility(navbarCheckboxEl.checked);
    });

    syncNavbarVisibility(localStorage.getItem(LS_KEY_NAVBAR_VISIBILITY) !== 'hide');

    // MARK: View mode
    const gridViewActivateButtonEl = document.querySelector('#boton-activar-diseño-vision-grid');
    const singleViewActivateButtonEl = document.querySelector('#boton-activar-diseño-single-view');

    singleViewActivateButtonEl.addEventListener('click', () => {
        if (localStorage.getItem(LS_KEY_ACTIVE_VIEW_MODE) !== 'single-view') {
            activateSingleView();
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
            deactivateSingleView();
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
    // Optimization: cache references to avoid repeated querySelector calls
    const overlayToggleCache = Array.from(overlayToggleItems).map(toggle => {
        const checkboxEl = toggle.querySelector('input[type="checkbox"]');
        const spanEl = toggle.querySelector('span');

        if (!checkboxEl || !spanEl) return null;

        const buttonConfig = OVERLAY_BUTTONS_CONFIG[checkboxEl.id];
        if (!buttonConfig) return null;

        return { checkboxEl, spanEl, buttonConfig };
    }).filter(item => item !== null);

    /**
     * Syncs overlay customization controls with persisted visibility preferences.
     */
    function updateOverlayCustomizationButtons() {
        try {
            const isOverlayVisible = localStorage.getItem(LS_KEY_OVERLAY_VISIBILITY) !== 'hide';

            // Optimization: manipulate the global class only once
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
                checkbox: overlayVisibilityCheckbox,
                statusElement: overlayVisibilityValueSpan,
                storageKey: LS_KEY_OVERLAY_VISIBILITY,
                isVisible: isOverlayVisible
            });

            hideOverlayButtonText();
        } catch (error) {
            console.error(`[teles] Error while updating overlay customization buttons. Error: ${error}`);
            showToast({
                title: 'Ha ocurrido un error durante la actualización del estado botones personalizar overlay.',
                body: `Error: ${error}`,
                type: 'danger',
            });
        }
    }

    // button for the whole overlay
    const overlayVisibilityCheckbox = document.querySelector('#checkbox-personalizar-visualizacion-overlay');
    const overlayVisibilityValueSpan = document.querySelector('#span-valor-visualizacion-overlay');
    if (overlayVisibilityCheckbox && overlayVisibilityValueSpan) {
        overlayVisibilityCheckbox.addEventListener('click', () => {
            document.body.classList.toggle('d-none__barras-overlay', !overlayVisibilityCheckbox.checked);
            syncCheckboxState({
                checkbox: overlayVisibilityCheckbox,
                statusElement: overlayVisibilityValueSpan,
                storageKey: LS_KEY_OVERLAY_VISIBILITY,
                isVisible: overlayVisibilityCheckbox.checked
            });
            updateOverlayCustomizationButtons();
        });
    }

    Object.values(OVERLAY_BUTTONS_CONFIG).forEach(button => {
        const individualButton = document.getElementById(button.id);
        if (!individualButton) return;

        individualButton.addEventListener('click', () => {
            localStorage.setItem(button.storageKey, individualButton.checked ? 'show' : 'hide');
            updateOverlayCustomizationButtons();
        });
    });

    // checkbox overlay visibility on start
    if (overlayVisibilityCheckbox && overlayVisibilityValueSpan) {
        syncCheckboxState({
            checkbox: overlayVisibilityCheckbox,
            statusElement: overlayVisibilityValueSpan,
            storageKey: LS_KEY_OVERLAY_VISIBILITY,
            isVisible:
                localStorage.getItem(LS_KEY_OVERLAY_VISIBILITY) === null
                    ? true
                    : localStorage.getItem(LS_KEY_OVERLAY_VISIBILITY) !== 'hide'
        });
    }
    updateOverlayCustomizationButtons();

    const hideOverlayButtonTextDebounced = debounce(hideOverlayButtonText, 150);
    window.addEventListener('resize', hideOverlayButtonTextDebounced); // hide text if button size exceeds container

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
                const channelSignalPreferences = JSON.parse(localStorage.getItem(LS_KEY_CHANNEL_SIGNAL_PREFERENCE)) || {};

                getActiveChannelIds().forEach(channelId => {
                    if (channelId) {
                        const channelData = channelsList?.[channelId]?.señales;
                        if (!channelData) return;

                        let signalToUse;

                        // 1. Priority: saved user preference
                        if (channelSignalPreferences[channelId]) {
                            signalToUse = Object.keys(channelSignalPreferences[channelId])[0];
                        } else {
                            // 2. Default: signal priority
                            const { iframe_url, m3u8_url, yt_id, yt_embed, yt_playlist, twitch_id } = channelData;

                            if (iframe_url?.length) signalToUse = 'iframe_url';
                            else if (m3u8_url?.length) signalToUse = 'm3u8_url';
                            else if (yt_id) signalToUse = 'yt_id';
                            else if (yt_embed) signalToUse = 'yt_embed';
                            else if (yt_playlist) signalToUse = 'yt_playlist';
                            else if (twitch_id) signalToUse = 'twitch_id';
                        }

                        if (signalToUse === 'm3u8_url') {
                            cambiarSoloSeñalActiva(channelId);
                        }

                    }
                });

            } catch (error) {
                console.error('[teles] Error reloading channels after changing m3u8 player:', error);
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
    widthRangeInput = document.querySelector('#input-range-tamaño-container-vision-cuadricula');
    widthRangeValue = document.querySelector('#span-valor-input-range');
    /**
     * Syncs horizontal width for the grid view container.
     * @param {number} [newValue] - Optional new width value.
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
        widthRangeInput.value = widthValue;
        widthRangeValue.textContent = widthPercentage;
        gridViewContainer.style.maxWidth = widthPercentage;
    };

    widthRangeInput.addEventListener('input', (event) => {
        syncHorizontalWidthValue(event.target.value)
        hideOverlayButtonTextDebounced();
    });

    syncHorizontalWidthValue();


    // MARK: Checkbox use full height
    fullHeightCheckbox = document.querySelector('#checkbox-personalizar-altura-canales');
    fullHeightSpan = document.querySelector('#span-valor-altura-canales');
    const iconElFullHeight = document.querySelector('#icono-personalizar-altura-canales');

    fullHeightCheckbox.addEventListener('click', () => {
        fullHeightCheckbox.checked
            ? (iconElFullHeight.classList.replace('bi-arrows-collapse', 'bi-arrows-vertical'),
                JSON.stringify(localStorage.setItem(LS_KEY_LAYOUT_FULL_HEIGHT_ENABLED, true)),
                fullHeightSpan.textContent = 'Expandido'
            )
            : (iconElFullHeight.classList.replace('bi-arrows-vertical', 'bi-arrows-collapse'),
                JSON.stringify(localStorage.setItem(LS_KEY_LAYOUT_FULL_HEIGHT_ENABLED, false)),
                fullHeightSpan.textContent = 'Reducido'
            );
        adjustBootstrapColumnClasses()
    });

    let isFullHeightMode = true;
    try { isFullHeightMode = JSON.parse(localStorage.getItem(LS_KEY_LAYOUT_FULL_HEIGHT_ENABLED)) ?? true; } catch { }

    if (isFullHeightMode) {
        JSON.stringify(localStorage.setItem(LS_KEY_LAYOUT_FULL_HEIGHT_ENABLED, true));
        fullHeightCheckbox.checked = true;
        iconElFullHeight.classList.replace('bi-arrows-collapse', 'bi-arrows-vertical');
        fullHeightSpan.textContent = 'Expandido';
    } else {
        fullHeightCheckbox.checked = false;
        iconElFullHeight.classList.replace('bi-arrows-vertical', 'bi-arrows-collapse');
        fullHeightSpan.textContent = 'Reducido';
    }

    // MARK: Number channels per row
    numberChannelsPerRowSpan = document.querySelector('#span-valor-transmisiones-por-fila');
    numberChannelsPerRowButtons = document.querySelectorAll('#container-botones-personalizar-transmisiones-por-fila button');

    numberChannelsPerRowButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            updateGridColumnConfiguration(btn.value)
            numberChannelsPerRowSpan.innerHTML = `${obtainNumberOfChannelsPerRow()}`
            hideOverlayButtonText()
        })
    });
    numberChannelsPerRowSpan.innerHTML = `${obtainNumberOfChannelsPerRow()}`


    // MARK: Floating buttons position
    floatingButtonsPositionButtons = document.querySelectorAll('#grupo-botones-posicion-botones-flotantes .btn-check');
    floatingButtonsPositionButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const position = btn.dataset.position.split(' ');
            handleFloatingButtonsPositionClick(...position);
        });
    });

    let floatingActionsPosition = localStorage.getItem(LS_KEY_FLOATING_BUTTONS_POSITION);
    if (floatingActionsPosition !== null) {
        const { top, start, margin, translate } = JSON.parse(floatingActionsPosition);
        updateFloatingButtons(top, start, margin, translate);
    } else {
        updateFloatingButtons('bottom-0', 'start-50', 'mb-3', 'translate-middle-x');
    }

    // MARK: Text on floating buttons
    const floatingButtonsTextCheckbox = document.querySelector('#checkbox-personalizar-texto-botones-flotantes');
    const floatingButtonsTextValueSpan = document.querySelector('#span-valor-texto-en-botones-flotante');
    const floatingButtonsTextIcon = document.querySelector('#icono-personalizar-texto-botones-flotantes');

    const floatingButtonsSpans = document.querySelectorAll('#grupo-botones-flotantes button>span');

    floatingButtonsTextCheckbox.addEventListener('click', () => {
        floatingButtonsSpans.forEach(button => {
            button.classList.toggle('d-none', !floatingButtonsTextCheckbox.checked);
        });
        syncCheckboxState({
            checkbox: floatingButtonsTextCheckbox,
            statusElement: floatingButtonsTextValueSpan,
            storageKey: LS_KEY_FLOATING_BUTTONS_TEXT_VISIBILITY,
            isVisible: floatingButtonsTextCheckbox.checked
        });
        floatingButtonsTextCheckbox.checked
            ? floatingButtonsTextIcon.classList.replace('bi-square', 'bi-info-square')
            : floatingButtonsTextIcon.classList.replace('bi-info-square', 'bi-square');
    });

    if (localStorage.getItem(LS_KEY_FLOATING_BUTTONS_TEXT_VISIBILITY) !== 'hide') {
        syncCheckboxState({
            checkbox: floatingButtonsTextCheckbox,
            statusElement: floatingButtonsTextValueSpan,
            storageKey: LS_KEY_FLOATING_BUTTONS_TEXT_VISIBILITY,
            isVisible: true
        });
        floatingButtonsTextIcon.classList.replace('bi-square', 'bi-info-square');
    } else {
        floatingButtonsSpans.forEach((button) => {
            button.classList.toggle('d-none', !floatingButtonsTextCheckbox.checked);
        });
        syncCheckboxState({
            checkbox: floatingButtonsTextCheckbox,
            statusElement: floatingButtonsTextValueSpan,
            storageKey: LS_KEY_FLOATING_BUTTONS_TEXT_VISIBILITY,
            isVisible: false
        });
        floatingButtonsTextIcon.classList.replace('bi-info-square', 'bi-square');
    }


    // MARK: Dynamic URL
    dynamicUrlCheckbox?.addEventListener('click', () => {
        isDynamicUrlMode = dynamicUrlCheckbox.checked;
        localStorage.setItem(LS_KEY_DYNAMIC_URL, JSON.stringify(isDynamicUrlMode));
        applyDynamicUrlState(isDynamicUrlMode);

        isDynamicUrlMode ? syncActiveChannelsParameter() : clearSharedUrlParameter(true);
    });
    applyDynamicUrlState(isDynamicUrlMode);


    const mergeCustomListsCheckboxEl = document.querySelector('#checkbox-combinar-listas-personalizadas');
    const mergeCustomListsValueSpanEl = document.querySelector('#span-valor-combinar-listas-personalizadas');

    /**
     * Initializes and syncs the toggle for merging similar channels between custom lists.
     */
    function initMergeCustomListsPreference() {
        if (!mergeCustomListsCheckboxEl || !mergeCustomListsValueSpanEl) { return }

        const getStateLabel = (state) => state ? 'Combinar coincidencias' : 'Mantener listas separadas';

        const applyState = (state) => {
            mergeCustomListsCheckboxEl.checked = state;
            mergeCustomListsValueSpanEl.textContent = getStateLabel(state);
        };

        const initialState = getCombineChannelsPreference();
        applyState(initialState);

        mergeCustomListsCheckboxEl.addEventListener('change', async () => {
            const newState = mergeCustomListsCheckboxEl.checked;
            setCombineChannelsPreference(newState);
            applyState(newState);

            try {
                showToast({
                    body: 'Actualizando listado de canales...',
                    type: 'dark',
                    duration: 2000
                });

                // 0. Capture active channels before the change (avoid duplicates)
                const activeGridChannels = getActiveChannelIds();
                const activeSingleChannel = singleViewVideoContainer.querySelector('div[data-canal]')?.dataset.canal;

                // 1. Reload base channels (resets defaults)
                await restoreChannelsFromMemory();

                // 2. Restore personalized lists with the new preference
                restorePersonalizedLists();

                // 3. Re-render UI
                createChannelButtons(channelsList);

                // Update additional lists to ensure consistency
                createButtonsForChangeChannelModal(channelsList);
                createButtonsForSingleView(channelsList);

                saveOriginalOrder(); // Update base order for sorting features

                // 4. Refresh active channels (Grid View)
                if (activeGridChannels.length > 0) {
                    activeGridChannels.forEach(channelId => {
                        if (tele && channelsList[channelId]) {
                            tele.remove(channelId);
                            tele.add(channelId);
                        } else if (tele) {
                            tele.remove(channelId);
                        }
                    });
                }

                // 5. Refresh active channel (Single View)
                if (activeSingleChannel) {
                    if (tele && channelsList[activeSingleChannel]) {
                        tele.remove(activeSingleChannel);
                        tele.add(activeSingleChannel);
                    } else if (tele) {
                        tele.remove(activeSingleChannel);
                    }
                }

                showToast({
                    body: 'Listado y canales activos actualizados correctamente',
                    type: 'success'
                });

            } catch (error) {
                console.error('[teles] Error updating list after preference change', error);
                showToast({
                    title: 'Error',
                    body: 'No se pudo actualizar el listado inmediatamente. Recarga la página.',
                    type: 'danger'
                });
            }
        }, { once: false });
    }

    initMergeCustomListsPreference();


    renderPersonalizedListsUI();


    const loadCustomListButtonEl = document.querySelector('#boton-cargar-lista-personalizada');
    const customListUrlInputEl = document.querySelector('#input-url-lista-personalizada');
    if (loadCustomListButtonEl && customListUrlInputEl) {
        const originalButtonText = loadCustomListButtonEl.innerHTML;
        const toggleLoadingStateButton = (isLoading) => {
            if (isLoading) {
                loadCustomListButtonEl.disabled = true;
                loadCustomListButtonEl.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span> Cargando...';
            } else {
                loadCustomListButtonEl.disabled = false;
                loadCustomListButtonEl.innerHTML = originalButtonText;
            }
        };

        loadCustomListButtonEl.addEventListener('click', async () => {
            const listUrl = customListUrlInputEl.value.trim();
            if (!listUrl) {
                showToast({
                    body: 'Ingresa la URL a tu archivo .m3u antes de cargarla.',
                    type: 'warning'
                });
                customListUrlInputEl.focus();
                return;
            }

            try {
                new URL(listUrl);
            } catch {
                showToast({
                    title: 'La URL ingresada no es válida.',
                    body: 'Verifica que comience con https://',
                    type: 'danger'
                });
                customListUrlInputEl.focus();
                return;
            }

            toggleLoadingStateButton(true);
            try {
                await loadPersonalizedM3UList(listUrl);
                clearChannelListContainers();
                createChannelButtons();
                createCountryButtons();
                createCategoryButtons();
                resyncActiveChannelsVisualState();
                initializeBootstrapTooltips();

                renderPersonalizedListsUI();
                showToast({
                    title: 'Lista personalizada cargada correctamente.',
                    body: 'Los nuevos canales se añadieron a su lista.',
                    type: 'success'
                });
            } catch (error) {
                console.error('[teles] Error loading personalized M3U list:', error);
                showToast({
                    title: 'No fue posible cargar la lista personalizada.',
                    body: `Verifica la URL o si el servidor permite descargas (CORS). <br> Error: ${error}`,
                    type: 'danger',
                    autohide: false,
                    delay: 0,
                    allowHtml: true
                });
            } finally {
                toggleLoadingStateButton(false);
            }
        });
    }

    const pasteCustomListButtonEl = document.querySelector('#boton-pegar-lista-personalizada');
    const customListTextareaEl = document.querySelector('#textarea-lista-personalizada');

    if (pasteCustomListButtonEl && customListTextareaEl) {
        const originalPasteButtonText = pasteCustomListButtonEl.innerHTML;
        const togglePasteButton = (isLoading) => {
            if (isLoading) {
                pasteCustomListButtonEl.disabled = true;
                pasteCustomListButtonEl.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span> Procesando...';
            } else {
                pasteCustomListButtonEl.disabled = false;
                pasteCustomListButtonEl.innerHTML = originalPasteButtonText;
            }
        };

        pasteCustomListButtonEl.addEventListener('click', async () => {
            const listContent = customListTextareaEl.value.trim();
            if (!listContent) {
                showToast({
                    body: 'Pega el contenido completo de tu archivo .m3u antes de continuar.',
                    type: 'warning'
                });
                customListTextareaEl.focus();
                return;
            }

            togglePasteButton(true);
            try {
                const manualLabel = `Lista manual ${new Date().toLocaleString('es-CL', { dateStyle: 'short', timeStyle: 'short' })}`;
                await loadPersonalizedListFromText(listContent, { etiqueta: manualLabel });
                customListTextareaEl.value = '';
                clearChannelListContainers();
                createChannelButtons();
                createCountryButtons();
                createCategoryButtons();
                resyncActiveChannelsVisualState();

                renderPersonalizedListsUI();
                showToast({
                    title: 'Lista manual cargada correctamente.',
                    body: 'Se añadieron los nuevos canales a su lista.',
                    type: 'success'
                });
            } catch (error) {
                console.error('[teles] Error processing manually pasted list:', error);
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
                togglePasteButton(false);
            }
        });
    }

    // MARK: Background card
    const logoCardBackgroundCheckbox = document.querySelector('#checkbox-tarjeta-logo-background');
    const logoCardBackgroundValueSpan = document.querySelector('#span-valor-visualizacion-tarjeta-logo-background');
    const logoCardBackgroundIcon = document.querySelector('#icono-personalizar-visualizacion-tarjeta-logo-background');
    const logoCardBackgroundContainer = document.querySelector('#container-tarjeta-logo-background');

    logoCardBackgroundCheckbox.addEventListener('click', () => {
        logoCardBackgroundContainer.classList.toggle('d-none', !logoCardBackgroundCheckbox.checked);
        syncCheckboxState({
            checkbox: logoCardBackgroundCheckbox,
            statusElement: logoCardBackgroundValueSpan,
            storageKey: LS_KEY_LOGO_CARD_BACKGROUND_VISIBILITY,
            isVisible: logoCardBackgroundCheckbox.checked
        });

        logoCardBackgroundCheckbox.checked ? logoCardBackgroundIcon.classList.replace('bi-eye-slash', 'bi-eye') : logoCardBackgroundIcon.classList.replace('bi-eye', 'bi-eye-slash');

        if (!AMBIENT_MUSIC.paused && !logoCardBackgroundCheckbox.checked) {
            AMBIENT_MUSIC.pause();
            musicIcon.classList.replace('bi-pause-fill', 'bi-play-fill');
        }
    });

    let logoCardBackgroundState = localStorage.getItem(LS_KEY_LOGO_CARD_BACKGROUND_VISIBILITY) ?? 'show';
    if (logoCardBackgroundState !== 'hide') {
        syncCheckboxState({
            checkbox: logoCardBackgroundCheckbox,
            statusElement: logoCardBackgroundValueSpan,
            storageKey: LS_KEY_LOGO_CARD_BACKGROUND_VISIBILITY,
            isVisible: true
        })
        logoCardBackgroundContainer.classList.toggle('d-none', !logoCardBackgroundCheckbox.checked);
        logoCardBackgroundIcon.classList.replace('bi-eye-slash', 'bi-eye');
    } else {
        syncCheckboxState({
            checkbox: logoCardBackgroundCheckbox,
            statusElement: logoCardBackgroundValueSpan,
            storageKey: LS_KEY_LOGO_CARD_BACKGROUND_VISIBILITY,
            isVisible: false
        })
        logoCardBackgroundContainer.classList.toggle('d-none', !logoCardBackgroundCheckbox.checked);
        logoCardBackgroundIcon.classList.replace('bi-eye', 'bi-eye-slash');
    }

    // MARK: Ambient music
    const toggleButton = document.querySelector('#ambient-music-toggle');
    const volumeSlider = document.querySelector('#ambient-music-volume');
    musicIcon = document.querySelector('#music-icon');

    toggleButton.addEventListener('click', () => {
        if (AMBIENT_MUSIC.paused) {
            AMBIENT_MUSIC.play().catch(e => console.error('[teles] Error playing audio:', e));
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

    // MARK: 🟢 Initial load
    /**
     * Performs initial channel load and restores personalized lists.
     * Keeps user-facing strings in Spanish to avoid UX changes.
     */
    async function initialLoad() {
        try {
            await fetchLoadChannels();
            if (channelsList) {
                const restoredLists = restorePersonalizedLists();
                createChannelButtons();
                createCountryButtons();
                createCategoryButtons();
                deleteInvalidSignalPreferences();

                const currentUrl = new URL(window.location.href);
                const sharedParam = currentUrl.searchParams.get('c');
                const totalRequestedChannels = sharedParam
                    ? sharedParam
                        .split(',')
                        .map(id => id.trim())
                        .filter(id => id.length > 0).length
                    : 0;

                const sharedChannels = getChannelsFromUrl();

                if (sharedChannels.length > 0) {

                    isLoadingFromSharedUrl = true;

                    if (localStorage.getItem(LS_KEY_ACTIVE_VIEW_MODE) === 'single-view') {
                        deactivateSingleView({ skipDefaultChannelsLoad: true });
                        singleViewActivateButtonEl.classList.replace(CSS_CLASS_BUTTON_PRIMARY, 'btn-light-subtle');
                        localStorage.setItem(LS_KEY_ACTIVE_VIEW_MODE, 'grid-view');
                    }
                    sharedChannels.forEach(canalId => tele.add(canalId));
                    isLoadingFromSharedUrl = false;

                    if (totalRequestedChannels > sharedChannels.length) {
                        const difference = totalRequestedChannels - sharedChannels.length;
                        showToast({
                            title: 'Canales omitidos al cargar desde URL',
                            body: `No todos los canales compartidos se pudieron cargar 
                                (se cargaron ${sharedChannels.length} de ${totalRequestedChannels}). 
                                Es posible que algunos provengan de listas personalizadas o modos 
                                que no están disponibles en este navegador.`,
                            type: 'info'
                        });
                        console.info('[teles] Omited channels from URL', {
                            totalSolicitados: totalRequestedChannels,
                            totalCargados: sharedChannels.length,
                            faltantes: difference
                        });
                    }
                } else {

                    if (localStorage.getItem(LS_KEY_ACTIVE_VIEW_MODE) === 'single-view') {
                        activateSingleView();
                        singleViewActivateButtonEl.classList.replace('btn-light-subtle', CSS_CLASS_BUTTON_PRIMARY);
                        gridViewActivateButtonEl.classList.replace(CSS_CLASS_BUTTON_PRIMARY, 'btn-light-subtle');
                    } else {
                        tele.loadDefaultChannels();
                    }
                }

                /// actualizarBotonesPersonalizarOverlay()

                const lsBootstrapColNumber =
                    JSON.parse(localStorage.getItem(LS_KEY_BOOTSTRAP_COL_NUMBER)) ??
                    (isMobile.any ? BOOTSTRAP_COL_NUMBER_MOBILE : BOOTSTRAP_COL_NUMBER_DESKTOP);
                updateGridColumnConfiguration(lsBootstrapColNumber);
                hideOverlayButtonText()
                initializeBootstrapTooltips();

                if (restoredLists > 0) {
                    renderPersonalizedListsUI();
                }
            }
        } catch (error) {
            console.error('[teles] Error during initial load', error);
            showToast({
                title: 'Error durante carga inicial',
                body: `Error: ${error}`,
                type: 'danger',
                showReloadOnError: true
            });
            return
        }
    }
    initialLoad();

    adjustVisibilityButtonsRemoveAllActiveChannels()

    // Glow effect on background logo hover
    const TARJETA_LOGO_BACKGROUND = document.querySelector('.tarjeta-logo-background');
    TARJETA_LOGO_BACKGROUND.onmousemove = e => {
        let rect = TARJETA_LOGO_BACKGROUND.getBoundingClientRect(),
            x = e.clientX - rect.left,
            y = e.clientY - rect.top;
        TARJETA_LOGO_BACKGROUND.style.setProperty('--mouse-x', `${x}px`);
        TARJETA_LOGO_BACKGROUND.style.setProperty('--mouse-y', `${y}px`);
    };

    screen.orientation.addEventListener('change', () => {
        if (localStorage.getItem(LS_KEY_ACTIVE_VIEW_MODE) !== 'single-view') adjustBootstrapColumnClasses();
    });

    document.addEventListener('hidden.bs.toast', event => {
        event.target.remove()
    });

    // MARK: others
    // plugin to move channels in grid
    new Sortable(gridViewContainer, {
        animation: 350,
        handle: '.clase-para-mover',
        easing: "cubic-bezier(.17,.67,.83,.67)",
        ghostClass: 'marca-al-mover',
        onStart: () => {
            disposeBootstrapTooltips(); // evitamos tooltips flotando al mover
        },
        onEnd: () => {
            initializeBootstrapTooltips();
            saveChannelsToLocalStorage();
            registerManualChannelChange();
        }
    });


    singleViewGrid = document.querySelector('.single-view-grid');
    new Sortable(singleViewGrid, {
        animation: 350,
        handle: '.clase-para-mover',
        easing: "cubic-bezier(.17,.67,.83,.67)",
        ghostClass: 'marca-al-mover',
        swapThreshold: 0.30,
        onStart: () => {
            try {
                disposeBootstrapTooltips();
            } catch (e) {
                console.error('[teles] Error in Sortable onStart:', e);
            }
        },
        onChange: () => {
            try {
                toggleOrderedClass();
            } catch (e) {
                console.error('[teles] Error in Sortable onChange:', e);
            }
        },
        onEnd: () => {
            try {
                saveSingleViewPanelsOrder();
                initializeBootstrapTooltips();
                toggleOrderedClass();
                registerManualChannelChange();
            } catch (e) {
                console.error('[teles] Error in Sortable onEnd:', e);
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
                adjustBootstrapColumnClasses?.();
                adjustVisibilityButtonsRemoveAllActiveChannels?.();
            } catch (e) {
                console.error('[teles] Error in mutation observer', e);
            }
        });
    });

    const OBSERVER_CONFIG = {
        childList: true,
        subtree: false,
        attributes: false,
        characterData: false
    };

    if (gridViewContainer) {
        OBSERVER.observe(gridViewContainer, OBSERVER_CONFIG);
    }
});

// MARK: 📺 Channel management
/**
 * Public channel controller used across UI modules.
 */
export let tele = {
    /**
     * Adds a channel to the current view (grid or single view).
     * @param {string} channelId - Channel identifier key in channelsList.
     */
    add: (channelId) => {
        try {
            if (!channelId || !channelsList?.[channelId]) return console.error(`[teles] The channel "${channelId}" provided is not valid to be added.`);
            const channelContainer = document.createElement('div');
            channelContainer.setAttribute('data-canal', channelId);
            const isSingleView = localStorage.getItem(LS_KEY_ACTIVE_VIEW_MODE) === 'single-view';

            if (isSingleView) {
                // Single view must have at most one active channel.
                const channelInUse = singleViewVideoContainer?.querySelector('div[data-canal]');
                if (channelInUse && channelInUse.dataset.canal && channelInUse.dataset.canal !== channelId) {
                    tele.remove(channelInUse.dataset.canal);
                }

                channelContainer.classList.add('position-relative', 'shadow', 'h-100', 'w-100');
                channelContainer.append(crearFragmentCanal(channelId));
                singleViewVideoContainer.append(channelContainer);
                singleViewNoSignalIcon.classList.add('d-none');
            } else {
                channelContainer.classList.add('position-relative', 'shadow');
                channelContainer.append(crearFragmentCanal(channelId));
                gridViewContainer.append(channelContainer);
                saveChannelsToLocalStorage();
            }
            adjustChannelButtonClass(channelId, true);
            initializeBootstrapTooltips();
            hideOverlayButtonText();
            registerManualChannelChange();
            adjustBootstrapColumnClasses();
        } catch (error) {
            console.error(`[teles] Error while creating channel container id: ${channelId}. Error: ${error}`);
            showToast({
                title: `Ha ocurrido un error durante la creación canal para ser insertado - ID: ${channelId}.`,
                body: `Error: ${error}`,
                type: 'danger',
                autohide: false,
                delay: 0,
                showReloadOnError: true
            })
            return
        }
    },
    /**
     * Removes a channel from the current view.
     * @param {string} channelId - Channel identifier key in channelsList.
     */
    remove: (channelId) => {
        try {
            if (!channelId) return console.error(`[teles] The channel "${channelId}" provided is not valid for removal.`);
            let transmissionToRemove = document.querySelector(`div[data-canal="${channelId}"]`);

            if (!transmissionToRemove) {
                adjustChannelButtonClass(channelId, false);
                return;
            }

            // Clean resources before removing the container; iframe, videojs, clappr, oplayer
            cleanTransmissionResources(transmissionToRemove);
            // Remove tooltips; floating overlay buttons
            disposeBootstrapTooltips();
            // Remove container from DOM
            transmissionToRemove.remove();


            // If single view, show the no-signal icon
            if (localStorage.getItem(LS_KEY_ACTIVE_VIEW_MODE) === 'single-view') {
                singleViewNoSignalIcon.classList.remove('d-none');
            } else {
                saveChannelsToLocalStorage();
            }

            adjustChannelButtonClass(channelId, false);
            initializeBootstrapTooltips();
            registerManualChannelChange();
        } catch (error) {
            console.error(`[teles] Error while removing channel container id: ${channelId}. Error: ${error}`);
            showToast({
                title: `Ha ocurrido un error durante la eliminación canal - ID: ${channelId}.`,
                body: `Error: ${error}`,
                type: 'danger',
                autohide: false,
                delay: 0,
                showReloadOnError: true
            })
            return
        }
    },
    /**
     * Loads default channels either from stored state or the predefined list.
     */
    loadDefaultChannels: () => {
        let savedChannels = JSON.parse(localStorage.getItem(LS_KEY_SAVED_CHANNELS_GRID_VIEW)) || {};
        // Default
        if (Object.keys(savedChannels).length === 0 && localStorage.getItem(LS_KEY_WELCOME_MODAL_VISIBILITY) !== 'hide') {
            getDefaultChannels(isMobile.any).forEach(channelId => tele.add(channelId));
            new bootstrap.Modal(document.querySelector('#modal-bienvenida')).show();
            // Check saved    
        } else {
            try {
                Object.keys(savedChannels).forEach(channelId => {
                    if (areAllSignalsEmpty(channelId)) {
                        document.querySelectorAll(`button[data-canal="${channelId}"]`).forEach(buttonEl => {
                            buttonEl.classList.add('d-none');
                        });
                        showToast({
                            title: `Canal ${channelId} sin señales activas.`,
                            body: 'Se eliminará del listado.',
                            type: 'warning'
                        });
                    } else {
                        tele.add(channelId);
                    }
                });
            } catch (error) {
                console.error(`[teles] Error while loading default channels. Error: ${error}`);
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