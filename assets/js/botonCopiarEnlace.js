// ----- copiar enlace a portapapeles y alerta copiado
const btnEnlace = document.querySelector('#btn-enlace');
const audioCopiadoFallido = new Audio('assets/sounds/Cancel-miss-chime-by-Raclure.wav');
const audioCopiadoExitoso = new Audio('assets/sounds/button-pressed-by-Pixabay.mp3');

btnEnlace.onclick = () => {
  let e = document.querySelector('#enlace-compartir');
  e.select();
  e.setSelectionRange(0, 99999);

  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(e.value)
      .then(() => {
        audioCopiadoExitoso.play();
        btnEnlace.innerHTML = 'Copiado exitoso! <i class="bi bi-clipboard-check"></i>'
        btnEnlace.classList.add('bg-success');
        setTimeout(() => {
          btnEnlace.innerHTML = 'Copiar enlace <i class="bi bi-clipboard"></i>'
          btnEnlace.classList.remove('bg-success');
        }, 2000);
      })
      .catch(error => {
        audioCopiadoFallido.play();
        btnEnlace.innerHTML = 'Copiado fallido! <i class="bi bi-clipboard-x"></i>'
        btnEnlace.classList.add('bg-danger');
        setTimeout(() => {
          btnEnlace.innerHTML = 'Copiar enlace <i class="bi bi-clipboard"></i>'
          btnEnlace.classList.remove('bg-danger');
        }, 2000);
        console.error('Error al copiar el enlace: ', error);
      });
  } else {
    console.error('La funcionalidad de escritura en el portapapeles no está disponible en este navegador.');
    try {
      // Intenta copiar el texto de respaldo
      audioCopiadoExitoso.play();
      document.execCommand('copy', false, e.value);
      btnEnlace.innerHTML = 'Copiado exitoso! <i class="bi bi-clipboard-check"></i>'
      btnEnlace.classList.add('bg-success');
      setTimeout(() => {
        btnEnlace.innerHTML = 'Copiar enlace <i class="bi bi-clipboard"></i>'
        btnEnlace.classList.remove('bg-success');
      }, 2000);
    } catch (error) {
      audioCopiadoFallido.play();
      btnEnlace.innerHTML = 'Copiado fallido! <i class="bi bi-clipboard-x"></i>'
      btnEnlace.classList.add('bg-danger');
      setTimeout(() => {
        btnEnlace.innerHTML = 'Copiar enlace <i class="bi bi-clipboard"></i>'
        btnEnlace.classList.remove('bg-danger');
      }, 2000);
      console.error('Error al copiar el texto al portapapeles: ', error);
    }
  }
};