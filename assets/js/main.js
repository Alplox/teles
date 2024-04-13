/* 
  main v0.17
  by Alplox 
  https://github.com/Alplox/teles
*/

// MARK: import
import { activarTooltipsBootstrap, removerTooltipsBootstrap } from './F_enableTooltipBS.js';
import { ocultarTextoBotonesOverlay } from './F_ocultarTextoBotonesOverlay.js';
import {
  guardarOrdenOriginal,
  sortButtonsAsc,
  sortButtonsDesc,
  restoreOriginalOrder,
  ordenOriginalEnModal
} from './F_ordenBotones.js';
import { codigosBanderas } from './codigosBanderas.js';
import { filtrarCanalesPorInput } from './F_filtroCanales.js';
import { alternarPosicionBotonesFlotantes, clicBotonPosicionBotonesFlotantes } from './F_moverBotonesFlotantes.js';
import { revisarConexion } from './F_revisarConexion.js';
import { activarBotonTransmisionesPorFila, ajustarClaseColTransmisionesPorFila } from './F_ajustarClasesCanalesActivos.js';

// MARK: Variables botones CSS
export let claseBotonPrimaria = 'btn-indigo';
export let claseBotonPrimariaOutline = 'btn-outline-indigo';
export let claseBotonSecundaria = 'btn-dark-subtle'

// MARK: LocalStorage
/* 
 _    ___   ___   _   _    ___ _____ ___  ___    _   ___ ___ 
| |  / _ \ / __| /_\ | |  / __|_   _/ _ \| _ \  /_\ / __| __|
| |_| (_) | (__ / _ \| |__\__ \ | || (_) |   / / _ \ (_ | _| 
|____\___/ \___/_/ \_\____|___/ |_| \___/|_|_\/_/ \_\___|___|
*/
// ----- RECORDAR CANALES ACTIVOS CON LOCALSTORAGE
// https://www.javascripttutorial.net/web-apis/javascript-localstorage/
// https://stackoverflow.com/a/23728844
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/delete

// pasar item [STRING] de localstorage a una variable (aunque no exista aún)
let lsCanales = localStorage.getItem('canales_storage');
// variable vacía, obtiene valor si localstorage posee el item 'canales_storage'
let lsCanalesJson;
// variable que almacena string/json durante intercambio para localstorage
let canalesStorage = {};

if (lsCanales !== null) {
  // pasa string de localstorage a una variable objeto [JSON]
  lsCanalesJson = JSON.parse(window.localStorage.getItem('canales_storage'));
  // solo para info rápida desde la consola (opcional dejarlo)
  console.log(`Tienes [${Object.entries(lsCanalesJson).length}] canales en tú localStorage = ${JSON.stringify(Object.values(lsCanalesJson).join(' - '))}`);
}

// ----- MODAL BIENVENIDA CON LOCALSTORAGE PARA QUE NO VUELVA A APARECER AL HACER CLIC EN BOTÓN
const modalBienvenida = new bootstrap.Modal(document.querySelector('#modal-bienvenida'), {});
const btnEntendido = document.querySelector('#btn-entendido');
btnEntendido.addEventListener('click', () => {
  modalBienvenida.hide();
  localStorage.setItem('modal_status', 'hide');
});

// ----- mostrar/ocultar utilizados en overlays/navbar/texto botones flotantes/tarjeta fondo
function checkboxOn(checkbox, status, item) {
  checkbox.checked = true;
  status.textContent = '[Visible]';
  localStorage.setItem(item, 'show');
};

function checkboxOff(checkbox, status, item) {
  checkbox.checked = false;
  status.textContent = '[Oculto]';
  localStorage.setItem(item, 'hide');
};


// ocultar navbar
const navbarCheckbox = document.querySelector('#switch-navbar');
const navbarStatus = document.querySelector('#status-navbar > span');
const navbar = document.querySelector('nav');

navbarCheckbox.addEventListener('click', () => {
  navbar.classList.toggle('d-none', !navbarCheckbox.checked);
  (navbarCheckbox.checked ? checkboxOn : checkboxOff)(navbarCheckbox, navbarStatus, 'navbar');
});

// ocultar overlay
const overlayCheckbox = document.querySelector('#switch-overlay');
const overlayStatus = document.querySelector('#status-overlay > span');

const botonesIndividualesPersonalizarDentroOverlay = document.querySelectorAll('#grupo-botones-personalizar-botones-dentro-overlay .btn-check');
const spanBotonesIndividualesPersonalizarDentroOverlay = document.querySelectorAll('#grupo-botones-personalizar-botones-dentro-overlay span');

overlayCheckbox.addEventListener('click', () => {
  document.body.classList.toggle('d-none__barras-overlay', !overlayCheckbox.checked);
  (overlayCheckbox.checked ? checkboxOn : checkboxOff)(overlayCheckbox, overlayStatus, 'overlay');

  botonesIndividualesPersonalizarDentroOverlay.forEach(btn => {
    overlayCheckbox.checked
      ? (btn.checked = true, btn.disabled = false, document.body.classList.remove('d-none__barras-overlay__overlay-boton-mover', 'd-none__barras-overlay__overlay-boton-cambiar', 'd-none__barras-overlay__overlay-boton-pagina-oficial', 'd-none__barras-overlay__overlay-boton-quitar'))
      : (btn.checked = false, btn.disabled = true)
  })

  spanBotonesIndividualesPersonalizarDentroOverlay.forEach(span => {
    overlayCheckbox.checked ? span.innerHTML = "[visible]" : span.innerHTML = "[oculto]"
  })

  if (overlayCheckbox.checked) {
    localStorage.setItem('overlay-boton-mover', 'show');
    localStorage.setItem('overlay-boton-cambiar', 'show');
    localStorage.setItem('overlay-boton-pagina-oficial', 'show');
    localStorage.setItem('overlay-boton-quitar', 'show');
  }

  ocultarTextoBotonesOverlay() // siempre al final. Evalúa si botones overlay están haciendo desbordamiento
});

let contenedoresBotonesIndividualesPersonalizarDentroOverlay = document.querySelectorAll('#grupo-botones-personalizar-botones-dentro-overlay .containerPersonalizarBoton')

contenedoresBotonesIndividualesPersonalizarDentroOverlay.forEach(btn => {
  btn.addEventListener('click', () => {
    let idMasClaseBoton = btn.querySelector('.btn-check').dataset.botonoverlay;
    document.body.classList.toggle(`d-none__barras-overlay__${idMasClaseBoton}`, !btn.querySelector('.btn-check').checked);
    btn.querySelector('.btn-check').checked ? btn.querySelector('span').innerHTML = "[visible]" : btn.querySelector('span').innerHTML = "[oculto]"

    ocultarTextoBotonesOverlay() // siempre al final. Evalúa si botones overlay están haciendo desbordamiento
    //queda guardar en localstorage y luego cargarlo a la primera carga

    localStorage.setItem(idMasClaseBoton, btn.querySelector('.btn-check').checked ? 'show' : 'hide');
  })
})



// ----- slider tamaño
const slider = document.querySelector('#tamaño-streams');
const sliderValue = document.querySelector('.slider-label div > span');
const canalesGrid = document.querySelector('#canales-grid');

slider.addEventListener('input', (event) => {
  sliderValue.innerHTML = event.target.value;
  canalesGrid.style.maxWidth = `${event.target.value}%`;
  localStorage.setItem('slider_value', event.target.value);
  ocultarTextoBotonesOverlay();
});

// ----- selector numero canales por fila
let valorColumnaParaEscritorio = 4;
let valorColumnaParaTelefono = 12;
let botonesPersonalizarTransmisionesPorFila = document.querySelectorAll('#transmision-por-fila button');

botonesPersonalizarTransmisionesPorFila.forEach(btn => {
  btn.addEventListener('click', (event) => {
    activarBotonTransmisionesPorFila(btn.value)
    // guarda valores de value
    valorColumnaParaEscritorio = event.target.value;
    valorColumnaParaTelefono = event.target.value;
    localStorage.setItem('numero_canales_por_fila', event.target.value);
    ajustarClaseColTransmisionesPorFila(event.target.value)
    ocultarTextoBotonesOverlay()
  })
})

// ocultar texto botones flotantes
const textoBotonesFlotantesCheckbox = document.querySelector('#switch-texto-botones-flotantes');
const textoBotonesFlotantesCheckboxStatus = document.querySelector('#status-texto-botones-flotantes > span');
const spansTextoBotonesFlotantesCheckbox = document.querySelectorAll('#grupo-botones-flotantes button>span');
const textoBotonesFlotantesStatusIcon = document.querySelector('#status-texto-botones-flotantes i');

