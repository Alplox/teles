import { URL_JSON_MAIN_CHANNELS } from "./constants/configGlobal.js";
import { LS_KEY_CHANNELS_BACKUP, LS_KEY_CHANNELS_BACKUP_DATE, LS_KEY_CHANNELS_BACKUP_VERSION, LS_KEY_COMBINE_PERSONALIZED_CHANNELS, LS_KEY_PERSONALIZED_LISTS } from "./constants/localStorageKeys.js";
import { m3uToJson, validateM3UContent } from "./helpers/index.js";

// Backup and channel fetch management
export const DEFAULT_CHANNELS_ARRAY = ['24-horas', 'meganoticias', 't13'];
export const EXTRA_DEFAULT_CHANNELS_ARRAY = ['chv-noticias', 'cnn-cl', 'lofi-girl'];

export let channelsList;

export const BACKUP_EXPIRATION_HOURS = 24;
export const BACKUP_FORMAT_VERSION = 1;
export const DEFAULT_SOURCE_ORIGIN = 'Canales predeterminados (github.com/Alplox/json-teles)';

/**
 * Checks if the stored backup is valid based on expiration time.
 * @returns {boolean} True if backup is valid, false otherwise.
 */
export function isBackupValid() {
    const dateStr = localStorage.getItem(LS_KEY_CHANNELS_BACKUP_DATE);
    if (!dateStr) return false;
    const version = localStorage.getItem(LS_KEY_CHANNELS_BACKUP_VERSION);
    if (version !== String(BACKUP_FORMAT_VERSION)) return false;
    const date = new Date(dateStr);
    const now = new Date();
    const diffHours = (now - date) / (1000 * 60 * 60);
    return diffHours < BACKUP_EXPIRATION_HOURS;
}

/**
 * Saves channel data to local storage backup.
 * @param {Object} json - The channel data to save.
 */
export function saveChannelBackup(json) {
    localStorage.setItem(LS_KEY_CHANNELS_BACKUP, JSON.stringify(json));
    localStorage.setItem(LS_KEY_CHANNELS_BACKUP_DATE, new Date().toISOString());
    localStorage.setItem(LS_KEY_CHANNELS_BACKUP_VERSION, String(BACKUP_FORMAT_VERSION));
}

/**
 * Reads channel data from local storage backup.
 * @returns {Object|null} The channel data or null if invalid/error.
 */
export function readChannelBackup() {
    try {
        return JSON.parse(localStorage.getItem(LS_KEY_CHANNELS_BACKUP));
    } catch {
        return null;
    }
}

// Variable to store a clean copy of base channels (without M3Us)
let initialChannelsListBackup = null;

/**
 * Clears all channel backup data from localStorage.
 */
function clearChannelBackup() {
    localStorage.removeItem(LS_KEY_CHANNELS_BACKUP);
    localStorage.removeItem(LS_KEY_CHANNELS_BACKUP_DATE);
    localStorage.removeItem(LS_KEY_CHANNELS_BACKUP_VERSION);
}

/**
 * Detects if channel data uses the pre-v0.29 format (Spanish field names).
 * @param {Object} data - The channel data to check.
 * @returns {boolean} True if the data is in the old format.
 */
function isOldFormat(data) {
    if (!data || typeof data !== 'object') return false;
    const sample = Object.values(data)[0];
    return !!(sample && (sample.señales || sample.nombre || sample['país'] || sample.categoría));
}

/**
 * Migrates a collection of channels from pre-v0.29 format (Spanish fields)
 * to the current format (English fields + signals array).
 * @param {Object} channels - Collection of channels keyed by ID.
 * @returns {Object} Migrated channels in the new format.
 */
