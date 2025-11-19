import { PREFIJOS_ID_CONTENEDORES_CANALES } from "../constants/index.js";

// Almacenar el orden original de los botones como identificadores únicos
const ordenOriginal = {
    'modal-canales': [],
    'offcanvas-canales': [],
    'modal-cambiar-canal': [],
    'vision-unica': []
};

export function guardarOrdenOriginal(containerBotones) {
    try {
        const BOTONES_EN_CONTENEDOR = Array.from(document.querySelectorAll(`#${containerBotones} button[data-canal]`));
        const ids = BOTONES_EN_CONTENEDOR.map(btn => btn.getAttribute('data-canal'));

        for (const PREFIJO of PREFIJOS_ID_CONTENEDORES_CANALES) {
            if (containerBotones.startsWith(PREFIJO)) {
                ordenOriginal[PREFIJO] = ids;
            }
        }
    } catch (e) {
        console.error('Error en guardarOrdenOriginal:', e);
        return;
    }
}

export function ordenarBotonesCanalesAscendente(containerBotones) {
    try {
        const BODY_CONTENEDOR_BOTONES = document.querySelector(`#${containerBotones}`);
        if (!BODY_CONTENEDOR_BOTONES) return;
        const GRUPOS = Array.from(BODY_CONTENEDOR_BOTONES.querySelectorAll('.grupo-canales-origen'));

        // Compatibilidad: si no hay grupos, mantener comportamiento plano anterior
        if (!GRUPOS.length) {
            const BOTONES_EN_CONTENEDOR = Array.from(BODY_CONTENEDOR_BOTONES.querySelectorAll('button'));
            BOTONES_EN_CONTENEDOR.sort((a, b) => a.textContent.trim().localeCompare(b.textContent.trim()));
            const fragment = document.createDocumentFragment();
            BOTONES_EN_CONTENEDOR.forEach(botonCanal => {
                fragment.append(botonCanal);
            });
            BODY_CONTENEDOR_BOTONES.innerHTML = '';
            BODY_CONTENEDOR_BOTONES.append(fragment);
            return;
        }

        // Nuevo comportamiento: ordenar alfabéticamente dentro de cada grupo por origen
        GRUPOS.forEach(wrapper => {
            const contenedorCollapse = wrapper.querySelector('.collapse');
            if (!contenedorCollapse) return;
            const lista = contenedorCollapse.querySelector('.d-flex.flex-column.gap-2') || contenedorCollapse;
            const BOTONES_GRUPO = Array.from(lista.querySelectorAll('button[data-canal]'));
            BOTONES_GRUPO.sort((a, b) => a.textContent.trim().localeCompare(b.textContent.trim()));

            const fragmentGrupo = document.createDocumentFragment();
            BOTONES_GRUPO.forEach(botonCanal => {
                fragmentGrupo.append(botonCanal);
            });
            lista.innerHTML = '';
            lista.append(fragmentGrupo);
        });
    } catch (e) {
        console.error('Error en ordenarBotonesCanalesAscendente:', e);
        return;
    }
}

export function ordenarBotonesCanalesDescendente(containerBotones) {
    try {
        const BODY_CONTENEDOR_BOTONES = document.querySelector(`#${containerBotones}`);
        if (!BODY_CONTENEDOR_BOTONES) return;
        const GRUPOS = Array.from(BODY_CONTENEDOR_BOTONES.querySelectorAll('.grupo-canales-origen'));

        // Compatibilidad: si no hay grupos, mantener comportamiento plano anterior
        if (!GRUPOS.length) {
            const BOTONES_EN_CONTENEDOR = Array.from(BODY_CONTENEDOR_BOTONES.querySelectorAll('button'));
            BOTONES_EN_CONTENEDOR.sort((a, b) => b.textContent.trim().localeCompare(a.textContent.trim()));
            const fragment = document.createDocumentFragment();
            BOTONES_EN_CONTENEDOR.forEach(botonCanal => {
                fragment.append(botonCanal);
            });
            BODY_CONTENEDOR_BOTONES.innerHTML = '';
            BODY_CONTENEDOR_BOTONES.append(fragment);
            return;
        }

        // Nuevo comportamiento: ordenar alfabéticamente (desc) dentro de cada grupo por origen
        GRUPOS.forEach(wrapper => {
            const contenedorCollapse = wrapper.querySelector('.collapse');
            if (!contenedorCollapse) return;
            const lista = contenedorCollapse.querySelector('.d-flex.flex-column.gap-2') || contenedorCollapse;
            const BOTONES_GRUPO = Array.from(lista.querySelectorAll('button[data-canal]'));
            BOTONES_GRUPO.sort((a, b) => b.textContent.trim().localeCompare(a.textContent.trim()));

            const fragmentGrupo = document.createDocumentFragment();
            BOTONES_GRUPO.forEach(botonCanal => {
                fragmentGrupo.append(botonCanal);
            });
            lista.innerHTML = '';
            lista.append(fragmentGrupo);
        });
    } catch (e) {
        console.error('Error en ordenarBotonesCanalesDescendente:', e);
        return;
    }
}

export function restaurarOrdenOriginalBotonesCanales(containerBotones) {
    try {
        const BODY_CONTENEDOR_BOTONES = document.querySelector(`#${containerBotones}`);
        if (!BODY_CONTENEDOR_BOTONES) return;
        let idsOriginales;
        for (const PREFIJO of PREFIJOS_ID_CONTENEDORES_CANALES) {
            if (containerBotones.startsWith(PREFIJO)) {
                idsOriginales = ordenOriginal[PREFIJO];
                break;
            }
        }
        if (!Array.isArray(idsOriginales)) return;
        const GRUPOS = Array.from(BODY_CONTENEDOR_BOTONES.querySelectorAll('.grupo-canales-origen'));

        // Compatibilidad: si no hay grupos, mantener comportamiento plano anterior
        if (!GRUPOS.length) {
            const fragment = document.createDocumentFragment();
            idsOriginales.forEach(id => {
                const boton = BODY_CONTENEDOR_BOTONES.querySelector(`button[data-canal="${id}"]`);
                if (boton) fragment.append(boton);
            });
            BODY_CONTENEDOR_BOTONES.innerHTML = '';
            BODY_CONTENEDOR_BOTONES.append(fragment);
            return;
        }

        // Nuevo comportamiento: restaurar orden original dentro de cada grupo de origen
        GRUPOS.forEach(wrapper => {
            const contenedorCollapse = wrapper.querySelector('.collapse');
            if (!contenedorCollapse) return;
            const lista = contenedorCollapse.querySelector('.d-flex.flex-column.gap-2') || contenedorCollapse;
            const botonesGrupo = Array.from(lista.querySelectorAll('button[data-canal]'));
            const idsGrupo = new Set(botonesGrupo.map(btn => btn.getAttribute('data-canal')));

            const fragmentGrupo = document.createDocumentFragment();
            idsOriginales.forEach(id => {
                if (!idsGrupo.has(id)) return;
                const boton = lista.querySelector(`button[data-canal="${id}"]`);
                if (boton) fragmentGrupo.append(boton);
            });

            lista.innerHTML = '';
            lista.append(fragmentGrupo);
        });
    } catch (e) {
        console.error('Error en restaurarOrdenOriginalBotonesCanales:', e);
        return;
    }
}