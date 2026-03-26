/**
 * Releases player instances before removing the container from the DOM.
 * @param {HTMLElement|null} transmissionContainer <div data-canal> element that hosts the transmission.
 * @returns {void}
 */
export const cleanTransmissionResources = (transmissionContainer) => {
    if (!transmissionContainer) return;

    const changeContainer = transmissionContainer.querySelector('div[data-canal-cambio]');
    const channelId = transmissionContainer?.dataset?.canal;

    if (changeContainer?._videojsPlayer && typeof changeContainer._videojsPlayer.dispose === 'function') {
        try {
            const player = changeContainer._videojsPlayer;
            if (player && typeof player.dispose === 'function') {
                player.dispose();
            }
        } catch (errorVideojs) {
            console.error(`[teles] Error destroying Video.js for channel "${channelId}":`, errorVideojs);
        }
    }

    if (changeContainer?._clapprPlayer && typeof changeContainer._clapprPlayer.destroy === 'function') {
        try {
            changeContainer._clapprPlayer.destroy();
        } catch (errorClappr) {
            console.error(`[teles] Error destroying Clappr for channel"${channelId}":`, errorClappr);
        }
    }

    if (changeContainer?._oplayerPlayer && typeof changeContainer._oplayerPlayer.destroy === 'function') {
        try {
            changeContainer._oplayerPlayer.destroy();
        } catch (errorOplayer) {
            console.error(`[teles] Error destroying OPlayer for channel"${channelId}":`, errorOplayer);
        }
    }

    if (changeContainer?._shakaPlayer && typeof changeContainer._shakaPlayer.destroy === 'function') {
        try {
            if (changeContainer._shakaUi && typeof changeContainer._shakaUi.destroy === 'function') {
                changeContainer._shakaUi.destroy();
            }
            changeContainer._shakaPlayer.destroy();
        } catch (errorShaka) {
            console.error(`[teles] Error destroying Shaka Player/UI for channel"${channelId}":`, errorShaka);
        }
    }

    if (changeContainer?._iframeElement && typeof changeContainer._iframeElement.remove === 'function') {
        try {
            changeContainer._iframeElement.src = 'about:blank';
            changeContainer._iframeElement.removeAttribute('srcdoc');
            changeContainer._iframeElement.remove();
        } catch (error) {
            console.error(`[teles] Error destroying iframe for channel"${channelId}":`, error);
        }
    }
};