function migrateOldFormatChannels(channels) {
    const migrated = {};
    for (const [id, ch] of Object.entries(channels)) {
        if (!ch || typeof ch !== 'object') {
            migrated[id] = ch;
            continue;
        }
        const hasOldSignals = ch.señales && typeof ch.señales === 'object';
        const signals = [];
        if (hasOldSignals) {
            const s = ch.señales;
            if (Array.isArray(s.iframe_url)) {
                s.iframe_url.filter(u => u).forEach(url => signals.push({ type: 'iframe', url }));
            }
            if (Array.isArray(s.m3u8_url)) {
                s.m3u8_url.filter(u => u).forEach(url => signals.push({ type: 'm3u8', url }));
            }
        }
        migrated[id] = {
            id,
            name: ch.nombre ?? ch.name ?? '',
            logo: ch.logo ?? '',
            signals,
            youtube: ch.señales?.yt_id || ch.youtube || null,
            last_youtube_livestreams: ch.señales?.yt_embed
                ? [ch.señales.yt_embed].filter(Boolean)
                : (ch.last_youtube_livestreams ?? null),
            twitch: ch.señales?.twitch_id || ch.twitch || null,
            website: ch.sitio_oficial ?? ch.website ?? '',
            country: ch['país'] ?? ch.country ?? '',
            category: ch.categoría ?? ch.category ?? '',
        };
    }
    return migrated;
}

/**
 * Fetches the main channel list from the remote source or backup.
 * @async
 * @returns {Promise<void>}
 */
export async function fetchLoadChannels() {
    try {
        if (isBackupValid()) {
            console.info('[teles] Loading channels from localStorage backup');
            channelsList = readChannelBackup();
            if (channelsList) {
                if (isOldFormat(channelsList)) {
                    console.warn('[teles] Detected outdated backup format (pre-v0.29), clearing and re-fetching');
                    clearChannelBackup();
                    channelsList = null;
                } else {
                    initialChannelsListBackup = JSON.parse(JSON.stringify(channelsList));
                    return;
                }
            }
        }
        console.info('[teles] Attempting to load main channel file');
        const response = await fetch(URL_JSON_MAIN_CHANNELS);
        try {
            const raw = await response.json();
            // New format: { version, generated, total, channels: [...] }
            // Index channels array by id into a flat object for internal use
            if (Array.isArray(raw.channels)) {
                const indexed = {};
                for (const ch of raw.channels) {
                    if (ch.id) indexed[ch.id] = ch;
                }
                channelsList = indexed;
            } else {
                // Fallback: assume old format (already flat object)
                channelsList = raw;
            }
            saveChannelBackup(channelsList);
            assignBaseOrigin();

            // Save in-memory copy
            initialChannelsListBackup = JSON.parse(JSON.stringify(channelsList));
        } catch (parseError) {
            console.error('[teles] Error parsing main JSON', parseError);
            // Try loading backup if exists
            if (isBackupValid()) {
                console.warn('[teles] Using channel list backup from localStorage due to parsing error');
                channelsList = readChannelBackup();
                if (channelsList) {
                    initialChannelsListBackup = JSON.parse(JSON.stringify(channelsList));
                    return;
                }
            }
            throw parseError;
        }
    } catch (error) {
        throw error;
    }
}

/**
 * Restores channelsList to its initial state (base channels only)
 * using the in-memory backup if it exists.
 * @returns {Promise<void>|void}
 */
export function restoreChannelsFromMemory() {
    if (initialChannelsListBackup) {
        channelsList = JSON.parse(JSON.stringify(initialChannelsListBackup));
    } else {
        // Fallback in case there is no memory backup (rare)
        console.warn('[teles] No memory backup found, fetching channels again...');
        return fetchLoadChannels();
    }
}

/**
 * Assigns default origin properties to channels if missing.
 */
function assignBaseOrigin() {
    if (!channelsList) return;
    for (const canalId of Object.keys(channelsList)) {
        const canal = channelsList[canalId];
        if (!canal.listOrigin) {
            canal.listOrigin = DEFAULT_SOURCE_ORIGIN;
        }
        if (!canal.originalListOrigin) {
            canal.originalListOrigin = canal.listOrigin;
        }
        if (!Array.isArray(canal.combinedSources) || canal.combinedSources.length === 0) {
            canal.combinedSources = [canal.originalListOrigin];
        }
        canal.isCombinedSignal = Array.isArray(canal.combinedSources) && canal.combinedSources.length > 1;
    }
}

