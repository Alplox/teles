
const audioLimpiarCanalesActivos = new Audio('assets/sounds/TV-Shutdown-por-MATRIXXX_.mp3');

// Función para limpiar/remover todos los canales activos
const limpiarCanalesActivos = () => {
  audioLimpiarCanalesActivos.play();
  audioLimpiarCanalesActivos.volume = 0.8; 
  document.querySelectorAll('div[data-canal]').forEach(transmision => {
    tele.remove(transmision.getAttribute('data-canal'));
  });
};

let botonModalQuitarTodo = document.querySelector('#btn-modal-quitar-todo-canal-activo');
let botonOffcanvasQuitarTodo = document.querySelector('#btn-offcanvas-quitar-todo-canal-activo');

botonModalQuitarTodo.addEventListener('click', limpiarCanalesActivos);
botonOffcanvasQuitarTodo.addEventListener('click', limpiarCanalesActivos);

const detectarSiExistenCanalesParaQuitar = () => {
  let lsCanalesNow = localStorage.getItem('canales_storage');
  if (lsCanalesNow === '{}' || lsCanalesNow === null || document.querySelectorAll('div[data-canal]').length === 0) {
    console.log("El valor de canales_storage es nulo o vacío o no hay canales activos.");
  } else {
    limpiarCanalesActivos()
  }
}