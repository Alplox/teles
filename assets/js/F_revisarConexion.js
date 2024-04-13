export function revisarConexion() {
    navigator.onLine
        ? document.querySelector('#alert-internet-status').classList.add('d-none')
        : document.querySelector('#alert-internet-status').classList.remove('d-none')
} 