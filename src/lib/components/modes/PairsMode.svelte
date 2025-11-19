<script>
    import Button from "$lib/components/Button.svelte";
    
    let { game } = $props();
</script>

<div class="card-grid-container margin-inline-auto">
    <ul class="card-grid" role="list">
        {#each game.englishCards as card}
            <li>
                <Button
                    type={"grow card-neutral " + (card.selected ? "selected" : "")}
                    onclick={() => game.handleCardPick(card)}
                >
                    <p>{card.english}</p>
                </Button>
            </li>
        {/each}
    </ul>
    <ul class="card-grid" role="list">
        {#each game.koreanCards as card}
            <li>
                <Button
                    type={"grow card-neutral " + (card.selected ? "selected" : "")}
                    onclick={() => game.handleCardPick(card)}
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
</style>
