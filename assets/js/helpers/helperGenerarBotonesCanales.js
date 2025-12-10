import { channelsList, ORIGEN_PREDETERMINADO } from "../canalesData.js";
import { CSS_CLASS_BUTTON_SECONDARY, COUNTRY_CODES, CATEGORIES_ICONS, ID_PREFIX_CONTAINERS_CHANNELS } from "../constants/index.js";
import { singleViewVideoContainerEl, tele } from "../main.js";
import { showToast, areAllSignalsEmpty, guardarOrdenOriginal, reemplazarCanalActivo } from "./index.js";

import { changeChannelModalEl } from "../canalUI.js";

const SVG_UNKNOWN_COUNTRY = `
<svg width="24" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
    <rect width="16" height="16" rx="2" fill="#e0e0e0"/>
    <rect x="2" y="2" width="12" height="12" rx="1" fill="#bdbdbd"/>
    <text x="8" y="11" text-anchor="middle" font-size="8" fill="#757575">?</text>
</svg>
`;

// Contenedores que se rellenan siempre durante la carga inicial
const IDS_MAIN_BUTTONS_CONTAINERS = [
    '#modal-canales-channels-buttons-container',
    '#offcanvas-canales-channels-buttons-container'
];

/**
 * Configuraciones por escenario para manejar las interacciones de los botones.
 * Permite controlar contextos multi-selección y selección única.
 */
const BUTTON_SCENARIOS = {
    grid: {
        descripcion: 'Permite múltiples canales activos dentro de la grilla.',
        onSelect: ({ channelId, isSelecting }) => {
            if (!tele || typeof tele.add !== 'function' || typeof tele.remove !== 'function') {
                console.warn("[teles] Couldn't find 'tele' function to manage grid view.");
                return;
            }
            const action = isSelecting ? 'add' : 'remove';
            tele[action](channelId);
        }
    },
    cambio: {
        descripcion: 'Reemplaza la señal activa desde el modal "Cambiar canal".',
        onSelect: ({ channelId }) => {
            const previousChannel = changeChannelModalEl?.dataset.channelSource;
            if (!previousChannel) {
                console.warn('[teles] There is no channel selected to replace in the "Change channel" modal.');
                return;
            }
            reemplazarCanalActivo(channelId, previousChannel);
        }
    },
    'single-view': {
        descripcion: 'Sólo permite un canal activo simultáneamente.',
        onSelect: ({ channelId, isSelecting }) => {
            if (!tele || typeof tele.add !== 'function' || typeof tele.remove !== 'function') {
                console.warn("[teles] Couldn't find 'tele' function to manage single view.");
                return;
            }
            if (!singleViewVideoContainerEl) { return; } // document.querySelector('#container-video-single-view')

            if (!isSelecting) {
                tele.remove(channelId);
                return;
            }

            const canalEnUso = singleViewVideoContainerEl.querySelector('div[data-canal]');
            if (canalEnUso && canalEnUso.dataset.canal && canalEnUso.dataset.canal !== channelId) {
                tele.remove(canalEnUso.dataset.canal);
            }
            tele.add(channelId);
        }
    }
};

/**
 * Relación entre contenedores y escenarios para inicializar eventos.
 */
const BUTTON_CONTAINER_CONFIG = [
    {
        selector: '#modal-canales-channels-buttons-container',
        scenario: 'grid',
        delegateEvents: true
    },
    {
        selector: '#offcanvas-canales-channels-buttons-container',
        scenario: 'grid',
        delegateEvents: true
    },
    {
        selector: '#modal-cambiar-canal-channels-buttons-container',
        scenario: 'cambio',
        delegateEvents: false,
        applyDismissAttribute: true
    },
    {
        selector: '#single-view-channels-buttons-container',
        scenario: 'single-view',
        delegateEvents: false
    }
];

/**
 * Renderiza los botones agrupados por el origen de la lista M3U.
 */
export function crearBotonesParaCanales() {
    try {
        const gruposPorOrigen = agruparCanalesPorOrigen();
        renderizarBotonesEnContenedores(gruposPorOrigen, IDS_MAIN_BUTTONS_CONTAINERS);

        asignarEventosBotones();

        for (const PREFIJO of ID_PREFIX_CONTAINERS_CHANNELS) {
            guardarOrdenOriginal(`${PREFIJO}-channels-buttons-container`);
        }
    } catch (error) {
        console.error(`Error durante creación botones para canales. Error: ${error}`);
        showToast({
            title: 'Ha ocurrido un error durante la creación de botones para los canales.',
            body: `Error: ${error}`,
            type: 'danger',
            autohide: false,
            delay: 0,
            showReloadOnError: true
        });

        for (const PREFIJO of ID_PREFIX_CONTAINERS_CHANNELS) {
            document.querySelector(`#${PREFIJO}-channels-buttons-container`).insertAdjacentElement('afterend', insertarDivError(error, 'Ha ocurrido un error durante la creación de botones para los canales'));
        }
    }
}

