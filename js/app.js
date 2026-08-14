import { CATEGORY_LABELS, getCategoryClass } from "./categories.js";
import { setupThemeToggle } from "./theme.js";
import { openElementDetails } from "./details.js";
import { setCategoryFilter, applyFilters } from "./filters.js";
import { setupLearn } from "./learn.js";

const ELEMENTS_URL = "data/elements.json";
const MAX_ATOMIC_NUMBER = 118;
const TABLE_BREAKPOINT_PX = 1025;

const errorMessage = document.getElementById("error-message");
const retryButton = document.getElementById("retry-button");
const view = document.getElementById("periodic-view");
const legend = document.getElementById("legend");
const themeToggle = document.getElementById("theme-toggle");

let elements = [];
let currentLayout = null;

export async function loadElements() {
    const response = await fetch(ELEMENTS_URL);
    if (!response.ok) {
        throw new Error(`HTTP error: ${response.status} ${response.statusText}`);
    }

    let data;
    try {
        data = await response.json();
    } catch (error) {
        throw new Error(`JSON sai định dạng: ${error.message}`);
    }

    if (!data || !Array.isArray(data.elements)) {
        throw new Error("JSON không chứa mảng 'elements'");
    }

    const loaded = data.elements.filter((element) => element.number <= MAX_ATOMIC_NUMBER);
    console.assert(loaded.length === 118, `Dự kiến 118 nguyên tố, nhận được ${loaded.length}`);

    return loaded;
}

function decorateCell(cell, element) {
    cell.className = `element ${getCategoryClass(element.category)}`;
    cell.dataset.number = String(element.number);
    cell.dataset.symbol = element.symbol;
    cell.dataset.name = element.name;
    cell.dataset.category = element.category;
    cell.dataset.phase = element.phase;
    cell.dataset.block = element.block;
    cell.setAttribute("role", "button");
    cell.setAttribute("tabindex", "0");
    cell.setAttribute("aria-label", `${element.name}, số hiệu nguyên tử ${element.number}`);
}

function createSpan(className, text) {
    const span = document.createElement("span");
    span.className = className;
    span.textContent = text;
    return span;
}

function createElementCell(element) {
    const cell = document.createElement("div");
    decorateCell(cell, element);
    cell.style.gridColumn = String(element.xpos);
    cell.style.gridRow = String(element.ypos);
    cell.style.animationDelay = `${(element.ypos - 1) * 14 + (element.xpos - 1) * 3}ms`;

    cell.append(
        createSpan("element__number", String(element.number)),
        createSpan("element__symbol", element.symbol),
        createSpan("element__name", element.name),
        createSpan("element__mass", String(element.atomic_mass))
    );
    return cell;
}

const EXPLORER_GROUPS = [
    { label: "Chu kỳ 1", match: (e) => e.category !== "lanthanide" && e.category !== "actinide" && e.period === 1 },
    { label: "Chu kỳ 2", match: (e) => e.category !== "lanthanide" && e.category !== "actinide" && e.period === 2 },
    { label: "Chu kỳ 3", match: (e) => e.category !== "lanthanide" && e.category !== "actinide" && e.period === 3 },
    { label: "Chu kỳ 4", match: (e) => e.category !== "lanthanide" && e.category !== "actinide" && e.period === 4 },
    { label: "Chu kỳ 5", match: (e) => e.category !== "lanthanide" && e.category !== "actinide" && e.period === 5 },
    { label: "Chu kỳ 6", match: (e) => e.category !== "lanthanide" && e.category !== "actinide" && e.period === 6 },
    { label: "Chu kỳ 7", match: (e) => e.category !== "lanthanide" && e.category !== "actinide" && e.period === 7 },
    { label: "Họ Lantan", match: (e) => e.category === "lanthanide" },
    { label: "Họ Actini", match: (e) => e.category === "actinide" },
];

function createElementCard(element) {
    const card = document.createElement("div");
    decorateCell(card, element);
    card.classList.add("element--card");
    card.append(
        createSpan("element__number", String(element.number)),
        createSpan("element__symbol", element.symbol),
        createSpan("element__name", element.name)
    );
    return card;
}

