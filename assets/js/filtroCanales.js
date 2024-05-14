import { CLASE_CSS_BOTON_PRIMARIO, PREFIJOS_ID_CONTENEDORES_CANALES, mostrarToast } from './main.js'
import { CODIGOS_PAISES }  from './nombrePaises.js';

function normalizarInput(normalizarEsto) {
  return normalizarEsto.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

function alertaNoCoincidencias(elemento, esOcultar, textoQueNoFueEncontrado) {
  elemento.classList.toggle('d-none', esOcultar);
  elemento.querySelector('span').textContent = textoQueNoFueEncontrado;
}

// filtro canales
export function filtrarCanalesPorInput(valorInput, containerBotonesDeCanales) {
  try {
    const ID_CONTENEDOR_BOTONES_CANALES = containerBotonesDeCanales.id;
    const INPUT_NORMALIZADO = normalizarInput(valorInput);
    const BOTONES_CANALES = containerBotonesDeCanales.querySelectorAll('button');
    for (const PREFIJO of PREFIJOS_ID_CONTENEDORES_CANALES) {
      if (ID_CONTENEDOR_BOTONES_CANALES.startsWith(PREFIJO)) {
        let booleanCoincidencia = false;
        let filtroPorPaisActivo = 'all';

        let botonesFiltroPorPais = document.querySelectorAll(`#${PREFIJO}-collapse-botones-listado-filtro-paises button`);
        botonesFiltroPorPais.forEach(boton => {
          if (boton.classList.contains(CLASE_CSS_BOTON_PRIMARIO)) {
            filtroPorPaisActivo = CODIGOS_PAISES[boton.dataset.country] ?? boton.dataset.country
          }
        })
        BOTONES_CANALES.forEach(boton => {
          let contenidoBotonNormalizado = normalizarInput(`${boton.dataset.country} - ${boton.textContent}`); // contenido de boton de canal
          let esCoincidencia = contenidoBotonNormalizado.includes(INPUT_NORMALIZADO);
          if (filtroPorPaisActivo !== 'all') {
            boton.dataset.country === filtroPorPaisActivo 
            ? (boton.classList.toggle('d-none', !esCoincidencia), esCoincidencia ? booleanCoincidencia = esCoincidencia : booleanCoincidencia) 
            : boton.classList.add('d-none');
          } else {
            boton.classList.toggle('d-none', !esCoincidencia);
            esCoincidencia ? booleanCoincidencia = esCoincidencia : booleanCoincidencia;
          }
        })
        
        alertaNoCoincidencias(document.querySelector(`#${PREFIJO}-mensaje-alerta`), booleanCoincidencia, INPUT_NORMALIZADO);
        break;
      }
    }
  } catch (error) {
    console.error(`Error durante filtrado canales. Error: ${error}`);
    mostrarToast(`
    <span class="fw-bold">Ha ocurrido un error al intentar filtrar canales.</span>
    <hr>
    <span class="bg-dark bg-opacity-25 px-2 rounded-3">Error: ${error}</span>
    <hr>
    Si error persiste tras recargar, prueba borrar tu almacenamiento local desde el panel "Personalización" o borrando la caché del navegador.
    <button type="button" class="btn btn-light rounded-pill btn-sm w-100 border-light mt-2" onclick="location.reload()"> Pulsa para recargar <i class="bi bi-arrow-clockwise"></i></button>`, 'danger')
    return
  }
}