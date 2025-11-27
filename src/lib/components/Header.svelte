<script>
    import Icons from "$lib/components/icons/index.js";
    import Modal from "$lib/components/Modal.svelte";
    
    let { game = null } = $props();
    
    // Modal state
    let isInfoOpen = $state(false);
    let isSettingsOpen = $state(false);
    let isBookOpen = $state(false);
    let isStreakOpen = $state(false);
    // Book modal filter state
    let showOnlyFailed = $state(true);

    const openStreak = () => {
        isStreakOpen = true;
        isInfoOpen = false;
        isSettingsOpen = false;
        isBookOpen = false;
    };

    const openInfo = () => {
        isInfoOpen = true;
        isStreakOpen = false;
        isSettingsOpen = false;
        isBookOpen = false;
    };

    const openSettings = () => {
        isSettingsOpen = true;
        isStreakOpen = false;
        isInfoOpen = false;
        isBookOpen = false;
    };
    
    const openBook = () => {
        isBookOpen = true;
        isStreakOpen = false;
        isInfoOpen = false;
        isSettingsOpen = false;
        showOnlyFailed = true; // Default to showing only failed words
    };

    const closeAll = () => {
        isStreakOpen = false;
        isInfoOpen = false;
        isSettingsOpen = false;
        isBookOpen = false;
    };

    const handleEscape = (event) => {
        if (event.key === "Escape") {
            closeAll();
        }
    };
    
    // Derived state for progress
    const isGameActive = $derived(game?.gameStart && !game?.gameCompleted);
    const totalCount = $derived(game?.wordPool?.length ?? 0);
    const totalProgressSteps = $derived(
        game?.wordPool?.reduce((sum, word) => {
            const progress = Math.min(4, Math.max(0, word.sessionProgress ?? 0));
            return sum + progress;
        }, 0) ?? 0
    );
    const progressPercent = $derived(
        totalCount > 0 ? (totalProgressSteps / (totalCount * 4)) * 100 : 0
    );
    const hasFailedWords = $derived((game?.recentlyFailedWords?.length ?? 0) > 0);
    const currentStreak = $derived(game?.currentStreak ?? 0);
    
    // Gradual flame styling based on streak
    // Opacity: 0.4 at 0 streak, gradually increases to 1.0 at streak 10+
    const flameOpacity = $derived(Math.min(1, 0.4 + (currentStreak / 10) * 0.6));
    // Color transition: neutral gray -> red, starts at streak 10, full red at 50
    const flameRedAmount = $derived(Math.min(100, Math.max(0, ((currentStreak - 10) / 40) * 100)));
    
    // Filtered words for book modal
    const displayedWords = $derived.by(() => {
        if (!game?.wordPool) return [];
        if (showOnlyFailed && game.recentlyFailedWords?.length > 0) {
            return game.recentlyFailedWords;
        }
        return game.wordPool;
    });
</script>

<svelte:window onkeydown={handleEscape} />

