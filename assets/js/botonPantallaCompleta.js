// ----- btn fullscreen
const btnFullscreen = document.querySelector('#fullscreen');

function requestFullscreen() {
  const element = document.documentElement;
  try {
    if (element.webkitRequestFullscreen) {
      element.webkitRequestFullscreen();
    } else if (element.mozRequestFullScreen) {
      element.mozRequestFullScreen();
    } else if (element.msRequestFullscreen) {
      element.msRequestFullscreen();
    } else if (element.requestFullscreen) {
      element.requestFullscreen();
    }
  } catch (error) {
    console.error('Error requesting fullscreen:', error);
  }
}

function exitFullscreen() {
  try {
    if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    }
  } catch (error) {
    console.error('Error exiting fullscreen:', error);
  }
}

function isFullscreenSupported() {
  return !!(
    document.fullscreenEnabled
    || document.webkitFullscreenEnabled
    || document.mozFullScreenEnabled
    || document.msFullscreenEnabled
  );
}

function isFullscreen() {
  return isFullscreenSupported() && !!(
    document.fullscreenElement        //standard property
    || document.webkitFullscreenElement  //safari/opera support
    || document.mozFullScreenElement     //firefox support
    || document.msFullscreenElement      //ie/edge support
    || window.innerHeight == screen.height
  );
}

function handleFullscreenChange() {
  if (isFullscreen()) {
    btnFullscreen.innerHTML = 'Salir pantalla completa <i class="bi bi-fullscreen-exit ms-auto"></i>';
    btnFullscreen.classList.add('btn-indigo');
    btnFullscreen.classList.remove('btn-light-subtle');
  } else {
    btnFullscreen.innerHTML = 'Entrar pantalla completa <i class="bi bi-arrows-fullscreen ms-auto"></i>';
    btnFullscreen.classList.remove('btn-indigo');
    btnFullscreen.classList.add('btn-light-subtle');
  }
}

btnFullscreen.addEventListener('click', () => {
  if (isFullscreen()) {
    exitFullscreen();
  } else {
    requestFullscreen();
  }
});


if (!isFullscreenSupported()) {
  btnFullscreen.parentElement.parentElement.classList.toggle('d-none')
}

window.addEventListener('resize', () => {
  handleFullscreenChange();
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'F11') {
    event.preventDefault(); // Evita que el navegador entre en modo de pantalla completa por defecto al pulsar F11
    if (isFullscreen()) {
      exitFullscreen();
    } else {
      requestFullscreen();
    }
  }
});

document.addEventListener('fullscreenchange', handleFullscreenChange);
document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
document.addEventListener('mozfullscreenchange', handleFullscreenChange);
document.addEventListener('MSFullscreenChange', handleFullscreenChange);