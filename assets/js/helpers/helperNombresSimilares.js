export function sonNombresSimilares(nombre1, nombre2) {
    const nombre1Lower = nombre1.toLowerCase();
    const nombre2Lower = nombre2.toLowerCase();
    return nombre1Lower.includes(nombre2Lower) || nombre2Lower.includes(nombre1Lower);
}