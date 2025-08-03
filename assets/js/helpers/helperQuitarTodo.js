import { AUDIO_TV_SHUTDOWN } from "../constants/index.js";
import { tele } from "../main.js";
import { playAudioSinDelay, mostrarToast } from "../helpers/index.js";

export function quitarTodoCanalActivo() {
    try {
        playAudioSinDelay(AUDIO_TV_SHUTDOWN)

        document.querySelectorAll('div[data-canal]').forEach(canalActivo => {
            const CANAL_A_REMOVER = canalActivo.dataset.canal;
            if (CANAL_A_REMOVER) {
                tele.remove(CANAL_A_REMOVER);
            }
        });
    } catch (error) {
        console.error(`Error al intentar quitar todos los canales. Error: ${error}`);
        mostrarToast(`
        <span class="fw-bold">Ha ocurrido un error al intentar quitar todos los canales.</span>
        <hr>
        <span class="bg-dark bg-opacity-25 px-2 rounded-3">Error: ${error}</span>
        <hr>
        Si error persiste tras recargar, prueba borrar tu almacenamiento local desde el panel "Personalización" o borrando la caché del navegador.
        <button type="button" class="btn btn-light rounded-pill btn-sm w-100 border-light mt-2" onclick="location.reload()"> Pulsa para recargar <i class="bi bi-arrow-clockwise"></i></button>
        `, 'danger', false);
        return
    }
};