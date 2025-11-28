import { getSimilarBlock, getRandomKoreanBlock } from "$lib/util/korean.svelte";
import { speakKorean } from "$lib/util/audio.svelte.js";

export class BlockTask {
    game = null;
    
    englishBlockWord = $state("");
    koreanBlockWord = $state("");
    koreanBlocks = $state([""]);
    koreanBlockInputs = $state([]);
    blockInput = $state("");
    inputHint = $state("");
    failedTriesCurrentRound = $state(0);
    currentWord = null;

    constructor(game) {
        this.game = game;
    }

    setup(word) {
        this.currentWord = word;
        this.englishBlockWord = word.english;
        this.koreanBlockWord = word.korean;
        this.koreanBlocks = word.korean.split("");
        this.blockInput = "";
        this.inputHint = "";
        this.failedTriesCurrentRound = 0;
        this.generateInputs();
    }

    generateInputs() {
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
        this.koreanBlockInputs = this.game.shuffledWords(inputs);
    }

    handleInput(block) {
        this.blockInput += block;
        
        if (this.blockInput.length === this.koreanBlockWord.length) {
            if (this.blockInput === this.koreanBlockWord) {
                // Correct answer
                const isFirstTry = this.failedTriesCurrentRound === 0;
                this.game.updateWordProgress(this.currentWord, isFirstTry);
                
                // Speak the Korean word
                speakKorean(this.koreanBlockWord);
                
                this.game.levelCompleted();
            } else {
                // Wrong answer
                this.game.totalMistakes += 1;
                
                if (this.failedTriesCurrentRound === 0) {
                    // First failure - penalize
                    this.game.penalizeWord(this.currentWord);
                }
                this.failedTriesCurrentRound += 1;
                if (this.failedTriesCurrentRound >= 3) {
                    this.inputHint = "Hint: " + this.koreanBlockWord.slice(0, Math.max(0, Math.min(this.failedTriesCurrentRound - 2, this.koreanBlockWord.length)));
                }
                this.blockInput = "";
            }
        }
    }
}
