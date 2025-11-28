import { speakKorean } from "$lib/util/audio.svelte.js";

export class FreeFormTask {
    game = null;
    
    englishWord = $state("");
    koreanWord = $state("");
    userInput = $state("");
    inputHint = $state("");
    failedTries = $state(0);
    showSuccess = $state(false);
    currentWord = null;

    constructor(game) {
        this.game = game;
    }

    setup(word) {
        this.currentWord = word;
        this.englishWord = word.english;
        this.koreanWord = word.korean;
        this.userInput = "";
        this.inputHint = "";
        this.failedTries = 0;
        this.showSuccess = false;
    }

    handleInput() {
        const normalizedInput = this.userInput.trim();
        const normalizedTarget = this.koreanWord.trim();
        
        if (normalizedInput === normalizedTarget) {
            // Correct answer
            const isFirstTry = this.failedTries === 0;
            this.game.updateWordProgress(this.currentWord, isFirstTry);
            
            // Speak the Korean word
            speakKorean(this.koreanWord);
            
            this.showSuccess = true;
            // Brief delay before moving to next level for feedback
            setTimeout(() => {
                this.game.levelCompleted();
            }, 500);
        } else {
            // Wrong answer
            this.game.totalMistakes += 1;
            
            if (this.failedTries === 0) {
                // First failure - penalize
                this.game.penalizeWord(this.currentWord);
            }
            this.failedTries += 1;
            // Provide progressive hints after failures
            if (this.failedTries >= 2) {
                const hintLength = Math.min(this.failedTries - 1, this.koreanWord.length);
                this.inputHint = "Hint: " + this.koreanWord.slice(0, hintLength) + "...";
            }
            if (this.failedTries >= 4) {
                // After 4 failures, show the full answer
                this.inputHint = "Answer: " + this.koreanWord;
            }
        }
    }

    clearInput() {
        this.userInput = "";
    }
}
