import { channelsList } from "../channelManager.js";

const UNKNOWN_COUNTRY_VALUE = "Desconocido";
const UNDEFINED_CATEGORY_VALUE = "undefined";

/** @type {number} Generation counter — incremented when channelsList changes shape */
let _generation = -1;
/** @type {Object} Snapshot of channelsList used to detect changes */
let _channelsListRef = null;
/** @type {ReturnType<typeof buildRelations>|null} Cached relation maps */
let _cachedRelations = null;

/**
 * Builds country-category relationships at runtime to avoid initialization cycles.
 * Caches the result and invalidates only when channelsList changes.
 * @returns {{
 *   categoriesByCountryMap: Map<string, Set<string>>,
 *   countriesByCategoryMap: Map<string, Set<string>>,
 *   allCategories: Set<string>,
 *   allCountries: Set<string>
 * }}
 */
function buildRelations() {
    const currentKeys = channelsList ? Object.keys(channelsList) : [];
    const currentLength = currentKeys.length;

    // Invalidate cache if channelsList reference changed or length differs
    if (_cachedRelations && _channelsListRef === channelsList && _generation === currentLength) {
        return _cachedRelations;
    }

    _channelsListRef = channelsList;
    _generation = currentLength;

    const categoriesByCountryMap = new Map();
    const countriesByCategoryMap = new Map();
    const channels = channelsList ? Object.values(channelsList) : [];

    for (const channel of channels) {
        const countryCode = channel?.country?.trim()
            ? channel.country.toLowerCase()
            : UNKNOWN_COUNTRY_VALUE;
        const category = channel?.category?.trim()
            ? channel.category.toLowerCase()
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

    _cachedRelations = {
        categoriesByCountryMap,
        countriesByCategoryMap,
        allCategories: new Set(countriesByCategoryMap.keys()),
        allCountries: new Set(categoriesByCountryMap.keys())
    };

    return _cachedRelations;
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