textoBotonesFlotantesCheckbox.addEventListener('click', () => {
  spansTextoBotonesFlotantesCheckbox.forEach((button) => {
    button.classList.toggle('d-none', !textoBotonesFlotantesCheckbox.checked);
  });

  (textoBotonesFlotantesCheckbox.checked ? checkboxOn : checkboxOff)(textoBotonesFlotantesCheckbox, textoBotonesFlotantesCheckboxStatus, 'texto_botones_flotantes');

  if (textoBotonesFlotantesCheckbox.checked) {
    textoBotonesFlotantesStatusIcon.classList.remove('bi-square')
    textoBotonesFlotantesStatusIcon.classList.add('bi-info-square')
  } else {
    textoBotonesFlotantesStatusIcon.classList.remove('bi-info-square')
    textoBotonesFlotantesStatusIcon.classList.add('bi-square')
  }
});

// ocultar fondo
const fondoCheckbox = document.querySelector('#switch-fondo');
const fondoStatus = document.querySelector('#status-fondo > span');
const fondoStatusIcon = document.querySelector('#status-fondo i');
const fondoTarjetaLogo = document.querySelector('#container-tarjeta-logo-fondo');

fondoCheckbox.addEventListener('click', () => {
  fondoTarjetaLogo.classList.toggle('d-none', !fondoCheckbox.checked);
  (fondoCheckbox.checked ? checkboxOn : checkboxOff)(fondoCheckbox, fondoStatus, 'fondo');

  if (fondoCheckbox.checked) {
    fondoStatusIcon.classList.remove('bi-eye-slash')
    fondoStatusIcon.classList.add('bi-eye')
  } else {
    fondoStatusIcon.classList.remove('bi-eye')
    fondoStatusIcon.classList.add('bi-eye-slash')
  }
});

// revisa si usuario ya modifico este valor y aplica ajustes para mostrarlo en sidepanel personalizaciones de forma acorde
function cargarTransmisionesPorFila() {
  let lsTransmisionesFila = localStorage.getItem('numero_canales_por_fila')
  if (lsTransmisionesFila !== null) {
    valorColumnaParaEscritorio = lsTransmisionesFila;
    valorColumnaParaTelefono = lsTransmisionesFila;
    activarBotonTransmisionesPorFila(lsTransmisionesFila);
    if (isMobile.any) {
      let transmisionesEnGrid = document.querySelectorAll('div[data-canal]');
      for (let v of transmisionesEnGrid) {
        v.classList.remove('col-12', 'col-6', 'col-4', 'col-3', 'col-2', 'vh-100', 'overflow-hidden');
        v.classList.add(`col-${valorColumnaParaTelefono}`);
      }
    } else {
      ajustarClaseColTransmisionesPorFila(lsTransmisionesFila)
    }
  } else { // si es primera carga === localStorage aun no creado
    if (isMobile.any) {
      activarBotonTransmisionesPorFila(valorColumnaParaTelefono);
      let transmisionesEnGrid = document.querySelectorAll('div[data-canal]');
      for (let v of transmisionesEnGrid) {
        v.classList.remove('col-12', 'col-6', 'col-4', 'col-3', 'col-2', 'vh-100', 'overflow-hidden');
        v.classList.add(`col-${valorColumnaParaTelefono}`);
      }
      localStorage.setItem('numero_canales_por_fila', valorColumnaParaTelefono);
    } else {
      activarBotonTransmisionesPorFila(valorColumnaParaEscritorio);
      ajustarClaseColTransmisionesPorFila(valorColumnaParaEscritorio)
      localStorage.setItem('numero_canales_por_fila', valorColumnaParaEscritorio);
    }
  }
}

// MARK: DOMContentLoaded
// ----- cargar desde localstorage
let lsSlider = localStorage.getItem('slider_value');
let lsFondo = localStorage.getItem('fondo');
let lsNavbar = localStorage.getItem('navbar');
let lsOverlay = localStorage.getItem('overlay');
let lsTextoBotonesFlotantes = localStorage.getItem('texto_botones_flotantes');
let lsModal = localStorage.getItem('modal_status');
let lsPosicionBotonesFlotantes = localStorage.getItem('posicion_botones_flotante');

let lsOverlayBotonMover = localStorage.getItem('overlay-boton-mover');
let lsOverlayBotonCambiar = localStorage.getItem('overlay-boton-cambiar');
let lsOverlayBotonPaginaOficial = localStorage.getItem('overlay-boton-pagina-oficial');
let lsOverlayBotonQuitar = localStorage.getItem('overlay-boton-quitar');


window.addEventListener('DOMContentLoaded', () => {
  // slider tamaño
  if (lsSlider !== null) {
    const sliderValueValue = parseInt(lsSlider) ?? 0;
    slider.setAttribute('value', sliderValueValue);
    sliderValue.innerHTML = sliderValueValue;
    canalesGrid.style.maxWidth = `${sliderValueValue}%`;
  };

  // tarjeta fondo
  if (lsFondo !== 'hide') {
    fondoStatusIcon.classList.remove('bi-eye-slash')
    fondoStatusIcon.classList.add('bi-eye')
    fondoTarjetaLogo.classList.remove('d-none')
    checkboxOn(fondoCheckbox, fondoStatus, 'fondo')
  } else {
    fondoStatusIcon.classList.remove('bi-eye')
    fondoStatusIcon.classList.add('bi-eye-slash')
    fondoTarjetaLogo.classList.add('d-none')
    checkboxOff(fondoCheckbox, fondoStatus, 'fondo')
  }

  // navbar
  lsNavbar !== 'hide'
    ? (navbar.classList.remove('d-none'), checkboxOn(navbarCheckbox, navbarStatus, 'navbar'))
    : (navbar.classList.add('d-none'), checkboxOff(navbarCheckbox, navbarStatus, 'navbar'));

  // overlay
  lsOverlay !== 'hide'
    ? (document.body.classList.remove('d-none__barras-overlay'), checkboxOn(overlayCheckbox, overlayStatus, 'overlay'))
    : (document.body.classList.add('d-none__barras-overlay'), checkboxOff(overlayCheckbox, overlayStatus, 'overlay'));

  botonesIndividualesPersonalizarDentroOverlay.forEach(btn => {
    lsOverlay !== 'hide' ? (btn.checked = true, btn.disabled = false) : (btn.checked = false, btn.disabled = true)
  })

  spanBotonesIndividualesPersonalizarDentroOverlay.forEach(span => {
    lsOverlay !== 'hide' ? span.innerHTML = "[visible]" : span.innerHTML = "[oculto]"
  })

  // cargar valores de cada boton individual de overlay
  const opcionesConfiguracion = [
    { clave: 'overlay-boton-mover', variable: lsOverlayBotonMover },
    { clave: 'overlay-boton-cambiar', variable: lsOverlayBotonCambiar },
    { clave: 'overlay-boton-pagina-oficial', variable: lsOverlayBotonPaginaOficial },
    { clave: 'overlay-boton-quitar', variable: lsOverlayBotonQuitar }
  ];

  contenedoresBotonesIndividualesPersonalizarDentroOverlay.forEach(btn => {
    const idMasClaseBoton = btn.querySelector('.btn-check').dataset.botonoverlay;
    const opcion = opcionesConfiguracion.find(opcion => opcion.clave === idMasClaseBoton);

    if (opcion && opcion.variable === 'hide') {
      btn.querySelector('.btn-check').checked = false;
      document.body.classList.toggle(`d-none__barras-overlay__${idMasClaseBoton}`);

      btn.querySelector('.btn-check').checked
        ? btn.querySelector('span').innerHTML = "[visible]"
        : btn.querySelector('span').innerHTML = "[oculto]";
    }
  });

  // posición botones flotantes
  const botones = document.querySelectorAll('#grupo-botones-posicion-botones-flotantes .btn-check');
  if (lsPosicionBotonesFlotantes) {
    const { top, start, margin, translate } = JSON.parse(lsPosicionBotonesFlotantes);
    alternarPosicionBotonesFlotantes(top, start, margin, translate);

    botones.forEach((boton) => {
      boton.checked = false;
      const botonPosition = boton.dataset.position.split(' '); // Separar la posición del botón

      if (botonPosition[0] === top &&
        botonPosition[1] === start &&
        (botonPosition[2] || '') === (margin || '') &&   // para estos valores dejamos espacio en blanco como respaldo ya que son los valores que varian su uso entre posiciones
        (botonPosition[3] || '') === (translate || '')
      ) {
        boton.checked = true;
      }
    });
  } else { // carga botones flotantes en el centro-bajo por defecto
    alternarPosicionBotonesFlotantes('bottom-0', 'start-50', 'mb-3', 'translate-middle-x');
    botones.forEach((boton) => {
      boton.checked = false;
      if (boton.dataset.position === 'bottom-0 start-50 mb-3 translate-middle-x') {
        boton.checked = true;
      }
    });
  }

  // texto botones flotantes
  if (lsTextoBotonesFlotantes !== 'hide') {
    checkboxOn(textoBotonesFlotantesCheckbox, textoBotonesFlotantesCheckboxStatus, 'texto_botones_flotantes');
    textoBotonesFlotantesStatusIcon.classList.remove('bi-square')
    textoBotonesFlotantesStatusIcon.classList.add('bi-info-square')
  } else {
    spansTextoBotonesFlotantesCheckbox.forEach((button) => {
      button.classList.toggle('d-none', !textoBotonesFlotantesCheckbox.checked);
    });
    checkboxOff(textoBotonesFlotantesCheckbox, textoBotonesFlotantesCheckboxStatus, 'texto_botones_flotantes');
    textoBotonesFlotantesStatusIcon.classList.remove('bi-info-square')
    textoBotonesFlotantesStatusIcon.classList.add('bi-square')
  }

  if (lsModal !== 'hide') {
    modalBienvenida.show();
    localStorage.setItem('modal_status', 'show');
  }

  ocultarTextoBotonesOverlay()
  activarTooltipsBootstrap()

  cargarTransmisionesPorFila()
});

