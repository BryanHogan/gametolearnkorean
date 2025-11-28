/**
 * Audio utilities for Korean text-to-speech
 * Uses Web Speech API with Korean voice
 */

/** @type {{ value: boolean }} */
export const ttsEnabled = $state({ value: true });

let koreanVoice = null;
let voicesLoaded = false;

/**
 * Initialize voices - call this early to ensure voices are loaded
 */
function loadVoices() {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    
    const voices = speechSynthesis.getVoices();
    if (voices.length > 0) {
        koreanVoice = voices.find(v => v.lang.startsWith('ko')) || null;
        voicesLoaded = true;
    }
}

// Load voices when they become available (Chrome loads asynchronously)
if (typeof window !== 'undefined' && window.speechSynthesis) {
    loadVoices();
    speechSynthesis.onvoiceschanged = loadVoices;
}

/**
 * Speak Korean text using Web Speech API
 * @param {string} text - Korean text to speak
 */
export function speakKorean(text) {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
        return; // Not available in SSR or unsupported browsers
    }
    
    if (!ttsEnabled.value) {
        return; // TTS is disabled by user
    }
    
    // Cancel any ongoing speech
    speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ko-KR';
    utterance.rate = 1.0; // Firefox has issues with rates < 1
    utterance.pitch = 1.0;
    utterance.volume = 1.0;
    
    // Use cached Korean voice if available
    if (koreanVoice) {
        utterance.voice = koreanVoice;
    } else if (!voicesLoaded) {
        // Try loading voices again if not yet loaded
        loadVoices();
        if (koreanVoice) {
            utterance.voice = koreanVoice;
        }
    }
    
    speechSynthesis.speak(utterance);
}

/**
 * Play audio for a word - uses audio file if available, otherwise TTS
 * @param {string} korean - Korean text
 * @param {string} [audioUrl] - Optional URL to audio file
 */
export async function playWordAudio(korean, audioUrl) {
    if (typeof window === 'undefined') return;
    
    if (audioUrl) {
        try {
            const audio = new Audio(audioUrl);
            await audio.play();
        } catch (e) {
            // Fallback to TTS if audio fails
            speakKorean(korean);
        }
    } else {
        speakKorean(korean);
    }
}
