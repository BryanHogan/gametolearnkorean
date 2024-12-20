<script>
	import { writable } from "svelte/store";
	import words from "$lib/data/words.json";

	// Game state
	const selectedCards = writable([]);
	const matches = writable(new Set());
	const score = writable(0);
	const totalPairs = writable(5); // Start with 5 pairs
	const level = writable(1); // Start at level 1
	const selectedDifficulties = writable([1, 2, 3]); // Default: all difficulties

	// Check if running in the browser
	let wordData = [];

	if (typeof window !== "undefined") {
		// Load word frequencies from localStorage or use initial words
		wordData = JSON.parse(localStorage.getItem("wordData")) || words;
	} else {
		// Fallback for SSR (use the words as default)
		wordData = words;
	}

	// Function to save word frequencies to localStorage
	const saveWordData = () => {
		if (typeof window !== "undefined") {
			localStorage.setItem("wordData", JSON.stringify(wordData));
		}
	};

	// Function to initialize the game
	const initializeGame = () => {
		let difficulties = $selectedDifficulties;
		let pairs = $totalPairs;

		// Filter words based on selected difficulties
		const filteredWords = wordData.filter((word) =>
			difficulties.includes(word.difficulty),
		);

		// Sort words based on frequency and select a subset
		const sortedWords = filteredWords
			.sort((a, b) => a.frequency - b.frequency)
			.slice(0, pairs);
		const selectedWords = sortedWords.sort(() => Math.random() - 0.5);

		// Create separate card sets for English and Korean
		englishCards = selectedWords
			.map((word, index) => ({
				id: `en-${index}`,
				text: word.english,
				type: "english",
				pairId: index, 
			}))
			.sort(() => Math.random() - 0.5); // Shuffle English cards

		koreanCards = selectedWords
			.map((word, index) => ({
				id: `ko-${index}`,
				text: word.korean,
				type: "korean",
				pairId: index,
			}))
			.sort(() => Math.random() - 0.5); // Shuffle Korean cards

		matches.set(new Set());
		selectedCards.set([]);
	};

	// Initialize the game
	let englishCards = [];
	let koreanCards = [];
	initializeGame();

	// Comprehensive voice retrieval with better browser compatibility
	const getVoices = () => {
		return new Promise((resolve) => {
			let voices = [];

			// Immediate retrieval
			voices = window.speechSynthesis.getVoices();

			if (voices.length > 0) {
				resolve(voices);
			} else {
				// Fallback for browsers loading voices asynchronously
				window.speechSynthesis.onvoiceschanged = () => {
					voices = window.speechSynthesis.getVoices();
					resolve(voices);
				};

				// Timeout to ensure voice retrieval
				setTimeout(() => {
					voices = window.speechSynthesis.getVoices();
					resolve(voices);
				}, 1000);
			}
		});
	};

	// Comprehensive TTS function with multiple fallbacks
	const speakKorean = async (text) => {
		if (typeof window === "undefined") return; // Ensure this only runs in the browser

		const fallbackSpeak = (fallbackText) => {
			try {
				const utterance = new SpeechSynthesisUtterance(fallbackText);
				utterance.lang = "ko-KR"; // Try to enforce Korean language
				utterance.rate = 0.7;
				window.speechSynthesis.speak(utterance);
			} catch (error) {
				console.error("Fallback speech synthesis failed:", error);
			}
		};

		try {
			if ("speechSynthesis" in window) {
				const voices = await getVoices();
				const koreanVoices = voices.filter(
					(voice) =>
						voice.lang.startsWith("ko") ||
						voice.name.toLowerCase().includes("korean"),
				);

				const utterance = new SpeechSynthesisUtterance(text);
				if (koreanVoices.length > 0) {
					utterance.voice = koreanVoices[0]; // Use the first available Korean voice
				} else {
					console.warn(
						"No Korean voices available. Using default voice.",
					);
				}
				utterance.lang = "ko-KR";
				utterance.rate = 0.7;
				window.speechSynthesis.speak(utterance);
			} else {
				console.warn(
					"speechSynthesis is not available in this browser.",
				);
				fallbackSpeak(text);
			}
		} catch (error) {
			console.error("TTS error:", error);
			fallbackSpeak(text);
		}
	};

	// Handle card selection and play audio for Korean cards
	const selectCard = (card) => {
		// Play audio if the card is a Korean card
		if (card.type === "korean") {
			speakKorean(card.text);
		}

		matches.subscribe((matched) => {
			if (matched.has(card.id)) return;
		});

		selectedCards.update((current) => {
			if (current.some((c) => c.id === card.id)) return current;
			return [...current, card].slice(0, 2);
		});
	};

	// Match-checking logic (reactive)
	$: if ($selectedCards.length === 2) {
		const [first, second] = $selectedCards;

		if (first.pairId === second.pairId && first.type !== second.type) {
			matches.update((set) => {
				set.add(first.id).add(second.id);
				return set;
			});
			score.update((s) => s + 1);

			// Update frequency of matched words
			wordData[first.pairId].frequency += 1;
			saveWordData();
		}

		// Clear selection
		selectedCards.set([]);
	}

	// Check if all pairs are matched and increase level
	$: if ($matches.size / 2 === $totalPairs) {
		level.update((lvl) => lvl + 1); // Increment the level
		totalPairs.update((pairs) => pairs + 1); // Increase the number of pairs
		initializeGame(); // Start a new round
	}
</script>

<div>
	<h1>Score: {$score}</h1>
	<h2>Pairs: {$totalPairs}</h2>
	<h2>Level: {$level}</h2>
	<!-- Add this line to display the level -->

	<!-- Difficulty Selection -->
	<div>
		<h3>Select Difficulty</h3>
		{#each [1, 2, 3] as difficulty}
			<label>
				<input
					type="checkbox"
					bind:group={$selectedDifficulties}
					value={difficulty}
				/>
				Difficulty {difficulty}
			</label>
		{/each}
		<button on:click={initializeGame}>Start Game</button>
	</div>

	<!-- English words row -->
	<div class="english-row">
		{#each englishCards as card}
			<div
				class="card {$matches.has(card.id)
					? 'matched'
					: ''} {$selectedCards.some((c) => c.id === card.id)
					? 'selected'
					: ''}"
				on:click={() => selectCard(card)}
			>
				<p>{card.text}</p>
			</div>
		{/each}
	</div>

	<!-- Korean words row -->
	<div class="korean-row">
		{#each koreanCards as card}
			<div
				class="card {$matches.has(card.id)
					? 'matched'
					: ''} {$selectedCards.some((c) => c.id === card.id)
					? 'selected'
					: ''}"
				on:click={() => selectCard(card)}
			>
				<p>{card.text}</p>
			</div>
		{/each}
	</div>
</div>

<style>
	h1,
	h2 {
		text-align: center;
	}

	.english-row,
	.korean-row {
		display: flex;
		justify-content: center;
		margin: 20px 0;
		gap: 10px;
	}

	.card {
		cursor: pointer;
		width: 100px;
		height: 60px;
		text-align: center;
		border: 1px solid black;
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: #eee;
		transition: transform 0.2s;
	}

	.card.selected {
		background-color: #f0e68c;
		transform: scale(1.1);
	}

	.card.matched {
		background-color: #90ee90;
		pointer-events: none;
	}
</style>
