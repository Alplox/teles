/**
 * `Audio` starts preloading the moment it is constructed, and reading a property
 * constructs it. So every proxy below instantiates lazily: asking for playback
 * state must never fetch the media.
 */

/** @type {symbol} State probe, readable without instantiating the Audio. */
const IS_PLAYING = Symbol('isPlaying');

/**
 * Wraps a media URL in a lazily-instantiated `Audio` proxy.
 * @param {string} src
 * @returns {object} Proxy that only creates the `Audio` on first real use.
 */
const lazyAudio = (src) => {
    let audio;
    let playing = false;

    const resolve = () => {
        if (!audio) {
            audio = new Audio(src);
            // Second line of defence; the lazy construction is what really matters.
            audio.preload = 'none';
            audio.addEventListener('ended', () => { playing = false; });
            audio.addEventListener('pause', () => { playing = false; });
        }
        return audio;
    };

    return new Proxy({}, {
        get(_t, prop) {
            if (prop === IS_PLAYING) return playing;

            if (prop === 'play') {
                return (...args) => {
                    const el = resolve();
                    const result = el.play(...args);
                    if (result && typeof result.catch === 'function') {
                        result.then(() => { playing = true; }, () => { playing = false; });
                    } else {
                        playing = true;
                    }
                    return result;
                };
            }

            if (prop === 'pause') {
                return (...args) => {
                    playing = false;
                    return resolve().pause(...args);
                };
            }

            const value = resolve()[prop];
            return typeof value === 'function' ? value.bind(resolve()) : value;
        },
        set(_t, prop, value) {
            resolve()[prop] = value;
            return true;
        }
    });
};

/**
 * Reports whether a lazy audio proxy is playing, without creating the `Audio`.
 * @param {object} audioProxy
 * @returns {boolean}
 */
export const isAudioPlaying = (audioProxy) => Boolean(audioProxy && audioProxy[IS_PLAYING]);

/**
 * Whether the user asked for ambient music this session.
 *
 * Auto-starting it when the grid emptied always lost the autoplay-policy race,
 * but not before the browser had already fetched the 1.45 MB track.
 */
let _ambientEnabledByUser = false;

/** @param {boolean} enabled */
export const setAmbientEnabledByUser = (enabled) => { _ambientEnabledByUser = Boolean(enabled); };

/** @returns {boolean} */
export const isAmbientEnabledByUser = () => _ambientEnabledByUser;

export const AUDIO_STATIC = lazyAudio('assets/sounds/DefectLineTransformer-por-blaukreuz.wav');
export const AUDIO_FAIL = lazyAudio('assets/sounds/Cancel-miss-chime-by-Raclure.wav');
export const AUDIO_SUCCESS = lazyAudio('assets/sounds/button-pressed-by-Pixabay.mp3');
export const AUDIO_TV_SHUTDOWN = lazyAudio('assets/sounds/TV-Shutdown-por-MATRIXXX_.mp3');
export const AUDIO_TURN_ON = lazyAudio('assets/sounds/CRT-turn-on-notification-por-Coolshows101sound.mp3');
export const AUDIO_POP = lazyAudio('assets/sounds/User-Interface-Clicks-and-Buttons-1-por-original_sound.mp3');
export const AUDIO_WARNING = lazyAudio('assets/sounds/328117__dsg__pop-8.mp3');
export const AMBIENT_MUSIC = lazyAudio('assets/sounds/693384__yellowtree__weather-forecast-type-beat.mp3');
