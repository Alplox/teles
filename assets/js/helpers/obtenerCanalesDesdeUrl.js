import { channelsList } from "../canalesData.js";
import { LS_KEY_ACTIVE_VIEW_MODE, LS_KEY_SAVED_CHANNELS_GRID_VIEW } from "../constants/index.js";
import { estaCargandoDesdeUrlCompartida, isDynamicUrlMode } from "../main.js";

let parametroCompartidoLimpio = false;

export const limpiarParametroCompartidoEnUrl = (forzar = false) => {
    try {
        const url = new URL(window.location.href);

        // Si no estamos forzando y no hay parámetro 'c', no hacemos nada.
        // Esto reemplaza el chequeo de urlCompartidaActiva
        if (!forzar && !url.searchParams.has('c')) return;

        if (!url.searchParams.has('c')) {
            parametroCompartidoLimpio = true;
            return;
        }

        url.searchParams.delete('c');
        window.history.replaceState({}, document.title, url.toString());
        parametroCompartidoLimpio = true;

    } catch (error) {
        console.error('[teles] Error al limpiar parámetro compartido de la URL:', error);
    }
};

export const obtenerIdsCanalesActivos = () => {
    try {
        const payload = localStorage.getItem(LS_KEY_SAVED_CHANNELS_GRID_VIEW);
        if (!payload) return [];
        const datos = JSON.parse(payload);
        if (!datos || typeof datos !== 'object') return [];
        return Object.keys(datos);
    } catch (error) {
        console.error('[teles] Error al obtener canales activos para URL dinámica:', error);
        return [];
    }
};

export const sincronizarParametroCanalesActivos = () => {
    if (!isDynamicUrlMode) return;
    // En visión única nunca se debe tocar el parámetro `c` aunque la preferencia esté activa.
    if (localStorage.getItem(LS_KEY_ACTIVE_VIEW_MODE) === 'single-view') return;
    try {
        const urlActual = new URL(window.location.href);
        const idsActivos = obtenerIdsCanalesActivos();

        if (!idsActivos.length) {
            urlActual.searchParams.delete('c');
        } else {
            urlActual.searchParams.set('c', idsActivos.join(','));
        }

        window.history.replaceState({}, document.title, urlActual.toString());
        parametroCompartidoLimpio = true;
    } catch (error) {
        console.error('[teles] Error al sincronizar URL dinámica:', error);
    }
};

/**
 * Gestiona los cambios manuales realizados por usuario sobre los canales activos
 * (añadir/quitar, mover de posición, etc.) y decide si sincronizar o limpiar el parámetro `c`.
 * Respeta el flujo de carga inicial desde una URL compartida para no interferir.
 * @param {{ forzar?: boolean }} [opciones]
 * @returns {void}
 */
export const registrarCambioManualCanales = ({ forzar = false } = {}) => {
    if (!forzar && estaCargandoDesdeUrlCompartida) return;

    // En modo "visión única" no usamos la URL dinámica ni el parámetro `c`.
    if (localStorage.getItem(LS_KEY_ACTIVE_VIEW_MODE) === 'single-view') return;

    isDynamicUrlMode ? sincronizarParametroCanalesActivos() : limpiarParametroCompartidoEnUrl(true);
}


/**
   * Obtiene la lista de IDs de canales compartidos a través del parámetro `c` en la URL.
   * El formato esperado es una lista separada por comas, por ejemplo: ?c=24-horas,meganoticias,t13
   * @returns {string[]} Arreglo de IDs de canales válidos.
   */
export const obtenerCanalesDesdeUrl = () => {
    try {
        const url = new URL(window.location.href);
        const param = url.searchParams.get('c');
        if (!param) return [];

        return param
            .split(',')
            .map(id => id.trim())
            .filter(id => id.length > 0 && channelsList?.[id]);
    } catch (error) {
        console.error('[teles] Error al leer canales compartidos desde la URL:', error);
        return [];
    }
}