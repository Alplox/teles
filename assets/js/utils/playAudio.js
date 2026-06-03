export const playAudio = (audio, loop = false) => {
    if (!audio) return;
    try {
        audio.pause();  // https://stackoverflow.com/a/51573799
        audio.currentTime = 0;
        audio.loop = loop;
        audio.play().catch(error => {
            // Browser autoplay policy or other async failure — not a real crash
            console.warn('[teles] Audio play rejected (likely autoplay policy):', error?.message ?? error);
        });
    } catch (error) {
        console.error('[teles] Error while playing audio:', error);
    }
}
