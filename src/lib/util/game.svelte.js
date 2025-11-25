import { wordData, updateExperience } from "$lib/util/store.svelte.js";
import { BlockTask } from "$lib/util/tasks/block-task.svelte.js";
import { FreeFormTask } from "$lib/util/tasks/freeform-task.svelte.js";

// Maps task types to the progress level they correspond to
const TASK_PROGRESS_MAP = {
    "pairs": 0,        // Task Type A - words at progress 0
    "manyvsone": 1,    // Task Type B - words at progress 1
    "blockwriting": 2, // Task Type C - words at progress 2
    "freeformwriting": 3 // Task Type D - words at progress 3
};

const MAX_PROGRESS = 4;

export class Game {
    // Game State
    gameStart = $state(false);
    gameCompleted = $state(false);
    level = $state(1);
    taskType = $state("pairs"); // "pairs", "blockwriting", "manyvsone", "freeformwriting"
    
    // Data
    words = wordData;
    wordPool = $state([]); // Words with sessionProgress attached
    
    // Round State
    chosenPairs = $state([]);
    englishCards = $state([]);
    koreanCards = $state([]);
    selectedCards = $state([]);
    failedTries = $state(0);
    
    // Track which words failed on first try this round (per-word tracking)
    failedFirstTry = $state(new Set());
    
    // Track words that recently advanced (to avoid same word appearing in consecutive tasks)
    recentlyAdvanced = $state(new Set());
    
    // Task Types
    blockTask = new BlockTask(this);
    freeFormTask = new FreeFormTask(this);

    // Many Vs One State
    manyVsOneTarget = $state(null);
    manyVsOneOptions = $state([]);
    manyVsOnePromptDirection = $state("english-to-korean");

    // Options
    wordPoolLimit = $state("50");
    includeLevel1Cards = $state(true);
    includeLevel2Cards = $state(true);
    includeLevel3Cards = $state(true);

    constructor() {
        // Initialize if needed
    }
    
    // Get words that still need progress (not yet at MAX_PROGRESS)
    get incompleteWords() {
        return this.wordPool.filter(w => w.sessionProgress < MAX_PROGRESS);
    }
    
    // Get words at a specific progress level
    getWordsAtProgress(progressLevel) {
        return this.wordPool.filter(w => w.sessionProgress === progressLevel);
    }
    
    // Check if session is complete (all words at max progress)
    get isSessionComplete() {
        return this.wordPool.length > 0 && this.incompleteWords.length === 0;
    }
    
    // Filter out recently advanced words from a list (unless it would leave us with nothing)
    excludeRecentlyAdvanced(words) {
        const filtered = words.filter(w => {
            const key = `${w.korean}::${w.english}`;
            return !this.recentlyAdvanced.has(key);
        });
        // If filtering leaves us with nothing, return original list
        return filtered.length > 0 ? filtered : words;
    }

    get pairAmount() {
        return Math.min(this.level / 5 + 5, 10);
    }

    startGame() {
        this.gameStart = true;
        this.gameCompleted = false;
        this.level = 1;
        this.levelReset();
        
        let filteredWords = this.words.filter((word) => {
            return (
                (this.includeLevel1Cards && word.difficulty === 1) ||
                (this.includeLevel2Cards && word.difficulty === 2) ||
                (this.includeLevel3Cards && word.difficulty === 3)
            );
        });

        let selectedWords;
        if (this.wordPoolLimit == "unlimited") {
            selectedWords = filteredWords;
        } else if (this.wordPoolLimit == "50") {
            selectedWords = this.shuffledWords(filteredWords).slice(0, 50);
        } else {
            selectedWords = filteredWords;
        }
        
        // Initialize session progress for each word (starts at 0)
        this.wordPool = selectedWords.map(word => ({
            ...word,
            sessionProgress: 0
        }));
        
        this.initializeRound();
    }

    shuffledWords(array) {
        const newArray = [...array];
        for (let i = newArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
        }
        return newArray;
    }

