# Codex learnings (from a previous session)

- Added session modes in `Game` (`mastery` ends when all selected words hit progression goal; `survival` ends after 3 mistakes). Challenges now rotate: pairs → many-vs-one → blockwriting per level.
- Per-word progression is tracked per session (`progressionScores` in `Game`) and surfaced on cards in all three mode components via chips; penalties apply on misses, +1 on success.
- Block writing, many-vs-one, and pairs now increment/decrement progression score. Experience score of word is increased after completing challenge (persisted to IndexedDB when available).
- Start screen now chooses session goal (mastery/survival), keeps wordpool/difficulty filters, and shows last-session summary; in-game header shows session info, strikes (survival), and current challenge label/goal.
- Mode rotation order is now pairs → many-vs-one → blockwriting; progression target currently tops out at 3 (no free-form mode yet).
