import { wordData, updateExperience } from "$lib/util/store.svelte.js";
import { BlockTask } from "$lib/util/tasks/block-task.svelte.js";

export class Game {
    // Game State
    gameStart = $state(false);
    level = $state(1);
    taskType = $state("pairs"); // "pairs", "blockwriting", "manyvsone"
    
    // Data
    words = wordData;
    wordPool = $state([]);
    
    // Round State
    chosenPairs = $state([]);
    englishCards = $state([]);
    koreanCards = $state([]);
    selectedCards = $state([]);
    failedTries = $state(0);
    
    // Task Types
    blockTask = new BlockTask(this);

    // Many Vs One State
    manyVsOneTarget = $state(null);
    manyVsOneOptions = $state([]);
    manyVsOnePromptDirection = $state("english-to-korean");

    // Options
    wordPoolLimit = $state("unlimited");
    includeLevel1Cards = $state(true);
    includeLevel2Cards = $state(false);
    includeLevel3Cards = $state(false);

    constructor() {
        // Initialize if needed
    }

    get pairAmount() {
        return Math.min(this.level / 5 + 5, 10);
    }

    startGame() {
        this.gameStart = true;
        this.levelReset();
        
        let filteredWords = this.words.filter((word) => {
            return (
                (this.includeLevel1Cards && word.difficulty === 1) ||
                (this.includeLevel2Cards && word.difficulty === 2) ||
                (this.includeLevel3Cards && word.difficulty === 3)
            );
        });

        if (this.wordPoolLimit == "unlimited") {
            this.wordPool = filteredWords;
        } else if (this.wordPoolLimit == "50") {
            this.wordPool = this.shuffledWords(filteredWords).slice(0, 50);
        }
        
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
        // Cycle through task types: Pairs -> Blockwriting -> ManyVsOne
        const taskRotation = this.level % 3;
        if (taskRotation === 1) {
            this.taskType = "blockwriting";
        } else if (taskRotation === 2) {
            this.taskType = "manyvsone";
        } else {
            this.taskType = "pairs";
        }
    }

    levelCompleted() {
        this.level += 1;
        this.initializeRound();
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
        }
    }

    setupPairsRound() {
        this.chosenPairs = this.shuffledWords(this.wordPool).slice(0, this.pairAmount);

        const averageExperience =
            this.chosenPairs.reduce((sum, pair) => sum + pair.experience, 0) /
            this.chosenPairs.length;

        if (averageExperience > 3 && this.chosenPairs.length > 3) {
            this.chosenPairs.sort((a, b) => b.experience - a.experience);
            this.chosenPairs.splice(0, 3);
            const newPairs = this.shuffledWords(this.wordPool).slice(0, 3);
            this.chosenPairs = this.chosenPairs.concat(newPairs);
        }

        this.englishCards = this.shuffledWords(
            this.chosenPairs.map((card) => ({ type: "english", ...card, selected: false }))
        );
        this.koreanCards = this.shuffledWords(
            this.chosenPairs.map((card) => ({ type: "korean", ...card, selected: false }))
        );
    }

    setupBlockWritingRound() {
        this.chosenPairs = this.shuffledWords(this.wordPool).slice(0, 1);
        this.blockTask.setup(this.chosenPairs[0]);
    }

    setupManyVsOneRound() {
        // Pick 1 target
        const shuffled = this.shuffledWords(this.wordPool);
        this.manyVsOneTarget = shuffled[0];
        
        // Pick 3 distractors
        let options = [this.manyVsOneTarget];
        let potentialDistractors = shuffled.slice(1);
        
        for (let i = 0; i < 3; i++) {
            if (potentialDistractors[i]) {
                options.push(potentialDistractors[i]);
            }
        }
        
        this.manyVsOneOptions = this.shuffledWords(options);
        
        // Randomize direction
        this.manyVsOnePromptDirection = Math.random() > 0.5 ? "english-to-korean" : "korean-to-english";
    }

    // --- Interaction Logic ---

    handleCardPick(card) {
        card.selected = true;
        this.selectedCards.push(card);

        if (this.selectedCards.length >= 2) {
            const card1 = this.selectedCards[0];
            const card2 = this.selectedCards[1];

            if (card1.english === card2.english && card1.type !== card2.type) {
                // Match found
                updateExperience(card1.korean, card1.english, 3);
                
                // Remove cards
                this.englishCards = this.englishCards.filter(c => c.english !== card1.english);
                this.koreanCards = this.koreanCards.filter(c => c.korean !== card1.korean);

                if (this.englishCards.length === 0 && this.koreanCards.length === 0) {
                    this.levelCompleted();
                }
            } else {
                // No match - wait briefly then deselect (handled by UI or immediate reset)
                // For now, immediate reset as per original logic
            }
            
            // Reset selection
            this.selectedCards.forEach(c => c.selected = false);
            this.selectedCards = [];
        }
    }

    handleManyVsOneChoice(option) {
        const isCorrect = option.english === this.manyVsOneTarget.english;
        
        if (isCorrect) {
             updateExperience(this.manyVsOneTarget.korean, this.manyVsOneTarget.english, 3);
             this.levelCompleted();
        } else {
             this.failedTries += 1;
             // TODO: Add visual feedback for failure
        }
    }

    calculateCompletionRate(difficulty) {
        const wordsOfDifficulty = this.words.filter(word => word.difficulty === difficulty);
        if (wordsOfDifficulty.length === 0) return "0.00";
        const learnedWords = wordsOfDifficulty.filter(word => word.experience >= 25);
        return (learnedWords.length / wordsOfDifficulty.length * 100).toFixed(2);
    }
}
