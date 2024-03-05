// Este codigo se utiliza para los botones que eliminan los filtros activos dentro de la opcion de filtrado por pais que se encuentra en el modal y offcanvas

// ----- añade número total de canales a boton "global" del filtro banderas 
document.querySelector('#modal-span-con-numero-total-canales').textContent = Object.keys(listaCanales).length
document.querySelector('#offcanvas-span-con-numero-total-canales').textContent = Object.keys(listaCanales).length

// Función para limpiar/remover todos los canales activos
const limpiarCanalesActivos = () => {
  document.querySelectorAll('div[data-canal]').forEach(transmision => {
    tele.remove(transmision.getAttribute('data-canal'));
  });
};

document.querySelector('#btn-modal-quitar-todo-canal-activo').addEventListener('click', limpiarCanalesActivos);
document.querySelector('#btn-offcanvas-quitar-todo-canal-activo').addEventListener('click', limpiarCanalesActivos);
