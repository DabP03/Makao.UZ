<script setup>
	import { socket } from "@/socket";
	import { ref } from "vue";
	const emit = defineEmits(['close']);
	const props = defineProps({
		username: { type: String },
		playerList: { type: Array, default: ["one", "two", "three"] }
	});

	let cardHand = ref([1, 2, 3]);
	let cardOnPile = ref(0);

	function playCard() {
		socket.emit("game-action", "play-card", 0);// index zamiast 0
		console.log("Card played");
		// remove from hand
	}

	socket.on('game-update', (gameState) => {
		console.log("game updated", gameState);
 	});	
</script>

<template>
	<div class="game">
		<div class="muted-red"> Playing as: {{ username }} </div>
		<div class="player-list"> 
			<div class="player-info" v-for="player in playerList"> 
        {{ player.login }}
        <br> 
        {{ player.cardsQuantity }}
        {{ gameState }}
      </div>
		</div>
		<div class="table">
      <div class="card-pile"> {{ cardOnPile.value }} </div> <!-- where players play their cards -->
			<div class="card-deck"> Card deck </div> <!-- where players draw cards from -->
		</div>
		<div class="card-hand">
      <div class="card" v-for="card in cardHand" @click="playCard()"> {{ card }} </div>	
		</div>
		<div class="hud">
			<button type="button"> End turn </button>
			<button type="button"> MAKAO </button>
			<button type="button" @click="$emit('close')"> Exit </button>
		</div>
	</div>
</template>

<style scoped> /* TODO rethink divs height when they're filled with content */
	.game {
  	text-align: center; /* always centered, no matter the screen size */
		display: flex;
		flex-direction: column;
	}

	.player-list {
		background-color: blue;
		height: 20%;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.player-info {
		padding-left: 8px;
		padding-right: 8px;
	}

	.table {
		display: flex;
		justify-content: center;
		align-items: center;
		background-color: brown;
		height: 100%;
	}

	.card-pile {
		min-width: 63px; /* 88x63 mm - size of Piatnik poker cards */
		min-height: 88px;
		background-color: #222222;
		margin: 8px;
	}

	.card-deck {
		min-width: 63px;
		min-height: 88px;
		background-color: #222222;
		margin: 8px;
	}

	.card-hand {
		background-color: #222222;
		height: 40%;
		display: flex;
    justify-content: center;
	}

  .card {
    background-color: white;
    min-width: 63px;
		min-height: 88px;
    margin: 8px;
  }

	.hud {
		background-color: blue;
		height: 15%;
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
	