// MARK: Canales
/*
   _____          _   _          _      ______  _____ 
  / ____|   /\   | \ | |   /\   | |    |  ____|/ ____|
 | |       /  \  |  \| |  /  \  | |    | |__  | (___  
 | |      / /\ \ | . ` | / /\ \ | |    |  __|  \___ \ 
 | |____ / ____ \| |\  |/ ____ \| |____| |____ ____) |
  \_____/_/    \_\_| \_/_/    \_\______|______ _____/ 
*/
// Variable global para almacenar listado canales
let listaCanales

// Función para cargar el archivo JSON y almacenarlo en una variable
async function fetchCargarCanales() {
  try {
    console.log('Probando carga archivo principal con canales');
    const response = await fetch('https://raw.githubusercontent.com/Alplox/json-teles/main/canales.json');
    listaCanales = await response.json();
  } catch (error) {
    console.error('Error al cargar el archivo principal canales:', error);
    try {
      // Intenta cargar desde otro enlace como respaldo
      console.log('Probando carga archivo respaldo con canales');
      const responseFallback = await fetch('https://raw.githubusercontent.com/Alplox/teles/92d8b002d10933c6d54631acffaf6d53034f04e8/assets/data/canales.json');
      listaCanales = await responseFallback.json();
    } catch (errorFallback) {
      // Si también falla, muestra el error
      console.error('Error al cargar el archivo canales desde el enlace de respaldo:', errorFallback);
      document.querySelector('main').classList.toggle('d-none');
      document.querySelector('#alerta-error-carga-canales').classList.toggle('d-none');
      document.querySelector('#alerta-error-carga-canales span').innerHTML = `Error: ${errorFallback}`;
    }
  }
}

// MARK: Funciones
// matchingData = listado botones rescatado desde el modal
function displayAutocompleteCanales(matchingData, inputForm) {
  const autocompleteContainer = document.createElement('div');
  autocompleteContainer.classList.add('autocomplete-container', 'shadow', 'd-flex', 'flex-column', 'gap-2');
  let inputId = inputForm.getAttribute('id');
  inputId = inputId.replace('input-de-', 'autocomplete-de-');
  autocompleteContainer.setAttribute('id', inputId);

  // genera boton abajo del input de cada canal para el cambio
  matchingData.forEach(btn => {
    let btnAtr = btn.getAttribute('data-canal');
    let btnAtrDataCountry = btn.getAttribute('data-country');
    let btnP = btn.querySelector('p');
    let btnClass = btn.getAttribute('class'); // rescatar clases boton de modal para mostrar los activos
    let btnPClass = btnP.getAttribute('class'); // rescatar clases párrafo para estilo de titulo a la izquierda e iconos a la derecha
    // almacena item internos del boton del modal si es que existen
    let btnSpan = btnP.querySelector('span') ? btnP.querySelector('span').cloneNode(true) : null;
    let btnImg = btnP.querySelector('img') ? btnP.querySelector('img').cloneNode(true) : null;
    let btnDiv = btnP.querySelector('div') ? btnP.querySelector('div').cloneNode(true) : null;
    // crear boton listado sugerencias a mostrar cuando se haga input
    let sugerencia = document.createElement('button');
    sugerencia.classList.add('sugerencia', 'fs-smaller', 'border-0', 'p-2', 'w-100', ...btnClass.split(' ').filter(className => className !== 'd-none'), ...btnPClass.split(' '))
    sugerencia.setAttribute('data-canal-sugerencia', btnAtr);
    sugerencia.setAttribute('data-country', btnAtrDataCountry);
    sugerencia.setAttribute('data-bs-dismiss', 'modal');
    sugerencia.innerHTML = btnSpan.outerHTML + (btnDiv ? btnDiv.outerHTML : '') + (btnImg ? btnImg.outerHTML : '');

    // que hacer cuando se hace clic en algún canal del listado sugerencias
    sugerencia.addEventListener('click', () => {
      // Obtiene valor de que canal debería ser enviado a "tele.add()", el div donde se debería cargar el canal nuevo
      let idDivPadreSugerencia = sugerencia.closest(".autocomplete-container").id;
      idDivPadreSugerencia = idDivPadreSugerencia.replace('autocomplete-de-', '');
      // Obtiene valor del div donde se va a realizar cambio
      let canalSugerenciaPulsada = sugerencia.getAttribute('data-canal-sugerencia');
      // toma barra activa y la borra
      let barraOverlayDeCanalActivo = document.querySelector(`#overlay-de-canal-${idDivPadreSugerencia}`)
      barraOverlayDeCanalActivo.remove()
      // envía a crear canal con que se va a reemplazar (esto vuelve a generar barra overlay)
      tele.add(canalSugerenciaPulsada, idDivPadreSugerencia)
      // borra div con canales de sugerencia
      autocompleteContainer.remove();
    });
    autocompleteContainer.append(sugerencia);
  });

  let modalBody = document.querySelector(`#Modal-cambiar-${inputId.replace('autocomplete-de-', '')} div.modal-body`)
  modalBody.append(autocompleteContainer);
}

function crearIframe(source, titleIframe, canalId) {
  const fragmentIFRAME = document.createDocumentFragment();
  /* div general canal */
  const div = document.createElement('div');
  div.classList.add('ratio', 'ratio-16x9', 'h-100');
  div.setAttribute('data-canal-cambio', canalId);

  /* div iframe videos */
  const divIFRAME = document.createElement('iframe');
  divIFRAME.src = source;
  divIFRAME.classList.add('pe-auto');
  divIFRAME.setAttribute('contenedor-canal-cambio', canalId);
  divIFRAME.allowFullscreen = true;
  divIFRAME.title = titleIframe
  divIFRAME.referrerPolicy = 'no-referrer';  // para stream 24-horas iframe

  div.append(divIFRAME);
  fragmentIFRAME.append(div);
  return fragmentIFRAME;
};

