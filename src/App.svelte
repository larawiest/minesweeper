<script lang="ts">
	import Minesweeper from './Minesweeper.svelte';
	import TicTacToe from './TicTacToe.svelte';
	import BigTicTacToe from './BigTicTacToe.svelte';

	let selectedGame: string | null = null;

	function selectGame(game: string) {
		selectedGame = game;
	}

	function goBack() {
		selectedGame = null;
	}
</script>

<main class="min-h-screen flex flex-col items-center justify-center gap-8 bg-gray-100 p-6 text-center">

	{#if selectedGame === null}
		<h1 class="text-3xl font-bold">Wähle ein Spiel:</h1>

		<div class="flex flex-col gap-4">
			<button class="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600" on:click={() => selectGame('minesweeper')}>
				Minesweeper
			</button>
			<button class="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600" on:click={() => selectGame('tictactoe')}>
				Tic Tac Toe
			</button>
			<button class="px-6 py-3 bg-pink-500 text-white rounded-lg hover:bg-pink-600" on:click={() => selectGame('bigtictactoe')}>
				Big Tic Tac Toe
			</button>
		</div>

	{:else if selectedGame === 'minesweeper'}
		<button class="absolute top-6 left-6 bg-gray-200 px-3 py-1 rounded hover:bg-gray-300" on:click={goBack}>
			← Zurück
		</button>
		<Minesweeper />

	{:else if selectedGame === 'bigtictactoe'}
		<button class="absolute top-6 left-6 bg-gray-200 px-3 py-1 rounded hover:bg-gray-300" on:click={goBack}>
			← Zurück
		</button>
		<BigTicTacToe />

	{:else if selectedGame === 'tictactoe'}
		<button class="absolute top-6 left-6 bg-gray-200 px-3 py-1 rounded hover:bg-gray-300" on:click={goBack}>
			← Zurück
		</button>
		<TicTacToe />
	{/if}

</main>

