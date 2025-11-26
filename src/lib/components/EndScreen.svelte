<script>
    import Button from "$lib/components/Button.svelte";
    
    let { game, onRestart } = $props();
</script>

<div class="end-screen margin-inline-auto text-align-center">
    <h1 class="margin-bottom-m">🎉 Session Complete!</h1>
    
    <div class="stats-grid">
        <div class="stat-card">
            <span class="stat-value">{game.level}</span>
            <span class="stat-label">Rounds</span>
        </div>
        <div class="stat-card">
            <span class="stat-value">{game.formattedDuration}</span>
            <span class="stat-label">Time</span>
        </div>
        <div class="stat-card">
            <span class="stat-value">{game.accuracy}%</span>
            <span class="stat-label">Accuracy</span>
        </div>
        <div class="stat-card">
            <span class="stat-value">{game.wordPool.length}</span>
            <span class="stat-label">Words</span>
        </div>
    </div>
    
    <div class="score-container margin-top-m margin-bottom-m">
        <span class="score-label">Score</span>
        <span class="score-value">{game.score}</span>
    </div>
    
    <p class="margin-bottom-m">Experience has been added to each word.</p>
    
    <Button type="accent grow" onclick={onRestart}>
        Start New Session
    </Button>
</div>

<style>
    .end-screen {
        container-type: inline-size;
        width: 100%;
        max-width: 400px;
        padding: var(--space-m);
    }
    
    .end-screen h1 {
        font-size: var(--text-size-xl);
    }
    
    .stats-grid {
        display: grid;
        grid-template-columns: 1fr;
        gap: var(--space-s);
    }
    
    .stat-card {
        background-color: var(--color-neutral-800);
        border-radius: var(--border-radius-m);
        padding: var(--space-m);
        display: flex;
        flex-direction: column;
        gap: var(--space-2xs);
    }
    
    .stat-value {
        font-size: var(--text-size-xl);
        font-weight: var(--font-weight-bold);
        color: var(--color-accent-500);
    }
    
    .stat-label {
        font-size: var(--font-size-small);
        color: var(--color-neutral-400);
    }
    
    .score-container {
        background-color: var(--color-neutral-800);
        border-radius: var(--border-radius-m);
        padding: var(--space-l);
    }
    
    .score-label {
        display: block;
        font-size: var(--font-size-small);
        color: var(--color-neutral-400);
        margin-bottom: var(--space-xs);
    }
    
    .score-value {
        font-size: var(--text-size-3xl);
        font-weight: var(--font-weight-bold);
        color: var(--color-accent-500);
    }

    @container (min-width: 280px) {
        .stats-grid {
            grid-template-columns: repeat(2, 1fr);
        }
    }
</style>