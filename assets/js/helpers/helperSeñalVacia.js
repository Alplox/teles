import { listaCanales } from "../canalesData.js";
import { LS_KEY_CHANNEL_SIGNAL_PREFERENCE } from "../constants/localStorageKeys.js";
import { revisarSeñalesVacias, mostrarToast } from "../helpers/index.js";

export function borraPreferenciaSeñalInvalida() {
    let lsPreferenciasSeñalCanales = JSON.parse(localStorage.getItem(LS_KEY_CHANNEL_SIGNAL_PREFERENCE)) || {};
    if (Object.keys(lsPreferenciasSeñalCanales).length !== 0) {
        for (const idCanalGuardado in lsPreferenciasSeñalCanales) {
            let tipoSeñalGuardada = Object.keys(lsPreferenciasSeñalCanales[idCanalGuardado])[0].toString();
            let valorIndexArraySeñal = Number(Object.values(lsPreferenciasSeñalCanales[idCanalGuardado]));

            if (!revisarSeñalesVacias(idCanalGuardado)) { // si no estan vacias
                if (tipoSeñalGuardada === 'iframe_url' || tipoSeñalGuardada === 'm3u8_url') {
                    if (listaCanales?.[idCanalGuardado]?.señales?.[tipoSeñalGuardada][valorIndexArraySeñal] === undefined) {
                        mostrarToast(`
                            Tú señal preferida para <span class="fw-bold">${idCanalGuardado}</span> (${tipoSeñalGuardada}[${valorIndexArraySeñal}]) 
                            dejo de estar disponible.<br><span class="fw-bold">Utilizará siguiente señal disponible</span>.`, 'warning', false);
                        delete lsPreferenciasSeñalCanales[idCanalGuardado];
                        localStorage.setItem(LS_KEY_CHANNEL_SIGNAL_PREFERENCE, JSON.stringify(lsPreferenciasSeñalCanales));
                    }
                } else {
                    if (listaCanales?.[idCanalGuardado]?.señales?.[tipoSeñalGuardada] === '') {
                        mostrarToast(`
                        Tú señal preferida para <span class="fw-bold">${idCanalGuardado}</span> (${tipoSeñalGuardada}[${valorIndexArraySeñal}]) 
                        dejo de estar disponible.<br><span class="fw-bold">Utilizará siguiente señal disponible</span>.`, 'warning', false);
                        delete lsPreferenciasSeñalCanales[idCanalGuardado];
                        localStorage.setItem(LS_KEY_CHANNEL_SIGNAL_PREFERENCE, JSON.stringify(lsPreferenciasSeñalCanales));
                    }
                }
            };
        }
    }
}