<script>
    import { Game } from "$lib/util/game.svelte.js";
    import StartScreen from "$lib/components/StartScreen.svelte";
    import PairsMode from "$lib/components/modes/PairsMode.svelte";
    import BlockWritingMode from "$lib/components/modes/BlockWritingMode.svelte";
    import ManyVsOneMode from "$lib/components/modes/ManyVsOneMode.svelte";

    // Initialize the game state
    const game = new Game();
</script>

<div class="base-layout">
    {#if game.gameStart}
        <p class="text-align-center margin-top-l margin-bottom-s">
            Level: {game.level}
        </p>
        
        {#if game.levelType === "pairs"}
            <PairsMode {game} />
        {/if}

        {#if game.levelType === "blockwriting"}
            <BlockWritingMode {game} />
        {/if}

        {#if game.levelType === "manyvsone"}
            <ManyVsOneMode {game} />
        {/if}
    {:else}
        <StartScreen {game} />
    {/if}
</div>

