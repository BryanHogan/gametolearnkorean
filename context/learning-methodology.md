# Learning Methodology — Game To Learn Korean

This document explains the learning science behind the app's design and why it's effective for rapid vocabulary acquisition.

---

## Why This App Works for Fast Vocabulary Learning

### 1. Progressive Task Difficulty

Words advance through 4 task types of increasing cognitive demand:

| Stage | Task Type | Skill Practiced |
|-------|-----------|-----------------|
| 0 | **Pairs** (matching) | Basic recognition |
| 1 | **Many-vs-One** (multiple choice) | Active recall |
| 2 | **Block Writing** (assemble Hangul) | Production with scaffolding |
| 3 | **Free-form Writing** | Full production from memory |

Each word must succeed at its current level before advancing, ensuring mastery at each stage before moving to harder tasks.

### 2. Adaptive Repetition

- **First-try tracking**: Only correct answers on the first attempt advance progress
- **Penalty system**: Failed attempts reduce a word's progress, ensuring struggling words get more practice
- **Recently advanced filtering**: Prevents the same word from appearing in consecutive rounds

### 3. Batching for Efficiency

- **Minimum 3 words rule**: More advanced tasks (manyvsone, blockwriting, freeformwriting) only unlock when ≥3 words reach that progress level
- Creates natural learning batches that reinforce multiple words together
- **Word pool limits**: Option to focus on 50 words at a time for concentrated practice

### 4. Task Variety with Weighted Randomness

- 25% chance each round to select a random task (instead of strict cycling)
- Weighted by word count at each progress level
- "Pairs" task has reduced weight (0.5×) to favor more challenging tasks
- Adds unpredictability while still prioritizing words that need work

### 5. Session-Based Progress

- All words start at progress 0 each session
- Session completes when all words reach max progress (4)
- XP awarded at session completion, creating clear goals

---

## Research Support

### ✅ Well-Aligned with Learning Science

**Active Recall (Testing Effect)**
The progression from recognition → production forces retrieval rather than passive review. Research shows actively retrieving information strengthens memory more than re-reading or recognition alone.

**Desirable Difficulties**
The increasing task difficulty and penalty system create challenges that slow initial learning but improve long-term retention (Bjork & Bjork).

**Interleaving**
Task cycling and random selection mixes different types of practice. Studies show interleaving outperforms blocked practice for long-term retention.

**Immediate Feedback**
Each task provides instant feedback on correctness, which consistently accelerates learning.

---

## Areas for Future Improvement

### 1. Spaced Repetition Across Sessions

The current system tracks progress within a session but doesn't schedule reviews based on time elapsed. True spaced repetition (like Anki) schedules reviews at expanding intervals:
- 1 day → 3 days → 1 week → 2 weeks...

**Future consideration**: Store last-practiced timestamps and prioritize words due for review.

### 2. Penalty Calibration

Reducing progress by 1 on failure might be too aggressive. Research suggests errors during retrieval practice don't hurt learning *if corrected quickly*.

**Consider**:
- Showing the correct answer prominently after mistakes
- Less aggressive penalties for quick self-correction

### 3. Optimal Session Length

Requiring 4 successful stages per word per session might cause overlearning. Research shows diminishing returns after ~3 successful retrievals in one session — the real benefit comes from *returning later*.

### 4. Context Variety

Words are currently tested in isolation. "Transfer-appropriate processing" research suggests learning in varied contexts improves real-world recall.

**Future additions**:
- Example sentences
- Audio pronunciation
- Visual/contextual hints

### 5. Metacognition Support

Learners often misjudge what they know. Adding features could help users allocate effort better:
- Confidence ratings before answering
- Progress statistics and weak-word identification
- Session history and trends

---

## Key Research References

- **Bjork & Bjork** — Desirable difficulties in learning
- **Karpicke & Roediger** — The testing effect and retrieval practice
- **Pimsleur / Ebbinghaus** — Spacing effect and forgetting curves
- **Kornell & Bjork** — Benefits of interleaved practice

---

## Task Selection Algorithm

### How Tasks Are Chosen

1. **Minimum words requirement**: A task (except pairs) requires ≥3 words at its progress level, OR all remaining incomplete words are at that level or higher

2. **25% random selection**: Weighted by word count, with pairs at 0.5× weight

3. **Normal cycling**: `pairs → manyvsone → blockwriting → freeformwriting → pairs...`

4. **Fallback**: If no task matches directly, pick the task with the most incomplete words at its level

### Word Selection per Task

| Task | Primary Selection | Fallback |
|------|-------------------|----------|
| Pairs | Words at progress 0 | Mix in any incomplete words |
| Many-vs-One | Words at progress 1 | Any incomplete → entire pool |
| Block Writing | Words at progress 2 | Any incomplete → entire pool |
| Free-form Writing | Words at progress 3 | Any incomplete → entire pool |

All selections exclude recently-advanced words to prevent immediate repetition.
