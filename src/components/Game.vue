<script setup>
	const emit = defineEmits(['close']);
</script>

<template>
	<div class="game">
		Game
		<button type="button" @click="$emit('close')"> Exit to lobby </button>
	</div>
</template>

<style scoped>
	.game {
		display: flex;
		flex-direction: column; /* Puts all buttons in a column */
		padding: 5px;
		width: 50%;
		margin: auto; /* Centers button-group inside greeting */
	}
	
	button {
		padding: 5px;
		margin: 5px;
	}
	@media (min-width: 1024px) {
  	.game {
  	  text-align: center;
			width: 100%;
		}
	}
</style>
	
