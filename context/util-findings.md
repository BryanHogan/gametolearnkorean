# Util Findings — Game To Learn Korean

- `src/lib/util/tasks/block-task.svelte.js`: Import uses `$lib/util/korean.svelte` but file is `korean.svelte.js`; align suffix to avoid ESM resolution issues.
- `src/lib/util/game.svelte.js`: `failedTries` state is written but never read (only incremented in many-vs-one). Remove if unused, along with the `levelReset` assignment.
- `src/lib/util/game.svelte.js`: Blockwriting/freeform setup repeats the same selection logic. Extract a helper (e.g., `setupSingleWordRound(progressLevel, taskInstance)`) to avoid drift when tuning selection rules.
- `src/lib/util/game.svelte.js`: `chosenPairs` is set for single-word rounds but not declared/used elsewhere; prefer a local variable when selecting the target word.
- `src/lib/util/word-selection.svelte.js`: Pool-limit branching duplicates selection logic for "unlimited", "50", "20". Normalize the limit once and reuse a shared selector to simplify future limits.
- `src/lib/util/game.svelte.js`: `pairAmount` returns a fractional count; explicitly floor before `Math.min` for clarity (`Math.min(Math.floor(level / 5) + 5, 10)`).
- `src/lib/util/tasks/block-task.svelte.js`: After deduping candidate blocks, random additions can collide, leaving too few options. Ensure a minimum unique count after dedupe (re-fill and dedupe again) so the player always gets multiple choices.
