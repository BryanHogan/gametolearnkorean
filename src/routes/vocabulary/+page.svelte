<script>
    import { wordData } from "$lib/util/store.svelte.js";
    import Button from "$lib/components/Button.svelte";
    import Icons from "$lib/components/icons/index.js";

    const MAX_XP = 25;

    // Filter & sort state
    let sortBy = $state("xp-asc");
    let filterDifficulty = $state("all");
    let filterLearned = $state("all");
    let searchQuery = $state("");

    // Stats - derived from reactive wordData
    const totalWords = $derived(wordData.length);
    const learnedWords = $derived(wordData.filter(w => w.experience >= MAX_XP).length);
    const totalXP = $derived(wordData.reduce((sum, w) => sum + w.experience, 0));

    // Filtered and sorted words
    const filteredWords = $derived.by(() => {
        let result = [...wordData];

        // Filter by difficulty
        if (filterDifficulty !== "all") {
            result = result.filter(w => w.difficulty === parseInt(filterDifficulty));
        }

        // Filter by learned status
        if (filterLearned === "learned") {
            result = result.filter(w => w.experience >= MAX_XP);
        } else if (filterLearned === "unlearned") {
            result = result.filter(w => w.experience < MAX_XP);
        }

        // Search filter
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase().trim();
            result = result.filter(w => 
                w.korean.includes(query) || 
                w.english.toLowerCase().includes(query)
            );
        }

        // Sort
        switch (sortBy) {
            case "xp-asc":
                result.sort((a, b) => a.experience - b.experience);
                break;
            case "xp-desc":
                result.sort((a, b) => b.experience - a.experience);
                break;
            case "alpha-kr":
                result.sort((a, b) => a.korean.localeCompare(b.korean, "ko"));
                break;
            case "alpha-en":
                result.sort((a, b) => a.english.localeCompare(b.english, "en"));
                break;
        }

        return result;
    });

    const getProgressPercent = (xp) => Math.min(100, (xp / MAX_XP) * 100);
    
    const getProgressColor = (xp) => {
        const percent = getProgressPercent(xp);
        if (percent >= 100) return "var(--color-accent-500)";
        if (percent >= 50) return "var(--color-accent-700)";
        if (percent > 0) return "var(--color-accent-900)";
        return "var(--color-neutral-700)";
    };
</script>

