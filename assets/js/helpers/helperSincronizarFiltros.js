import { CLASE_CSS_BOTON_PRIMARIO } from "../constants/index.js";
import {
  obtenerCategoriasPermitidasPorPais,
  obtenerPaisesPermitidosPorCategoria
} from "./helperRelacionesFiltros.js";

const MENSAJE_NO_DISPONIBLE = "No disponible para la combinación seleccionada";

const SELECTORES_MENU = {
  pais: prefijo => `#${prefijo}-collapse-botones-listado-filtro-paises .dropdown-menu`,
  categoria: prefijo => `#${prefijo}-collapse-botones-listado-filtro-categorias .dropdown-menu`
};

/**
 * Devuelve el menú (lista <ul>) para el filtro solicitado dentro de un prefijo.
 * @param {"pais"|"categoria"} tipoFiltro - Identificador del filtro que se desea obtener.
 * @param {string} prefijo - Prefijo del contenedor (ej: modal-canales).
 * @returns {HTMLElement|null} Nodo <ul> del dropdown o null si no existe.
 */
function obtenerMenuFiltro(tipoFiltro, prefijo) {
  if (!prefijo || !SELECTORES_MENU[tipoFiltro]) return null;
  return document.querySelector(SELECTORES_MENU[tipoFiltro](prefijo));
}

/**
 * Aplica o remueve el estado deshabilitado de una opción del dropdown.
 * @param {HTMLLabelElement} label - Etiqueta asociada al input radio.
 * @param {boolean} deshabilitar - Define si se deshabilita (true) o habilita (false).
 * @returns {boolean} true cuando la opción estaba seleccionada y se deshabilitó.
 */
function aplicarEstadoDeshabilitado(label, deshabilitar) {
  if (!label) return false;
  const inputRelacionado = document.getElementById(label.getAttribute("for"));
  if (!inputRelacionado) return false;

  const estabaSeleccionado = inputRelacionado.checked;
  if (!label.dataset.tituloOriginal) {
    label.dataset.tituloOriginal = label.getAttribute("title") ?? "";
  }

  if (deshabilitar) {
    inputRelacionado.checked = false;
    inputRelacionado.disabled = true;
    label.classList.add("disabled", "opacity-50");
    label.setAttribute("aria-disabled", "true");
    label.title = MENSAJE_NO_DISPONIBLE;
    label.classList.remove(CLASE_CSS_BOTON_PRIMARIO);
    if (!label.classList.contains("btn-outline-secondary")) {
      label.classList.add("btn-outline-secondary");
    }
    return estabaSeleccionado;
  }

  inputRelacionado.disabled = false;
  label.classList.remove("disabled", "opacity-50");
  label.removeAttribute("aria-disabled");
  if (label.dataset?.tituloOriginal) {
    label.title = label.dataset.tituloOriginal;
  } else {
    label.removeAttribute("title");
  }
  return false;
}

/**
 * Fuerza la selección de una opción válida (idealmente "all") en el menú indicado.
 * @param {HTMLElement} menu - Dropdown sobre el que se aplicará el fallback.
 * @param {string} dataAttribute - Atributo de dataset que se evalúa ("country" | "category").
 * @returns {void}
 */
function seleccionarFallback(menu, dataAttribute) {
  if (!menu) return;
  const labelFallback = menu.querySelector(`label[data-${dataAttribute}="all"]`) ?? menu.querySelector(`label[data-${dataAttribute}]:not(.disabled)`);
  if (!labelFallback) return;

  const inputFallback = document.getElementById(labelFallback.getAttribute("for"));
  if (!inputFallback || inputFallback.checked) return;

  inputFallback.checked = true;
  inputFallback.dispatchEvent(new Event("change", { bubbles: true }));
}

/**
 * Deshabilita categorías incompatibles con el país seleccionado y fuerza un fallback si es necesario.
 * @param {string} prefijo - Prefijo del contenedor (modal-canales, vision-unica, etc.).
 * @param {string} codigoPaisSeleccionado - Código ISO en minúsculas o "Desconocido".
 * @returns {void}
 */
export function sincronizarCategoriasConPais(prefijo, codigoPaisSeleccionado) {
  const menuCategorias = obtenerMenuFiltro("categoria", prefijo);
  if (!menuCategorias) return;

  const categoriasPermitidas = obtenerCategoriasPermitidasPorPais(codigoPaisSeleccionado);
  let requiereFallback = false;

  menuCategorias.querySelectorAll("label[data-category]").forEach(label => {
    const categoriaValor = label.dataset.category ?? "all";
    const debeDeshabilitar = categoriaValor !== "all" && !categoriasPermitidas.has(categoriaValor);
    if (aplicarEstadoDeshabilitado(label, debeDeshabilitar) && debeDeshabilitar) {
      requiereFallback = true;
    }
  });

  if (requiereFallback) {
    seleccionarFallback(menuCategorias, "category");
  }
}

/**
 * Deshabilita países incompatibles con la categoría seleccionada y fuerza un fallback si es necesario.
 * @param {string} prefijo - Prefijo del contenedor (modal-canales, vision-unica, etc.).
 * @param {string} categoriaSeleccionada - Nombre de categoría en minúsculas o "undefined".
 * @returns {void}
 */
export function sincronizarPaisesConCategoria(prefijo, categoriaSeleccionada) {
  const menuPaises = obtenerMenuFiltro("pais", prefijo);
  if (!menuPaises) return;

  const paisesPermitidos = obtenerPaisesPermitidosPorCategoria(categoriaSeleccionada);
  let requiereFallback = false;

  menuPaises.querySelectorAll("label[data-country]").forEach(label => {
    const paisValor = label.dataset.country ?? "all";
    const debeDeshabilitar = paisValor !== "all" && !paisesPermitidos.has(paisValor);
    if (aplicarEstadoDeshabilitado(label, debeDeshabilitar) && debeDeshabilitar) {
      requiereFallback = true;
    }
  });

  if (requiereFallback) {
    seleccionarFallback(menuPaises, "country");
  }
}
