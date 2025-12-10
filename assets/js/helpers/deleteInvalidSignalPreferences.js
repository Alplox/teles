import { channelsList } from "../canalesData.js";
import { LS_KEY_CHANNEL_SIGNAL_PREFERENCE } from "../constants/localStorageKeys.js";
import { areAllSignalsEmpty, showToast } from "./index.js";

export const deleteInvalidSignalPreferences = () => {
    let lsSignalPreferences = JSON.parse(localStorage.getItem(LS_KEY_CHANNEL_SIGNAL_PREFERENCE)) || {};
    if (Object.keys(lsSignalPreferences).length !== 0) {
        for (const SAVED_CHANNEL_ID in lsSignalPreferences) {
            let signalType = Object.keys(lsSignalPreferences[SAVED_CHANNEL_ID])[0].toString();
            let signalIndex = Number(Object.values(lsSignalPreferences[SAVED_CHANNEL_ID]));

            if (!areAllSignalsEmpty(SAVED_CHANNEL_ID)) {
                if (signalType === 'iframe_url' || signalType === 'm3u8_url') {
                    if (channelsList?.[SAVED_CHANNEL_ID]?.señales?.[signalType][signalIndex] === undefined) {
                        console.error(`Señal preferida para ${SAVED_CHANNEL_ID} (${signalType}[${signalIndex}]) no disponible.`);
                        showToast({
                            title: `Señal preferida para ${SAVED_CHANNEL_ID} (${signalType}[${signalIndex}]) no disponible.`,
                            body: 'Utilizará siguiente señal disponible.',
                            type: 'warning'
                        });
                        delete lsSignalPreferences[SAVED_CHANNEL_ID];
                        localStorage.setItem(LS_KEY_CHANNEL_SIGNAL_PREFERENCE, JSON.stringify(lsSignalPreferences));
                    }
                } else {
                    if (channelsList?.[SAVED_CHANNEL_ID]?.señales?.[signalType] === '') {
                        console.error(`Señal preferida para ${SAVED_CHANNEL_ID} (${signalType}) no disponible.`);
                        showToast({
                            title: `Señal preferida para ${SAVED_CHANNEL_ID} (${signalType}) no disponible.`,
                            body: 'Utilizará siguiente señal disponible.',
                            type: 'warning'
                        });
                        delete lsSignalPreferences[SAVED_CHANNEL_ID];
                        localStorage.setItem(LS_KEY_CHANNEL_SIGNAL_PREFERENCE, JSON.stringify(lsSignalPreferences));
                    }
                }
            };
        }
    }
}