/**
 * Hides text in overlay buttons if the content exceeds the container size.
 * Performance: each overlay is processed in two separate phases to avoid layout
 * thrashing - all DOM reads happen before any style writes within each overlay.
 * @param {HTMLElement} [container] - Optional container to scope the query (avoids full DOM scan).
 * @returns {void}
 */
export const hideOverlayButtonText = (container) => {
    const root = (container instanceof HTMLElement) ? container : document;
    const overlays = root.querySelectorAll('.barra-overlay');
    if (!overlays.length) return;
    overlays.forEach(overlay => {
        const textSpans = Array.from(overlay.querySelectorAll('span:not(.dropdown-item span)'))
            .filter(span => span.parentElement?.offsetParent !== null);
        textSpans.forEach(span => { span.style.display = 'inline'; });
        const ow = overlay.clientWidth;
        const cw = overlay.scrollWidth;
        const oh = overlay.clientHeight;
        const base = Array.from(overlay.querySelectorAll('button, a, div')).find(el => el.offsetParent !== null);
        const bh = base ? Math.floor(base.getBoundingClientRect().height) : oh;
        const hide = (cw - ow) > 2 || (oh - bh) > 8;
        textSpans.forEach(span => { span.style.display = hide ? 'none' : 'inline'; });
    });
}

