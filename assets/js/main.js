/* 
  main v0.16
  by Alplox 
  https://github.com/Alplox/teles
*/

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
let lsModal = localStorage.getItem('modal_status');

if (lsModal !== 'hide') {
  modalBienvenida.show();
  localStorage.setItem('modal_status', 'show');
}

btnEntendido.addEventListener('click', () => {
  if (lsModal !== 'hide') {
    modalBienvenida.hide();
    localStorage.setItem('modal_status', 'hide');
  }
});

// ----- ocultar overlay/navbar/fondo
function checkboxOn(checkbox, status, item) {
  checkbox.checked = true;
  status.textContent = '[ON]';
  localStorage.setItem(item, 'show');
};

function checkboxOff(checkbox, status, item) {
  checkbox.checked = false;
  status.textContent = '[OFF]';
  localStorage.setItem(item, 'hide');
};

// ocultar overlay
const overlayCheckbox = document.querySelector('#switch-overlay');
const overlayStatus = document.querySelector('#status-overlay > span');

overlayCheckbox.addEventListener('click', () => {
  const overlayBarras = document.querySelectorAll('.barra-overlay');
  if (overlayBarras.length === 0) {
    setTimeout(() => {
      overlayStatus.textContent = ' (Agrega canales primero)';
      checkboxOn(overlayCheckbox, overlayStatus, 'overlay');
    }, 1500);
    overlayStatus.textContent = ' (Agrega canales primero)'
  } else {
    overlayBarras.forEach(barra => {
      barra.classList.toggle('d-none', !overlayCheckbox.checked);
      (overlayCheckbox.checked ? checkboxOn : checkboxOff)(overlayCheckbox, overlayStatus, 'overlay');
    });
  }
});

// ocultar navbar
const navbarCheckbox = document.querySelector('#switch-navbar');
const navbarStatus = document.querySelector('#status-navbar > span');
const navbar = document.querySelector('nav');

navbarCheckbox.addEventListener('click', () => {
  navbar.classList.toggle('d-none', !navbarCheckbox.checked);
  (navbarCheckbox.checked ? checkboxOn : checkboxOff)(navbarCheckbox, navbarStatus, 'navbar');
});

// ocultar fondo
const fondoCheckbox = document.querySelector('#switch-fondo');
const fondoStatus = document.querySelector('#status-fondo > span');
const fondo = document.querySelector('.fondo');

fondoCheckbox.addEventListener('click', () => {
  fondo.classList.toggle('d-none', !fondoCheckbox.checked);
  (fondoCheckbox.checked ? checkboxOn : checkboxOff)(fondoCheckbox, fondoStatus, 'fondo');
});

// ----- slider tamaño
const slider = document.querySelector('#tamaño-streams');
const sliderValue = document.querySelector('.slider-label > span');
const canalesGrid = document.querySelector('#canales-grid');

slider.addEventListener('input', (event) => {
  sliderValue.innerHTML = event.target.value;
  canalesGrid.style.maxWidth = `${event.target.value}%`;
  localStorage.setItem('slider_value', event.target.value);
});

// ----- selector numero canales por fila
let size = 4;
let sizeMovil = 12;
let transmisionesFila = document.querySelectorAll('#transmision-por-fila button');

// revisa si usuario ya modifico este valor y aplica ajustes para mostrarlo en sidepanel personalizaciones de forma acorde
let lsTransmisionesFila = localStorage.getItem('numero_canales_por_fila')
if (lsTransmisionesFila !== null) {
  size = lsTransmisionesFila;
  sizeMovil = lsTransmisionesFila;
  let botonDejarActivo = document.querySelector(`#transmision-por-fila button[value='${lsTransmisionesFila}']`)
  transmisionesFila.forEach(btn => {
    btn.classList.replace('btn-primary', 'bg-light-subtle')
  })
  botonDejarActivo.classList.replace('bg-light-subtle', 'btn-primary')
}
// si se carga desde telefono por primera vez ajusta cantidad y botón seleccionado en numero de canales por fila
if (isMobile.any && lsTransmisionesFila === null) {
  let botonDejarActivo = document.querySelector(`#transmision-por-fila button[value='${sizeMovil}']`)
  transmisionesFila.forEach(btn => {
    btn.classList.replace('btn-primary', 'bg-light-subtle')
  })
  botonDejarActivo.classList.replace('bg-light-subtle', 'btn-primary');
 
  let transmisionesEnGrid = document.querySelectorAll('div[data-canal]');
    for (let v of transmisionesEnGrid) {
      v.classList.remove('col-12', 'col-6', 'col-4', 'col-3', 'col-2');
      v.classList.add(`col-${sizeMovil}`);
    }
}

transmisionesFila.forEach(btn => {
  btn.addEventListener('click', (event) => {
    //primero borra la clase primary del boton que estaba activo por defecto
    transmisionesFila.forEach(btn => {
      btn.classList.replace('btn-primary', 'bg-light-subtle')
    })

    //añade clase primary al boton pulsado
    btn.classList.replace('bg-light-subtle', 'btn-primary')
    // guarda valores de value
    size = event.target.value;
    sizeMovil = event.target.value;

    localStorage.setItem('numero_canales_por_fila', event.target.value);

    let transmisionesEnGrid = document.querySelectorAll('div[data-canal]');
    for (let v of transmisionesEnGrid) {
      v.classList.remove('col-12', 'col-6', 'col-4', 'col-3', 'col-2');
      v.classList.add(`col-${event.target.value}`);
    }
  })
})

