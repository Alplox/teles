// Función para ocultar texto si el tamaño de los botones excede el tamaño del contenedor
export function hideTextoBotonesOverlay() {
  const BARRAS_OVERLAY = document.querySelectorAll('.barra-overlay');
  BARRAS_OVERLAY.forEach(overlay => {
    if (!overlay) return;
    const TEXTO_BOTONES_DENTRO_BARRA_OVERLAY = overlay.querySelectorAll('span:not(.dropdown-item span)');

    // siempre activa texto antes de ocultarlo para tomar tamaño total, no solo del icono
    TEXTO_BOTONES_DENTRO_BARRA_OVERLAY.forEach(span => {
      if (span && span.style.display !== 'inline') span.style.display = 'inline';
    });

    const overlayWidth = Math.floor(overlay.clientWidth);
    const contenidoWidth = Math.floor(overlay.scrollWidth);
    const overlayHeight = Math.floor(overlay.clientHeight);
    const margenSeguridadPx = 2; // evita falsos positivos cuando ambas medidas son casi iguales
    const desbordeHorizontal = (contenidoWidth - overlayWidth) > margenSeguridadPx;
    const margenWrapPx = 8; // tolerancia para paddings/gaps antes de considerar wrap

    // Detecta cuando la barra ocupa más de una línea (hace wrap) comparando su altura vs la altura de un botón
    const primerElementoInteractivo = overlay.querySelector('button, a, div');
    const alturaElementoBase = primerElementoInteractivo
      ? Math.floor(primerElementoInteractivo.getBoundingClientRect().height)
      : overlayHeight;
    const wrapActivo = (overlayHeight - alturaElementoBase) > margenWrapPx;

    const ocultar = desbordeHorizontal || wrapActivo;

    TEXTO_BOTONES_DENTRO_BARRA_OVERLAY.forEach(span => {
      if (!span) return;
      if (ocultar && span.style.display !== 'none') {
        span.style.display = 'none';
      } else if (!ocultar && span.style.display !== 'inline') {
        span.style.display = 'inline';
      }
    });
  });
}