const VISIT_STORAGE_KEY = "visit-history";
const MAX_VISITS_KEPT = 100;

function detectDevice() {
    const ua = navigator.userAgent;
    const uaData = navigator.userAgentData;
    const isTablet =
        /iPad|Tablet/.test(ua) ||
        (/Android/.test(ua) && !/Mobile/.test(ua)) ||
        (navigator.maxTouchPoints > 1 && /Macintosh/.test(ua));

    if (isTablet) {
        return "tablet";
    }

    const isMobile = /Mobi|iPhone|Android/.test(ua) || (uaData ? uaData.mobile : false);
    return isMobile ? "mobile" : "desktop";
}

function detectBrowser() {
    const ua = navigator.userAgent;
    const uaData = navigator.userAgentData;

    if (uaData && Array.isArray(uaData.brands) && uaData.brands.length > 0) {
        const brand = uaData.brands.find((item) => !/not/i.test(item.brand) && !/brand/i.test(item.brand)) || uaData.brands[0];
        return { name: brand.brand, version: brand.version, source: "userAgentData" };
    }

    const patterns = [
        ["Edg/", "Edge"],
        ["OPR/", "Opera"],
        ["Vivaldi", "Vivaldi"],
        ["CriOS/", "Chrome iOS"],
        ["FxiOS/", "Firefox iOS"],
        ["SamsungBrowser", "Samsung Internet"],
        ["Firefox", "Firefox"],
        ["Chrome", "Chrome"],
    ];

    for (const [token, name] of patterns) {
        if (ua.includes(token)) {
            const escaped = token.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
            const match = ua.match(new RegExp(escaped + "(?:/([\\d.]+))?"));
            return { name, version: match && match[1] ? match[1] : null, source: "userAgent" };
        }
    }

    if (ua.includes("Safari")) {
        const match = ua.match(/Version\/([\d.]+)/);
        return { name: "Safari", version: match ? match[1] : null, source: "userAgent" };
    }

    return { name: "Unknown", version: null, source: "userAgent" };
}

function loadHistory() {
    try {
        const raw = localStorage.getItem(VISIT_STORAGE_KEY);
        if (!raw) {
            return [];
        }
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
        return [];
    }
}

function saveHistory(history) {
    try {
        localStorage.setItem(VISIT_STORAGE_KEY, JSON.stringify(history));
    } catch (error) {
        console.warn("[visitor] Không thể lưu visit-history:", error);
    }
}

function collectVisit() {
    const now = new Date();
    const history = loadHistory();

    const record = {
        visitId: history.length + 1,
        visitedAt: now.toISOString(),
        timestamp: now.getTime(),
        userAgent: navigator.userAgent,
        browser: detectBrowser(),
        device: detectDevice(),
        language: navigator.language,
        screen: {
            width: window.screen.width,
            height: window.screen.height,
        },
        referrer: document.referrer,
    };

    history.push(record);
    if (history.length > MAX_VISITS_KEPT) {
        history.splice(0, history.length - MAX_VISITS_KEPT);
    }
    saveHistory(history);

    console.log("[visitor] New visit JSON:");
    console.log(JSON.stringify(record, null, 2));
    console.log(`[visitor] Total visits saved: ${history.length}`);
}

collectVisit();