let clonedFragmentBtnFiltrosBanderasParaAutocomplete
function crearOverlay(nombre, fuente, pais, altIcon, canalId) {
  const fragmentOVERLAY = document.createDocumentFragment();
  let contenido;
  if (!pais && !altIcon) {
    contenido = `<span>${nombre}</span>`;
  } else if (!pais && altIcon) {
    contenido = `<span>${nombre} ${altIcon}</span>`;
  } else {
    contenido = `<span>${nombre} <img src="https://flagcdn.com/${pais.toLowerCase()}.svg" alt="bandera ${codigosBanderas[pais]}" title="${codigosBanderas[pais]}" class="svg-bandera"></span>`;
  }

  let btnMoverEnGrid = document.createElement('button');
  btnMoverEnGrid.classList.add('btn', 'btn-sm', 'btn-secondary', 'p-0', 'px-1', 'd-flex', 'justify-content-center', 'align-items-center', 'gap-1', 'pe-auto', 'handle', 'mt-1', 'rounded-3');
  btnMoverEnGrid.setAttribute('type', 'button');
  btnMoverEnGrid.setAttribute('title', 'Arrastrar y mover este canal');
  btnMoverEnGrid.setAttribute('data-bs-toggle', 'tooltip');
  btnMoverEnGrid.setAttribute('data-bs-title', 'Arrastrar y mover este canal');
  btnMoverEnGrid.id = "overlay-boton-mover"
  btnMoverEnGrid.innerHTML = '<span>Mover</span><i class="bi bi-arrows-move"></i>'

  let btnCambiarSeñal = document.createElement('button');
  btnCambiarSeñal.classList.add('btn', 'btn-sm', 'btn-light', 'top-0', 'end-0', 'p-0', 'px-1', 'd-flex', 'justify-content-center', 'align-items-center', 'gap-1', 'pe-auto', 'mt-1', 'rounded-3');
  btnCambiarSeñal.setAttribute('type', 'button');
  btnCambiarSeñal.setAttribute('title', 'Cambiar este canal');
  btnCambiarSeñal.setAttribute('data-bs-toggle', 'tooltip');
  btnCambiarSeñal.setAttribute('data-bs-title', 'Cambiar este canal');
  btnCambiarSeñal.id = "overlay-boton-cambiar"
  btnCambiarSeñal.innerHTML = '<span>Cambiar</span><i class="bi bi-arrow-repeat"></i>';
  btnCambiarSeñal.setAttribute('data-button-cambio', canalId);
  btnCambiarSeñal.addEventListener('click', () => {
    let fragmentModal = document.createDocumentFragment();
    let modal = document.createElement('div');
    modal.classList.add('modal', 'fade');
    modal.id = `Modal-cambiar-${canalId}`;
    modal.setAttribute('tabindex', '-1');
    modal.setAttribute('aria-labelledby', `Modal-cambiar-${canalId}-label`);
    modal.setAttribute('aria-hidden', 'true');

    let modalDialog = document.createElement('div');
    modalDialog.classList.add('modal-dialog', 'modal-fullscreen-sm-down', 'modal-dialog-scrollable');

    let modalContent = document.createElement('div');
    modalContent.classList.add('modal-content', 'bg-blur', 'border-0');

    let modalHeader = document.createElement('div');
    modalHeader.classList.add('modal-header', 'bg-transparent', 'border-0', 'd-flex', 'flex-column');

    let modalBody = document.createElement('div');
    modalBody.classList.add('modal-body', 'vh-100', 'scrollbar-thin-gray', 'bg-transparent', 'rounded-bottom-3');
    modalBody.setAttribute('id', `autocomplete-modal-body-cambiar-${canalId}`)

    const modalBodyDivInterno = document.createElement('div');

    // Crear el elemento div principal
    const modalMensajeAlertaBusquedaSinCoincidencias = document.createElement('div');
    modalMensajeAlertaBusquedaSinCoincidencias.classList.add('modal-cambiar-mensaje-alerta', 'shadow', 'd-none');
    modalMensajeAlertaBusquedaSinCoincidencias.setAttribute('tabindex', '0');

    // Crear el elemento div interno
    const divInterno = document.createElement('div');
    divInterno.classList.add('d-flex', 'flex-column', 'rounded-3', 'justify-content-center', 'align-items-center', 'text-wrap', 'h-100', 'bg-danger-subtle', 'p-3');

    // Crear el párrafo con el mensaje de alerta
    const mensajeAlerta = document.createElement('p');
    mensajeAlerta.classList.add('fs-4', 'bg-danger', 'p-3', 'rounded-3', 'overflow-auto');
    mensajeAlerta.style.maxHeight = '150px';
    mensajeAlerta.innerHTML = `
          <i class="bi bi-backspace-reverse"></i> 
          No se han encontrado resultados para tu búsqueda (<span class="text-break fst-italic"></span>).
      `;

    // Crear el div para las sugerencias
    const divSugerencias = document.createElement('div');
    divSugerencias.classList.add('bg-danger', 'bg-opacity-10', 'p-3', 'rounded-3', 'text-start');

    // Crear la lista de sugerencias
    const listaSugerencias = document.createElement('ul');
    const sugerencias = ['Asegúrate de que todas las palabras estén escritas correctamente.', 'Prueba diferentes palabras clave.', 'Prueba palabras en español.', 'Desactiva los filtros por país.'];
    sugerencias.forEach(sugerencia => {
      const itemLista = document.createElement('li');
      itemLista.textContent = sugerencia;
      listaSugerencias.appendChild(itemLista);
    });

    // Agregar la lista de sugerencias al div de sugerencias
    divSugerencias.appendChild(listaSugerencias);

    // Agregar el párrafo y el div de sugerencias al div interno
    divInterno.appendChild(mensajeAlerta);
    divInterno.appendChild(divSugerencias);

    // Agregar el div interno al div principal
    modalMensajeAlertaBusquedaSinCoincidencias.appendChild(divInterno);
    modalBodyDivInterno.appendChild(modalMensajeAlertaBusquedaSinCoincidencias);


    let formFloating = document.createElement('div');
    formFloating.classList.add('form-floating', 'w-100');

    let inputCambioCanal = document.createElement('input');
    inputCambioCanal.classList.add('form-control', 'rounded-4');
    inputCambioCanal.type = 'search';
    inputCambioCanal.id = `input-de-${canalId}`;
    inputCambioCanal.placeholder = 'Escribe para buscar...';
    inputCambioCanal.addEventListener('input', (e) => {
      filtrarCanalesPorInput(e.target.value, document.querySelector(`#autocomplete-de-${canalId}`));
    });

    let label = document.createElement('label');
    label.htmlFor = `input-de-${canalId}`;
    label.innerHTML = `Cambiar [${nombre}] por:`;


    // Crear el elemento div
    let divPadreFiltrosModalCambiar = document.createElement('div');
    divPadreFiltrosModalCambiar.classList.add('w-100', 'bg-dark-subtle', 'p-2', 'rounded-3', 'd-flex', 'flex-column', 'mt-2', 'rounded-4');

    let divHijoFiltrosModalCambiar = document.createElement("div");
    divHijoFiltrosModalCambiar.classList.add("d-flex", "gap-2");

    // Crear el botón principal
    let mainButton = document.createElement("button");
    mainButton.classList.add("btn", "btn-sm", "btn-dark", "w-100", "rounded-pill");
    mainButton.setAttribute("type", "button");
    mainButton.setAttribute("data-bs-toggle", "collapse");
    mainButton.setAttribute("data-bs-target", "#autocomplete-collapse-btn-group");
    mainButton.setAttribute("aria-expanded", "false");
    mainButton.setAttribute("aria-controls", "autocomplete-collapse-btn-group");
    mainButton.innerHTML = '<i class="bi bi-funnel"></i> Filtrar por país';

    // Crear el div secundario
    let secondaryDiv = document.createElement("div");
    secondaryDiv.classList.add("ms-auto");

    // Crear el grupo de botones desplegables
    let buttonGroup = document.createElement("div");
    buttonGroup.classList.add("btn-group");

    // Crear el botón desplegable
    let dropdownButton = document.createElement("button");
    dropdownButton.setAttribute("type", "button");
    dropdownButton.classList.add("btn", "btn-sm", "btn-dark", "dropdown-toggle", "h-100", "rounded-pill");
    dropdownButton.setAttribute("data-bs-toggle", "dropdown");
    dropdownButton.setAttribute("aria-expanded", "false");
    dropdownButton.innerHTML = '<i class="bi bi-sort-down"></i> Orden';

    // Crear la lista desplegable
    let dropdownMenu = document.createElement("ul");
    dropdownMenu.classList.add("dropdown-menu", "p-2", "rounded-4");

    // Crear los elementos de la lista desplegable
    let options = [
      { id: "modal-cambiar-boton-orden-ascendente", label: "Ascendente", icon: "bi-sort-alpha-down", funcionUtilizar: sortButtonsAsc },
      { id: "modal-cambiar-boton-orden-descendente", label: "Descendente", icon: "bi-sort-alpha-up-alt", funcionUtilizar: sortButtonsDesc },
      { id: "modal-cambiar-boton-orden-original", label: "Predeterminado", icon: "bi-arrow-clockwise", funcionUtilizar: restoreOriginalOrder, checked: true }
    ];

    options.forEach(function (option) {
      let listItem = document.createElement("li");
      listItem.classList.add("my-1");
      let input = document.createElement("input");
      input.setAttribute("type", "radio");
      input.classList.add("btn-check");
      input.setAttribute("name", "btnRadioAutocomplete");
      input.setAttribute("id", option.id);
      input.setAttribute("autocomplete", "off");
      if (option.checked) {
        input.setAttribute("checked", "checked");
      }
      let label = document.createElement("label");
      label.classList.add("btn", "btn-sm", claseBotonPrimariaOutline, "w-100", "d-flex", "gap-1", "rounded-3");
      label.setAttribute("for", option.id);
      label.innerHTML = `<i class="bi ${option.icon}"></i> ${option.label}`

      label.addEventListener('click', () => {
        option.funcionUtilizar(`autocomplete-de-${canalId}`);
      });

      listItem.append(input);
      listItem.append(label);
      dropdownMenu.append(listItem);
    });

    buttonGroup.append(dropdownButton);
    buttonGroup.append(dropdownMenu);
    secondaryDiv.append(buttonGroup);
    divHijoFiltrosModalCambiar.append(mainButton);
    divHijoFiltrosModalCambiar.append(secondaryDiv);

    // Crear el elemento div
    let collapseDiv = document.createElement('div');
    collapseDiv.classList.add('collapse', 'py-2');
    collapseDiv.id = 'autocomplete-collapse-btn-group';

    // Crear el elemento div con clase "card card-body"
    let cardDiv = document.createElement('div');
    cardDiv.classList.add('card', 'card-body', 'rounded-4');

    // Crear el elemento div con clase "btn-group btn-group-sm container-btn-group"
    let btnGroupDiv = document.createElement('div');
    btnGroupDiv.classList.add('btn-group', 'btn-group-sm', 'container-btn-group');
    btnGroupDiv.setAttribute('role', 'group');
    btnGroupDiv.setAttribute('aria-label', 'Toggle radio para grupo botones');
    btnGroupDiv.id = 'autocomplete-collapse-botones-listado-filtro-paises';

    // Crear el botón dentro del grupo de botones
    let btnMostrarTodoPaisAutocomplete = document.createElement('button');
    btnMostrarTodoPaisAutocomplete.id = 'autocomplete-btn-mostrar-todo-pais';
    btnMostrarTodoPaisAutocomplete.classList.add('btn', claseBotonPrimaria, 'rounded-3');
    btnMostrarTodoPaisAutocomplete.setAttribute('type', 'button');
    btnMostrarTodoPaisAutocomplete.setAttribute('data-country', 'all');

    // Crear el elemento p dentro del botón
    let paragraph = document.createElement('p');
    paragraph.classList.add('m-0', 'd-flex', 'justify-content-between', 'align-items-center', 'text-start', 'gap-2', 'w-100');

    // Crear el texto dentro del párrafo
    let textNode = document.createTextNode('Todos');

    // Crear el elemento span dentro del párrafo
    let span = document.createElement('span');
    span.classList.add('badge', 'bg-secondary', 'rounded-pill');
    span.id = 'autocomplete-span-con-numero-total-canales';
    span.textContent = Object.keys(listaCanales).length
    // Añadir el elemento span al párrafo
    paragraph.append(textNode);
    paragraph.append(span);

    btnMostrarTodoPaisAutocomplete.append(paragraph);

    btnGroupDiv.append(btnMostrarTodoPaisAutocomplete);
    cardDiv.append(btnGroupDiv);
    collapseDiv.append(cardDiv);

    let fragmentoClonado = clonedFragmentBtnFiltrosBanderasParaAutocomplete.cloneNode(true)
    btnGroupDiv.append(fragmentoClonado);

    divPadreFiltrosModalCambiar.append(divHijoFiltrosModalCambiar);
    divPadreFiltrosModalCambiar.append(collapseDiv);

    formFloating.append(inputCambioCanal);
    formFloating.append(label);
    modalHeader.append(formFloating);
    modalHeader.append(divPadreFiltrosModalCambiar);

    let modalFooter = document.createElement('div');
    modalFooter.classList.add('modal-footer', 'bg-transparent', 'border-0', 'd-flex', 'align-items-center', 'justify-content-center');

    let closeButton = document.createElement('button');
    closeButton.type = 'button';
    closeButton.classList.add('btn', 'btn-secondary', 'rounded-pill', 'd-flex', 'justify-content-center', 'align-items-center');
    closeButton.style.height = '2.5rem';  //  https://stackoverflow.com/a/73306474
    closeButton.style.width = '2.5rem';
    closeButton.setAttribute('data-bs-dismiss', 'modal');
    closeButton.innerHTML = '<i class="bi bi-x-lg"></i>';

    modalFooter.append(closeButton);
    modalContent.append(modalHeader)
    modalBody.append(modalBodyDivInterno)
    modalContent.append(modalBody);
    modalContent.append(modalFooter);
    modalDialog.append(modalContent);
    modal.append(modalDialog);

    fragmentModal.append(modal);

    document.body.append(fragmentModal);

    // Activar el modal, darle focus al input si esta en PC y mostrar listado sugerencias canales
    let myModal = new bootstrap.Modal(document.getElementById(`Modal-cambiar-${canalId}`));
    modal.addEventListener('shown.bs.modal', () => {
      !isMobile.any && inputCambioCanal.focus();
      removerTooltipsBootstrap();
      guardarOrdenOriginal(`autocomplete-de-${canalId}`);
    });
    myModal.show();
    displayAutocompleteCanales(ordenOriginalEnModal, inputCambioCanal);

    // seleccionamos los botones insertados del filtro por pais y les añadimos el eventListener (estos debido a que cloneNode NO copia esto si se añadiese durante creación botones)
    document.querySelectorAll('#autocomplete-collapse-botones-listado-filtro-paises button').forEach(btnPaisEnDom => {
      btnPaisEnDom.addEventListener('click', (event) => {
        let botonPulsado = event.currentTarget; // Obtiene una referencia al botón al que se adjuntó el event listener
        encontrarContenedor(botonPulsado, botonPulsado); // Llama a una función para encontrar el contenedor del botón
      });
    });

    // Agregar evento para eliminar el modal del DOM cuando se cierre
    modal.addEventListener('hidden.bs.modal', () => {
      modal.remove();
      activarTooltipsBootstrap();
    });
  });

  const a = document.createElement('a');
  a.innerHTML = contenido + `<i class="bi bi-box-arrow-up-right"></i>`;
  a.title = 'Ir a la página oficial de esta transmisión';
  a.href = fuente;
  a.setAttribute('tabindex', 0);
  a.setAttribute('data-bs-toggle', 'tooltip');
  a.setAttribute('data-bs-title', 'Ir a la página oficial de esta transmisión');
  a.rel = 'noopener nofollow noreferrer';
  a.classList.add('d-flex', 'text-nowrap', 'gap-1', 'btn', 'btn-sm', 'btn-dark', 'p-0', 'px-1', 'pe-auto', 'mt-1', 'rounded-3');
  a.id = "overlay-boton-pagina-oficial"

  const btnRemove = document.createElement('button');
  btnRemove.classList.add('btn', 'btn-sm', 'btn-danger', 'top-0', 'end-0', 'p-0', 'px-1', 'd-flex', 'justify-content-center', 'align-items-center', 'gap-1', 'pe-auto', 'mt-1', 'rounded-3');
  btnRemove.setAttribute('aria-label', 'Close');
  btnRemove.setAttribute('type', 'button');
  btnRemove.setAttribute('title', 'Quitar canal');
  btnRemove.setAttribute('data-bs-toggle', 'tooltip');
  btnRemove.setAttribute('data-bs-title', 'Quitar canal');
  btnRemove.id = "overlay-boton-quitar"
  btnRemove.innerHTML = '<span>Quitar</span><i class="bi bi-x-circle"></i>';
  const audioQuitarCanal = new Audio('assets/sounds/User-Interface-Clicks-and-Buttons-1-por-original_sound.mp3');
  btnRemove.addEventListener('click', () => {
    tele.remove(canalId)
    audioQuitarCanal.play()
  });

  const divOVERLAY = document.createElement('div');
  divOVERLAY.setAttribute('id', `overlay-de-canal-${canalId}`)
  divOVERLAY.classList.add(
    'position-absolute', 'w-100', 'h-100',
    'bg-transparent', 'pe-none', 'me-1',
    'd-flex', 'gap-2', 'justify-content-end', 'align-items-start', 'flex-wrap',
    'top-0', 'end-0', 'barra-overlay');
  /* divOVERLAY.classList.toggle('d-none', !(overlayCheckbox.checked === true || divOVERLAY.classList.contains('d-none'))); */
  divOVERLAY.append(btnMoverEnGrid);
  divOVERLAY.append(btnCambiarSeñal);
  divOVERLAY.append(a);
  divOVERLAY.append(btnRemove);

  fragmentOVERLAY.append(divOVERLAY);
  return fragmentOVERLAY;
};

