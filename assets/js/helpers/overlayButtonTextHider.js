/**
 * Hides text in overlay buttons if the content exceeds the container size.
 * @returns {void}
 */
export const hideOverlayButtonText = () => {
    const OVERLAY_BARS = document.querySelectorAll('.barra-overlay');
    OVERLAY_BARS.forEach(overlay => {
        if (!overlay) return;

        // Only target spans within visible parents to avoid ghost calculations
        const TEXT_IN_OVERLAY = Array.from(overlay.querySelectorAll('span:not(.dropdown-item span)'))
            .filter(span => span.parentElement && span.parentElement.offsetParent !== null);

        // Always show text initially to calculate total size, not just the icon
        TEXT_IN_OVERLAY.forEach(span => {
            if (span && span.style.display !== 'inline') span.style.display = 'inline';
        });

        const overlayWidth = Math.floor(overlay.clientWidth);
        const contentWidth = Math.floor(overlay.scrollWidth);
        const overlayHeight = Math.floor(overlay.clientHeight);
        const safetyMarginPx = 2; // Prevents false positives when measurements are nearly identical
        const horizontalOverflow = (contentWidth - overlayWidth) > safetyMarginPx;
        const wrapMarginPx = 8; // Tolerance for paddings/gaps before considering it wrapped

        // Detects if the bar occupies more than one line (wraps) by comparing its height vs base element height
        // Must use a VISIBLE element to get a valid height reference
        const firstVisibleInteractiveElement = Array.from(overlay.querySelectorAll('button, a, div'))
            .find(el => el.offsetParent !== null);

        const baseElementHeight = firstVisibleInteractiveElement
            ? Math.floor(firstVisibleInteractiveElement.getBoundingClientRect().height)
            : overlayHeight;

        const wrapActive = (overlayHeight - baseElementHeight) > wrapMarginPx;

        const shouldHide = horizontalOverflow || wrapActive;

        TEXT_IN_OVERLAY.forEach(span => {
            if (!span) return;
            if (shouldHide && span.style.display !== 'none') {
                span.style.display = 'none';
            } else if (!shouldHide && span.style.display !== 'inline') {
                span.style.display = 'inline';
            }
        });
    });
}
