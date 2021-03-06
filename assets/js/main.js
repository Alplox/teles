/* 
  main v0.10
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
let lsCanales= localStorage.getItem('canales_storage');
// variable vacia, obtiene valor si localstorage posee el item 'canales_storage'
let lsCanalesJson;
// variable que almacena string/json durante intercambio para localstorage
let canalesStorage = {  };

if (lsCanales !== null) {
  // pasa string de localstorage a una variable objeto [JSON]
  lsCanalesJson = JSON.parse(window.localStorage.getItem('canales_storage'));
  // solo para info rapida desde la consola (opcional dejarlo)
  console.log(`Tienes [${Object.entries(lsCanalesJson).length}] canales en tú localStorage y son = ${JSON.stringify(Object.values(lsCanalesJson).join(' - '))}`);
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
  if(lsModal !== 'hide') {
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

overlayCheckbox.onclick = () => {
const overlayBarras = document.querySelectorAll('.barra-overlay, .overlay-btn-close');
  if (overlayBarras.length === 0){
    setTimeout(() => {
      overlayStatus.textContent -= ' (Agrega canales primero)'
      checkboxOn(overlayCheckbox,overlayStatus,'overlay');
    }, 1500);
    overlayStatus.textContent = ' (Agrega canales primero)'
  } else {
    overlayBarras.forEach(barra => {
      if (overlayCheckbox.checked === true) {
        barra.classList.remove('d-none');
        checkboxOn(overlayCheckbox,overlayStatus,'overlay');
      } else {
        barra.classList.add('d-none');
        checkboxOff(overlayCheckbox,overlayStatus,'overlay');
      }
    });
  }
};

// ocultar navbar
const navbarCheckbox = document.querySelector('#switch-navbar');
const navbarStatus = document.querySelector('#status-navbar > span');
const navbar = document.querySelector('nav');

navbarCheckbox.onclick = () => {
  if (navbarCheckbox.checked === true) {
    navbar.classList.remove('d-none');
    checkboxOn(navbarCheckbox,navbarStatus,'navbar');
  } else {
    navbar.classList.add('d-none');
    checkboxOff(navbarCheckbox,navbarStatus,'navbar');
  }
};

// ocultar fondo
const fondoCheckbox = document.querySelector('#switch-fondo');
const fondoStatus = document.querySelector('#status-fondo > span');
const fondo = document.querySelector('.fondo');

fondoCheckbox.onclick = () => {
  if (fondoCheckbox.checked === true) {
    fondo.classList.remove('d-none');
    checkboxOn(fondoCheckbox,fondoStatus,'fondo');
  } else {
    fondo.classList.add('d-none');
    checkboxOff(fondoCheckbox,fondoStatus,'fondo');
  }
};

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
let transmisionesFila = document.querySelector('#transmision-por-fila');

transmisionesFila.onchange = (event) => {
  size = event.target.value;
  sizeMovil = event.target.value;
  let transmisionesEnGrid = document.querySelectorAll('.stream');
  for (let v of transmisionesEnGrid) {
    v.classList.remove('col-12', 'col-6', 'col-4', 'col-3', 'col-2');
    v.classList.add(`col-${event.target.value}`);
  }
};

// ----- cargar desde localstorage
let lsSlider = localStorage.getItem('slider_value');
let lsFondo = localStorage.getItem('fondo');
let lsOverlay = localStorage.getItem('overlay');
let lsNavbar = localStorage.getItem('navbar');

window.addEventListener('DOMContentLoaded', () => {
  let overlayBarras = document.querySelectorAll('.barra-overlay, .overlay-btn-close');
// overlay
  if (lsOverlay !== 'hide') {
    overlayBarras.forEach(barra => {
      barra.classList.remove('d-none');
    });
    checkboxOn(overlayCheckbox,overlayStatus,'overlay');
  } else {
    overlayBarras.forEach(barra => {
      barra.classList.add('d-none');
    });
    checkboxOff(overlayCheckbox,overlayStatus,'overlay');
  }
});

// slider
if (lsSlider !== null) {
  slider.setAttribute('value', parseInt(lsSlider));
  sliderValue.innerHTML = parseInt(lsSlider);
  canalesGrid.style.maxWidth = `${parseInt(lsSlider)}%`;
};

// fondo
if (lsFondo !== 'hide') { 
  fondo.classList.remove('d-none');
  checkboxOn(fondoCheckbox,fondoStatus,'fondo');
} else {
  fondo.classList.add('d-none');
  checkboxOff(fondoCheckbox,fondoStatus,'fondo');
};

// navbar
if (lsNavbar !== 'hide') { 
  navbar.classList.remove('d-none');
  checkboxOn(navbarCheckbox,navbarStatus,'navbar');
} else {
  navbar.classList.add('d-none');
  checkboxOff(navbarCheckbox,navbarStatus,'navbar');
};

// ----- alerta borrado localstorage
const btnReset = document.querySelector('#btn-reset');
const alertReset = document.querySelector('#alert-reset');

function crearALERT(message, type) {
  let divALERT = document.createElement('div');
    divALERT.innerHTML = `<div class="alert alert-${type} alert-dismissible" role="alert">${message}<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>`;
  alertReset.append(divALERT);
};

if (btnReset) {
  btnReset.addEventListener('click', function () {  
    localStorage.clear();
    crearALERT('Tu localStorage ha sido eliminado, prueba recargando el sitio/PWA ヾ( ˃ᴗ˂ )◞ • *✰', 'success');
    document.querySelector('.alert').scrollIntoView();
  })
};

/*
   _____          _   _          _      ______  _____ 
  / ____|   /\   | \ | |   /\   | |    |  ____|/ ____|
 | |       /  \  |  \| |  /  \  | |    | |__  | (___  
 | |      / /\ \ | . ` | / /\ \ | |    |  __|  \___ \ 
 | |____ / ____ \| |\  |/ ____ \| |____| |____ ____) |
  \_____/_/    \_\_| \_/_/    \_\______|______ _____/ 
*/