function encontrarContenedor(elemento, botonPulsado) {
  // Itera hacia arriba en la jerarquía del DOM hasta encontrar el contenedor
  while (elemento.parentNode) {
    elemento = elemento.parentNode;
    let idElemento = elemento.id;
    // vemos si boton tiene valor "data-country" valido para ser usado como "filtro"
    let filtro;
    const country = botonPulsado.dataset.country;
    if (codigosBanderas[country]) {
      filtro = codigosBanderas[country];
    } else if (country === 'Desconocido') {
      filtro = 'Desconocido';
    } else if (country === 'all') {
      filtro = '';
    }
    // revisamos donde filtrar
    if (idElemento.startsWith('modal')) {
      document.querySelectorAll('#modal-collapse-botones-listado-filtro-paises button').forEach(btn => {
        btn.classList.replace(claseBotonPrimaria, 'btn-outline-secondary');
      });
      botonPulsado.classList.replace('btn-outline-secondary', claseBotonPrimaria);
      filtrarCanalesPorInput(filtro, document.querySelector('#modal-body-botones-canales'));
      break;
    }
    else if (idElemento.startsWith('offcanvas')) {
      document.querySelectorAll('#offcanvas-collapse-botones-listado-filtro-paises button').forEach(btn => {
        btn.classList.replace(claseBotonPrimaria, 'btn-outline-secondary');
      });
      botonPulsado.classList.replace('btn-outline-secondary', claseBotonPrimaria);
      filtrarCanalesPorInput(filtro, document.querySelector('#offcanvas-body-botones-canales'));
      break;
    }
    else if (idElemento.startsWith('autocomplete')) {
      let idElementoAutocomplete
      while (elemento.parentNode) {
        elemento = elemento.parentNode;
        idElementoAutocomplete = elemento.id;
        if (idElementoAutocomplete.startsWith('Modal-cambiar-')) {
          idElementoAutocomplete = idElementoAutocomplete.replace('Modal-cambiar-', 'autocomplete-modal-body-cambiar-')
          break;
        }
      }
      document.querySelectorAll('#autocomplete-collapse-botones-listado-filtro-paises button').forEach(btn => {
        btn.classList.replace(claseBotonPrimaria, 'btn-outline-secondary');
      });
      botonPulsado.classList.replace('btn-outline-secondary', claseBotonPrimaria);
      filtrarCanalesPorInput(filtro, document.querySelector(`#${idElementoAutocomplete}`));
      break;
    }
  }
  // Si no se encuentra el contenedor deseado, se puede devolver null o realizar otra acción según tus necesidades
  return null;
}

