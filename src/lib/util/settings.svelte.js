/**
 * User settings store with localStorage persistence
 */

const SETTINGS_STORAGE_KEY = 'gtlk-settings';

const canUseLocalStorage = 
    typeof window !== 'undefined' && typeof localStorage !== 'undefined';

/** @type {{ ttsEnabled: boolean }} */
const defaultSettings = {
    ttsEnabled: true
};

/** @type {{ ttsEnabled: boolean }} */
export const settings = $state({ ...defaultSettings });

/**
 * Load settings from localStorage
 */
function loadSettings() {
    if (!canUseLocalStorage) return;
    
    try {
        const saved = localStorage.getItem(SETTINGS_STORAGE_KEY);
        if (saved) {
            const parsed = JSON.parse(saved);
            Object.assign(settings, { ...defaultSettings, ...parsed });
        }
    } catch (e) {
        console.warn('Failed to load settings from localStorage', e);
    }
}

/**
 * Save settings to localStorage
 */
function saveSettings() {
    if (!canUseLocalStorage) return;
    
    try {
        localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
    } catch (e) {
        console.warn('Failed to save settings to localStorage', e);
    }
}

/**
 * Update a setting and persist to localStorage
 * @param {keyof typeof defaultSettings} key
 * @param {any} value
 */
export function updateSetting(key, value) {
    settings[key] = value;
    saveSettings();
}

// Load settings on initialization
if (canUseLocalStorage) {
    loadSettings();
}
