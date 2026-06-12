export const formatDate = (date) => {
    if (!date) return 'sin registro';
    try {
        return new Date(date).toLocaleString('es-CL', { dateStyle: 'short', timeStyle: 'short' });
    } catch (e) {
        console.warn('[teles] Error formatting date:', date, e);
        return `error al formatear fecha ${date}`;
    }
}