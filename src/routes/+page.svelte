<script>
    import { Game } from "$lib/util/game.svelte.js";
    import Header from "$lib/components/Header.svelte";
    import StartScreen from "$lib/components/StartScreen.svelte";
    import EndScreen from "$lib/components/EndScreen.svelte";
    import Button from "$lib/components/Button.svelte";
    import PairsTask from "$lib/components/tasks/PairsTask.svelte";
    import BlockWritingTask from "$lib/components/tasks/BlockWritingTask.svelte";
    import ManyVsOneTask from "$lib/components/tasks/ManyVsOneTask.svelte";
    import FreeFormWritingTask from "$lib/components/tasks/FreeFormWritingTask.svelte";

    const game = new Game();
    
    function restartGame() {
        game.gameStart = false;
        game.gameCompleted = false;
    }
</script>

<Header {game} />
<main class="base-layout game-view">
    {#if game.gameCompleted}
        <EndScreen {game} onRestart={restartGame} />
    {:else if game.noCardsSelected}
        <section class="no-cards-message">
            <div class="message-card">
                <h2>No Cards Selected</h2>
                <p>Please select at least one difficulty level to start the game.</p>
                <Button type="accent" onclick={() => { game.noCardsSelected = false; game.gameStart = false; }}>
                    Back to Settings
                </Button>
            </div>
        </section>
    {:else if game.gameStart}
        <p class="round-indicator">Round: {game.level} | Match the pairs</p>
        
        {#if game.taskType === "pairs"}
            <PairsTask {game} />
        {/if}

        {#if game.taskType === "blockwriting"}
            <BlockWritingTask {game} />
        {/if}

        {#if game.taskType === "manyvsone"}
            <ManyVsOneTask {game} />
        {/if}

        {#if game.taskType === "freeformwriting"}
            <FreeFormWritingTask {game} />
        {/if}
    {:else}
        <StartScreen {game} />
    {/if}
</main>

<style>
    .game-view {
        padding-block: var(--space-m) var(--space-l);
        row-gap: var(--space-m);
        column-gap: 0;
        overflow-x: hidden;
    }

    .round-indicator {
        text-align: center;
        color: var(--color-neutral-400);
    }

    /* No Cards Message */
    .no-cards-message {
        display: flex;
        justify-content: center;
        align-items: center;
        padding: var(--space-xl) 0;
    }

    .message-card {
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        background: var(--color-neutral-800);
        border: 1px solid var(--color-neutral-700);
        border-radius: var(--border-radius-m);
        padding: var(--space-xl) var(--space-l);
        gap: var(--space-m);
        max-width: 400px;
        width: 100%;
    }
    
    .message-card h2 {
        margin: 0;
        font-size: var(--text-size-xl);
        font-weight: var(--font-weight-bold);
        color: var(--color-neutral-100);
    }
    
    .message-card p {
        margin: 0;
        color: var(--color-neutral-400);
        font-size: var(--font-size-small);
    }

    /* Mobile adjustments */
    @media (max-width: 30rem) {
        .game-view {
            padding-block: var(--space-s) var(--space-m);
            row-gap: var(--space-s);
        }

        .message-card {
            padding: var(--space-l) var(--space-m);
        }
    }
</style>

