import { wordData, wordDataReady, updateExperience } from "$lib/util/store.svelte.js";
import { buildWordPool, shuffleWords } from "$lib/util/word-selection.svelte.js";
import { BlockTask } from "$lib/util/tasks/block-task.svelte.js";
import { FreeFormTask } from "$lib/util/tasks/freeform-task.svelte.js";
import { ManyVsOneTask } from "$lib/util/tasks/many-vs-one-task.svelte.js";
import { PairsTask } from "$lib/util/tasks/pairs-task.svelte.js";

// Maps task types to the progress level they correspond to
const TASK_PROGRESS_MAP = {
    "pairs": 0,        // Task Type A - words at progress 0
    "manyvsone": 1,    // Task Type B - words at progress 1
    "blockwriting": 2, // Task Type C - words at progress 2
    "freeformwriting": 3 // Task Type D - words at progress 3
};

// XP awarded per task type on first-try success
const XP_PER_TASK = {
    "pairs": 1,
    "manyvsone": 1,
    "blockwriting": 2,
    "freeformwriting": 5
};

const MAX_PROGRESS = 4;

export class Game {
    // Game State
    gameStart = $state(false);
    gameCompleted = $state(false);
    noCardsSelected = $state(false); // True when word pool is empty due to filter settings
    level = $state(1);
    taskType = $state("pairs"); // "pairs", "blockwriting", "manyvsone", "freeformwriting"
    
    // Data
    words = wordData;
    wordPool = $state([]); // Words with sessionProgress attached

    // User stats
    totalCorrect = $state(0);
    totalMistakes = $state(0);
    timeAtGameStart = $state(new Date());
    timeAtGameEnd = $state(null);
    
    // Streak tracking
    currentStreak = $state(0); // Consecutive correct answers since last mistake
    recentlyFailedWords = $state([]); // Words failed since last correct answer (for book modal)
    
    // Round State
    failedTries = $state(0);
    
    // Track words that recently advanced (to avoid same word appearing in consecutive tasks)
    recentlyAdvanced = $state(new Set());
    
    // Task Types
    pairsTask = new PairsTask(this);
    manyVsOneTask = new ManyVsOneTask(this);
    blockTask = new BlockTask(this);
    freeFormTask = new FreeFormTask(this);

    // Options
    wordPoolLimit = $state("50");
    includeLevel1Cards = $state(true);
    includeLevel2Cards = $state(true);
    includeLevel3Cards = $state(true);
    useExperienceBias = $state(true);

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

    async startGame() {
        // Wait for IndexedDB experience data to be loaded before building pool
        await wordDataReady;
        
        this.gameStart = true;
        this.gameCompleted = false;
        this.noCardsSelected = false;
        this.level = 1;
        this.totalCorrect = 0;
        this.totalMistakes = 0;
        this.currentStreak = 0;
        this.recentlyFailedWords = [];
        this.timeAtGameStart = new Date();
        this.levelReset();
        
        this.wordPool = buildWordPool(this.words, {
            poolLimit: this.wordPoolLimit,
            includeLevel1: this.includeLevel1Cards,
            includeLevel2: this.includeLevel2Cards,
            includeLevel3: this.includeLevel3Cards,
            useExperienceBias: this.useExperienceBias
        });
        
        // Guard against empty word pool (e.g., all difficulty levels unchecked)
        if (this.wordPool.length === 0) {
            this.noCardsSelected = true;
            return;
        }
        
        this.initializeRound();
    }

    shuffledWords(array) {
        return shuffleWords(array);
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
        
        // Reset failed words for the new round
        this.recentlyFailedWords = [];
        
        this.level += 1;
        this.initializeRound();
    }
    
    // Called when all words reach max progress
    completeSession() {
        this.timeAtGameEnd = new Date();
        // Experience is now awarded incrementally per task completion
        this.gameCompleted = true;
    }
    
    // Session duration in seconds
    get sessionDuration() {
        if (!this.timeAtGameEnd) return 0;
        return Math.floor((this.timeAtGameEnd.getTime() - this.timeAtGameStart.getTime()) / 1000);
    }
    
