import { claseBotonPrimaria } from "./main.js";

// Función para aplicar la clase para cuando solo existen dos o un div según observer y se use el 100 del view-height
export function ajustarClaseSiMenosTresCanalesActivos() {
    const contenedor = document.querySelector('#canales-grid');
    const divs = contenedor.children;

    if (!isMobile.any && divs.length <= 3 && divs.length >= 1) {
        let lsTransmisionesFila = localStorage.getItem('numero_canales_por_fila')
        if (divs.length === 2) {
            if (lsTransmisionesFila !== '12') {
                for (let i = 0; i < divs.length; i++) {
                    divs[i].classList.remove('col-12', 'col-6', 'col-4', 'col-3', 'col-2', 'vh-100', 'overflow-hidden');
                    divs[i].classList.add('col-6', 'vh-100', 'overflow-hidden');
                }
            }
        } else if (divs.length === 1) {
            for (let i = 0; i < divs.length; i++) {
                divs[i].classList.remove('col-12', 'col-6', 'col-4', 'col-3', 'col-2', 'vh-100', 'overflow-hidden');
                divs[i].classList.add('col-12', 'vh-100', 'overflow-hidden');
            }
        } else {
            // Si no hay exactamente tres o menos que tres divs, aseguramos que regresen a sus clases normales
            for (let i = 0; i < divs.length; i++) {
                divs[i].classList.remove('col-12', 'col-6', 'col-4', 'col-3', 'col-2', 'vh-100', 'overflow-hidden');
                divs[i].classList.add(`col-${lsTransmisionesFila}`);
            }
        }
    }
}

// encarga dejar clase primaria a botón pulsado o que corresponda según localStorage en offcanvas de personalización
export function activarBotonTransmisionesPorFila(valorBoton) {
    let botonesPersonalizarTransmisionesPorFila = document.querySelectorAll('#transmision-por-fila button');
    let botonDejarActivo = document.querySelector(`#transmision-por-fila button[value='${valorBoton}']`);
    botonesPersonalizarTransmisionesPorFila.forEach(btn => {
        btn.classList.replace(claseBotonPrimaria, 'btn-light-subtle');
    });
    botonDejarActivo.classList.replace('btn-light-subtle', claseBotonPrimaria);
}

// utiliza para revisar si div de canal debería usar el 100 del view-height cuando es insertado por primera vez, funciona junto a "ajustarClaseSiMenosTresCanalesActivos"
// Se utiliza aquello solo cuando es dos divs o solo uno y se puede sobrescribir si usuario pulsa botón desde offcanvas de personalización
export function ajustarClaseColTransmisionesPorFila(valorParaClaseCol) {
    let transmisionesEnGrid = document.querySelectorAll('div[data-canal]');
    for (let v of transmisionesEnGrid) {
        v.classList.remove('col-12', 'col-6', 'col-4', 'col-3', 'col-2', 'vh-100', 'overflow-hidden');
        v.classList.add(`col-${valorParaClaseCol}`);
        if (valorParaClaseCol === '12' || valorParaClaseCol === '6') {
            v.classList.add('vh-100', 'overflow-hidden');
        }
    }
}