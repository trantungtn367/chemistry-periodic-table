const STORAGE_KEY = "chemistry-theme";

function getCurrentTheme() {
    return document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
}

function syncButton(button, theme) {
    const isDark = theme === "dark";
    button.textContent = isDark ? "☀️" : "🌙";
    button.setAttribute("aria-label", isDark ? "Chuyển sang chế độ sáng" : "Chuyển sang chế độ tối");
}

export function setupThemeToggle(button) {
    if (!button) {
        return;
    }
    syncButton(button, getCurrentTheme());
    button.addEventListener("click", () => {
        const next = getCurrentTheme() === "dark" ? "light" : "dark";
        document.documentElement.setAttribute("data-theme", next);
        localStorage.setItem(STORAGE_KEY, next);
        syncButton(button, next);
    });
}
