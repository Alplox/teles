import { listaCanales } from "../canalesData.js";
import {
    CLASE_CSS_BOTON_PRIMARIO,
    PREFIJOS_ID_CONTENEDORES_CANALES,
} from "../constants/index.js";
import { filtrarCanalesPorInput, mostrarToast } from "./index.js";

/**
 * Crea y registra los botones de filtro por categoría para todos los prefijos de contenedores.
 * Usa los datos de `listaCanales` para contar canales por categoría y engancha el filtrado combinado
 * de texto, país y categoría a través de `filtrarCanalesPorInput`.
 * @returns {void}
 */
export function crearBotonesCategorias() {
    try {
        const CATEGORIAS_BRUTAS = Object.values(listaCanales).map(canal => {
            const valorCategoria = canal?.categoría;
            if (!valorCategoria || valorCategoria === "") return "undefined";
            return `${valorCategoria}`.toLowerCase();
        });

        const CONTEO_CANALES_POR_CATEGORIA = CATEGORIAS_BRUTAS.reduce((conteo, categoria) => {
            conteo[categoria] = (conteo[categoria] || 0) + 1;
            return conteo;
        }, {});

        const CATEGORIAS_UNICAS = [...new Set(CATEGORIAS_BRUTAS)]
            .filter(categoria => categoria && categoria !== "undefined")
            .sort((a, b) => a.localeCompare(b, "es", { sensitivity: "base" }));

        const FRAGMENT_BOTONES_CATEGORIAS = document.createDocumentFragment();

        const BOTON_MOSTRAR_TODAS_CATEGORIAS = document.createElement("button");
        BOTON_MOSTRAR_TODAS_CATEGORIAS.setAttribute("type", "button");
        BOTON_MOSTRAR_TODAS_CATEGORIAS.dataset.category = "all";
        BOTON_MOSTRAR_TODAS_CATEGORIAS.classList.add(
            "btn",
            CLASE_CSS_BOTON_PRIMARIO,
            "d-flex",
            "justify-content-between",
            "align-items-center",
            "text-start",
            "gap-2",
            "w-100",
            "m-0",
            "rounded-3"
        );
        BOTON_MOSTRAR_TODAS_CATEGORIAS.innerHTML = `<span class="flex-grow-1">Todas</span><span class="badge bg-secondary">${Object.keys(listaCanales).length}</span>`;
        FRAGMENT_BOTONES_CATEGORIAS.append(BOTON_MOSTRAR_TODAS_CATEGORIAS);

        for (const CATEGORIA of CATEGORIAS_UNICAS) {
            const nombreCategoria = CATEGORIA.charAt(0).toUpperCase() + CATEGORIA.slice(1);
            const cantidadCanales = CONTEO_CANALES_POR_CATEGORIA[CATEGORIA] || 0;

            const botonCategoria = document.createElement("button");
            botonCategoria.setAttribute("type", "button");
            botonCategoria.dataset.category = CATEGORIA;
            botonCategoria.classList.add(
                "btn",
                "btn-outline-secondary",
                "d-flex",
                "justify-content-between",
                "align-items-center",
                "text-start",
                "gap-2",
                "w-100",
                "m-0",
                "rounded-3"
            );
            botonCategoria.innerHTML = `<span class="flex-grow-1 text-truncate">${nombreCategoria}</span><span class="badge bg-secondary">${cantidadCanales}</span>`;
            FRAGMENT_BOTONES_CATEGORIAS.append(botonCategoria);
        }

        if (CONTEO_CANALES_POR_CATEGORIA["undefined"]) {
            const cantidadSinCategoria = CONTEO_CANALES_POR_CATEGORIA["undefined"] || 0;
            const botonSinCategoria = document.createElement("button");
            botonSinCategoria.setAttribute("type", "button");
            botonSinCategoria.dataset.category = "undefined";
            botonSinCategoria.classList.add(
                "btn",
                "btn-outline-secondary",
                "d-flex",
                "justify-content-between",
                "align-items-center",
                "text-start",
                "gap-2",
                "w-100",
                "m-0",
                "rounded-3"
            );
            botonSinCategoria.innerHTML = `<span class="flex-grow-1">Sin categoría</span><span class="badge bg-secondary">${cantidadSinCategoria}</span>`;
            FRAGMENT_BOTONES_CATEGORIAS.append(botonSinCategoria);
        }

        for (const PREFIJO of PREFIJOS_ID_CONTENEDORES_CANALES) {
            const contenedorBotonesFiltroCategorias = document.querySelector(
                `#${PREFIJO}-collapse-botones-listado-filtro-categorias`
            );
            if (!contenedorBotonesFiltroCategorias) continue;

            contenedorBotonesFiltroCategorias.append(FRAGMENT_BOTONES_CATEGORIAS.cloneNode(true));

            contenedorBotonesFiltroCategorias.querySelectorAll("button").forEach(botonCategoriaEnDom => {
                botonCategoriaEnDom.addEventListener("click", () => {
                    try {
                        contenedorBotonesFiltroCategorias.querySelectorAll("button").forEach(boton => {
                            boton.classList.replace(CLASE_CSS_BOTON_PRIMARIO, "btn-outline-secondary");
                        });
                        botonCategoriaEnDom.classList.replace("btn-outline-secondary", CLASE_CSS_BOTON_PRIMARIO);

                        const contenedorBotonesCanales = document.querySelector(
                            `#${PREFIJO}-body-botones-canales`
                        );
                        const inputFiltro = document.querySelector(`#${PREFIJO}-input-filtro`);
                        const valorBusqueda = inputFiltro?.value ?? "";

                        filtrarCanalesPorInput(valorBusqueda, contenedorBotonesCanales);
                    } catch (error) {
                        contenedorBotonesFiltroCategorias.querySelectorAll("button").forEach(boton => {
                            boton.classList.replace(CLASE_CSS_BOTON_PRIMARIO, "btn-outline-secondary");
                        });
                        const botonMostrarTodas = contenedorBotonesFiltroCategorias.querySelector(
                            'button[data-category="all"]'
                        );
                        if (botonMostrarTodas) {
                            botonMostrarTodas.classList.replace("btn-outline-secondary", CLASE_CSS_BOTON_PRIMARIO);
                        }
                        console.error(`Error al intentar activar filtro categoría. ${error}`);
                        mostrarToast(`
                        <span class="fw-bold">Ha ocurrido un error al intentar activar filtro categoría.</span>
                        <hr>
                        <span class="bg-dark bg-opacity-25 px-2 rounded-3">Error: ${error}</span>
                        <hr>
                        Si error persiste tras recargar, prueba borrar tu almacenamiento local desde el panel "Personalización" o borrando la caché del navegador.
                        <button type="button" class="btn btn-light rounded-pill btn-sm w-100 border-light mt-2" onclick="location.reload()"> Pulsa para recargar <i class="bi bi-arrow-clockwise"></i></button>`, "danger", false);
                        return;
                    }
                });
            });
        }
    } catch (error) {
        console.error(`Error durante creación botones para filtros categorías. ${error}`);
        mostrarToast(`
        <span class="fw-bold">Ha ocurrido un error durante la creación de botones para filtrado por categoría.</span>
        <hr>
        <span class="bg-dark bg-opacity-25 px-2 rounded-3">Error: ${error}</span>
        <hr>
        Si error persiste tras recargar, prueba borrar tu almacenamiento local desde el panel "Personalización" o borrando la caché del navegador.
        <button type="button" class="btn btn-light rounded-pill btn-sm w-100 border-light mt-2" onclick="location.reload()"> Pulsa para recargar <i class="bi bi-arrow-clockwise"></i></button>`, "danger", false);

        for (const PREFIJO of PREFIJOS_ID_CONTENEDORES_CANALES) {
            const contenedorBotonesCanales = document.querySelector(`#${PREFIJO}-body-botones-canales`);
            if (contenedorBotonesCanales && typeof insertarDivError === "function") {
                contenedorBotonesCanales.insertAdjacentElement(
                    "afterend",
                    insertarDivError(
                        error,
                        "Ha ocurrido un error durante la creación de botones para filtro categorías"
                    )
                );
            }
        }
        return;
    }
}
