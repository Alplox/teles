
const audioLimpiarCanalesActivos = new Audio('/assets/sounds/TV-Shutdown-por-MATRIXXX_.mp3');

// Función para limpiar/remover todos los canales activos
const limpiarCanalesActivos = () => {
  audioLimpiarCanalesActivos.play();
  document.querySelectorAll('div[data-canal]').forEach(transmision => {
    tele.remove(transmision.getAttribute('data-canal'));
  });
};

document.querySelector('#btn-modal-quitar-todo-canal-activo').addEventListener('click', limpiarCanalesActivos);
document.querySelector('#btn-offcanvas-quitar-todo-canal-activo').addEventListener('click', limpiarCanalesActivos);