// ----- cargar desde localstorage
let lsSlider = localStorage.getItem('slider_value');
let lsFondo = localStorage.getItem('fondo');
let lsOverlay = localStorage.getItem('overlay');
let lsNavbar = localStorage.getItem('navbar');

window.addEventListener('DOMContentLoaded', () => {
  const overlayBarras = document.querySelectorAll('.barra-overlay');
  const hideOverlay = lsOverlay === 'hide';

  overlayBarras.forEach(barra => {
    barra.classList.toggle('d-none', hideOverlay);
  });

  (hideOverlay ? checkboxOff : checkboxOn)(overlayCheckbox, overlayStatus, 'overlay');
});

if (lsSlider !== null) {
  const sliderValueValue = parseInt(lsSlider) ?? 0;
  slider.setAttribute('value', sliderValueValue);
  sliderValue.innerHTML = sliderValueValue;
  canalesGrid.style.maxWidth = `${sliderValueValue}%`;
};

// fondo
lsFondo !== 'hide'
  ? (fondo.classList.remove('d-none'), checkboxOn(fondoCheckbox, fondoStatus, 'fondo'))
  : (fondo.classList.add('d-none'), checkboxOff(fondoCheckbox, fondoStatus, 'fondo'));

// navbar
lsNavbar !== 'hide'
  ? (navbar.classList.remove('d-none'), checkboxOn(navbarCheckbox, navbarStatus, 'navbar'))
  : (navbar.classList.add('d-none'), checkboxOff(navbarCheckbox, navbarStatus, 'navbar'));