/**
 * Renderiza los botones de canales en el contenedor del modal "Cambiar canal" bajo demanda.
 * @returns {void}
 */
export function crearBotonesParaModalCambiarCanal() {
    try {
        const gruposPorOrigen = agruparCanalesPorOrigen();
        renderizarBotonesEnContenedores(gruposPorOrigen, ['#modal-cambiar-canal-channels-buttons-container']);
        asignarEventosBotones();
        guardarOrdenOriginal('modal-cambiar-canal-channels-buttons-container');
    } catch (error) {
        console.error('[teles] Error al crear botones para el modal "Cambiar canal":', error);
    }
}

/**
 * Renderiza los botones de canales en el contenedor de selección de Visión Única bajo demanda.
 * @returns {void}
 */
export function crearBotonesParaVisionUnica() {
    try {
        const gruposPorOrigen = agruparCanalesPorOrigen();
        renderizarBotonesEnContenedores(gruposPorOrigen, ['#single-view-channels-buttons-container']);
        asignarEventosBotones();
        guardarOrdenOriginal('single-view-channels-buttons-container');
    } catch (error) {
        console.error('[teles] Error al crear botones para Visión Única:', error);
    }
}

/**
 * Agrupa los canales por su origen para crear bloques visibles.
 * @returns {[string, { id: string, data: any }[]][]}
 */
function agruparCanalesPorOrigen() {
    const grupos = new Map();
    for (const canalId of Object.keys(channelsList)) {
        const data = channelsList[canalId];
        const origen = data?.origenLista ?? ORIGEN_PREDETERMINADO;
        if (!grupos.has(origen)) grupos.set(origen, []);
        grupos.get(origen).push({ id: canalId, data });
    }
    return Array.from(grupos.entries()).sort((a, b) => a[0].localeCompare(b[0], 'es', { sensitivity: 'base' }));
}

/**
 * Inserta en uno o más contenedores los grupos de canales ya agrupados por origen.
 * @param {[string, { id: string, data: any }[]][]} grupos
 * @param {string[]} selectores
 * @returns {void}
 */
function renderizarBotonesEnContenedores(grupos, selectores = []) {
    selectores.forEach(selector => {
        const contenedor = document.querySelector(selector);
        if (!contenedor) return;
        contenedor.innerHTML = '';
        const idBase = contenedor.id || selector.replace('#', '') || 'grupo-canales';
        const fragmento = construirFragmentoCanales(grupos, { idBase });
        contenedor.append(fragmento);
    });
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
        header.classList.add('d-flex', 'align-items-center', 'gap-1', 'flex-wrap');

        header.setAttribute('data-bs-toggle', 'collapse');
        header.setAttribute('data-bs-target', `#${collapseId}`);
        header.setAttribute('role', 'button');
        header.setAttribute('aria-expanded', 'true');
        header.setAttribute('aria-controls', collapseId);
        header.innerHTML = `
            <p class="badge rounded-pill text-bg-secondary text-wrap mb-0 w-100">${origen}</p>
            <small class="text-secondary">${canales.length} canales</small>
            <i class="bi bi-chevron-up ms-auto icono-estado-colapso"></i>
        `;

        const lista = document.createElement('div');
        lista.classList.add('modal-body-canales');
        canales.forEach(({ id, data }) => {
            lista.append(crearBotonCanal(id, data));
        });

        const collapse = document.createElement('div');
        collapse.classList.add('mt-1', 'show');
        collapse.id = collapseId;
        collapse.append(lista);

        const iconoEstado = header.querySelector('.icono-estado-colapso');
        const actualizarIcono = (estaAbierto) => {
            if (!iconoEstado) return;
            iconoEstado.classList.toggle('bi-chevron-up', estaAbierto);
            iconoEstado.classList.toggle('bi-chevron-down', !estaAbierto);
        };

        collapse.addEventListener('show.bs.collapse', () => actualizarIcono(true));
        collapse.addEventListener('hide.bs.collapse', () => actualizarIcono(false));
        actualizarIcono(true);

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
    const iconoCategoria = categoría && categoría in CATEGORIES_ICONS ? CATEGORIES_ICONS[categoría] : '<i class="bi bi-tv"></i>';

    const nombrePais = país && COUNTRY_CODES[país.toLowerCase()] ? COUNTRY_CODES[país.toLowerCase()] : 'Desconocido';
    const fuentesCombinadas = Array.isArray(canalData?.fuentesCombinadas) ? canalData.fuentesCombinadas.filter(Boolean) : [];
    const esSeñalCombinada = canalData?.esSeñalCombinada === true && fuentesCombinadas.length > 1;
    const descripcionFuentes = fuentesCombinadas.length > 0 ? fuentesCombinadas.join(', ') : 'fuentes múltiples';
    const distintivoCombinado = esSeñalCombinada
        ? `<span class="badge badge-señal-combinada" data-bs-toggle="tooltip" data-bs-title="Señales desde: ${descripcionFuentes}"><i class="bi bi-shuffle"></i> Mix</span>`
        : '';

    const botonCanal = document.createElement('button');
    botonCanal.setAttribute('data-canal', canalId);
    botonCanal.setAttribute('data-country', `${nombrePais}`);
    botonCanal.setAttribute('data-category', categoría || 'undefined');
    if (esSeñalCombinada) {
        botonCanal.classList.add('canal-combinado');
        botonCanal.dataset.fuentesCombinadas = descripcionFuentes;
    }

    botonCanal.classList.add('btn', CSS_CLASS_BUTTON_SECONDARY, 'd-flex', 'justify-content-between', 'align-items-center', 'gap-2', 'text-start', 'rounded-3');
    if (areAllSignalsEmpty(canalId)) botonCanal.classList.add('d-none');
    botonCanal.innerHTML = `
        <span class="flex-grow-1">${nombre}</span>
        ${país && COUNTRY_CODES[país.toLowerCase()]
            ? `<img src="https://flagcdn.com/${país.toLowerCase()}.svg" alt="bandera ${nombrePais}" title="${nombrePais}" class="svg-bandera rounded-1">`
            : `<span class="svg-bandera rounded-1 h-100" title="Sin bandera para país [${nombrePais}]">${SVG_UNKNOWN_COUNTRY}</span>`
        }
        ${iconoCategoria ? `${iconoCategoria}` : ''}
        ${distintivoCombinado}`;
    return botonCanal;
}

