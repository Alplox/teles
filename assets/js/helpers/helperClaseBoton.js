import { CSS_CLASS_BUTTON_PRIMARY, CSS_CLASS_BUTTON_SECONDARY } from "../constants/index.js";

export const ajustarClaseBotonCanal = (canal, esActivo) => {
    let botones = document.querySelectorAll(`button[data-canal="${canal}"]`);
    botones.forEach(boton => {
        esActivo ? boton.classList.replace(CSS_CLASS_BUTTON_SECONDARY, CSS_CLASS_BUTTON_PRIMARY) : boton.classList.replace(CSS_CLASS_BUTTON_PRIMARY, CSS_CLASS_BUTTON_SECONDARY);
    });
}