import { getSimilarBlock, getRandomKoreanBlock } from "$lib/util/korean.svelte";
import { updateExperience } from "$lib/util/store.svelte.js";

export class BlockTask {
    game = null;
    
    englishBlockWord = $state("");
    koreanBlockWord = $state("");
    koreanBlocks = $state([""]);
    koreanBlockInputs = $state([]);
    blockInput = $state("");
    inputHint = $state("");
    failedTries = $state(0);

    constructor(game) {
        this.game = game;
    }

    setup(word) {
        this.englishBlockWord = word.english;
        this.koreanBlockWord = word.korean;
        this.koreanBlocks = word.korean.split("");
        this.blockInput = "";
        this.inputHint = "";
        this.failedTries = 0;
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
                updateExperience(this.koreanBlockWord, this.englishBlockWord, 5);
                this.game.levelCompleted();
            } else {
                this.failedTries += 1;
                if (this.failedTries >= 3) {
                    this.inputHint = "Hint: " + this.koreanBlockWord.slice(0, Math.max(0, Math.min(this.failedTries - 2, this.koreanBlockWord.length)));
                }
                this.blockInput = "";
            }
        }
    }
}
