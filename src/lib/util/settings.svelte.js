const STORAGE_KEY = 'gtlk-settings';
const canUseLocalStorage = typeof window !== 'undefined';

const defaultSettings = {
    ttsEnabled: true
};

export const settings = $state({ ...defaultSettings });

function loadSettings() {
    if (!canUseLocalStorage) return;
    
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            Object.assign(settings, { ...defaultSettings, ...JSON.parse(saved) });
        }
    } catch (e) {
        console.warn('Failed to load settings', e);
    }
}

function saveSettings() {
    if (!canUseLocalStorage) return;
    
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch (e) {
        console.warn('Failed to save settings', e);
    }
}

export function updateSetting(key, value) {
    settings[key] = value;
    saveSettings();
}

// Load on init
if (canUseLocalStorage) {
    loadSettings();
}
