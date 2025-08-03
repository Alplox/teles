import { CLASE_CSS_BOTON_PRIMARIO, CLASE_CSS_BOTON_SECUNDARIO } from "../constants/index.js";

export function ajustarClaseBotonCanal(canal, esActivo) {
    let botones = document.querySelectorAll(`button[data-canal="${canal}"]`);
    botones.forEach(boton => {
        esActivo ? boton.classList.replace(CLASE_CSS_BOTON_SECUNDARIO, CLASE_CSS_BOTON_PRIMARIO) : boton.classList.replace(CLASE_CSS_BOTON_PRIMARIO, CLASE_CSS_BOTON_SECUNDARIO);
    });
}