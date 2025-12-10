import { channelsList } from "../canalesData.js";

const VALOR_PAIS_DESCONOCIDO = "Desconocido";
const VALOR_CATEGORIA_SIN_DEFINIR = "undefined";

/**
 * Construye las relaciones país-categoría en tiempo de ejecución para evitar
 * ciclos de inicialización. Siempre usa el estado más reciente de `channelsList`.
 * @returns {{
 *   mapaCategoriasPorPais: Map<string, Set<string>>,
 *   mapaPaisesPorCategoria: Map<string, Set<string>>,
 *   todasLasCategorias: Set<string>,
 *   todosLosPaises: Set<string>
 * }}
 */
function construirRelaciones() {
  const mapaCategoriasPorPais = new Map();
  const mapaPaisesPorCategoria = new Map();
  const canales = channelsList ? Object.values(channelsList) : [];

  for (const canal of canales) {
    const codigoPais = canal?.país?.trim()
      ? canal.país.toLowerCase()
      : VALOR_PAIS_DESCONOCIDO;
    const categoria = canal?.categoría?.trim()
      ? canal.categoría.toLowerCase()
      : VALOR_CATEGORIA_SIN_DEFINIR;

    if (!mapaCategoriasPorPais.has(codigoPais)) {
      mapaCategoriasPorPais.set(codigoPais, new Set());
    }
    mapaCategoriasPorPais.get(codigoPais).add(categoria);

    if (!mapaPaisesPorCategoria.has(categoria)) {
      mapaPaisesPorCategoria.set(categoria, new Set());
    }
    mapaPaisesPorCategoria.get(categoria).add(codigoPais);
  }

  return {
    mapaCategoriasPorPais,
    mapaPaisesPorCategoria,
    todasLasCategorias: new Set(mapaPaisesPorCategoria.keys()),
    todosLosPaises: new Set(mapaCategoriasPorPais.keys())
  };
}

/**
 * Devuelve el conjunto de categorías disponibles para un país dado.
 * @param {string} codigoPais - Código ISO en minúsculas o "Desconocido".
 * @returns {Set<string>} Categorías permitidas para ese país (o todas si es "all").
 */
export function obtenerCategoriasPermitidasPorPais(codigoPais) {
  const { mapaCategoriasPorPais, todasLasCategorias } = construirRelaciones();
  if (!codigoPais || codigoPais === "all") {
    return todasLasCategorias;
  }
  return mapaCategoriasPorPais.get(codigoPais) ?? new Set();
}

/**
 * Devuelve el conjunto de países donde existe una categoría dada.
 * @param {string} categoria - Nombre de categoría en minúsculas o "undefined".
 * @returns {Set<string>} Países que contienen esa categoría (o todos si es "all").
 */
export function obtenerPaisesPermitidosPorCategoria(categoria) {
  const { mapaPaisesPorCategoria, todosLosPaises } = construirRelaciones();
  if (!categoria || categoria === "all") {
    return todosLosPaises;
  }
  return mapaPaisesPorCategoria.get(categoria) ?? new Set();
}
