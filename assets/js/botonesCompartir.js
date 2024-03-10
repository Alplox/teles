// ----- btn compartir sitio (usa navigator.share en telefonos) 
// https://developer.mozilla.org/en-US/docs/Web/API/Navigator/canShare
const datosCompartir = {
    title: 'teles',
    text: 'PWA Código Abierto para ver/comparar preseleccionadas transmisiones de noticias provenientes de Chile (y el mundo).',
    url: 'https://alplox.github.io/teles/',
  };
  
  const btnsCompartir = document.querySelectorAll('button.btn-outline-warning, button.btn-compartir');
  
  if (checkMovil()){
    for (const btn of btnsCompartir){
      btn.addEventListener('click', async () => {
        try {
          await navigator.share(datosCompartir);
        } catch(err) {
          console.log(`Error: ${err}`);
        } 
      });
    }
  } else {
    for (const btn of btnsCompartir){
      btn.setAttribute('data-bs-toggle', 'modal');
      btn.setAttribute('data-bs-target', '#modal-compartir');
      btn.setAttribute('data-bs-dismiss', 'modal');
    }
  };