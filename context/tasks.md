# Project Tasks

## High Priority

### Architecture
- [x] Extract `PairsTask` logic into `src/lib/util/tasks/pairs-task.svelte.js`
- [x] Extract `ManyVsOneTask` logic into `src/lib/util/tasks/many-vs-one-task.svelte.js`
- [x] Standardize task interface: all tasks use `setup()`, `handleInput()`, etc.

### Core Features
- [x] Play audio when Korean cards are clicked (text-to-speech)
- [x] End of session screen with stats (time, rounds, mistakes)
- [x] Header with progress bar + settings menu (burger icon)
- [ ] Word experience view — see XP per word - Adjust that words can only gain experience above 20 through the free-writing task type. (Do I really want this?)
- [x] Adjust typing task buttons -> Don't need clear button, only hint (not mistake but also won't increase progress) and submit button

## Features

### Progress & Streaks
- [ ] (Later) Animated progress bar: show "+" on correct, "-" on mistake
- [ ] (Later)Daily streak tracking 
- [ ] (Later)GitHub-style daily usage overview
- [x] Change how word experience is calculated

### Feedback & Polish
- [ ] (Later) Shake animation for wrong answers
- [ ] (Later)Confetti/particle effect on level complete
- [ ] After wrong answer: button to explain both words -> within book on Header bar

### Word Learning
- [ ] Word explanations: background, tips, example sentences
- [x] Option to prioritize words with lower experience
- [ ] (Later) Option to select specific words / low-confidence words
- [ ] Add words from Naver Dictionary groups -> Test with another group of difficulty (use 2nd deck)

### Settings
- [x] Toggle sound effects (TTS)
- [ ] Reset progress
- [x] Toggle difficulty levels
- [ ] (Later) Toggle task types (pairs, many-vs-one, block writing, etc.)
- [ ] Make Streak icon toggle-able
- [ ] On StartScreen make "Further settings" fold-able

### New Game Modes
- [ ] (Later) Sentence-based tasks using learned words (TOPIK style)
- [ ] (Later) Audio-only words mode (premium?)
- [ ] (Later) Time trial / survival modes

## Technical

- [ ] (Later) Add unit tests (Vitest) for `Game`, `BlockTask`, task classes
- [ ] (Later) Accessibility: ARIA labels, keyboard navigation
- [x] Track session time
- [ ] Publish to Play Store
- [ ] Fix book icon Header wrong words but not correctly implemented

## Content

- [ ] Expand vocabulary in `words.json`
- [ ] (Later) Add recorded audio for Korean words

## Marketing & growth

- [ ] (Later) Social share for end of game screen

## Other

- [ ] User accounts
- [ ] Analytics - Information on how much people use the app actually
- [ ] Monetization - Premium features behind a subscription: Synchronization, audio only. Possibly: Sentence mode, - Consider also enabling one-time purchase option.
- [ ] Export data