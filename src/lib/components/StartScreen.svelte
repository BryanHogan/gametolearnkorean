<script>
    import Button from "$lib/components/Button.svelte";
    
    let { game } = $props();
</script>

<h1 class="text-align-center margin-top-m margin-bottom-s">
    Game To Learn Korean
</h1>

<div class="options-container">
    <div class="wordpool-option-container">
        <label for="wordpool-select">Select wordpool to use:</label>
        <select id="wordpool-select" bind:value={game.wordPoolLimit}>
            <option value="unlimited">Unlimited</option>
            <option value="50">50 words</option>
        </select>
    </div>
    <div class="difficulty-checkbox-container">
        <p class="margin-bottom-xs">Select difficulty levels to include:</p>
        <div>
            <label>
                <input type="checkbox" bind:checked={game.includeLevel1Cards} />
                Level 1
            </label>
            <label>
                <input type="checkbox" bind:checked={game.includeLevel2Cards} />
                Level 2
            </label>
            <label>
                <input type="checkbox" bind:checked={game.includeLevel3Cards} />
                Level 3
            </label>
        </div>
    </div>
</div>

<div class="margin-inline-auto" style="max-width: 350px; width: 100%">
    <Button type="accent grow" onclick={() => game.startGame()}>Start Game</Button>
</div>

<div class="stats-container">
    <p>Completion rate level 1 cards: {game.calculateCompletionRate(1)}%</p>
    <p>Completion rate level 2 cards: {game.calculateCompletionRate(2)}%</p>
    <p>Completion rate level 3 cards: {game.calculateCompletionRate(3)}%</p>
</div>

<style>
    .options-container {
        max-width: 450px;
        width: 100%;
        margin: var(--space-s) auto;
    }
    .options-container > div {
        padding: var(--space-m);
        margin-block: var(--space-m);
        background-color: var(--color-neutral-800);
        border-radius: var(--border-radius-m);
    }
    .difficulty-checkbox-container > div {
        display: flex;
        flex-wrap: wrap;
        justify-content: flex-start;
        gap: var(--space-s);
    }
    .difficulty-checkbox-container > div > * {
        border: 1px solid var(--color-neutral-700);
        padding: var(--space-2xs);
        border-radius: var(--border-radius-s);
    }

    .options-container select,
    .options-container input[type="checkbox"] {
        margin-right: var(--space-2xs);
        background-color: var(--color-neutral-700);
        border: 1px solid var(--color-accent-800);
        border-radius: var(--border-radius-s);
        padding: var(--space-2xs);
        accent-color: var(--color-accent-500);
    }
    .stats-container {
        margin-inline: auto;
        margin-block: var(--space-xl);
        color: var(--color-neutral-300);
    }
</style>
