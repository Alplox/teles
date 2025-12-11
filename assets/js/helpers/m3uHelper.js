const STREAM_URL_REGEX = /^(https?|rtmp|rtsp|udp):\/\//i;
const SIMPLE_HTTP_URL_REGEX = /^https?:\/\/[^\s]+$/i;

/**
 * Validates the manually entered text to ensure it corresponds to a valid M3U list.
 * @param {string} content - Full text provided by the user.
 * @returns {{ isValid: boolean, errors: string[] }} Result of the validation.
 */
export function validateM3UContent(content) {
    const errors = [];
    const text = typeof content === 'string' ? content.trim() : '';

    if (!text) {
        errors.push('Pega el contenido completo de tu archivo .m3u.');
        return { isValid: false, errors };
    }

    if (SIMPLE_HTTP_URL_REGEX.test(text) && !text.includes('\n')) {
        errors.push('Pegaste únicamente una URL. Usa el campo de URL para archivos remotos.');
    }

    const lines = text
        .split(/\r?\n/)
        .map(line => line.trim())
        .filter(line => line !== '');

    if (!lines.length) {
        errors.push('No se detectó contenido utilizable en la lista .m3u.');
        return { isValid: false, errors };
    }

    if (!lines[0].toUpperCase().startsWith('#EXTM3U')) {
        errors.push('La lista debe comenzar con la cabecera #EXTM3U.');
    }

    const hasExtinf = lines.some(line => line.toUpperCase().startsWith('#EXTINF'));
    if (!hasExtinf) {
        errors.push('No se encontraron bloques #EXTINF dentro de la lista.');
    }

    const hasUrls = lines.some(line => STREAM_URL_REGEX.test(line) || line.toLowerCase().endsWith('.m3u8'));
    if (!hasUrls) {
        errors.push('No se identificaron URLs de transmisión dentro de la lista.');
    }

    return {
        isValid: errors.length === 0,
        errors
    };
}

/**
 * Converts the text of an M3U list into a JSON structure usable by the rest of the application.
 * @param {string} m3u - Full content of the .m3u file.
 * @returns {Promise<Record<string, any>>}
 */
export async function m3uToJson(m3u) {
    const channels = {};
    const lines = m3u
        .split(/\r?\n/)
        .map(line => line.trim())
        .filter(line => line !== '');

    const validateUrl = (url) => {
        return STREAM_URL_REGEX.test(url) || SIMPLE_HTTP_URL_REGEX.test(url);
    };

    for (let i = 1; i < lines.length; i++) {
        // Skip comment lines entirely, unless it's an #EXTINF line we are processing
        if (lines[i].startsWith('#') && !lines[i].toUpperCase().startsWith('#EXTINF')) {
            continue;
        }

        const channelInfo = lines[i].match(/([^\s]+)="([^"]+)"/g);
        if (channelInfo) {
            const attributes = channelInfo.reduce((acc, attr) => {
                const [key, value] = attr.split('=');
                if (key && value) {
                    acc[key.replace(/"/g, '')] = value.replace(/"/g, '');
                }
                return acc;
            }, {});

            // Extract the channel name correctly, even if there are extra attributes before the comma
            const lastCommaIndex = lines[i].lastIndexOf(',');
            const channelName = lastCommaIndex !== -1 ? lines[i].substring(lastCommaIndex + 1).trim() : 'Nombre canal no encontrado';

            const logoImg = attributes['tvg-logo'] ?? "";
            const groupTitleId = attributes['group-title']?.toLowerCase() ?? "";

            const tvgId = attributes['tvg-id'] ?? `canal-m3u8-${i}.`;
            let [channelNameForId, countryId = ""] = tvgId.toLowerCase().split('.');
            if (countryId.includes('@')) {
                countryId = countryId.split('@')[0];
            }

            // Search for the m3u8 URL skipping #EXTVLCOPT and other comment lines
            let m3u8Url = "";
            let j = i + 1;
            while (j < lines.length) {
                if (!lines[j].startsWith('#')) {
                    if (validateUrl(lines[j].trim())) {
                        m3u8Url = lines[j].trim();
                    }
                    break;
                }
                j++;
            }

            // Only add channel if we found a URL (or if logic permits empty, but typically we want a URL)
            // Original code didn't strictly validate URL presence for adding to object, but it's safer.
            // Using original logic structure for safety.

            channels[channelNameForId] = {
                "nombre": channelName,
                "logo": logoImg,
                "señales": {
                    "iframe_url": [],
                    "m3u8_url": [m3u8Url],
                    "yt_id": "",
                    "yt_embed": "",
                    "yt_playlist": "",
                    "twitch_id": ""
                },
                "sitio_oficial": "",
                "categoría": groupTitleId,
                "país": countryId,
            };
        }
    }
    return channels;
}
