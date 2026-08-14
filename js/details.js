import { getCategoryClass, CATEGORY_LABELS } from "./categories.js";

const PHASE_LABELS = {
    Solid: "Rắn",
    Liquid: "Lỏng",
    Gas: "Khí",
};

const MAX_IONIZATION_SHOWN = 5;

const dialog = document.getElementById("element-dialog");
const closeButton = dialog ? dialog.querySelector(".dialog__close") : null;
const content = document.getElementById("dialog-content");

function hasValue(value) {
    if (value === null || value === undefined) {
        return false;
    }
    if (typeof value === "string" && value.trim() === "") {
        return false;
    }
    if (Array.isArray(value) && value.length === 0) {
        return false;
    }
    if (typeof value === "number" && Number.isNaN(value)) {
        return false;
    }
    return true;
}

function formatNumber(value, decimals = 2) {
    if (typeof value !== "number") {
        return String(value);
    }
    const factor = Math.pow(10, decimals);
    const rounded = Math.round(value * factor) / factor;
    return String(rounded);
}

function formatTemperature(kelvin) {
    const celsius = kelvin - 273.15;
    return `${formatNumber(kelvin)} K (${formatNumber(celsius)} °C)`;
}

function getCategoryLabel(category) {
    const className = getCategoryClass(category);
    const entry = CATEGORY_LABELS.find((item) => item.className === className);
    return entry ? entry.label : category;
}

function getPhaseLabel(phase) {
    return PHASE_LABELS[phase] || phase;
}

function createSection(title) {
    const section = document.createElement("section");
    section.className = "dialog-section";

    const heading = document.createElement("h3");
    heading.className = "dialog-section__title";
    heading.textContent = title;

    const list = document.createElement("div");
    list.className = "dialog-section__list";

    section.append(heading, list);
    return { section, list };
}

function addRow(list, label, valueText) {
    if (!hasValue(valueText)) {
        return;
    }

    const row = document.createElement("div");
    row.className = "info-row";

    const labelEl = document.createElement("span");
    labelEl.className = "info-row__label";
    labelEl.textContent = label;

    const valueEl = document.createElement("span");
    valueEl.className = "info-row__value";
    valueEl.textContent = valueText;

    row.append(labelEl, valueEl);
    list.appendChild(row);
}

function createChip(text) {
    const chip = document.createElement("span");
    chip.className = "ionization__chip";
    chip.textContent = text;
    return chip;
}

function addIonization(list, energies) {
    if (!hasValue(energies)) {
        return;
    }

    const row = document.createElement("div");
    row.className = "info-row info-row--column";

    const labelEl = document.createElement("span");
    labelEl.className = "info-row__label";
    labelEl.textContent = "Năng lượng ion hóa";

    const wrap = document.createElement("div");
    wrap.className = "ionization";

    const values = energies.map((energy) => `${formatNumber(energy)} kJ/mol`);
    values.slice(0, MAX_IONIZATION_SHOWN).forEach((value) => wrap.appendChild(createChip(value)));

    const extra = values.slice(MAX_IONIZATION_SHOWN);
    if (extra.length > 0) {
        const extraWrap = document.createElement("div");
        extraWrap.className = "ionization__extra is-hidden";
        extra.forEach((value) => extraWrap.appendChild(createChip(value)));
        wrap.appendChild(extraWrap);

        const toggle = document.createElement("button");
        toggle.type = "button";
        toggle.className = "ionization__toggle";
        toggle.textContent = `Xem thêm ${extra.length}`;
        toggle.addEventListener("click", () => {
            const willShow = extraWrap.classList.contains("is-hidden");
            extraWrap.classList.toggle("is-hidden", !willShow);
            toggle.textContent = willShow ? "Thu gọn" : `Xem thêm ${extra.length}`;
        });
        wrap.appendChild(toggle);
    }

    row.append(labelEl, wrap);
    list.appendChild(row);
}

function createFigure(src, alt, caption, attribution, element) {
    const figure = document.createElement("figure");
    figure.className = "media-figure";

    const img = document.createElement("img");
    img.className = "media-figure__img";
    img.src = src;
    img.alt = alt;
    img.loading = "lazy";
    img.decoding = "async";

    img.addEventListener("error", () => {
        const placeholder = document.createElement("div");
        placeholder.className = "media-placeholder";
        placeholder.textContent = element.symbol;
        img.replaceWith(placeholder);
    });

    figure.appendChild(img);

    const figcaption = document.createElement("figcaption");
    figcaption.className = "media-figure__caption";
    figcaption.textContent = caption;
    if (hasValue(attribution)) {
        const attr = document.createElement("span");
        attr.className = "media-figure__attribution";
        attr.textContent = attribution;
        figcaption.append(document.createElement("br"), attr);
    }
    figure.appendChild(figcaption);

    return figure;
}

