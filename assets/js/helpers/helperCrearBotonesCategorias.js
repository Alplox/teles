import { listaCanales } from "../canalesData.js";
import {
    CLASE_CSS_BOTON_PRIMARIO,
    PREFIJOS_ID_CONTENEDORES_CANALES,
    ICONOS_PARA_CATEGORIAS
} from "../constants/index.js";
import { filtrarCanalesPorInput, mostrarToast } from "./index.js";
import { sincronizarPaisesConCategoria } from "./helperSincronizarFiltros.js";

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

        const OPCIONES_CATEGORIAS = [];

        const iconoTodas = ICONOS_PARA_CATEGORIAS.general ?? ICONOS_PARA_CATEGORIAS.undefined;
        OPCIONES_CATEGORIAS.push({
            valor: "all",
            nombreVisible: "Todas",
            badge: Object.keys(listaCanales).length,
            icono: iconoTodas
        });

        for (const CATEGORIA of CATEGORIAS_UNICAS) {
            const nombreCategoria = CATEGORIA.charAt(0).toUpperCase() + CATEGORIA.slice(1);
            const cantidadCanales = CONTEO_CANALES_POR_CATEGORIA[CATEGORIA] || 0;
            const iconoCategoria = ICONOS_PARA_CATEGORIAS[CATEGORIA] ?? ICONOS_PARA_CATEGORIAS.undefined;
            OPCIONES_CATEGORIAS.push({
                valor: CATEGORIA,
                nombreVisible: nombreCategoria,
                badge: cantidadCanales,
                icono: iconoCategoria
            });
        }

        if (CONTEO_CANALES_POR_CATEGORIA["undefined"]) {
            const cantidadSinCategoria = CONTEO_CANALES_POR_CATEGORIA["undefined"] || 0;
            OPCIONES_CATEGORIAS.push({
                valor: "undefined",
                nombreVisible: "Sin categoría",
                badge: cantidadSinCategoria,
                icono: ICONOS_PARA_CATEGORIAS.undefined
            });
        }

        for (const PREFIJO of PREFIJOS_ID_CONTENEDORES_CANALES) {
            const contenedorBotonesFiltroCategorias = document.querySelector(
                `#${PREFIJO}-collapse-botones-listado-filtro-categorias`
            );
            if (!contenedorBotonesFiltroCategorias) continue;

            const dropdownWrapper = document.createElement("div");
            dropdownWrapper.classList.add("btn-group", "dropdown");

            const botonToggle = document.createElement("button");
            botonToggle.setAttribute("type", "button");
            botonToggle.classList.add("btn", "btn-sm", "btn-dark", "dropdown-toggle", "rounded-pill", "text-truncate", "text-start");
            botonToggle.dataset.bsToggle = "dropdown";
            botonToggle.setAttribute("aria-expanded", "false");
            botonToggle.innerHTML = `<i class="bi bi-grid-3x3-gap"></i> Categoría: Todas`;
          /* botonToggle.innerHTML = `<i class="bi bi-grid-3x3-gap"></i> Categoría`; */

            const actualizarEstadoToggle = (tieneFiltroActivo) => {
                if (tieneFiltroActivo) {
                    botonToggle.classList.remove("btn-dark");
                    if (!botonToggle.classList.contains(CLASE_CSS_BOTON_PRIMARIO)) {
                        botonToggle.classList.add(CLASE_CSS_BOTON_PRIMARIO);
                    }
                } else {
                    botonToggle.classList.remove(CLASE_CSS_BOTON_PRIMARIO);
                    if (!botonToggle.classList.contains("btn-dark")) {
                        botonToggle.classList.add("btn-dark");
                    }
                }
            };

            const menuDropdown = document.createElement("ul");
            menuDropdown.classList.add("dropdown-menu", "p-2", "rounded-4", "mh-dropdown-filtros");

            const construirIdInput = valor => `${PREFIJO}-filtro-categoria-${valor}`.replace(/\s+/g, "-").toLowerCase();

            const limpiarSeleccion = () => {
                menuDropdown.querySelectorAll("label[data-category]").forEach(label => {
                    label.classList.remove(CLASE_CSS_BOTON_PRIMARIO);
                    if (!label.classList.contains("btn-outline-secondary")) {
                        label.classList.add("btn-outline-secondary");
                    }
                });
            };

            const activarLabel = label => {
                if (!label) return;
                if (label.dataset.category === "all") {
                    label.classList.add(CLASE_CSS_BOTON_PRIMARIO);
                    label.classList.remove("btn-outline-secondary");
                    botonToggle.innerHTML = `<i class="bi bi-grid-3x3-gap"></i> Categoría: Todas`;
                   /*  botonToggle.innerHTML = `<i class="bi bi-grid-3x3-gap"></i> Categoría`; */
                    actualizarEstadoToggle(false);
                } else {
                    label.classList.replace("btn-outline-secondary", CLASE_CSS_BOTON_PRIMARIO);
                    const nombreSeleccionado = label.querySelector(".flex-grow-1")?.textContent?.trim() || "Categoría";
                    botonToggle.innerHTML = `<i class="bi bi-grid-3x3-gap"></i> Categoría: ${nombreSeleccionado}`;
                   /*  botonToggle.innerHTML = `<i class="bi bi-grid-3x3-gap"></i> ${nombreSeleccionado}`; */
                    actualizarEstadoToggle(true);
                }
            };

            const manejarCambioFiltro = labelSeleccionada => {
                try {
                    const contenedorBotonesCanales = document.querySelector(
                        `#${PREFIJO}-body-botones-canales`
                    );
                    const inputFiltro = document.querySelector(`#${PREFIJO}-input-filtro`);
                    const valorBusqueda = inputFiltro?.value ?? "";
                    const categoriaSeleccionada = labelSeleccionada?.dataset.category ?? "all";

                    limpiarSeleccion();
                    activarLabel(labelSeleccionada);
                    sincronizarPaisesConCategoria(PREFIJO, categoriaSeleccionada);
                    filtrarCanalesPorInput(valorBusqueda, contenedorBotonesCanales);
                } catch (error) {
                    console.error(`Error al intentar activar filtro categoría. ${error}`);
                    limpiarSeleccion();
                    const labelTodas = menuDropdown.querySelector('label[data-category="all"]');
                    if (labelTodas) {
                        labelTodas.previousElementSibling.checked = true;
                        activarLabel(labelTodas);
                        sincronizarPaisesConCategoria(PREFIJO, "all");
                    }
                    mostrarToast(`
                    <span class="fw-bold">Ha ocurrido un error al intentar activar filtro categoría.</span>
                    <hr>
                    <span class="bg-dark bg-opacity-25 px-2 rounded-3">Error: ${error}</span>
                    <hr>
                    Si error persiste tras recargar, prueba borrar tu almacenamiento local desde el panel "Personalización" o borrando la caché del navegador.
                    <button type="button" class="btn btn-light rounded-pill btn-sm w-100 border-light mt-2" onclick="location.reload()"> Pulsa para recargar <i class="bi bi-arrow-clockwise"></i></button>`, "danger", false);
                }
            };

            for (const opcion of OPCIONES_CATEGORIAS) {
                const li = document.createElement("li");
                li.classList.add("mb-1");

                const inputId = construirIdInput(opcion.valor);
                const input = document.createElement("input");
                input.setAttribute("type", "radio");
                input.classList.add("btn-check");
                input.name = `${PREFIJO}-filtro-categoria`;
                input.id = inputId;
                input.autocomplete = "off";
                input.dataset.category = opcion.valor;

                const label = document.createElement("label");
                label.classList.add(
                    "btn",
                    "btn-sm",
                    "btn-outline-indigo",
                    "w-100",
                    "d-flex",
                    "justify-content-between",
                    "align-items-center",
                    "text-start",
                    "gap-2",
                    "rounded-3"
                );
                label.setAttribute("for", inputId);
                label.dataset.category = opcion.valor;
                label.innerHTML = `
                    <span class="flex-shrink-0">${opcion.icono}</span>
                    <span class="flex-grow-1 text-wrap">${opcion.nombreVisible}</span>
                    <span class="badge bg-secondary">${opcion.badge}</span>
                `;

                if (opcion.valor === "all") {
                    input.checked = true;
                    label.classList.add(CLASE_CSS_BOTON_PRIMARIO);
                } else {
                    label.classList.add("btn-outline-secondary");
                }

                input.addEventListener("change", () => manejarCambioFiltro(label));

                li.append(input, label);
                menuDropdown.append(li);
            }

            const ultimoElemento = menuDropdown.lastElementChild;
            if (ultimoElemento) {
                ultimoElemento.classList.remove("mb-1");
            }

            dropdownWrapper.append(botonToggle, menuDropdown);
            contenedorBotonesFiltroCategorias.innerHTML = "";
            contenedorBotonesFiltroCategorias.append(dropdownWrapper);
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
