const supported = typeof window !== "undefined" && "speechSynthesis" in window && typeof SpeechSynthesisUtterance !== "undefined";

let cachedVoices = [];

function refreshVoices() {
    if (!supported) {
        return;
    }
    try {
        cachedVoices = window.speechSynthesis.getVoices() || [];
    } catch (error) {
        cachedVoices = [];
    }
}

if (supported) {
    refreshVoices();
    if (typeof window.speechSynthesis.addEventListener === "function") {
        window.speechSynthesis.addEventListener("voiceschanged", refreshVoices);
    } else if (typeof window.speechSynthesis.onvoiceschanged === "function") {
        window.speechSynthesis.onvoiceschanged = refreshVoices;
    }
}

function normalizeLang(voice) {
    return String(voice.lang || "").toLowerCase();
}

function isEnglish(voice) {
    return normalizeLang(voice).startsWith("en");
}

function getVoices() {
    if (cachedVoices.length > 0) {
        return cachedVoices;
    }
    if (!supported) {
        return [];
    }
    try {
        return window.speechSynthesis.getVoices() || [];
    } catch (error) {
        return [];
    }
}

function pickEnglishVoice() {
    const voices = getVoices();
    if (voices.length === 0) {
        return null;
    }

    const english = voices.filter(isEnglish);
    if (english.length > 0) {
        const enUS = english.find((voice) => normalizeLang(voice) === "en-us");
        if (enUS) {
            return enUS;
        }
        const enGB = english.find((voice) => normalizeLang(voice) === "en-gb");
        if (enGB) {
            return enGB;
        }
        return english[0];
    }

    return voices[0];
}

export function isSpeechSupported() {
    return supported;
}

export function cancelSpeech() {
    if (!supported) {
        return;
    }
    try {
        window.speechSynthesis.cancel();
    } catch (error) {
        console.warn("[pronunciation] Không thể dừng giọng đọc:", error);
    }
}

export function speakElementName(name) {
    if (!supported) {
        return false;
    }

    const text = String(name || "").trim();
    if (text === "") {
        return false;
    }

    try {
        const synth = window.speechSynthesis;
        synth.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        const voice = pickEnglishVoice();
        if (voice) {
            utterance.voice = voice;
            utterance.lang = voice.lang || "en-US";
        }
        utterance.rate = 0.9;
        utterance.pitch = 1;
        utterance.volume = 1;

        synth.speak(utterance);
        return true;
    } catch (error) {
        console.warn("[pronunciation] Không thể phát âm tên nguyên tố:", error);
        return false;
    }
}
