import { ajustarClaseSiMenosTresCanalesActivos } from './F_ajustarClasesCanalesActivos.js'
import { detectarSiMostrarOcultarBotonesDeQuitarTodaSeñal } from './F_ocultarBotonesDeQuitarTodaSeñal.js'

const contenedorAObservar = document.querySelector('#canales-grid');
const observer = new MutationObserver(() => {
    // Llamamos a las funciones para aplicar las clases cada vez que hay cambios en el contenedor
    ajustarClaseSiMenosTresCanalesActivos();
    detectarSiMostrarOcultarBotonesDeQuitarTodaSeñal()
});
const config = { childList: true }; // Configuramos el observador para que observe cambios en la estructura del contenedor

observer.observe(contenedorAObservar, config);