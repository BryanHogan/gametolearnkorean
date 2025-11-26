export class ManyVsOneTask {
    game = null;

    // State
    target = $state(null);
    options = $state([]);
    promptDirection = $state("english-to-korean");

    constructor(game) {
        this.game = game;
    }

    /**
     * Initialize the many-vs-one round with a target word and distractors.
     * @param {Object} targetWord - The target word object
     * @param {Array} distractors - Array of distractor word objects
     */
    setup(targetWord, distractors) {
        this.target = { ...targetWord, failedOnce: false };
        
        // Combine target with distractors and shuffle
        const allOptions = [this.target, ...distractors];
        this.options = this.game.shuffledWords(allOptions);
        
        // Randomize prompt direction
        this.promptDirection = Math.random() > 0.5 ? "english-to-korean" : "korean-to-english";
    }

    /**
     * Handle option selection.
     * @param {Object} option - The selected option object
     */
    handleInput(option) {
        const isCorrect = option.english === this.target.english;

        if (isCorrect) {
            const isFirstTry = !this.target.failedOnce;
            this.game.updateWordProgress(this.target, isFirstTry);
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
