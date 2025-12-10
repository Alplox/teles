import { actualizarListaPersonalizada, aplicarListaPersonalizadaGuardada, channelsList, eliminarListaPersonalizada, obtenerListasPersonalizadas } from "../canalesData.js";
import { ID_PREFIX_CONTAINERS_CHANNELS, LS_KEY_ACTIVE_VIEW_MODE } from "../constants/index.js";
import { tele } from "../main.js";
import { formatDate } from "../utils/index.js";
import { ajustarClaseBotonCanal, crearBotonesCategorias, crearBotonesPaises, crearBotonesParaCanales, crearBotonesParaVisionUnica, showToast } from "./index.js";

export const limpiarContenedoresListadosCanales = ({ resaltarExperimental = false } = {}) => {
    for (const PREFIJO of ID_PREFIX_CONTAINERS_CHANNELS) {
        const contenedorBotones = document.querySelector(`#${PREFIJO}-channels-buttons-container`);
        const contenedorPaises = document.querySelector(`#${PREFIJO}-collapse-botones-listado-filtro-paises`);
        const contenedorCategorias = document.querySelector(`#${PREFIJO}-collapse-botones-listado-filtro-categorias`);
        if (contenedorBotones) {
            if (resaltarExperimental) {
                contenedorBotones.classList.add('border', 'border-warning', 'rounded-3');
            }
            contenedorBotones.innerHTML = '';
        }
        if (contenedorPaises) {
            contenedorPaises.innerHTML = '';
        }
        if (contenedorCategorias) {
            contenedorCategorias.innerHTML = '';
        }
    }

    // Si el usuario está en visión única, volvemos a crear los botones de esa vista
    // para que no quede vacío el panel tras cargar o aplicar listas M3U.
    if (localStorage.getItem(LS_KEY_ACTIVE_VIEW_MODE) === 'single-view') {
        const contenedorVisionUnica = document.querySelector('#single-view-channels-buttons-container');
        if (contenedorVisionUnica) {
            try {
                crearBotonesParaVisionUnica();
            } catch (error) {
                console.error('[teles] Error al recrear botones de Visión única tras actualizar listas:', error);
            }
        }
    }
}

export const resincronizarEstadoVisualCanalesActivos = () => {
    try {
        const transmisionesActivas = document.querySelectorAll('div[data-canal]');
        if (!transmisionesActivas.length) return;

        transmisionesActivas.forEach(transmision => {
            const canalId = transmision.getAttribute('data-canal');
            if (!canalId) return;
            ajustarClaseBotonCanal(canalId, true);
        });
    } catch (error) {
        console.error('[teles] Error al resincronizar estado visual de canales activos:', error);
    }
}

export const renderizarListasPersonalizadasUI = () => {
    const customListsContainerEl = document.querySelector('#contenedor-listas-personalizadas');
    if (!customListsContainerEl) return;
    const listas = obtenerListasPersonalizadas();
    const urls = Object.keys(listas);
    if (!urls.length) {
        customListsContainerEl.innerHTML = customListsContainerEl?.innerHTML ?? '<p class="text-secondary fs-smaller mb-0">No hay listas guardadas aún.</p>';;
        return;
    }
    const fragment = document.createDocumentFragment();
    urls.sort((a, b) => {
        const etiquetaA = listas[a]?.etiqueta || a;
        const etiquetaB = listas[b]?.etiqueta || b;
        return etiquetaA.localeCompare(etiquetaB, 'es', { sensitivity: 'base' });
    }).forEach(url => {
        fragment.append(crearTarjetaListaPersonalizada(url, listas[url]));
    });
    customListsContainerEl.innerHTML = '';
    customListsContainerEl.append(fragment);
}

