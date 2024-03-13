const ocultarBotonesDeQuitarTodaSeñal = () => {
  // ocultar botones de quitar todo canal se no existe señal activa
  let botonModalQuitarTodo = document.querySelector('#btn-modal-quitar-todo-canal-activo');
  let botonOffcanvasQuitarTodo = document.querySelector('#btn-offcanvas-quitar-todo-canal-activo');

  if (botonModalQuitarTodo && botonOffcanvasQuitarTodo) {
    botonModalQuitarTodo.classList.add("d-none");
    botonOffcanvasQuitarTodo.classList.add("d-none");
  }
}


const mostrarBotonesDeQuitarTodaSeñal = () => {
  // mostrar botones de quitar todo canal
  let botonModalQuitarTodo = document.querySelector('#btn-modal-quitar-todo-canal-activo');
  let botonOffcanvasQuitarTodo = document.querySelector('#btn-offcanvas-quitar-todo-canal-activo');

  if (botonModalQuitarTodo && botonOffcanvasQuitarTodo) {
    botonModalQuitarTodo.classList.remove("d-none");
    botonOffcanvasQuitarTodo.classList.remove("d-none");
  }
}


const detectarSiMostrarOcultarBotonesDeQuitarTodaSeñal = () => {
let lsCanalesNow = localStorage.getItem('canales_storage');
  if (lsCanalesNow === '{}' || lsCanalesNow === null) {
    console.log("El valor de canales_storage es nulo o vacío.");
    ocultarBotonesDeQuitarTodaSeñal()
  } else {
    mostrarBotonesDeQuitarTodaSeñal()
  }
}