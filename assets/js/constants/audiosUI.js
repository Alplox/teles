/**
 * Lazy Audio loaders — Audio objects are created only on first play,
 * avoiding 8 HTTP fetches and permanent memory hold at module load.
 * Returns a Proxy that transparently forwards property access and
 * method calls to the underlying Audio instance on first use.
 */
const lazyAudio = (src) => {
    let instance = null;
    const ensure = () => {
        if (!instance) instance = new Audio(src);
        return instance;
    };
    return new Proxy({}, {
        get(_target, prop, receiver) {
            const audio = ensure();
            const value = audio[prop];
            return typeof value === 'function' ? value.bind(audio) : value;
        },
        set(_target, prop, value) {
            ensure()[prop] = value;
            return true;
        }
    });
};

export const AUDIO_STATIC = lazyAudio('assets/sounds/DefectLineTransformer-por-blaukreuz.wav');
export const AUDIO_FAIL = lazyAudio('assets/sounds/Cancel-miss-chime-by-Raclure.wav');
export const AUDIO_SUCCESS = lazyAudio('assets/sounds/button-pressed-by-Pixabay.mp3');
export const AUDIO_TV_SHUTDOWN = lazyAudio('assets/sounds/TV-Shutdown-por-MATRIXXX_.mp3');
export const AUDIO_TURN_ON = lazyAudio('assets/sounds/CRT-turn-on-notification-por-Coolshows101sound.mp3');
export const AUDIO_POP = lazyAudio('assets/sounds/User-Interface-Clicks-and-Buttons-1-por-original_sound.mp3');
export const AUDIO_WARNING = lazyAudio('assets/sounds/328117__dsg__pop-8.mp3');
export const AMBIENT_MUSIC = lazyAudio('assets/sounds/693384__yellowtree__weather-forecast-type-beat.wav');
