export const initializeBootstrapTooltips = () => {
    if (typeof window.bootstrap === 'undefined' || !window.bootstrap.Tooltip) return;
    const existingTooltips = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    existingTooltips.forEach(tooltip => {
        if (!tooltip) return;
        const instance = bootstrap.Tooltip.getInstance(tooltip);
        if (!instance) new bootstrap.Tooltip(tooltip);
    });
}

export const disposeBootstrapTooltips = () => {
    if (typeof window.bootstrap === 'undefined' || !window.bootstrap.Tooltip) return;
    const existingTooltips = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    existingTooltips.forEach(tooltip => {
        if (!tooltip) return;
        const tooltipInstance = bootstrap.Tooltip.getInstance(tooltip);
        tooltipInstance?.dispose();
    });
}