<main class="base-layout vocabulary-page">
    <header class="page-header">
        <Button type="transparent" abutton="true" ahref="/">
            <Icons.chevronLeft />
        </Button>
        <h1>Vocabulary</h1>
    </header>

    <!-- Stats summary -->
    <section class="stats-summary">
        <div class="stat-card">
            <span class="stat-value">{totalWords}</span>
            <span class="stat-label">Total Words</span>
        </div>
        <div class="stat-card">
            <span class="stat-value">{learnedWords}</span>
            <span class="stat-label">Learned</span>
        </div>
        <div class="stat-card">
            <span class="stat-value">{totalXP}</span>
            <span class="stat-label">Total XP</span>
        </div>
    </section>

    <!-- Filters -->
    <section class="filters">
        <input 
            type="search" 
            placeholder="Search words..." 
            bind:value={searchQuery}
            class="search-input"
        />
        
        <div class="filter-row">
            <select bind:value={sortBy} class="filter-select">
                <option value="xp-asc">XP: Low → High</option>
                <option value="xp-desc">XP: High → Low</option>
                <option value="alpha-kr">Korean A-Z</option>
                <option value="alpha-en">English A-Z</option>
            </select>

            <select bind:value={filterDifficulty} class="filter-select">
                <option value="all">All Levels</option>
                <option value="1">Level 1</option>
                <option value="2">Level 2</option>
                <option value="3">Level 3</option>
            </select>

            <select bind:value={filterLearned} class="filter-select">
                <option value="all">All</option>
                <option value="learned">Learned</option>
                <option value="unlearned">Unlearned</option>
            </select>
        </div>
    </section>

    <!-- Word count -->
    <p class="word-count">{filteredWords.length} words</p>

    <!-- Word list -->
    <section class="word-list">
        {#each filteredWords as word (word.korean + word.english)}
            <article class="word-card">
                <div class="word-info">
                    <span class="word-korean">{word.korean}</span>
                    <span class="word-english">{word.english}</span>
                </div>
                <div class="word-progress">
                    <div class="progress-bar-track">
                        <div 
                            class="progress-bar-fill"
                            style="width: {getProgressPercent(word.experience)}%; background-color: {getProgressColor(word.experience)};"
                        ></div>
                    </div>
                    <span class="xp-label">{word.experience} / {MAX_XP}</span>
                </div>
            </article>
        {:else}
            <p class="no-results">No words match your filters.</p>
        {/each}
    </section>
</main>

<style>
    .vocabulary-page {
        padding-block: var(--space-m);
    }

    .page-header {
        display: flex;
        align-items: center;
        gap: var(--space-s);
        margin-bottom: var(--space-m);
    }

    .page-header h1 {
        font-size: var(--text-size-3xl);
        font-weight: var(--font-weight-semi-bold);
        margin: 0;
    }

    /* Stats */
    .stats-summary {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: var(--space-s);
        margin-bottom: var(--space-m);
    }

    .stat-card {
        background: var(--color-neutral-800);
        border-radius: var(--border-radius-m);
        padding: var(--space-s);
        text-align: center;
        display: flex;
        flex-direction: column;
        gap: var(--space-2xs);
    }

    .stat-value {
        font-size: var(--text-size-2xl);
        font-weight: var(--font-weight-bold);
        color: var(--color-accent-500);
    }

    .stat-label {
        font-size: var(--font-size-small);
        color: var(--color-neutral-400);
    }

    /* Filters */
    .filters {
        display: flex;
        flex-direction: column;
        gap: var(--space-s);
        margin-bottom: var(--space-s);
    }

    .search-input {
        width: 100%;
        padding: var(--space-s);
        border: 1px solid var(--color-neutral-700);
        border-radius: var(--border-radius-m);
        background: var(--color-neutral-800);
        color: var(--color-neutral-100);
        font-size: var(--font-size-base);
    }

    .search-input::placeholder {
        color: var(--color-neutral-500);
    }

    .filter-row {
        display: flex;
        gap: var(--space-xs);
        flex-wrap: wrap;
    }

    .filter-select {
        flex: 1;
        min-width: 100px;
        padding: var(--space-xs) var(--space-s);
        border: 1px solid var(--color-neutral-700);
        border-radius: var(--border-radius-s);
        background: var(--color-neutral-800);
        color: var(--color-neutral-100);
        font-size: var(--font-size-small);
    }

    .word-count {
        font-size: var(--font-size-small);
        color: var(--color-neutral-400);
        margin-bottom: var(--space-s);
    }

    /* Word list */
    .word-list {
        display: flex;
        flex-direction: column;
        gap: var(--space-xs);
    }

    .word-card {
        background: var(--color-neutral-800);
        border-radius: var(--border-radius-m);
        padding: var(--space-s) var(--space-m);
        display: flex;
        flex-direction: column;
        gap: var(--space-xs);
    }

    .word-info {
        display: flex;
        justify-content: space-between;
        align-items: baseline;
        gap: var(--space-s);
    }

    .word-korean {
        font-size: var(--text-size-xl);
        font-weight: var(--font-weight-semi-bold);
        color: var(--color-neutral-100);
    }

    .word-english {
        font-size: var(--font-size-base);
        color: var(--color-neutral-400);
        text-align: right;
        flex-shrink: 1;
    }

    .word-progress {
        display: flex;
        align-items: center;
        gap: var(--space-s);
    }

    .progress-bar-track {
        flex: 1;
        height: 6px;
        background: var(--color-neutral-700);
        border-radius: 3px;
        overflow: hidden;
    }

    .progress-bar-fill {
        height: 100%;
        border-radius: 3px;
        transition: width var(--transition-normal), background-color var(--transition-normal);
    }

    .xp-label {
        font-size: var(--font-size-small);
        color: var(--color-neutral-500);
        min-width: 50px;
        text-align: right;
    }

    .no-results {
        text-align: center;
        color: var(--color-neutral-500);
        padding: var(--space-l);
    }
</style>