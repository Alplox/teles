import { CSS_CLASS_BUTTON_PRIMARY } from "../constants/index.js";
import {
  getAllowedCategoriesByCountry,
  getAllowedCountriesByCategory
} from "./filterRelations.js";

/** @type {string} Message shown when an option is unavailable for the current filter combination */
const UNAVAILABLE_MESSAGE = "No disponible para la combinación seleccionada";

/** @type {Object.<string, function(string): string>} Menu selectors by filter type */
const MENU_SELECTORS = {
  country: prefix => `#${prefix}-collapse-botones-listado-filtro-paises .dropdown-menu`,
  category: prefix => `#${prefix}-collapse-botones-listado-filtro-categorias .dropdown-menu`
};

/**
 * Returns the dropdown menu element for the specified filter type within a container prefix.
 * @param {"country"|"category"} filterType - Identifier of the filter to retrieve.
 * @param {string} prefix - Container prefix (e.g., modal-canales).
 * @returns {HTMLElement|null} The dropdown <ul> node or null if not found.
 */
const getFilterMenu = (filterType, prefix) => {
  if (!prefix || !MENU_SELECTORS[filterType]) return null;
  return document.querySelector(MENU_SELECTORS[filterType](prefix));
};

/**
 * Applies or removes the disabled state of a dropdown option.
 * @param {HTMLLabelElement} label - Label element associated with the radio input.
 * @param {boolean} shouldDisable - Whether to disable (true) or enable (false) the option.
 * @returns {boolean} True if the option was selected and got disabled.
 */
const applyDisabledState = (label, shouldDisable) => {
  if (!label) return false;

  const relatedInput = document.getElementById(label.getAttribute("for"));
  if (!relatedInput) return false;

  const wasSelected = relatedInput.checked;

  // Store original title for later restoration
  if (!label.dataset.originalTitle) {
    label.dataset.originalTitle = label.getAttribute("title") ?? "";
  }

  if (shouldDisable) {
    relatedInput.checked = false;
    relatedInput.disabled = true;
    label.classList.add("disabled", "opacity-50");
    label.setAttribute("aria-disabled", "true");
    label.title = UNAVAILABLE_MESSAGE;
    label.classList.remove(CSS_CLASS_BUTTON_PRIMARY);

    if (!label.classList.contains("btn-outline-secondary")) {
      label.classList.add("btn-outline-secondary");
    }

    return wasSelected;
  }

  // Enable the option
  relatedInput.disabled = false;
  label.classList.remove("disabled", "opacity-50");
  label.removeAttribute("aria-disabled");

  if (label.dataset?.originalTitle) {
    label.title = label.dataset.originalTitle;
  } else {
    label.removeAttribute("title");
  }

  return false;
};

/**
 * Forces selection of a valid option (preferably "all") in the specified menu.
 * @param {HTMLElement} menu - Dropdown menu to apply the fallback selection to.
 * @param {string} dataAttribute - Dataset attribute to evaluate ("country" | "category").
 * @returns {void}
 */
const selectFallbackOption = (menu, dataAttribute) => {
  if (!menu) return;

  const fallbackLabel = menu.querySelector(`label[data-${dataAttribute}="all"]`)
    ?? menu.querySelector(`label[data-${dataAttribute}]:not(.disabled)`);

  if (!fallbackLabel) return;

  const fallbackInput = document.getElementById(fallbackLabel.getAttribute("for"));
  if (!fallbackInput || fallbackInput.checked) return;

  fallbackInput.checked = true;
  fallbackInput.dispatchEvent(new Event("change", { bubbles: true }));
};

/**
 * Synchronizes category filter options based on the selected country.
 * Disables categories that are incompatible with the selected country
 * and forces a fallback selection if the current selection becomes invalid.
 * @param {string} prefix - Container prefix (modal-canales, single-view, etc.).
 * @param {string} selectedCountryCode - ISO country code in lowercase or "Desconocido".
 * @returns {void}
 */
export const syncCategoriesWithCountry = (prefix, selectedCountryCode) => {
  const categoriesMenu = getFilterMenu("category", prefix);
  if (!categoriesMenu) return;

  const allowedCategories = getAllowedCategoriesByCountry(selectedCountryCode);
  let requiresFallback = false;

  categoriesMenu.querySelectorAll("label[data-category]").forEach(label => {
    const categoryValue = label.dataset.category ?? "all";
    const shouldDisable = categoryValue !== "all" && !allowedCategories.has(categoryValue);

    if (applyDisabledState(label, shouldDisable) && shouldDisable) {
      requiresFallback = true;
    }
  });

  if (requiresFallback) {
    selectFallbackOption(categoriesMenu, "category");
  }
};

/**
 * Synchronizes country filter options based on the selected category.
 * Disables countries that are incompatible with the selected category
 * and forces a fallback selection if the current selection becomes invalid.
 * @param {string} prefix - Container prefix (modal-canales, single-view, etc.).
 * @param {string} selectedCategory - Category name in lowercase or "undefined".
 * @returns {void}
 */
export const syncCountriesWithCategory = (prefix, selectedCategory) => {
  const countriesMenu = getFilterMenu("country", prefix);
  if (!countriesMenu) return;

  const allowedCountries = getAllowedCountriesByCategory(selectedCategory);
  let requiresFallback = false;

  countriesMenu.querySelectorAll("label[data-country]").forEach(label => {
    const countryValue = label.dataset.country ?? "all";
    const shouldDisable = countryValue !== "all" && !allowedCountries.has(countryValue);

    if (applyDisabledState(label, shouldDisable) && shouldDisable) {
      requiresFallback = true;
    }
  });

  if (requiresFallback) {
    selectFallbackOption(countriesMenu, "country");
  }
};
