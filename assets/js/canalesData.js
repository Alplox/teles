import { URL_JSON_MAIN_CHANNELS } from "./constants/configGlobal.js";
import { LS_KEY_CHANNELS_BACKUP, LS_KEY_CHANNELS_BACKUP_DATE, LS_KEY_COMBINE_PERSONALIZED_CHANNELS, LS_KEY_PERSONALIZED_LISTS } from "./constants/localStorageKeys.js";
import { M3U_A_JSON, validarTextoM3U } from "./helpers/index.js";

// Gestión de backup y fetch de canales
export const ARRAY_CANALES_PREDETERMINADOS = ['24-horas', 'meganoticias', 't13'];
export const ARRAY_CANALES_PREDETERMINADOS_EXTRAS = ['chv-noticias', 'cnn-cl', 'lofi-girl'];

export let channelsList;

export const BACKUP_EXPIRATION_HOURS = 24;
export const ORIGEN_PREDETERMINADO = 'Canales predeterminados (github.com/Alplox/json-teles)';

export function esBackupValido() {
    const fechaStr = localStorage.getItem(LS_KEY_CHANNELS_BACKUP_DATE);
    if (!fechaStr) return false;
    const fecha = new Date(fechaStr);
    const ahora = new Date();
    const diffHoras = (ahora - fecha) / (1000 * 60 * 60);
    return diffHoras < BACKUP_EXPIRATION_HOURS;
}

export function guardarBackupCanales(json) {
    localStorage.setItem(LS_KEY_CHANNELS_BACKUP, JSON.stringify(json));
    localStorage.setItem(LS_KEY_CHANNELS_BACKUP_DATE, new Date().toISOString());
}

export function leerBackupCanales() {
    try {
        return JSON.parse(localStorage.getItem(LS_KEY_CHANNELS_BACKUP));
    } catch {
        return null;
    }
}

export async function fetchCargarCanales() {
    try {
        if (esBackupValido()) {
            console.info('Cargando canales desde backup localStorage');
            channelsList = leerBackupCanales();
            if (channelsList) return;
        }
        console.info('Probando carga archivo principal con canales');
        const response = await fetch(URL_JSON_MAIN_CHANNELS);
        try {
            channelsList = await response.json();
            guardarBackupCanales(channelsList);
            asignarOrigenBase();
        } catch (parseError) {
            console.error('Error al parsear JSON principal:', parseError);
            // Intentar cargar backup si existe
            if (esBackupValido()) {
                console.warn('[teles] Using channel list backup from localStorage due to parsing error');
                channelsList = leerBackupCanales();
                if (channelsList) return;
            }
            throw parseError;
        }
    } catch (error) {
        throw error;
    }
}

function asignarOrigenBase() {
    if (!channelsList) return;
    for (const canalId of Object.keys(channelsList)) {
        const canal = channelsList[canalId];
        if (!canal.origenLista) {
            canal.origenLista = ORIGEN_PREDETERMINADO;
        }
        if (!canal.origenListaOriginal) {
            canal.origenListaOriginal = canal.origenLista;
        }
        if (!Array.isArray(canal.fuentesCombinadas) || canal.fuentesCombinadas.length === 0) {
            canal.fuentesCombinadas = [canal.origenListaOriginal];
        }
        canal.esSeñalCombinada = Array.isArray(canal.fuentesCombinadas) && canal.fuentesCombinadas.length > 1;
    }
}

const sonNombresSimilares = (nombre1, nombre2) => {
    const nombre1Lower = nombre1.toLowerCase();
    const nombre2Lower = nombre2.toLowerCase();
    return nombre1Lower.includes(nombre2Lower) || nombre2Lower.includes(nombre1Lower);
}



/**
 * Combina el JSON base de canales con el resultado parseado desde un .m3u
 * verificando coincidencias aproximadas y registrando trazas del proceso.
 * @param {Record<string, any>} parseM3u - colección de canales provenientes del .m3u.
 * @param {{ origen?: string, fuente?: string }} [options]
 */