// ----- traducción videojs
videojs.addLanguage("es",{
  "Play": "Reproducir",
  "Play Video": "Reproducir Vídeo",
  "Pause": "Pausa",
  "Current Time": "Tiempo reproducido",
  "Duration": "Duración total",
  "Remaining Time": "Tiempo restante",
  "Stream Type": "Tipo de secuencia",
  "LIVE": "DIRECTO",
  "Loaded": "Cargado",
  "Progress": "Progreso",
  "Fullscreen": "Pantalla completa",
  "Non-Fullscreen": "Pantalla no completa",
  "Mute": "Silenciar",
  "Unmute": "No silenciado",
  "Playback Rate": "Velocidad de reproducción",
  "Subtitles": "Subtítulos",
  "subtitles off": "Subtítulos desactivados",
  "Captions": "Subtítulos especiales",
  "captions off": "Subtítulos especiales desactivados",
  "Chapters": "Capítulos",
  "You aborted the media playback": "Ha interrumpido la reproducción del vídeo.",
  "A network error caused the media download to fail part-way.": "Un error de red ha interrumpido la descarga del vídeo.",
  "The media could not be loaded, either because the server or network failed or because the format is not supported.": "No se ha podido cargar el vídeo debido a un fallo de red o porque la transmisión dejo de estar disponible.",
  "The media playback was aborted due to a corruption problem or because the media used features your browser did not support.": "La reproducción de vídeo se ha interrumpido por un problema de corrupción de datos o porque el vídeo precisa funciones que su navegador no ofrece.",
  "No compatible source was found for this media.": "No se ha encontrado ninguna fuente compatible con este vídeo.",
  "Audio Player": "Reproductor de audio",
  "Video Player": "Reproductor de video",
  "Replay": "Volver a reproducir",
  "Seek to live, currently behind live": "Buscar en vivo, actualmente demorado con respecto a la transmisión en vivo",
  "Seek to live, currently playing live": "Buscar en vivo, actualmente reproduciendo en vivo",
  "Progress Bar": "Barra de progreso",
  "progress bar timing: currentTime={1} duration={2}": "{1} de {2}",
  "Descriptions": "Descripciones",
  "descriptions off": "descripciones desactivadas",
  "Audio Track": "Pista de audio",
  "Volume Level": "Nivel de volumen",
  "The media is encrypted and we do not have the keys to decrypt it.": "El material audiovisual está cifrado y no tenemos las claves para descifrarlo.",
  "Close": "Cerrar",
  "Modal Window": "Ventana modal",
  "This is a modal window": "Esta es una ventana modal",
  "This modal can be closed by pressing the Escape key or activating the close button.": "Esta ventana modal puede cerrarse presionando la tecla Escape o activando el botón de cierre.",
  ", opens captions settings dialog": ", abre el diálogo de configuración de leyendas",
  ", opens subtitles settings dialog": ", abre el diálogo de configuración de subtítulos",
  ", selected": ", seleccionado",
  "Close Modal Dialog": "Cierra cuadro de diálogo modal",
  ", opens descriptions settings dialog": ", abre el diálogo de configuración de las descripciones",
  "captions settings": "configuración de leyendas",
  "subtitles settings": "configuración de subtítulos",
  "descriptions settings": "configuración de descripciones",
  "Text": "Texto",
  "White": "Blanco",
  "Black": "Negro",
  "Red": "Rojo",
  "Green": "Verde",
  "Blue": "Azul",
  "Yellow": "Amarillo",
  "Magenta": "Magenta",
  "Cyan": "Cian",
  "Background": "Fondo",
  "Window": "Ventana",
  "Transparent": "Transparente",
  "Semi-Transparent": "Semitransparente",
  "Opaque": "Opaca",
  "Font Size": "Tamaño de fuente",
  "Text Edge Style": "Estilo de borde del texto",
  "None": "Ninguno",
  "Raised": "En relieve",
  "Depressed": "Hundido",
  "Uniform": "Uniforme",
  "Dropshadow": "Sombra paralela",
  "Font Family": "Familia de fuente",
  "Proportional Sans-Serif": "Sans-Serif proporcional",
  "Monospace Sans-Serif": "Sans-Serif monoespacio",
  "Proportional Serif": "Serif proporcional",
  "Monospace Serif": "Serif monoespacio",
  "Casual": "Informal",
  "Script": "Cursiva",
  "Small Caps": "Minúsculas",
  "Reset": "Restablecer",
  "restore all settings to the default values": "restablece todas las configuraciones a los valores predeterminados",
  "Done": "Listo",
  "Caption Settings Dialog": "Diálogo de configuración de leyendas",
  "Beginning of dialog window. Escape will cancel and close the window.": "Comienzo de la ventana de diálogo. La tecla Escape cancelará la operación y cerrará la ventana.",
  "End of dialog window.": "Final de la ventana de diálogo.",
  "{1} is loading.": "{1} se está cargando."
});

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
function crearIFRAME(source) {
  const fragmentIFRAME = document.createDocumentFragment();
  const div = document.createElement('div');
    div.classList.add('ratio', 'ratio-16x9');
  const divIFRAME = document.createElement('iframe');
    divIFRAME.setAttribute('src', source);
    divIFRAME.setAttribute('allowFullScreen', '');
    div.append(divIFRAME);
  fragmentIFRAME.append(div);
  return fragmentIFRAME;
};

