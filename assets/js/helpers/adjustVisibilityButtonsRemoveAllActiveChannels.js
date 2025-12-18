import {
    BUTTON_MODAL_REMOVE_ALL_ACTIVE_CHANNELS,
    BUTTON_OFFCANVAS_REMOVE_ALL_ACTIVE_CHANNELS,
    BUTTON_MODAL_LOAD_DEFAULT_CHANNELS,
    BUTTON_OFFCANVAS_LOAD_DEFAULT_CHANNELS,
    BOTON_COPIAR_ENLACE_COMPARTIR_SETUP
} from '../botones.js'
import { AMBIENT_MUSIC, LS_KEY_ACTIVE_VIEW_MODE, LS_KEY_LOGO_CARD_BACKGROUND_VISIBILITY } from '../constants/index.js';
import { musicIcon } from '../main.js';
import { getActiveChannelIds } from './index.js';

/**
 * Adjust the visibility of the buttons to remove all active channels.
 */
export const adjustVisibilityButtonsRemoveAllActiveChannels = () => {
    const hasActiveChannels = getActiveChannelIds().length > 0;

    // Buttons remove all active channels
    [BUTTON_MODAL_REMOVE_ALL_ACTIVE_CHANNELS, BUTTON_OFFCANVAS_REMOVE_ALL_ACTIVE_CHANNELS].forEach(btn => {
        btn?.classList.toggle('d-none', !hasActiveChannels);
    });

    BOTON_COPIAR_ENLACE_COMPARTIR_SETUP.disabled = !hasActiveChannels;
    BOTON_COPIAR_ENLACE_COMPARTIR_SETUP.innerHTML = hasActiveChannels ? 'Copiar setup <i class="bi bi-clipboard"></i>' : 'Activa primero canales';

    // si es vision cuadrícula
    if (localStorage.getItem(LS_KEY_ACTIVE_VIEW_MODE) !== 'single-view' && localStorage.getItem(LS_KEY_LOGO_CARD_BACKGROUND_VISIBILITY) !== 'hide') {
        if (!hasActiveChannels && AMBIENT_MUSIC.paused && document.querySelector('#alerta-borrado-localstorage').classList.contains('d-none')) {
            AMBIENT_MUSIC.loop = true;
            AMBIENT_MUSIC.play()
                .then(() => {
                    musicIcon.classList.replace('bi-play-fill', 'bi-pause-fill');
                })
                .catch(() => { });

        } else {
            AMBIENT_MUSIC.pause()
            musicIcon.classList.replace('bi-pause-fill', 'bi-play-fill');
        }
    }

    // Buttons load default channels
    [BUTTON_MODAL_LOAD_DEFAULT_CHANNELS, BUTTON_OFFCANVAS_LOAD_DEFAULT_CHANNELS].forEach(btn => {
        btn?.classList.toggle('d-none', hasActiveChannels);
    });
};