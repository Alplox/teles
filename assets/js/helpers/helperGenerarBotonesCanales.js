import { listaCanales, ORIGEN_PREDETERMINADO } from "../canalesData.js";
import { CLASE_CSS_BOTON_SECUNDARIO, CODIGOS_PAISES, ICONOS_PARA_CATEGORIAS, PREFIJOS_ID_CONTENEDORES_CANALES } from "../constants/index.js";
import { CONTAINER_VIDEO_VISION_UNICA, tele } from "../main.js";
import { mostrarToast, revisarSeñalesVacias, guardarOrdenOriginal } from "./index.js";

// SVG bandera genérica para países desconocidos
const SVG_BANDERA_DESCONOCIDO = `
<svg width="24" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
    <rect width="16" height="16" rx="2" fill="#e0e0e0"/>
    <rect x="2" y="2" width="12" height="12" rx="1" fill="#bdbdbd"/>
    <text x="8" y="11" text-anchor="middle" font-size="8" fill="#757575">?</text>
</svg>
`;

const SELECTORES_CONTENEDORES = [
    '#modal-canales-body-botones-canales',
    '#offcanvas-canales-body-botones-canales',
    '#modal-cambiar-canal-body-botones-canales',
    '#vision-unica-body-botones-canales'
];

/**
 * Renderiza los botones agrupados por el origen de la lista M3U.
 */
