<script setup>
	import { socket } from "@/socket";
	import { ref } from "vue";
	import Game from "./Game.vue";
  import Room from "./Room.vue";

	const emit = defineEmits(['close', 'game-start', 'logo-hide', 'logo-show']);
	const props = defineProps({
		username: { type: String }
	});

	let playerList = ref([]);
  let roomList = ref(["Room 1"]);
	let val = ref(0); // thanks to this value, the player list appears; TODO maybe a cleaner solution
	let gameOpen = ref(false);
  let roomOpen = ref(false);

	socket.on('update-players', (players) => { // update-players emit from server/lobby.js
		playerList.value.length = 0; // clear array to avoid duplicate usernames
		players.forEach(player => playerList.value.push(player.login)); // rewrite array
		val.value++; // for some reason needed to render the list	
	});

	function exitLobby() {
		socket.emit('lobby-exit'); // player-left emit to server/lobby.js
		emit('close');
	}

  function enterRoom() {
    roomOpen.value = true;
    emit('logo-hide');
  }

  function exitRoom() {
    roomOpen.value = false;
    emit('logo-show');
  }

	function startGame() {
		emit('game-start');
		gameOpen.value = true;
		emit('logo-hide');
	}

	function exitGame() {
		gameOpen.value = false;
		emit('logo-show');
	}
</script>

<template>
	<div class="lobby" v-if="!gameOpen && !roomOpen">
		<h1 class="muted-red"> Lobby ipsum </h1>
		<h2 class="muted-red"> Logged in as: {{ username }} </h2>
		<div class="list">
			<li v-for="player in playerList"> {{ player }} </li>	
		</div>
    <div class="list">
      <li v-for="room in roomList"> <!-- TODO unique ids for rooms -->
        <button type="button" @click="enterRoom()"> {{ room }} </button>
      </li>
    </div>
		<button type="button" @click="startGame()"> Start game </button>
		<button type="button" @click="exitLobby()"> Exit </button>
	</div>
	<div class="game" v-if="gameOpen">
		<Game
			:username=username
      :playerList=playerList
			@close="exitGame()"/>
	</div>
  <div class="room" v-if="roomOpen">
    <Room
      :username=username
      @close="exitRoom()"/>
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

	.game { /* game div is fullscreen */
		position: fixed;
		top: 0;
		left: 0;
		background-color: white;
		width: 100%;
		height: 100%;
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
