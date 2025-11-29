import { speakKorean } from "$lib/util/audio.svelte.js";

export class PairsTask {
    // State
    chosenPairs = $state([]);
    englishCards = $state([]);
    koreanCards = $state([]);
    selectedCards = $state([]);
    failedFirstTry = $state(new Set());

    constructor(game) {
        this.game = game;
    }

    setup(words) {
        this.chosenPairs = words;
        this.selectedCards = [];
        this.failedFirstTry = new Set();

        this.englishCards = this.game.shuffledWords(
            this.chosenPairs.map((card) => ({ type: "english", ...card, selected: false, failedOnce: false }))
        );
        this.koreanCards = this.game.shuffledWords(
            this.chosenPairs.map((card) => ({ type: "korean", ...card, selected: false, failedOnce: false }))
        );
    }

    handleInput(card) {
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
                this.game.updateWordProgress(card1, isFirstTry);
                
                // Speak the Korean word
                speakKorean(card1.korean);

                // Remove cards
                this.englishCards = this.englishCards.filter(c => c.english !== card1.english);
                this.koreanCards = this.koreanCards.filter(c => c.korean !== card1.korean);

                if (this.englishCards.length === 0 && this.koreanCards.length === 0) {
                    this.game.levelCompleted();
                }
            } else if (card1.type !== card2.type) {
                // No match (but different card types, so it's a real attempt)
                this.game.totalMistakes += 1;
                
                // Mark both words as failed first try
                const key1 = `${card1.korean}::${card1.english}`;
                const key2 = `${card2.korean}::${card2.english}`;

                if (!this.failedFirstTry.has(key1)) {
                    this.failedFirstTry.add(key1);
                    this.game.penalizeWord(card1);
                }
                if (!this.failedFirstTry.has(key2)) {
                    this.failedFirstTry.add(key2);
                    this.game.penalizeWord(card2);
                }
            }
            // If same card type selected (e.g., two English cards), just reset selection without penalty

            // Reset selection
            this.selectedCards.forEach(c => c.selected = false);
            this.selectedCards = [];
        }
    }
}
