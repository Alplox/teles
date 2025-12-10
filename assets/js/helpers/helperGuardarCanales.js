import { channelsList } from "../canalesData.js";
import { gridViewContainerEl } from "../main.js";
import { showToast } from "../helpers/index.js";
import { LS_KEY_ACTIVE_VIEW_MODE, LS_KEY_SAVED_CHANNELS_GRID_VIEW } from "../constants/index.js";

export const guardarCanalesEnLocalStorage = () => {
    try {
        // si es single view no ejecutar
        if (localStorage.getItem(LS_KEY_ACTIVE_VIEW_MODE) === 'single-view') {
            return;
        }

        const CANALES_ACTIVOS_EN_DOM = gridViewContainerEl.querySelectorAll('div[data-canal]');
        const lsCanales = {};

        CANALES_ACTIVOS_EN_DOM.forEach(divCanal => {
            const canalId = divCanal.dataset.canal;
            const datosCanal = canalId && channelsList[canalId];
            if (!datosCanal || !datosCanal.nombre) {
                return; // ignorar canales que no estén definidos en channelsList
            }
            lsCanales[canalId] = datosCanal.nombre;
        });

        // si no hay canales activos en DOM no guardar
        if (CANALES_ACTIVOS_EN_DOM.length > 0 && Object.keys(lsCanales).length === 0) {
            return;
        }

        localStorage.setItem(LS_KEY_SAVED_CHANNELS_GRID_VIEW, JSON.stringify(lsCanales));

        document.querySelector('#alerta-guardado-canales').classList.remove('d-none');
        setTimeout(() => {
            document.querySelector('#alerta-guardado-canales').classList.add('d-none');
        }, 420);
    } catch (error) {
        console.error('Error al intentar guardar canales en el almacenamiento local: ', error);
        showToast({
            title: 'Error al intentar guardar canales en el almacenamiento local.',
            body: `Error: ${error}`,
            type: 'danger',
            autohide: false,
            delay: 0,
            showReloadOnError: true
        });
        return
    }
}