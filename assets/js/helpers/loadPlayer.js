/**
 * Dynamic player library loader.
 * Loads player scripts on demand to avoid downloading unused libraries.
 * Video.js is loaded statically (default player) and excluded from this map.
 * @type {Object.<string, {urls: string[], globals: string[]}>}
 */
const PLAYER_SCRIPTS = {
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
 * Loads a player library dynamically if not already loaded.
 * Video.js is excluded (loaded statically as default player).
 * Scripts are loaded sequentially to respect dependency order.
 * @param {string} playerName - Player identifier: 'clappr', 'oplayer', or 'shaka'
 * @returns {Promise<void>}
 */
export const loadPlayer = async (playerName) => {
    if (loadedPlayers.has(playerName)) return;
    const config = PLAYER_SCRIPTS[playerName];
    if (!config) return;
    for (const url of config.urls) {
        await loadScript(url);
    }
    // Wait for globals to be available (dynamic scripts may need a microtask)
    if (config.globals?.length) {
        await new Promise(resolve => {
            const check = () => {
                if (config.globals.every(g => typeof window[g] !== 'undefined')) {
                    resolve();
                } else {
                    setTimeout(check, 0);
                }
            };
            check();
        });
    }
    loadedPlayers.add(playerName);
};
