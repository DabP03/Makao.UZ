<script setup>
	import { socket } from "@/socket";

	function updatePlayers(players) {
		players.forEach(player => console.log(player));
	}

	socket.on('update-players', (players) => {
		updatePlayers(players);
	});
</script>

<template>
	<div class="lobby">
		<h1 class="muted-red">Lobby ipsum</h1>
		<div class="list">
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
