
export function alternarPosicionBotonesFlotantes(topClass, startClass, marginClass, translateClass) {
    let divBotonesFlotantes = document.querySelector('#grupo-botones-flotantes')
    divBotonesFlotantes.classList.remove(
        'top-0', 'top-50', 'bottom-0',
        'start-0', 'start-50', 'end-0',
        'translate-middle-x', 'translate-middle-y', 'translate-middle',
        'mb-3', 'mt-3'
    );
    // Agregar clases solo si los argumentos no están vacíos
    if (topClass !== '') divBotonesFlotantes.classList.add(topClass);
    if (startClass !== '') divBotonesFlotantes.classList.add(startClass);
    if (marginClass !== '') divBotonesFlotantes.classList.add(marginClass);
    if (translateClass !== '') divBotonesFlotantes.classList.add(translateClass);
}

export function clicBotonPosicionBotonesFlotantes(topClass, startClass, margin = '', translateClass = '') {
    alternarPosicionBotonesFlotantes(topClass, startClass, margin, translateClass);
    let posicionElegida = {
        top: topClass,
        start: startClass,
        margin: margin,
        translate: translateClass
    };
    localStorage.setItem('posicion-botones-flotante', JSON.stringify(posicionElegida));
}