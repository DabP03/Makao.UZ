<script setup>
</script>

<template>
	<div class="lobby">
		<h1 class="muted-red">Lobby ipsum</h1>
		<div class="player-list">
			No players yet.
		</div>
		<button type="button" @click="$emit('close')"> Exit </button>
	</div>
</template>

<style scoped>
	.lobby {
		display: flex;
		flex-direction: column; /* Puts all buttons in a column */
		padding: 5px;
		width: 50%;
		margin: auto; /* Centers button-group inside greeting */
	}
	
	input,
	button {
		padding: 5px;
		margin: 5px;
	}
	@media (min-width: 1024px) {
  	.lobby {
  	  text-align: left;
			width: 100%;
		}
	}
</style>