function renderTable() {
    const grid = document.createElement("div");
    grid.className = "table";
    const ordered = [...elements].sort((a, b) => a.ypos - b.ypos || a.xpos - b.xpos);
    ordered.forEach((element) => grid.appendChild(createElementCell(element)));
    view.replaceChildren(grid);
}

function renderExplorer() {
    const wrapper = document.createElement("div");
    wrapper.className = "explorer";
    EXPLORER_GROUPS.forEach((group) => {
        const members = elements.filter(group.match).sort((a, b) => a.number - b.number);
        if (members.length === 0) {
            return;
        }
        const section = document.createElement("section");
        section.className = "explorer-group";

        const title = document.createElement("h2");
        title.className = "explorer-group__title";
        title.textContent = group.label;

        const grid = document.createElement("div");
        grid.className = "explorer-group__grid";
        members.forEach((element) => grid.appendChild(createElementCard(element)));

        section.append(title, grid);
        wrapper.appendChild(section);
    });
    view.replaceChildren(wrapper);
}

function getLayout() {
    return window.matchMedia(`(min-width: ${TABLE_BREAKPOINT_PX}px)`).matches ? "table" : "explorer";
}

function renderView() {
    currentLayout = getLayout();
    view.classList.toggle("is-table", currentLayout === "table");
    view.classList.toggle("is-explorer", currentLayout === "explorer");
    if (currentLayout === "table") {
        renderTable();
    } else {
        renderExplorer();
    }
}

function renderLegend() {
    CATEGORY_LABELS.forEach(({ className, label }) => {
        const chip = document.createElement("button");
        chip.type = "button";
        chip.className = "legend__chip";
        chip.dataset.categoryClass = className;
        chip.setAttribute("aria-pressed", "false");
        chip.addEventListener("click", () => setCategoryFilter(className));

        const swatch = document.createElement("span");
        swatch.className = `legend__swatch ${className}`;

        const text = document.createElement("span");
        text.textContent = label;

        chip.append(swatch, text);
        legend.appendChild(chip);
    });
    legend.hidden = false;
}

function showError() {
    if (errorMessage) {
        errorMessage.hidden = false;
    }
    if (view) {
        view.replaceChildren();
    }
}

function hideError() {
    if (errorMessage) {
        errorMessage.hidden = true;
    }
}

async function init() {
    hideError();
    if (view) {
        view.replaceChildren();
    }
    if (legend) {
        legend.replaceChildren();
    }
    try {
        elements = await loadElements();
        renderView();
        renderLegend();
        applyFilters();
        setupLearn(elements);
    } catch (error) {
        console.error("Không thể tải dữ liệu bảng tuần hoàn:", error);
        showError();
    }
}

function openElementFromCell(cell) {
    const number = Number(cell.dataset.number);
    const element = elements.find((item) => item.number === number);
    if (element) {
        openElementDetails(element);
    }
}

if (view) {
    view.addEventListener("click", (event) => {
        const cell = event.target.closest(".element");
        if (cell) {
            openElementFromCell(cell);
        }
    });

    view.addEventListener("keydown", (event) => {
        if (event.key !== "Enter" && event.key !== " ") {
            return;
        }
        const cell = event.target.closest(".element");
        if (cell) {
            event.preventDefault();
            openElementFromCell(cell);
        }
    });
}

function handleLayoutChange() {
    const next = getLayout();
    if (next === currentLayout) {
        return;
    }
    renderView();
    applyFilters();
}

const layoutQuery = window.matchMedia(`(min-width: ${TABLE_BREAKPOINT_PX}px)`);
if (typeof layoutQuery.addEventListener === "function") {
    layoutQuery.addEventListener("change", handleLayoutChange);
}
window.addEventListener("resize", handleLayoutChange);
window.addEventListener("orientationchange", handleLayoutChange);

if (retryButton) {
    retryButton.addEventListener("click", init);
}

setupThemeToggle(themeToggle);

init();
