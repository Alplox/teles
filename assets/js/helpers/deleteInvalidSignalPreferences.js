import { channelsList } from "../channelManager.js";
import { LS_KEY_CHANNEL_SIGNAL_PREFERENCE } from "../constants/localStorageKeys.js";
import { areAllSignalsEmpty, showToast } from "./index.js";
import { readJson, writeJson } from "../utils/safeStorage.js";

export const deleteInvalidSignalPreferences = () => {
    let lsSignalPreferences = readJson(LS_KEY_CHANNEL_SIGNAL_PREFERENCE, {});
    if (typeof lsSignalPreferences !== 'object' || lsSignalPreferences === null || Array.isArray(lsSignalPreferences)) {
        lsSignalPreferences = {};
    }
    if (Object.keys(lsSignalPreferences).length !== 0) {
        for (const SAVED_CHANNEL_ID in lsSignalPreferences) {
            let signalType = Object.keys(lsSignalPreferences[SAVED_CHANNEL_ID])[0].toString();
            let signalIndex = Number(Object.values(lsSignalPreferences[SAVED_CHANNEL_ID]));

            if (!areAllSignalsEmpty(SAVED_CHANNEL_ID)) {
                const channel = channelsList?.[SAVED_CHANNEL_ID];
                const signals = channel?.signals ?? [];
                let isValid = false;

                if (signalType === 'iframe') {
                    const iframeSignals = signals.filter(s => s.type === 'iframe');
                    isValid = iframeSignals[signalIndex] !== undefined;
                } else if (signalType === 'm3u8') {
                    const m3u8Signals = signals.filter(s => s.type === 'm3u8');
                    isValid = m3u8Signals[signalIndex] !== undefined;
                } else if (signalType === 'youtube') {
                    isValid = !!channel?.youtube;
                } else if (signalType === 'youtube_embed') {
                    isValid = !!channel?.last_youtube_livestreams?.[signalIndex];
                } else if (signalType === 'twitch') {
                    isValid = !!channel?.twitch;
                }

                if (!isValid) {
                    console.error(`[teles] Prefer signal for ${SAVED_CHANNEL_ID} (${signalType}[${signalIndex}]) not available.`);
                    showToast({
                        title: `Señal preferida para ${SAVED_CHANNEL_ID} (${signalType}[${signalIndex}]) no disponible.`,
                        body: 'Utilizará siguiente señal disponible.',
                        type: 'warning'
                    });
                    delete lsSignalPreferences[SAVED_CHANNEL_ID];
                    writeJson(LS_KEY_CHANNEL_SIGNAL_PREFERENCE, lsSignalPreferences);
                }
            };
        }
    }
}