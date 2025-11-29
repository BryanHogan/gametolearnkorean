import { speakKorean } from "$lib/util/audio.svelte.js";

export class ManyVsOneTask {
    // State
    target = $state(null);
    options = $state([]);
    promptDirection = $state("english-to-korean");

    constructor(game) {
        this.game = game;
    }
    
    setup(targetWord, distractors) {
        this.target = { ...targetWord, failedOnce: false };
        
        // Combine target with distractors and shuffle
        const allOptions = [this.target, ...distractors];
        this.options = this.game.shuffledWords(allOptions);
        
        // Randomize prompt direction
        this.promptDirection = Math.random() > 0.5 ? "english-to-korean" : "korean-to-english";
    }

    handleInput(option) {
        const isCorrect = option.english === this.target.english;

        if (isCorrect) {
            const isFirstTry = !this.target.failedOnce;
            this.game.updateWordProgress(this.target, isFirstTry);
            
            // Speak the Korean word
            speakKorean(this.target.korean);
            
            this.game.levelCompleted();
        } else {
            this.game.totalMistakes += 1;
            
            if (!this.target.failedOnce) {
                this.target.failedOnce = true;
                this.game.penalizeWord(this.target);
            }
            this.game.failedTries += 1;
        }
    }
}
