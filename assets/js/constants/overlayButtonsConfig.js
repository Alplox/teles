import {
    LS_KEY_OVERLAY_BUTTON_SELECT_SIGNAL,
    LS_KEY_OVERLAY_BUTTON_MOVE,
    LS_KEY_OVERLAY_BUTTON_CHANGE,
    LS_KEY_OVERLAY_BUTTON_SOURCE,
    LS_KEY_OVERLAY_BUTTON_REMOVE
} from './localStorageKeys.js';

/**
 * Configuration for each overlay personalization button, including the storage key
 * to persist its visibility state and the modifier used by helper classes.
 */
export const OVERLAY_BUTTONS_CONFIG = {
    btnSelecionarSeñal: {
        storageKey: LS_KEY_OVERLAY_BUTTON_SELECT_SIGNAL,
        classSuffix: 'overlay-boton-selecionar-señal',
        id: 'btnSelecionarSeñal'
    },
    btnMover: {
        storageKey: LS_KEY_OVERLAY_BUTTON_MOVE,
        classSuffix: 'overlay-boton-mover',
        id: 'btnMover'
    },
    btnCambiar: {
        storageKey: LS_KEY_OVERLAY_BUTTON_CHANGE,
        classSuffix: 'overlay-boton-cambiar',
        id: 'btnCambiar'
    },
    btnFuente: {
        storageKey: LS_KEY_OVERLAY_BUTTON_SOURCE,
        classSuffix: 'overlay-boton-pagina-oficial',
        id: 'btnFuente'
    },
    btnQuitar: {
        storageKey: LS_KEY_OVERLAY_BUTTON_REMOVE,
        classSuffix: 'overlay-boton-quitar',
        id: 'btnQuitar'
    }
};
