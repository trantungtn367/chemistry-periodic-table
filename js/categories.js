const CATEGORY_CLASSES = {
    "alkali metal": "cat-alkali-metal",
    "alkaline earth metal": "cat-alkaline-earth-metal",
    "transition metal": "cat-transition-metal",
    "post-transition metal": "cat-post-transition-metal",
    "metalloid": "cat-metalloid",
    "diatomic nonmetal": "cat-diatomic-nonmetal",
    "polyatomic nonmetal": "cat-polyatomic-nonmetal",
    "noble gas": "cat-noble-gas",
    "lanthanide": "cat-lanthanide",
    "actinide": "cat-actinide",
};

const UNKNOWN_CLASS = "cat-unknown";

const UNKNOWN_CATEGORIES = [
    "unknown, probably transition metal",
    "unknown, probably post-transition metal",
    "unknown, probably metalloid",
    "unknown, predicted to be noble gas",
];

export const CATEGORY_LABELS = [
    { className: "cat-alkali-metal", label: "Kim loại kiềm", categories: ["alkali metal"] },
    { className: "cat-alkaline-earth-metal", label: "Kim loại kiềm thổ", categories: ["alkaline earth metal"] },
    { className: "cat-transition-metal", label: "Kim loại chuyển tiếp", categories: ["transition metal"] },
    { className: "cat-post-transition-metal", label: "Kim loại sau chuyển tiếp", categories: ["post-transition metal"] },
    { className: "cat-metalloid", label: "Á kim", categories: ["metalloid"] },
    { className: "cat-diatomic-nonmetal", label: "Phi kim (2 nguyên tử)", categories: ["diatomic nonmetal"] },
    { className: "cat-polyatomic-nonmetal", label: "Phi kim (đa nguyên tử)", categories: ["polyatomic nonmetal"] },
    { className: "cat-noble-gas", label: "Khí hiếm", categories: ["noble gas"] },
    { className: "cat-lanthanide", label: "Họ Lantan", categories: ["lanthanide"] },
    { className: "cat-actinide", label: "Họ Actini", categories: ["actinide"] },
    { className: "cat-unknown", label: "Chưa rõ / dự đoán", categories: UNKNOWN_CATEGORIES },
];

export function getCategoryClass(category) {
    if (UNKNOWN_CATEGORIES.includes(category)) {
        return UNKNOWN_CLASS;
    }
    return CATEGORY_CLASSES[category] || UNKNOWN_CLASS;
}
