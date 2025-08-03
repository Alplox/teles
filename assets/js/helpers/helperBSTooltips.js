export const activarTooltipsBootstrap = () => {
    if (typeof window.bootstrap === 'undefined' || !window.bootstrap.Tooltip) return;
    const tooltipExistentes = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    tooltipExistentes.forEach(tooltip => {
        if (tooltip) new bootstrap.Tooltip(tooltip);
    });
}

export const removerTooltipsBootstrap = () => {
    if (typeof window.bootstrap === 'undefined' || !window.bootstrap.Tooltip) return;
    const tooltipExistentes = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    tooltipExistentes.forEach(tooltip => {
        if (!tooltip) return;
        const tooltipInstance = bootstrap.Tooltip.getInstance(tooltip);
        if (tooltipInstance) tooltipInstance.dispose();
    });
}