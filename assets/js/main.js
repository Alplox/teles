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
// variable vacia, obtiene valor si localstorage posee el item 'canales_storage'
let lsCanalesJson;
// variable que almacena string/json durante intercambio para localstorage
let canalesStorage = {};

if (lsCanales !== null) {
  // pasa string de localstorage a una variable objeto [JSON]
  lsCanalesJson = JSON.parse(window.localStorage.getItem('canales_storage'));
  // solo para info rapida desde la consola (opcional dejarlo)
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
    btn.classList.replace('btn-primary', 'btn-secondary')
  })
  botonDejarActivo.classList.replace('btn-secondary', 'btn-primary')
}
// si se carga desde telefono por primera vez ajusta cantidad y boton selecionado en numero de canales por fila
if (checkMovil() && lsTransmisionesFila === null) {
  let botonDejarActivo = document.querySelector(`#transmision-por-fila button[value='${sizeMovil}']`)
  transmisionesFila.forEach(btn => {
    btn.classList.replace('btn-primary', 'btn-secondary')
  })
  botonDejarActivo.classList.replace('btn-secondary', 'btn-primary');
 
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
      btn.classList.replace('btn-primary', 'btn-secondary')
    })

    //añade clase primary al boton pulsado
    btn.classList.replace('btn-secondary', 'btn-primary')
    // guarda valores de value
    console.log(event.target.value + " wena " + btn)
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

/* let { 
  slider_value: lsSlider, 
  fondo: lsFondo, 
  overlay: lsOverlay, 
  navbar: lsNavbar 
} = localStorage; */

window.addEventListener('DOMContentLoaded', () => {
  const overlayBarras = document.querySelectorAll('.barra-overlay');
  const hideOverlay = lsOverlay === 'hide';

  overlayBarras.forEach(barra => {
    barra.classList.toggle('d-none', hideOverlay);
  });

  (hideOverlay ? checkboxOff : checkboxOn)(overlayCheckbox, overlayStatus, 'overlay');
});

