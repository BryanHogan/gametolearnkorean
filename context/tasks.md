# Project Tasks

## Refactoring & Architecture
- [ ] **Refactor Pairs Task Type**: Extract `PairsTask` logic from `game.svelte.js` into `src/lib/util/tasks/pairs-task.svelte.js`.
- [ ] **Refactor Many Vs One Task Type**: Extract `ManyVsOneTask` logic from `game.svelte.js` into `src/lib/util/tasks/many-vs-one-task.svelte.js`.
- [ ] **Standardize Task Type Interface**: Ensure all task type classes follow a similar interface (`setup()`, `handleInput()`, etc.) for easier orchestration in `Game`.

## Features & UX
- [ ] **Visual Feedback**:
    - Add shake animation for incorrect answers in "Many vs One" and "Block Writing".
    - Add confetti or particle effect for level completion. -> Progress at top should get should a small plus that's animated in a nice way.
- [ ] **Settings Menu**:
    - Toggle sound effects (if added).
    - Reset progress option.
    - Toggle specific difficulty levels manually.
- [ ] **Progress Visualization**:
    - Show a progress bar for overall progress.
- [ ] **Menu pop-up element**
    - Add Header that houses the progress element but also a settings pop-up / burger menu. Within there include information on word progress and options such as disabling sound.
- [ ] **Word explanation**
    - Add an explanation for the background of the word + tips to better memorise it. This may be shown after the word has been shown in Task Type B) (matching pairs one vs many).

## Technical Debt & Infrastructure
- [ ] **Persistence**: Migrate from `localStorage` to `IndexedDB` for more robust data storage (as mentioned in `AGENTS.md`).
- [ ] **Testing**: Add unit tests for `Game`, `BlockTask`, and other logic classes using Vitest.
- [ ] **Accessibility**: Ensure all buttons and interactive elements have proper ARIA labels and keyboard navigation support.

## Content
- [ ] **Expand Vocabulary**: Add more words to `src/lib/data/words.json`.
- [ ] **Audio**: Add text-to-speech or recorded audio for Korean words.