    selectTaskType() {        
        const taskOrder = ["pairs", "manyvsone", "blockwriting", "freeformwriting"];
        const currentIndex = taskOrder.indexOf(this.taskType);
        const minWordsForTask = 3;
        const randomSelectionChance = 0.25;
        const pairsWeightReduction = 0.5;
        
        // A task is allowed if:
        // 1. It has >= minWordsForTask words at its progress level, OR
        // 2. All remaining incomplete words are at that progress level or higher (no lower-level words to work on first)
        const isTaskAllowed = (taskName) => {
            const progressLevel = TASK_PROGRESS_MAP[taskName];
            const wordsAtLevel = this.getWordsAtProgress(progressLevel);
            const wordsBelowLevel = this.wordPool.filter(w => w.sessionProgress < progressLevel && w.sessionProgress < MAX_PROGRESS);
            
            // Always allow "pairs" (progress 0) - it's the starting point
            if (taskName === "pairs") return true;
            
            // Allow if we have enough words at this level, OR no incomplete words remain below this level
            return wordsAtLevel.length >= minWordsForTask || 
                   (wordsAtLevel.length > 0 && wordsBelowLevel.length === 0);
        };
        
        // 25% chance to select a random task (weighted by word count)
        if (Math.random() < randomSelectionChance) {
            // Collect allowed tasks with words at their progress level
            const weightedTasks = taskOrder
                .filter(task => {
                    const progressLevel = TASK_PROGRESS_MAP[task];
                    return isTaskAllowed(task) && this.getWordsAtProgress(progressLevel).length > 0;
                })
                .map(task => {
                    const progressLevel = TASK_PROGRESS_MAP[task];
                    let weight = this.getWordsAtProgress(progressLevel).length;
                    // Reduce weight for "pairs" to favor more advanced tasks
                    if (task === "pairs") {
                        weight *= pairsWeightReduction;
                    }
                    return { task, weight };
                });
            if (weightedTasks.length > 0) {
                // Weighted random selection
                const totalWeight = weightedTasks.reduce((sum, t) => sum + t.weight, 0);
                let random = Math.random() * totalWeight;
                
                for (const { task, weight } of weightedTasks) {
                    random -= weight;
                    if (random <= 0) {
                        this.taskType = task;
                        return;
                    }
                }
            }
        }
        
        // Normal cycling: Try each task type in order, starting from the next one
        for (let i = 1; i <= taskOrder.length; i++) {
            const nextIndex = (currentIndex + i) % taskOrder.length;
            const nextTask = taskOrder[nextIndex];
            const progressLevel = TASK_PROGRESS_MAP[nextTask];
            
            // Skip task if we don't have enough words at its progress level
            if (!isTaskAllowed(nextTask)) {
                continue;
            }
            
            // Check if there are words at this progress level
            if (this.getWordsAtProgress(progressLevel).length > 0) {
                this.taskType = nextTask;
                return;
            }
        }
        
        // If no task has words at its matching level, pick based on where most incomplete words are
        const incompleteWords = this.incompleteWords;
        if (incompleteWords.length > 0) {
            // Find the most common progress level among incomplete words
            const progressCounts = [0, 1, 2, 3].map(level => ({
                level,
                count: this.getWordsAtProgress(level).length
            }));
            
            const progressToTask = {
                0: "pairs",
                1: "manyvsone", 
                2: "blockwriting",
                3: "freeformwriting"
            };
            
            // Filter out levels where the task isn't allowed
            const validCounts = progressCounts.filter(p => {
                const taskName = progressToTask[p.level];
                return isTaskAllowed(taskName) && p.count > 0;
            });
            
            if (validCounts.length > 0) {
                const maxCount = Math.max(...validCounts.map(p => p.count));
                const levelsWithMax = validCounts.filter(p => p.count === maxCount);
                
                const selectedLevel = levelsWithMax[Math.floor(Math.random() * levelsWithMax.length)].level;
                this.taskType = progressToTask[selectedLevel];
                return;
            }
        }
        
        // Default fallback
        this.taskType = "pairs";
    }

    levelCompleted() {
        // Check if session is complete
        if (this.isSessionComplete) {
            this.completeSession();
            return;
        }
        
        this.level += 1;
        this.initializeRound();
    }
    
    // Called when all words reach max progress
    completeSession() {
        // Award experience to all words in the pool
        for (const word of this.wordPool) {
            updateExperience(word.korean, word.english, 5);
        }
        this.gameCompleted = true;
    }
    
