import { speakKorean } from "$lib/util/audio.svelte.js";

export class FreeFormTask {
    englishWord = $state("");
    koreanWord = $state("");
    userInput = $state("");
    inputHint = $state("");
    failedTries = $state(0);
    showSuccess = $state(false);
    hintUsed = $state(false);

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
        this.hintUsed = false;
    }

    handleInput() {
        const normalizedInput = this.userInput.trim();
        const normalizedTarget = this.koreanWord.trim();
        
        if (normalizedInput === normalizedTarget) {
            // Correct answer
            const isFirstTry = this.failedTries === 0 && !this.hintUsed;
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

    showHint() {
        // Calculate current hint length
        const hintPrefix = "Hint: ";
        const answerPrefix = "Answer: ";
        let currentHintLength = 0;
        
        if (this.inputHint.startsWith(hintPrefix)) {
            currentHintLength = this.inputHint.replace(hintPrefix, "").replace("...", "").length;
        } else if (this.inputHint.startsWith(answerPrefix)) {
            // Already showing full answer
            return;
        }
        
        // Progressive reveal - show one more character
        const nextHintLength = currentHintLength + 1;
        this.hintUsed = true;
        
        if (nextHintLength >= this.koreanWord.length) {
            this.inputHint = answerPrefix + this.koreanWord;
        } else {
            this.inputHint = hintPrefix + this.koreanWord.slice(0, nextHintLength) + "...";
        }
    }
}
