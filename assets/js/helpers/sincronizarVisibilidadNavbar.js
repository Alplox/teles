import { LS_KEY_NAVBAR_VISIBILITY } from "../constants/localStorageKeys.js";
import { CHECKBOX_PERSONALIZAR_VISUALIZACION_NAVBAR, MAIN_NAVBAR, SPAN_VALOR_CHECKBOX_PERSONALIZAR_VISUALIZACION_NAVBAR } from "../main.js";
import { setCheckboxState } from "./helperCheckboxState.js";

/**
 * Sincroniza la visibilidad del navbar, el estado del checkbox y la preferencia persistida.
 * @param {boolean} isVisible - Define si el navbar debe mostrarse.
 */
export const sincronizarVisibilidadNavbar = (isVisible) => {
    if (!MAIN_NAVBAR || !CHECKBOX_PERSONALIZAR_VISUALIZACION_NAVBAR || !SPAN_VALOR_CHECKBOX_PERSONALIZAR_VISUALIZACION_NAVBAR) {
        console.warn('[teles] No se pudo sincronizar el estado del navbar: faltan elementos requeridos.');
        return;
    }

    MAIN_NAVBAR.classList.toggle('d-none', !isVisible);
    setCheckboxState(
        CHECKBOX_PERSONALIZAR_VISUALIZACION_NAVBAR,
        SPAN_VALOR_CHECKBOX_PERSONALIZAR_VISUALIZACION_NAVBAR,
        LS_KEY_NAVBAR_VISIBILITY,
        isVisible
    );
};