// MARK: tele
export let tele = {
  add: (canal, divExistenteEnCasoDeCambio) => {
    // listaCanales = canales.json
    if (typeof canal !== 'undefined' && typeof listaCanales[canal] !== 'undefined') {
      let { iframe_url, m3u8_url, yt_id, yt_embed, yt_playlist, nombre, fuente, pais, alt_icon } = listaCanales[canal];

      let fragmentTransmision = document.createDocumentFragment();

      if (divExistenteEnCasoDeCambio) {
        let divPadreACambiar = document.querySelector(`div[data-canal="${divExistenteEnCasoDeCambio}"]`)
        let divExistenteACambiar = document.querySelector(`div[data-canal-cambio="${divExistenteEnCasoDeCambio}"]`)

        // evitar duplicados si canal que va a quedar de reemplazo ya existe en grid
        if (document.querySelector(`div[data-canal="${canal}"]`) && divPadreACambiar !== document.querySelector(`div[data-canal="${canal}"]`)) {
          tele.remove(canal)
        }

        if (typeof iframe_url !== 'undefined') {
          fragmentTransmision.append(crearIframe(iframe_url, nombre, canal), crearOverlay(nombre, fuente, pais, alt_icon, canal));
        } else if (typeof m3u8_url !== 'undefined') {
          const divM3u8 = document.createElement('div');
          divM3u8.classList.add('m3u-stream', 'ratio', 'ratio-16x9', 'h-100');
          divM3u8.setAttribute('data-canal-cambio', canal);
          const videoM3u8 = document.createElement('video');
          videoM3u8.setAttribute('data-canal-m3u', canal);
          videoM3u8.classList.add('m3u-player', 'position-absolute', 'p-0', 'h-100', 'video-js', 'vjs-16-9', 'vjs-fluid');
          videoM3u8.setAttribute('contenedor-canal-cambio', canal);
          videoM3u8.toggleAttribute('controls');
          divM3u8.append(videoM3u8);

          fragmentTransmision.append(divM3u8, crearOverlay(nombre, fuente, pais, alt_icon, canal));
          divPadreACambiar.append(fragmentTransmision);

          let playerM3u8 = videojs(document.querySelector(`video[data-canal-m3u="${canal}"]`));
          playerM3u8.src({
            src: m3u8_url,
            controls: true,
          });
          playerM3u8.autoplay('muted');

          divExistenteACambiar.remove()
        } else if (typeof yt_id !== 'undefined') {
          fragmentTransmision.append(
            crearIframe(`https://www.youtube.com/embed/live_stream?channel=${yt_id}&autoplay=1&mute=1&modestbranding=1&vq=medium&showinfo=0`, nombre, canal),
            crearOverlay(nombre, `https://www.youtube.com/channel/${yt_id}`, pais, alt_icon, canal)
          );
        } else if (typeof yt_embed !== 'undefined') {
          fragmentTransmision.append(
            crearIframe(`https://www.youtube-nocookie.com/embed/${yt_embed}?autoplay=1&mute=1&modestbranding=1&showinfo=0`, nombre, canal),
            crearOverlay(nombre, fuente, pais, alt_icon, canal)
          );
        } else if (typeof yt_playlist !== 'undefined') {
          fragmentTransmision.append(
            crearIframe(`https://www.youtube-nocookie.com/embed/videoseries?list=${yt_playlist}&autoplay=0&mute=0&modestbranding=1&showinfo=0`, nombre, canal),
            crearOverlay(nombre, fuente, pais, alt_icon, canal)
          );
        } else {
          console.log(`${canal} - Canal Inválido`);
        }

        // aplica clases a botones para demostrar que canal ya no esta activo tras reemplazo
        let btnTransmisionOff = document.querySelectorAll(`button[data-canal="${divExistenteEnCasoDeCambio}"]`);
        btnTransmisionOff.forEach(btn => {
          btn.classList.replace(claseBotonPrimaria, claseBotonSecundaria);
        });

        // deja atributo con el canal que se deja activo tras cambio
        divPadreACambiar.setAttribute('data-canal', canal)

        if (typeof m3u8_url === 'undefined') {
          divPadreACambiar.append(fragmentTransmision);
          // quita canal cargado previamente tras cambio
          divExistenteACambiar.remove()
        }

        // capturamos valores de los div para que se pase a borrar el listado canales de localStorage y reemplazado por el orden nuevo, de forma de recordar orden a la siguiente carga 
        const elementsLS = canalesGrid.querySelectorAll('div[data-canal]');
        localStorage.removeItem('canales_storage');
        let canalesStorage = JSON.parse(localStorage.getItem('canales_storage')) || {};

        elementsLS.forEach(element => {
          let divEnGrid = element.querySelector('div[data-canal-cambio]');

          let canal = divEnGrid.getAttribute('data-canal-cambio');
          let nombre = element.querySelector('a span').textContent.trim();

          canalesStorage[canal] = nombre;
        });

        // Guardar el objeto en el almacenamiento local después de completar todas las iteraciones
        localStorage.setItem('canales_storage', JSON.stringify(canalesStorage));

      } else {
        canalesStorage[canal] = nombre;
        localStorage.setItem('canales_storage', JSON.stringify(canalesStorage));
        let divTransmision = document.createElement('div');
        divTransmision.classList.add('position-relative', `col-${isMobile.any ? valorColumnaParaTelefono : valorColumnaParaEscritorio}`, 'shadow');
        divTransmision.setAttribute('data-canal', canal);
        if (typeof iframe_url !== 'undefined') {
          divTransmision.append(crearIframe(iframe_url, nombre, canal), crearOverlay(nombre, fuente, pais, alt_icon, canal));
        } else if (typeof m3u8_url !== 'undefined') {
          const divM3u8 = document.createElement('div');
          divM3u8.classList.add('m3u-stream', 'ratio', 'ratio-16x9', 'h-100');
          divM3u8.setAttribute('data-canal-cambio', canal);
          const videoM3u8 = document.createElement('video');
          videoM3u8.setAttribute('contenedor-canal-cambio', canal);
          videoM3u8.setAttribute('data-canal-m3u', canal);
          videoM3u8.classList.add('m3u-player', 'position-absolute', 'p-0', 'h-100', 'video-js', 'vjs-16-9', 'vjs-fluid');
          videoM3u8.toggleAttribute('controls');
          divM3u8.append(videoM3u8);

          divTransmision.append(divM3u8, crearOverlay(nombre, fuente, pais, alt_icon, canal));
          fragmentTransmision.append(divTransmision);
          canalesGrid.append(fragmentTransmision);

          let playerM3u8 = videojs(document.querySelector(`video[data-canal-m3u="${canal}"]`));
          playerM3u8.src({
            src: m3u8_url,
            controls: true,
          });
          playerM3u8.autoplay('muted');
        } else if (typeof yt_id !== 'undefined') {
          divTransmision.append(
            crearIframe(`https://www.youtube.com/embed/live_stream?channel=${yt_id}&autoplay=1&mute=1&modestbranding=1&vq=medium&showinfo=0`, nombre, canal),
            crearOverlay(nombre, `https://www.youtube.com/channel/${yt_id}`, pais, alt_icon, canal)
          );
        } else if (typeof yt_embed !== 'undefined') {
          divTransmision.append(
            crearIframe(`https://www.youtube-nocookie.com/embed/${yt_embed}?autoplay=1&mute=1&modestbranding=1&showinfo=0`, nombre, canal),
            crearOverlay(nombre, fuente, pais, alt_icon, canal)
          );
        } else if (typeof yt_playlist !== 'undefined') {
          divTransmision.append(
            crearIframe(`https://www.youtube-nocookie.com/embed/videoseries?list=${yt_playlist}&autoplay=0&mute=0&modestbranding=1&showinfo=0`, nombre, canal),
            crearOverlay(nombre, fuente, pais, alt_icon, canal)
          );
        } else {
          console.log(`${canal} - Canal Inválido`);
        }

        if (typeof m3u8_url === 'undefined') {
          fragmentTransmision.append(divTransmision);
          canalesGrid.append(fragmentTransmision);
        }
      }

      let btnTransmisionOn = document.querySelectorAll(`button[data-canal="${canal}"]`);
      btnTransmisionOn.forEach(btn => {
        btn.classList.replace(claseBotonSecundaria, claseBotonPrimaria);
      });

      activarTooltipsBootstrap();
      ocultarTextoBotonesOverlay()
    } else {
      console.log(`${canal} no es válido como canal, revisa si se borró y/o reinicia tu localStorage`);
    }
  },
  remove: (canal) => {
    let transmisionPorRemover = document.querySelector(`div[data-canal="${canal}"]`);

    if (transmisionPorRemover) {
      removerTooltipsBootstrap();
      canalesGrid.removeChild(transmisionPorRemover);
      // cambia clase a botones canal que se encuentran en modal y offcanvas
      let btnTransmisionOff = document.querySelectorAll(`button[data-canal="${canal}"]`);
      btnTransmisionOff.forEach(btn => {
        btn.classList.replace(claseBotonPrimaria, claseBotonSecundaria);
      });
      // remueve de localstorage
      delete canalesStorage[canal];
      localStorage.setItem('canales_storage', JSON.stringify(canalesStorage));
      activarTooltipsBootstrap();
    }
  },
  crearBotonesParaCanales: () => {
    let numeroCanalesConPais = [];

    const fragmentBtn = document.createDocumentFragment();

    for (const canal in listaCanales) {
      let { nombre, pais, alt_icon } = listaCanales[canal];
      let btnTransmision = document.createElement('button');
      btnTransmision.classList.add('btn', claseBotonSecundaria, 'rounded-3');
      btnTransmision.setAttribute('data-canal', canal);

      const pNombreCanalDentroBoton = document.createElement('p');
      pNombreCanalDentroBoton.classList.add('m-0', 'd-flex', 'justify-content-between', 'align-items-center', 'text-start', 'gap-2');

      const spanNombreCanal = document.createElement('span');
      spanNombreCanal.classList.add('flex-grow-1');
      spanNombreCanal.textContent = nombre;
      pNombreCanalDentroBoton.append(spanNombreCanal)

      if (pais && !alt_icon) {
        let img = document.createElement('img');
        let nombrePais = codigosBanderas[pais.toLowerCase()];
        img.setAttribute('src', `https://flagcdn.com/${pais.toLowerCase()}.svg`);
        img.setAttribute('alt', `bandera ${nombrePais}`);
        img.setAttribute('title', nombrePais);
        img.classList.add('h-100', 'm-0', 'svg-bandera');
        btnTransmision.setAttribute('data-country', `${nombrePais}`);
        pNombreCanalDentroBoton.append(img);
        numeroCanalesConPais.push(pais);
      } else if (pais && alt_icon) {
        let iconoAlternativo = document.createElement('div');
        iconoAlternativo.innerHTML = alt_icon;
        pNombreCanalDentroBoton.append(iconoAlternativo)
        let img = document.createElement('img');
        let nombrePais = codigosBanderas[pais.toLowerCase()];
        img.setAttribute('src', `https://flagcdn.com/${pais.toLowerCase()}.svg`);
        img.setAttribute('alt', `bandera ${nombrePais}`);
        img.setAttribute('title', nombrePais);
        img.classList.add('h-100', 'm-0', 'svg-bandera');
        btnTransmision.setAttribute('data-country', `${nombrePais}`);
        pNombreCanalDentroBoton.append(img);
        numeroCanalesConPais.push(pais);
      } else if (!pais && alt_icon) {
        let iconoAlternativo = document.createElement('div');
        iconoAlternativo.innerHTML = alt_icon;
        pNombreCanalDentroBoton.append(iconoAlternativo)
        btnTransmision.setAttribute('data-country', 'Desconocido');
        numeroCanalesConPais.push('Desconocido');
      } else {
        btnTransmision.setAttribute('data-country', 'Desconocido');
        numeroCanalesConPais.push('Desconocido');
      }
      btnTransmision.append(pNombreCanalDentroBoton);
      fragmentBtn.append(btnTransmision);
    }

    // Agregar fragmentos al DOM después de completar el bucle
    document.querySelector('#modal-body-botones-canales').append(fragmentBtn.cloneNode(true));
    document.querySelector('#offcanvas-body-botones-canales').append(fragmentBtn.cloneNode(true));

    // Asignar eventos después de que los botones estén en el DOM
    document.querySelectorAll('#modal-body-botones-canales button, #offcanvas-body-botones-canales button').forEach(btn => {
      btn.addEventListener('click', () => {
        const action = btn.classList.contains(claseBotonSecundaria) ? 'add' : 'remove';
        tele[action](btn.getAttribute('data-canal'));
      });
    });

    // https://www.javascripttutorial.net/array/javascript-remove-duplicates-from-array/
    let paisesSinRepetir = [...new Set(numeroCanalesConPais)];
    // https://stackoverflow.com/a/19395302
    const conteoNumeroCanalesConPais = {};
    numeroCanalesConPais.forEach((x) => { conteoNumeroCanalesConPais[x] = (conteoNumeroCanalesConPais[x] || 0) + 1; });
    // crea fragmento y lo llena con banderas para ser insertadas en modal
    let fragmentBtnsFiltroBanderas = document.createDocumentFragment();
    for (const bandera of paisesSinRepetir) {
      let nombrePais = codigosBanderas[bandera];
      let btnPais = document.createElement('button');
      btnPais.classList.add('btn', 'btn-outline-secondary', 'd-flex', 'justify-content-between', 'align-items-center', 'w-100', 'rounded-3');
      btnPais.setAttribute('type', 'button');
      btnPais.setAttribute('data-country', bandera);

      const pNombreCanalDentroBoton = document.createElement('p');
      pNombreCanalDentroBoton.classList.add('m-0', 'd-flex', 'justify-content-between', 'align-items-center', 'text-start', 'gap-2', 'w-100');

      const spanBtnNombrePais = document.createElement('span');
      spanBtnNombrePais.classList.add('flex-grow-1');
      spanBtnNombrePais.textContent = nombrePais;
      pNombreCanalDentroBoton.append(spanBtnNombrePais)

      let spanBadge = document.createElement('span');
      spanBadge.classList.add('badge', 'bg-secondary'/* , 'rounded-pill' */);
      spanBadge.innerHTML = conteoNumeroCanalesConPais[bandera] || 0;
      if (codigosBanderas[bandera]) {
        let img = document.createElement('img');
        img.setAttribute('src', `https://flagcdn.com/${bandera}.svg`);
        img.setAttribute('alt', `bandera ${nombrePais}`);
        img.setAttribute('title', nombrePais);
        img.classList.add('h-100', 'm-0', 'svg-bandera');
        pNombreCanalDentroBoton.append(img);
        pNombreCanalDentroBoton.append(spanBadge);
        btnPais.append(pNombreCanalDentroBoton)
      } else {
        btnPais.textContent = bandera
        btnPais.append(spanBadge);
      }
      fragmentBtnsFiltroBanderas.append(btnPais);
    }
    // Clona el fragmento para poder agregarlo a modal dinámico de overlay en opción cambiar
    clonedFragmentBtnFiltrosBanderasParaAutocomplete = fragmentBtnsFiltroBanderas.cloneNode(true);

    // Agrega los fragmentos con los botones y sus eventos a los contenedores en el DOM
    document.querySelector('#modal-collapse-botones-listado-filtro-paises').append(fragmentBtnsFiltroBanderas.cloneNode(true));
    document.querySelector('#offcanvas-collapse-botones-listado-filtro-paises').append(fragmentBtnsFiltroBanderas.cloneNode(true));

    // seleccionamos los botones insertados y les añadimos el eventListener (estos debido a que cloneNode NO copia esto si se añadiese durante creación botones)
    // https://developer.mozilla.org/en-US/docs/Web/API/Node/cloneNode#:~:text=It%20does%20not%20copy%20event%20listeners%20added%20using%20addEventListener()
    document.querySelectorAll('#modal-collapse-botones-listado-filtro-paises button, #offcanvas-collapse-botones-listado-filtro-paises button').forEach(btnPaisEnDom => {
      btnPaisEnDom.addEventListener('click', (event) => {
        let botonPulsado = event.currentTarget; // Obtiene una referencia al botón al que se adjuntó el event listener
        encontrarContenedor(botonPulsado, botonPulsado); // Llama a una función para encontrar el contenedor del botón
      });
    });


  },
  cargaCanalesPredeterminados: (valor) => {
    const localStorageCanales = localStorage.getItem('canales_storage');
    const canalesPredeterminados = ['24-horas-2', 'meganoticias-3', 't13-4'];
    const canalesExtras = ['chv-noticias-3', 'galeria-cima', 'lofi-girl'];

    const canalesAgregar = isMobile.any ? canalesPredeterminados : canalesPredeterminados.concat(canalesExtras);

    if (localStorageCanales === null) {
      canalesAgregar.forEach(canal => tele.add(canal));
    } else if (valor === "resetPorUsuario") {
      const audioResetCanales = new Audio('assets/sounds/CRT-turn-on-notification-por-Coolshows101sound.mp3');
      audioResetCanales.play();
      canalesAgregar.forEach(canal => {
        /* cargarTransmisionesPorFila() */ // para que en caso usuario elimine señales una por una, pasar por alto ultimo cambio que realiza observer y asi insertar señales con orden / cantidad desde localStorage
        tele.add(canal);
      })
    } else {
      Object.keys(lsCanalesJson).forEach(canal => tele.add(canal));
    }
  },
  init: async () => {

    await fetchCargarCanales();  // Llamar a la función para realizar el fetch de lista canales

    tele.crearBotonesParaCanales();
    guardarOrdenOriginal('modal-body-botones-canales');
    guardarOrdenOriginal('offcanvas-body-botones-canales');
    tele.cargaCanalesPredeterminados();

    // añaden número total de canales a botones "todos" de los filtros por pais 
    document.querySelector('#modal-span-con-numero-total-canales').textContent = Object.keys(listaCanales).length
    document.querySelector('#offcanvas-span-con-numero-total-canales').textContent = Object.keys(listaCanales).length

  }
};

