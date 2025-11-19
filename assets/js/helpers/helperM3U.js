const STREAM_URL_REGEX = /^(https?|rtmp|rtsp|udp):\/\//i;
const SIMPLE_HTTP_URL_REGEX = /^https?:\/\/[^\s]+$/i;

/**
 * Valida el texto ingresado manualmente para asegurar que corresponde a una lista M3U válida.
 * @param {string} contenido - Texto completo proporcionado por la persona usuaria.
 * @returns {{ esValido: boolean, errores: string[] }} Resultado de la validación.
 */
export function validarTextoM3U(contenido) {
    const errores = [];
    const texto = typeof contenido === 'string' ? contenido.trim() : '';

    if (!texto) {
        errores.push('Pega el contenido completo de tu archivo .m3u.');
        return { esValido: false, errores };
    }

    if (SIMPLE_HTTP_URL_REGEX.test(texto) && !texto.includes('\n')) {
        errores.push('Pegaste únicamente una URL. Usa el campo de URL para archivos remotos.');
    }

    const lineas = texto
        .split(/\r?\n/)
        .map(linea => linea.trim())
        .filter(linea => linea !== '');

    if (!lineas.length) {
        errores.push('No se detectó contenido utilizable en la lista .m3u.');
        return { esValido: false, errores };
    }

    if (!lineas[0].toUpperCase().startsWith('#EXTM3U')) {
        errores.push('La lista debe comenzar con la cabecera #EXTM3U.');
    }

    const tieneExtinf = lineas.some(linea => linea.toUpperCase().startsWith('#EXTINF'));
    if (!tieneExtinf) {
        errores.push('No se encontraron bloques #EXTINF dentro de la lista.');
    }

    const tieneUrls = lineas.some(linea => STREAM_URL_REGEX.test(linea) || linea.toLowerCase().endsWith('.m3u8'));
    if (!tieneUrls) {
        errores.push('No se identificaron URLs de transmisión dentro de la lista.');
    }

    return {
        esValido: errores.length === 0,
        errores
    };
}

/**
 * Convierte el texto de una lista M3U en una estructura JSON utilizable
 * por el resto de la aplicación.
 * @param {string} m3u - Contenido completo del archivo .m3u.
 * @returns {Promise<Record<string, any>>}
 */
export async function M3U_A_JSON(m3u) {

    const channels = {};
    const lines = m3u
        .split(/\r?\n/)
        .map(line => line.trim())
        .filter(line => line !== '');

    const validateUrl = (url) => {
        if (STREAM_URL_REGEX.test(url) || SIMPLE_HTTP_URL_REGEX.test(url)) {
            return true;
        }
        return false;
    };

    for (let i = 1; i < lines.length; i++) {
        const channelInfo = lines[i].match(/([^\s]+)="([^"]+)"/g);
        if (channelInfo) {
            const attributes = channelInfo.reduce((acc, attr) => {
                const [key, value] = attr.split('=');
                acc[key.replace(/"/g, '')] = value.replace(/"/g, '');
                return acc;
            }, {});

            // Extraer el nombre del canal correctamente, incluso si hay atributos extra antes de la coma
            const NOMBRE_CANAL = lines[i].substring(lines[i].lastIndexOf(',') + 1).trim() || 'Nombre canal no encontrado';

            const LOGO_IMG = attributes['tvg-logo'] ?? "";
            const GROUP_TITLE_ID = attributes['group-title']?.toLowerCase() ?? "";

            const TVG_ID = attributes['tvg-id'] ?? `canal-m3u8-${i}.`;
            let [NOMBRE_CANAL_PARA_ID, COUNTRY_ID = ""] = TVG_ID.toLowerCase().split('.');
            if (COUNTRY_ID.includes('@')) {
                COUNTRY_ID = COUNTRY_ID.split('@')[0];
            }

            // Buscar la URL m3u8 saltando líneas #EXTVLCOPT
            let m3u8_url = "";
            let j = i + 1;
            while (j < lines.length) {
                if (!lines[j].startsWith('#')) {
                    m3u8_url = lines[j].trim();
                    break;
                }
                j++;
            }

            channels[NOMBRE_CANAL_PARA_ID] = {
                "nombre": NOMBRE_CANAL,
                "logo": LOGO_IMG,
                "señales": {
                    "iframe_url": [],
                    "m3u8_url": [m3u8_url],
                    "yt_id": "",
                    "yt_embed": "",
                    "yt_playlist": "",
                    "twitch_id": ""
                },
                "sitio_oficial": "",
                "categoría": GROUP_TITLE_ID,
                "país": COUNTRY_ID,
            };
        }
    }
    return channels;
}