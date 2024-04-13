// variable para almacenar el orden original de los botones
export let ordenOriginalEnModal = [];
let ordenOriginalEnOffcanvas = [];
let ordenOriginalEnAutocomplete = [];

let ordenOriginalGuardadoDeModal = false;
let ordenOriginalGuardadoDeOffcanvas = false;
let ordenOriginalGuardadoDeAutocomplete = false;

// Función para almacenar el orden original de los botones (solo esta función se usa en main.js)
export function guardarOrdenOriginal(containerBotones) {
    const buttonsContainer = document.getElementById(containerBotones);
    const buttons = buttonsContainer.querySelectorAll('button');
    if (!ordenOriginalGuardadoDeModal) {
        if (containerBotones.startsWith('modal')) {
            ordenOriginalEnModal = Array.from(buttons);
            ordenOriginalGuardadoDeModal = true; // Establecer true para no volver a guardarlo
        }
    }
    if (!ordenOriginalGuardadoDeOffcanvas) {
        if (containerBotones.startsWith('offcanvas')) {
            ordenOriginalEnOffcanvas = Array.from(buttons);
            ordenOriginalGuardadoDeOffcanvas = true;
        }
    }
    if (!ordenOriginalGuardadoDeAutocomplete) {
        if (containerBotones.startsWith('autocomplete')) {
            ordenOriginalEnAutocomplete = Array.from(buttons);
            ordenOriginalGuardadoDeAutocomplete = true;
        }
    }
}

// Función para ordenar los botones en orden ascendente
export function sortButtonsAsc(containerBotones) {
    let buttonsContainer = document.getElementById(containerBotones);
    let buttons = Array.from(buttonsContainer.getElementsByTagName('button'));

    buttons.sort((a, b) => {
        return a.textContent.trim().localeCompare(b.textContent.trim());
    });

    buttons.forEach((button) => {
        buttonsContainer.appendChild(button);
    });
}

// Función para ordenar los botones en orden descendente
export function sortButtonsDesc(containerBotones) {
    let buttonsContainer = document.getElementById(containerBotones);
    let buttons = Array.from(buttonsContainer.getElementsByTagName('button'));

    buttons.sort((a, b) => {
        return b.textContent.trim().localeCompare(a.textContent.trim());
    });

    buttons.forEach((button) => {
        buttonsContainer.appendChild(button);
    });
}

// Función para restaurar el orden original de los botones
export function restoreOriginalOrder(containerBotones) {
    let buttonsContainer = document.getElementById(containerBotones);
    buttonsContainer.innerHTML = ''; // Limpiar el contenedor de botones

    if (containerBotones.startsWith('modal')) {
        ordenOriginalEnModal.forEach((button) => {
            buttonsContainer.appendChild(button);
        });
    } else if (containerBotones.startsWith('offcanvas')) {
        ordenOriginalEnOffcanvas.forEach((button) => {
            buttonsContainer.appendChild(button);
        });
    } else if (containerBotones.startsWith('autocomplete')) {
        ordenOriginalEnAutocomplete.forEach((button) => {
            buttonsContainer.appendChild(button);
        });
    }

}
