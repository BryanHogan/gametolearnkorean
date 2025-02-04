<script>
    import Button from "$lib/components/Button.svelte";
    import { wordData, updateExperience } from "$lib/util/store.svelte.js";
    import {
        getSimilarBlock,
        getRandomKoreanBlock,
    } from "$lib/util/korean.svelte";

    // set words array (if one exist in local storage use that, if not create new)
    // -> then use that as base for initializeRound

    let words = wordData;
    let wordPool;

    let gameStart = $state(false);
    let level = $state(1);
    let pairAmount = $derived(Math.min(level / 5 + 5, 10));
    let chosenPairs = $state([]);

    let englishCards = $state([]);
    let koreanCards = $state([]);

    let selectedCards = $state([]);
    let failedTries = $state(0);

    let levelType = $state("pairs"); // "pairs", "onetomany (wip)", "blockwriting"

    // For blockwriting level type
    let englishBlockWord = $state("");
    let koreanBlockWord = $state("");
    let koreanBlocks = $state([""]);
    let koreanBlockInputs = $state([]);
    let blockInput = $state("");
    let inputHint = $state("");

    // Options at game start
    let wordPoolLimit = $state("unlimited");
    let includeLevel1Cards = $state(true);
    let includeLevel2Cards = $state(false);
    let includeLevel3Cards = $state(false);

    function getSimilarBlockInputs() {
        let inputs = koreanBlocks.flatMap((block) => [
            block,
            ...getSimilarBlock(block),
        ]);
        while (inputs.length < 2) {
            let extra = koreanBlocks.flatMap(getSimilarBlock).flat();
            inputs.push(...extra);
            inputs = [...new Set(inputs)];
        }
        inputs.push(getRandomKoreanBlock(), getRandomKoreanBlock());
        inputs = [...new Set(inputs)];
        inputs = shuffledWords(inputs);
        koreanBlockInputs = inputs;
    }

    function startGame() {
        gameStart = true;
        levelReset();
        let filteredWords = words.filter((word) => {
            return (
                (includeLevel1Cards && word.difficulty === 1) ||
                (includeLevel2Cards && word.difficulty === 2) ||
                (includeLevel3Cards && word.difficulty === 3)
            );
        });
        if (wordPoolLimit == "unlimited") {
            wordPool = filteredWords;
        } else if (wordPoolLimit == "50") {
            wordPool = shuffledWords(filteredWords).slice(0, 50);
        }
        initializeRound();
    }

    const shuffledWords = (array) => {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    };
    // change to 5 === 0 later
    function selectLevelType() {
        if (level % 2 === 1) {
            levelType = "blockwriting";
        } else {
            levelType = "pairs";
        }
    }

    function levelCompleted() {
        level += 1;
        initializeRound();
    }

    function levelReset() {
        blockInput = "";
        koreanBlockWord = "";
        englishBlockWord = "";
        failedTries = 0;
        inputHint = "";
    }

    function initializeRound() {
        levelReset();
        selectLevelType();
        if (levelType === "pairs") {
            chosenPairs = shuffledWords(wordPool).slice(0, pairAmount);

            const averageExperience =
                chosenPairs.reduce((sum, pair) => sum + pair.experience, 0) /
                chosenPairs.length;

            if (averageExperience > 3 && chosenPairs.length > 3) {
                chosenPairs.sort((a, b) => b.experience - a.experience);
                chosenPairs.splice(0, 3);
                const newPairs = shuffledWords(wordPool).slice(0, 3);
                chosenPairs = chosenPairs.concat(newPairs);
            }
            englishCards = chosenPairs.map((card) => ({
                type: "english",
                ...card,
            }));
            englishCards = shuffledWords(englishCards);
            koreanCards = chosenPairs.map((card) => ({
                type: "korean",
                ...card,
            }));
            koreanCards = shuffledWords(koreanCards);
        }
        if (levelType === "blockwriting") {
            chosenPairs = shuffledWords(wordPool).slice(0, 1); // add condition for certain experience level needed later
            englishBlockWord = chosenPairs[0].english;
            koreanBlockWord = chosenPairs[0].korean;
            koreanBlocks = chosenPairs[0].korean.split("");
            getSimilarBlockInputs();
        }
    };

    const cardPicked = (card) => {
        card.selected = true;
        selectedCards.push(card);
        if (selectedCards.length >= 2) {
            if (
                selectedCards[0].english == selectedCards[1].english &&
                selectedCards[0].type != selectedCards[1].type
            ) {
                updateExperience(
                    selectedCards[0].korean,
                    selectedCards[0].english,
                    3,
                );
                englishCards = englishCards.filter(
                    (c) => c.english !== selectedCards[0].english,
                ); // Maybe this filter needs to be more specific in case words have same English or Korean translation
                koreanCards = koreanCards.filter(
                    (c) => c.korean !== selectedCards[0].korean,
                );

                if (englishCards.length == 0 && koreanCards.length == 0) {
                    levelCompleted();
                }
            } else if (true) {
            }
            selectedCards.forEach((card) => (card.selected = false));
            selectedCards = [];
        }
    };

    const blockButtonInput = (block) => {
        blockInput = blockInput + block;
        console.log(blockInput);

        if (blockInput.length == koreanBlockWord.length) {
            if (blockInput === koreanBlockWord) {
                updateExperience(
                    chosenPairs[0].korean,
                    chosenPairs[0].english,
                    5,
                );
                levelCompleted();
            } else {
                failedTries += 1;
                if (failedTries >= 3) {
                    inputHint =
                        "Hint: " +
                        koreanBlockWord.slice(
                            0,
                            Math.max(
                                0,
                                Math.min(
                                    failedTries - 2,
                                    koreanBlockWord.length,
                                ),
                            ),
                        );
                }
                blockInput = "";
            }
        }
    };

    function calculateCompletionRate(difficulty) {
        const wordsOfDifficulty = words.filter(word => word.difficulty === difficulty);
        const learnedWords = wordsOfDifficulty.filter(word => word.experience >= 25);
        return (learnedWords.length / wordsOfDifficulty.length * 100).toFixed(2);
    }
