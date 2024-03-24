<script setup>
	import { socket } from "@/socket";
	import { ref, reactive} from "vue";
	const emit = defineEmits(['close']);
	
	const login = "placeholder";
	var playerList = ref([]);
	var showList = ref(false);
	var val = ref(0); // thanks to this value, the player list appears; TODO maybe a cleaner solution

	function updatePlayers(players) {
		playerList.value.length = 0; // clear array to avoid duplicate usernames
		players.forEach(player => playerList.value.push(player));
		val.value++;	
	}

	function exitLobby() {
		//socket.emit('player-left', login);
		emit('close');
	}

	function logPlayers() { // for debugging
		console.log("Player list on the client:");
		playerList.value.forEach(player => console.log(player));
	}

	socket.on('update-players', (players) => { // update-players emit from server/main.js
		updatePlayers(players);
	});
</script>

<template>
	<div class="lobby">
		<h1 class="muted-red"> Lobby ipsum </h1>
		<h2 class="muted-red"> Joined as: {{ login }} </h2>
		<div class="list">
			<li v-for="player in playerList"> {{ player }} </li>	
		</div>
		<button type="button" @click="exitLobby()"> Exit </button>
		<button type="button" @click="logPlayers()"> Log players </button> <!-- for debugging -->
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
