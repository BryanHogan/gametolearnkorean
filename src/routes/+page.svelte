<script>
    import Button from "$lib/components/Button.svelte";
    import words from "$lib/data/words.json";
    import {
        getSimilarBlock,
        getRandomKoreanBlock,
    } from "$lib/util/korean.svelte";

    // set words array (if one exist in local storage use that, if not create new)
    // -> then use that as base for initializeRound

    let level = $state(1);
    let pairAmount = $derived(Math.min((level / 5) + 5, 10));
    let chosenPairs = $state([]);

    let englishCards = $state([]);
    let koreanCards = $state([]);

    let selectedCards = $state([]);

    let levelType = $state("pairs"); // "pairs", "onetomany", "blockwriting"

    let score = $state(0);

    // For blockwriting level type
    let englishBlockWord = $state("");
    let koreanBlockWord = $state("");
    let koreanBlocks = $state([""]);
    let koreanBlockInputs = $state([]);
    let blockInput = $state("");

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

    const shuffledWords = (array) => {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    };
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

    let initializeRound = () => {
        blockInput = "";
        koreanBlockWord = "";
        englishBlockWord = "";
        selectLevelType();
        if (levelType === "pairs") {
            chosenPairs = shuffledWords(words).slice(0, pairAmount);

            const averageExperience =
                chosenPairs.reduce((sum, pair) => sum + pair.experience, 0) /
                chosenPairs.length;

            if (averageExperience > 3 && chosenPairs.length > 3) {
                chosenPairs.sort((a, b) => b.experience - a.experience);
                chosenPairs.splice(0, 3);
                const newPairs = shuffledWords(words).slice(0, 3);
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
            chosenPairs = shuffledWords(words).slice(0, 1); // add condition for certain experience level needed later
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
                englishCards = englishCards.filter(
                    (c) => c.english !== selectedCards[0].english,
                );
                koreanCards = koreanCards.filter(
                    (c) => c.korean !== selectedCards[0].korean,
                );

                console.log("Correct!");
                score += 1;
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
                levelCompleted();
            } else {
                blockInput = "";
            }
        }
    }

    initializeRound();
</script>

<div class="base-layout">
    <h1>Hi there</h1>
    <p>Score: {score} Level: {level}</p>
    {#if levelType === "pairs"}
        <div class="card-grid-container">
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
        <div class="block-container">
            <p class="text-align-center">{englishBlockWord}</p>
            <p>{blockInput}</p>
            <div class="korean-blocks-container">
                {#each koreanBlockInputs as block}
                    <Button type="block-neutral" onclick={() => blockButtonInput(block)}>{block}</Button>
                {/each}
            </div>
        </div>
    {/if}
</div>

<style>
    .card-grid-container {
        display: flex;
        border: 1px solid red;
        justify-content: space-between;
        padding: 2rem;
        max-width: 400px;
        gap: var(--space-xl);
    }
    .card-grid {
        display: grid;
        grid-template-columns: 1fr;
        grid-auto-rows: 4rem;
        grid-auto-flow: row;
        flex: 1;
    }
    .block-container {
        max-width: 400px;
        border: 1px solid red;
        padding: 2rem;
    }
    .korean-blocks-container {
        display: flex;
        flex-direction: row;
        justify-content: center;
        gap: var(--space-s);
        flex: 1;
    }
</style>
