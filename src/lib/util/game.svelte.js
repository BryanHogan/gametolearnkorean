import { getSimilarBlock, getRandomKoreanBlock } from "$lib/util/korean.svelte";
import { wordData, updateExperience } from "$lib/util/store.svelte.js";

export class Game {
    // Game State
    gameStart = $state(false);
    level = $state(1);
    levelType = $state("pairs"); // "pairs", "blockwriting", "manyvsone"
    
    // Data
    words = wordData;
    wordPool = $state([]);
    
    // Round State
    chosenPairs = $state([]);
    englishCards = $state([]);
    koreanCards = $state([]);
    selectedCards = $state([]);
    
    // Block Writing State
    englishBlockWord = $state("");
    koreanBlockWord = $state("");
    koreanBlocks = $state([""]);
    koreanBlockInputs = $state([]);
    blockInput = $state("");
    inputHint = $state("");
    failedTries = $state(0);

    // Many Vs One State
    manyVsOneTarget = $state(null);
    manyVsOneOptions = $state([]);
    manyVsOneModeType = $state("english-to-korean");

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

    selectLevelType() {
        // Cycle through modes: Pairs -> Blockwriting -> ManyVsOne
        const mode = this.level % 3;
        if (mode === 1) {
            this.levelType = "blockwriting";
        } else if (mode === 2) {
            this.levelType = "manyvsone";
        } else {
            this.levelType = "pairs";
        }
    }

    levelCompleted() {
        this.level += 1;
        this.initializeRound();
    }

    levelReset() {
        this.blockInput = "";
        this.koreanBlockWord = "";
        this.englishBlockWord = "";
        this.failedTries = 0;
        this.inputHint = "";
        this.selectedCards = [];
    }

    initializeRound() {
        this.levelReset();
        this.selectLevelType();

        if (this.levelType === "pairs") {
            this.setupPairsRound();
        } else if (this.levelType === "blockwriting") {
            this.setupBlockWritingRound();
        } else if (this.levelType === "manyvsone") {
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
        this.englishBlockWord = this.chosenPairs[0].english;
        this.koreanBlockWord = this.chosenPairs[0].korean;
        this.koreanBlocks = this.chosenPairs[0].korean.split("");
        this.getSimilarBlockInputs();
    }

    getSimilarBlockInputs() {
        let inputs = this.koreanBlocks.flatMap((block) => [
            block,
            ...getSimilarBlock(block),
        ]);
        while (inputs.length < 2) {
            let extra = this.koreanBlocks.flatMap(getSimilarBlock).flat();
            inputs.push(...extra);
            inputs = [...new Set(inputs)];
        }
        inputs.push(getRandomKoreanBlock(), getRandomKoreanBlock());
        inputs = [...new Set(inputs)];
        this.koreanBlockInputs = this.shuffledWords(inputs);
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
        this.manyVsOneModeType = Math.random() > 0.5 ? "english-to-korean" : "korean-to-english";
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

    handleBlockInput(block) {
        this.blockInput += block;
        
        if (this.blockInput.length === this.koreanBlockWord.length) {
            if (this.blockInput === this.koreanBlockWord) {
                updateExperience(this.chosenPairs[0].korean, this.chosenPairs[0].english, 5);
                this.levelCompleted();
            } else {
                this.failedTries += 1;
                if (this.failedTries >= 3) {
                    this.inputHint = "Hint: " + this.koreanBlockWord.slice(0, Math.max(0, Math.min(this.failedTries - 2, this.koreanBlockWord.length)));
                }
                this.blockInput = "";
            }
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
