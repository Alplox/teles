import { tele } from './main.js'

const cargarCanalesPredeterminados = () => {
  document.querySelectorAll('div[data-canal]').forEach(transmision => {
    tele.remove(transmision.getAttribute('data-canal'));
  });
  tele.cargaCanalesPredeterminados("resetPorUsuario");
};

let botonModalCargarCanalesPredeterminados = document.querySelector('#btn-modal-cargar-canales-por-defecto');
let botonOffcanvasCargarCanalesPredeterminados = document.querySelector('#btn-offcanvas-cargar-canales-por-defecto');

botonModalCargarCanalesPredeterminados.addEventListener('click', cargarCanalesPredeterminados);
botonOffcanvasCargarCanalesPredeterminados.addEventListener('click', cargarCanalesPredeterminados);