const ocultarBotonesDeQuitarTodaSeñal = () => {
  // ocultar botones de quitar todo canal se no existe señal activa
  let botonModalQuitarTodo = document.querySelector('#btn-modal-quitar-todo-canal-activo');
  let botonOffcanvasQuitarTodo = document.querySelector('#btn-offcanvas-quitar-todo-canal-activo');

  let botonModalCargarCanalesPredeterminados = document.querySelector('#btn-modal-cargar-canales-por-defecto');
  let botonOffcanvasCargarCanalesPredeterminados = document.querySelector('#btn-offcanvas-cargar-canales-por-defecto');

  if (botonModalQuitarTodo && botonOffcanvasQuitarTodo && botonModalCargarCanalesPredeterminados && botonOffcanvasCargarCanalesPredeterminados) {
    botonModalQuitarTodo.classList.add("d-none");
    botonOffcanvasQuitarTodo.classList.add("d-none");

    botonModalCargarCanalesPredeterminados.classList.remove("d-none");
    botonOffcanvasCargarCanalesPredeterminados.classList.remove("d-none");
  }
}


const mostrarBotonesDeQuitarTodaSeñal = () => {
  // mostrar botones de quitar todo canal
  let botonModalQuitarTodo = document.querySelector('#btn-modal-quitar-todo-canal-activo');
  let botonOffcanvasQuitarTodo = document.querySelector('#btn-offcanvas-quitar-todo-canal-activo');

  let botonModalCargarCanalesPredeterminados = document.querySelector('#btn-modal-cargar-canales-por-defecto');
  let botonOffcanvasCargarCanalesPredeterminados = document.querySelector('#btn-offcanvas-cargar-canales-por-defecto');

  if (botonModalQuitarTodo && botonOffcanvasQuitarTodo && botonModalCargarCanalesPredeterminados && botonOffcanvasCargarCanalesPredeterminados) {
    botonModalQuitarTodo.classList.remove("d-none");
    botonOffcanvasQuitarTodo.classList.remove("d-none");

    botonModalCargarCanalesPredeterminados.classList.add("d-none");
    botonOffcanvasCargarCanalesPredeterminados.classList.add("d-none");
  }
}

export const detectarSiMostrarOcultarBotonesDeQuitarTodaSeñal = () => {
  let lsCanalesNow = localStorage.getItem('canales_storage');
  if (lsCanalesNow === '{}' || lsCanalesNow === null || document.querySelectorAll('div[data-canal]').length === 0) {
    console.log("El valor de canales_storage es nulo o vacío.");
    ocultarBotonesDeQuitarTodaSeñal()
  } else {
    mostrarBotonesDeQuitarTodaSeñal()
  }
}
detectarSiMostrarOcultarBotonesDeQuitarTodaSeñal()