<div class="backdrop-area">
    <div class="header-container">
        <header>
            <!-- Left side: Progress bar (only during active game) -->
            <div class="header-left">
                {#if isGameActive}
                    <div class="progress-container">
                        <div class="progress-bar-track">
                            <div 
                                class="progress-bar-fill" 
                                style="width: {progressPercent}%"
                            ></div>
                        </div>
                    </div>
                {:else}
                    <p class="brand">GTLK</p>
                {/if}
            </div>

            <!-- Right side: Icon buttons -->
            <div class="icon-group">
                <!-- Streak flame -->
                <button 
                    type="button" 
                    class="icon-button flame-button"
                    style="opacity: {flameOpacity}; --flame-color: color-mix(in srgb, var(--color-accent-red-500) {flameRedAmount}%, var(--color-neutral-300));"
                    onclick={openStreak}
                    aria-label="View streak"
                    title="View streak"
                >
                    <Icons.flame class="icon" />
                </button>
                
                <!-- Book -->
                <button 
                    type="button" 
                    class="icon-button"
                    onclick={openBook}
                    aria-label="View vocabulary"
                    title="View vocabulary"
                >
                    <Icons.book class="icon" />
                </button>
                
                <!-- Info -->
                <button 
                    type="button" 
                    class="icon-button"
                    onclick={openInfo}
                    aria-label="Info"
                    title="Info"
                >
                    <Icons.info class="icon" />
                </button>
                
                <!-- Settings -->
                <button 
                    type="button" 
                    class="icon-button"
                    onclick={openSettings}
                    aria-label="Settings"
                    title="Settings"
                >
                    <Icons.settings class="icon" />
                </button>
            </div>
        </header>
    </div>
</div>

<!-- Streak Modal -->
<Modal isOpen={isStreakOpen} title="Streak" onClose={closeAll}>
    {#snippet children()}
        <div class="streak-display">
            <Icons.flame class="streak-icon" />
            <span class="streak-count">{game?.currentStreak ?? 0}</span>
        </div>
        <p class="modal-text">
            {#if (game?.currentStreak ?? 0) === 0}
                Answer correctly to start a streak!
            {:else}
                You're on a roll! Keep going!
            {/if}
        </p>
    {/snippet}
</Modal>

<!-- Info Modal -->
<Modal isOpen={isInfoOpen} title="Info" onClose={closeAll}>
    {#snippet children()}
        <p class="modal-text">
            Practice Korean vocabulary with quick, mobile-friendly rounds.
        </p>
    {/snippet}
</Modal>

<!-- Settings Modal -->
<Modal isOpen={isSettingsOpen} title="Settings" onClose={closeAll}>
    {#snippet children()}
        <p class="modal-text">
            Settings are coming soon.
        </p>
    {/snippet}
</Modal>

<!-- Vocabulary Modal -->
<Modal isOpen={isBookOpen} title="Vocabulary" onClose={closeAll} size="large">
    {#snippet children()}
        <!-- Filter toggle -->
        <div class="filter-toggle">
            <label class="toggle-label">
                <input 
                    type="checkbox" 
                    bind:checked={showOnlyFailed}
                />
                <span>Show only failed words</span>
            </label>
        </div>
        
        <!-- Word list -->
        <div class="word-list">
            {#each displayedWords as word (word.korean + word.english)}
                <div class="word-item">
                    <div class="word-main">
                        <span class="word-korean">{word.korean}</span>
                        <span class="word-english">{word.english}</span>
                    </div>
                    <p class="word-explanation">
                        {word.explanation ?? "Explanation coming soon."}
                    </p>
                </div>
            {:else}
                <p class="empty-message">No words to display.</p>
            {/each}
        </div>
    {/snippet}
</Modal>

<style>
    .backdrop-area {
        width: 100%;
        height: var(--navbar-height);
    }

    .header-container {
        width: 100%;
        position: fixed;
        z-index: 10;
        background-color: color-mix(in srgb, var(--color-neutral-900) 95%, transparent);
    }

    .header-container::before {
        content: "";
        position: absolute;
        inset: 0;
        backdrop-filter: blur(5px);
        z-index: -1;
    }

    header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-inline: auto;
        max-width: var(--base-layout-max-width);
        padding-inline: var(--side-gap-padding);
        padding-block: var(--space-xs);
        height: var(--navbar-height);
    }

    .header-left {
        display: flex;
        align-items: center;
        flex: 1;
        min-width: 0;
    }

    .brand {
        margin: 0;
        color: var(--color-neutral-100);
        font-weight: var(--font-weight-semi-bold);
        letter-spacing: 0.01em;
        font-size: var(--font-size-base);
    }
    
    /* Progress bar styles */
    .progress-container {
        display: flex;
        align-items: center;
        width: clamp(80px, 30vw, 200px);
    }
    
    .progress-bar-track {
        flex: 1;
        height: 8px;
        background-color: var(--color-neutral-700);
        border-radius: var(--border-radius-s);
        overflow: hidden;
    }
    
    .progress-bar-fill {
        height: 100%;
        background-color: var(--color-accent-500);
        border-radius: var(--border-radius-s);
        transition: width var(--transition-normal);
    }

    /* Icon button group */
    .icon-group {
        display: flex;
        align-items: center;
        gap: var(--space-xs);
    }
    
    .icon-button {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: var(--space-xs);
        background: transparent;
        border: 0;
        border-radius: var(--border-radius-s);
        cursor: pointer;
        color: var(--color-neutral-300);
        transition: var(--transition-normal) color, var(--transition-normal) background-color;
    }
    
    .icon-button:hover,
    .icon-button:focus-visible {
        color: var(--color-accent-500);
        background-color: var(--color-neutral-800);
    }
    
    .icon-button :global(.icon) {
        width: 1.25rem;
        height: 1.25rem;
    }
    
    /* Flame icon gradual color */
    .icon-button.flame-button {
        color: var(--flame-color, var(--color-neutral-300));
    }
    
    .icon-button.flame-button:hover,
    .icon-button.flame-button:focus-visible {
        color: var(--flame-color, var(--color-neutral-300));
        filter: brightness(1.2);
        background-color: var(--color-neutral-800);
    }

    /* Streak modal styles */
    .streak-display {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: var(--space-m);
        padding: var(--space-l);
    }
    
    .streak-display :global(.streak-icon) {
        width: 3rem;
        height: 3rem;
        color: var(--color-accent-red-500);
    }
    
    .streak-count {
        font-size: var(--text-size-4xl);
        font-weight: var(--font-weight-bold);
        color: var(--color-neutral-100);
    }

    /* Modal content styles */
    .modal-text {
        margin: 0;
        color: var(--color-neutral-200);
        line-height: var(--font-line-height);
    }
    
    /* Filter toggle */
    .filter-toggle {
        padding-block: var(--space-xs);
        border-bottom: 1px solid var(--color-neutral-700);
    }
    
    .toggle-label {
        display: flex;
        align-items: center;
        gap: var(--space-s);
        cursor: pointer;
        color: var(--color-neutral-200);
        font-size: var(--font-size-small);
    }
    
    .toggle-label input[type="checkbox"] {
        accent-color: var(--color-accent-500);
        width: 1rem;
        height: 1rem;
    }
    
    /* Word list */
    .word-list {
        overflow-y: auto;
        max-height: 50vh;
        display: grid;
        gap: var(--space-s);
    }
    
    .word-item {
        padding: var(--space-s);
        background-color: var(--color-neutral-700);
        border-radius: var(--border-radius-s);
    }
    
    .word-main {
        display: flex;
        justify-content: space-between;
        align-items: baseline;
        gap: var(--space-m);
        margin-bottom: var(--space-xs);
    }
    
    .word-korean {
        font-size: var(--font-size-large);
        font-weight: var(--font-weight-semi-bold);
        color: var(--color-neutral-100);
    }
    
    .word-english {
        color: var(--color-neutral-300);
        font-size: var(--font-size-base);
    }
    
    .word-explanation {
        font-size: var(--font-size-small);
        color: var(--color-neutral-400);
        font-style: italic;
    }
    
    .empty-message {
        text-align: center;
        color: var(--color-neutral-400);
        padding: var(--space-l);
    }
</style>
