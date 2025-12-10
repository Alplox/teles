import { ID_PREFIX_CONTAINERS_CHANNELS } from "../constants/index.js";

// Almacenar el orden original de los botones como identificadores únicos
const ordenOriginal = {
    'modal-canales': [],
    'offcanvas-canales': [],
    'modal-cambiar-canal': [],
    'single-view': []
};

export function guardarOrdenOriginal(containerBotones) {
    try {
        const BOTONES_EN_CONTENEDOR = Array.from(document.querySelectorAll(`#${containerBotones} button[data-canal]`));
        const ids = BOTONES_EN_CONTENEDOR.map(btn => btn.getAttribute('data-canal'));

        for (const PREFIJO of ID_PREFIX_CONTAINERS_CHANNELS) {
            if (containerBotones.startsWith(PREFIJO)) {
                ordenOriginal[PREFIJO] = ids;
            }
        }
    } catch (e) {
        console.error('Error en guardarOrdenOriginal:', e);
    }
}

/**
 * Función interna reutilizable para ordenar botones dentro de un contenedor.
 * @param {string} containerId - ID del contenedor principal.
 * @param {function} compareFn - Función de comparación para el sort ((a, b) => ...).
 */
function aplicarOrdenamiento(containerId, compareFn) {
    try {
        const contenedor = document.getElementById(containerId);
        if (!contenedor) return;

        const grupos = Array.from(contenedor.querySelectorAll('.grupo-canales-origen'));

        // Helper para ordenar y reinsertar una lista de botones
        const ordenarYReinsertar = (listaContexto, selectorBotones = 'button[data-canal]') => {
            const botones = Array.from(listaContexto.querySelectorAll(selectorBotones));
            if (!botones.length) return;

            botones.sort(compareFn);

            // Mover elementos existentes (no es necesario limpiar innerHTML)
            const fragment = document.createDocumentFragment();
            botones.forEach(btn => fragment.append(btn));
            listaContexto.append(fragment);
        };

        if (grupos.length === 0) {
            // Caso sin grupos (lista plana)
            // Se usa 'button' para compatibilidad si faltan atributos data-canal
            ordenarYReinsertar(contenedor, 'button');
        } else {
            // Caso con grupos (acordeones/secciones)
            grupos.forEach(grupo => {
                const lista = grupo.querySelector('.modal-body-canales')
                if (lista) ordenarYReinsertar(lista);
            });
        }
    } catch (e) {
        console.error(`Error al ordenar contenedores (${containerId}):`, e);
    }
}

export function ordenarBotonesCanalesAscendente(containerBotones) {
    aplicarOrdenamiento(containerBotones, (a, b) =>
        a.textContent.trim().localeCompare(b.textContent.trim())
    );
}

export function ordenarBotonesCanalesDescendente(containerBotones) {
    aplicarOrdenamiento(containerBotones, (a, b) =>
        b.textContent.trim().localeCompare(a.textContent.trim())
    );
}

export function restaurarOrdenOriginalBotonesCanales(containerBotones) {
    try {
        const contenedor = document.querySelector(`#${containerBotones}`);
        if (!contenedor) return;

        // Buscar IDs originales según el prefijo del contenedor
        let idsOriginales = null;
        for (const prefijo of ID_PREFIX_CONTAINERS_CHANNELS) {
            if (containerBotones.startsWith(prefijo)) {
                idsOriginales = ordenOriginal[prefijo];
                break;
            }
        }
        if (!Array.isArray(idsOriginales)) return;

        const grupos = Array.from(contenedor.querySelectorAll('.grupo-canales-origen'));

        const reordenarSegunOriginal = (listaContexto) => {
            const botonesMap = new Map();
            // Indexamos los botones actuales para acceso rápido
            listaContexto.querySelectorAll('button[data-canal]').forEach(btn => {
                botonesMap.set(btn.getAttribute('data-canal'), btn);
            });

            const fragment = document.createDocumentFragment();

            // Reinsertamos en el orden guardado
            idsOriginales.forEach(id => {
                const btn = botonesMap.get(id);
                if (btn) fragment.append(btn);
            });

            // Si sobraron botones (nuevos que no estaban al guardar), los ponemos al final
            // (Opcional, depende de la lógica deseada, pero evita que desaparezcan)
            if (fragment.children.length < botonesMap.size) {
                botonesMap.forEach((btn, id) => {
                    // Si el botón está en el DOM pero no en el fragmento (no estaba en idsOriginales)
                    if (!fragment.contains(btn)) fragment.append(btn);
                });
            }

            listaContexto.append(fragment);
        };

        if (grupos.length === 0) {
            reordenarSegunOriginal(contenedor);
        } else {
            grupos.forEach(grupo => {
                const lista = grupo.querySelector('.modal-body-canales')
                if (lista) reordenarSegunOriginal(lista);
            });
        }

    } catch (e) {
        console.error('Error en restaurarOrdenOriginalBotonesCanales:', e);
    }
}