function combinarCanalesConLista(parseM3u = {}, { origen = 'lista-desconocida', fuente = null, combinarCoincidencias } = {}) {
    if (!parseM3u || typeof parseM3u !== 'object') return;

    if (!channelsList) {
        channelsList = {};
    }

    const debeCombinarCoincidencias =
        typeof combinarCoincidencias === 'boolean' ? combinarCoincidencias : obtenerPreferenciaCombinarCanales();

    const mapCanales = {};
    if (debeCombinarCoincidencias) {
        for (const canal of Object.keys(channelsList)) {
            const nombreLista = channelsList[canal].nombre ?? 'Canal sin nombre';
            mapCanales[nombreLista] = channelsList[canal];
        }
    }

    const clavesM3u = Object.keys(parseM3u);
    console.groupCollapsed(`[teles][m3u] Procesando ${clavesM3u.length} canales desde ${origen}`);
    for (const nombreCanal of clavesM3u) {
        const datosNuevos = parseM3u[nombreCanal];
        const nombreParseM3u = datosNuevos.nombre ?? 'Canal sin nombre';
        let existingChannel = null;

        if (debeCombinarCoincidencias) {
            for (const nombreLista in mapCanales) {
                if (sonNombresSimilares(nombreLista, nombreParseM3u)) {
                    existingChannel = mapCanales[nombreLista];
                    break;
                }
            }
        }

        if (debeCombinarCoincidencias && existingChannel) {
            existingChannel.señales = existingChannel.señales || {};
            const m3u8Actuales = Array.isArray(existingChannel.señales.m3u8_url)
                ? existingChannel.señales.m3u8_url
                : (existingChannel.señales.m3u8_url ? [existingChannel.señales.m3u8_url] : []);

            existingChannel.señales.m3u8_url = m3u8Actuales;

            const nuevasUrls = (datosNuevos.señales?.m3u8_url ?? [])
                .filter(url => url && !m3u8Actuales.includes(url));
            existingChannel.señales.m3u8_url.push(...nuevasUrls);

            const origenBase = existingChannel.origenListaOriginal ?? existingChannel.origenLista ?? ORIGEN_PREDETERMINADO;
            existingChannel.origenListaOriginal = origenBase;
            existingChannel.origenLista = origenBase;

            if (fuente && !existingChannel.fuenteLista) {
                existingChannel.fuenteLista = fuente;
            }

            const fuentesPrevias = Array.isArray(existingChannel.fuentesCombinadas) && existingChannel.fuentesCombinadas.length > 0
                ? existingChannel.fuentesCombinadas
                : [origenBase];
            if (origen && !fuentesPrevias.includes(origen)) {
                fuentesPrevias.push(origen);
            }
            existingChannel.fuentesCombinadas = fuentesPrevias;
            existingChannel.esSeñalCombinada = existingChannel.fuentesCombinadas.length > 1;

            console.info('[teles][m3u] Canal existente actualizado', {
                origen,
                idInterno: nombreCanal,
                nombre: nombreParseM3u,
                urlsPrevias: m3u8Actuales,
                urlsAgregadas: nuevasUrls,
                totalSeñales: existingChannel.señales.m3u8_url.length
            });
        } else {
            datosNuevos.origenLista = origen;
            datosNuevos.origenListaOriginal = origen;
            if (fuente) datosNuevos.fuenteLista = fuente;
            datosNuevos.fuentesCombinadas = origen ? [origen] : [];
            datosNuevos.esSeñalCombinada = false;
            const idResultado = obtenerIdCanalDisponible(nombreCanal, nombreParseM3u, origen);
            channelsList[idResultado] = datosNuevos;

            console.info('[teles][m3u] Canal nuevo añadido', {
                origen,
                idInterno: idResultado,
                nombre: nombreParseM3u,
                señales: datosNuevos.señales,
                país: datosNuevos.país,
                categoría: datosNuevos.categoría
            });
        }
    }
    console.groupEnd();
}

/* export async function fetchCargarCanalesIPTV() {
    console.info('Probando carga archivo m3u');
    const m3uResponse = await fetch(URL_M3U_CANALES_IPTV);
    const m3uData = await m3uResponse.text();
    const parseM3u = await M3U_A_JSON(m3uData);
    combinarCanalesConLista(parseM3u, {
        origen: 'IPTV experimental',
        fuente: URL_M3U_CANALES_IPTV,
        combinarCoincidencias: obtenerPreferenciaCombinarCanales()
    });
} */

export async function cargarListaPersonalizadaM3U(url) {
    if (!url || typeof url !== 'string') {
        throw new Error('Debes proporcionar una URL válida a un archivo .m3u');
    }

    console.info(`Cargando lista personalizada desde: ${url}`);
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`No se pudo cargar la lista personalizada (estado ${response.status})`);
    }

    const m3uData = await response.text();
    const parseM3u = await M3U_A_JSON(m3uData);
    const etiqueta = obtenerEtiquetaParaLista(url);

    combinarCanalesConLista(parseM3u, {
        origen: etiqueta,
        fuente: url,
        combinarCoincidencias: obtenerPreferenciaCombinarCanales()
    });
    guardarListaPersonalizada(url, { etiqueta, canales: parseM3u });
}

export async function cargarListaPersonalizadaDesdeTexto(contenido, opciones = {}) {
    if (!contenido || typeof contenido !== 'string') {
        throw new Error('Debes proporcionar el contenido de un archivo .m3u en texto');
    }

    const { esValido, errores } = validarTextoM3U(contenido);
    if (!esValido) {
        throw new Error(errores.join(' '));
    }

    const { etiqueta, clave } = opciones;
    const parseM3u = await M3U_A_JSON(contenido);

    const etiquetaFinal = etiqueta || 'Lista manual';
    const claveLista = clave || etiquetaFinal;

    combinarCanalesConLista(parseM3u, {
        origen: etiquetaFinal,
        fuente: claveLista,
        combinarCoincidencias: obtenerPreferenciaCombinarCanales()
    });

    guardarListaPersonalizada(claveLista, { etiqueta: etiquetaFinal, canales: parseM3u });
}

