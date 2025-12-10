import { channelsList } from "../channelManager.js";

const UNKNOWN_COUNTRY_VALUE = "Desconocido";
const UNDEFINED_CATEGORY_VALUE = "undefined";

/**
 * Builds country-category relationships at runtime to avoid initialization cycles.
 * Always uses the most recent state of `channelsList`.
 * @returns {{
 *   categoriesByCountryMap: Map<string, Set<string>>,
 *   countriesByCategoryMap: Map<string, Set<string>>,
 *   allCategories: Set<string>,
 *   allCountries: Set<string>
 * }}
 */
function buildRelations() {
    const categoriesByCountryMap = new Map();
    const countriesByCategoryMap = new Map();
    const channels = channelsList ? Object.values(channelsList) : [];

    for (const channel of channels) {
        const countryCode = channel?.país?.trim()
            ? channel.país.toLowerCase()
            : UNKNOWN_COUNTRY_VALUE;
        const category = channel?.categoría?.trim()
            ? channel.categoría.toLowerCase()
            : UNDEFINED_CATEGORY_VALUE;

        if (!categoriesByCountryMap.has(countryCode)) {
            categoriesByCountryMap.set(countryCode, new Set());
        }
        categoriesByCountryMap.get(countryCode).add(category);

        if (!countriesByCategoryMap.has(category)) {
            countriesByCategoryMap.set(category, new Set());
        }
        countriesByCategoryMap.get(category).add(countryCode);
    }

    return {
        categoriesByCountryMap,
        countriesByCategoryMap,
        allCategories: new Set(countriesByCategoryMap.keys()),
        allCountries: new Set(categoriesByCountryMap.keys())
    };
}

/**
 * Returns the set of available categories for a given country.
 * @param {string} countryCode - Country ISO code in lowercase or "Desconocido".
 * @returns {Set<string>} Allowed categories for that country (or all if "all").
 */
export function getAllowedCategoriesByCountry(countryCode) {
    const { categoriesByCountryMap, allCategories } = buildRelations();
    if (!countryCode || countryCode === "all") {
        return allCategories;
    }
    return categoriesByCountryMap.get(countryCode) ?? new Set();
}

/**
 * Returns the set of countries where a given category exists.
 * @param {string} category - Category name in lowercase or "undefined".
 * @returns {Set<string>} Countries containing that category (or all if "all").
 */
export function getAllowedCountriesByCategory(category) {
    const { countriesByCategoryMap, allCountries } = buildRelations();
    if (!category || category === "all") {
        return allCountries;
    }
    return countriesByCategoryMap.get(category) ?? new Set();
}
