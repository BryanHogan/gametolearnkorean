<script>
    import { Game } from "$lib/util/game.svelte.js";
    import StartScreen from "$lib/components/StartScreen.svelte";
    import EndScreen from "$lib/components/EndScreen.svelte";
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

<main class="base-layout">
    {#if game.gameCompleted}
        <EndScreen {game} onRestart={restartGame} />
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
</main>

<style>
    .progress-bar {
        max-width: 400px;
    }
</style>

