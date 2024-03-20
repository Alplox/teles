
// variable para almacenar el orden original de los botones
let ordenOriginalEnModal = [];
let ordenOriginalEnOffcanvas = [];

// Función para almacenar el orden original de los botones
function guardarOrdenOriginal(containerBotones) {
  let buttonsContainer = document.getElementById(containerBotones);
  containerBotones.startsWith('modal') ? ordenOriginalEnModal = Array.from(buttonsContainer.children) : ordenOriginalEnOffcanvas = Array.from(buttonsContainer.children);
}

// Función para ordenar los botones en orden ascendente
function sortButtonsAsc(containerBotones) {
  let buttonsContainer = document.getElementById(containerBotones);
  let buttons = Array.from(buttonsContainer.getElementsByTagName('button'));

  buttons.sort(function(a, b) {
      return a.textContent.trim().localeCompare(b.textContent.trim());
  });

  buttons.forEach(function(button) {
      buttonsContainer.appendChild(button);
  });
}

// Función para ordenar los botones en orden descendente
function sortButtonsDesc(containerBotones) {
  let buttonsContainer = document.getElementById(containerBotones);
  let buttons = Array.from(buttonsContainer.getElementsByTagName('button'));

  buttons.sort(function(a, b) {
      return b.textContent.trim().localeCompare(a.textContent.trim());
  });

  buttons.forEach(function(button) {
      buttonsContainer.appendChild(button);
  });
}

// Función para restaurar el orden original de los botones
function restoreOriginalOrder(containerBotones) {
  let buttonsContainer = document.getElementById(containerBotones);
  buttonsContainer.innerHTML = ''; // Limpiar el contenedor de botones

    if (containerBotones.startsWith('modal')) {
        ordenOriginalEnModal.forEach(function(button) {
            buttonsContainer.appendChild(button);
        });
    } else if (containerBotones.startsWith('offcanvas')) {
        ordenOriginalEnOffcanvas.forEach(function(button) {
            buttonsContainer.appendChild(button);
        });
    }
}



// Función para abrir el modal
let modalCanales = document.getElementById('modal-canales');
modalCanales.addEventListener('shown.bs.modal', () => {
    guardarOrdenOriginal('modal-body-botones-canales');
});

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



// Función para abrir el offcanvas
let offcanvasCanales = document.getElementById('offcanvasCanales');
offcanvasCanales.addEventListener('shown.bs.offcanvas', () => {
    guardarOrdenOriginal('offcanvas-body-botones-canales');
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