// ----- autofocus para filtro canales en PC
const modalBodyBotonesCanales = document.querySelector('#modal-body-botones-canales')
const offcanvasBodyBotonesCanales = document.querySelector('#offcanvas-body-botones-canales')

const filtroCanalesModal = document.querySelector('#modal-input-filtro');
const filtroCanalesOffcanvas = document.querySelector('#offcanvas-input-filtro');

document.querySelector('#modal-canales').addEventListener('shown.bs.modal', () => {
  !tele.movil() && filtroCanalesModal.focus();
});

// ----- filtro de canales https://css-tricks.com/in-page-filtered-search-with-vanilla-javascript/
function normalizarInput(normalizarEsto) {
  return normalizarEsto.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

function filtrarCanalesPorInput(e, btnsCanales) {
 
  const idDelElemento = btnsCanales.id;
  const inputNormalized = normalizarInput(e);

  if (idDelElemento === 'modal-body-botones-canales') {
    const btnsCanalesDentroContainer = btnsCanales.querySelectorAll('button');

            if (inputNormalized === 'unknow') {
              btnsCanalesDentroContainer.forEach(btn => {
                const country = btn.getAttribute('country');
                const countryNormalized = normalizarInput(country); 
                btn.classList.toggle('d-none', countryNormalized !== inputNormalized);
                
              });
            } else if (inputNormalized === '' || inputNormalized === null) {
              let todoBtn = document.querySelectorAll('#modal-collapse-botones-listado-filtro-paises > button');
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

            
            } else {
              btnsCanalesDentroContainer.forEach(btn => {
                const contenidoBtn = btn.innerHTML;
                const contenidoBtnNormalized = normalizarInput(contenidoBtn);
                btn.classList.toggle('d-none', !contenidoBtnNormalized.includes(inputNormalized));
              });
            }
            filtroCanalesModal.value = inputNormalized





  } else if (idDelElemento === 'offcanvas-body-botones-canales') {
    const btnsCanalesDentroContainer = btnsCanales.querySelectorAll('button');

    if (inputNormalized === 'unknow') {
      btnsCanalesDentroContainer.forEach(btn => {
        const country = btn.getAttribute('country');
        const countryNormalized = normalizarInput(country); 
        btn.classList.toggle('d-none', countryNormalized !== inputNormalized);
        
      });
    } else if (inputNormalized === '') {
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

    
    } else {
      btnsCanalesDentroContainer.forEach(btn => {
        const contenidoBtn = btn.innerHTML;
        const contenidoBtnNormalized = normalizarInput(contenidoBtn);
        btn.classList.toggle('d-none', !contenidoBtnNormalized.includes(inputNormalized));
      });
    }
    filtroCanalesOffcanvas.value = inputNormalized

  }
 
}

filtroCanalesModal.addEventListener('input', (e) => {
  filtrarCanalesPorInput(e.target.value, modalBodyBotonesCanales);
});

filtroCanalesOffcanvas.addEventListener('input', (e) => {
  filtrarCanalesPorInput(e.target.value, offcanvasBodyBotonesCanales);
});























// ----- filtro de canales por pais

// selecciona div contenedor de botones del DOM
/* let containerBtnBanderas = document.querySelector('#listado-filtro-paises') */
// btn por defecto, muestra todos los canales/paises
/* const btnMostrarTodoPais = document.querySelector('#mostrar-todo-pais'); */
/* function crearBotonesFiltroPorPais(containerBtnBanderas, btnMostrarTodoPais){
    btnMostrarTodoPais.addEventListener('click', () => {

    let todoBtn = containerBtnBanderas.querySelectorAll('button');
      todoBtn.forEach(btn => {
        btn.classList.remove('btn-primary');
        btn.classList.add('btn-outline-secondary');
      });
    filtrarCanalesPorInput('', containerBtnBanderas);
    
    btnMostrarTodoPais.classList.remove('btn-outline-secondary');
    btnMostrarTodoPais.classList.add('btn-primary');
    });
}

crearBotonesFiltroPorPais(document.querySelector('#modal-collapse-botones-listado-filtro-paises'), document.querySelector('#modal-btn-mostrar-todo-pais'))
crearBotonesFiltroPorPais(document.querySelector('#offcanvas-listado-filtro-paises'), document.querySelector('#offcanvas-btn-mostrar-todo-pais'))

 */

const btnMostrarTodoPaisModal = document.querySelector('#modal-btn-mostrar-todo-pais');
btnMostrarTodoPaisModal.addEventListener('click', () => {
  let todoBtn = document.querySelectorAll('#modal-collapse-botones-listado-filtro-paises > button');
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
  let todoBtn = document.querySelectorAll('#offcanvas-collapse-botones-listado-filtro-paises > button');
    todoBtn.forEach(btn => {
      btn.classList.remove('btn-primary');
      btn.classList.add('btn-outline-secondary');
    });
  filtrarCanalesPorInput('', document.querySelector('#offcanvas-body-botones-canales'));
  btnMostrarTodoPaisOffcanvas.classList.remove('btn-outline-secondary');
  btnMostrarTodoPaisOffcanvas.classList.add('btn-primary');
});
    