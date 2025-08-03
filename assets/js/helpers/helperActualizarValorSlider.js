
import {
    CONTAINER_VISION_CUADRICULA,
    INPUT_RANGE_PERSONALIZACION_TAMAÑO_VISION_CUADRICULA,
    SPAN_VALOR_INPUT_RANGE
} from "../main.js";

export function actualizarValorSlider() {
    let valorInputRange = parseInt(localStorage.getItem('valor-input-range') ?? 100);
    INPUT_RANGE_PERSONALIZACION_TAMAÑO_VISION_CUADRICULA.setAttribute('value', valorInputRange);
    SPAN_VALOR_INPUT_RANGE.textContent = `${valorInputRange}%`;
    CONTAINER_VISION_CUADRICULA.style.maxWidth = `${valorInputRange}%`;
}