<script>
    import words from "$lib/data/words.json";

    let activeWords = $state(1);
    let pairAmount = $state(5);
    let selectedPairs = $state([]);

    const shuffledWords = (array) => {
        return array
          .sort(() => Math.random() - 0.5);
    }

    let initializeRound = () => {
        selectedPairs = shuffledWords(words).slice(0, pairAmount);
    };

    initializeRound();
</script>

<div>
    <h1>Hi there</h1>
    <ul>
        {#each selectedPairs as pair}
            <li>
                Korean: {pair.korean}, English: {pair.english}
            </li>
        {/each}
    </ul>
</div>

<style>
</style>