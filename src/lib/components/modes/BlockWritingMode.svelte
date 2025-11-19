<script>
    import Button from "$lib/components/Button.svelte";
    
    let { game } = $props();
</script>

<div class="block-container flow margin-inline-auto">
    <h2 class="text-align-center">{game.englishBlockWord}</h2>
    <p class="text-align-center">{game.inputHint}</p>
    <p class="text-align-center">{game.blockInput || "---"}</p>
    <div class="korean-blocks-container">
        {#each game.koreanBlockInputs as block}
            <Button
                type="block-neutral"
                onclick={() => game.handleBlockInput(block)}
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
