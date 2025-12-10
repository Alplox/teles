import { channelsList } from "../canalesData.js";
import {
    CSS_CLASS_BUTTON_PRIMARY,
    COUNTRY_CODES,
    ID_PREFIX_CONTAINERS_CHANNELS,
} from "../constants/index.js";
import { filtrarCanalesPorInput, showToast } from "./index.js";
import { sincronizarCategoriasConPais } from "./helperSincronizarFiltros.js";

export function crearBotonesPaises() {
    try {
        const NUMERO_CANALES_CON_PAIS = Object.values(channelsList).map(canal => {
            if (canal?.país !== '') {
                return canal.país.toLowerCase();
            } else {
                return 'Desconocido';
            }
        });

        const PAISES_SIN_REPETIRSE = [...new Set(NUMERO_CANALES_CON_PAIS)]

        const CONTEO_NUMERO_CANALES_POR_PAIS = NUMERO_CANALES_CON_PAIS.reduce((conteo, pais) => {
            conteo[COUNTRY_CODES[pais] ?? 'Desconocido'] = (conteo[COUNTRY_CODES[pais] ?? 'Desconocido'] || 0) + 1;
            return conteo;
        }, {});

        const PAISES_ORDENADOS = PAISES_SIN_REPETIRSE.filter(pais => COUNTRY_CODES[pais]).sort((a, b) => {
            const codigoA = COUNTRY_CODES[a].toLowerCase();
            const codigoB = COUNTRY_CODES[b].toLowerCase();
            return codigoA.localeCompare(codigoB);
        });

        const OPCIONES_PAISES = [];

        OPCIONES_PAISES.push({
            valor: 'all',
            nombreVisible: 'Todos los países',
            badge: Object.keys(channelsList).length,
            flag: null
        });

        for (const PAIS of PAISES_ORDENADOS) {
            if (!COUNTRY_CODES[PAIS]) continue;
            const nombrePais = COUNTRY_CODES[PAIS];
            const cantidadCanales = CONTEO_NUMERO_CANALES_POR_PAIS[nombrePais] || 0;
            OPCIONES_PAISES.push({
                valor: PAIS,
                nombreVisible: nombrePais,
                badge: cantidadCanales,
                flag: `https://flagcdn.com/${PAIS}.svg`
            });
        }

        if (!PAISES_ORDENADOS.includes('Desconocido')) {
            const cantidadDesconocido = CONTEO_NUMERO_CANALES_POR_PAIS['Desconocido'] || 0;
            OPCIONES_PAISES.push({
                valor: 'Desconocido',
                nombreVisible: 'Desconocido',
                badge: cantidadDesconocido,
                flag: null
            });
        }

        for (const PREFIJO of ID_PREFIX_CONTAINERS_CHANNELS) {
            const contenedorBotonesFiltroPaises = document.querySelector(`#${PREFIJO}-collapse-botones-listado-filtro-paises`);
            if (!contenedorBotonesFiltroPaises) continue;

            const dropdownWrapper = document.createElement('div');
            dropdownWrapper.classList.add('btn-group', 'dropdown');

            const botonToggle = document.createElement('button');
            botonToggle.setAttribute('type', 'button');
            botonToggle.classList.add('btn', 'btn-sm', 'btn-dark', 'dropdown-toggle', 'rounded-pill', 'text-truncate', 'text-start');
            botonToggle.dataset.bsToggle = 'dropdown';
            botonToggle.setAttribute('aria-expanded', 'false');
            botonToggle.innerHTML = '<i class="bi bi-flag"></i> País: Todos los países';
            /* botonToggle.innerHTML = '<i class="bi bi-flag"></i> País'; */

            const actualizarEstadoToggle = (tieneFiltroActivo) => {
                if (tieneFiltroActivo) {
                    botonToggle.classList.remove('btn-dark');
                    if (!botonToggle.classList.contains(CSS_CLASS_BUTTON_PRIMARY)) {
                        botonToggle.classList.add(CSS_CLASS_BUTTON_PRIMARY);
                    }
                } else {
                    botonToggle.classList.remove(CSS_CLASS_BUTTON_PRIMARY);
                    if (!botonToggle.classList.contains('btn-dark')) {
                        botonToggle.classList.add('btn-dark');
                    }
                }
            };

            const menuDropdown = document.createElement('ul');
            menuDropdown.classList.add('dropdown-menu', 'p-2', 'rounded-4', 'mh-dropdown-filtros');

            const construirIdInput = valor => `${PREFIJO}-filtro-pais-${valor}`.replace(/\s+/g, '-').toLowerCase();

            const limpiarSeleccion = () => {
                menuDropdown.querySelectorAll('label[data-country]').forEach(label => {
                    label.classList.remove(CSS_CLASS_BUTTON_PRIMARY);
                    if (!label.classList.contains('btn-outline-secondary')) {
                        label.classList.add('btn-outline-secondary');
                    }
                });
            };

            const activarLabel = label => {
                if (!label) return;
                if (label.dataset.country === 'all') {
                    label.classList.add(CSS_CLASS_BUTTON_PRIMARY);
                    label.classList.remove('btn-outline-secondary');
                    botonToggle.innerHTML = '<i class="bi bi-flag"></i> País: Todos los países';
                    /* botonToggle.innerHTML = '<i class="bi bi-flag"></i> País'; */
                    actualizarEstadoToggle(false);
                } else {
                    label.classList.replace('btn-outline-secondary', CSS_CLASS_BUTTON_PRIMARY);
                    const nombreSeleccionado = label.querySelector('.flex-grow-1')?.textContent?.trim() || 'País';
                    botonToggle.innerHTML = `<i class="bi bi-flag"></i> País: ${nombreSeleccionado}`;
                    /* botonToggle.innerHTML = `<i class="bi bi-flag"></i> ${nombreSeleccionado}`; */
                    actualizarEstadoToggle(true);
                }
            };

            const manejarCambioFiltro = labelSeleccionada => {
                try {
                    const contenedorBotonesCanales = document.querySelector(`#${PREFIJO}-channels-buttons-container`);
                    const inputFiltro = document.querySelector(`#${PREFIJO}-input-filtro`);
                    const valorBusqueda = inputFiltro?.value ?? '';
                    const valorPaisSeleccionado = labelSeleccionada?.dataset.country ?? 'all';

                    limpiarSeleccion();
                    activarLabel(labelSeleccionada);
                    sincronizarCategoriasConPais(PREFIJO, valorPaisSeleccionado);
                    filtrarCanalesPorInput(valorBusqueda, contenedorBotonesCanales);
                } catch (error) {
                    console.error(`Error al intentar activar filtro país. ${error}`);
                    limpiarSeleccion();
                    const labelTodos = menuDropdown.querySelector('label[data-country="all"]');
                    if (labelTodos) {
                        labelTodos.previousElementSibling.checked = true;
                        activarLabel(labelTodos);
                    }
                    
                    showToast({
                        title: 'Ha ocurrido un error al intentar activar filtro país.',
                        body: `Error: ${error}`,
                        type: 'danger',
                        autohide: false,
                        delay: 0,
                        showReloadOnError: true
                    });
                }
            };

            for (const opcion of OPCIONES_PAISES) {
                const li = document.createElement('li');
                li.classList.add('mb-1');

                const inputId = construirIdInput(opcion.valor);
                const input = document.createElement('input');
                input.setAttribute('type', 'radio');
                input.classList.add('btn-check');
                input.name = `${PREFIJO}-filtro-pais`;
                input.id = inputId;
                input.autocomplete = 'off';
                input.dataset.country = opcion.valor;

                const label = document.createElement('label');
                label.classList.add(
                    'btn', 'btn-sm', 'btn-outline-indigo', 'w-100', 'd-flex', 'justify-content-between', 'align-items-center',
                    'text-start', 'gap-2', 'rounded-3'
                );
                label.setAttribute('for', inputId);
                label.dataset.country = opcion.valor;
                label.innerHTML = `
                    <span class="flex-grow-1 text-truncate">${opcion.nombreVisible}</span>
                    ${opcion.flag ? `<img src="${opcion.flag}" alt="bandera ${opcion.nombreVisible}" title="${opcion.nombreVisible}" class="svg-bandera rounded-1">` : ''}
                    <span class="badge bg-secondary">${opcion.badge}</span>
                `;

                if (opcion.valor === 'all') {
                    input.checked = true;
                    label.classList.add(CSS_CLASS_BUTTON_PRIMARY);
                } else {
                    label.classList.add('btn-outline-secondary');
                }

                input.addEventListener('change', () => manejarCambioFiltro(label));

                li.append(input, label);
                menuDropdown.append(li);
            }

            const ultimoElemento = menuDropdown.lastElementChild;
            if (ultimoElemento) {
                ultimoElemento.classList.remove('mb-1');
            }

            dropdownWrapper.append(botonToggle, menuDropdown);
            contenedorBotonesFiltroPaises.innerHTML = '';
            contenedorBotonesFiltroPaises.append(dropdownWrapper);
        }
    } catch (error) {
        console.error(`Error durante creación botones para filtros paises. ${error}`);
        showToast({
            title: 'Ha ocurrido un error durante la creación de botones para filtrado por país.',
            body: `Error: ${error}`,
            type: 'danger',
            autohide: false,
            delay: 0,
            showReloadOnError: true
        });
        
        for (const PREFIJO of ID_PREFIX_CONTAINERS_CHANNELS) {
            document.querySelector(`#${PREFIJO}-channels-buttons-container`).insertAdjacentElement('afterend', insertarDivError(error, 'Ha ocurrido un error durante la creación de botones para filtro paises'));
        }
        return
    }
}