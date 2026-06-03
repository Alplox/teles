import { channelsList } from "../channelManager.js";

/**
 * Checks if all signals for a given channel are empty or undefined.
 * @param {string} channelId - The channel ID to check.
 * @returns {boolean} `true` if all signals are empty or undefined, `false` otherwise.
 */
export const areAllSignalsEmpty = (channelId) => {
    const channel = channelsList?.[channelId];
    if (!channel) return true;

    const signals = channel.signals ?? [];
    const hasSignals = signals.length > 0 && signals.some(s => s.url && s.url.trim() !== '');
    const hasYoutube = !!channel.youtube;
    const hasYoutubeEmbed = !!(channel.last_youtube_livestreams?.[0]);
    const hasTwitch = !!channel.twitch;

    const allEmpty = !hasSignals && !hasYoutube && !hasYoutubeEmbed && !hasTwitch;

    if (allEmpty) {
        console.error(`[teles] ${channelId} has all its signals empty`);
    }

    return allEmpty;
}