function crearOVERLAY(nombre, fuente, pais) {
  const fragmentOVERLAY = document.createDocumentFragment();
  const a = document.createElement('a');
    if (pais === undefined) {
      a.innerHTML = nombre;
    } else {
      let nombrePais = paises[pais];
      a.innerHTML = `${nombre} <img src="https://flagcdn.com/${pais.toLowerCase()}.svg" alt="bandera ${nombrePais}" title="${nombrePais}">`;
    }
    a.setAttribute('title', 'Ir a la página oficial de esta transmisión');
    a.setAttribute('href', fuente);
    a.setAttribute('rel', 'noopener nofollow noreferrer');
  const divOVERLAY = document.createElement('div');
  divOVERLAY.classList.add('barra-overlay');
  if(overlayCheckbox.checked === true || divOVERLAY.classList.contains('d-none')) {
      divOVERLAY.classList.remove('d-none');
  } else {
    divOVERLAY.classList.add('d-none');
  }
  divOVERLAY.append(a);
  fragmentOVERLAY.append(divOVERLAY);
  return fragmentOVERLAY;
};

// ----- tele
let tele = {
    add: (canal) => {
      if (typeof canal !== 'undefined' && typeof listaCanales[canal] !== 'undefined') {
        // destructuring (almacena variables legibles) desde listaCanales == canales.js
        let {iframeURL, m3u8URL, ytID, ytEMBED, ytPLAYLIST, nombre, fuente, pais} = listaCanales[canal];
        // guarda en localstorage
        canalesStorage[canal] = nombre;
        localStorage.setItem('canales_storage', JSON.stringify(canalesStorage));
        // fragmento almacena codigo finalizado para ser añadido a 'canalesGrid'
        let fragmentTRANSMISION = document.createDocumentFragment();
        // crea 'div' primario indiferente del tipo de señal
        let divTRANSMISION = document.createElement('div');
          divTRANSMISION.classList.add('stream');
          divTRANSMISION.setAttribute('data-canal', canal);
          tele.movil() ? divTRANSMISION.classList.add(`col-${sizeMovil}`) : divTRANSMISION.classList.add(`col-${size}`);
        // btn quitar señal desde grid
        let btnRemove = document.createElement('button');
          if(overlayCheckbox.checked === true) {
            btnRemove.classList.remove('d-none');
          } else {
            btnRemove.classList.add('d-none');
          }
          btnRemove.classList.add('overlay-btn-close', 'btn-close');
          btnRemove.setAttribute('aria-label', 'Close');
          btnRemove.setAttribute('type', 'button');
          btnRemove.setAttribute('title', 'Quitar señal');
          btnRemove.addEventListener('click', () => {
            tele.remove(canal)
          });
        // examina tipo señal https://stackoverflow.com/q/5113374
        if (typeof iframeURL !== 'undefined') {
            divTRANSMISION.append(
              crearIFRAME(iframeURL), 
              crearOVERLAY(nombre, fuente, pais)
              );
        } else if (typeof m3u8URL !== 'undefined') {
            const divM3U8 = document.createElement('div');
              divM3U8.classList.add('m3u-stream');
            const videoM3U8 = document.createElement('video');
              videoM3U8.setAttribute('data-canal-m3u', canal);
              videoM3U8.classList.add('m3u-player', 'video-js', 'vjs-16-9', 'vjs-fluid');
              videoM3U8.toggleAttribute('controls');
            divM3U8.append(videoM3U8);
              divTRANSMISION.append(divM3U8, crearOVERLAY(nombre, fuente, pais));
              fragmentTRANSMISION.append(divTRANSMISION);
            canalesGrid.append(fragmentTRANSMISION);
            // carga enlace '.m3u8' una vez insertado 'videoM3U8' en 'canalesGrid'
            let playerM3U8 = videojs(document.querySelector(`video[data-canal-m3u="${canal}"]`));
              playerM3U8.src({
                src: m3u8URL,
                controls: true,
              });
            playerM3U8.autoplay('muted');
        } else if (typeof ytID !== 'undefined') {
            divTRANSMISION.append(
              crearIFRAME(`https://www.youtube-nocookie.com/embed/live_stream?channel=${ytID}&autoplay=1&mute=1&modestbranding=1&vq=medium&showinfo=0`), 
              crearOVERLAY(nombre, `https://www.youtube.com/channel/${ytID}`, pais)
              );
        } else if (typeof ytEMBED !== 'undefined') {
            divTRANSMISION.append(
              crearIFRAME(`https://www.youtube-nocookie.com/embed/${ytEMBED}?autoplay=1&mute=1&modestbranding=1&showinfo=0`), 
              crearOVERLAY(nombre, fuente, pais)
              );
        } else if (typeof ytPLAYLIST !== 'undefined') {
            divTRANSMISION.append(
              crearIFRAME(`https://www.youtube-nocookie.com/embed/videoseries?list=${ytPLAYLIST}&autoplay=0&mute=0&modestbranding=1&showinfo=0`), 
              crearOVERLAY(nombre, fuente, pais)
              );
        } else {
          console.log(`${canal} - Canal Inválido`);
        };
        // formato para insertar canal en DOM si la señal NO es m3u8 (para no repetir al final dentro de cada else if) 
        if (typeof m3u8URL === 'undefined'){
          fragmentTRANSMISION.append(divTRANSMISION);
          canalesGrid.append(fragmentTRANSMISION);
        };
        // cambia aspecto bóton al ser activado
        let btnTransmisionOn = document.querySelector(`button[data-canal="${canal}"]`);
          btnTransmisionOn.classList.remove('btn-outline-secondary');
          btnTransmisionOn.classList.add('btn-primary');
        // añade "btnRemove" luego de "barra-overlay"
        divTRANSMISION.append(btnRemove);
      } else {
        console.log(`${canal} no es válido como canal, revisa si se borró y/o reinicia tu localStorage`);
      }
    },
    remove: (canal) => {
      let transmisionPorRemover = document.querySelector(`div[data-canal="${canal}"]`);
      if (transmisionPorRemover != null) {
        canalesGrid.removeChild(transmisionPorRemover);
        let btnTransmisionOff = document.querySelector(`button[data-canal="${canal}"]`);
          btnTransmisionOff.classList.remove('btn-primary');
          btnTransmisionOff.classList.add('btn-outline-secondary');
      }
      // remueve de localstorage
      delete canalesStorage[canal];
      localStorage.setItem('canales_storage', JSON.stringify(canalesStorage));
    },
    movil: () => {
      // https://stackoverflow.com/a/11381730
      let check = false;
      ((a) => {
        if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4)))
          check = true;
      })(navigator.userAgent || navigator.vendor || window.opera);
      return check;
    },
    populateModal: () => {
      const containerBtnsCanales = document.querySelector('.modal-body-canales');
      const fragmentBTN = document.createDocumentFragment();
      for (const canal in listaCanales) {
        let {nombre, pais} = listaCanales[canal];
        let btnTransmision = document.createElement('button');
          btnTransmision.classList.add('btn', 'btn-outline-secondary');
          btnTransmision.setAttribute('data-canal', canal);
        let p = document.createElement('p');
          p.classList.add('btn-inside');
            if (pais) {
              let img = document.createElement('img');
                p.textContent = nombre;
                let nombrePais = paises[pais.toLowerCase()];
                img.setAttribute('src', `https://flagcdn.com/${pais.toLowerCase()}.svg`);
                img.setAttribute('alt', `bandera ${nombrePais}`);
                img.setAttribute('title', `${nombrePais}`);
                p.append(img)
            } else {
              p.textContent = nombre;
            }
        btnTransmision.append(p);
        btnTransmision.addEventListener('click', function () {
          if (btnTransmision.getAttribute('class').includes('btn-outline-secondary')) {
            tele.add(canal);
          } else if (btnTransmision.getAttribute('class').includes('btn-primary')) {
            tele.remove(canal);
          }
        });
        fragmentBTN.append(btnTransmision);
      };
      containerBtnsCanales.append(fragmentBTN);
    },
    init: () => {
      tele.populateModal();
      if (tele.movil()) {
        // si localstorage no existe (primera vez que carga el sitio o se limpio cache) carga estos canales
        if (localStorage.getItem("canales_storage") === null) {
          tele.add('24-horas-2');
          tele.add('t13-3');
          tele.add('meganoticias');
        } else {
          // si localstorage existe carga canales guardados (o no, ya que puede estar vacio por lo que no insertaria nada)
          for (const canal of Object.keys(lsCanalesJson)) {
            tele.add(canal);
          }
        }
      } else {
        if (localStorage.getItem('canales_storage') === null) {
          tele.add('galeria-cima');
          tele.add('24-horas-2');
          tele.add('t13-3');
          tele.add('meganoticias');
          tele.add('convencion-tv');
          tele.add('bbtv');
        } else {
          for (const canal of Object.keys(lsCanalesJson)) {
            tele.add(canal);
          }
        }
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

// ----- autofocus para filtro canales en PC
const modalCanales = document.querySelector('#modal-canales');
const filtroCanales = document.querySelector('#filtro');

modalCanales.addEventListener('shown.bs.modal', () => {
  if(!tele.movil()) {
    filtroCanales.focus();
  } 
});

// ----- filtro de canales https://css-tricks.com/in-page-filtered-search-with-vanilla-javascript/
function filtrarCANALES() {
  let BtnsCanales = document.querySelectorAll('div.modal-body-canales > button');
  for (let i = 0; i < BtnsCanales.length; i++) {
    if(BtnsCanales[i].innerHTML.normalize('NFD').replace(/[\u0300-\u036f]/g,"").toLowerCase().includes
    (filtroCanales.value.normalize('NFD').replace(/[\u0300-\u036f]/g,"").toLowerCase())) 
    {
      BtnsCanales[i].classList.remove('d-none');
    } else {
      BtnsCanales[i].classList.add('d-none');
    }
  }
};
filtroCanales.addEventListener('input', filtrarCANALES);

// ----- btn limpiar/remover todas las señales activas
const btnLimpiar = document.querySelector('#limpiar');
btnLimpiar.addEventListener('click', () => {
  let transmisionPorLimpiar = document.querySelectorAll('div.stream');
    transmisionPorLimpiar.forEach(transmision => {
      let dataCanal = transmision.getAttribute('data-canal');
      tele.remove(dataCanal);
    })
});

// ----- copiar enlace a portapapeles y alerta copiado https://codepen.io/lancebush/pen/zdxLE 
const btnEnlace = document.querySelector('#btn-enlace');

btnEnlace.onclick = () => {
  let e = document.querySelector('#enlace-compartir');
  e.select();
  e.setSelectionRange(0, 99999);
  navigator.clipboard.writeText(e.value);

  document.querySelector('.notify').classList.toggle('active');
  document.querySelector('.notify-span').classList.toggle('success');

  setTimeout(() => {
    document.querySelector('.notify').classList.remove('active');
    document.querySelector('.notify-span').classList.remove('success');
  }, 2000);
};

// ----- btn compartir sitio (usa navigator.share en telefonos) 
// https://developer.mozilla.org/en-US/docs/Web/API/Navigator/canShare
const datosCompartir = {
  title: 'teles',
  text: 'PWA Código Abierto para ver/comparar preseleccionadas transmisiones de noticias provenientes de Chile (y el mundo).',
  url: 'https://alplox.github.io/teles/',
};

const btnsCompartir = document.querySelectorAll('button.btn-outline-warning, button.btn-compartir');

if (tele.movil()){
  for (const btn of btnsCompartir){
    btn.addEventListener('click', async () => {
      try {
        await navigator.share(datosCompartir);
      } catch(err) {
        console.log(`Error: ${err}`);
      } 
    });
  }
} else {
  for (const btn of btnsCompartir){
    btn.setAttribute('data-bs-toggle', 'modal');
    btn.setAttribute('data-bs-target', '#modal-compartir');
    btn.setAttribute('data-bs-dismiss', 'modal');
  }
};

// ----- btn fullscreen
// https://javascript.plainenglish.io/enter-full-screen-mode-with-javascript-a8a782d96dc
const btnFullscreen = document.querySelector('#fullscreen'),
      btnFullscreenImg = btnFullscreen.querySelector('img'),
      btnFullscreenSpan = btnFullscreen.querySelector('span'); 

function getFullscreenElement() {
  return document.fullscreenElement   //standard property
  || document.webkitFullscreenElement //safari/opera support
  || document.mozFullscreenElement    //firefox support
  || document.msFullscreenElement;    //ie/edge support
}

function toggleFullscreen() {
  if(getFullscreenElement()) {
    document.exitFullscreen();
    btnFullscreenImg.setAttribute('src', 'assets/svg/icons/fullscreen.svg');
    btnFullscreenImg.setAttribute('alt', 'icono fullscreen');
    btnFullscreenSpan.innerHTML = 'Entrar pantalla completa';
  }else {
    document.documentElement.requestFullscreen().catch(console.log);
    btnFullscreenImg.setAttribute('src', 'assets/svg/icons/fullscreen-exit.svg');
    btnFullscreenImg.setAttribute('alt', 'icono fullscreen-exit');
    btnFullscreenSpan.innerHTML = 'Salir pantalla completa';
  }
}

btnFullscreen.addEventListener('click', () => {
  toggleFullscreen();
});