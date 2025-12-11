import { LS_KEY_BOOTSTRAP_COL_NUMBER, BOOTSTRAP_COL_NUMBER_DESKTOP, BOOTSTRAP_COL_NUMBER_MOBILE } from "../constants/index.js";

export const obtainNumberOfChannelsPerRow = () => {
    const storedValue = JSON.parse(localStorage.getItem(LS_KEY_BOOTSTRAP_COL_NUMBER));
    const defaultColNumber = isMobile.any ? BOOTSTRAP_COL_NUMBER_MOBILE : BOOTSTRAP_COL_NUMBER_DESKTOP;

    const parseColNumber = (value) => {
        const candidate = Number(value);
        const isValidBootstrapCol = Number.isInteger(candidate) && candidate > 0 && 12 % candidate === 0;
        return isValidBootstrapCol ? candidate : null;
    };

    const resolvedColNumber = parseColNumber(storedValue) ?? defaultColNumber;
    return Math.round(12 / resolvedColNumber);
}