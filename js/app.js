import { CATEGORY_LABELS, getCategoryClass } from "./categories.js";
import { setupThemeToggle } from "./theme.js";
import { openElementDetails } from "./details.js";
import { setCategoryFilter, applyFilters } from "./filters.js";

const ELEMENTS_URL = "data/elements.json";
const MAX_ATOMIC_NUMBER = 118;

const errorMessage = document.getElementById("error-message");
const retryButton = document.getElementById("retry-button");
const table = document.getElementById("table");
const legend = document.getElementById("legend");
const themeToggle = document.getElementById("theme-toggle");

let elements = [];

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

    const elements = data.elements.filter((element) => element.number <= MAX_ATOMIC_NUMBER);
    console.assert(elements.length === 118, `Dự kiến 118 nguyên tố, nhận được ${elements.length}`);

    return elements;
}

function createElementCell(element) {
    const cell = document.createElement("div");
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
    cell.style.gridColumn = String(element.xpos);
    cell.style.gridRow = String(element.ypos);
    cell.style.animationDelay = `${(element.ypos - 1) * 14 + (element.xpos - 1) * 3}ms`;

    const number = document.createElement("span");
    number.className = "element__number";
    number.textContent = String(element.number);

    const symbol = document.createElement("span");
    symbol.className = "element__symbol";
    symbol.textContent = element.symbol;

    const name = document.createElement("span");
    name.className = "element__name";
    name.textContent = element.name;

    const mass = document.createElement("span");
    mass.className = "element__mass";
    mass.textContent = String(element.atomic_mass);

    cell.append(number, symbol, name, mass);
    return cell;
}

function renderElements(elements) {
    const ordered = [...elements].sort((a, b) => a.ypos - b.ypos || a.xpos - b.xpos);
    ordered.forEach((element) => {
        table.appendChild(createElementCell(element));
    });
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
    if (table) {
        table.replaceChildren();
    }
}

function hideError() {
    if (errorMessage) {
        errorMessage.hidden = true;
    }
}

async function init() {
    hideError();
    if (table) {
        table.replaceChildren();
    }
    if (legend) {
        legend.replaceChildren();
    }
    try {
        elements = await loadElements();
        renderElements(elements);
        renderLegend();
        applyFilters();
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

if (table) {
    table.addEventListener("click", (event) => {
        const cell = event.target.closest(".element");
        if (cell) {
            openElementFromCell(cell);
        }
    });

    table.addEventListener("keydown", (event) => {
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

if (retryButton) {
    retryButton.addEventListener("click", init);
}

setupThemeToggle(themeToggle);

init();
