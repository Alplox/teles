// Función para ocultar texto si el tamaño de los botones excede el tamaño del contenedor
export function ocultarTextoBotonesOverlay() {
  const overlays = document.querySelectorAll('div[data-canal]');
  overlays.forEach(overlay => {
    const buttons = overlay.querySelectorAll('.barra-overlay .btn');
    const spanTexts = overlay.querySelectorAll('.btn span');

    // siempre activa texto antes de ocultarlo para tomar tamaño total no solo del icono
    spanTexts.forEach(span => {
      span.style.display = 'inline';
    });

    let buttonsWidth = 0;
    buttons.forEach(button => {
      const rect = button.getBoundingClientRect();
      buttonsWidth += Math.floor(rect.width) + 8; // Convertir a entero usando Math.floor() junto a 8px extra para omitir que sea justo el tamaño
    });

    const overlayWidth = Math.floor(overlay.offsetWidth);

    if (buttonsWidth >= overlayWidth) {
      spanTexts.forEach(span => {
        span.style.display = 'none';
      });
    } else {
      spanTexts.forEach(span => {
        span.style.display = 'inline';
      });
    }
  });
}