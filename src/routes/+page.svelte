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
<main class="base-layout">
    {#if game.gameCompleted}
        <EndScreen {game} onRestart={restartGame} />
    {:else if game.noCardsSelected}
        <div class="no-cards-message">
            <h2>No Cards Selected</h2>
            <p>Please select at least one difficulty level to start the game.</p>
            <Button type="accent" onclick={() => { game.noCardsSelected = false; game.gameStart = false; }}>
                Back to Settings
            </Button>
        </div>
    {:else if game.gameStart}
        <div class="progress-bar margin-top-m margin-bottom-s margin-inline-auto">
            <p class="text-align-center">
                Round: {game.level} 
            </p>
        </div>
        
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
    .progress-bar {
        max-width: 400px;
    }
    
    .no-cards-message {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text-align: center;
        padding: var(--space-xl);
        margin-top: var(--space-xl);
        gap: var(--space-m);
    }
    
    .no-cards-message h2 {
        font-size: var(--text-size-2xl);
        color: var(--color-neutral-100);
    }
    
    .no-cards-message p {
        color: var(--color-neutral-400);
    }
</style>

