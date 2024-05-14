import { ajustarNumeroDivisionesClaseCol } from './ajustarClasesCanalesActivos.js'
import { ajustarVisibilidadBotonesQuitarTodaSeñal } from './ajustarVisibilidadBotonesQuitarTodaSeñal.js'
import { CONTAINER_VISION_CUADRICULA, guardarCanalesEnLocalStorage } from "./main.js";

const OBSERVER = new MutationObserver(() => {
    ajustarNumeroDivisionesClaseCol();
    ajustarVisibilidadBotonesQuitarTodaSeñal();
    guardarCanalesEnLocalStorage();
    console.info('observer ejecutado');
});

const OBSERVER_CONFIG = {
    childList: true,
    subtree: false,
    attributes: false,
    characterData: false
};

OBSERVER.observe(CONTAINER_VISION_CUADRICULA, OBSERVER_CONFIG);