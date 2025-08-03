// Función para ocultar texto si el tamaño de los botones excede el tamaño del contenedor
export function hideTextoBotonesOverlay() {
  const BARRAS_OVERLAY = document.querySelectorAll('.barra-overlay');
  BARRAS_OVERLAY.forEach(overlay => {
    if (!overlay) return;
    const BOTONES_DENTRO_BARRA_OVERLAY = overlay.querySelectorAll('.btn');
    const TEXTO_BOTONES_DENTRO_BARRA_OVERLAY = overlay.querySelectorAll('span:not(.dropdown-item span)');

    // siempre activa texto antes de ocultarlo para tomar tamaño total, no solo del icono
    TEXTO_BOTONES_DENTRO_BARRA_OVERLAY.forEach(span => {
      if (span && span.style.display !== 'inline') span.style.display = 'inline';
    });

    const overlayWidth = Math.floor(overlay.offsetWidth);
    let botonesWidth = 0;

    BOTONES_DENTRO_BARRA_OVERLAY.forEach(button => {
      if (!button) return;
      const rect = button.getBoundingClientRect();
      botonesWidth += Math.floor(rect.width) + 8; // Convertir a entero usando Math.floor() junto a 8px extra para omitir que sea justo el tamaño
    });

    const ocultar = botonesWidth >= overlayWidth;
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