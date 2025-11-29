# Project Tasks

## Active Tasks

### Core Features
- [ ] After wrong answer: button to explain both words -> within book on Header bar
- [ ] Word explanations: background, tips, example sentences
  - [ ] Show these after word as used in OneVsMany. Provide option to "Don't show again", "Show again next game". Within /vocabulary view include icon/something that shows this status of whether explanation will be shown again or not. Give option to enable/disable this again.
  - [ ] Also show these in the book view from Header
- [ ] Replace "Word Pool Size" selection with different modes (standard, fast, survival (?))

### Settings
- [ ] Reset progress
- [x] Make Streak icon toggle-able
- [ ] On StartScreen make "Further settings" fold-able

### Technical
- [ ] Publish to Play Store
- [ ] Fix book icon Header wrong words but not correctly implemented
- [ ] Save current game state to localStorage so that it persists on page reload (use modal that asks if previous session should be loaded?)

### Content
- [ ] Expand vocabulary in `words.json` - Add words from Naver Dictionary groups -> Test with another group of difficulty (use 2nd TTMIK deck as base)

### Other
- [ ] User accounts
- [ ] Analytics - Information on how much people use the app actually
- [ ] Monetization - Premium features behind a subscription: Synchronization, audio only. Possibly: Sentence mode, - Consider also enabling one-time purchase option.
- [ ] Export data + import data
- [ ] When more game modes added -> add i-icon which shows modal with explanation of mode
- [ ] PWA stuff
- [ ] Basic stuff for website (favicon, description, etc.)

---

## Later

### Progress & Streaks
- [ ] Animated progress bar: show "+" on correct, "-" on mistake

### Feedback & Polish
- [ ] Shake animation for wrong answers
- [ ] Confetti/particle effect on round complete

### Word Learning
- [ ] Allow user to add custom words
- [ ] Allow user to import custom built word decks
- [ ] Allow user to import Anki deck (include logic to trim words and check for duplication). In /vocabulary view provide option to adjust cards and show where they are from (custom or base).
- [ ] Option to select specific words / low-confidence words
- [ ] Allow option to add note / mnemonic to card. Allow this especially in the beginning of a card and in /vocabulary.

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