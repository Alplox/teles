import {
  CSS_CLASS_BUTTON_PRIMARY,
  ID_PREFIX_CONTAINERS_CHANNELS,
  COUNTRY_CODES
} from '../constants/index.js';
import { showToast } from './index.js';

function normalizarInput(normalizarEsto) {
  return normalizarEsto?.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase() ?? '';
}

function alertaNoCoincidencias(elemento, esOcultar, textoQueNoFueEncontrado) {
  if (!elemento) return;
  elemento.classList.toggle('d-none', esOcultar);
  const span = elemento.querySelector('span');
  if (span) span.textContent = textoQueNoFueEncontrado;
}

// filtro canales
export function filtrarCanalesPorInput(valorInput, containerBotonesDeCanales) {
  try {
    if (!containerBotonesDeCanales) return;
    const ID_CONTENEDOR_BOTONES_CANALES = containerBotonesDeCanales.id;
    const INPUT_NORMALIZADO = normalizarInput(valorInput);
    const BOTONES_CANALES = containerBotonesDeCanales.querySelectorAll('button[data-canal]');

    for (const PREFIJO of ID_PREFIX_CONTAINERS_CHANNELS) {
      if (ID_CONTENEDOR_BOTONES_CANALES.startsWith(PREFIJO)) {
        let booleanCoincidencia = false;
        let filtroPorPaisActivo = 'all';
        let filtroPorCategoriaActiva = 'all';

        const elementosFiltroPais = document.querySelectorAll(`#${PREFIJO}-collapse-botones-listado-filtro-paises [data-country]`);
        elementosFiltroPais.forEach(elemento => {
          if (elemento.classList.contains(CSS_CLASS_BUTTON_PRIMARY)) {
            const valorDataset = elemento.dataset.country ?? 'all';
            filtroPorPaisActivo = COUNTRY_CODES[valorDataset] ?? valorDataset;
          }
        });

        const elementosFiltroCategoria = document.querySelectorAll(`#${PREFIJO}-collapse-botones-listado-filtro-categorias [data-category]`);
        elementosFiltroCategoria.forEach(elemento => {
          if (elemento.classList.contains(CSS_CLASS_BUTTON_PRIMARY)) {
            filtroPorCategoriaActiva = elemento.dataset.category ?? 'all';
          }
        });

        const visibilidadGrupos = new Map();

        BOTONES_CANALES.forEach(boton => {
          if (!boton) return;
          const contenidoBotonNormalizado = normalizarInput(`${boton.dataset.country} - ${boton.textContent}`);
          const categoriaCanal = (boton.dataset.category ?? 'undefined').toLowerCase();
          const coincideTexto = contenidoBotonNormalizado.includes(INPUT_NORMALIZADO);
          const contenedorGrupo = boton.closest('.grupo-canales-origen');
          if (contenedorGrupo && !visibilidadGrupos.has(contenedorGrupo)) {
            visibilidadGrupos.set(contenedorGrupo, false);
          }

          const pasaFiltroPais =
            filtroPorPaisActivo === 'all' || boton.dataset.country === filtroPorPaisActivo;

          const pasaFiltroCategoria =
            filtroPorCategoriaActiva === 'all' || categoriaCanal === filtroPorCategoriaActiva;

          const mostrar = coincideTexto && pasaFiltroPais && pasaFiltroCategoria;

          boton.classList.toggle('d-none', !mostrar);
          if (mostrar) {
            booleanCoincidencia = true;
            if (contenedorGrupo) {
              visibilidadGrupos.set(contenedorGrupo, true);
            }
          }
        });

        visibilidadGrupos.forEach((tieneCoincidencias, grupo) => {
          if (!grupo) return;
          grupo.classList.toggle('d-none', !tieneCoincidencias);
        });

        const alerta = document.querySelector(`#${PREFIJO}-mensaje-alerta`);
        alertaNoCoincidencias(alerta, booleanCoincidencia, INPUT_NORMALIZADO);
        break;
      }
    }
  } catch (error) {
    console.error(`Error durante filtrado canales. Error: ${error}`);
    
    showToast({
        title: 'Ha ocurrido un error al intentar filtrar canales.',
        body: `Error: ${error}`,
        type: 'danger',
        autohide: false,
        delay: 0,
        showReloadOnError: true
    });
    return;
  }
}