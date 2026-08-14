import { getCategoryClass } from "./categories.js";
import { openElementDetails } from "./details.js";

const COMMON_SYMBOLS = ["H", "C", "N", "O", "Na", "Mg", "Al", "Si", "P", "S", "Cl", "K", "Ca", "Fe", "Cu", "Zn", "Ag", "Au"];

const LEARN_GROUPS = [
    { title: "Nhóm 1 — Kim loại kiềm", className: "cat-alkali-metal", description: "Hoạt động mạnh, phản ứng nhanh với nước.", match: (e) => e.number > 1 && e.group === 1 },
    { title: "Nhóm 2 — Kim loại kiềm thổ", className: "cat-alkaline-earth-metal", description: "Kim loại hoạt động, thường gặp trong khoáng chất.", match: (e) => e.group === 2 },
    { title: "Nhóm 17 — Halogen", className: "cat-diatomic-nonmetal", description: "Phi kim hoạt động mạnh, dễ tạo muối.", match: (e) => e.group === 17 },
    { title: "Nhóm 18 — Khí hiếm", className: "cat-noble-gas", description: "Kém phản ứng, rất bền vững.", match: (e) => e.group === 18 },
    { title: "Kim loại chuyển tiếp", className: "cat-transition-metal", description: "Nhiều kim loại quen thuộc như Fe, Cu, Zn.", match: (e) => e.category === "transition metal" },
    { title: "Họ Lantan", className: "cat-lanthanide", description: "Các nguyên tố đất hiếm.", match: (e) => e.category === "lanthanide" },
    { title: "Họ Actini", className: "cat-actinide", description: "Phần lớn là nguyên tố phóng xạ.", match: (e) => e.category === "actinide" },
];

const refs = {
    section: document.getElementById("hoc-nhanh"),
    groups: document.getElementById("learn-groups"),
    common: document.getElementById("learn-common"),
};

function createChip(element, labelParts) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `learn-chip ${getCategoryClass(element.category)}`;
    button.setAttribute("aria-label", `${element.name} (${element.symbol})`);
    button.append(...labelParts);
    button.addEventListener("click", () => openElementDetails(element));
    return button;
}

function renderGroups(elements) {
    if (!refs.groups) {
        return;
    }
    refs.groups.replaceChildren();

    LEARN_GROUPS.forEach((group) => {
        const members = elements.filter(group.match).sort((a, b) => a.number - b.number);
        if (members.length === 0) {
            return;
        }

        const card = document.createElement("div");
        card.className = "learn-group";

        const title = document.createElement("h4");
        title.className = "learn-group__title";

        const swatch = document.createElement("span");
        swatch.className = `learn-group__swatch ${group.className}`;
        title.append(swatch, document.createTextNode(group.title));

        const desc = document.createElement("p");
        desc.className = "learn-group__desc";
        desc.textContent = group.description;

        const chips = document.createElement("div");
        chips.className = "learn-group__chips";
        members.forEach((element) => {
            const symbol = document.createElement("span");
            symbol.className = "learn-chip__symbol";
            symbol.textContent = element.symbol;

            const number = document.createElement("span");
            number.className = "learn-chip__number";
            number.textContent = String(element.number);

            chips.appendChild(createChip(element, [symbol, number]));
        });

        card.append(title, desc, chips);
        refs.groups.appendChild(card);
    });
}

function renderCommon(elements) {
    if (!refs.common) {
        return;
    }
    refs.common.replaceChildren();

    COMMON_SYMBOLS.forEach((symbol) => {
        const element = elements.find((item) => item.symbol === symbol);
        if (!element) {
            return;
        }

        const symbolSpan = document.createElement("span");
        symbolSpan.className = "learn-chip__symbol";
        symbolSpan.textContent = element.symbol;

        const nameSpan = document.createElement("span");
        nameSpan.className = "learn-chip__name";
        nameSpan.textContent = element.name;

        const chip = createChip(element, [symbolSpan, nameSpan]);
        chip.classList.add("learn-chip--common");
        refs.common.appendChild(chip);
    });
}

export function setupLearn(elements) {
    if (!Array.isArray(elements) || elements.length === 0) {
        return;
    }
    renderGroups(elements);
    renderCommon(elements);
    if (refs.section) {
        refs.section.hidden = false;
    }
}
