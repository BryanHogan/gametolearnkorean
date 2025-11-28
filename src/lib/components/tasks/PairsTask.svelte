<script>
    import Button from "$lib/components/Button.svelte";
    
    let { game } = $props();
</script>

<div class="card-grid-container margin-inline-auto">
    <ul class="card-grid" role="list">
        {#each game.pairsTask.englishCards as card}
            <li>
                <Button
                    type={"grow card-neutral " + (card.selected ? "selected" : "")}
                    onclick={() => game.pairsTask.handleInput(card)}
                >
                    <p>{card.english}</p>
                </Button>
            </li>
        {/each}
    </ul>
    <ul class="card-grid" role="list">
        {#each game.pairsTask.koreanCards as card}
            <li>
                <Button
                    type={"grow card-neutral " + (card.selected ? "selected" : "")}
                    onclick={() => game.pairsTask.handleInput(card)}
                >
                    <p>{card.korean}</p>
                </Button>
            </li>
        {/each}
    </ul>
</div>

<style>
    .card-grid-container {
        display: flex;
        justify-content: space-between;
        padding-block: var(--space-m);
        gap: var(--space-xl);
        width: 100%;
        max-width: 32rem;
    }
    .card-grid {
        display: grid;
        grid-template-columns: 1fr;
        grid-auto-rows: auto;
        width: fit-content;
        row-gap: var(--space-m);
        grid-auto-flow: row;
        flex: 1;
    }
</style>