tele.init();

// MARK: otros
/* 
   ___ _____ ___  ___  ___          _ 
  / _ \_   _| _ \/ _ \/ __| __ ____| |
 | (_) || | |   / (_) \__ \ \ \ / _` |
  \___/ |_| |_|_\\___/|___/ /_\_\__,_|
*/
// plugin para mover canales en grid
new Sortable(canalesGrid, {
  animation: 550,
  handle: '.handle',
  swapThreshold: 1,
  ghostClass: 'marca-al-mover',
});

// Permitir mover divs
canalesGrid.addEventListener("dragstart", () => {
  // busca el div antepuesto en cada canal y le quita clase "pe-none" para poder abarcar todo el tamaño del div del canal para el threshold https://sortablejs.github.io/Sortable/#thresholds
  const elements = canalesGrid.querySelectorAll('.bg-transparent');
  elements.forEach(element => {
    element.classList.toggle('pe-none');
  });
  // removemos tooltips ya que como el propio boton de mover tiene uno, de no quitarlo queda flotando
  removerTooltipsBootstrap();
});

canalesGrid.addEventListener("dragend", () => {
  // Volvemos a activar tooltips para su funcionamiento normal
  activarTooltipsBootstrap();
  // busca el div antepuesto en cada canal y le regresa las clase de "pe-none" para poder hacer clic en iframes o videojs
  const elements = canalesGrid.querySelectorAll('.bg-transparent');
  elements.forEach(element => {
    element.classList.toggle('pe-none');
  });

  // capturamos valores de los div para que se pase a borrar el listado canales de localStorage y reemplazado por el orden nuevo, de forma de recordar orden a la siguiente carga 
  // no es la mejor forma de dar solución a este problema pero es la única que se me ocurrió xd
  const elementsLS = canalesGrid.querySelectorAll('div[data-canal]');
  localStorage.removeItem('canales_storage');
  let canalesStorage = JSON.parse(localStorage.getItem('canales_storage')) || {};

  elementsLS.forEach(element => {
    let divEnGrid = element.querySelector('div[data-canal-cambio]');

    let canal = divEnGrid.getAttribute('data-canal-cambio');
    let nombre = element.querySelector('a span').textContent.trim();

    canalesStorage[canal] = nombre;
  });

  // Guardar el objeto en el almacenamiento local después de completar todas las iteraciones
  localStorage.setItem('canales_storage', JSON.stringify(canalesStorage));
});