/**
 * Inicializa la delegación de eventos para los contenedores de botones de canales.
 * Se asegura de no registrar múltiples listeners en el mismo contenedor.
 * @returns {void}
 */
function asignarEventosBotones() {
    BUTTON_CONTAINER_CONFIG.forEach(config => {
        const contenedor = document.querySelector(config.selector);
        if (!contenedor || contenedor.dataset.eventosInicializados === 'true') return;

        contenedor.dataset.eventosInicializados = 'true';

        if (config.delegateEvents) {
            registrarEventosDelegados(contenedor, config.scenario);
        } else {
            registrarEventosEstaticos(contenedor, config.scenario, {
                applyDismissAttribute: config.applyDismissAttribute
            });
        }
    });
}

/**
 * Configura delegación de eventos para contenedores dinámicos.
 * @param {HTMLElement} contenedor
 * @param {keyof typeof BUTTON_SCENARIOS} scenarioKey
 * @returns {void}
 */
function registrarEventosDelegados(contenedor, scenarioKey) {
    contenedor.addEventListener('click', (event) => {
        const boton = event.target.closest('button[data-canal]');
        if (!boton || !contenedor.contains(boton)) return;

        manejarSeleccionBoton(boton, scenarioKey);
    });
}

/**
 * Configura listeners directos y observa cambios para contenedores estáticos.
 * @param {HTMLElement} contenedor
 * @param {keyof typeof BUTTON_SCENARIOS} scenarioKey
 * @param {{ applyDismissAttribute?: boolean }} opciones
 * @returns {void}
 */
function registrarEventosEstaticos(contenedor, scenarioKey, { applyDismissAttribute = false } = {}) {
    const actualizarEventos = () => {
        const botones = Array.from(contenedor.querySelectorAll('button[data-canal]'));
        botones.forEach(boton => {
            const botonClonado = boton.cloneNode(true);
            if (applyDismissAttribute) {
                botonClonado.setAttribute('data-bs-dismiss', 'modal');
            }
            botonClonado.addEventListener('click', () => manejarSeleccionBoton(botonClonado, scenarioKey));
            boton.replaceWith(botonClonado);
        });
    };

    actualizarEventos();

    const observer = new MutationObserver(() => {
        observer.disconnect();
        actualizarEventos();
        observer.observe(contenedor, { childList: true, subtree: true });
    });

    observer.observe(contenedor, { childList: true, subtree: true });
}

/**
 * Maneja la selección de un botón en función del escenario configurado.
 * @param {HTMLButtonElement} boton
 * @param {keyof typeof BUTTON_SCENARIOS} scenarioKey
 * @returns {void}
 */
function manejarSeleccionBoton(boton, scenarioKey) {
    if (!boton) return;
    const channelId = boton.dataset.canal;
    if (!channelId) return;
    const isSelecting = boton.classList.contains(CSS_CLASS_BUTTON_SECONDARY);

    ejecutarEscenarioPorTipo(scenarioKey, {
        button: boton,
        channelId,
        isSelecting
    });
}

/**
 * Ejecuta la acción asociada a un escenario específico.
 * @param {keyof typeof BUTTON_SCENARIOS} scenarioKey
 * @param {{ button: HTMLButtonElement, channelId: string, isSelecting: boolean }} contexto
 * @returns {void}
 */
function ejecutarEscenarioPorTipo(scenarioKey, contexto) {
    const scenario = BUTTON_SCENARIOS[scenarioKey];
    if (!scenario) {
        console.warn(`[teles] There is no configuration for the scenario "${scenarioKey}".`);
        return;
    }

    scenario.onSelect(contexto);
}