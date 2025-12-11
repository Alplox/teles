export const formatDate = (date) => {
    if (!date) return 'sin registro';
    try {
        return new Date(date).toLocaleString('es-CL', { dateStyle: 'short', timeStyle: 'short' });
    } catch {
        return `error al formatear fecha ${date}`;
    }
}