export function restaurarListasPersonalizadas() {
    const listas = leerListasPersonalizadas();
    const urls = Object.keys(listas).filter(url => listas[url]?.pinned !== false);
    if (!urls.length) return 0;
    console.info(`[teles][m3u] Restaurando ${urls.length} listas personalizadas fijadas`);
    let restauradas = 0;
    urls.forEach(url => {
        try {
            const { etiqueta = url, canales } = listas[url];
            if (!canales) return;
            combinarCanalesConLista(canales, {
                origen: etiqueta,
                fuente: url,
                combinarCoincidencias: obtenerPreferenciaCombinarCanales()
            });
            restauradas++;
        } catch (error) {
            console.error(`No se pudo restaurar lista personalizada ${url}`, error);
        }
    });

    return restauradas;
}

function obtenerEtiquetaParaLista(url) {
    try {
        const parsed = new URL(url);
        const hostname = parsed.hostname?.replace(/^www\./, '') ?? url;
        const slug = parsed.pathname.split('/').filter(Boolean).pop();
        return slug ? `${hostname} / ${slug}` : hostname;
    } catch {
        return url;
    }
}

function leerListasPersonalizadas() {
    try {
        const payload = localStorage.getItem(LS_KEY_PERSONALIZED_LISTS);
        if (!payload) return {};
        return JSON.parse(payload) ?? {};
    } catch {
        return {};
    }
}

function guardarListaPersonalizada(url, lista) {
    const listas = leerListasPersonalizadas();
    listas[url] = {
        etiqueta: lista.etiqueta,
        canales: lista.canales,
        actualizado: new Date().toISOString(),
        pinned: lista.pinned ?? true
    };
    localStorage.setItem(LS_KEY_PERSONALIZED_LISTS, JSON.stringify(listas));
}

export function obtenerListasPersonalizadas() {
    return leerListasPersonalizadas();
}

export function actualizarListaPersonalizada(url, cambios = {}) {
    const listas = leerListasPersonalizadas();
    if (!listas[url]) return;
    listas[url] = { ...listas[url], ...cambios, actualizado: new Date().toISOString() };
    localStorage.setItem(LS_KEY_PERSONALIZED_LISTS, JSON.stringify(listas));
}

export function eliminarListaPersonalizada(url) {
    const listas = leerListasPersonalizadas();
    if (!listas[url]) return;
    delete listas[url];
    localStorage.setItem(LS_KEY_PERSONALIZED_LISTS, JSON.stringify(listas));
}

export function aplicarListaPersonalizadaGuardada(url) {
    const listas = leerListasPersonalizadas();
    const data = listas[url];
    if (!data || !data.canales) return false;
    combinarCanalesConLista(data.canales, {
        origen: data.etiqueta ?? url,
        fuente: url,
        combinarCoincidencias: obtenerPreferenciaCombinarCanales()
    });
    return true;
}

/**
 * Obtiene la preferencia del usuario para combinar canales similares.
 * @returns {boolean} `true` cuando se deben combinar coincidencias aproximadas.
 */
export function obtenerPreferenciaCombinarCanales() {
    const valor = localStorage.getItem(LS_KEY_COMBINE_PERSONALIZED_CHANNELS) ?? 'true';
    return valor;
}

/**
 * Permite actualizar la preferencia sobre combinar coincidencias aproximadas.
 * @param {boolean} combinar - Nuevo estado deseado.
 */
export function establecerPreferenciaCombinarCanales(combinar) {
    localStorage.setItem(LS_KEY_COMBINE_PERSONALIZED_CHANNELS, combinar ? 'true' : 'false');
}

/**
 * Genera un identificador único para los canales agregados desde listas externas.
 * @param {string} [baseId] - Identificador sugerido proveniente del archivo .m3u.
 * @param {string} [nombreFallback] - Nombre del canal utilizado como respaldo para crear el slug.
 * @param {string} [origen] - Texto adicional utilizado para evitar colisiones.
 * @returns {string} ID disponible dentro de `channelsList`.
 */
function obtenerIdCanalDisponible(baseId = '', nombreFallback = '', origen = '') {
    const slugBase = slugifyValor(baseId || nombreFallback || origen || `canal-${Date.now()}`);
    if (!channelsList?.[slugBase]) {
        return slugBase;
    }
    let correlativo = 2;
    let candidato = `${slugBase}-${correlativo}`;
    while (channelsList?.[candidato]) {
        correlativo += 1;
        candidato = `${slugBase}-${correlativo}`;
    }
    return candidato;
}

/**
 * Normaliza un texto para que pueda utilizarse como parte de un ID.
 * @param {string} valor - Texto original.
 * @returns {string} Texto en minúsculas, sin acentos y sin caracteres especiales.
 */
function slugifyValor(valor = '') {
    return valor
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