</script>

<div class="base-layout">
    {#if gameStart}
        <p class="text-align-center margin-top-l margin-bottom-s">
            Level: {level}
        </p>
        {#if levelType === "pairs"}
            <div class="card-grid-container margin-inline-auto">
                <ul class="card-grid" role="list">
                    {#each englishCards as card}
                        <li>
                            <Button
                                type={"grow card-neutral " +
                                    (card.selected ? "selected" : "")}
                                onclick={() => cardPicked(card)}
                                ><p>{card.english}</p></Button
                            >
                        </li>
                    {/each}
                </ul>
                <ul class="card-grid" role="list">
                    {#each koreanCards as card}
                        <li>
                            <Button
                                type={"grow card-neutral " +
                                    (card.selected ? "selected" : "")}
                                onclick={() => cardPicked(card)}
                                ><p>{card.korean}</p></Button
                            >
                        </li>
                    {/each}
                </ul>
            </div>
        {/if}

        {#if levelType === "blockwriting"}
            <div class="block-container flow margin-inline-auto">
                <h2 class="text-align-center">{englishBlockWord}</h2>
                <p class="text-align-center">{inputHint}</p>
                <p class="text-align-center">{blockInput || "---"}</p>
                <div class="korean-blocks-container">
                    {#each koreanBlockInputs as block}
                        <Button
                            type="block-neutral"
                            onclick={() => blockButtonInput(block)}
                            >{block}</Button
                        >
                    {/each}
                </div>
            </div>
        {/if}
    {:else}
        <h1 class="text-align-center margin-top-m margin-bottom-s">
            Game To Learn Korean
        </h1>
        <div class="options-container">
            <div class="wordpool-option-container">
                <label for={wordPoolLimit}>Select wordpool to use:</label>
                <select bind:value={wordPoolLimit}>
                    <option value="unlimited">Unlimited</option>
                    <option value="50">50 words</option>
                </select>
            </div>
            <div class="difficulty-checkbox-container">
                <p class="margin-bottom-xs">Select difficulty levels to include:</p>
                <div>
                    <label>
                        <input type="checkbox" bind:checked={includeLevel1Cards} />
                        Level 1
                    </label>
                    <label>
                        <input type="checkbox" bind:checked={includeLevel2Cards} />
                        Level 2
                    </label>
                    <label>
                        <input type="checkbox" bind:checked={includeLevel3Cards} />
                        Level 3
                    </label>
                </div>
            </div>
        </div>
        <div class="margin-inline-auto" style="max-width: 350px; width: 100%">
            <Button type="accent grow" onclick={() => startGame()}
                >Start Game</Button
            >
        </div>
        <div class="stats-container">
            <p>Completion rate level 1 cards: {calculateCompletionRate(1)}%</p>
            <p>Completion rate level 2 cards: {calculateCompletionRate(2)}%</p>
            <p>Completion rate level 3 cards: {calculateCompletionRate(3)}%</p>
        </div>
    {/if}
</div>

<style>
    .card-grid-container {
        display: flex;
        justify-content: space-between;
        padding-block: var(--space-m);
        max-width: 400px;
        width: 100%;
        gap: var(--space-xl);
    }
    .card-grid {
        display: grid;
        grid-template-columns: 1fr;
        grid-auto-rows: 1fr;
        row-gap: var(--space-m);
        grid-auto-flow: row;
        flex: 1;
    }
    .block-container {
        max-width: 400px;
        width: 100%;
        padding-block: var(--space-m);
    }
    .korean-blocks-container {
        display: flex;
        flex-wrap: wrap;
        flex-direction: row;
        justify-content: center;
        gap: var(--space-s);
        flex: 1;
    }

    .options-container {
        max-width: 450px;
        width: 100%;
        margin: var(--space-s) auto;
        &>div {
            padding: var(--space-m);
            margin-block: var(--space-m);
            background-color: var(--color-neutral-800);
            border-radius: var(--border-radius-m);
        }
        & .difficulty-checkbox-container >div {
            display: flex;
            flex-wrap: wrap;
            justify-content: flex-start;
            gap: var(--space-s);
            & >* {
                border: 1px solid var(--color-neutral-700);
                padding: var(--space-2xs);
                border-radius: var(--border-radius-s)
            }
        }
    }

    .options-container select,
    .options-container input[type="checkbox"] {
        margin-right: var(--space-2xs);
        background-color: var(--color-neutral-700);
        border: 1px solid var(--color-accent-800);
        border-radius: var(--border-radius-s);
        padding: var(--space-2xs);
        accent-color: var(--color-accent-500);
    }
    .stats-container {
        margin-inline: auto;
        margin-block: var(--space-xl);
        color: var(--color-neutral-300);
    }
</style>
