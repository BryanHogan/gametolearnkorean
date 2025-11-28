<script>
    import { onMount } from "svelte";
    import Button from "$lib/components/Button.svelte";
    import Icons from "$lib/components/icons/index.js";
    import { wordData, loadWordData } from "$lib/util/store.svelte.js";

    const MAX_XP = 25;
    const isBrowser = typeof window !== "undefined";

    let words = $state(wordData);
    let sortBy = $state("xp-desc");
    let viewFilter = $state("practice");
    let difficultyFilter = $state("all");
    let searchTerm = $state("");
    let isLoadingExperience = $state(true);

    const difficulties = $derived([...new Set(words.map(w => w.difficulty))].sort((a, b) => a - b));

    onMount(async () => {
        if (!isBrowser) {
            isLoadingExperience = false;
            return;
        }
        const loadedWords = await loadWordData();
        words = [...loadedWords];
        isLoadingExperience = false;
    });

    const totalWords = $derived(words.length);
    const masteredCount = $derived(words.filter((word) => word.experience >= MAX_XP).length);
    const needsPracticeCount = $derived(words.filter((word) => word.experience < MAX_XP).length);
    const averageXP = $derived(
        words.length
            ? Math.round(words.reduce((sum, word) => sum + word.experience, 0) / words.length)
            : 0
    );

    const filteredWords = $derived.by(() => {
        let list = [...words];

        if (viewFilter === "practice") {
            list = list.filter((word) => word.experience < MAX_XP);
        } else if (viewFilter === "mastered") {
            list = list.filter((word) => word.experience >= MAX_XP);
        }

        if (difficultyFilter !== "all") {
            list = list.filter((word) => word.difficulty === Number(difficultyFilter));
        }

        if (searchTerm.trim()) {
            const query = searchTerm.toLowerCase().trim();
            list = list.filter(
                (word) =>
                    word.korean.includes(searchTerm.trim()) ||
                    word.english.toLowerCase().includes(query)
            );
        }

        switch (sortBy) {
            case "xp-asc":
                list.sort((a, b) => a.experience - b.experience);
                break;
            case "korean":
                list.sort((a, b) => a.korean.localeCompare(b.korean, "ko"));
                break;
            case "english":
                list.sort((a, b) => a.english.localeCompare(b.english, "en"));
                break;
            default:
                list.sort((a, b) => b.experience - a.experience);
        }

        return list;
    });

    const progressPercent = (experience) => Math.min(100, (experience / MAX_XP) * 100);
    const progressTone = (experience) => {
        if (experience >= MAX_XP) return "xp-max";
        if (experience >= 15) return "xp-strong";
        if (experience >= 5) return "xp-mid";
        return "xp-low";
    };
</script>