// ocultar texto si el tamaño de los botones excede el tamaño del contenedor
window.addEventListener('resize', () => {
  ocultarTextoBotonesOverlay()
});


// Llama a revisarConexion cuando la página se carga por primera vez
window.addEventListener('load', revisarConexion);
// Escucha los cambios en el estado de la conexión
window.addEventListener('online', revisarConexion);
window.addEventListener('offline', revisarConexion);


/* Ordenar botones canales */
let modalBotonOrdenAscendente = document.getElementById('modal-boton-orden-ascendente');
modalBotonOrdenAscendente.addEventListener('click', () => {
  sortButtonsAsc('modal-body-botones-canales');
});

let modalBotonOrdenDescendente = document.getElementById('modal-boton-orden-descendente');
modalBotonOrdenDescendente.addEventListener('click', () => {
  sortButtonsDesc('modal-body-botones-canales');
});

let modalBotonOrdenOriginal = document.getElementById('modal-boton-orden-original');
modalBotonOrdenOriginal.addEventListener('click', () => {
  restoreOriginalOrder('modal-body-botones-canales');
});

let offcanvasBotonOrdenAscendente = document.getElementById('offcanvas-boton-orden-ascendente');
offcanvasBotonOrdenAscendente.addEventListener('click', () => {
  sortButtonsAsc('offcanvas-body-botones-canales');
});

let offcanvasBotonOrdenDescendente = document.getElementById('offcanvas-boton-orden-descendente');
offcanvasBotonOrdenDescendente.addEventListener('click', () => {
  sortButtonsDesc('offcanvas-body-botones-canales');
});

let offcanvasBotonOrdenOriginal = document.getElementById('offcanvas-boton-orden-original');
offcanvasBotonOrdenOriginal.addEventListener('click', () => {
  restoreOriginalOrder('offcanvas-body-botones-canales');
});


// ----- autofocus para filtro canales en PC
const modalBodyBotonesCanales = document.querySelector('#modal-body-botones-canales')
const offcanvasBodyBotonesCanales = document.querySelector('#offcanvas-body-botones-canales')

const filtroCanalesModal = document.querySelector('#modal-input-filtro');
const filtroCanalesOffcanvas = document.querySelector('#offcanvas-input-filtro');

document.querySelector('#modal-canales').addEventListener('shown.bs.modal', () => {
  !isMobile.any && filtroCanalesModal.focus();
});


filtroCanalesModal.addEventListener('input', (e) => {
  filtroCanalesModal.focus()
  filtrarCanalesPorInput(e.target.value, modalBodyBotonesCanales);
});

filtroCanalesOffcanvas.addEventListener('input', (e) => {
  filtroCanalesOffcanvas.focus()
  filtrarCanalesPorInput(e.target.value, offcanvasBodyBotonesCanales);
});

// ----- botones mostrar todos los canales
const btnMostrarTodoPaisModal = document.querySelector('#modal-btn-mostrar-todo-pais');
btnMostrarTodoPaisModal.addEventListener('click', () => {
  filtrarCanalesPorInput('', document.querySelector('#modal-body-botones-canales'));
});

const btnMostrarTodoPaisOffcanvas = document.querySelector('#offcanvas-btn-mostrar-todo-pais');
btnMostrarTodoPaisOffcanvas.addEventListener('click', () => {
  filtrarCanalesPorInput('', document.querySelector('#offcanvas-body-botones-canales'));
});

// Cambiar posición botones flotante
const btnsRadioFlotantes = document.querySelectorAll('#grupo-botones-posicion-botones-flotantes .btn-check');
btnsRadioFlotantes.forEach(btn => {
  btn.addEventListener('click', () => {
    const valoresPosicion = btn.getAttribute('data-position').split(' '); // Obtener los valores del atributo data-position
    clicBotonPosicionBotonesFlotantes(...valoresPosicion);
  });
});