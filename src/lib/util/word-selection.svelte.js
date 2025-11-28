/**
 * Word selection utilities for building the game word pool.
 * Handles filtering, shuffling, and experience-weighted selection.
 */

// Fisher-Yates shuffle algorithm
export function shuffleWords(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

/**
 * Select words with weighted probability favoring lower experience.
 * Uses inverse weighting: weight = max(0.1, 1 / (experience * 0.5 + 1))
 * Words with 0 XP have weight 1, higher XP reduces weight at half rate, minimum 0.1.
 */
export function selectWordsByExperience(words, limit) {
    if (words.length <= limit) {
        return shuffleWords(words);
    }

    const selected = [];
    const available = [...words];

    while (selected.length < limit && available.length > 0) {
        // Calculate weights - halved reduction rate with minimum weight of 0.1
        const weights = available.map(w => Math.max(0.1, 1 / (w.experience * 0.5 + 1)));
        const totalWeight = weights.reduce((sum, w) => sum + w, 0);

        // Random selection based on weight
        let random = Math.random() * totalWeight;
        let selectedIndex = 0;

        for (let i = 0; i < weights.length; i++) {
            random -= weights[i];
            if (random <= 0) {
                selectedIndex = i;
                break;
            }
        }

        // Move selected word from available to selected
        selected.push(available[selectedIndex]);
        available.splice(selectedIndex, 1);
    }

    return selected;
}

// Filter words by difficulty levels
export function filterWordsByDifficulty(words, options = {}) {
    const { includeLevel1 = true, includeLevel2 = true, includeLevel3 = true } = options;
    return words.filter((word) => {
        return (
            (includeLevel1 && word.difficulty === 1) ||
            (includeLevel2 && word.difficulty === 2) ||
            (includeLevel3 && word.difficulty === 3)
        );
    });
}

/**
 * Build a word pool for a game session.
 * Filters by difficulty, then selects based on experience weighting (or random if disabled).
 */
export function buildWordPool(words, options = {}) {
    const { poolLimit = "50", includeLevel1 = true, includeLevel2 = true, includeLevel3 = true, useExperienceBias = true } = options;
    const filteredWords = filterWordsByDifficulty(words, { includeLevel1, includeLevel2, includeLevel3 });

    let selectedWords;
    if (poolLimit === "unlimited") {
        selectedWords = filteredWords;
    } else if (poolLimit === "50") {
        selectedWords = useExperienceBias 
            ? selectWordsByExperience(filteredWords, 50)
            : shuffleWords(filteredWords).slice(0, 50);
    } else if (poolLimit === "20") {
        selectedWords = useExperienceBias 
            ? selectWordsByExperience(filteredWords, 20)
            : shuffleWords(filteredWords).slice(0, 20);
    } else {
        selectedWords = filteredWords;
    }

    // Initialize session progress for each word (starts at 0)
    return selectedWords.map(word => ({
        ...word,
        sessionProgress: 0
    }));
}
