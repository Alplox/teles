export function playAudioSinDelay(audio) {
    audio.pause();  // https://stackoverflow.com/a/51573799
    audio.currentTime = 0;
    audio.play();
}