import { listaCanales } from "../canalesData.js";
import { CLASE_CSS_BOTON_SECUNDARIO, CODIGOS_PAISES, ICONOS_PARA_CATEGORIAS, PREFIJOS_ID_CONTENEDORES_CANALES } from "../constants/index.js";
import { CONTAINER_VIDEO_VISION_UNICA, tele } from "../main.js";
import { mostrarToast, revisarSeñalesVacias, guardarOrdenOriginal } from "./index.js";

export function crearBotonesParaCanales() {
    try {
        const FRAGMENT_BOTONES_CANALES = document.createDocumentFragment();
        for (const canal of Object.keys(listaCanales)) {
            let { nombre, /* logo, */ país, categoría } = listaCanales[canal];
            categoría = categoría.toLowerCase();
            let iconoCategoria = categoría && categoría in ICONOS_PARA_CATEGORIAS ? ICONOS_PARA_CATEGORIAS[categoría] : '<i class="bi bi-tv"></i>';
            let nombrePais = país && CODIGOS_PAISES[país.toLowerCase()] ? CODIGOS_PAISES[país.toLowerCase()] : 'Desconocido';

            let botonCanal = document.createElement('button');
            botonCanal.setAttribute('data-canal', canal);
            botonCanal.setAttribute('data-country', `${nombrePais}`);
            botonCanal.classList.add('btn', CLASE_CSS_BOTON_SECUNDARIO, 'd-flex', 'justify-content-between', 'align-items-center', 'gap-2', 'text-start', 'rounded-3');
            if (revisarSeñalesVacias(canal)) botonCanal.classList.add('d-none');
            botonCanal.innerHTML =
                `<span class="flex-grow-1">${nombre}</span>
                    ${país ? `<img src="https://flagcdn.com/${país.toLowerCase()}.svg" alt="bandera ${nombrePais}" title="${nombrePais}" class="svg-bandera rounded-1">` : ''}
                    ${iconoCategoria ? `${iconoCategoria}` : ''}`;
                    // ${logo ? `<img src="${logo}" alt="logo ${nombre}" title="logo ${nombre}" class="img-logos rounded-1">` : ''}
            FRAGMENT_BOTONES_CANALES.append(botonCanal);
        }

        document.querySelector('#modal-canales-body-botones-canales').append(FRAGMENT_BOTONES_CANALES.cloneNode(true));
        document.querySelector('#offcanvas-canales-body-botones-canales').append(FRAGMENT_BOTONES_CANALES.cloneNode(true));
        document.querySelector('#modal-cambiar-canal-body-botones-canales').append(FRAGMENT_BOTONES_CANALES.cloneNode(true));
        document.querySelector('#vision-unica-body-botones-canales').append(FRAGMENT_BOTONES_CANALES.cloneNode(true));

        // Asignar eventos después de que los botones estén en el DOM
        document.querySelectorAll('#modal-canales-body-botones-canales button, #offcanvas-canales-body-botones-canales button').forEach(botonCanalEnDOM => {
            botonCanalEnDOM.addEventListener('click', () => {
                let accionBoton = botonCanalEnDOM.classList.contains(CLASE_CSS_BOTON_SECUNDARIO) ? 'add' : 'remove';
                tele[accionBoton](botonCanalEnDOM.dataset.canal);
            });
        });

        document.querySelectorAll('#modal-cambiar-canal-body-botones-canales button').forEach(botonCanalEnDOM => {
            botonCanalEnDOM.setAttribute('data-bs-dismiss', 'modal');
        });

        document.querySelectorAll('#vision-unica-body-botones-canales button').forEach(botonCanalEnDOM => {
            botonCanalEnDOM.addEventListener('click', () => {
                if (CONTAINER_VIDEO_VISION_UNICA.querySelector('div[data-canal]')) {
                    tele.remove(CONTAINER_VIDEO_VISION_UNICA.querySelector('div[data-canal]').dataset.canal)
                }

                let accionBoton = botonCanalEnDOM.classList.contains(CLASE_CSS_BOTON_SECUNDARIO) ? 'add' : 'remove';
                tele[accionBoton](botonCanalEnDOM.dataset.canal);
            });
        });

        for (const PREFIJO of PREFIJOS_ID_CONTENEDORES_CANALES) {
            guardarOrdenOriginal(`${PREFIJO}-body-botones-canales`);
        };

    } catch (error) {
        console.error(`Error durante creación botones para canales. Error: ${error}`);
        mostrarToast(`
        <span class="fw-bold">Ha ocurrido un error durante la creación de botones para los canales.</span>
        <hr>
        <span class="bg-dark bg-opacity-25 px-2 rounded-3">Error: ${error}</span>
        <hr>
        Si error persiste tras recargar, prueba borrar tu almacenamiento local desde el panel "Personalización" o borrando la caché del navegador.
        <button type="button" class="btn btn-light rounded-pill btn-sm w-100 border-light mt-2" onclick="location.reload()"> Pulsa para recargar <i class="bi bi-arrow-clockwise"></i></button>`, 'danger', false);

        for (const PREFIJO of PREFIJOS_ID_CONTENEDORES_CANALES) {
            document.querySelector(`#${PREFIJO}-body-botones-canales`).insertAdjacentElement('afterend', insertarDivError(error, 'Ha ocurrido un error durante la creación de botones para los canales'));
        }
    }
}