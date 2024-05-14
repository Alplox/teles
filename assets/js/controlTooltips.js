export const activarTooltipsBootstrap = () => {
    let tooltipExistentes = document.querySelectorAll('[data-bs-toggle="tooltip"]')
    tooltipExistentes.forEach(tooltip => {
        new bootstrap.Tooltip(tooltip);
    });
}

export const removerTooltipsBootstrap = () => {
    let tooltipExistentes = document.querySelectorAll('[data-bs-toggle="tooltip"]')
    tooltipExistentes.forEach(tooltip => {
        const tooltipInstance = bootstrap.Tooltip.getInstance(tooltip);
        if (tooltipInstance) tooltipInstance.dispose();
    });
}