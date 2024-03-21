// ----- btn compartir sitio (usa navigator.share en telefonos) 
// https://developer.mozilla.org/en-US/docs/Web/API/Navigator/canShare
const datosCompartir = {
    title: 'teles',
    text: 'PWA Código Abierto para ver/comparar preseleccionadas transmisiones de noticias provenientes de Chile (y el mundo).',
    url: 'https://alplox.github.io/teles/',
  };
  
  const btnCompartir = document.querySelector('button.btn-compartir');
  const contenedorBtnsCompartirExistentes = document.querySelector('#contenedor-botones-compartir');

  if (isMobile.any && navigator.share){
    btnCompartir.classList.remove('d-none');
    btnCompartir.addEventListener('click', async () => {
      try {
        await navigator.share(datosCompartir);
      } catch(err) {
        console.log(`Error: ${err}`);
      } 
    });
    contenedorBtnsCompartirExistentes.classList.add('d-none');
  };