// slider
/* const sliderValueValue = parseInt(lsSlider) ?? 0;
  slider.setAttribute('value', sliderValueValue);
  sliderValue.innerHTML = sliderValueValue;
  canalesGrid.style.maxWidth = `${sliderValueValue}%`; */

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
let paises = {
  "ad": "Andorra",
  "ae": "United Arab Emirates",
  "af": "Afghanistan, Afganistán",
  "ag": "Antigua and Barbuda",
  "ai": "Anguilla",
  "al": "Albania",
  "am": "Armenia",
  "ao": "Angola",
  "aq": "Antarctica",
  "ar": "Argentina",
  "as": "American Samoa",
  "at": "Austria",
  "au": "Australia",
  "aw": "Aruba",
  "ax": "Åland Islands",
  "az": "Azerbaijan",
  "ba": "Bosnia and Herzegovina",
  "bb": "Barbados",
  "bd": "Bangladesh",
  "be": "Belgium",
  "bf": "Burkina Faso",
  "bg": "Bulgaria",
  "bh": "Bahrain",
  "bi": "Burundi",
  "bj": "Benin",
  "bl": "Saint Barthélemy",
  "bm": "Bermuda",
  "bn": "Brunei",
  "bo": "Bolivia",
  "bq": "Caribbean Netherlands",
  "br": "Brazil, Brasil",
  "bs": "Bahamas",
  "bt": "Bhutan",
  "bv": "Bouvet Island",
  "bw": "Botswana",
  "by": "Belarus",
  "bz": "Belize",
  "ca": "Canada",
  "cc": "Cocos (Keeling) Islands",
  "cd": "DR Congo",
  "cf": "Central African Republic",
  "cg": "Republic of the Congo",
  "ch": "Switzerland",
  "ci": "Côte d'Ivoire (Ivory Coast)",
  "ck": "Cook Islands",
  "cl": "Chile",
  "cm": "Cameroon",
  "cn": "China",
  "co": "Colombia",
  "cr": "Costa Rica",
  "cu": "Cuba",
  "cv": "Cape Verde",
  "cw": "Curaçao",
  "cx": "Christmas Island",
  "cy": "Cyprus",
  "cz": "Czechia",
  "de": "Germany, Alemania",
  "dj": "Djibouti",
  "dk": "Denmark",
  "dm": "Dominica",
  "do": "Dominican Republic",
  "dz": "Algeria",
  "ec": "Ecuador",
  "ee": "Estonia",
  "eg": "Egypt",
  "eh": "Western Sahara",
  "er": "Eritrea",
  "es": "Spain, España",
  "et": "Ethiopia",
  "eu": "European Union",
  "fi": "Finland",
  "fj": "Fiji",
  "fk": "Falkland Islands",
  "fm": "Micronesia",
  "fo": "Faroe Islands",
  "fr": "France, Francia",
  "ga": "Gabon",
  "gb": "United Kingdom, Reino Unido",
  "gb-eng": "England",
  "gb-nir": "Northern Ireland",
  "gb-sct": "Scotland",
  "gb-wls": "Wales",
  "gd": "Grenada",
  "ge": "Georgia",
  "gf": "French Guiana",
  "gg": "Guernsey",
  "gh": "Ghana",
  "gi": "Gibraltar",
  "gl": "Greenland",
  "gm": "Gambia",
  "gn": "Guinea",
  "gp": "Guadeloupe",
  "gq": "Equatorial Guinea",
  "gr": "Greece",
  "gs": "South Georgia",
  "gt": "Guatemala",
  "gu": "Guam",
  "gw": "Guinea-Bissau",
  "gy": "Guyana",
  "hk": "Hong Kong",
  "hm": "Heard Island and McDonald Islands",
  "hn": "Honduras",
  "hr": "Croatia",
  "ht": "Haiti",
  "hu": "Hungary",
  "id": "Indonesia",
  "ie": "Ireland",
  "il": "Israel",
  "im": "Isle of Man",
  "in": "India",
  "io": "British Indian Ocean Territory",
  "iq": "Iraq",
  "ir": "Iran",
  "is": "Iceland",
  "it": "Italy",
  "je": "Jersey",
  "jm": "Jamaica",
  "jo": "Jordan",
  "jp": "Japan, Japon",
  "ke": "Kenya",
  "kg": "Kyrgyzstan",
  "kh": "Cambodia",
  "ki": "Kiribati",
  "km": "Comoros",
  "kn": "Saint Kitts and Nevis",
  "kp": "North Korea, Corea del Norte",
  "kr": "South Korea, Corea del Sur",
  "kw": "Kuwait",
  "ky": "Cayman Islands",
  "kz": "Kazakhstan",
  "la": "Laos",
  "lb": "Lebanon",
  "lc": "Saint Lucia",
  "li": "Liechtenstein",
  "lk": "Sri Lanka",
  "lr": "Liberia",
  "ls": "Lesotho",
  "lt": "Lithuania",
  "lu": "Luxembourg",
  "lv": "Latvia",
  "ly": "Libya",
  "ma": "Morocco",
  "mc": "Monaco",
  "md": "Moldova",
  "me": "Montenegro",
  "mf": "Saint Martin",
  "mg": "Madagascar",
  "mh": "Marshall Islands",
  "mk": "North Macedonia",
  "ml": "Mali",
  "mm": "Myanmar",
  "mn": "Mongolia",
  "mo": "Macau",
  "mp": "Northern Mariana Islands",
  "mq": "Martinique",
  "mr": "Mauritania",
  "ms": "Montserrat",
  "mt": "Malta",
  "mu": "Mauritius",
  "mv": "Maldives",
  "mw": "Malawi",
  "mx": "Mexico",
  "my": "Malaysia",
  "mz": "Mozambique",
  "na": "Namibia",
  "nc": "New Caledonia",
  "ne": "Niger",
  "nf": "Norfolk Island",
  "ng": "Nigeria",
  "ni": "Nicaragua",
  "nl": "Netherlands",
  "no": "Norway",
  "np": "Nepal",
  "nr": "Nauru",
  "nu": "Niue",
  "nz": "New Zealand",
  "om": "Oman",
  "pa": "Panama",
  "pe": "Peru",
  "pf": "French Polynesia",
  "pg": "Papua New Guinea",
  "ph": "Philippines",
  "pk": "Pakistan",
  "pl": "Poland",
  "pm": "Saint Pierre and Miquelon",
  "pn": "Pitcairn Islands",
  "pr": "Puerto Rico",
  "ps": "Palestine",
  "pt": "Portugal",
  "pw": "Palau",
  "py": "Paraguay",
  "qa": "Qatar, Catar",
  "re": "Réunion",
  "ro": "Romania",
  "rs": "Serbia",
  "ru": "Russia, Rusia",
  "rw": "Rwanda",
  "sa": "Saudi Arabia",
  "sb": "Solomon Islands",
  "sc": "Seychelles",
  "sd": "Sudan",
  "se": "Sweden",
  "sg": "Singapore, Singapur",
  "sh": "Saint Helena, Ascension and Tristan da Cunha",
  "si": "Slovenia",
  "sj": "Svalbard and Jan Mayen",
  "sk": "Slovakia",
  "sl": "Sierra Leone",
  "sm": "San Marino",
  "sn": "Senegal",
  "so": "Somalia",
  "sr": "Suriname",
  "ss": "South Sudan",
  "st": "São Tomé and Príncipe",
  "sv": "El Salvador",
  "sx": "Sint Maarten",
  "sy": "Syria",
  "sz": "Eswatini (Swaziland)",
  "tc": "Turks and Caicos Islands",
  "td": "Chad",
  "tf": "French Southern and Antarctic Lands",
  "tg": "Togo",
  "th": "Thailand",
  "tj": "Tajikistan",
  "tk": "Tokelau",
  "tl": "Timor-Leste",
  "tm": "Turkmenistan",
  "tn": "Tunisia",
  "to": "Tonga",
  "tr": "Turkey, Turquía",
  "tt": "Trinidad and Tobago",
  "tv": "Tuvalu",
  "tw": "Taiwan",
  "tz": "Tanzania",
  "ua": "Ukraine, Ucrania",
  "ug": "Uganda",
  "um": "United States Minor Outlying Islands",
  "un": "United Nations",
  "us": "United States, Estados Unidos",
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
  "us-hi": "Hawaii",
  "us-ia": "Iowa",
  "us-id": "Idaho",
  "us-il": "Illinois",
  "us-in": "Indiana",
  "us-ks": "Kansas",
  "us-ky": "Kentucky",
  "us-la": "Louisiana",
  "us-ma": "Massachusetts",
  "us-md": "Maryland",
  "us-me": "Maine",
  "us-mi": "Michigan",
  "us-mn": "Minnesota",
  "us-mo": "Missouri",
  "us-ms": "Mississippi",
  "us-mt": "Montana",
  "us-nc": "North Carolina",
  "us-nd": "North Dakota",
  "us-ne": "Nebraska",
  "us-nh": "New Hampshire",
  "us-nj": "New Jersey",
  "us-nm": "New Mexico",
  "us-nv": "Nevada",
  "us-ny": "New York",
  "us-oh": "Ohio",
  "us-ok": "Oklahoma",
  "us-or": "Oregon",
  "us-pa": "Pennsylvania",
  "us-ri": "Rhode Island",
  "us-sc": "South Carolina",
  "us-sd": "South Dakota",
  "us-tn": "Tennessee",
  "us-tx": "Texas",
  "us-ut": "Utah",
  "us-va": "Virginia",
  "us-vt": "Vermont",
  "us-wa": "Washington",
  "us-wi": "Wisconsin",
  "us-wv": "West Virginia",
  "us-wy": "Wyoming",
  "uy": "Uruguay",
  "uz": "Uzbekistan",
  "va": "Vatican City (Holy See)",
  "vc": "Saint Vincent and the Grenadines",
  "ve": "Venezuela",
  "vg": "British Virgin Islands",
  "vi": "United States Virgin Islands",
  "vn": "Vietnam",
  "vu": "Vanuatu",
  "wf": "Wallis and Futuna",
  "ws": "Samoa",
  "xk": "Kosovo",
  "ye": "Yemen",
  "yt": "Mayotte",
  "za": "South Africa, Sudáfrica",
  "zm": "Zambia",
  "zw": "Zimbabwe, Zimbabue"
}

