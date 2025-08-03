import { BOTONES_PERSONALIZAR_OVERLAY, CHECKBOX_PERSONALIZAR_VISUALIZACION_OVERLAY, SPAN_VALOR_CHECKBOX_PERSONALIZAR_VISUALIZACION_OVERLAY } from "../main.js";
import { mostrarToast, setCheckboxState, hideTextoBotonesOverlay } from "../helpers/index.js";

export function actualizarBotonesPersonalizarOverlay() {
    try {
        BOTONES_PERSONALIZAR_OVERLAY.forEach(contenedorBoton => {
            let botonIndividual = contenedorBoton.querySelector('.btn-check');
            let datasetBoton = botonIndividual.dataset.botonoverlay;
            let spanValorBoton = contenedorBoton.querySelector('span');
    
            if (localStorage.getItem('overlay-display') !== 'hide') {
                botonIndividual.disabled = false;
                document.body.classList.remove('d-none__barras-overlay');
                setCheckboxState(CHECKBOX_PERSONALIZAR_VISUALIZACION_OVERLAY, SPAN_VALOR_CHECKBOX_PERSONALIZAR_VISUALIZACION_OVERLAY, 'overlay-display', true);
                if (localStorage.getItem(`${datasetBoton}`) === 'hide') {
                    botonIndividual.checked = false;
                    spanValorBoton.innerHTML = "[oculto]";
                    document.body.classList.add(`d-none__barras-overlay__${datasetBoton}`);
                } else {
                    botonIndividual.checked = true;
                    spanValorBoton.innerHTML = "[visible]";
                    document.body.classList.remove(`d-none__barras-overlay__${datasetBoton}`);
                };
            } else {
                botonIndividual.checked = false;
                botonIndividual.disabled = true;
                spanValorBoton.innerHTML = "[oculto]";
                document.body.classList.add('d-none__barras-overlay');
                setCheckboxState(CHECKBOX_PERSONALIZAR_VISUALIZACION_OVERLAY, SPAN_VALOR_CHECKBOX_PERSONALIZAR_VISUALIZACION_OVERLAY, 'overlay-display', false);
            };
    
            hideTextoBotonesOverlay(); // siempre al final. Evalúa si botones overlay están haciendo desbordamiento
        });
    } catch (error) {
        console.error(`Error durante actualización estado botones personalizar overlay. Error: ${error}`);
        mostrarToast(`
        <span class="fw-bold">Ha ocurrido un error durante la actualización del estado botones personalizar overlay.</span>
        <hr>
        <span class="bg-dark bg-opacity-25 px-2 rounded-3">Error: ${error}</span>
        <hr>
        Si error persiste tras recargar, prueba borrar tu almacenamiento local desde el panel "Personalización" o borrando la caché del navegador.
        <button type="button" class="btn btn-light rounded-pill btn-sm w-100 border-light mt-2" onclick="location.reload()"> Pulsa para recargar <i class="bi bi-arrow-clockwise"></i></button>`, 'danger', false)
        return
    } 
}