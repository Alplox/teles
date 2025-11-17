import { listaCanales } from "../canalesData.js";
import { CONTAINER_VISION_CUADRICULA } from "../main.js";
import { mostrarToast } from "../helpers/index.js";

export function guardarCanalesEnLocalStorage() {
    try {
        const CANALES_ACTIVOS_EN_DOM = CONTAINER_VISION_CUADRICULA.querySelectorAll('div[data-canal]');
        const lsCanales = {};

        CANALES_ACTIVOS_EN_DOM.forEach(divCanal => {
            const canalId = divCanal.dataset.canal;
            const datosCanal = canalId && listaCanales[canalId];
            if (!datosCanal || !datosCanal.nombre) {
                return; // ignorar canales que no estén definidos en listaCanales
            }
            lsCanales[canalId] = datosCanal.nombre;
        });

        localStorage.setItem('canales-vision-cuadricula', JSON.stringify(lsCanales));

        document.querySelector('#alerta-guardado-canales').classList.remove('d-none');
        setTimeout(() => {
            document.querySelector('#alerta-guardado-canales').classList.add('d-none');
        }, 420);
    } catch (error) {
        console.error('Error al intentar guardar canales en el almacenamiento local: ', error);
        mostrarToast(`
        <span class="fw-bold">Error al intentar guardar canales en el almacenamiento local.</span>
        <hr>
        <span class="bg-dark bg-opacity-25 px-2 rounded-3">Error: ${error}</span>
        <hr>
        Si error persiste tras recargar, prueba borrar tu almacenamiento local desde el panel "Personalización" o borrando la caché del navegador.
        <button type="button" class="btn btn-light rounded-pill btn-sm w-100 border-light mt-2" onclick="location.reload()"> Pulsa para recargar <i class="bi bi-arrow-clockwise"></i></button>`, 'danger', false)
        return
    }
}