/**
 * Checks if two names are similar (contain each other).
 * @param {string} name1 
 * @param {string} name2 
 * @returns {boolean}
 */
const areNamesSimilar = (name1, name2) => {
    const name1Lower = name1.toLowerCase();
    const name2Lower = name2.toLowerCase();
    return name1Lower.includes(name2Lower) || name2Lower.includes(name1Lower);
}

/**
 * Combines the base channel JSON with results parsed from an .m3u,
 * checking for approximate matches and logging the process.
 * @param {Record<string, any>} parseM3u - Collection of channels from the .m3u.
 * @param {Object} options
 * @param {string} [options.origin='unknown-list']
 * @param {string|null} [options.source=null]
 * @param {boolean} [options.combineMatches]
 */
function combineChannelsWithList(parseM3u = {}, { origin = 'unknown-list', source = null, combineMatches } = {}) {
    if (!parseM3u || typeof parseM3u !== 'object') return;

    if (isOldFormat(parseM3u)) {
        parseM3u = migrateOldFormatChannels(parseM3u);
    }

    if (!channelsList) {
        channelsList = {};
    }

    const shouldCombineMatches =
        typeof combineMatches === 'boolean' ? combineMatches : getCombineChannelsPreference();

    const channelMap = {};
    if (shouldCombineMatches) {
        for (const canal of Object.keys(channelsList)) {
            const listName = channelsList[canal].name ?? 'Canal sin nombre';
            channelMap[listName] = channelsList[canal];
        }
    }

    const m3uKeys = Object.keys(parseM3u);
    console.groupCollapsed(`[teles][m3u] Processing ${m3uKeys.length} channels from ${origin}`);
    for (const channelName of m3uKeys) {
        const newData = parseM3u[channelName];
        const parsedM3uName = newData.name ?? 'Canal sin nombre';
        let existingChannel = null;

        if (shouldCombineMatches) {
            for (const listName in channelMap) {
                if (areNamesSimilar(listName, parsedM3uName)) {
                    existingChannel = channelMap[listName];
                    break;
                }
            }
        }

        if (shouldCombineMatches && existingChannel) {
            existingChannel.signals = Array.isArray(existingChannel.signals) ? existingChannel.signals : [];
            const currentM3u8s = existingChannel.signals
                .filter(s => s.type === 'm3u8')
                .map(s => s.url);

            const newUrls = (newData.signals ?? [])
                .filter(s => s.type === 'm3u8')
                .map(s => s.url)
                .filter(url => url && !currentM3u8s.includes(url));
            for (const url of newUrls) {
                existingChannel.signals.push({ type: 'm3u8', url });
            }

            const baseOrigin = existingChannel.originalListOrigin ?? existingChannel.listOrigin ?? DEFAULT_SOURCE_ORIGIN;
            existingChannel.originalListOrigin = baseOrigin;
            existingChannel.listOrigin = baseOrigin;

            if (source && !existingChannel.sourceList) {
                existingChannel.sourceList = source;
            }

            const previousSources = Array.isArray(existingChannel.combinedSources) && existingChannel.combinedSources.length > 0
                ? existingChannel.combinedSources
                : [baseOrigin];
            if (origin && !previousSources.includes(origin)) {
                previousSources.push(origin);
            }
            existingChannel.combinedSources = previousSources;
            existingChannel.isCombinedSignal = existingChannel.combinedSources.length > 1;

            console.info('[teles][m3u] Existing channel updated', {
                origin,
                internalId: channelName,
                name: parsedM3uName,
                prevUrls: currentM3u8s,
                addedUrls: newUrls,
                totalSignals: existingChannel.signals.length
            });
        } else {
            newData.listOrigin = origin;
            newData.originalListOrigin = origin;
            if (source) newData.sourceList = source;
            newData.combinedSources = origin ? [origin] : [];
            newData.isCombinedSignal = false;
            const resultId = getAvailableChannelId(channelName, parsedM3uName, origin);
            channelsList[resultId] = newData;

            console.info('[teles][m3u] New channel added', {
                origin,
                internalId: resultId,
                name: parsedM3uName,
                signals: newData.signals,
                country: newData.country,
                category: newData.category
            });
        }
    }
    console.groupEnd();
}

