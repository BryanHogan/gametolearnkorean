# Game To Learn Korean — Agent Guide

## Project Overview
**Game To Learn Korean** is a gamified flashcard-like app for learning Korean. A way to learn new Korean vocabulary fast and in a more fun way.
- **Stack**: SvelteKit 2 (Static), Vite 5, Svelte 5 Runes, Capacitor 6 (Android).
- **Data**: `src/lib/data/words.json` (static) + `localStorage` (user progress).
- **Design**: Mobile-first, dark mode default.

## Key Architecture Rules
1. **Svelte 5 Runes**: Use `$state`, `$derived`, `$props`. Avoid legacy stores.
2. **Client-Only**: App is pre-rendered (`prerender = true`). Guard `window`/`localStorage` access.
3. **Persistence**: `wordData` combines static JSON with local experience scores. Never modify `words.json` for runtime state.
4. **Structure**: Keep `+page.svelte` for orchestration. Move logic to `src/lib/util` and UI to `src/lib/components`.

## Core Game Logic
- **Modes**: Alternates between **Pairs** (match cards) and **Blockwriting** (assemble Hangul).
- **Progression**:
  - Pairs: +3 XP. Blockwriting: +5 XP.
  - "Learned" = 25+ XP.
  - Logic lives in `initializeRound()` in `+page.svelte`.
- **Hangul**: Use `src/lib/util/korean.svelte.js` for block manipulation (uses `es-hangul`).

## Styling (Mobile First)
- **Tokens**: Use `var.css` for colors and spacing.
- **Layout**: Use `util.css` over custom CSS.
- **Components**: Extend `Button.svelte` and `Card.svelte` instead of raw HTML.

## Development & Build
- **Commands**: `pnpm dev`, `pnpm build`, `pnpm check`.
- **Android**: `pnpm android-dev` runs dev server + Capacitor sync.
- **Capacitor**: `build/` is the web root. Native shell is in `android/`.

## Roadmap & Constraints
- **Persistence**: Future goal is IndexedDB. For now, keep `localStorage` logic isolated in `store.svelte.js`.
- **Content**: Tone is supportive and simple.