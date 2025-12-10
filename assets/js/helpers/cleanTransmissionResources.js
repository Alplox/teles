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
            console.error(`Error destroying Video.js for channel "${channelId}":`, errorVideojs);
        }
    }

    if (changeContainer?._clapprPlayer && typeof changeContainer._clapprPlayer.destroy === 'function') {
        try {
            changeContainer._clapprPlayer.destroy();
        } catch (errorClappr) {
            console.error(`Error destroying Clappr for channel "${channelId}":`, errorClappr);
        }
    }

    if (changeContainer?._oplayerPlayer && typeof changeContainer._oplayerPlayer.destroy === 'function') {
        try {
            changeContainer._oplayerPlayer.destroy();
        } catch (errorOplayer) {
            console.error(`Error destroying OPlayer for channel "${channelId}":`, errorOplayer);
        }
    }

    if (changeContainer?._iframeElement && typeof changeContainer._iframeElement.remove === 'function') {
        try {
            changeContainer._iframeElement.src = 'about:blank';
            changeContainer._iframeElement.removeAttribute('srcdoc');
            changeContainer._iframeElement.remove();
        } catch (error) {
            console.error(`Error destroying iframe for channel "${channelId}":`, error);
        }
    }
};
