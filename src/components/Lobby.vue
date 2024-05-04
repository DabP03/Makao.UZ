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
  	let roomList = ref([]);
	let val = ref(0); // thanks to this value, the player list appears; TODO maybe a cleaner solution
	let gameOpen = ref(false);
  	let roomOpen = ref(false);

	socket.on('lobby-update', (players, rooms) => { // update-players emit from server/lobby.js
		playerList.value.length = 0; // clear array to avoid duplicate usernames
		players.forEach(player => playerList.value.push(player.login)); // rewrite array
		val.value++; // for some reason needed to render the list	
		roomList = rooms;
	});

	function exitLobby() {
		socket.emit('lobby-exit'); // player-left emit to server/lobby.js
		emit('close');
	}

  function enterRoom(room) {
	socket.emit('game-join', room.id);
	console.log(`Trying to enter room ${room.name} with id ${room.id}`);
	socket.on('game-join-answer', (ans) => {
		if (ans) {
			console.log(`Entered room`);
			roomOpen.value = true;
			emit('logo-hide');
		} else {
			console.log("Cannot enter room")
		}
	});
  }

  function exitRoom() {
    roomOpen.value = false;
    emit('logo-show');
  }

	function startGame() {
		socket.emit('game-start');
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
      <p class="muted-red"> Players in lobby: </p>
			<li v-for="player in playerList"> {{ player }} </li>	
		</div>

    <div class="list">
      <p class="muted-red"> Open game rooms: </p>
      <li v-for="room in roomList"> <!-- TODO unique ids for rooms -->
        <button type="button" @click="enterRoom(room)"> {{ room.name }} </button>
      </li>
    </div>

		<!-- <button type="button" @click="startGame()"> Start game </button>
		<button type="button" @click="exitLobby()"> Log out </button> -->
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
