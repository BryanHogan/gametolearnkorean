# Codex learnings (from a previous session)

- Added session **game types** in `Game` (`mastery` ends when all selected words hit progression goal; `survival` ends after 3 mistakes). **Task types** rotate per level: pairs → many-vs-one → blockwriting.
- Per-word progression is tracked per session (`progressionScores` in `Game`) and surfaced on cards in all three task components via chips; penalties apply on misses, +1 on success.
- Block writing, many-vs-one, and pairs now increment/decrement progression score. Experience score of word is increased after completing each task (persisted to IndexedDB when available).
- Start screen now chooses session game type (mastery/survival), keeps wordpool/difficulty filters, and shows last-session summary; in-game header shows session info, strikes (survival), and current task label/goal.
- Task rotation order is now pairs → many-vs-one → blockwriting; progression target currently tops out at 3 (no free-form task yet).
