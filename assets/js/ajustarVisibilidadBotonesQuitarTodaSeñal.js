import {
  BOTON_MODAL_QUITAR_TODO_ACTIVO,
  BOTON_OFFCANVAS_QUITAR_TODO_ACTIVO,
  BOTON_MODAL_CANALES_PREDETERMINADOS,
  BOTON_OFFCANVAS_CANALES_PREDETERMINADOS
} from './botones.js'

const hideBotonesQuitarTodaSeñal = () => {
  BOTON_MODAL_QUITAR_TODO_ACTIVO.classList.add("d-none");
  BOTON_OFFCANVAS_QUITAR_TODO_ACTIVO.classList.add("d-none");

  BOTON_MODAL_CANALES_PREDETERMINADOS.classList.remove("d-none");
  BOTON_OFFCANVAS_CANALES_PREDETERMINADOS.classList.remove("d-none");
}

const showBotonesQuitarTodaSeñal = () => {
  BOTON_MODAL_QUITAR_TODO_ACTIVO.classList.remove("d-none");
  BOTON_OFFCANVAS_QUITAR_TODO_ACTIVO.classList.remove("d-none");

  BOTON_MODAL_CANALES_PREDETERMINADOS.classList.add("d-none");
  BOTON_OFFCANVAS_CANALES_PREDETERMINADOS.classList.add("d-none");
}

export const ajustarVisibilidadBotonesQuitarTodaSeñal = () => {
  document.querySelectorAll('div[data-canal]').length === 0 ? hideBotonesQuitarTodaSeñal() : showBotonesQuitarTodaSeñal()
}