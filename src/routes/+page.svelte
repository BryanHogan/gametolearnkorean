<script>
    import Button from "$lib/components/Button.svelte";
    import words from "$lib/data/words.json";

    // set words array (if one exist in local storage use that, if not create new)
    // -> then use that as base for initializeRound

    let pairAmount = $state(5);
    let chosenPairs = $state([]); // The pairs chosen at the beginning of the round.

    let englishCards = $state([]);
    let koreanCards = $state([]);

    let selectedCards = $state([]); // Contains up to 2 cards, cards that have been clicked.

    // Game Stat Information
    let level = $state(1);
    let score = $state(0);

    const shuffledWords = (array) => {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    };

    let initializeRound = () => {
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

        console.log(
            "English Cards Array:",
            JSON.stringify(englishCards, null, 2),
        );
        console.log("Korean Cards Array:" + koreanCards);
    };

    const cardPicked = (card) => {
        console.log("Card picked: " + JSON.stringify(card, null, 2));
        selectedCards.push(card);
        console.log(
            "selectedCards Content: " + JSON.stringify(selectedCards, null, 2),
        );
        console.log(selectedCards.length);
        if (selectedCards.length >= 2) {
            if (
                selectedCards[0].english == selectedCards[1].english &&
                selectedCards[0].type != selectedCards[1].type
            ) {
                // remove cards from englishCards and koreanCards
                englishCards = englishCards.filter(
                    (c) => c.english !== selectedCards[0].english,
                );
                koreanCards = koreanCards.filter(
                    (c) => c.korean !== selectedCards[0].korean,
                );

                console.log("Correct!");
                score += 1;
                if (englishCards.length == 0 && koreanCards.length == 0) {
                    initializeRound();
                }
            }
            selectedCards = [];
        }
    };

    initializeRound();
</script>

<div>
    <h1>Hi there</h1>
    <p>Score: {score}</p>
    <div class="card-grid-container">
        <ul class="card-grid">
            {#each englishCards as card}
                <li>
                    <Button type="grow" onclick={() => cardPicked(card)}
                        ><p>{card.english}</p></Button
                    >
                </li>
            {/each}
        </ul>
        <ul class="card-grid">
            {#each koreanCards as card}
                <li>
                    <Button type="grow" onclick={() => cardPicked(card)}
                        ><p>{card.korean}</p></Button
                    >
                </li>
            {/each}
        </ul>
    </div>
</div>

<style>
    .card-grid-container {
        display: flex;
        border: 1px solid red;
        justify-content: space-between;
        padding: 2rem;
        max-width: 400px;
    }
    .card-grid {
        display: grid;
        grid-template-columns: 1fr;
        grid-auto-rows: 4rem;
        grid-auto-flow: row;
        flex: 1;
    }
</style>
