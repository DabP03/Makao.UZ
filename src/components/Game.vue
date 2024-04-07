<script setup>
	const emit = defineEmits(['close']);
</script>

<template>
	<div class="game">
		<div class="player-list"> Player list </div>
		<div class="table">
			<div class="card-pile"> Card pile </div> <!-- where players put their cards -->
			<div class="card-deck"> Card deck </div> <!-- where players draw cards from -->
		</div>
		<div class="hud">
			<button type="button"> End turn </button>
			<button type="button"> MAKAO </button>
			<button type="button" @click="$emit('close')"> Exit to lobby </button>
		</div>
	</div>
</template>

<style scoped>
	.game {
  	text-align: center; /* always centered, no matter the screen size */
		display: flex;
		flex-direction: column;
	}

	.player-list {
		background-color: blue;
		height: 20%;
	}

	.table {
		display: flex;
		justify-content: center;
		align-items: center;
		background-color: brown;
		height: 100%;
	}

	.hud {
		background-color: blue;
		height: 20%;
		display: flex;
		justify-content: center; /* Centers content width-wise */
		align-items: center; /* Centers content height-wise preserving the default height */
	}
	
	button {
		padding: 5px;
		margin: 5px;
	}

	@media (min-width: 1024px) {
  	.game {
			width: 100%;
		}
	}
</style>
	
