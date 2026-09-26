/**
 * Hides text in overlay buttons if the content exceeds the container size.
 *
 * Pass a container to scope the query; without it this scans the whole document
 * on every channel add/remove. Layout reads are batched per overlay to avoid
 * read/write thrashing, and the whole measurement is skipped when the text is
 * already in the state we would leave it in.
 *
 * @param {HTMLElement} [container]
 * @returns {void}
 */
export const hideOverlayButtonText = (container) => {
    const root = (container instanceof HTMLElement) ? container : document;
    const overlays = root.querySelectorAll('.barra-overlay');
    if (!overlays.length) return;

    overlays.forEach(overlay => {
        const textSpans = Array.from(overlay.querySelectorAll('span:not(.dropdown-item span)'))
            .filter(span => span.parentElement?.offsetParent !== null);
        if (!textSpans.length) return;

        const cached = overlay._overlayTextState;
        const allShown = textSpans.every(span => span.style.display !== 'none');
        if (cached !== undefined && cached === allShown) return;

        textSpans.forEach(span => { span.style.display = 'inline'; });

        // Measurements, back to back.
        const ow = overlay.clientWidth;
        const cw = overlay.scrollWidth;
        const oh = overlay.clientHeight;
        const base = Array.from(overlay.querySelectorAll('button, a, div')).find(el => el.offsetParent !== null);
        const bh = base ? Math.floor(base.getBoundingClientRect().height) : oh;
        const hide = (cw - ow) > 2 || (oh - bh) > 8;

        textSpans.forEach(span => { span.style.display = hide ? 'none' : 'inline'; });
        overlay._overlayTextState = hide;
    });
}
