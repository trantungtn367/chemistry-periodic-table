import { CATEGORY_LABELS } from "./categories.js";

const state = {
    query: "",
    category: "all",
    phase: "all",
    block: "all",
};

const refs = {};
let lastQuery = "";

const MESSAGE_NO_MATCH = "Không tìm thấy nguyên tố phù hợp.";
const MESSAGE_FILTERED_OUT = "Không có nguyên tố phù hợp với bộ lọc hiện tại.";

function prefersReducedMotion() {
    return typeof window !== "undefined" && window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function getCells() {
    return refs.table ? [...refs.table.querySelectorAll(".element")] : [];
}

function computeMatches(cells, query) {
    const normalized = query.toLowerCase();
    const numericQuery = Number(query);

    const numberExact = Number.isInteger(numericQuery)
        ? cells.filter((cell) => Number(cell.dataset.number) === numericQuery)
        : [];
    if (numberExact.length > 0) {
        return { exact: numberExact };
    }

    const symbolExact = cells.filter((cell) => cell.dataset.symbol.toLowerCase() === normalized);
    if (symbolExact.length > 0) {
        return { exact: symbolExact };
    }

    const nameExact = cells.filter((cell) => cell.dataset.name.toLowerCase() === normalized);
    if (nameExact.length > 0) {
        return { exact: nameExact };
    }

    return { contains: cells.filter((cell) => cell.dataset.name.toLowerCase().includes(normalized)) };
}

function categoryMatches(className, rawCategory) {
    if (className === "all") {
        return true;
    }
    const entry = CATEGORY_LABELS.find((item) => item.className === className);
    return entry ? entry.categories.includes(rawCategory) : false;
}

export function applyFilters() {
    const cells = getCells();
    const query = state.query;

    let exactSet = [];
    let containsSet = [];
    let hasExact = false;
    if (query) {
        const result = computeMatches(cells, query);
        hasExact = Boolean(result.exact);
        exactSet = result.exact || [];
        containsSet = result.contains || [];
    }

    let visibleCount = 0;
    let exactCount = 0;
    let exactCell = null;
    const queryMatchCount = hasExact ? exactSet.length : containsSet.length;

    cells.forEach((cell) => {
        const matchesCategory = categoryMatches(state.category, cell.dataset.category);
        const matchesPhase = state.phase === "all" || cell.dataset.phase === state.phase;
        const matchesBlock = state.block === "all" || cell.dataset.block === state.block;

        let queryMatch = true;
        let queryExact = false;
        if (query) {
            if (hasExact) {
                queryMatch = exactSet.includes(cell);
                queryExact = queryMatch;
            } else {
                queryMatch = containsSet.includes(cell);
            }
        }

        const visible = matchesCategory && matchesPhase && matchesBlock && queryMatch;
        if (queryMatch && queryExact) {
            exactCount += 1;
            exactCell = cell;
        }

        cell.classList.toggle("is-dimmed", !visible);
        cell.classList.toggle("is-highlighted", visible && queryExact);
        cell.classList.toggle("is-filter-match", visible && queryMatch && !queryExact);

        if (visible) {
            visibleCount += 1;
        }
    });

    if (refs.noResult) {
        let show = false;
        if (query !== "") {
            if (queryMatchCount === 0) {
                refs.noResult.textContent = MESSAGE_NO_MATCH;
                show = true;
            } else if (visibleCount === 0) {
                refs.noResult.textContent = MESSAGE_FILTERED_OUT;
                show = true;
            }
        }
        refs.noResult.hidden = !show;
    }

    if (query && query !== lastQuery && exactCount === 1 && exactCell) {
        exactCell.scrollIntoView({
            behavior: prefersReducedMotion() ? "auto" : "smooth",
            block: "center",
            inline: "center",
        });
    }
    lastQuery = query;

    updateResetButton();
}

export function setCategoryFilter(className) {
    state.category = state.category === className ? "all" : className;
    updateLegendChips();
    applyFilters();
}

function updateLegendChips() {
    if (!refs.legend) {
        return;
    }
    refs.legend.querySelectorAll(".legend__chip").forEach((chip) => {
        const active = chip.dataset.categoryClass === state.category;
        chip.classList.toggle("is-active", active);
        chip.setAttribute("aria-pressed", String(active));
    });
}

function updateResetButton() {
    const isActive = state.query !== "" || state.category !== "all" || state.phase !== "all" || state.block !== "all";
    refs.resetButton.disabled = !isActive;
}

function resetFilters() {
    state.query = "";
    state.category = "all";
    state.phase = "all";
    state.block = "all";
    lastQuery = "";

    refs.searchInput.value = "";
    refs.phaseSelect.value = "all";
    refs.blockSelect.value = "all";
    updateLegendChips();
    applyFilters();
}

function wireToolbar() {
    refs.searchInput = document.getElementById("search-input");
    refs.phaseSelect = document.getElementById("phase-filter");
    refs.blockSelect = document.getElementById("block-filter");
    refs.resetButton = document.getElementById("reset-filters");
    refs.noResult = document.getElementById("search-no-result");
    refs.table = document.getElementById("table");
    refs.legend = document.getElementById("legend");

    refs.searchInput.addEventListener("input", () => {
        state.query = refs.searchInput.value.trim();
        applyFilters();
    });
    refs.phaseSelect.addEventListener("change", () => {
        state.phase = refs.phaseSelect.value;
        applyFilters();
    });
    refs.blockSelect.addEventListener("change", () => {
        state.block = refs.blockSelect.value;
        applyFilters();
    });
    refs.resetButton.addEventListener("click", resetFilters);
}

wireToolbar();
