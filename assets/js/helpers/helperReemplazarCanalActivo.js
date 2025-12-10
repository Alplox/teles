import { crearFragmentCanal } from "../canalUI.js";
import { tele } from "../main.js";
import { showToast, ajustarClaseBotonCanal, guardarCanalesEnLocalStorage, registrarCambioManualCanales } from "../helpers/index.js";

export const reemplazarCanalActivo = (canalIdBotonPulsadoEnModal, canalIdExistente) => {
    try {
        let divPadreACambiar = document.querySelector(`div[data-canal="${canalIdExistente}"]`)
        if (divPadreACambiar) {
            let divExistenteACambiar = document.querySelector(`div[data-canal-cambio="${canalIdExistente}"]`)
            let barraOverlayDeCanalACambiar = document.querySelector(`#overlay-de-canal-${canalIdExistente}`)
            // evitar duplicados si canal que va a quedar de reemplazo ya existe en grid
            if (document.querySelector(`div[data-canal="${canalIdBotonPulsadoEnModal}"]`) && divPadreACambiar !== document.querySelector(`div[data-canal="${canalIdBotonPulsadoEnModal}"]`)) {
                tele.remove(canalIdBotonPulsadoEnModal);
            };

            divExistenteACambiar.remove();
            barraOverlayDeCanalACambiar.remove();

            divPadreACambiar.append(crearFragmentCanal(canalIdBotonPulsadoEnModal));
            divPadreACambiar.setAttribute('data-canal', canalIdBotonPulsadoEnModal); // deja atributo con el canal que se deja activo tras cambio
            ajustarClaseBotonCanal(canalIdExistente, false);
            ajustarClaseBotonCanal(canalIdBotonPulsadoEnModal, true);
            guardarCanalesEnLocalStorage();
            registrarCambioManualCanales();
        }
    } catch (error) {
        console.error(`Error intentar cambiar canal con id: ${canalIdExistente} por canal: ${canalIdBotonPulsadoEnModal}. Error: ${error}`);
        showToast({
            title: `Ha ocurrido un error al intentar cambiar canal: ${canalIdExistente} por canal: ${canalIdBotonPulsadoEnModal}.`,
            body: `Error: ${error}`,
            type: 'danger',
            autohide: false,
            delay: 0,
            showReloadOnError: true
        });
        return
    }
}