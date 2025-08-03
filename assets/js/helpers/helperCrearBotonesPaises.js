import { listaCanales } from "../canalesData.js";
import {
    CLASE_CSS_BOTON_PRIMARIO,
    CODIGOS_PAISES,
    PREFIJOS_ID_CONTENEDORES_CANALES,
} from "../constants/index.js";
import { filtrarCanalesPorInput, mostrarToast } from "./index.js";

export function crearBotonesPaises() {
    try {
        const NUMERO_CANALES_CON_PAIS = Object.values(listaCanales).map(canal => {
            if (canal?.país !== '') {
                return canal.país.toLowerCase();
            } else {
                return 'Desconocido';
            }
        });

        const PAISES_SIN_REPETIRSE = [...new Set(NUMERO_CANALES_CON_PAIS)]

        const CONTEO_NUMERO_CANALES_POR_PAIS = NUMERO_CANALES_CON_PAIS.reduce((conteo, pais) => {
            conteo[CODIGOS_PAISES[pais] ?? 'Desconocido'] = (conteo[CODIGOS_PAISES[pais] ?? 'Desconocido'] || 0) + 1;
            return conteo;
        }, {});

        const PAISES_ORDENADOS = PAISES_SIN_REPETIRSE.filter(pais => CODIGOS_PAISES[pais]).sort((a, b) => {
            const codigoA = CODIGOS_PAISES[a].toLowerCase();
            const codigoB = CODIGOS_PAISES[b].toLowerCase();
            return codigoA.localeCompare(codigoB);
        });

        const FRAGMENT_BOTONES_PAISES = document.createDocumentFragment();
        for (const PAIS of PAISES_ORDENADOS) {
            if (CODIGOS_PAISES[PAIS]) {
                let nombrePais = CODIGOS_PAISES[PAIS];
                let cantidadCanales = CONTEO_NUMERO_CANALES_POR_PAIS[nombrePais] || 0;
                let botonPais = document.createElement('button');
                botonPais.setAttribute('type', 'button');
                botonPais.setAttribute('data-country', PAIS);
                botonPais.classList.add(
                    'btn', 'btn-outline-secondary',
                    'd-flex', 'justify-content-between', 'align-items-center',
                    'text-start', 'gap-2', 'w-100', 'm-0', 'rounded-3');
                botonPais.innerHTML =
                    `<span class="flex-grow-1">${nombrePais}</span>
                    <img src="https://flagcdn.com/${PAIS}.svg" alt="bandera ${nombrePais}" title="${nombrePais}" class="svg-bandera rounded-1">
                    <span class="badge bg-secondary">${cantidadCanales}</span>`;
                FRAGMENT_BOTONES_PAISES.append(botonPais);
            }
        }

        if (!PAISES_ORDENADOS.includes('Desconocido')) {
            let cantidadDesconocido = CONTEO_NUMERO_CANALES_POR_PAIS['Desconocido'] || 0;
            let botonDesconocido = document.createElement('button');
            botonDesconocido.setAttribute('type', 'button');
            botonDesconocido.setAttribute('data-country', 'Desconocido');
            botonDesconocido.classList.add('btn', 'btn-outline-secondary', 'd-flex', 'justify-content-between', 'align-items-center', 'text-start', 'gap-2', 'w-100', 'm-0', 'rounded-3');
            botonDesconocido.innerHTML =
                `<span class="flex-grow-1">Desconocido</span><span class="badge bg-secondary">${cantidadDesconocido}</span>`;
            FRAGMENT_BOTONES_PAISES.prepend(botonDesconocido);
        }

        const BOTON_MOSTRAR_TODO_PAIS = document.createElement('button');
            BOTON_MOSTRAR_TODO_PAIS.setAttribute('type', 'button');
            BOTON_MOSTRAR_TODO_PAIS.dataset.country = 'all'
            BOTON_MOSTRAR_TODO_PAIS.classList.add('btn', 'btn-indigo', 'd-flex', 'justify-content-between', 'align-items-center', 'text-start', 'gap-2', 'w-100', 'm-0', 'rounded-3')
            BOTON_MOSTRAR_TODO_PAIS.innerHTML =
                `<span class="flex-grow-1">Todos</span><span class="badge bg-secondary">${Object.keys(listaCanales).length}</span>`;
            FRAGMENT_BOTONES_PAISES.prepend(BOTON_MOSTRAR_TODO_PAIS)

        for (const PREFIJO of PREFIJOS_ID_CONTENEDORES_CANALES) {
            const contenedorBotonesFiltroPaises = document.querySelector(`#${PREFIJO}-collapse-botones-listado-filtro-paises`);
            contenedorBotonesFiltroPaises.append(FRAGMENT_BOTONES_PAISES.cloneNode(true));
            contenedorBotonesFiltroPaises.querySelectorAll('button').forEach(botonPaisEnDom => {
                botonPaisEnDom.addEventListener('click', () => {
                    try {
                        let country = botonPaisEnDom.dataset.country;
                        let filtro = CODIGOS_PAISES[country] || (country === 'Desconocido' ? 'Desconocido' : country === 'all' ? '' : '');

                        contenedorBotonesFiltroPaises.querySelectorAll('button').forEach(boton => {
                            boton.classList.replace(CLASE_CSS_BOTON_PRIMARIO, 'btn-outline-secondary');
                        });
                        botonPaisEnDom.classList.replace('btn-outline-secondary', CLASE_CSS_BOTON_PRIMARIO);
                        filtrarCanalesPorInput(filtro, document.querySelector(`#${PREFIJO}-body-botones-canales`));
                    } catch (error) {
                        contenedorBotonesFiltroPaises.querySelectorAll('button').forEach(boton => {
                            boton.classList.replace(CLASE_CSS_BOTON_PRIMARIO, 'btn-outline-secondary');
                        });
                        contenedorBotonesFiltroPaises.querySelector('button[data-country="all"]').classList.replace('btn-outline-secondary', CLASE_CSS_BOTON_PRIMARIO);
                        console.error(`Error al intentar activar filtro país. ${error}`);
                        mostrarToast(`
                        <span class="fw-bold">Ha ocurrido un error al intentar activar filtro país..</span>
                        <hr>
                        <span class="bg-dark bg-opacity-25 px-2 rounded-3">Error: ${error}</span>
                        <hr>
                        Si error persiste tras recargar, prueba borrar tu almacenamiento local desde el panel "Personalización" o borrando la caché del navegador.
                        <button type="button" class="btn btn-light rounded-pill btn-sm w-100 border-light mt-2" onclick="location.reload()"> Pulsa para recargar <i class="bi bi-arrow-clockwise"></i></button>`, 'danger', false);
                        return
                    }
                    
                });
            }); 
        }
    } catch (error) {
        console.error(`Error durante creación botones para filtros paises. ${error}`);
        mostrarToast(`
        <span class="fw-bold">Ha ocurrido un error durante la creación de botones para filtrado por país.</span>
        <hr>
        <span class="bg-dark bg-opacity-25 px-2 rounded-3">Error: ${error}</span>
        <hr>
        Si error persiste tras recargar, prueba borrar tu almacenamiento local desde el panel "Personalización" o borrando la caché del navegador.
        <button type="button" class="btn btn-light rounded-pill btn-sm w-100 border-light mt-2" onclick="location.reload()"> Pulsa para recargar <i class="bi bi-arrow-clockwise"></i></button>`, 'danger', false);
        
        for (const PREFIJO of PREFIJOS_ID_CONTENEDORES_CANALES) {
            document.querySelector(`#${PREFIJO}-body-botones-canales`).insertAdjacentElement('afterend', insertarDivError(error, 'Ha ocurrido un error durante la creación de botones para filtro paises'));
        }
        return
    }
}