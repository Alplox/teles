function revisarConexion() {
    const alertaInternetStatus = document.querySelector('#alerta-internet-status');
    if (!alertaInternetStatus) return; // Seguridad: evita error si el elemento no existe

    if (navigator.onLine) {
        alertaInternetStatus.classList.add('d-none');
    } else {
        alertaInternetStatus.classList.remove('d-none');
    }
}

// Llama a esta función una vez para activar la detección automática
export function iniciarRevisarConexion() {
    revisarConexion(); // Ejecutar inmediatamente al importar
    window.addEventListener('online', revisarConexion);
    window.addEventListener('offline', revisarConexion);
}