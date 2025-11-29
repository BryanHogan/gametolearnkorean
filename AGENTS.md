# Game To Learn Korean — Agent Guide

## Project Overview
**Game To Learn Korean** is a gamified flashcard-like app for learning Korean vocabulary.
- **Stack**: SvelteKit 2 (Static), Vite 5, Svelte 5 Runes, Capacitor 6 (Android).
- **Data**: `src/lib/data/words.json` (static) + IndexedDB (user progress).
- **Design**: Mobile-first, dark mode default.

## Key Architecture Rules
1. **Svelte 5 Runes**: Use `$state`, `$derived`, `$props`. Avoid legacy stores.
2. **Client-Only**: App is pre-rendered. Guard `window`/`indexedDB` access.
3. **Persistence**: `wordData` merges static JSON with IndexedDB experience. Never modify `words.json` at runtime.
4. **Structure**: Keep `+page.svelte` for orchestration. Logic in `src/lib/util`, UI in `src/lib/components`.
5. **Plain JavaScript**: JavaScript files / parts use plain `.js` or `.svelte.js`

## Core Game Logic

### Session Progression
Each word has **session progress** (0–4). Tasks match progress levels:

| Progress | Task Type       | Description                    |
|----------|-----------------|--------------------------------|
| 0        | Pairs           | Match Korean ↔ English cards   |
| 1        | Many-vs-One     | Multiple choice (4 options)    |
| 2        | Blockwriting    | Assemble Hangul blocks         |
| 3        | FreeFormWriting | Type Korean word freely        |
| 4        | Mastered        | Word complete for session      |

- **Correct first try**: Word advances +1 progress
- **Failure**: Word regresses -1 progress (first failure only)

### Experience
- `updateExperience(korean, english, amount)` persists to IndexedDB

## Hangul Utilities (`korean.svelte.js`)
Uses `es-hangul` for `getSimilarBlock()`, `getRandomKoreanBlock()`, `disassemble()`, `assemble()`.

## Styling
- **Tokens**: `var.css` for colors (`--color-neutral-*`, `--color-accent-*`), spacing (`--space-*`)
- **Utilities**: `util.css` classes like `margin-inline-auto`, `margin-top-m`
- **Components**: Use `Button.svelte` and `Card.svelte` instead of raw HTML

## Commands
- `pnpm dev` — Start dev server
- `pnpm build` — Build for production
- `pnpm check` — Type checking
- `pnpm android-dev` — Dev + Capacitor sync + Android Studio