function createMedia(element) {
    const hasImage = hasValue(element.image) && hasValue(element.image.url);
    const hasBohr = hasValue(element.bohr_model_image);

    if (!hasImage && !hasBohr) {
        return null;
    }

    const wrapper = document.createElement("div");
    wrapper.className = "element-media";

    if (hasImage) {
        wrapper.appendChild(
            createFigure(
                element.image.url,
                element.image.title || `${element.name} - ${element.symbol}`,
                "Ảnh nguyên tố",
                element.image.attribution,
                element
            )
        );
    }
    if (hasBohr) {
        wrapper.appendChild(
            createFigure(
                element.bohr_model_image,
                `Mô hình Bohr của ${element.name}`,
                "Mô hình Bohr",
                null,
                element
            )
        );
    }

    return wrapper;
}

function renderElement(element) {
    content.replaceChildren();
    content.className = `dialog__content ${getCategoryClass(element.category)}`;

    const header = document.createElement("div");
    header.className = "element-header";

    const symbol = document.createElement("div");
    symbol.className = "element-header__symbol";
    symbol.textContent = element.symbol;

    const headerInfo = document.createElement("div");
    headerInfo.className = "element-header__info";

    const name = document.createElement("h2");
    name.id = "element-dialog-title";
    name.className = "element-header__name";
    name.textContent = element.name;

    const numberLine = document.createElement("p");
    numberLine.className = "element-header__number";
    numberLine.textContent = `Số hiệu nguyên tử: ${element.number}`;

    headerInfo.append(name, numberLine);
    header.append(symbol, headerInfo);
    content.appendChild(header);

    const media = createMedia(element);
    if (media) {
        content.appendChild(media);
    }

    const basic = createSection("Thông tin cơ bản");
    addRow(basic.list, "Nguyên tử khối", hasValue(element.atomic_mass) ? `${formatNumber(element.atomic_mass, 4)} u` : null);
    addRow(basic.list, "Nhóm", element.group);
    addRow(basic.list, "Chu kỳ", element.period);
    addRow(basic.list, "Phân loại", getCategoryLabel(element.category));
    addRow(basic.list, "Trạng thái", getPhaseLabel(element.phase));
    addRow(basic.list, "Block", element.block);
    if (basic.list.children.length > 0) {
        content.appendChild(basic.section);
    }

    const physics = createSection("Thông tin vật lý");
    if (hasValue(element.density)) {
        addRow(physics.list, "Mật độ", `${formatNumber(element.density)} g/cm³`);
    }
    if (hasValue(element.melt)) {
        addRow(physics.list, "Nhiệt độ nóng chảy", formatTemperature(element.melt));
    }
    if (hasValue(element.boil)) {
        addRow(physics.list, "Nhiệt độ sôi", formatTemperature(element.boil));
    }
    if (hasValue(element.molar_heat)) {
        addRow(physics.list, "Nhiệt dung mol", `${formatNumber(element.molar_heat)} J/(mol·K)`);
    }
    if (physics.list.children.length > 0) {
        content.appendChild(physics.section);
    }

    const electron = createSection("Cấu trúc electron");
    addRow(electron.list, "Cấu hình electron", element.electron_configuration);
    addRow(electron.list, "Cấu hình electron rút gọn", element.electron_configuration_semantic);
    if (hasValue(element.shells)) {
        addRow(electron.list, "Phân bố electron theo lớp", element.shells.join(" – "));
    }
    if (hasValue(element.electron_affinity)) {
        addRow(electron.list, "Ái lực electron", `${formatNumber(element.electron_affinity)} kJ/mol`);
    }
    if (hasValue(element.electronegativity_pauling)) {
        addRow(electron.list, "Độ âm điện Pauling", formatNumber(element.electronegativity_pauling));
    }
    addIonization(electron.list, element.ionization_energies);
    if (electron.list.children.length > 0) {
        content.appendChild(electron.section);
    }

    const discovery = createSection("Lịch sử");
    addRow(discovery.list, "Người phát hiện", element.discovered_by);
    addRow(discovery.list, "Người đặt tên", element.named_by);
    if (discovery.list.children.length > 0) {
        content.appendChild(discovery.section);
    }

    if (hasValue(element.summary)) {
        const summary = createSection("Mô tả");
        const paragraph = document.createElement("p");
        paragraph.className = "dialog-section__text";
        paragraph.textContent = element.summary;
        summary.section.appendChild(paragraph);
        content.appendChild(summary.section);
    }

    if (hasValue(element.source)) {
        const source = document.createElement("div");
        source.className = "dialog-source";

        const link = document.createElement("a");
        link.className = "dialog-source__link";
        link.href = element.source;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        link.textContent = "Xem nguồn tham khảo";

        source.appendChild(link);
        content.appendChild(source);
    }
}

export function openElementDetails(element) {
    if (!dialog || !content) {
        return;
    }
    renderElement(element);
    content.scrollTop = 0;
    dialog.showModal();
    requestAnimationFrame(() => {
        content.scrollTop = 0;
    });
}

if (dialog && closeButton) {
    closeButton.addEventListener("click", () => dialog.close());
    dialog.addEventListener("click", (event) => {
        if (event.target === dialog) {
            dialog.close();
        }
    });
}
