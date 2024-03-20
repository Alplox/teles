const activarTooltipsBootstrap = () => {
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
    const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))
}

const removerTooltipsBootstrap = () => {
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
    tooltipTriggerList.forEach(tooltipTriggerEl => {
        const tooltipInstance = bootstrap.Tooltip.getInstance(tooltipTriggerEl);
        if (tooltipInstance) {
            tooltipInstance.dispose();
        }
    });
}