/*
   _____          _   _          _      ______  _____ 
  / ____|   /\   | \ | |   /\   | |    |  ____|/ ____|
 | |       /  \  |  \| |  /  \  | |    | |__  | (___  
 | |      / /\ \ | . ` | / /\ \ | |    |  __|  \___ \ 
 | |____ / ____ \| |\  |/ ____ \| |____| |____ ____) |
  \_____/_/    \_\_| \_/_/    \_\______|______ _____/ 
*/
// https://flagcdn.com/en/codes.json
// Variable global para almacenar los códigos de bandera
let codigosBandera = {
  "ad": "Andorra",
  "ae": "Emiratos Árabes Unidos",
  "af": "Afganistán",
  "ag": "Antigua y Barbuda",
  "ai": "Anguila",
  "al": "Albania",
  "am": "Armenia",
  "ao": "Angola",
  "aq": "Antártida",
  "ar": "Argentina",
  "as": "Samoa Americana",
  "at": "Austria",
  "au": "Australia",
  "aw": "Aruba",
  "ax": "Åland",
  "az": "Azerbaiyán",
  "ba": "Bosnia y Herzegovina",
  "bb": "Barbados",
  "bd": "Bangladesh",
  "be": "Bélgica",
  "bf": "Burkina Faso",
  "bg": "Bulgaria",
  "bh": "Baréin",
  "bi": "Burundi",
  "bj": "Benín",
  "bl": "San Bartolomé",
  "bm": "Bermudas",
  "bn": "Brunéi",
  "bo": "Bolivia",
  "bq": "Caribe Neerlandés",
  "br": "Brasil",
  "bs": "Bahamas",
  "bt": "Bután",
  "bv": "Isla Bouvet",
  "bw": "Botsuana",
  "by": "Bielorrusia",
  "bz": "Belice",
  "ca": "Canadá",
  "cc": "Islas Cocos",
  "cd": "Congo (Rep. Dem.)",
  "cf": "República Centroafricana",
  "cg": "Congo",
  "ch": "Suiza",
  "ci": "Costa de Marfil",
  "ck": "Islas Cook",
  "cl": "Chile",
  "cm": "Camerún",
  "cn": "China",
  "co": "Colombia",
  "cr": "Costa Rica",
  "cu": "Cuba",
  "cv": "Cabo Verde",
  "cw": "Curazao",
  "cx": "Isla de Navidad",
  "cy": "Chipre",
  "cz": "República Checa",
  "de": "Alemania",
  "dj": "Yibuti",
  "dk": "Dinamarca",
  "dm": "Dominica",
  "do": "República Dominicana",
  "dz": "Argelia",
  "ec": "Ecuador",
  "ee": "Estonia",
  "eg": "Egipto",
  "eh": "Sahara Occidental",
  "er": "Eritrea",
  "es": "España",
  "et": "Etiopía",
  "eu": "Unión Europea",
  "fi": "Finlandia",
  "fj": "Fiyi",
  "fk": "Islas Malvinas",
  "fm": "Micronesia",
  "fo": "Islas Feroe",
  "fr": "Francia",
  "ga": "Gabón",
  "gb": "Reino Unido",
  "gb-eng": "Inglaterra",
  "gb-nir": "Irlanda del Norte",
  "gb-sct": "Escocia",
  "gb-wls": "Gales",
  "gd": "Granada",
  "ge": "Georgia",
  "gf": "Guayana Francesa",
  "gg": "Guernsey",
  "gh": "Ghana",
  "gi": "Gibraltar",
  "gl": "Groenlandia",
  "gm": "Gambia",
  "gn": "Guinea",
  "gp": "Guadalupe",
  "gq": "Guinea Ecuatorial",
  "gr": "Grecia",
  "gs": "Islas Georgias del Sur y Sándwich del Sur",
  "gt": "Guatemala",
  "gu": "Guam",
  "gw": "Guinea-Bisáu",
  "gy": "Guyana",
  "hk": "Hong Kong",
  "hm": "Islas Heard y McDonald",
  "hn": "Honduras",
  "hr": "Croacia",
  "ht": "Haití",
  "hu": "Hungría",
  "id": "Indonesia",
  "ie": "Irlanda",
  "il": "Israel",
  "im": "Isla de Man",
  "in": "India",
  "io": "Territorio Británico del Océano Índico",
  "iq": "Irak",
  "ir": "Irán",
  "is": "Islandia",
  "it": "Italia",
  "je": "Jersey",
  "jm": "Jamaica",
  "jo": "Jordania",
  "jp": "Japón",
  "ke": "Kenia",
  "kg": "Kirguistán",
  "kh": "Camboya",
  "ki": "Kiribati",
  "km": "Comoras",
  "kn": "San Cristóbal y Nieves",
  "kp": "Corea del Norte",
  "kr": "Corea del Sur",
  "kw": "Kuwait",
  "ky": "Islas Caimán",
  "kz": "Kazajistán",
  "la": "Laos",
  "lb": "Líbano",
  "lc": "Santa Lucía",
  "li": "Liechtenstein",
  "lk": "Sri Lanka",
  "lr": "Liberia",
  "ls": "Lesoto",
  "lt": "Lituania",
  "lu": "Luxemburgo",
  "lv": "Letonia",
  "ly": "Libia",
  "ma": "Marruecos",
  "mc": "Mónaco",
  "md": "Moldavia",
  "me": "Montenegro",
  "mf": "San Martín (Francia)",
  "mg": "Madagascar",
  "mh": "Islas Marshall",
  "mk": "Macedonia del Norte",
  "ml": "Malí",
  "mm": "Myanmar",
  "mn": "Mongolia",
  "mo": "Macao",
  "mp": "Islas Marianas del Norte",
  "mq": "Martinica",
  "mr": "Mauritania",
  "ms": "Montserrat",
  "mt": "Malta",
  "mu": "Mauricio",
  "mv": "Maldivas",
  "mw": "Malawi",
  "mx": "México",
  "my": "Malasia",
  "mz": "Mozambique",
  "na": "Namibia",
  "nc": "Nueva Caledonia",
  "ne": "Níger",
  "nf": "Isla Norfolk",
  "ng": "Nigeria",
  "ni": "Nicaragua",
  "nl": "Países Bajos",
  "no": "Noruega",
  "np": "Nepal",
  "nr": "Nauru",
  "nu": "Niue",
  "nz": "Nueva Zelanda",
  "om": "Omán",
  "pa": "Panamá",
  "pe": "Perú",
  "pf": "Polinesia Francesa",
  "pg": "Papúa Nueva Guinea",
  "ph": "Filipinas",
  "pk": "Pakistán",
  "pl": "Polonia",
  "pm": "San Pedro y Miquelón",
  "pn": "Islas Pitcairn",
  "pr": "Puerto Rico",
  "ps": "Palestina",
  "pt": "Portugal",
  "pw": "Palaos",
  "py": "Paraguay",
  "qa": "Catar",
  "re": "Reunión",
  "ro": "Rumania",
  "rs": "Serbia",
  "ru": "Rusia",
  "rw": "Ruanda",
  "sa": "Arabia Saudita",
  "sb": "Islas Salomón",
  "sc": "Seychelles",
  "sd": "Sudán",
  "se": "Suecia",
  "sg": "Singapur",
  "sh": "Santa Elena, Ascensión y Tristán de Acuña",
  "si": "Eslovenia",
  "sj": "Svalbard y Jan Mayen",
  "sk": "Eslovaquia",
  "sl": "Sierra Leona",
  "sm": "San Marino",
  "sn": "Senegal",
  "so": "Somalia",
  "sr": "Surinam",
  "ss": "Sudán del Sur",
  "st": "Santo Tomé y Príncipe",
  "sv": "El Salvador",
  "sx": "San Martín (Países Bajos)",
  "sy": "Siria",
  "sz": "Suazilandia",
  "tc": "Islas Turcas y Caicos",
  "td": "Chad",
  "tf": "Tierras Australes y Antárticas Francesas",
  "tg": "Togo",
  "th": "Tailandia",
  "tj": "Tayikistán",
  "tk": "Tokelau",
  "tl": "Timor Oriental",
  "tm": "Turkmenistán",
  "tn": "Túnez",
  "to": "Tonga",
  "tr": "Turquía",
  "tt": "Trinidad y Tobago",
  "tv": "Tuvalu",
  "tw": "Taiwán",
  "tz": "Tanzania",
  "ua": "Ucrania",
  "ug": "Uganda",
  "um": "Islas Ultramarinas Menores de los Estados Unidos",
  "un": "Organización de las Naciones Unidas",
  "us": "Estados Unidos",
  "us-ak": "Alaska",
  "us-al": "Alabama",
  "us-ar": "Arkansas",
  "us-az": "Arizona",
  "us-ca": "California",
  "us-co": "Colorado",
  "us-ct": "Connecticut",
  "us-de": "Delaware",
  "us-fl": "Florida",
  "us-ga": "Georgia",
  "us-hi": "Hawái",
  "us-ia": "Iowa",
  "us-id": "Idaho",
  "us-il": "Illinois",
  "us-in": "Indiana",
  "us-ks": "Kansas",
  "us-ky": "Kentucky",
  "us-la": "Luisiana",
  "us-ma": "Massachusetts",
  "us-md": "Maryland",
  "us-me": "Maine",
  "us-mi": "Míchigan",
  "us-mn": "Minnesota",
  "us-mo": "Misuri",
  "us-ms": "Misisipi",
  "us-mt": "Montana",
  "us-nc": "Carolina del Norte",
  "us-nd": "Dakota del Norte",
  "us-ne": "Nebraska",
  "us-nh": "Nuevo Hampshire",
  "us-nj": "Nueva Jersey",
  "us-nm": "Nuevo México",
  "us-nv": "Nevada",
  "us-ny": "Nueva York",
  "us-oh": "Ohio",
  "us-ok": "Oklahoma",
  "us-or": "Oregón",
  "us-pa": "Pensilvania",
  "us-ri": "Rhode Island",
  "us-sc": "Carolina del Sur",
  "us-sd": "Dakota del Sur",
  "us-tn": "Tennessee",
  "us-tx": "Texas",
  "us-ut": "Utah",
  "us-va": "Virginia",
  "us-vt": "Vermont",
  "us-wa": "Washington",
  "us-wi": "Wisconsin",
  "us-wv": "Virginia Occidental",
  "us-wy": "Wyoming",
  "uy": "Uruguay",
  "uz": "Uzbekistán",
  "va": "Ciudad del Vaticano",
  "vc": "San Vicente y las Granadinas",
  "ve": "Venezuela",
  "vg": "Islas Vírgenes Británicas",
  "vi": "Islas Vírgenes de los Estados Unidos",
  "vn": "Vietnam",
  "vu": "Vanuatu",
  "wf": "Wallis y Futuna",
  "ws": "Samoa",
  "xk": "Kosovo",
  "ye": "Yemen",
  "yt": "Mayotte",
  "za": "Sudáfrica",
  "zm": "Zambia",
  "zw": "Zimbabue"
}

