import { claseBotonPrimaria } from './main.js'
import { codigosBanderas } from './codigosBanderas.js'

// ----- filtro de canales https://css-tricks.com/in-page-filtered-search-with-vanilla-javascript/
function normalizarInput(normalizarEsto) {
  return normalizarEsto.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

function mostrarAlertaDeNoCoincidenciasBusqueda(elemento, ocultar, textoQueNoFueEncontrado) {
  elemento.classList.toggle('d-none', ocultar);
  elemento.querySelector('span').textContent = textoQueNoFueEncontrado;
}

// filtro canales
export function filtrarCanalesPorInput(e, containerBotonesDeCanales) {
  const idContainerBotonesCanales = containerBotonesDeCanales.id;
  const inputNormalizado = normalizarInput(e);
  const botonesDentroDeContainerBotonesDeCanales = containerBotonesDeCanales.querySelectorAll('button');
  if (idContainerBotonesCanales.startsWith('modal')) {
    filtrarCanales(idContainerBotonesCanales, botonesDentroDeContainerBotonesDeCanales, inputNormalizado, document.querySelector('.modal-mensaje-alerta'), document.querySelector('#modal-collapse-botones-listado-filtro-paises'));
  } else if (idContainerBotonesCanales.startsWith('offcanvas')) {
    filtrarCanales(idContainerBotonesCanales, botonesDentroDeContainerBotonesDeCanales, inputNormalizado, document.querySelector('.offcanvas-mensaje-alerta'), document.querySelector('#offcanvas-collapse-botones-listado-filtro-paises'));
  } else if (idContainerBotonesCanales.startsWith('autocomplete')) {
    filtrarCanales(idContainerBotonesCanales, botonesDentroDeContainerBotonesDeCanales, inputNormalizado, document.querySelector('.modal-cambiar-mensaje-alerta'), document.querySelector('#autocomplete-collapse-botones-listado-filtro-paises'));
  }
}

function filtrarCanales(idContainerBotonesCanalesRecibido, containerBotonesDeCanales, inputNormalizadoRecibido, mensajeAlerta, containerBotonesFiltroPorPais) {
  let algunaCoincidencia = false;

  const botonesDentroDeContainerBotonesFiltroPorPais = containerBotonesFiltroPorPais.querySelectorAll('button');
  let filtroPorPaisActivo
  botonesDentroDeContainerBotonesFiltroPorPais.forEach(btn => {
    if (btn.classList.contains(claseBotonPrimaria)) {
      filtroPorPaisActivo = btn.dataset.country
      filtroPorPaisActivo = codigosBanderas[filtroPorPaisActivo]
    }
  })
  containerBotonesDeCanales.forEach(btn => {
    if (filtroPorPaisActivo !== undefined) {  // SI FILTRO POR PAIS ESTA ACTIVO
      if (btn.dataset.country === filtroPorPaisActivo) {  // SI VALOR BOTON CANAL CALZA CON FILTRO ACTIVO
        const contenidoBtnNormalized = normalizarInput(`${btn.dataset.country} - ${btn.textContent}`); // contenido de boton de canal
        const coincidencia = contenidoBtnNormalized.includes(inputNormalizadoRecibido);
        btn.classList.toggle('d-none', !coincidencia);
        if (coincidencia) {
          algunaCoincidencia = true;
        }
      } else {
        btn.classList.add('d-none') // SI NO CALZA FILTRO CON VALOR DATASET DE BOTON OCULTALO NOMAS
      }


    } else {
      const contenidoBtnNormalized = normalizarInput(`${btn.dataset.country} - ${btn.textContent}`); // contenido de boton de canal
      const coincidencia = contenidoBtnNormalized.includes(inputNormalizadoRecibido);
      btn.classList.toggle('d-none', !coincidencia);
      if (coincidencia) {
        algunaCoincidencia = true;
      }
    }






    if (inputNormalizadoRecibido === '') {
      if (idContainerBotonesCanalesRecibido.startsWith('modal')) {
        restaurarEstadoMostrarTodoPais(document.querySelector(`#modal-btn-mostrar-todo-pais`), containerBotonesDeCanales, document.querySelectorAll('#modal-collapse-botones-listado-filtro-paises button:not(#modal-btn-mostrar-todo-pais)'))
      } else if (idContainerBotonesCanalesRecibido.startsWith('offcanvas')) {
        restaurarEstadoMostrarTodoPais(document.querySelector(`#offcanvas-btn-mostrar-todo-pais`), containerBotonesDeCanales, document.querySelectorAll('#offcanvas-collapse-botones-listado-filtro-paises button:not(#offcanvas-btn-mostrar-todo-pais)'))
      } else if (idContainerBotonesCanalesRecibido.startsWith('autocomplete')) {
        restaurarEstadoMostrarTodoPais(document.querySelector(`#autocomplete-btn-mostrar-todo-pais`), containerBotonesDeCanales, document.querySelectorAll('#autocomplete-collapse-botones-listado-filtro-paises button:not(#autocomplete-btn-mostrar-todo-pais)'))
      }
    }
  });

  mostrarAlertaDeNoCoincidenciasBusqueda(mensajeAlerta, algunaCoincidencia, inputNormalizadoRecibido);
}

function restaurarEstadoMostrarTodoPais(btnMostrarTodoPais, containerBotonesDeCanales, botonesDentroContainerCollapseBotonesFiltroPaises) {
  btnMostrarTodoPais.classList.remove('btn-outline-secondary');
  btnMostrarTodoPais.classList.add(claseBotonPrimaria);
  containerBotonesDeCanales.forEach(btn => {
    if (btn.classList.contains('d-none')) {
      btn.classList.remove('d-none');
    }
  });

  botonesDentroContainerCollapseBotonesFiltroPaises.forEach(btn => {
    btn.classList.remove(claseBotonPrimaria);
    btn.classList.add('btn-outline-secondary');
  });
}