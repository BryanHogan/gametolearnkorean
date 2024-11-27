<script>
	import { writable } from 'svelte/store';
	import words from '$lib/data/words.json';

	// Game state
	const selectedCards = writable([]);
	const matches = writable(new Set());
	const score = writable(0);
	const totalPairs = writable(5); // Start with 5 pairs

	// Check if running in the browser
	let wordData = [];

	if (typeof window !== 'undefined') {
		// Load word frequencies from localStorage or use initial words
		wordData = JSON.parse(localStorage.getItem('wordData')) || words;
	} else {
		// Fallback for SSR (use the words as default)
		wordData = words;
	}

	// Function to save word frequencies to localStorage
	const saveWordData = () => {
		if (typeof window !== 'undefined') {
			localStorage.setItem('wordData', JSON.stringify(wordData));
		}
	};

	// Function to initialize the game
	const initializeGame = () => {
		// Sort words based on frequency (lower frequency first) and shuffle slightly
		const sortedWords = [...wordData].sort((a, b) => a.frequency - b.frequency).slice(0, $totalPairs);
		const selectedWords = sortedWords.sort(() => Math.random() - 0.5);

		// Create separate card sets for English and Korean
		englishCards = selectedWords
			.map((word, index) => ({
				id: `en-${index}`,
				text: word.english,
				type: 'english',
				pairId: index
			}))
			.sort(() => Math.random() - 0.5); // Shuffle English cards

		koreanCards = selectedWords
			.map((word, index) => ({
				id: `ko-${index}`,
				text: word.korean,
				type: 'korean',
				pairId: index
			}))
			.sort(() => Math.random() - 0.5); // Shuffle Korean cards

		matches.set(new Set());
		selectedCards.set([]);
	};

	// Initialize the game
	let englishCards = [];
	let koreanCards = [];
	initializeGame();

	// Handle card selection
	const selectCard = (card) => {
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

	// Check if all pairs are matched and increase difficulty
	$: if ($matches.size / 2 === $totalPairs) {
		totalPairs.update((pairs) => pairs + 1); // Increase the number of pairs
		initializeGame(); // Start a new round
	}
</script>


<div>
	<h1>Score: {$score}</h1>
	<h2>Pairs: {$totalPairs}</h2>

	<!-- English words row -->
	<div class="english-row">
		{#each englishCards as card}
			<div
				class="card { $matches.has(card.id) ? 'matched' : '' } { $selectedCards.some(c => c.id === card.id) ? 'selected' : '' }"
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
				class="card { $matches.has(card.id) ? 'matched' : '' } { $selectedCards.some(c => c.id === card.id) ? 'selected' : '' }"
				on:click={() => selectCard(card)}
			>
				<p>{card.text}</p>
			</div>
		{/each}
	</div>
</div>

<style>
	h1, h2 {
		text-align: center;
	}

	.english-row, .korean-row {
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
