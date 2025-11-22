/**
 * Libera instancias de reproductores antes de eliminar el contenedor del DOM.
 * @param {HTMLElement|null} contenedorTransmision Elemento <div data-canal> que aloja la transmisión.
 * @returns {void}
 */
export const limpiarRecursosTransmision = (contenedorTransmision) => {
    if (!contenedorTransmision) return;

    const contenedorCambio = contenedorTransmision.querySelector('div[data-canal-cambio]');
    const canal = contenedorTransmision?.dataset?.canal;

    if (contenedorCambio?._videojsPlayer && typeof contenedorCambio._videojsPlayer.dispose === 'function') {
        try {
            const player = contenedorCambio._videojsPlayer;
            if (player && typeof player.dispose === 'function') {
                player.dispose();
            }
        } catch (errorVideojs) {
            console.error(`Error al destruir Video.js para canal "${canal}":`, errorVideojs);
        }
    }

    if (contenedorCambio?._clapprPlayer && typeof contenedorCambio._clapprPlayer.destroy === 'function') {
        try {
            contenedorCambio._clapprPlayer.destroy();
        } catch (errorClappr) {
            console.error(`Error al destruir Clappr para canal "${canal}":`, errorClappr);
        }
    }

    if (contenedorCambio?._oplayerPlayer && typeof contenedorCambio._oplayerPlayer.destroy === 'function') {
        try {
            contenedorCambio._oplayerPlayer.destroy();
        } catch (errorOplayer) {
            console.error(`Error al destruir OPlayer para canal "${canal}":`, errorOplayer);
        }
    }

    if (contenedorCambio?._iframeElement && typeof contenedorCambio._iframeElement.remove === 'function') {
        try {
            contenedorCambio._iframeElement.src = 'about:blank';
            contenedorCambio._iframeElement.removeAttribute('srcdoc');
            contenedorCambio._iframeElement.remove();
        } catch (error) {
            console.error(`Error al destruir iframe para canal "${canal}":`, error);
        }
    }
};