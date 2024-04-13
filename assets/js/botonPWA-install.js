let containerPwaInstall = document.querySelector('#pwa-install');
let botonPwaInstall = document.querySelector('#boton-pwa-install');

botonPwaInstall.addEventListener('click', () => {
    containerPwaInstall.showDialog(true)  // con valor "true" para forzar aparición
})