    // Formatted duration as M:SS
    get formattedDuration() {
        const mins = Math.floor(this.sessionDuration / 60);
        const secs = this.sessionDuration % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }
    
    // Calculate accuracy percentage
    get accuracy() {
        const total = this.totalCorrect + this.totalMistakes;
        if (total === 0) return 100;
        return Math.round((this.totalCorrect / total) * 100);
    }
    
    // Calculate score based on words, accuracy, and time
    get score() {
        const accuracy = this.totalCorrect + this.totalMistakes > 0 
            ? this.totalCorrect / (this.totalCorrect + this.totalMistakes) 
            : 1;
        const timeBonus = Math.max(0, 300 - this.sessionDuration); // Bonus for finishing under 5 min
        return Math.round((this.wordPool.length * 100 * accuracy) + timeBonus);
    }
    
    // Update a word's session progress
    updateWordProgress(word, isCorrectFirstTry) {
        const wordInPool = this.wordPool.find(
            w => w.korean === word.korean && w.english === word.english
        );
        if (!wordInPool) return;
        
        const taskProgressLevel = TASK_PROGRESS_MAP[this.taskType];
        
        if (isCorrectFirstTry) {
            this.totalCorrect += 1;
            this.currentStreak += 1;
            
            // Award experience based on task type
            const xpAmount = XP_PER_TASK[this.taskType] || 1;
            updateExperience(wordInPool.korean, wordInPool.english, xpAmount);
            
            if (wordInPool.sessionProgress === taskProgressLevel) {
                // Advance progress only if word is at the matching progress level
                wordInPool.sessionProgress = Math.min(wordInPool.sessionProgress + 1, MAX_PROGRESS);
                
                // Mark as recently advanced so it won't be immediately reused
                const wordKey = `${wordInPool.korean}::${wordInPool.english}`;
                this.recentlyAdvanced.add(wordKey);
            }
        }
    }
    
    // Penalize a word on failure
    penalizeWord(word) {
        const wordInPool = this.wordPool.find(
            w => w.korean === word.korean && w.english === word.english
        );
        if (!wordInPool) return;
        
        // Reset streak and track failed word
        this.currentStreak = 0;
        // Add to recently failed if not already there
        const alreadyFailed = this.recentlyFailedWords.some(
            w => w.korean === word.korean && w.english === word.english
        );
        if (!alreadyFailed) {
            this.recentlyFailedWords = [...this.recentlyFailedWords, wordInPool];
        }
        
        // Reduce progress by 1, minimum 0
        wordInPool.sessionProgress = Math.max(wordInPool.sessionProgress - 1, 0);
    }

    levelReset() {
        this.failedTries = 0;
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
        
        const selectedWords = this.shuffledWords(targetWords).slice(0, this.pairAmount);
        
        // Setup the pairs task with selected words
        this.pairsTask.setup(selectedWords);
        
        // Clear recently advanced after using it for selection
        this.recentlyAdvanced = new Set();
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
        
        // Pick 1 target from words at the target progress level
        const shuffled = this.shuffledWords(targetWords);
        const target = shuffled[0];
        
        // Pick up to 3 distractors from the broader pool
        const potentialDistractors = this.shuffledWords(
            this.wordPool.filter(w => w.english !== target.english)
        ).slice(0, 3);
        
        // Setup the many-vs-one task with target and distractors
        this.manyVsOneTask.setup(target, potentialDistractors);
        
        // Clear recently advanced after selection
        this.recentlyAdvanced = new Set();
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

    calculateCompletionRate(difficulty) {
        const wordsOfDifficulty = this.words.filter(word => word.difficulty === difficulty);
        if (wordsOfDifficulty.length === 0) return "0.00";
        const learnedWords = wordsOfDifficulty.filter(word => word.experience >= 25);
        return (learnedWords.length / wordsOfDifficulty.length * 100).toFixed(2);
    }
}
