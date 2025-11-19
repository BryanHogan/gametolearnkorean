<script>
    import Button from "$lib/components/Button.svelte";
    
    let { game } = $props();
    
    let prompt = $derived(game.manyVsOneModeType === "english-to-korean" ? game.manyVsOneTarget.english : game.manyVsOneTarget.korean);
</script>

<div class="mode-container flow margin-inline-auto">
    <h2 class="text-align-center margin-bottom-m">{prompt}</h2>
    
    <div class="options-grid">
        {#each game.manyVsOneOptions as option}
            <Button 
                type="grow card-neutral" 
                onclick={() => game.handleManyVsOneChoice(option)}
            >
                {#if game.manyVsOneModeType === "english-to-korean"}
                    {option.korean}
                {:else}
                    {option.english}
                {/if}
            </Button>
        {/each}
    </div>
</div>

<style>
    .mode-container {
        max-width: 400px;
        width: 100%;
        padding-block: var(--space-m);
    }
    .options-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: var(--space-m);
    }
</style>
