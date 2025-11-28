# Project Tasks

## High Priority

### Architecture
- [x] Extract `PairsTask` logic into `src/lib/util/tasks/pairs-task.svelte.js`
- [x] Extract `ManyVsOneTask` logic into `src/lib/util/tasks/many-vs-one-task.svelte.js`
- [x] Standardize task interface: all tasks use `setup()`, `handleInput()`, etc.

### Core Features
- [ ] Play audio when Korean cards are clicked (text-to-speech)
- [x] End of session screen with stats (time, rounds, mistakes)
- [x] Header with progress bar + settings menu (burger icon)
- [ ] Word experience view — see XP per word

## Features

### Progress & Streaks
- [ ] Animated progress bar: show "+" on correct, "-" on mistake
- [ ] Flame icon for answer streaks (10+ correct in a row) (refills / grows)
- [ ] Daily streak tracking
- [ ] GitHub-style daily usage overview
- [ ] Change how word experience is calculated

### Feedback & Polish
- [ ] Shake animation for wrong answers
- [ ] Confetti/particle effect on level complete
- [ ] After wrong answer: button to explain both words

### Word Learning
- [ ] Word explanations: background, tips, example sentences
- [ ] Option to prioritize words with lower experience
- [ ] Option to select specific words / low-confidence words
- [ ] Add words from Naver Dictionary groups

### Settings
- [ ] Toggle sound effects
- [ ] Reset progress
- [ ] Toggle difficulty levels
- [ ] Toggle task types (pairs, many-vs-one, block writing, etc.)

### New Game Modes
- [ ] Sentence-based tasks using learned words (TOPIK style)
- [ ] Audio-only words mode
- [ ] Time trial / survival modes

## Technical

- [ ] Add unit tests (Vitest) for `Game`, `BlockTask`, task classes
- [ ] Accessibility: ARIA labels, keyboard navigation
- [x] Track session time
- [ ] Publish to Play Store

## Content

- [ ] Expand vocabulary in `words.json`
- [ ] Add recorded audio for Korean words

## Marketing & growth

- [ ] Social share for end of game screen