export function crearBotonesParaCanales() {
    try {
        const gruposPorOrigen = agruparCanalesPorOrigen();
        SELECTORES_CONTENEDORES.forEach(selector => {
            const contenedor = document.querySelector(selector);
            if (!contenedor) return;
            contenedor.innerHTML = '';
            const idBase = contenedor.id || selector.replace('#', '') || 'grupo-canales';
            const fragmento = construirFragmentoCanales(gruposPorOrigen, { idBase });
            contenedor.append(fragmento);
        });

        asignarEventosBotones();

        for (const PREFIJO of PREFIJOS_ID_CONTENEDORES_CANALES) {
            guardarOrdenOriginal(`${PREFIJO}-body-botones-canales`);
        }
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

/**
 * Agrupa los canales por su origen para crear bloques visibles.
 * @returns {[string, { id: string, data: any }[]][]}
 */
function agruparCanalesPorOrigen() {
    const grupos = new Map();
    for (const canalId of Object.keys(listaCanales)) {
        const data = listaCanales[canalId];
        const origen = data?.origenLista ?? ORIGEN_PREDETERMINADO;
        if (!grupos.has(origen)) grupos.set(origen, []);
        grupos.get(origen).push({ id: canalId, data });
    }
    return Array.from(grupos.entries()).sort((a, b) => a[0].localeCompare(b[0], 'es', { sensitivity: 'base' }));
}

/**
 * Construye un fragmento de DOM reutilizable que contiene los botones agrupados.
 * @param {[string, { id: string, data: any }[]][]} grupos
 * @param {{ idBase?: string }} [opciones]
 */
function construirFragmentoCanales(grupos, { idBase = 'grupo-canales' } = {}) {
    const fragment = document.createDocumentFragment();
    grupos.forEach(([origen, canales], index) => {
        const wrapper = document.createElement('div');
        wrapper.classList.add('grupo-canales-origen', 'mb-2', 'p-2', 'rounded-3', 'border', 'border-light-subtle', 'bg-dark-subtle');
        wrapper.setAttribute('data-origen-lista', origen);

        const collapseId = `${idBase}-origen-${index}`;

        const header = document.createElement('div');
        header.classList.add('d-flex', 'align-items-center', 'gap-2', 'flex-wrap');

        header.setAttribute('data-bs-toggle', 'collapse');
        header.setAttribute('data-bs-target', `#${collapseId}`);
        header.setAttribute('role', 'button');
        header.setAttribute('aria-expanded', 'true');
        header.setAttribute('aria-controls', collapseId);
        header.innerHTML = `
            <span class="badge rounded-pill text-bg-secondary">${origen}</span>
            <small class="text-secondary">${canales.length} canales</small>
            <i class="bi bi-chevron-up ms-auto"></i>
        `;

        const lista = document.createElement('div');
        lista.classList.add('d-flex', 'flex-column', 'gap-2');
        canales.forEach(({ id, data }) => {
            lista.append(crearBotonCanal(id, data));
        });

        const contenidoColapsable = document.createElement('div');
        contenidoColapsable.classList.add('mt-1');
        contenidoColapsable.append(lista);

        const collapse = document.createElement('div');
        collapse.classList.add('collapse', 'show');
        collapse.id = collapseId;
        collapse.append(contenidoColapsable);

        wrapper.append(header, collapse);

        fragment.append(wrapper);
    });
    return fragment;
}

/**
 * Genera un botón individual para un canal.
 * @param {string} canalId
 * @param {Record<string, any>} canalData
 */
function crearBotonCanal(canalId, canalData) {
    let { nombre, país, categoría } = canalData;
    categoría = (categoría ?? '').toLowerCase();
    const iconoCategoria = categoría && categoría in ICONOS_PARA_CATEGORIAS ? ICONOS_PARA_CATEGORIAS[categoría] : '<i class="bi bi-tv"></i>';
    const nombrePais = país && CODIGOS_PAISES[país.toLowerCase()] ? CODIGOS_PAISES[país.toLowerCase()] : 'Desconocido';

    const botonCanal = document.createElement('button');
    botonCanal.setAttribute('data-canal', canalId);
    botonCanal.setAttribute('data-country', `${nombrePais}`);
    botonCanal.classList.add('btn', CLASE_CSS_BOTON_SECUNDARIO, 'd-flex', 'justify-content-between', 'align-items-center', 'gap-2', 'text-start', 'rounded-3');
    if (revisarSeñalesVacias(canalId)) botonCanal.classList.add('d-none');
    botonCanal.innerHTML = `
        <span class="flex-grow-1">${nombre}</span>
        ${
            país && CODIGOS_PAISES[país.toLowerCase()]
                ? `<img src="https://flagcdn.com/${país.toLowerCase()}.svg" alt="bandera ${nombrePais}" title="${nombrePais}" class="svg-bandera rounded-1">`
                : `<span class="svg-bandera rounded-1 h-100" title="Sin bandera para país [${nombrePais}]">${SVG_BANDERA_DESCONOCIDO}</span>`
        }
        ${iconoCategoria ? `${iconoCategoria}` : ''}`;
    return botonCanal;
}

function asignarEventosBotones() {
    document.querySelectorAll('#modal-canales-body-botones-canales button, #offcanvas-canales-body-botones-canales button').forEach(botonCanalEnDOM => {
        botonCanalEnDOM.addEventListener('click', () => {
            const accionBoton = botonCanalEnDOM.classList.contains(CLASE_CSS_BOTON_SECUNDARIO) ? 'add' : 'remove';
            tele[accionBoton](botonCanalEnDOM.dataset.canal);
        });
    });

    document.querySelectorAll('#modal-cambiar-canal-body-botones-canales button').forEach(botonCanalEnDOM => {
        botonCanalEnDOM.setAttribute('data-bs-dismiss', 'modal');
    });

    document.querySelectorAll('#vision-unica-body-botones-canales button').forEach(botonCanalEnDOM => {
        botonCanalEnDOM.addEventListener('click', () => {
            const canalEnUso = CONTAINER_VIDEO_VISION_UNICA.querySelector('div[data-canal]');
            if (canalEnUso) {
                tele.remove(canalEnUso.dataset.canal);
            }
            const accionBoton = botonCanalEnDOM.classList.contains(CLASE_CSS_BOTON_SECUNDARIO) ? 'add' : 'remove';
            tele[accionBoton](botonCanalEnDOM.dataset.canal);
        });
    });
}