// ----- funciones 
// matchingData = listado botones rescatado desde el modal
function displayAutocompleteCanales(matchingData, inputForm) { 
  const autocompleteContainer = document.createElement('div');
  autocompleteContainer.classList.add('autocomplete-container', 'shadow');
  let inputId = inputForm.getAttribute('id');
    inputId = inputId.replace('input-de-', 'autocomplete-de-');
  autocompleteContainer.setAttribute('id', inputId);









  

  // que siempre autocompleteContainer tenga el tamaño restante debajo del input
  const formFloating = document.querySelector(`#div-cambio-de-${inputId.replace('autocomplete-de-', '')} div.form-floating`);
  const alturaFF = formFloating.offsetHeight;
  const marginBottomFF = parseInt(getComputedStyle(formFloating).marginBottom);
  const parentDiv = document.querySelector(`#div-cambio-de-${inputId.replace('autocomplete-de-', '')}`);
  const alturaPD = parentDiv.offsetHeight;
  const alturaMaximaAC = alturaPD - alturaFF - marginBottomFF;
  autocompleteContainer.style.maxHeight = alturaMaximaAC + "px";


  














  // genera boton abajo del input de cada canal
  matchingData.forEach(btn => {
    let btnAtr = btn.getAttribute('data-canal');
    let btnP = btn.querySelector('p');
    let btnClass = btn.getAttribute('class'); // rescatar clases boton de modal para mostrar los activos
    let btnPClass = btnP.getAttribute('class'); // rescatar clases parrafo para estilo de titulo a la izquierda e iconos a la derecha
   
    // almacena item internos del boton del modal si es que existen
    let btnSpan = btnP.querySelector('span') ? btnP.querySelector('span').cloneNode(true) : null;
    let btnImg = btnP.querySelector('img') ? btnP.querySelector('img').cloneNode(true) : null;
    let btnDiv = btnP.querySelector('div') ? btnP.querySelector('div').cloneNode(true) : null;
    // crear boton listado sugerencias a mostrar cuando se haga input
    let sugerencia = document.createElement('button');
    sugerencia.classList.add('sugerencia', 'fs-smaller', 'border', 'p-2', 'w-100', 'rounded-0', ...btnClass.split(' '), ...btnPClass.split(' '))
    sugerencia.setAttribute('data-canal-sugerencia', btnAtr);
    sugerencia.innerHTML = btnSpan.outerHTML + (btnDiv ? btnDiv.outerHTML : '') + (btnImg ? btnImg.outerHTML : '');

    // que hacer cuando se hace clic en algun canal del listado sugerencias
    sugerencia.addEventListener('click', () => {
      // continuar aqui :/

      // problemas encontrados:
      // 1- si se deja configuracion de 6 canales por fila y 12 canales por fila, container sugerencias queda inutilizable
      // 2- mismo problema que punto 1 se repite con el overlay debido a que comienza con overflow y el separado automatico se va a la cresta (mas aun en telefonos desde opcion 3 canales por fila)
      // 3- falta añadir que se muestra div cambio canal cuando señal es de fuente m3u8
      // 4- falta aun guardar orden canales si se reordenan
      // 5- quizas añadir opcion de ocultar foton flotante personalizaciones
      
      autocompleteContainer.remove();
    });
    autocompleteContainer.appendChild(sugerencia);
  });
  const existingAutocompleteContainer = document.querySelector(`#${inputId}.autocomplete-container`)
  existingAutocompleteContainer ? existingAutocompleteContainer.replaceWith(autocompleteContainer) : inputForm.parentNode.appendChild(autocompleteContainer);

  document.addEventListener('click', function (event) {
    const autocompleteContainer = document.querySelector('.autocomplete-container');
    if (autocompleteContainer && !event.target.closest('.autocomplete-container') && event.target !== inputForm) {
      autocompleteContainer.remove();
    } 
  });
}