    // Update a word's session progress
    updateWordProgress(word, isCorrectFirstTry) {
        const wordInPool = this.wordPool.find(
            w => w.korean === word.korean && w.english === word.english
        );
        if (!wordInPool) return;
        
        const taskProgressLevel = TASK_PROGRESS_MAP[this.taskType];
        
        if (isCorrectFirstTry && wordInPool.sessionProgress === taskProgressLevel) {
            // Advance progress only if first try AND word is at the matching progress level
            wordInPool.sessionProgress = Math.min(wordInPool.sessionProgress + 1, MAX_PROGRESS);
            
            // Mark as recently advanced so it won't be immediately reused
            const wordKey = `${wordInPool.korean}::${wordInPool.english}`;
            this.recentlyAdvanced.add(wordKey);
        }
    }
    
    // Penalize a word on failure
    penalizeWord(word) {
        const wordInPool = this.wordPool.find(
            w => w.korean === word.korean && w.english === word.english
        );
        if (!wordInPool) return;
        
        // Reduce progress by 1, minimum 0
        wordInPool.sessionProgress = Math.max(wordInPool.sessionProgress - 1, 0);
    }

    levelReset() {
        this.failedTries = 0;
        this.selectedCards = [];
    }

    initializeRound() {
        this.levelReset();
        this.selectTaskType();

        if (this.taskType === "pairs") {
            this.setupPairsRound();
        } else if (this.taskType === "blockwriting") {
            this.setupBlockWritingRound();
        } else if (this.taskType === "manyvsone") {
            this.setupManyVsOneRound();
        } else if (this.taskType === "freeformwriting") {
            this.setupFreeFormWritingRound();
        }
    }

    setupPairsRound() {
        // Get words at progress 0 (primary) and mix in some from other levels
        // does this mix in any word or only words below max progress?
        const targetProgress = TASK_PROGRESS_MAP["pairs"]; // 0
        let targetWords = this.getWordsAtProgress(targetProgress);
        let otherWords = this.wordPool.filter(w => w.sessionProgress !== targetProgress && w.sessionProgress < MAX_PROGRESS);
        
        // Exclude recently advanced words to avoid repetition
        targetWords = this.excludeRecentlyAdvanced(targetWords);
        otherWords = this.excludeRecentlyAdvanced(otherWords);
        
        // If not enough target words, use incomplete words from any level
        if (targetWords.length < this.pairAmount) {
            targetWords = [...targetWords, ...this.shuffledWords(otherWords)];
        }
        
        this.chosenPairs = this.shuffledWords(targetWords).slice(0, this.pairAmount);
        
        // Reset failed tracking for this round
        this.failedFirstTry = new Set();
        // Clear recently advanced after using it for selection
        this.recentlyAdvanced = new Set();

        this.englishCards = this.shuffledWords(
            this.chosenPairs.map((card) => ({ type: "english", ...card, selected: false, failedOnce: false }))
        );
        this.koreanCards = this.shuffledWords(
            this.chosenPairs.map((card) => ({ type: "korean", ...card, selected: false, failedOnce: false }))
        );
    }

    setupBlockWritingRound() {
        // Get words at progress 2 (primary) or lower progress if none available
        const targetProgress = TASK_PROGRESS_MAP["blockwriting"]; // 2
        let targetWords = this.excludeRecentlyAdvanced(this.getWordsAtProgress(targetProgress));
        
        if (targetWords.length === 0) {
            // Fall back to incomplete words (excluding recently advanced)
            targetWords = this.excludeRecentlyAdvanced(this.incompleteWords);
        }
        
        if (targetWords.length === 0) {
            // All complete or recently advanced, use any word
            targetWords = this.wordPool;
        }
        
        this.chosenPairs = this.shuffledWords(targetWords).slice(0, 1);
        this.blockTask.setup(this.chosenPairs[0]);
        
        // Clear recently advanced after selection
        this.recentlyAdvanced = new Set();
    }

