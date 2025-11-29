<script>
    import Button from "$lib/components/Button.svelte";
    
    let { game } = $props();
</script>

<div class="task-container flow margin-inline-auto">
    <h2 class="text-align-center margin-bottom-m">{game.manyVsOneTask.target.korean}</h2>
    
    <div class="options-grid">
        {#each game.manyVsOneTask.options as option}
            <Button 
                type="grow card-neutral" 
                onclick={() => game.manyVsOneTask.handleInput(option)}
            >
                {option.english}
            </Button>
        {/each}
    </div>
</div>

<style>
    .task-container {
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
