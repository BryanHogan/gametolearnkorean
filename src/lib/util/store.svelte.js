import words from "$lib/data/words.json";

const DB_NAME = "gametolearnkorean";
const STORE_NAME = "word-progress";
const DB_VERSION = 1;

const withExperience = (arr) => arr.map((w) => ({ ...w, experience: 0 }));
const makeKey = (korean, english) => `${korean}::${english}`;
const canUseIndexedDB =
    typeof window !== "undefined" && typeof indexedDB !== "undefined";

// Keep a stable reference so downstream imports don't lose the array.
const wordData = withExperience(words);

const openDatabase = () =>
    new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onupgradeneeded = () => {
            const db = request.result;
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME, { keyPath: "id" });
            }
        };

        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve(request.result);
    });

const dbPromise = canUseIndexedDB ? openDatabase() : null;

const readProgress = async () => {
    if (!dbPromise) return new Map();
    const db = await dbPromise;

    return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, "readonly");
        const store = tx.objectStore(STORE_NAME);
        const request = store.getAll();

        request.onsuccess = () => {
            const progress = new Map();
            request.result.forEach(({ id, experience }) => {
                progress.set(id, experience);
            });
            resolve(progress);
        };

        request.onerror = () => reject(request.error);
    });
};

const writeProgress = async (koreanWord, englishWord, experience) => {
    if (!dbPromise) return;
    const db = await dbPromise;

    return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, "readwrite");
        tx.oncomplete = resolve;
        tx.onerror = () => reject(tx.error);
        tx.objectStore(STORE_NAME).put({
            id: makeKey(koreanWord, englishWord),
            experience
        });
    });
};

const loadWordData = async () => {
    if (!canUseIndexedDB) return wordData;

    try {
        const progress = await readProgress();
        const updated = withExperience(words).map((word) => {
            const saved = progress.get(makeKey(word.korean, word.english));
            return typeof saved === "number" ? { ...word, experience: saved } : word;
        });

        // Update in place to preserve the shared reference.
        wordData.splice(0, wordData.length, ...updated);
    } catch (error) {
        console.warn("IndexedDB unavailable, using defaults", error);
    }

    return wordData;
};

// Preload persisted experience on the client.
const wordDataReady = canUseIndexedDB ? loadWordData() : Promise.resolve(wordData);

const updateExperience = async (
    koreanWord,
    englishWord,
    experienceAmount = 1
) => {
    const word = wordData.find(
        (w) => w.korean === koreanWord && w.english === englishWord
    );
    if (!word) return;

    word.experience += experienceAmount;

    if (canUseIndexedDB) {
        try {
            await writeProgress(word.korean, word.english, word.experience);
        } catch (error) {
            console.warn("Failed to persist experience to IndexedDB", error);
        }
    }
};

export { wordData, wordDataReady, loadWordData, updateExperience };