// Variable global para almacenar listado canales
let listaCanales

// Función para cargar el archivo JSON y almacenarlo en una variable
async function fetchCargarCanales() {
  try {
      // Realizar el fetch y esperar la respuesta
      const response = await fetch('assets/data/canales.json');
      // Convertir la respuesta a formato JSON y almacenarla en una variable
      listaCanales = await response.json();
  } catch (error) {
      console.error('Error al cargar el archivo JSON Canales:', error);
      // respaldo en caso de falla
      listaCanales = listaCanalesViejo
  }
}

// matchingData = listado botones rescatado desde el modal
function displayAutocompleteCanales(matchingData, inputForm) { 
  const autocompleteContainer = document.createElement('div');
  autocompleteContainer.classList.add('autocomplete-container', 'shadow', 'd-flex', 'flex-column', 'gap-2');
  let inputId = inputForm.getAttribute('id');
    inputId = inputId.replace('input-de-', 'autocomplete-de-');
  autocompleteContainer.setAttribute('id', inputId);
  
  // boton que dice que no hay resultados
  let botonSinResultadoEnSugerencias = document.createElement('button');
  botonSinResultadoEnSugerencias.classList.add('d-none', 'bg-danger-subtle', 'fs-smaller', 'border', 'p-2', 'w-100', 'rounded-0', 'pe-none', 'user-select-none')
  botonSinResultadoEnSugerencias.textContent = "Sin resultados";
  botonSinResultadoEnSugerencias.setAttribute('id', 'boton-sugerencias-sin-resultados')
  autocompleteContainer.append(botonSinResultadoEnSugerencias)

  // genera boton abajo del input de cada canal para el cambio
  matchingData.forEach(btn => {
    let btnAtr = btn.getAttribute('data-canal');
    let btnP = btn.querySelector('p');
    let btnClass = btn.getAttribute('class'); // rescatar clases boton de modal para mostrar los activos
    if (btnClass.includes('btn-outline-secondary')) {
      btnClass = btnClass.replace('btn-outline-secondary', 'bg-dark-subtle');  // Reemplaza "btn-outline-secondary" por "btn-secondary"
    }
    let btnPClass = btnP.getAttribute('class'); // rescatar clases párrafo para estilo de titulo a la izquierda e iconos a la derecha
    // almacena item internos del boton del modal si es que existen
    let btnSpan = btnP.querySelector('span') ? btnP.querySelector('span').cloneNode(true) : null;
    let btnImg = btnP.querySelector('img') ? btnP.querySelector('img').cloneNode(true) : null;
    let btnDiv = btnP.querySelector('div') ? btnP.querySelector('div').cloneNode(true) : null;
    // crear boton listado sugerencias a mostrar cuando se haga input
    let sugerencia = document.createElement('button');
    sugerencia.classList.add('sugerencia', 'fs-smaller', 'border-0', 'p-2', 'w-100', ...btnClass.split(' '), ...btnPClass.split(' '))
    sugerencia.setAttribute('data-canal-sugerencia', btnAtr);
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
      console.log(`div padre= ${idDivPadreSugerencia} a ser reemplazado por= ${canalSugerenciaPulsada}`)
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
  div.classList.add('ratio', 'ratio-16x9');
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

function crearOverlay(nombre, fuente, pais, altIcon, canalId) {
  const fragmentOVERLAY = document.createDocumentFragment();
  if (pais === undefined && altIcon === undefined) {
    contenido = `<span class="ocultar-en-768px">${nombre}</span>`;
  } else if (pais === undefined && altIcon !== undefined) {
    contenido = `<span class="ocultar-en-768px">${nombre} ${altIcon}</span>`;
  } else {
    contenido = `<span class="ocultar-en-768px">${nombre} <img src="https://flagcdn.com/${pais.toLowerCase()}.svg" alt="bandera ${codigosBandera[pais]}" title="${codigosBandera[pais]}"></span>`;
  }

  let btnMoverEnGrid = document.createElement('button');
  btnMoverEnGrid.classList.add('btn', 'btn-sm','btn-secondary', 'p-0', 'px-1', 'd-flex', 'justify-content-center', 'align-items-center', 'gap-1', 'pe-auto', 'handle', 'mt-1');
  btnMoverEnGrid.setAttribute('type', 'button');
  btnMoverEnGrid.setAttribute('title', 'Arrastrar y mover este canal');
  btnMoverEnGrid.setAttribute('data-bs-toggle', 'tooltip');
  btnMoverEnGrid.setAttribute('data-bs-title', 'Arrastrar y mover este canal');
  btnMoverEnGrid.innerHTML = '<span class="ocultar-en-768px">Mover</span><i class="bi bi-arrows-move"></i>'
 
  let btnCambiarSeñal = document.createElement('button');
  btnCambiarSeñal.classList.add('btn', 'btn-sm', 'btn-light', 'top-0', 'end-0', 'p-0', 'px-1', 'd-flex', 'justify-content-center', 'align-items-center', 'gap-1', 'pe-auto', 'mt-1');
  btnCambiarSeñal.setAttribute('type', 'button');
  btnCambiarSeñal.setAttribute('title', 'Cambiar este canal');
  btnCambiarSeñal.setAttribute('data-bs-toggle', 'tooltip');
  btnCambiarSeñal.setAttribute('data-bs-title', 'Cambiar este canal');
  btnCambiarSeñal.innerHTML = '<span class="ocultar-en-768px">Cambiar</span><i class="bi bi-arrow-repeat"></i>';
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
    modalContent.classList.add('modal-content', 'bg-transparent', 'border-0');

    let modalHeader = document.createElement('div');
    modalHeader.classList.add('modal-header', 'bg-transparent', 'border-0');
    
    let modalBody = document.createElement('div');
    modalBody.classList.add('modal-body', 'vh-100', 'scrollbar-thin-gray', 'px-2', 'modal-blur', 'rounded-3');
    
    let formFloating = document.createElement('div');
    formFloating.classList.add('form-floating');
    
    let input = document.createElement('input');
    input.classList.add('form-control');
    input.type = 'search';
    input.id = `input-de-${canalId}`;
    input.placeholder = 'Escribe para buscar...';
    input.addEventListener('input', (e) => {
      let algunaCoincidencia = false;
      // empieza tema del filtro
      const inputNormalized = normalizarInput(e.target.value);
      let listaBotonesInteriorContainerSugerencias = document.querySelectorAll(`#autocomplete-de-${canalId} button.sugerencia`);
      let botonQueDiceSinResultadosDentroContainerSugerencias = document.querySelector(`#autocomplete-de-${canalId} button#boton-sugerencias-sin-resultados`);
      listaBotonesInteriorContainerSugerencias.forEach(btn => {
        const contenidoBtn = btn.innerHTML;
        const contenidoBtnNormalized = normalizarInput(contenidoBtn);
        let coincidencia = contenidoBtnNormalized.includes(inputNormalized)
          btn.classList.toggle('d-none', !coincidencia);
          if (coincidencia) {
            algunaCoincidencia = true;
          }
      });
      ocultarElemento(botonQueDiceSinResultadosDentroContainerSugerencias, algunaCoincidencia)
    });

    let label = document.createElement('label');
    label.htmlFor = `input-de-${canalId}`;
    label.innerHTML = `Cambiar [${nombre}] por:`;
    
    formFloating.append(input);
    formFloating.append(label);
    modalHeader.append(formFloating);
    
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
    });
    myModal.show();
    let listaBotones = document.querySelectorAll(`#modal-canales button[data-canal]`);
    let inputCambioCanal = document.querySelector(`#input-de-${canalId}`);
    displayAutocompleteCanales(listaBotones, inputCambioCanal);

    // Agregar evento para eliminar el modal del DOM cuando se cierre
    modal.addEventListener('hidden.bs.modal', () => {
      modal.remove();
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
    a.classList.add('d-flex', 'justify-content-center', 'align-items-center', 'gap-1', 'btn', 'btn-sm', 'btn-dark', 'p-0', 'px-1', 'pe-auto', 'mt-1');

  const btnRemove = document.createElement('button');
    btnRemove.classList.add('btn', 'btn-sm', 'btn-danger', 'top-0', 'end-0', 'p-0', 'px-1', 'd-flex', 'justify-content-center', 'align-items-center', 'gap-1', 'pe-auto', 'mt-1', 'me-1');
    btnRemove.setAttribute('aria-label', 'Close');
    btnRemove.setAttribute('type', 'button');
    btnRemove.setAttribute('title', 'Quitar canal');
    btnRemove.setAttribute('data-bs-toggle', 'tooltip');
    btnRemove.setAttribute('data-bs-title', 'Quitar canal');
    btnRemove.innerHTML = '<span class="ocultar-en-768px">Quitar</span><i class="bi bi-x-circle"></i>';
    const audioQuitarCanal = new Audio('assets/sounds/User-Interface-Clicks-and-Buttons-1-por-original_sound.mp3');
    btnRemove.addEventListener('click', () => {
      tele.remove(canalId)
      audioQuitarCanal.play()
    });

  const divOVERLAY = document.createElement('div');
    divOVERLAY.setAttribute('id', `overlay-de-canal-${canalId}`)
    divOVERLAY.classList.add('position-absolute', 'barra-overlay', 'w-100', 'h-100', 'bg-transparent', 'pe-none', 'd-flex', 'flex-wrap', 'justify-content-end', 'align-items-start', 'gap-1', 'top-0', 'end-0');
    divOVERLAY.classList.toggle('d-none', !(overlayCheckbox.checked === true || divOVERLAY.classList.contains('d-none')));
    divOVERLAY.append(btnMoverEnGrid)
    divOVERLAY.append(btnCambiarSeñal)
    divOVERLAY.append(a);
    divOVERLAY.append(btnRemove)

  fragmentOVERLAY.append(divOVERLAY);
  return fragmentOVERLAY;
};


// ----- tele
let tele = {
  add: (canal, divExistenteEnCasoDeCambio) => {
    // listaCanales = canales.json
    if (typeof canal !== 'undefined' && typeof listaCanales[canal] !== 'undefined') {
      let { iframe_url, m3u8_url, yt_id, yt_embed, yt_playlist, nombre, fuente, pais, alt_icon } = listaCanales[canal];
    
      let fragmentTransmision = document.createDocumentFragment();

      if (divExistenteEnCasoDeCambio) {
        let divPadreACambiar = document.querySelector(`div[data-canal="${divExistenteEnCasoDeCambio}"]`)
        let divExistenteACambiar = document.querySelector(`div[data-canal-cambio="${divExistenteEnCasoDeCambio}"]`)
        
        // evitar duplicados si canal que va a quedar de reemplazo ya existe en grid
        if (document.querySelector(`div[data-canal="${canal}"]`) && divPadreACambiar !== document.querySelector(`div[data-canal="${canal}"]`)){
          tele.remove(canal)
        }

        if (typeof iframe_url !== 'undefined') {
          fragmentTransmision.append(crearIframe(iframe_url, nombre, canal), crearOverlay(nombre, fuente, pais, alt_icon, canal));
        } else if (typeof m3u8_url !== 'undefined') {
          const divM3u8 = document.createElement('div');
          divM3u8.classList.add('m3u-stream', 'ratio', 'ratio-16x9');
          divM3u8.setAttribute('data-canal-cambio', canal);
          const videoM3u8 = document.createElement('video');
          videoM3u8.setAttribute('data-canal-m3u', canal);
          videoM3u8.classList.add('m3u-player', 'position-absolute', 'video-js', 'vjs-16-9', 'vjs-fluid');
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
          btn.classList.replace('btn-primary', 'btn-outline-secondary');
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
            let nombre = element.querySelector('a span.ocultar-en-768px').textContent.trim();
            
            canalesStorage[canal] = nombre;
        });

        // Guardar el objeto en el almacenamiento local después de completar todas las iteraciones
        localStorage.setItem('canales_storage', JSON.stringify(canalesStorage));

      } else {
        canalesStorage[canal] = nombre;
        localStorage.setItem('canales_storage', JSON.stringify(canalesStorage));
        let divTransmision = document.createElement('div');
        divTransmision.classList.add('position-relative', `col-${isMobile.any ? sizeMovil : size}`, 'shadow');
        divTransmision.setAttribute('data-canal', canal);
        /// esto estaba
        if (typeof iframe_url !== 'undefined') {
          divTransmision.append(crearIframe(iframe_url, nombre, canal), crearOverlay(nombre, fuente, pais, alt_icon, canal));
        } else if (typeof m3u8_url !== 'undefined') {
          const divM3u8 = document.createElement('div');
          divM3u8.classList.add('m3u-stream', 'ratio', 'ratio-16x9');
          divM3u8.setAttribute('data-canal-cambio', canal);
          const videoM3u8 = document.createElement('video');
          videoM3u8.setAttribute('contenedor-canal-cambio', canal);
          videoM3u8.setAttribute('data-canal-m3u', canal);
          videoM3u8.classList.add('m3u-player', 'position-absolute', 'video-js', 'vjs-16-9', 'vjs-fluid');
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
        btn.classList.replace('btn-outline-secondary', 'btn-primary');
      });

      activarTooltipsBootstrap();
    } else {
      console.log(`${canal} no es válido como canal, revisa si se borró y/o reinicia tu localStorage`);
    }
  },
  remove: (canal) => {
    let transmisionPorRemover = document.querySelector(`div[data-canal="${canal}"]`);
    
    if (transmisionPorRemover) {
      removerTooltipsBootstrap();
      canalesGrid.removeChild(transmisionPorRemover);
      let btnTransmisionOff = document.querySelectorAll(`button[data-canal="${canal}"]`);
      btnTransmisionOff.forEach(btn => {
        btn.classList.replace('btn-primary', 'btn-outline-secondary');
      });
      // remueve de localstorage
      delete canalesStorage[canal];
      localStorage.setItem('canales_storage', JSON.stringify(canalesStorage));
      detectarSiMostrarOcultarBotonesDeQuitarTodaSeñal();
      activarTooltipsBootstrap();
    }
  },
  crearBotonesParaCanales: () => {
    let numeroCanalesConPais = [];

    const fragmentBtn = document.createDocumentFragment();
    const fragmentBtn2 = document.createDocumentFragment();

    for (const canal in listaCanales) {
      let { nombre, pais, alt_icon } = listaCanales[canal];
      let btnTransmision = document.createElement('button');
      btnTransmision.classList.add('btn', 'btn-outline-secondary');
      btnTransmision.setAttribute('data-canal', canal);

      const pNombreCanalDentroBoton = document.createElement('p');
      pNombreCanalDentroBoton.classList.add('m-0', 'd-flex', 'justify-content-between', 'align-items-center', 'text-start', 'gap-2');

      const spanNombreCanal = document.createElement('span');
      spanNombreCanal.classList.add('flex-grow-1');
      spanNombreCanal.textContent = nombre;
      pNombreCanalDentroBoton.append(spanNombreCanal)

      if (pais && !alt_icon) {
        let img = document.createElement('img');
        let nombrePais = codigosBandera[pais.toLowerCase()];
        img.setAttribute('src', `https://flagcdn.com/${pais.toLowerCase()}.svg`);
        img.setAttribute('alt', `bandera ${nombrePais}`);
        img.setAttribute('title', nombrePais);
        img.classList.add('h-100', 'm-0');
        btnTransmision.setAttribute('country', `${nombrePais}`);
        pNombreCanalDentroBoton.append(img);
        numeroCanalesConPais.push(pais);
      } else if (pais && alt_icon) {
        let iconoAlternativo = document.createElement('div');
        iconoAlternativo.innerHTML = alt_icon;
        pNombreCanalDentroBoton.append(iconoAlternativo)
        let img = document.createElement('img');
        let nombrePais = codigosBandera[pais.toLowerCase()];
        img.setAttribute('src', `https://flagcdn.com/${pais.toLowerCase()}.svg`);
        img.setAttribute('alt', `bandera ${nombrePais}`);
        img.setAttribute('title', nombrePais);
        img.classList.add('h-100', 'm-0');
        btnTransmision.setAttribute('country', `${nombrePais}`);
        pNombreCanalDentroBoton.append(img);
        numeroCanalesConPais.push(pais);
      } else if (!pais && alt_icon) {
        pNombreCanalDentroBoton.innerHTML += alt_icon;
        btnTransmision.setAttribute('country', 'Desconocido');
        numeroCanalesConPais.push('Desconocido');
      } else {
        btnTransmision.setAttribute('country', 'Desconocido');
        numeroCanalesConPais.push('Desconocido');
      }

      btnTransmision.append(pNombreCanalDentroBoton);
      fragmentBtn.append(btnTransmision);

      const clonedBtnTransmision = btnTransmision.cloneNode(true); // Clonar el botón
      fragmentBtn2.append(clonedBtnTransmision);
    }

    // Agregar fragmentos al DOM después de completar el bucle
    document.querySelector('#modal-body-botones-canales').append(fragmentBtn);
    document.querySelector('#offcanvas-body-botones-canales').append(fragmentBtn2);

    // Asignar eventos después de que los botones estén en el DOM
    document.querySelectorAll('#modal-body-botones-canales button').forEach(btn => {
      btn.addEventListener('click', () => {
        const action = btn.classList.contains('btn-outline-secondary') ? 'add' : 'remove';
        tele[action](btn.getAttribute('data-canal'));
        detectarSiMostrarOcultarBotonesDeQuitarTodaSeñal();
      });
    });

    document.querySelectorAll('#offcanvas-body-botones-canales button').forEach(btn => {
      btn.addEventListener('click', () => {
        const action = btn.classList.contains('btn-outline-secondary') ? 'add' : 'remove';
        tele[action](btn.getAttribute('data-canal'));
        detectarSiMostrarOcultarBotonesDeQuitarTodaSeñal();
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
      let nombrePais = codigosBandera[bandera];
      let btn = document.createElement('button');
      btn.classList.add('btn', 'btn-outline-secondary', 'd-flex', 'justify-content-between', 'align-items-center', 'w-100');
      btn.setAttribute('type', 'button');
      btn.setAttribute('data-country', bandera);

      const pNombreCanalDentroBoton = document.createElement('p');
      pNombreCanalDentroBoton.classList.add('m-0', 'd-flex', 'justify-content-between', 'align-items-center', 'text-start', 'gap-2', 'w-100');

      const spanBtnNombrePais = document.createElement('span');
      spanBtnNombrePais.classList.add('flex-grow-1');
      spanBtnNombrePais.textContent = nombrePais;
      pNombreCanalDentroBoton.append(spanBtnNombrePais)

      let spanBadge = document.createElement('span');
      spanBadge.classList.add('badge', 'bg-secondary'/* , 'rounded-pill' */);
      spanBadge.innerHTML = conteoNumeroCanalesConPais[bandera] || 0;
      if (codigosBandera[bandera]) {
        let img = document.createElement('img');
        img.setAttribute('src', `https://flagcdn.com/${bandera}.svg`);
        img.setAttribute('alt', `bandera ${nombrePais}`);
        img.setAttribute('title', nombrePais);
        img.classList.add('h-100', 'm-0');
       
        pNombreCanalDentroBoton.append(img);
        pNombreCanalDentroBoton.append(spanBadge);
        btn.append(pNombreCanalDentroBoton)
      } else {
        btn.textContent = bandera
        btn.append(spanBadge);
      }

      fragmentBtnsFiltroBanderas.append(btn);
    }

    // Clona el fragmento para poder agregarlo a diferentes contenedores
    const clonedFragmentBtn = fragmentBtnsFiltroBanderas.cloneNode(true);

    // Agrega los fragmentos con los botones y sus eventos a los contenedores en el DOM
    document.querySelector('#modal-collapse-botones-listado-filtro-paises').append(fragmentBtnsFiltroBanderas);
    document.querySelector('#offcanvas-collapse-botones-listado-filtro-paises').append(clonedFragmentBtn);

    document.querySelectorAll('#modal-collapse-botones-listado-filtro-paises button:not(#modal-btn-mostrar-todo-pais)').forEach(btn => {
      btn.addEventListener('click', () => {
        let todoBtn = document.querySelector('#modal-collapse-botones-listado-filtro-paises').querySelectorAll('button');
        todoBtn.forEach(btn => {
          btn.classList.replace('btn-primary', 'btn-outline-secondary');
        });

        btn.classList.replace('btn-outline-secondary', 'btn-primary');

        let filtro = codigosBandera[btn.dataset.country] ? codigosBandera[btn.dataset.country] : 'Desconocido';
        filtrarCanalesPorInput(filtro, document.querySelector('#modal-body-botones-canales'));
      });
    });

    document.querySelectorAll('#offcanvas-collapse-botones-listado-filtro-paises button:not(#offcanvas-btn-mostrar-todo-pais)').forEach(btn => {
      btn.addEventListener('click', () => {
        let todoBtn = document.querySelector('#offcanvas-collapse-botones-listado-filtro-paises').querySelectorAll('button');
        todoBtn.forEach(btn => {
          btn.classList.replace('btn-primary', 'btn-outline-secondary');
        });

        btn.classList.replace('btn-outline-secondary', 'btn-primary');

        let filtro = codigosBandera[btn.dataset.country] ? codigosBandera[btn.dataset.country] : 'Desconocido';
        filtrarCanalesPorInput(filtro, document.querySelector('#offcanvas-body-botones-canales'));
      });
    });

    guardarOrdenOriginal('modal-body-botones-canales');
    guardarOrdenOriginal('offcanvas-body-botones-canales');
  },
  init: async () => {
    
    await fetchCargarCanales();  // Llamar a la función para realizar el fetch de lista canales

    tele.crearBotonesParaCanales();

    const localStorageCanales = localStorage.getItem('canales_storage');
    const canalesPredeterminados = ['24-horas-2', 'meganoticias-3', 't13-4'];
    const canalesExtras = ['chv-noticias-3', 'galeria-cima', 'lofi-girl'];

    const canalesAgregar = isMobile.any ? canalesPredeterminados : canalesPredeterminados.concat(canalesExtras);

    if (localStorageCanales === null) {
      canalesAgregar.forEach(canal => tele.add(canal));
      detectarSiMostrarOcultarBotonesDeQuitarTodaSeñal();
    } else {
      Object.keys(lsCanalesJson).forEach(canal => tele.add(canal));
      detectarSiMostrarOcultarBotonesDeQuitarTodaSeñal();
    }

    // ----- añade número total de canales a boton "global" del filtro banderas 
    document.querySelector('#modal-span-con-numero-total-canales').textContent = Object.keys(listaCanales).length
    document.querySelector('#offcanvas-span-con-numero-total-canales').textContent = Object.keys(listaCanales).length

  }
};

tele.init();

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
      let nombre = element.querySelector('a span.ocultar-en-768px').textContent.trim();

      canalesStorage[canal] = nombre;
  });

  // Guardar el objeto en el almacenamiento local después de completar todas las iteraciones
  localStorage.setItem('canales_storage', JSON.stringify(canalesStorage));
});