import { guardarCanalesEnLocalStorage, ajustarVisibilidadBotonesQuitarTodaSeñal, ajustarNumeroDivisionesClaseCol} from './helpers/index.js';
import { CONTAINER_VISION_CUADRICULA } from "./main.js";

const OBSERVER = new MutationObserver(() => {
    try {
        ajustarNumeroDivisionesClaseCol?.();
    } catch (e) {
        console.error('Error en ajustarNumeroDivisionesClaseCol:', e);
    }
    try {
        ajustarVisibilidadBotonesQuitarTodaSeñal?.();
    } catch (e) {
        console.error('Error en ajustarVisibilidadBotonesQuitarTodaSeñal:', e);
    }
    try {
        guardarCanalesEnLocalStorage?.();
    } catch (e) {
        console.error('Error en guardarCanalesEnLocalStorage:', e);
    }
    console.info('observer ejecutado');
});

const OBSERVER_CONFIG = {
    childList: true,
    subtree: false,
    attributes: false,
    characterData: false
};

if (CONTAINER_VISION_CUADRICULA) {
    OBSERVER.observe(CONTAINER_VISION_CUADRICULA, OBSERVER_CONFIG);
}