/**
 * Loads a personalized M3U list from a URL.
 * @async
 * @param {string} url 
 * @throws {Error} If URL is invalid or fetch fails.
 */
export async function loadPersonalizedM3UList(url) {
    if (!url || typeof url !== 'string') {
        throw new Error('Debes proporcionar una URL válida a un archivo .m3u');
    }

    console.info(`[teles] Loading personalized list from: ${url}`);
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`No se pudo cargar la lista personalizada (estado ${response.status})`);
    }

    const m3uData = await response.text();
    const parseM3u = await m3uToJson(m3uData);
    const label = getLabelForList(url);

    combineChannelsWithList(parseM3u, {
        origin: label,
        source: url,
        combineMatches: getCombineChannelsPreference()
    });
    savePersonalizedList(url, { etiqueta: label, canales: parseM3u });
}

/**
 * Loads a personalized M3U list from raw text content.
 * @async
 * @param {string} content 
 * @param {Object} options 
 * @param {string} [options.etiqueta]
 * @param {string} [options.clave]
 * @throws {Error} If content is invalid.
 */
export async function loadPersonalizedListFromText(content, options = {}) {
    if (!content || typeof content !== 'string') {
        throw new Error('Debes proporcionar el contenido de un archivo .m3u en texto');
    }

    const { isValid, errors: errores } = validateM3UContent(content);
    if (!isValid) {
        throw new Error(errores.join(' '));
    }

    const { etiqueta, clave } = options;
    const parseM3u = await m3uToJson(content);

    const finalLabel = etiqueta || 'Lista manual';
    const listKey = clave || finalLabel;

    combineChannelsWithList(parseM3u, {
        origin: finalLabel,
        source: listKey,
        combineMatches: getCombineChannelsPreference()
    });

    savePersonalizedList(listKey, { etiqueta: finalLabel, canales: parseM3u });
}

/**
 * Restores all pinned personalized lists from storage.
 * @returns {number} Number of lists restored.
 */
export function restorePersonalizedLists() {
    const lists = readPersonalizedLists();
    const urls = Object.keys(lists).filter(url => lists[url]?.pinned !== false);
    if (!urls.length) return 0;
    console.info(`[teles][m3u] Restoring ${urls.length} pinned personalized lists`);
    let restoredCount = 0;
    let anyMigrated = false;
    urls.forEach(url => {
        try {
            const { etiqueta = url, canales } = lists[url];
            if (!canales) return;
            let channelsData = canales;
            if (isOldFormat(canales)) {
                console.info(`[teles][m3u] Migrating old format list: ${etiqueta}`);
                channelsData = migrateOldFormatChannels(canales);
                anyMigrated = true;
            }
            combineChannelsWithList(channelsData, {
                origin: etiqueta,
                source: url,
                combineMatches: getCombineChannelsPreference()
            });
            restoredCount++;
        } catch (error) {
            console.error(`[teles][m3u] Could not restore personalized list ${url}`, error);
        }
    });

    if (anyMigrated) {
        const allLists = readPersonalizedLists();
        for (const url of Object.keys(allLists)) {
            if (allLists[url]?.canales && isOldFormat(allLists[url].canales)) {
                allLists[url].canales = migrateOldFormatChannels(allLists[url].canales);
            }
        }
        localStorage.setItem(LS_KEY_PERSONALIZED_LISTS, JSON.stringify(allLists));
    }

    return restoredCount;
}

/**
 * Generates a display label for a list URL.
 * @param {string} url 
 * @returns {string}
 */
function getLabelForList(url) {
    try {
        const parsed = new URL(url);
        const hostname = parsed.hostname?.replace(/^www\./, '') ?? url;
        const slug = parsed.pathname.split('/').filter(Boolean).pop();
        return slug ? `${hostname} / ${slug}` : hostname;
    } catch {
        return url;
    }
}

/**
 * Reads personalized lists from local storage.
 * @returns {Object}
 */
