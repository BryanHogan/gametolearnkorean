I want to achieve this experience for this Korean learning and practice app:

1. The user selects how many words they want to learn. E.g. 50 words.
    *   *Selection Logic:* Currently, these 50 words are chosen randomly. Future goal: prioritize words not yet learned.
2. At the beginning the user receives a list of which words were selected.
3. In this list they see the English and Korean sides of the word, and an optional explanation of the word.
    *   *Future Feature:* A field to add a note on how they remember this word (mnemonic) will be added later. These notes will be saved permanently and tied to the word.
    *   M*Future View:* A "Dictionary" view will allow users to see all learned words and their notes.
4. Then the gamified Anki / Duolingo style learning / practice part starts.
    *   *Progression:* For each word, the user aims to "master" it by passing all modes.
    *   *Flow:* The game mode changes frequently to keep things interesting.
    *   *Stage Logic:* A word tracks a **progression score** to determine its mastery level:
        *   **0:** Not yet learned (Needs to pass Mode A). All words start at 0 for the current session, regardless of global "learned" status.
        *   **1:** Passed Mode A (Many vs Many) on the first try.
        *   **2:** Passed Mode B (Many vs One) on the first try.
        *   **3:** Passed Mode C (Block writing) on the first try.
        *   **4:** Passed Mode D (Free-form writing) on the first try (Session Complete for this word).
        *   Even if a word is at a high score (e.g. 3), it can still appear in lower modes (A or B).
        *   The game biases towards showing words in the mode corresponding to their current score (e.g. Score 2 words appear in Mode C) to push progress, but mixes in words from with lower progress score as well.
    *   *Failure:*
        *   If a user gets a word wrong (mismatch or typo), they must retry immediately until correct.
        *   **Penalty:** The word does *not* advance a stage if failed first. Crucially, **the word moves down a stage** (current progression score - 1) upon failure.
    *   *Goal:* The session ends when all selected words have passed the final mode (Mode D), so when all words have a progress score of 4.

The different modes are:
	A) **Matching pairs: Many vs many.** Multiple cards are presented on both sides (English left, Korean right). The user matches correct pairs. Matched pairs are removed. Stage clears when all are matched. Scoring is per-word (individual success/fail).
	B) **Matching pairs: Many vs one (Multiple Choice).**
        *   Scenario 1: Show 1 English word, user picks from 4 Korean options.
        *   Scenario 2: Show 1 Korean word, user picks from 4 English options.
        *   **Distractors:** Wrong options should mainly come from the current session. There should be a bias towards using words of the same type (e.g. verbs with verbs) to prevent easy guessing based on endings.
        *   User moves to next stage upon correct selection.
	C) **Block writing.** The user is presented with the English side and must assemble the Korean translation using pre-existing Hangul block buttons.
	D) **Free-form writing.** The user is presented with the English side (or Korean audio/prompt) and must type the Korean translation using their **device's system keyboard**. We assume the user has a Korean keyboard installed.

