# Task Extraction Notes (Pairs & Many-vs-One)

## Purpose
- Guide for extracting `PairsTask` and `ManyVsOneTask` logic into `src/lib/util/tasks/*.svelte.js` and standardizing task interfaces (`setup`, input handlers).
- Aligns with AGENTS.md: keep logic in util, UI in components, use Svelte 5 runes, avoid unguarded browser APIs.

## PairsTask (current behavior to preserve)
- Selection: prefer progress-0 words, mix incomplete others if needed, exclude `recentlyAdvanced`, cap by `pairAmount = min(level/5 + 5, 10)`.
- State shape: `englishCards`/`koreanCards` arrays of `{ type, english, korean, selected, failedOnce }`; UI toggles `selected` for styles.
- Matching flow: selections tracked in `selectedCards`; match is same `english` with opposite `type`; remove matched cards and `levelCompleted` when both lists empty.
- First-try tracking: `failedFirstTry` Set ensures each word is only penalized once on its first mismatch; only first-try matches call `updateWordProgress`.
- Recently advanced: `updateWordProgress` adds to `recentlyAdvanced`; `setupPairsRound` clears it after use to avoid immediate repeats.

## Many-vs-One (current behavior to preserve)
- Selection: prefer progress-1 words, else incomplete words, else whole pool; exclude `recentlyAdvanced`, then clear it after picking.
- Target/options: `manyVsOneTarget` is the first shuffled word (with `failedOnce`); options = target + up to 3 distractors from `wordPool` excluding the same english, shuffled into `manyVsOneOptions`.
- Prompt: `manyVsOnePromptDirection` randomizes `english-to-korean` vs `korean-to-english`; UI derives prompt text from the target.
- Answer handling: correct choice calls `updateWordProgress` if `!failedOnce`, then `levelCompleted`; wrong choice penalizes target only on the first miss and increments `game.failedTries`.
- Progress coupling: relies on `game.taskType === "manyvsone"` so `updateWordProgress` uses the progress map correctly.

## Interface standardization
- Mirror `BlockTask`/`FreeFormTask`: each task class lives in `src/lib/util/tasks/<task>.svelte.js`, constructed with the `Game` instance; expose `setup(word)` plus input handlers (e.g., `handleCardPick`, `handleChoice`).
- Task-owned state should be `$state` so components bind via `game.<task>.stateField`. Move per-task resets (`failedFirstTry`, `selectedCards`, `failedOnce`) into the task classes.
- Keep task selection logic (`pairAmount` math, distractor picking, shuffling) and call sites in `Game.initializeRound`/`selectTaskType` unchanged; `+page.svelte` renders by `taskType` string.
- Use `game.updateWordProgress`/`penalizeWord` for progression; respect `recentlyAdvanced` (mark on advancement, clear after selection).

## UI integration checkpoints
- `PairsTask.svelte` needs `englishCards`, `koreanCards`, and a handler callable from the component (currently `game.handleCardPick`).
- `ManyVsOneTask.svelte` needs `manyVsOneTarget`, `manyVsOneOptions`, `manyVsOnePromptDirection`, and a handler (currently `game.handleManyVsOneChoice`).
- `levelReset` currently clears `failedTries`/`selectedCards`; after extraction, ensure equivalent resets happen in the task classes or via `Game` before each round.

## Pitfalls
- Do not touch `words.json` at runtime; experience updates go through `updateExperience`.
- Keep `window`/`indexedDB` guarded (not used in these tasks but a project rule).
- Preserve first-try semantics and progress penalties; avoid double penalties or skipping `recentlyAdvanced` clearing.