function readPersonalizedLists() {
    try {
        const payload = localStorage.getItem(LS_KEY_PERSONALIZED_LISTS);
        if (!payload) return {};
        return JSON.parse(payload) ?? {};
    } catch {
        return {};
    }
}

/**
 * Saves a personalized list to local storage.
 * @param {string} url 
 * @param {Object} list 
 */
function savePersonalizedList(url, list) {
    const lists = readPersonalizedLists();
    lists[url] = {
        etiqueta: list.etiqueta,
        canales: list.canales,
        actualizado: new Date().toISOString(),
        pinned: list.pinned ?? true
    };
    localStorage.setItem(LS_KEY_PERSONALIZED_LISTS, JSON.stringify(lists));
}

/**
 * Gets all saved personalized lists.
 * @returns {Object}
 */
export function getPersonalizedLists() {
    return readPersonalizedLists();
}

/**
 * Updates an existing personalized list in storage.
 * @param {string} url 
 * @param {Object} changes 
 */
export function updatePersonalizedList(url, changes = {}) {
    const lists = readPersonalizedLists();
    if (!lists[url]) return;
    lists[url] = { ...lists[url], ...changes, actualizado: new Date().toISOString() };
    localStorage.setItem(LS_KEY_PERSONALIZED_LISTS, JSON.stringify(lists));
}

/**
 * Deletes a personalized list from storage.
 * @param {string} url 
 */
export function deletePersonalizedList(url) {
    const lists = readPersonalizedLists();
    if (!lists[url]) return false;
    delete lists[url];
    localStorage.setItem(LS_KEY_PERSONALIZED_LISTS, JSON.stringify(lists));
    return true;
}

/**
 * Applies a saved personalized list to the current channel list.
 * @param {string} url 
 * @returns {boolean} True if successful.
 */
export function applySavedPersonalizedList(url) {
    const lists = readPersonalizedLists();
    const data = lists[url];
    if (!data || !data.canales) return false;
    combineChannelsWithList(data.canales, {
        origin: data.etiqueta ?? url,
        source: url,
        combineMatches: getCombineChannelsPreference()
    });
    return true;
}

/**
 * Gets the user preference for combining similar channels.
 * @returns {boolean} `true` when approximate matches should be combined.
 */
export function getCombineChannelsPreference() {
    const value = JSON.parse(localStorage.getItem(LS_KEY_COMBINE_PERSONALIZED_CHANNELS)) ?? true;
    return value;
}

/**
 * Sets the user preference for combining similar channels.
 * @param {boolean} combine - New desired state.
 */
export function setCombineChannelsPreference(combine) {
    localStorage.setItem(LS_KEY_COMBINE_PERSONALIZED_CHANNELS, JSON.stringify(combine));
}

/**
 * Generates a unique identifier for channels added from external lists.
 * @param {string} [baseId] - Suggested ID from the .m3u file.
 * @param {string} [fallbackName] - Channel name used as fallback for slug creation.
 * @param {string} [origin] - Additional text used to avoid collisions.
 * @returns {string} Available ID within `channelsList`.
 */
function getAvailableChannelId(baseId = '', fallbackName = '', origin = '') {
    const baseSlug = slugifyValue(baseId || fallbackName || origin || `canal-${Date.now()}`);
    if (!channelsList?.[baseSlug]) {
        return baseSlug;
    }
    let counter = 2;
    let candidate = `${baseSlug}-${counter}`;
    while (channelsList?.[candidate]) {
        counter += 1;
        candidate = `${baseSlug}-${counter}`;
    }
    return candidate;
}

/**
 * Normalizes a text string for use as part of an ID.
 * @param {string} value - Original text.
 * @returns {string} Lowercase text, no accents, no special characters.
 */
function slugifyValue(value = '') {
    return value
        .toString()
        .normalize('NFD')
        .replace(/[^\w\s-]/g, '')
        .replace(/[\u0300-\u036f]/g, '')
        .trim()
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '')
        .replace(/\n/g, '') // Fix newline
        || 'canal';
}
