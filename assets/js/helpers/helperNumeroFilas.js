export function obtenerNumeroCanalesFila() { // el numero, no el valor clase 'col-'
    let lsTransmisionesFila = localStorage.getItem('numero-class-columnas-por-fila');
    let seleccionTransmisionesFila;
    if (lsTransmisionesFila === '12') {
        seleccionTransmisionesFila = 1;
    } else if (lsTransmisionesFila === '6') {
        seleccionTransmisionesFila = 2;
    } else if (lsTransmisionesFila === '4') {
        seleccionTransmisionesFila = 3;
    } else if (lsTransmisionesFila === '3') {
        seleccionTransmisionesFila = 4;
    } else if (lsTransmisionesFila === '2') {
        seleccionTransmisionesFila = 6;
    } else if (lsTransmisionesFila === '1') {
        seleccionTransmisionesFila = 12;
    };
    return seleccionTransmisionesFila
}