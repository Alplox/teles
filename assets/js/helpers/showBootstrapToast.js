import { AUDIO_SUCCESS, AUDIO_FAIL, AUDIO_WARNING } from "../constants/index.js";
import { playAudio } from "../utils/index.js";

const VARIANT_CONFIG = {
    success: { classes: ['bg-success', 'text-white'], icon: 'bi-check-circle' },
    warning: { classes: ['bg-warning', 'text-dark'], icon: 'bi-exclamation-circle' },
    danger: { classes: ['bg-danger', 'text-white'], icon: 'bi-x-circle' },
    info: { classes: ['bg-info', 'text-dark'], icon: 'bi-info-circle' },
    primary: { classes: ['bg-primary', 'text-white'], icon: 'bi-info-circle' },
    secondary: { classes: ['bg-secondary', 'text-white'], icon: 'bi-info-circle' }
};

const ERROR_HELP_MESSAGE = 'Si el error persiste tras recargar, prueba borrar tu almacenamiento local desde el panel "Personalización" o borrando la caché del navegador.';
const DEFAULT_TOAST_OPTIONS = {
    title: '',
    body: '',
    type: 'secondary',
    autohide: true,
    delay: 6500,
    showReloadOnError: false,
    allowHtml: false
};

/**
 * Muestra un toast de Bootstrap con soporte para título y cuerpo estructurado.
 * @param {Object} options - Configuración del toast.
 * @param {string} options.title - Título del toast.
 * @param {string} options.body - Cuerpo del toast.
 * @param {string} options.type - Variante del toast.
 * @param {boolean} options.autohide - Autocierre del toast.
 * @param {number} options.delay - Delay en ms.
 * @param {boolean} options.showReloadOnError - Mostrar bloque de ayuda en caso de error.
 * @param {boolean} options.allowHtml - Permitir HTML en el cuerpo del toast.
 * @returns {void}
 * 
 * @example
 * showToast({
 *     title: 'Título',
 *     body: 'Cuerpo',
 *     type: 'success',
 *     autohide: true,
 *     delay: 3500,
 *     showReloadOnError: true,
 *     allowHtml: false
 * });
 * 
 * @default
 * title: ''
 * body: ''
 * type: 'secondary'
 * autohide: true
 * delay: 3500
 * showReloadOnError: false
 * allowHtml: false
 */
export function showToast(options = {}) {
    const TOAST_CONTAINER = document.querySelector('#toast-container');
    if (!TOAST_CONTAINER) {
        console.warn('[teles] The toast container was not found.');
        return;
    }

    const TOAST_OPTIONS = { ...DEFAULT_TOAST_OPTIONS, ...options };
    const TOAST_VARIANT = VARIANT_CONFIG[TOAST_OPTIONS.type] ? TOAST_OPTIONS.type : 'secondary';
    const TOAST_CONFIG_FOR_VARIANT = VARIANT_CONFIG[TOAST_VARIANT];

    const TOAST_DIV = document.createElement('div');
    TOAST_DIV.setAttribute('role', 'alert');
    TOAST_DIV.setAttribute('aria-live', 'assertive');
    TOAST_DIV.setAttribute('aria-atomic', 'true');
    TOAST_DIV.classList.add('toast', 'd-flex', 'align-items-center', 'border-0');
    TOAST_DIV.classList.add(...TOAST_CONFIG_FOR_VARIANT.classes);

    const TOAST_BODY = document.createElement('div');
    TOAST_BODY.classList.add('toast-body', 'd-flex', 'align-items-start', 'gap-2');

    const ICON_WRAPPER = document.createElement('span');
    ICON_WRAPPER.classList.add('d-inline-flex', 'align-items-center', 'justify-content-center', 'fs-5');
    const ICON_ELEMENT = document.createElement('i');
    ICON_ELEMENT.classList.add('bi', TOAST_CONFIG_FOR_VARIANT.icon);
    ICON_ELEMENT.setAttribute('aria-hidden', 'true');
    ICON_WRAPPER.append(ICON_ELEMENT);

    const CONTENT_STACK = document.createElement('div');
    CONTENT_STACK.classList.add('flex-grow-1', 'd-flex', 'flex-column', 'gap-1', 'text-break');

    if (TOAST_OPTIONS.title) {
        const TITLE_ELEMENT = document.createElement('strong');
        TITLE_ELEMENT.textContent = TOAST_OPTIONS.title;
        CONTENT_STACK.append(TITLE_ELEMENT);
    }

    if (TOAST_OPTIONS.body) {
        const BODY_ELEMENT = document.createElement('p');
        BODY_ELEMENT.classList.add('mb-0');
        if (TOAST_OPTIONS.allowHtml) {
            BODY_ELEMENT.innerHTML = TOAST_OPTIONS.body;
        } else {
            BODY_ELEMENT.textContent = TOAST_OPTIONS.body;
        }
        CONTENT_STACK.append(BODY_ELEMENT);
    }

    if (TOAST_OPTIONS.showReloadOnError) {
        CONTENT_STACK.append(createBlockHelp());
    }

    TOAST_BODY.append(ICON_WRAPPER, CONTENT_STACK);

    const TOAST_BOTON_CERRAR = document.createElement('button');
    TOAST_BOTON_CERRAR.setAttribute('type', 'button');
    TOAST_BOTON_CERRAR.setAttribute('data-bs-dismiss', 'toast');
    TOAST_BOTON_CERRAR.setAttribute('aria-label', 'Close');
    TOAST_BOTON_CERRAR.classList.add('btn-close', 'text-white', 'me-2', 'm-auto');
    TOAST_BOTON_CERRAR.addEventListener('click', () => {
        TOAST_DIV.remove();
    });

    TOAST_DIV.append(TOAST_BODY);
    TOAST_DIV.append(TOAST_BOTON_CERRAR);
    TOAST_CONTAINER.append(TOAST_DIV);

    if (typeof bootstrap === 'undefined' || !bootstrap.Toast) {
        console.warn('[teles] Bootstrap Toast is not available.');
        return;
    }

    const BOOTSTRAP_TOAST = new bootstrap.Toast(TOAST_DIV, { delay: Number(TOAST_OPTIONS.delay), autohide: TOAST_OPTIONS.autohide });
    BOOTSTRAP_TOAST.show();
    if (TOAST_VARIANT === 'success') playAudio(AUDIO_SUCCESS);
    if (TOAST_VARIANT === 'danger') playAudio(AUDIO_FAIL);
    if (TOAST_VARIANT === 'warning') playAudio(AUDIO_WARNING);
}

const createBlockHelp = () => {
    const BLOCK_HELP = document.createElement('div');
    BLOCK_HELP.classList.add('mt-2', 'pt-2', 'border-top', 'border-white', 'border-opacity-25', 'd-flex', 'flex-column', 'gap-2');

    const TEXT_HELP = document.createElement('p');
    TEXT_HELP.classList.add('mb-0', 'small', 'fw-medium');
    TEXT_HELP.textContent = ERROR_HELP_MESSAGE;

    const BUTTON_RELOAD = document.createElement('button');
    BUTTON_RELOAD.setAttribute('type', 'button');
    BUTTON_RELOAD.classList.add('btn', 'btn-light', 'rounded-pill', 'btn-sm', 'w-100', 'border-light', 'mt-2');
    BUTTON_RELOAD.innerHTML = 'Pulsa para recargar <i class="bi bi-arrow-clockwise"></i>';
    BUTTON_RELOAD.addEventListener('click', () => {
        window.location.reload();
    });

    BLOCK_HELP.append(TEXT_HELP, BUTTON_RELOAD);
    return BLOCK_HELP;
};