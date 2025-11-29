# Project Tasks

## Active Tasks

### Core Features
- [ ] After wrong answer: button to explain both words -> within book on Header bar
- [ ] Word explanations: background, tips, example sentences
- [ ] Add words from Naver Dictionary groups -> Test with another group of difficulty (use 2nd deck)

### Settings
- [ ] Reset progress
- [ ] Make Streak icon toggle-able
- [ ] On StartScreen make "Further settings" fold-able

### Technical
- [ ] Publish to Play Store
- [ ] Fix book icon Header wrong words but not correctly implemented

### Content
- [ ] Expand vocabulary in `words.json`

### Other
- [ ] User accounts
- [ ] Analytics - Information on how much people use the app actually
- [ ] Monetization - Premium features behind a subscription: Synchronization, audio only. Possibly: Sentence mode, - Consider also enabling one-time purchase option.
- [ ] Export data

---

## Later

### Progress & Streaks
- [ ] Animated progress bar: show "+" on correct, "-" on mistake
- [ ] Daily streak tracking 
- [ ] GitHub-style daily usage overview

### Feedback & Polish
- [ ] Shake animation for wrong answers
- [ ] Confetti/particle effect on level complete

### Word Learning
- [ ] Option to select specific words / low-confidence words

### Settings
- [ ] Toggle task types (pairs, many-vs-one, block writing, etc.)

### New Game Modes
- [ ] Sentence-based tasks using learned words (TOPIK style)
- [ ] Audio-only words mode (premium?)
- [ ] Time trial / survival modes

### Technical
- [ ] Add unit tests (Vitest) for `Game`, `BlockTask`, task classes
- [ ] Accessibility: ARIA labels, keyboard navigation

### Content
- [ ] Add recorded audio for Korean words

### Marketing & Growth
- [ ] Social share for end of game screen

---

## Completed

### Architecture
- [x] Extract `PairsTask` logic into `src/lib/util/tasks/pairs-task.svelte.js`
- [x] Extract `ManyVsOneTask` logic into `src/lib/util/tasks/many-vs-one-task.svelte.js`
- [x] Standardize task interface: all tasks use `setup()`, `handleInput()`, etc.

### Core Features
- [x] Play audio when Korean cards are clicked (text-to-speech)
- [x] End of session screen with stats (time, rounds, mistakes)
- [x] Header with progress bar + settings menu (burger icon)
- [x] Adjust typing task buttons -> Don't need clear button, only hint (not mistake but also won't increase progress) and submit button

### Progress & Streaks
- [x] Change how word experience is calculated

### Word Learning
- [x] Option to prioritize words with lower experience

### Settings
- [x] Toggle sound effects (TTS)
- [x] Toggle difficulty levels

### Technical
- [x] Track session time