function crearIframe(source, titleIframe, canalId) {
  const fragmentIFRAME = document.createDocumentFragment();
  /* div general canal */
  const div = document.createElement('div');
  div.classList.add('ratio', 'ratio-16x9');
  div.setAttribute('data-canal-cambio', canalId);

  const divGeneralInputCambio = document.createElement('div');
    divGeneralInputCambio.classList.add('d-none', 'position-absolute', 'flex-column',  'px-5', 'bg-dark-subtle', 'w-100', 'h-100', 'overflow-hidden');
    divGeneralInputCambio.setAttribute('id', `div-cambio-de-${canalId}`);

  const divFormFloating = document.createElement('div');
    divFormFloating.classList.add('form-floating', 'm-auto');

  const inputDatalist = document.createElement('input');
    inputDatalist.classList.add('form-control');
    inputDatalist.setAttribute('type', 'search');
    inputDatalist.setAttribute('id', `input-de-${canalId}`)
    inputDatalist.setAttribute('placeholder', 'Escribe para buscar...')

  const labelDatalist = document.createElement('label');
    labelDatalist.setAttribute('for', `input-de-${canalId}`)
    labelDatalist.innerText = 'Cambiar canal por:'
  
    divFormFloating.append(inputDatalist)
    divFormFloating.append(labelDatalist)
  divGeneralInputCambio.append(divFormFloating)
  
  inputDatalist.addEventListener('input', function () {
    let listaBotones = document.querySelectorAll(`#modal-canales button[data-canal]`);
    let inputCambioCanal = document.querySelector(`#input-de-${canalId}`);
    displayAutocompleteCanales(listaBotones, inputCambioCanal);
  });

  inputDatalist.addEventListener('click', function () {
    let listaBotones = document.querySelectorAll(`#modal-canales button[data-canal]`);
    let inputCambioCanal = document.querySelector(`#input-de-${canalId}`);
    displayAutocompleteCanales(listaBotones, inputCambioCanal);
  });

  div.append(divGeneralInputCambio)

  /* div iframe videos */
  const divIFRAME = document.createElement('iframe');
  divIFRAME.src = source;
  divIFRAME.setAttribute('iframe-canal-cambio', canalId);
  divIFRAME.allowFullscreen = true;
  divIFRAME.title = titleIframe
  divIFRAME.referrerPolicy = 'no-referrer';  // para stream 24-horas-6
  div.append(divIFRAME);
  fragmentIFRAME.append(div);
  return fragmentIFRAME;
};

