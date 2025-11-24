<script>
    import Button from "$lib/components/Button.svelte";
    
    let { game } = $props();
    
    function handleKeydown(event) {
        if (event.key === "Enter") {
            event.preventDefault();
            game.freeFormTask.handleSubmit();
        }
    }
</script>

<div class="freeform-container margin-inline-auto">
    <h2 class="text-align-center">{game.freeFormTask.englishWord}</h2>
    <p class="instruction text-align-center">Type the Korean translation</p>
    
    {#if game.freeFormTask.inputHint}
        <p class="hint text-align-center">{game.freeFormTask.inputHint}</p>
    {/if}
    
    {#if game.freeFormTask.showSuccess}
        <p class="success text-align-center">Correct! ✓</p>
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
            type="grow accent-low" 
            onclick={() => game.freeFormTask.clearInput()}
        >
            Clear
        </Button>
        <Button 
            type="grow accent-low" 
            onclick={() => game.freeFormTask.handleSubmit()}
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
    
    .instruction {
        color: var(--color-text-muted);
        font-size: var(--font-size-s);
    }
    
    .hint {
        color: var(--color-warning);
        font-size: var(--font-size-s);
    }
    
    .success {
        color: var(--color-success);
        font-weight: bold;
    }
    
    .korean-input {
        width: 100%;
        padding: var(--space-m);
        font-size: var(--font-size-l);
        text-align: center;
        border: 2px solid var(--color-border);
        border-radius: var(--radius-m);
        background-color: var(--color-surface);
        color: var(--color-text);
    }
    
    .korean-input:focus {
        outline: none;
        border-color: var(--color-primary);
    }
    
    .korean-input::placeholder {
        color: var(--color-text-muted);
        opacity: 0.6;
    }
    
    .button-row {
        display: flex;
        gap: var(--space-m);
        justify-content: center;
    }
    
    .tries {
        color: var(--color-text-muted);
        font-size: var(--font-size-s);
    }
</style>