    setupManyVsOneRound() {
        // Get words at progress 1 (primary) or lower progress if none available
        const targetProgress = TASK_PROGRESS_MAP["manyvsone"]; // 1
        let targetWords = this.excludeRecentlyAdvanced(this.getWordsAtProgress(targetProgress));
        
        if (targetWords.length === 0) {
            targetWords = this.excludeRecentlyAdvanced(this.incompleteWords);
        }
        
        if (targetWords.length === 0) {
            targetWords = this.wordPool;
        }
        
        // Clear recently advanced after selection
        this.recentlyAdvanced = new Set();
        
        // Pick 1 target from words at the target progress level
        const shuffled = this.shuffledWords(targetWords);
        this.manyVsOneTarget = shuffled[0];
        this.manyVsOneTarget.failedOnce = false; // Track first try
        
        // Pick 3 distractors from the broader pool
        let options = [this.manyVsOneTarget];
        let potentialDistractors = this.shuffledWords(
            this.wordPool.filter(w => w.english !== this.manyVsOneTarget.english)
        );
        
        for (let i = 0; i < 3; i++) {
            if (potentialDistractors[i]) {
                options.push(potentialDistractors[i]);
            }
        }
        
        this.manyVsOneOptions = this.shuffledWords(options);
        
        // Randomize direction
        this.manyVsOnePromptDirection = Math.random() > 0.5 ? "english-to-korean" : "korean-to-english";
    }

    setupFreeFormWritingRound() {
        // Get words at progress 3 (primary) or lower progress if none available
        const targetProgress = TASK_PROGRESS_MAP["freeformwriting"]; // 3
        let targetWords = this.excludeRecentlyAdvanced(this.getWordsAtProgress(targetProgress));
        
        if (targetWords.length === 0) {
            targetWords = this.excludeRecentlyAdvanced(this.incompleteWords);
        }
        
        if (targetWords.length === 0) {
            targetWords = this.wordPool;
        }
        
        this.chosenPairs = this.shuffledWords(targetWords).slice(0, 1);
        this.freeFormTask.setup(this.chosenPairs[0]);
        
        // Clear recently advanced after selection
        this.recentlyAdvanced = new Set();
    }

    // --- Interaction Logic ---

    handleCardPick(card) {
        card.selected = true;
        this.selectedCards.push(card);

        if (this.selectedCards.length >= 2) {
            const card1 = this.selectedCards[0];
            const card2 = this.selectedCards[1];
            const wordKey = `${card1.korean}::${card1.english}`;

            if (card1.english === card2.english && card1.type !== card2.type) {
                // Match found
                const isFirstTry = !this.failedFirstTry.has(wordKey);
                
                // Update progress based on first try success
                this.updateWordProgress(card1, isFirstTry);
                
                // Remove cards
                this.englishCards = this.englishCards.filter(c => c.english !== card1.english);
                this.koreanCards = this.koreanCards.filter(c => c.korean !== card1.korean);

                if (this.englishCards.length === 0 && this.koreanCards.length === 0) {
                    this.levelCompleted();
                }
            } else {
                // No match - mark both words as failed first try
                const key1 = `${card1.korean}::${card1.english}`;
                const key2 = `${card2.korean}::${card2.english}`;
                
                if (!this.failedFirstTry.has(key1)) {
                    this.failedFirstTry.add(key1);
                    this.penalizeWord(card1);
                }
                if (!this.failedFirstTry.has(key2)) {
                    this.failedFirstTry.add(key2);
                    this.penalizeWord(card2);
                }
            }
            
            // Reset selection
            this.selectedCards.forEach(c => c.selected = false);
            this.selectedCards = [];
        }
    }

    handleManyVsOneChoice(option) {
        const isCorrect = option.english === this.manyVsOneTarget.english;
        
        if (isCorrect) {
            const isFirstTry = !this.manyVsOneTarget.failedOnce;
            this.updateWordProgress(this.manyVsOneTarget, isFirstTry);
            this.levelCompleted();
        } else {
            if (!this.manyVsOneTarget.failedOnce) {
                this.manyVsOneTarget.failedOnce = true;
                this.penalizeWord(this.manyVsOneTarget);
            }
            this.failedTries += 1;
        }
    }

    calculateCompletionRate(difficulty) {
        const wordsOfDifficulty = this.words.filter(word => word.difficulty === difficulty);
        if (wordsOfDifficulty.length === 0) return "0.00";
        const learnedWords = wordsOfDifficulty.filter(word => word.experience >= 25);
        return (learnedWords.length / wordsOfDifficulty.length * 100).toFixed(2);
    }
}
