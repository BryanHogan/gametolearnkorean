<script>
    import Button from "$lib/components/Button.svelte";
    
    let { game } = $props();
    
    function handleKeydown(event) {
        if (event.key === "Enter") {
            event.preventDefault();
            game.freeFormTask.handleInput();
        }
    }
</script>

<div class="freeform-container margin-inline-auto">
    <h2 class="text-align-center">{game.freeFormTask.englishWord}</h2>
    
    {#if game.freeFormTask.inputHint}
        <p class="text-align-center">{game.freeFormTask.inputHint}</p>
    {/if}
    
    {#if game.freeFormTask.showSuccess}
        <p class="text-align-center">Correct! ✓</p>
    {/if}
    
    <input
        type="text"
        class="korean-input"
        bind:value={game.freeFormTask.userInput}
        onkeydown={handleKeydown}
        placeholder="한국어..."
        autocomplete="off"
        autocorrect="off"
        autocapitalize="off"
        spellcheck="false"
        lang="ko"
    />
    
    <div class="button-row">
        <Button 
            type="neutral grow" 
            onclick={() => game.freeFormTask.showHint()}
        >
            Hint
        </Button>
        <Button 
            type="accent-low grow" 
            onclick={() => game.freeFormTask.handleInput()}
        >
            Submit
        </Button>
    </div>
    
    {#if game.freeFormTask.failedTries > 0}
        <p class="tries text-align-center">
            Attempts: {game.freeFormTask.failedTries}
        </p>
    {/if}
</div>

<style>
    .freeform-container {
        max-width: 400px;
        width: 100%;
        padding-block: var(--space-m);
    }
    
    .korean-input {
        width: 100%;
        padding: var(--space-m);
        margin-bottom: var(--space-s);
        margin-top: var(--space-s);
        font-size: var(--font-size-large);
        text-align: center;
        border: 2px solid var(--color-border);
        border-radius: var(--border-radius-m);
        background-color: var(--color-neutral-900);
        color: var(--text-primary);
    }
    
    .korean-input:focus {
        outline: none;
        border-color: var(--color-accent-700);
    }
    
    .korean-input::placeholder {
        color: var(--text-muted);
        opacity: 0.6;
    }
    
    .button-row {
        display: flex;
        gap: var(--space-m);
        justify-content: center;
    }
    
    .tries {
        color: var(--text-muted);
        font-size: var(--font-size-small);
    }
</style>
