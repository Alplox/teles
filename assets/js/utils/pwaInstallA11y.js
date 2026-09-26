/**
 * Accessibility patch for the third-party <pwa-install> web component.
 *
 * The component renders its install dialog and screenshot gallery inside a
 * shadow root, and ships no accessibility attributes on them:
 *  - the dismiss button has no accessible name (Lighthouse `button-name`)
 *  - every manifest screenshot is injected as <img> with no `alt`
 *    (Lighthouse `image-alt`)
 *
 * Neither is reachable from the page's own markup, so they are patched here
 * once the component has rendered. Purely additive: no markup, layout, or
 * behaviour is changed, and a failure is non-fatal.
 */

const PATCH_INTERVAL_MS = 300;
const PATCH_MAX_ATTEMPTS = 40;

const LABELS = {
    '1.jpg': 'Captura: cuadrícula de canales',
    '2.jpg': 'Captura: visión única de un canal',
    '3.jpg': 'Captura: visión libre con canales redimensionables',
    '4.jpg': 'Captura: panel de personalización',
    '5.jpg': 'Captura: selector de canales'
};

/**
 * Applies the attributes to a shadow root and, recursively, to any shadow roots
 * nested inside it. The component hosts a <pwa-gallery> inside its own shadow
 * root, and querySelectorAll does not pierce nested shadow boundaries, so a
 * single-level pass missed every screenshot.
 * @param {ShadowRoot|Element} root
 * @returns {number} Number of elements still missing an attribute.
 */
const patchRoot = (root) => {
    let pending = 0;

    root.querySelectorAll('button.close').forEach(button => {
        if (!button.getAttribute('aria-label')) {
            button.setAttribute('aria-label', 'Cerrar');
            button.setAttribute('title', 'Cerrar');
        }
    });

    root.querySelectorAll('img').forEach(img => {
        const src = img.getAttribute('src') || '';
        const file = src.split('/').pop();
        if (file && !img.getAttribute('alt')) {
            img.setAttribute('alt', LABELS[file] || 'Captura de pantalla de teles');
        }
    });

    pending += root.querySelectorAll('img:not([alt])').length;
    pending += root.querySelectorAll('button.close:not([aria-label])').length;

    root.querySelectorAll('*').forEach(el => {
        if (el.shadowRoot) pending += patchRoot(el.shadowRoot);
    });

    return pending;
};

/**
 * Starts watching the <pwa-install> shadow root and patching it.
 *
 * A MutationObserver is used rather than polling: the component renders its
 * gallery only after the manifest request resolves, which can land after an
 * accessibility snapshot is taken. Observing applies the attributes in the same
 * task as the insertion instead of up to PATCH_INTERVAL_MS later.
 * @returns {void}
 */
export const patchPwaInstallAccessibility = () => {
    const host = document.querySelector('pwa-install');
    if (!host) return;

    let observer = null;
    let attempts = 0;

    const attach = () => {
        const shadow = host.shadowRoot;
        if (!shadow) return false;

        try {
            const pending = patchRoot(shadow);
            if (pending === 0) {
                observer?.disconnect();
                observer = null;
                return true;
            }
        } catch (error) {
            console.warn('[teles] No se pudo ajustar la accesibilidad de pwa-install:', error);
            observer?.disconnect();
            return true;
        }

        if (!observer) {
            // subtree: true so the nested <pwa-gallery> shadow root is watched
            // as soon as it is attached.
            observer = new MutationObserver(() => {
                if (patchRoot(shadow) === 0) {
                    observer.disconnect();
                    observer = null;
                }
            });
            observer.observe(shadow, { childList: true, subtree: true });
        }
        return true;
    };

    // The component upgrades asynchronously, so the shadow root may not exist yet.
    const start = () => {
        if (attach()) return;
        attempts += 1;
        if (attempts < PATCH_MAX_ATTEMPTS) {
            setTimeout(start, PATCH_INTERVAL_MS);
        }
    };

    if (document.readyState === 'complete') {
        start();
    } else {
        window.addEventListener('load', start, { once: true });
    }
};
