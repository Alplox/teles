const lazyAudio = (src) => {
    let a;
    return new Proxy({}, {
        get(_t, p) { a ??= new Audio(src); const v = a[p]; return typeof v === 'function' ? v.bind(a) : v; },
        set(_t, p, v) { a ??= new Audio(src); a[p] = v; return true; }
    });
};

export const AUDIO_STATIC = lazyAudio('assets/sounds/DefectLineTransformer-por-blaukreuz.wav');
export const AUDIO_FAIL = lazyAudio('assets/sounds/Cancel-miss-chime-by-Raclure.wav');
export const AUDIO_SUCCESS = lazyAudio('assets/sounds/button-pressed-by-Pixabay.mp3');
export const AUDIO_TV_SHUTDOWN = lazyAudio('assets/sounds/TV-Shutdown-por-MATRIXXX_.mp3');
export const AUDIO_TURN_ON = lazyAudio('assets/sounds/CRT-turn-on-notification-por-Coolshows101sound.mp3');
export const AUDIO_POP = lazyAudio('assets/sounds/User-Interface-Clicks-and-Buttons-1-por-original_sound.mp3');
export const AUDIO_WARNING = lazyAudio('assets/sounds/328117__dsg__pop-8.mp3');
export const AMBIENT_MUSIC = lazyAudio('assets/sounds/693384__yellowtree__weather-forecast-type-beat.mp3');
