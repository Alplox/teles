// ----- btn fullscreen
// https://javascript.plainenglish.io/enter-full-screen-mode-with-javascript-a8a782d96dc
const btnFullscreen = document.querySelector('#fullscreen');

function getFullscreenElement() {
  return document.fullscreenElement   //standard property
  || document.webkitFullscreenElement //safari/opera support
  || document.mozFullscreenElement    //firefox support
  || document.msFullscreenElement;    //ie/edge support
}

function toggleFullscreen() {
  if(getFullscreenElement()) {
    document.exitFullscreen();
    btnFullscreen.innerHTML = '<i class="bi bi-arrows-fullscreen"></i> Entrar pantalla completa';
  }else {
    document.documentElement.requestFullscreen();
    btnFullscreen.innerHTML = '<i class="bi bi-fullscreen-exit"></i> Salir pantalla completa';
  }
}

btnFullscreen.addEventListener('click', () => {
  toggleFullscreen();
});