<main class="base-layout vocabulary-view">
    <header class="page-header">
        <Button type="transparent" abutton="true" ahref="/">
            <Icons.chevronLeft />
        </Button>
        <h1>Vocabulary</h1>
    </header>

    <section class="stats-strip">
        <div class="stat">
            <span class="stat-value">{totalWords}</span>
            <span class="stat-label">Total</span>
        </div>
        <div class="stat-divider"></div>
        <div class="stat">
            <span class="stat-value">{needsPracticeCount}</span>
            <span class="stat-label">Learning</span>
        </div>
        <div class="stat-divider"></div>
        <div class="stat">
            <span class="stat-value">{masteredCount}</span>
            <span class="stat-label">Mastered</span>
        </div>
        <div class="stat-divider"></div>
        <div class="stat">
            <span class="stat-value">{averageXP}</span>
            <span class="stat-label">Avg XP</span>
        </div>
    </section>

    <section class="controls">
        <div class="search">
            <label class="visually-hidden" for="word-search">Search vocabulary</label>
            <input
                id="word-search"
                type="search"
                placeholder="Search words..."
                bind:value={searchTerm}
            />
        </div>
        <div class="filter-sort-row">
            <div class="pill-group">
                <button class={viewFilter === "practice" ? "active" : ""} onclick={() => (viewFilter = "practice")}>
                    Learning
                </button>
                <button class={viewFilter === "all" ? "active" : ""} onclick={() => (viewFilter = "all")}>
                    All
                </button>
                <button class={viewFilter === "mastered" ? "active" : ""} onclick={() => (viewFilter = "mastered")}>
                    Mastered
                </button>
            </div>
            <div class="select-group">
                <select bind:value={difficultyFilter} aria-label="Filter by difficulty">
                    <option value="all">All difficulties</option>
                    {#each difficulties as level}
                        <option value={level}>Difficulty {level}</option>
                    {/each}
                </select>
                <select id="sort-select" bind:value={sortBy} aria-label="Sort words by">
                    <option value="xp-desc">Most XP</option>
                    <option value="xp-asc">Least XP</option>
                    <option value="korean">Korean A-Z</option>
                    <option value="english">English A-Z</option>
                </select>
            </div>
        </div>
    </section>

    <section class="word-list">
        {#if isLoadingExperience}
            <div class="empty-state">
                <p>Loading vocabulary...</p>
            </div>
        {:else if filteredWords.length === 0}
            <div class="empty-state">
                <p>No words found</p>
                <span>Try a different search or filter</span>
            </div>
        {:else}
            {#each filteredWords as word (word.korean + word.english)}
                <article class="word-card" class:mastered={word.experience >= MAX_XP}>
                    <div class="word-main">
                        <p class="word-korean">{word.korean}</p>
                        <p class="word-english">{word.english}</p>
                    </div>
                    <div class="word-progress">
                        <div
                            class="progress-bar"
                            role="progressbar"
                            aria-label={`Experience for ${word.korean}`}
                            aria-valuemin="0"
                            aria-valuemax={MAX_XP}
                            aria-valuenow={word.experience}
                        >
                            <span
                                class={`progress-fill ${progressTone(word.experience)}`}
                                style={`width: ${progressPercent(word.experience)}%`}
                            ></span>
                        </div>
                        {#if word.experience >= MAX_XP}
                            <span class="xp-complete"><Icons.circleCheck /></span>
                        {:else}
                            <span class="xp-label">{word.experience} XP</span>
                        {/if}
                    </div>
                </article>
            {/each}
        {/if}
    </section>

    <p class="results-count">Showing {filteredWords.length} of {totalWords} words</p>
</main>

<style>
    .vocabulary-view {
        padding-block: var(--space-m) var(--space-l);
        row-gap: var(--space-m);
        column-gap: 0;
        overflow-x: hidden;
    }

    /* Header */
    .page-header {
        display: flex;
        align-items: center;
        gap: var(--space-2xs);
    }

    .page-header h1 {
        margin: 0;
        font-size: var(--text-size-xl);
        font-weight: var(--font-weight-bold);
    }

    /* Stats Strip */
    .stats-strip {
        display: flex;
        align-items: center;
        justify-content: space-around;
        background: var(--color-neutral-800);
        border: 1px solid var(--color-neutral-700);
        border-radius: var(--border-radius-m);
        padding: var(--space-s) var(--space-m);
        max-width: 100%;
        box-sizing: border-box;
    }

    .stat {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 2px;
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

    .stat-divider {
        width: 1px;
        height: 2rem;
        background: var(--color-neutral-700);
    }

    /* Controls */
    .controls {
        display: grid;
        gap: var(--space-s);
        max-width: 100%;
        box-sizing: border-box;
    }

    .search input {
        width: 100%;
        padding: var(--space-xs) var(--space-s);
        border-radius: var(--border-radius-m);
        border: 1px solid var(--color-neutral-700);
        background: var(--color-neutral-800);
        color: var(--color-neutral-100);
        font-size: 1rem;
        transition: border-color var(--transition-normal);
    }

    .search input:focus {
        outline: none;
        border-color: var(--color-accent-600);
    }

    .search input::placeholder {
        color: var(--color-neutral-500);
    }

    .filter-sort-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: var(--space-s);
        flex-wrap: wrap;
    }

    .pill-group {
        display: flex;
        background: var(--color-neutral-800);
        border-radius: var(--border-radius-m);
        padding: 3px;
        gap: 2px;
    }

    .pill-group button {
        border: none;
        background: transparent;
        color: var(--color-neutral-400);
        border-radius: calc(var(--border-radius-m) - 2px);
        padding: var(--space-2xs) var(--space-s);
        cursor: pointer;
        font-size: var(--font-size-small);
        font-weight: var(--font-weight-semi-bold);
        transition: all var(--transition-normal);
    }

    .pill-group button:hover {
        color: var(--color-neutral-100);
    }

    .pill-group button.active {
        background: var(--color-accent-700);
        color: var(--color-neutral-100);
    }

    .select-group {
        display: flex;
        gap: var(--space-xs);
    }

    select {
        background: var(--color-neutral-800);
        color: var(--color-neutral-300);
        border: 1px solid var(--color-neutral-700);
        border-radius: var(--border-radius-s);
        padding: var(--space-2xs) var(--space-s);
        font-size: var(--font-size-small);
        cursor: pointer;
    }

    select:focus {
        outline: none;
        border-color: var(--color-accent-600);
    }

    /* Word List */
    .word-list {
        display: grid;
        gap: var(--space-xs);
        max-width: 100%;
    }

    .word-card {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: var(--space-m);
        background: var(--color-neutral-800);
        border: 1px solid var(--color-neutral-700);
        border-radius: var(--border-radius-m);
        padding: var(--space-s) var(--space-m);
        transition: border-color var(--transition-normal);
        max-width: 100%;
        box-sizing: border-box;
    }

    .word-card:hover {
        border-color: var(--color-neutral-600);
    }

    .word-card.mastered {
        border-color: var(--color-accent-800);
        background: linear-gradient(135deg, var(--color-neutral-800) 0%, rgba(127, 180, 218, 0.05) 100%);
    }

    .word-main {
        flex: 1;
        min-width: 0;
        overflow: hidden;
    }

    .word-korean {
        margin: 0;
        font-size: var(--text-size-xl);
        font-weight: var(--font-weight-semi-bold);
        line-height: 1.2;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .word-english {
        margin: 0;
        color: var(--color-neutral-400);
        font-size: var(--font-size-small);
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .word-progress {
        display: flex;
        align-items: center;
        gap: var(--space-s);
        flex-shrink: 0;
        width: 180px;
    }

    .progress-bar {
        position: relative;
        flex: 1;
        height: 6px;
        border-radius: 999px;
        background: var(--color-neutral-700);
        overflow: hidden;
    }

    .progress-fill {
        position: absolute;
        inset: 0;
        width: 0%;
        border-radius: 999px;
        transition: width 0.3s ease;
    }

    .progress-fill.xp-low {
        background: var(--color-accent-800);
    }

    .progress-fill.xp-mid {
        background: var(--color-accent-700);
    }

    .progress-fill.xp-strong {
        background: var(--color-accent-600);
    }

    .progress-fill.xp-max {
        background: var(--color-accent-500);
    }

    .xp-label {
        font-size: var(--font-size-small);
        color: var(--color-neutral-500);
        font-variant-numeric: tabular-nums;
        min-width: 50px;
        text-align: right;
    }

    .xp-complete {
        color: var(--color-accent-500);
        display: flex;
        align-items: center;
    }

    .xp-complete :global(svg) {
        width: 1.25rem;
        height: 1.25rem;
    }

    /* Empty State */
    .empty-state {
        text-align: center;
        padding: var(--space-xl) var(--space-m);
        color: var(--color-neutral-400);
    }

    .empty-state p {
        margin: 0;
        font-weight: var(--font-weight-semi-bold);
    }

    .empty-state span {
        font-size: var(--font-size-small);
        color: var(--color-neutral-500);
    }

    /* Results Count */
    .results-count {
        text-align: center;
        font-size: var(--font-size-small);
        color: var(--color-neutral-500);
        margin: 0;
    }

    /* Mobile adjustments */
    @media (max-width: 30rem) {
        .vocabulary-view {
            padding-block: var(--space-s) var(--space-m);
            row-gap: var(--space-s);
            column-gap: 0;
        }

        .stats-strip {
            padding: var(--space-xs) var(--space-2xs);
            gap: var(--space-2xs);
        }

        .stat-value {
            font-size: var(--font-size-large);
        }

        .stat-label {
            font-size: 0.75rem;
        }

        .stat-divider {
            height: 1.5rem;
        }

        .word-card {
            flex-direction: column;
            align-items: stretch;
            gap: var(--space-xs);
            padding: var(--space-s);
        }

        .word-korean {
            font-size: var(--font-size-large);
        }

        .word-progress {
            width: 100%;
            justify-content: space-between;
            gap: var(--space-xs);
        }

        .filter-sort-row {
            flex-direction: column;
            align-items: stretch;
            gap: var(--space-xs);
        }

        .pill-group {
            width: 100%;
            justify-content: center;
        }

        .pill-group button {
            flex: 1;
            text-align: center;
            padding: var(--space-xs) var(--space-2xs);
        }

        .select-group {
            flex-direction: row;
            width: 100%;
        }

        select {
            flex: 1;
        }

        .search input {
            padding: var(--space-s);
        }
    }
</style>
