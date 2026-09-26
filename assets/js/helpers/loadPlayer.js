/**
 * Dynamic player library loader. Nothing is fetched until a channel needs it.
 * @type {Object.<string, {urls: string[], globals: string[]}>}
 */
const PLAYER_SCRIPTS = {
    videojs: {
        urls: ['https://unpkg.com/video.js@8.24.1/dist/video.min.js'],
        globals: ['videojs']
    },
    clappr: {
        urls: ['https://cdn.jsdelivr.net/npm/@clappr/player@0.11.16/dist/clappr.min.js'],
        globals: ['Clappr']
    },
    oplayer: {
        urls: [
            'https://cdn.jsdelivr.net/npm/hls.js@1.5.17/dist/hls.min.js',
            'https://cdn.jsdelivr.net/npm/@oplayer/core@1.2.37/dist/index.min.js',
            'https://cdn.jsdelivr.net/npm/@oplayer/hls@1.2.27/dist/index.min.js',
            'https://cdn.jsdelivr.net/npm/@oplayer/ui@1.3.3/dist/index.min.js'
        ],
        globals: ['OPlayer', 'Hls']
    },
    shaka: {
        urls: ['https://cdn.jsdelivr.net/npm/shaka-player@5.0.16/dist/shaka-player.ui.min.js'],
        globals: ['shaka']
    }
};

/** @type {Set<string>} Tracks which player libraries have been loaded */
const loadedPlayers = new Set();

/** Upper bound for waiting on a library's global to appear after its script loads. */
const GLOBAL_WAIT_TIMEOUT_MS = 10000;

/**
 * Loads a script dynamically by appending a <script> tag to <head>.
 * @param {string} src - The script URL to load
 * @returns {Promise<void>}
 */
const loadScript = (src) => new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) return resolve();
    const script = document.createElement('script');
    script.src = src;
    script.onload = resolve;
    script.onerror = () => reject(new Error(`Failed to load player script: ${src}`));
    document.head.appendChild(script);
});

/**
 * Waits until every expected global is defined, or rejects at the deadline.
 * @param {string[]} globals
 * @param {string} playerName
 * @returns {Promise<void>}
 */
const waitForGlobals = (globals, playerName) => new Promise((resolve, reject) => {
    const deadline = Date.now() + GLOBAL_WAIT_TIMEOUT_MS;

    const check = () => {
        if (globals.every(g => typeof window[g] !== 'undefined')) return resolve();
        if (Date.now() > deadline) {
            const missing = globals.filter(g => typeof window[g] === 'undefined');
            return reject(new Error(
                `El reproductor "${playerName}" se cargó pero no expuso: ${missing.join(', ')}`
            ));
        }
        setTimeout(check, 50);
    };

    check();
});

/**
 * Loads a player library dynamically if not already loaded.
 * Scripts are loaded sequentially to respect dependency order.
 * @param {string} playerName
 * @returns {Promise<void>}
 */
export const loadPlayer = async (playerName) => {
    if (loadedPlayers.has(playerName)) return;
    const config = PLAYER_SCRIPTS[playerName];
    if (!config) return;
    for (const url of config.urls) {
        await loadScript(url);
    }
    // Wait for globals to be actually defined (onload can fire before the
    // script finishes executing).
    if (config.globals?.length) {
        await waitForGlobals(config.globals, playerName);
    }
    loadedPlayers.add(playerName);
};
