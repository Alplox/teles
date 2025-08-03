export function addSortEventListener(buttonId, containerId, sortFunction) {
    const BOTON_AÑADIR_EVENTO = document.querySelector(`#${buttonId}`);
    BOTON_AÑADIR_EVENTO.addEventListener('click', () => sortFunction(containerId));
}