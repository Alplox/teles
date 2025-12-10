import { channelsList } from "../channelManager.js";

/**
 * Checks if all signals for a given channel are empty or undefined.
 * @param {string} channelId - The channel ID to check.
 * @returns {boolean} `true` if all signals are empty or undefined, `false` otherwise.
 */
export const areAllSignalsEmpty = (channelId) => {
    const signals = channelsList?.[channelId]?.señales;
    if (!signals) return true;

    const allEmpty = Object.values(signals).every(signal => {
        if (signal === null || signal === undefined) return true;
        if (Array.isArray(signal)) return signal.length === 0;
        if (typeof signal === 'string') return signal.trim() === '';
        return true;
    });

    if (allEmpty) {
        console.error(`[teles] ${channelId} has all its signals empty`);
    }

    return allEmpty;
}