<script>
    import Button from "$lib/components/Button.svelte";
    
    let { game } = $props();
</script>

<div class="block-container flow margin-inline-auto">
    <h2 class="text-align-center">{game.blockMode.englishBlockWord}</h2>
    <p class="text-align-center">{game.blockMode.inputHint}</p>
    <p class="text-align-center">{game.blockMode.blockInput || "---"}</p>
    <div class="korean-blocks-container">
        {#each game.blockMode.koreanBlockInputs as block}
            <Button
                type="block-neutral"
                onclick={() => game.blockMode.handleInput(block)}
            >
                {block}
            </Button>
        {/each}
    </div>
</div>

<style>
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
</style>
