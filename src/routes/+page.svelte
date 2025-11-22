<script>
    import { Game } from "$lib/util/game.svelte.js";
    import StartScreen from "$lib/components/StartScreen.svelte";
    import PairsTask from "$lib/components/tasks/PairsTask.svelte";
    import BlockWritingTask from "$lib/components/tasks/BlockWritingTask.svelte";
    import ManyVsOneTask from "$lib/components/tasks/ManyVsOneTask.svelte";

    // Initialize the game state
    const game = new Game();
</script>

<div class="base-layout">
    {#if game.gameStart}
        <p class="text-align-center margin-top-l margin-bottom-s">
            Level: {game.level}
        </p>
        
        {#if game.taskType === "pairs"}
            <PairsTask {game} />
        {/if}

        {#if game.taskType === "blockwriting"}
            <BlockWritingTask {game} />
        {/if}

        {#if game.taskType === "manyvsone"}
            <ManyVsOneTask {game} />
        {/if}
    {:else}
        <StartScreen {game} />
    {/if}
</div>

