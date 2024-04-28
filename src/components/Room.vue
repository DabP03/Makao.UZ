<script setup>
	import { socket } from "@/socket";
	import { ref } from "vue";
  import Game from "./Game.vue";
	
  const emit = defineEmits(['close', 'game-start']);
  const props = defineProps({
		username: { type: String },
	});

	let playerList = ref([]);
	let val = ref(0); // thanks to this value, the player list appears; TODO maybe a cleaner solution
  let gameOpen = ref(false);

//  TODO only show players in that particular game room, not in entire lobby
  socket.on('update-players', (players) => { // update-players emit from server/lobby.js
		playerList.value.length = 0; // clear array to avoid duplicate usernames
		players.forEach(player => playerList.value.push(player.login)); // rewrite array
		val.value++; // for some reason needed to render the list	
	});

  function startGame() {
		emit('game-start');
		gameOpen.value = true;
	}

	function exitGame() {
		gameOpen.value = false;
	}
</script>

<template>
  <div class="room" v-if="!gameOpen">
		<h2 class="muted-red"> Joined as: {{ username }} </h2>
    
    <div class="list">
			<li v-for="player in playerList"> {{ player }} </li>	
		</div>

		<button type="button" @click="startGame()"> Start game </button>
    <button type="button" @click="$emit('close')"> Exit to lobby </button>
  </div>
  <div class="game" v-if="gameOpen">
		<Game
			:username=username
      :playerList=playerList
			@close="exitGame()"/>
	</div>
</template>

<style scoped>
  .room {
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

	button {
		padding: 5px;
		margin: 5px;
	}

	@media (min-width: 1024px) {
  	.room {
  	  text-align: left;
			width: 100%;
		}
	}
</style>
