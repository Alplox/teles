// ----- autofocus para filtro canales en PC
const modalBodyBotonesCanales = document.querySelector('#modal-body-botones-canales')
const offcanvasBodyBotonesCanales = document.querySelector('#offcanvas-body-botones-canales')

const filtroCanalesModal = document.querySelector('#modal-input-filtro');
const filtroCanalesOffcanvas = document.querySelector('#offcanvas-input-filtro');

document.querySelector('#modal-canales').addEventListener('shown.bs.modal', () => {
  !isMobile.any && filtroCanalesModal.focus();
});

// ----- filtro de canales https://css-tricks.com/in-page-filtered-search-with-vanilla-javascript/
function normalizarInput(normalizarEsto) {
  return normalizarEsto.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

// alertas en caso de no encontrar input
const modalMensajeAlerta = document.querySelector('.modal-mensaje-alerta');
const modalTextoNoEncontrado = document.querySelector('#modalTextoNoEncontrado');
const offcanvasMensajeAlerta = document.querySelector('.offcanvas-mensaje-alerta');
const offcanvasTextoNoEncontrado = document.querySelector('#offcanvasTextoNoEncontrado');

function ocultarElemento(elemento, ocultar) {
  elemento.classList.toggle('d-none', ocultar);
}

// filtro canales
function filtrarCanalesPorInput(e, btnsCanales) {
  let algunaCoincidencia = false;
  const idDelElemento = btnsCanales.id;
  const inputNormalized = normalizarInput(e);

  if (idDelElemento === 'modal-body-botones-canales') {
    const btnsCanalesDentroContainer = btnsCanales.querySelectorAll('button');
    
    if (inputNormalized === 'desconocido') {
      btnsCanalesDentroContainer.forEach(btn => {
        const country = btn.getAttribute('country');
        const countryNormalized = normalizarInput(country); 
        btn.classList.toggle('d-none', countryNormalized !== inputNormalized);
      });
    } else if (inputNormalized === '' || inputNormalized === null) {
      let todoBtn = document.querySelectorAll('#modal-collapse-botones-listado-filtro-paises  button');
      todoBtn.forEach(btn => {
        btn.classList.remove('btn-primary');
        btn.classList.add('btn-outline-secondary');
      });
      btnsCanalesDentroContainer.forEach(btn => {
        if (btn.classList.contains('d-none')) {
          btn.classList.toggle('d-none');
        }
      });
      btnMostrarTodoPaisModal.classList.remove('btn-outline-secondary');
      btnMostrarTodoPaisModal.classList.add('btn-primary');
      ocultarElemento(modalMensajeAlerta, true);
    } else {
      btnsCanalesDentroContainer.forEach(btn => {
        const contenidoBtn = btn.innerHTML;
        const contenidoBtnNormalized = normalizarInput(contenidoBtn);
        let coincidencia = contenidoBtnNormalized.includes(inputNormalized)
          btn.classList.toggle('d-none', !coincidencia);
          if (coincidencia) {
            algunaCoincidencia = true;
          }
        });
        ocultarElemento(modalMensajeAlerta, algunaCoincidencia); // Mostrar o ocultar mensaje de alerta según si hay coincidencias o no
        modalTextoNoEncontrado.textContent = inputNormalized;
    }
    filtroCanalesModal.value = e
  } else if (idDelElemento === 'offcanvas-body-botones-canales') {
    const btnsCanalesDentroContainer = btnsCanales.querySelectorAll('button');
    if (inputNormalized === 'desconocido') {
      btnsCanalesDentroContainer.forEach(btn => {
        const country = btn.getAttribute('country');
        const countryNormalized = normalizarInput(country); 
        btn.classList.toggle('d-none', countryNormalized !== inputNormalized);
      });
    } else if (inputNormalized === '' || inputNormalized === null) {
      let todoBtn = document.querySelectorAll('#offcanvas-collapse-botones-listado-filtro-paises > button');
      todoBtn.forEach(btn => {
        btn.classList.remove('btn-primary');
        btn.classList.add('btn-outline-secondary');
      });
      btnsCanalesDentroContainer.forEach(btn => {
        if (btn.classList.contains('d-none')) {
          btn.classList.toggle('d-none');
        }
      });
      btnMostrarTodoPaisOffcanvas.classList.remove('btn-outline-secondary');
      btnMostrarTodoPaisOffcanvas.classList.add('btn-primary');
      ocultarElemento(offcanvasMensajeAlerta, true);
    } else {
      btnsCanalesDentroContainer.forEach(btn => {
        const contenidoBtn = btn.innerHTML;
        const contenidoBtnNormalized = normalizarInput(contenidoBtn);
        let coincidencia = contenidoBtnNormalized.includes(inputNormalized)
        btn.classList.toggle('d-none', !coincidencia);
        if (coincidencia) {
          algunaCoincidencia = true;
        }
      });
      ocultarElemento(offcanvasMensajeAlerta, algunaCoincidencia); // Mostrar o ocultar mensaje de alerta según si hay coincidencias o no
      offcanvasTextoNoEncontrado.textContent = inputNormalized;
    }
    filtroCanalesOffcanvas.value = e
  }
}

filtroCanalesModal.addEventListener('input', (e) => {
  filtroCanalesModal.focus()
  filtrarCanalesPorInput(e.target.value, modalBodyBotonesCanales);
});

filtroCanalesOffcanvas.addEventListener('input', (e) => {
  filtroCanalesOffcanvas.focus()
  filtrarCanalesPorInput(e.target.value, offcanvasBodyBotonesCanales);
});

// ----- botones mostrar todos los canales
const btnMostrarTodoPaisModal = document.querySelector('#modal-btn-mostrar-todo-pais');
btnMostrarTodoPaisModal.addEventListener('click', () => {
  let todoBtn = document.querySelectorAll('#modal-collapse-botones-listado-filtro-paises button');
    todoBtn.forEach(btn => {
      btn.classList.remove('btn-primary');
      btn.classList.add('btn-outline-secondary');
    });
  filtrarCanalesPorInput('', document.querySelector('#modal-body-botones-canales'));

  btnMostrarTodoPaisModal.classList.remove('btn-outline-secondary');
  btnMostrarTodoPaisModal.classList.add('btn-primary');
});

const btnMostrarTodoPaisOffcanvas = document.querySelector('#offcanvas-btn-mostrar-todo-pais');
btnMostrarTodoPaisOffcanvas.addEventListener('click', () => {
  let todoBtn = document.querySelectorAll('#offcanvas-collapse-botones-listado-filtro-paises button');
    todoBtn.forEach(btn => {
      btn.classList.remove('btn-primary');
      btn.classList.add('btn-outline-secondary');
    });
  filtrarCanalesPorInput('', document.querySelector('#offcanvas-body-botones-canales'));
  btnMostrarTodoPaisOffcanvas.classList.remove('btn-outline-secondary');
  btnMostrarTodoPaisOffcanvas.classList.add('btn-primary');
});