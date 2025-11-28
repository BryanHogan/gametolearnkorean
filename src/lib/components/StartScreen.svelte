<script>
    import Button from "$lib/components/Button.svelte";
    import { updateSetting } from "$lib/util/settings.svelte.js";
    
    let { game } = $props();
    
    function handleExperienceBiasChange(event) {
        game.useExperienceBias = event.target.checked;
        updateSetting('experienceBias', event.target.checked);
    }
</script>

<header class="page-header">
    <h1>Game To Learn Korean</h1>
</header>

<section class="settings-card">
    <div class="setting-group">
        <label class="setting-label" for="wordpool-select">Word Pool Size</label>
        <select id="wordpool-select" bind:value={game.wordPoolLimit}>
            <option value="unlimited">Unlimited</option>
            <option value="50">50 words</option>
            <option value="20">20 words</option>
        </select>
    </div>

    <div class="setting-group">
        <p class="setting-label">Difficulty Levels</p>
        <div class="difficulty-pills">
            <label class:active={game.includeLevel1Cards}>
                <input type="checkbox" bind:checked={game.includeLevel1Cards} />
                Level 1
            </label>
            <label class:active={game.includeLevel2Cards}>
                <input type="checkbox" bind:checked={game.includeLevel2Cards} />
                Level 2
            </label>
            <label class:active={game.includeLevel3Cards}>
                <input type="checkbox" bind:checked={game.includeLevel3Cards} />
                Level 3
            </label>
        </div>
    </div>

    <div class="setting-group">
        <p class="setting-label">Further Settings</p>
        <label class="toggle-option">
            <input type="checkbox" checked={game.useExperienceBias} onchange={handleExperienceBiasChange} />
            <span>Prioritize less practiced words</span>
        </label>
    </div>
</section>

<section class="action-buttons">
    <Button type="accent grow" onclick={() => game.startGame()}><strong>Start Game</strong></Button>
    <a href="/vocabulary" class="vocab-link">or browse your vocabulary →</a>
</section>

<footer class="completion-stats">
    <p class="stats-heading">Your Progress</p>
    <span>Difficulty 1 mastered: {game.calculateCompletionRate(1)}%</span>
    <span>Difficulty 2 mastered: {game.calculateCompletionRate(2)}%</span>
    <span>Difficulty 3 mastered: {game.calculateCompletionRate(3)}%</span>
</footer>

<style>
    /* Header */
    .page-header {
        text-align: center;
    }

    .page-header h1 {
        margin: 0;
        font-size: var(--text-size-xl);
        font-weight: var(--font-weight-bold);
    }

    /* Settings Card */
    .settings-card {
        background: var(--color-neutral-800);
        border: 1px solid var(--color-neutral-700);
        border-radius: var(--border-radius-m);
        padding: var(--space-m);
        max-width: 400px;
        width: 100%;
        margin-inline: auto;
        display: flex;
        flex-direction: column;
        gap: var(--space-m);
    }

    .setting-group {
        display: flex;
        flex-direction: column;
        gap: var(--space-xs);
    }

    .setting-label {
        margin: 0;
        font-size: var(--font-size-small);
        color: var(--color-neutral-400);
    }

    .settings-card select {
        width: 100%;
        padding: var(--space-xs) var(--space-s);
        border-radius: var(--border-radius-s);
        border: 1px solid var(--color-neutral-700);
        background: var(--color-neutral-700);
        color: var(--color-neutral-100);
        font-size: 1rem;
        cursor: pointer;
    }

    .settings-card select:focus {
        outline: none;
        border-color: var(--color-accent-600);
    }

    /* Difficulty Pills */
    .difficulty-pills {
        display: flex;
        flex-wrap: wrap;
        gap: var(--space-xs);
    }

    .difficulty-pills label {
        display: flex;
        align-items: center;
        gap: var(--space-2xs);
        padding: var(--space-xs) var(--space-s);
        background: var(--color-neutral-800);
        border: 1px solid var(--color-neutral-700);
        border-radius: var(--border-radius-s);
        font-size: var(--font-size-small);
        color: var(--color-neutral-300);
        cursor: pointer;
    }

    .difficulty-pills label.active {
        background: var(--color-neutral-700);
        color: var(--color-neutral-100);
    }

    .difficulty-pills input[type="checkbox"] {
        accent-color: var(--color-accent-500);
        width: 1rem;
        height: 1rem;
    }

    /* Toggle Option */
    .toggle-option {
        display: flex;
        align-items: center;
        gap: var(--space-s);
        cursor: pointer;
        color: var(--color-neutral-200);
    }

    .toggle-option input[type="checkbox"] {
        accent-color: var(--color-accent-500);
        width: 1.125rem;
        height: 1.125rem;
    }

    /* Action Buttons */
    .action-buttons {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: var(--space-s);
        max-width: 350px;
        width: 100%;
        margin-inline: auto;
    }

    .vocab-link {
        font-size: var(--font-size-base);
        color: var(--color-neutral-400);
        text-decoration: none;
    }

    .vocab-link:hover {
        color: var(--color-accent-500);
    }

    /* Completion Stats */
    .completion-stats {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: var(--space-2xs);
        margin-top: var(--space-l);
        font-size: var(--font-size-base);
        color: var(--color-neutral-500);
    }

    .stats-heading {
        margin: 0 0 var(--space-2xs) 0;
        color: var(--color-neutral-400);
        font-weight: var(--font-weight-semi-bold);
    }

    /* Mobile adjustments */
    @media (max-width: 30rem) {
        .settings-card {
            padding: var(--space-s);
        }

        .difficulty-pills {
            flex-direction: column;
        }

        .difficulty-pills label {
            justify-content: center;
        }
    }
</style>
