import { channelsList } from "../channelManager.js";
import {
    CSS_CLASS_BUTTON_PRIMARY,
    ID_PREFIX_CONTAINERS_CHANNELS,
    CATEGORIES_ICONS
} from "../constants/index.js";
import { filterChannelsByInput, showToast } from "./index.js";
import { syncCountriesWithCategory } from "./syncFilters.js";

/**
 * Creates and registers category filter buttons for all container prefixes.
 * Uses `channelsList` data to count channels per category and hooks up combined filtering
 * of text, country, and category via `filterChannelsByInput`.
 * @returns {void}
 */
export function createCategoryButtons() {
    try {
        const RAW_CATEGORIES = Object.values(channelsList).map(channel => {
            const categoryValue = channel?.categoría;
            if (!categoryValue || categoryValue === "") return "undefined";
            return `${categoryValue}`.toLowerCase();
        });

        const CHANNEL_COUNT_BY_CATEGORY = RAW_CATEGORIES.reduce((count, category) => {
            count[category] = (count[category] || 0) + 1;
            return count;
        }, {});

        const UNIQUE_CATEGORIES = [...new Set(RAW_CATEGORIES)]
            .filter(category => category && category !== "undefined")
            .sort((a, b) => a.localeCompare(b, "es", { sensitivity: "base" }));

        const CATEGORY_OPTIONS = [];

        const allIcon = CATEGORIES_ICONS.general ?? CATEGORIES_ICONS.undefined;
        CATEGORY_OPTIONS.push({
            value: "all",
            displayName: "Todas",
            badge: Object.keys(channelsList).length,
            icon: allIcon
        });

        for (const CATEGORY of UNIQUE_CATEGORIES) {
            const categoryName = CATEGORY.charAt(0).toUpperCase() + CATEGORY.slice(1);
            const channelCount = CHANNEL_COUNT_BY_CATEGORY[CATEGORY] || 0;
            const categoryIcon = CATEGORIES_ICONS[CATEGORY] ?? CATEGORIES_ICONS.undefined;
            CATEGORY_OPTIONS.push({
                value: CATEGORY,
                displayName: categoryName,
                badge: channelCount,
                icon: categoryIcon
            });
        }

        if (CHANNEL_COUNT_BY_CATEGORY["undefined"]) {
            const undefinedCount = CHANNEL_COUNT_BY_CATEGORY["undefined"] || 0;
            CATEGORY_OPTIONS.push({
                value: "undefined",
                displayName: "Sin categoría",
                badge: undefinedCount,
                icon: CATEGORIES_ICONS.undefined
            });
        }

        for (const PREFIX of ID_PREFIX_CONTAINERS_CHANNELS) {
            const categoryFilterContainer = document.querySelector(
                `#${PREFIX}-collapse-botones-listado-filtro-categorias`
            );
            if (!categoryFilterContainer) continue;

            const dropdownWrapper = document.createElement("div");
            dropdownWrapper.classList.add("btn-group", "dropdown");

            const toggleButton = document.createElement("button");
            toggleButton.setAttribute("type", "button");
            toggleButton.classList.add("btn", "btn-sm", "btn-dark", "dropdown-toggle", "rounded-pill", "text-truncate", "text-start");
            toggleButton.dataset.bsToggle = "dropdown";
            toggleButton.setAttribute("aria-expanded", "false");
            toggleButton.innerHTML = `<i class="bi bi-grid-3x3-gap"></i> Categoría: Todas`;

            const updateToggleState = (hasActiveFilter) => {
                if (hasActiveFilter) {
                    toggleButton.classList.remove("btn-dark");
                    if (!toggleButton.classList.contains(CSS_CLASS_BUTTON_PRIMARY)) {
                        toggleButton.classList.add(CSS_CLASS_BUTTON_PRIMARY);
                    }
                } else {
                    toggleButton.classList.remove(CSS_CLASS_BUTTON_PRIMARY);
                    if (!toggleButton.classList.contains("btn-dark")) {
                        toggleButton.classList.add("btn-dark");
                    }
                }
            };

            const dropdownMenu = document.createElement("ul");
            dropdownMenu.classList.add("dropdown-menu", "p-2", "rounded-4", "mh-dropdown-filtros");

            const buildInputId = value => `${PREFIX}-filtro-categoria-${value}`.replace(/\s+/g, "-").toLowerCase();

            const clearSelection = () => {
                dropdownMenu.querySelectorAll("label[data-category]").forEach(label => {
                    label.classList.remove(CSS_CLASS_BUTTON_PRIMARY);
                    if (!label.classList.contains("btn-outline-secondary")) {
                        label.classList.add("btn-outline-secondary");
                    }
                });
            };

            const activateLabel = label => {
                if (!label) return;
                if (label.dataset.category === "all") {
                    label.classList.add(CSS_CLASS_BUTTON_PRIMARY);
                    label.classList.remove("btn-outline-secondary");
                    toggleButton.innerHTML = `<i class="bi bi-grid-3x3-gap"></i> Categoría: Todas`;
                    updateToggleState(false);
                } else {
                    label.classList.replace("btn-outline-secondary", CSS_CLASS_BUTTON_PRIMARY);
                    const selectedName = label.querySelector(".flex-grow-1")?.textContent?.trim() || "Categoría";
                    toggleButton.innerHTML = `<i class="bi bi-grid-3x3-gap"></i> Categoría: ${selectedName}`;
                    updateToggleState(true);
                }
            };

            const handleFilterChange = selectedLabel => {
                try {
                    const channelButtonsContainer = document.querySelector(
                        `#${PREFIX}-channels-buttons-container`
                    );
                    const filterInput = document.querySelector(`#${PREFIX}-input-filtro`);
                    const searchValue = filterInput?.value ?? "";
                    const selectedCategory = selectedLabel?.dataset.category ?? "all";

                    clearSelection();
                    activateLabel(selectedLabel);
                    syncCountriesWithCategory(PREFIX, selectedCategory);
                    filterChannelsByInput(searchValue, channelButtonsContainer);
                } catch (error) {
                    console.error(`Error activating category filter. ${error}`);
                    clearSelection();
                    const allLabel = dropdownMenu.querySelector('label[data-category="all"]');
                    if (allLabel) {
                        allLabel.previousElementSibling.checked = true;
                        activateLabel(allLabel);
                        syncCountriesWithCategory(PREFIX, "all");
                    }
                    showToast({
                        title: 'Ha ocurrido un error al intentar activar filtro categoría.',
                        body: `Error: ${error}`,
                        type: 'danger'
                    });
                }
            };

            for (const option of CATEGORY_OPTIONS) {
                const li = document.createElement("li");
                li.classList.add("mb-1");

                const inputId = buildInputId(option.value);
                const input = document.createElement("input");
                input.setAttribute("type", "radio");
                input.classList.add("btn-check");
                input.name = `${PREFIX}-filtro-categoria`;
                input.id = inputId;
                input.autocomplete = "off";
                input.dataset.category = option.value;

                const label = document.createElement("label");
                label.classList.add(
                    "btn",
                    "btn-sm",
                    "btn-outline-indigo",
                    "w-100",
                    "d-flex",
                    "justify-content-between",
                    "align-items-center",
                    "text-start",
                    "gap-2",
                    "rounded-3"
                );
                label.setAttribute("for", inputId);
                label.dataset.category = option.value;
                label.innerHTML = `
                    <span class="flex-shrink-0">${option.icon}</span>
                    <span class="flex-grow-1 text-wrap">${option.displayName}</span>
                    <span class="badge bg-secondary">${option.badge}</span>
                `;

                if (option.value === "all") {
                    input.checked = true;
                    label.classList.add(CSS_CLASS_BUTTON_PRIMARY);
                } else {
                    label.classList.add("btn-outline-secondary");
                }

                input.addEventListener("change", () => handleFilterChange(label));

                li.append(input, label);
                dropdownMenu.append(li);
            }

            const lastElement = dropdownMenu.lastElementChild;
            if (lastElement) {
                lastElement.classList.remove("mb-1");
            }

            dropdownWrapper.append(toggleButton, dropdownMenu);
            categoryFilterContainer.innerHTML = "";
            categoryFilterContainer.append(dropdownWrapper);
        }
    } catch (error) {
        console.error(`Error creating category filter buttons. ${error}`);
        showToast({
            title: 'Ha ocurrido un error durante la creación de botones para filtrado por categoría.',
            body: `Error: ${error}`,
            type: 'danger',
            autohide: false,
            delay: 0,
            showReloadOnError: true
        });

        // Helper to insert error div
        const insertErrorDiv = (err, msg) => {
            const div = document.createElement('div');
            div.className = 'alert alert-danger';
            div.textContent = `${msg}: ${err}`;
            return div;
        };

        for (const PREFIX of ID_PREFIX_CONTAINERS_CHANNELS) {
            const channelButtonsContainer = document.querySelector(`#${PREFIX}-channels-buttons-container`);
            if (channelButtonsContainer) {
                channelButtonsContainer.insertAdjacentElement(
                    "afterend",
                    insertErrorDiv(
                        error,
                        "Ha ocurrido un error durante la creación de botones para filtro categorías"
                    )
                );
            }
        }
    }
}