function crearOverlay(nombre, fuente, pais, altIcon, canalId) {
  const fragmentOVERLAY = document.createDocumentFragment();
  const a = document.createElement('a');
  if (pais === undefined && altIcon === undefined) {
    contenido = nombre;
  } else if (pais === undefined && altIcon !== undefined) {
    contenido = `${nombre} ${altIcon}`;
  } else {
    contenido = `${nombre} <img src="https://flagcdn.com/${pais.toLowerCase()}.svg" alt="bandera ${paises[pais]}" title="${paises[pais]}">`;
  }
  a.innerHTML = contenido + `<i class="bi bi-box-arrow-up-right"></i>`;
  a.title = 'Ir a la página oficial de esta transmisión';
  a.href = fuente;
  a.setAttribute('tabindex', 0);
  a.rel = 'noopener nofollow noreferrer';
  a.classList.add('d-flex', 'justify-content-center', 'align-items-center', 'gap-1', 'bg-black', 'btn', 'btn-sm', 'btn-dark', 'p-0', 'px-1');

  let btnRemove = document.createElement('button');
  btnRemove.classList.add('btn', 'btn-sm', 'btn-danger', 'top-0', 'end-0', 'p-0', 'px-1', 'd-flex', 'justify-content-center', 'align-items-center', 'gap-1');
  btnRemove.setAttribute('aria-label', 'Close');
  btnRemove.setAttribute('type', 'button');
  btnRemove.setAttribute('title', 'Quitar canal');
  btnRemove.innerHTML = '<span class="ocultar-en-768px">Quitar</span><i class="bi bi-x-circle"></i>';
  btnRemove.addEventListener('click', () => {
    tele.remove(canalId)
  });

  let btnCambiarSeñal = document.createElement('button');
  btnCambiarSeñal.classList.add('btn', 'btn-sm', 'btn-light', 'top-0', 'end-0', 'p-0', 'px-1', 'd-flex', 'justify-content-center', 'align-items-center', 'gap-1');
  btnCambiarSeñal.setAttribute('type', 'button');
  btnCambiarSeñal.setAttribute('title', 'Cambiar este canal');
  btnCambiarSeñal.innerHTML = '<span class="ocultar-en-768px">Cambiar</span><i class="bi bi-arrow-repeat"></i>';
  btnCambiarSeñal.setAttribute('data-button-cambio', canalId);
  btnCambiarSeñal.addEventListener('click', () => {
    // Selecciona el iframe por el atributo iframe-canal-cambio
    let interiorIframePorCambiar = document.querySelector(`iframe[iframe-canal-cambio="${canalId}"]`);

    let divGeneralCambiarCanal = document.querySelector(`div#div-cambio-de-${canalId}`);
    divGeneralCambiarCanal.classList.remove('d-none');
    divGeneralCambiarCanal.classList.add('d-flex');

    if (interiorIframePorCambiar) {
        // Guarda una referencia al padre del iframe
        const padreIframe = interiorIframePorCambiar.parentNode;
        // Guarda una referencia al índice del iframe en su padre
        const indiceIframe = Array.prototype.indexOf.call(padreIframe.children, interiorIframePorCambiar);
        // Remueve el iframe del DOM
        padreIframe.removeChild(interiorIframePorCambiar);
        // Función para volver a agregar el iframe
        function volverAlIframeOriginal() {
            divGeneralCambiarCanal.classList.remove('d-flex');
            divGeneralCambiarCanal.classList.add('d-none');
            // Inserta el iframe de nuevo en el mismo lugar en el que estaba antes de ser eliminado
            padreIframe.insertBefore(interiorIframePorCambiar, padreIframe.children[indiceIframe]);
            // ocultar el container de sugerencias al volver
            const existingAutocompleteContainer = document.querySelector(`#input-de-${canalId}.autocomplete-container`)
            if (existingAutocompleteContainer) {
              existingAutocompleteContainer.remove();
            }
            // limpiar texto de input
            const inputCanal = document.querySelector(`#input-de-${canalId}`)
            inputCanal.value = '';
            // Elimina el evento "click" para volver a agregar el iframe
            btnCambiarSeñal.removeEventListener("click", volverAlIframeOriginal);
        }
        // Agrega un evento "click" al botón para volver a agregar el iframe
        btnCambiarSeñal.addEventListener("click", volverAlIframeOriginal);
    }
  });
  let btnMoverEnGrid = document.createElement('button');
  btnMoverEnGrid.classList.add('btn', 'btn-sm', 'btn-secondary', 'p-0', 'px-1', 'handle', 'd-flex', 'justify-content-center', 'align-items-center', 'gap-1');
  btnMoverEnGrid.setAttribute('type', 'button');
  btnMoverEnGrid.setAttribute('title', 'Mover este canal');
  btnMoverEnGrid.innerHTML = '<span class="ocultar-en-768px">Mover</span><i class="bi bi-arrows-move"></i>'

  const divOVERLAY = document.createElement('div');
  divOVERLAY.classList.add('barra-overlay', 'position-absolute', 'd-flex', 'flex-wrap', 'justify-content-evenly', 'gap-1', 'top-0', 'end-0', 'mt-1', 'me-1', 'ps-1', 'pe-0');
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
  add: (canal) => {
    // listaCanales = canales.js
    if (typeof canal !== 'undefined' && typeof listaCanales[canal] !== 'undefined') {
      let { iframe_url, m3u8_url, yt_id, yt_embed, yt_playlist, nombre, fuente, pais, alt_icon } = listaCanales[canal];
      canalesStorage[canal] = nombre;
      localStorage.setItem('canales_storage', JSON.stringify(canalesStorage));

      let fragmentTransmision = document.createDocumentFragment();
      let divTransmision = document.createElement('div');
      divTransmision.classList.add('position-relative', `col-${checkMovil() ? sizeMovil : size}`, 'shadow');
      divTransmision.setAttribute('data-canal', canal);

      if (typeof iframe_url !== 'undefined') {
        divTransmision.append(crearIframe(iframe_url, nombre, canal), crearOverlay(nombre, fuente, pais, alt_icon, canal));
      } else if (typeof m3u8_url !== 'undefined') {
        const divM3u8 = document.createElement('div');
        divM3u8.classList.add('m3u-stream');
        const videoM3u8 = document.createElement('video');
        videoM3u8.setAttribute('data-canal-m3u', canal);
        videoM3u8.classList.add('m3u-player', 'video-js', 'vjs-16-9', 'vjs-fluid');
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

      let btnTransmisionOn = document.querySelectorAll(`button[data-canal="${canal}"]`);
      btnTransmisionOn.forEach(btn => {
        btn.classList.replace('btn-outline-secondary', 'btn-primary');
      });

    } else {
      console.log(`${canal} no es válido como canal, revisa si se borró y/o reinicia tu localStorage`);
    }
  },
  remove: (canal) => {
    let transmisionPorRemover = document.querySelector(`div[data-canal="${canal}"]`);
    if (transmisionPorRemover) {
      canalesGrid.removeChild(transmisionPorRemover);

      let btnTransmisionOff = document.querySelectorAll(`button[data-canal="${canal}"]`);
      btnTransmisionOff.forEach(btn => {
        btn.classList.replace('btn-primary', 'btn-outline-secondary');
      });

      // remueve de localstorage
      delete canalesStorage[canal];
      localStorage.setItem('canales_storage', JSON.stringify(canalesStorage));
    }
  },
  populateModal: () => {
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
        let nombrePais = paises[pais.toLowerCase()];
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
        let nombrePais = paises[pais.toLowerCase()];
        img.setAttribute('src', `https://flagcdn.com/${pais.toLowerCase()}.svg`);
        img.setAttribute('alt', `bandera ${nombrePais}`);
        img.setAttribute('title', nombrePais);
        img.classList.add('h-100', 'm-0');
        btnTransmision.setAttribute('country', `${nombrePais}`);
        pNombreCanalDentroBoton.append(img);
        numeroCanalesConPais.push(pais);
      } else if (!pais && alt_icon) {
        pNombreCanalDentroBoton.innerHTML += alt_icon;
        btnTransmision.setAttribute('country', 'Unknow');
        numeroCanalesConPais.push('Unknow');
      } else {
        btnTransmision.setAttribute('country', 'Unknow');
        numeroCanalesConPais.push('Unknow');
      }

      btnTransmision.append(pNombreCanalDentroBoton);
      fragmentBtn.appendChild(btnTransmision);

      const clonedBtnTransmision = btnTransmision.cloneNode(true); // Clonar el botón
      fragmentBtn2.appendChild(clonedBtnTransmision);
    }

    // Agregar fragmentos al DOM después de completar el bucle
    document.querySelector('#modal-body-botones-canales').appendChild(fragmentBtn);
    document.querySelector('#offcanvas-body-botones-canales').appendChild(fragmentBtn2);

    // Asignar eventos después de que los botones estén en el DOM
    document.querySelectorAll('#modal-body-botones-canales button').forEach(btn => {
      btn.addEventListener('click', () => {
        const action = btn.classList.contains('btn-outline-secondary') ? 'add' : 'remove';
        tele[action](btn.getAttribute('data-canal'));
      });
    });

    document.querySelectorAll('#offcanvas-body-botones-canales button').forEach(btn => {
      btn.addEventListener('click', () => {
        const action = btn.classList.contains('btn-outline-secondary') ? 'add' : 'remove';
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
      let nombrePais = paises[bandera];
      let btn = document.createElement('button');
      btn.classList.add('btn', 'btn-outline-secondary', 'd-flex', 'justify-content-between', 'align-items-center');
      btn.setAttribute('type', 'button');
      btn.setAttribute('data-country', bandera);
      let span = document.createElement('span');
      span.classList.add('badge', 'bg-secondary', 'rounded-pill');
      span.innerHTML = conteoNumeroCanalesConPais[bandera] || 0;
      if (paises[bandera]) {
        let img = document.createElement('img');
        img.setAttribute('src', `https://flagcdn.com/${bandera}.svg`);
        img.setAttribute('alt', `bandera ${nombrePais}`);
        img.setAttribute('title', nombrePais);
        img.classList.add('rounded-5');
        btn.append(img, span);
      } else {
        btn.innerHTML = bandera;
        btn.append(span);
      }

      fragmentBtnsFiltroBanderas.appendChild(btn);
    }

    // Clona el fragmento para poder agregarlo a diferentes contenedores
    const clonedFragmentBtn = fragmentBtnsFiltroBanderas.cloneNode(true);

    // Agrega los fragmentos con los botones y sus eventos a los contenedores en el DOM
    document.querySelector('#modal-collapse-botones-listado-filtro-paises').appendChild(fragmentBtnsFiltroBanderas);
    document.querySelector('#offcanvas-collapse-botones-listado-filtro-paises').appendChild(clonedFragmentBtn);

    document.querySelectorAll('#modal-collapse-botones-listado-filtro-paises button').forEach(btn => {
      btn.addEventListener('click', () => {
        console.log("El clic se originó dentro del contenedor containerModalBody")
        // El clic se originó dentro del contenedor containerBtnBanderas
        let todoBtn = document.querySelector('#modal-collapse-botones-listado-filtro-paises').querySelectorAll('button');
        todoBtn.forEach(btn => {
          btn.classList.replace('btn-primary', 'btn-outline-secondary');
        });

        btn.classList.replace('btn-outline-secondary', 'btn-primary');

        let filtro = paises[btn.dataset.country] ? paises[btn.dataset.country] : 'Unknow';
        filtrarCanalesPorInput(filtro, document.querySelector('#modal-body-botones-canales'));
      });
    });

    document.querySelectorAll('#offcanvas-collapse-botones-listado-filtro-paises button').forEach(btn => {
      btn.addEventListener('click', () => {
        console.log("El clic se originó dentro del contenedor containerOffcanvasBody")
        let todoBtn = document.querySelector('#offcanvas-collapse-botones-listado-filtro-paises').querySelectorAll('button');
        todoBtn.forEach(btn => {
          btn.classList.replace('btn-primary', 'btn-outline-secondary');
        });

        btn.classList.replace('btn-outline-secondary', 'btn-primary');

        let filtro = paises[btn.dataset.country] ? paises[btn.dataset.country] : 'Unknow';
        filtrarCanalesPorInput(filtro, document.querySelector('#offcanvas-body-botones-canales'));
      });
    });


  },
  init: () => {
    tele.populateModal();

    const localStorageCanales = localStorage.getItem('canales_storage');
    const canalesPredeterminados = ['24-horas-2', 'meganoticias-3', 't13-4'];
    const canalesExtras = ['chv-noticias-3', 'galeria-cima', 'lofi-girl'];

    const canalesAgregar = checkMovil() ? canalesPredeterminados : canalesPredeterminados.concat(canalesExtras);

    if (localStorageCanales === null) {
      canalesAgregar.forEach(canal => tele.add(canal));
    } else {
      Object.keys(lsCanalesJson).forEach(canal => tele.add(canal));
    }
  }
};

tele.init();

/* 
   ___ _____ ___  ___  ___          _ 
  / _ \_   _| _ \/ _ \/ __| __ ____| |
 | (_) || | |   / (_) \__ \ \ \ / _` |
  \___/ |_| |_|_\\___/|___/ /_\_\__,_|
*/
// ----- añade número total de canales a boton "global" del filtro banderas 
document.querySelector('#modal-span-con-numero-total-canales').textContent = Object.keys(listaCanales).length
document.querySelector('#offcanvas-span-con-numero-total-canales').textContent = Object.keys(listaCanales).length


// plugin para mover canales en grid
new Sortable(canalesGrid, {
  animation: 550,
  handle: '.handle',
  ghostClass: 'marca-al-mover',
});