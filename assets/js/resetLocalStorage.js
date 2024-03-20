// ----- alerta borrado localstorage
const btnReset = document.querySelector('#btn-reset');
const alertReset = document.querySelector('#alert-reset');
const audioLoopEstaticaCRT = new Audio('assets/sounds/DefectLineTransformer-por-blaukreuz.wav');

btnReset.addEventListener('click', () => {  
  detectarSiExistenCanalesParaQuitar();
  localStorage.clear();
  audioLimpiarCanalesActivos.play();
  audioLimpiarCanalesActivos.volume = 0.8;
  audioLoopEstaticaCRT.volume = 0.8;
  audioLoopEstaticaCRT.loop = true;
  audioLoopEstaticaCRT.play();
  alertReset.classList.remove('d-none');
})