const crearTarjetaListaPersonalizada = (url, data = {}) => {
    const card = document.createElement('div');
    card.classList.add('bg-body-secondary', 'bg-opacity-10', 'rounded-3', 'p-2', 'border', 'border-light-subtle', 'mb-2');
    const etiqueta = data.etiqueta || url;
    const pinned = data.pinned !== false;

    const encabezado = document.createElement('div');
    encabezado.classList.add('d-flex', 'justify-content-between', 'align-items-start', 'gap-2');

    const bloqueInfo = document.createElement('div');
    bloqueInfo.innerHTML = `
            <p class="fw-semibold mb-0">${etiqueta}</p>
            <small class="text-secondary text-break">${url}</small><br>
            <small class="text-secondary">Actualizado: ${formatDate(data.actualizado)}</small>
        `;

    const bloqueAcciones = document.createElement('div');
    bloqueAcciones.classList.add('d-flex', 'flex-column', 'gap-1');

    const botonPin = document.createElement('button');
    botonPin.type = 'button';
    botonPin.className = `btn btn-sm ${pinned ? 'btn-success' : 'btn-outline-secondary'}`;
    botonPin.innerHTML = pinned ? '<i class="bi bi-pin-angle-fill"></i> Fijada' : '<i class="bi bi-pin-angle"></i> No fijada';
    botonPin.addEventListener('click', () => {
        const estadoActual = (obtenerListasPersonalizadas()[url]?.pinned !== false);
        const nuevoEstado = !estadoActual;
        actualizarListaPersonalizada(url, { pinned: nuevoEstado });
        renderizarListasPersonalizadasUI();
        showToast({
            title: 'Lista personalizada',
            body: nuevoEstado ? `La lista "${etiqueta}" se restaurará al recargar.` : `La lista "${etiqueta}" ya no se restaurará automáticamente.`,
            type: nuevoEstado ? 'success' : 'info',
            showReloadOnError: true
        })
    });

    const botonAplicar = document.createElement('button');
    botonAplicar.type = 'button';
    botonAplicar.className = 'btn btn-sm btn-outline-primary';
    botonAplicar.innerHTML = '<i class="bi bi-arrow-repeat"></i> Aplicar';
    botonAplicar.addEventListener('click', () => {
        const exito = aplicarListaPersonalizadaGuardada(url);
        if (exito) {
            limpiarContenedoresListadosCanales();
            crearBotonesParaCanales();
            crearBotonesPaises();
            crearBotonesCategorias();
            resincronizarEstadoVisualCanalesActivos();
            showToast({
                title: 'Lista personalizada',
                body: `Lista "${etiqueta}" aplicada correctamente.`,
                type: 'success',
                showReloadOnError: false
            })
        } else {
            showToast({
                title: 'Lista personalizada',
                body: 'No fue posible aplicar la lista seleccionada.',
                type: 'danger',
                autohide: false,
                delay: 0,
                showReloadOnError: true
            })
        }
    });

    const botonEliminar = document.createElement('button');
    botonEliminar.type = 'button';
    botonEliminar.className = 'btn btn-sm btn-outline-danger';
    botonEliminar.innerHTML = '<i class="bi bi-trash"></i> Quitar';
    botonEliminar.addEventListener('click', () => {
        if (!window.confirm(`¿Eliminar la lista "${etiqueta}" y sus canales asociados?`)) return;
        eliminarListaPersonalizada(url);
        const eliminados = eliminarCanalesPorFuente(url);
        limpiarContenedoresListadosCanales();
        crearBotonesParaCanales();
        crearBotonesPaises();
        crearBotonesCategorias();
        resincronizarEstadoVisualCanalesActivos();

        renderizarListasPersonalizadasUI();
        showToast({
            title: 'Lista personalizada',
            body: `Lista eliminada. ${eliminados} canal(es) removidos.`,
            type: 'info'
        })
    });

    bloqueAcciones.append(botonPin, botonAplicar, botonEliminar);
    encabezado.append(bloqueInfo, bloqueAcciones);
    card.append(encabezado);
    return card;
}

const eliminarCanalesPorFuente = (fuente) => {
    if (!fuente || !channelsList) return 0;
    let eliminados = 0;

    Object.keys(channelsList).forEach(canalId => {
        if (channelsList[canalId]?.fuenteLista === fuente) {
            try {
                tele.remove?.(canalId);
            } catch (error) {
                console.warn(`[teles] Couldn't remove active channel ${canalId}:`, error);
            }
            delete channelsList[canalId];
            eliminados++;
        }
    });
    return eliminados;
}