<script>
    import { Game } from "$lib/util/game.svelte.js";
    import StartScreen from "$lib/components/StartScreen.svelte";
    import PairsTask from "$lib/components/tasks/PairsTask.svelte";
    import BlockWritingTask from "$lib/components/tasks/BlockWritingTask.svelte";
    import ManyVsOneTask from "$lib/components/tasks/ManyVsOneTask.svelte";
    import FreeFormWritingTask from "$lib/components/tasks/FreeFormWritingTask.svelte";
    import Button from "$lib/components/Button.svelte";

    // Initialize the game state
    const game = new Game();
    
    function restartGame() {
        game.gameStart = false;
        game.gameCompleted = false;
    }
</script>

<div class="base-layout">
    {#if game.gameCompleted}
        <div class="completion-screen margin-inline-auto text-align-center">
            <h1>🎉 Session Complete!</h1>
            <p class="margin-top-m">You've mastered all {game.wordPool.length} words in this session!</p>
            <p class="margin-top-s">Experience has been added to each word.</p>
            <div class="margin-top-l">
                <Button type="primary" onclick={restartGame}>
                    Start New Session
                </Button>
            </div>
        </div>
    {:else if game.gameStart}
        <div class="progress-bar margin-top-m margin-bottom-s margin-inline-auto">
            <p class="text-align-center">
                Level: {game.level} | Progress: {game.wordPool.filter(w => w.sessionProgress >= 4).length}/{game.wordPool.length} words mastered
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
</div>

<style>
    .completion-screen {
        max-width: 400px;
        padding: var(--space-xl);
    }
    
    .completion-screen h1 {
        font-size: var(--font-size-xl);
    }
    
    .progress-bar {
        max-width: 400px;
    }
</style>

