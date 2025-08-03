import { listaCanales } from "../canalesData.js";

export function revisarSeñalesVacias(canalId) {
    const señales = listaCanales?.[canalId]?.señales;
    if (señales) {
        const todasLasSeñalesVacias = Object.values(señales).every(señal => {
            if (typeof señal === 'undefined' || señal === null) {
                return true;
            } else if (Array.isArray(señal)) {
                return señal.length < 1;
            } else if (typeof señal === 'string') {
                return señal.trim() === '';
            }
        });
        if (todasLasSeñalesVacias) console.error(`${canalId} tiene todas sus señales vacías`);
        return todasLasSeñalesVacias;
    }
    return true; // Si no esta atributo señales, se considera que todas están vacías
}