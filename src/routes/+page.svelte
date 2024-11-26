<script>
	import { writable } from 'svelte/store';
	import words from '$lib/data/words.json';

	// Select 5 random word pairs from the dataset
	const selectedWords = words.sort(() => Math.random() - 0.5).slice(0, 5);

	// Create separate card sets for English and Korean
	let englishCards = selectedWords
		.map((word, index) => ({
			id: `en-${index}`,
			text: word.english,
			type: 'english',
			pairId: index
		}))
		.sort(() => Math.random() - 0.5); // Shuffle English cards

	let koreanCards = selectedWords
		.map((word, index) => ({
			id: `ko-${index}`,
			text: word.korean,
			type: 'korean',
			pairId: index
		}))
		.sort(() => Math.random() - 0.5); // Shuffle Korean cards

	// Game state
	const selectedCards = writable([]);
	const matches = writable(new Set());
	const score = writable(0);

	// Handle card selection
	const selectCard = (card) => {
		// Ignore clicks on matched cards
		matches.subscribe((matched) => {
			if (matched.has(card.id)) return;
		});

		// Update selection logic
		selectedCards.update((current) => {
			// Ignore clicks on already selected cards
			if (current.some((c) => c.id === card.id)) return current;

			// Allow selecting up to 2 cards
			return [...current, card].slice(0, 2);
		});
	};

	// Match-checking logic (reactive)
	$: if ($selectedCards.length === 2) {
		const [first, second] = $selectedCards;

		if (first.pairId === second.pairId && first.type !== second.type) {
			// Valid match
			matches.update((set) => {
				set.add(first.id).add(second.id);
				return set;
			});
			score.update((s) => s + 1);
		}

		// Clear selection immediately after processing
		selectedCards.set([]);
	}
</script>

<div>
	<h1>Score: {$score}</h1>
	
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
	h1 {
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
