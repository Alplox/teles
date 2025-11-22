import { crearFragmentCanal } from "../canalUI.js";
import { tele } from "../main.js";
import { mostrarToast, ajustarClaseBotonCanal, guardarCanalesEnLocalStorage, registrarCambioManualCanales } from "../helpers/index.js";

export function reemplazarCanalActivo(canalIdBotonPulsadoEnModal, canalIdExistente) {
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
        mostrarToast(`
        <span class="fw-bold">Ha ocurrido un error al intentar cambiar canal con id: ${canalIdExistente} por canal: ${canalIdBotonPulsadoEnModal}.</span>
        <hr>
        <span class="bg-dark bg-opacity-25 px-2 rounded-3">Error: ${error}</span>
        <hr>
        Si error persiste tras recargar, prueba borrar tu almacenamiento local desde el panel "Personalización" o borrando la caché del navegador.
        <button type="button" class="btn btn-light rounded-pill btn-sm w-100 border-light mt-2" onclick="location.reload()"> Pulsa para recargar <i class="bi bi-arrow-clockwise"></i></button>`, 'danger')
        return
    }
}