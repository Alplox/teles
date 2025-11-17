import { ajustarVisibilidadBotonesQuitarTodaSeñal, ajustarNumeroDivisionesClaseCol} from './helpers/index.js';
import { CONTAINER_VISION_CUADRICULA } from "./main.js";

let observerScheduled = false;

const OBSERVER = new MutationObserver(() => {
    if (observerScheduled) return;
    observerScheduled = true;
    requestAnimationFrame(() => {
        observerScheduled = false;
        try {
            ajustarNumeroDivisionesClaseCol?.();
            ajustarVisibilidadBotonesQuitarTodaSeñal?.();
        } catch (e) {
            console.error('Error en ajustarNumeroDivisionesClaseCol o ajustarVisibilidadBotonesQuitarTodaSeñal:', e);
        }
    });
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