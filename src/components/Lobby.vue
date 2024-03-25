<script setup>
	import { socket } from "@/socket";
	import { ref } from "vue";

	const emit = defineEmits(['close']);
	const props = defineProps({
		username: { type: String }
	});

	var playerList = ref([]);
	var val = ref(0); // thanks to this value, the player list appears; TODO maybe a cleaner solution

	socket.on('update-players', (players) => { // update-players emit from server/main.js
		playerList.value.length = 0; // clear array to avoid duplicate usernames
		players.forEach(player => playerList.value.push(player)); // rewrite array
		val.value++; // for some reason needed to render the list	
	});

	function exitLobby() {
		socket.emit('lobby-exit'); // player-left emit to server/main.js
		emit('close');
	}
</script>

<template>
	<div class="lobby">
		<h1 class="muted-red"> Lobby ipsum </h1>
		<h2 class="muted-red"> Joined as: {{ username }} </h2>
		<div class="list">
			<li v-for="player in playerList"> {{ player }} </li>	
		</div>
		<button type="button" @click="exitLobby()"> Exit </button>
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
