<script setup>
	import { socket } from "@/socket";
	import { ref } from "vue";
	const emit = defineEmits(['close']);
	const props = defineProps({
		username: { type: String },
	});

  let playerList = ref([]);
	let cardHand = ref([]);
	let cardOnPile = ref(0);
  let special = ref(0);
  let toChoose = ref(0);
  let showDemandMenu = ref(false);

	function playCard(cardName, index) {
		socket.emit("game-action", "play-card", index);
	}

  function drawCard() {
    socket.emit("game-action", "draw-card");
  }

  function demand(item) {
    socket.emit("game-action", "choose", item);
    showDemandMenu.value = false; 
  }

  function Makao() {
    socket.emit("game-action", "say-makao");
  }

  socket.on('game-start', (gameState) => { // TODO delete?
    playerList.value = Array.from(gameState.others);
    cardHand.value = Array.from(gameState.cards);
    cardOnPile.value = gameState.stackTop;
    console.log("game started", gameState);
  });

	socket.on('game-update', (gameState) => {
    playerList.value = Array.from(gameState.others);
    cardHand.value = Array.from(gameState.cards);
    cardOnPile.value = gameState.stackTop;
    special.value = gameState.special;
    toChoose.value = gameState.toChoose;
    if(toChoose.value != null) {
      showDemandMenu.value = true;
    }
		console.log("game updated", gameState);
 	});	
</script>

<template>
	<div class="game">
		<div class="info"> Playing as: {{ username }} </div>
		<div class="player-list"> 
			<div class="player-info" v-for="player in playerList"> 
        {{ player.login }}
        <br> 
        {{ player.cardsQuantity }}
      </div>
		</div>

    <div class="info" v-if="special.value != null"> 
      {{ special.name }}: {{ special.value }} 
    </div>

		<div class="table" v-if="!showDemandMenu">
      <img
        class="card-pile"
        :src="'/src/assets/cardSprites/' + cardOnPile.filename"
        :alt=cardOnPile.name> <!-- where players play their cards -->
			<img
        class="card-deck"
        src="/src/assets/cardSprites/reverseRed.png"
        alt="Card deck"
        @click="drawCard()"> <!-- where players draw cards from -->
		</div>

    <div class="demand" v-if="showDemandMenu">
      <button
        type="button"
        class="card"
        v-for="(option, index) in toChoose"
        @click="demand(index)">
          {{ option }}
      </button>
    </div>

    <div class="card-hand">
      <img
        class="card" 
        :src="'/src/assets/cardSprites/' + card.filename" 
        :alt=card.name
        v-for="(card, index) in cardHand" 
        @click="playCard(card, index)">
    </div>

		<div class="hud">
			<button type="button" @click="Makao()"> MAKAO </button>
			<button type="button" @click="$emit('close')"> Exit </button>
		</div>
	</div>
</template>

<style scoped> /* TODO rethink divs height when they're filled with content */
	.game {
		background-color: #181818;
  	text-align: center; /* always centered, no matter the screen size */
		display: flex;
		flex-direction: column;
	}

  .info {
    background-color: #181818;
    color: #f56666;
  }

	.player-list {
		background-color: #181818;
		height: 20%;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.player-info {
		padding-left: 8px;
		padding-right: 8px;
	}

  .demand,
	.table {
		display: flex;
		justify-content: center;
		align-items: center;
		background-color: #181818;
		height: 100%;
	}

	.card-pile {
		width: 63px; /* 88x63 mm - size of Piatnik poker cards */
		height: 88px;
		background-color: #181818;
		margin: 8px;
	}

	.card-hand {
		background-color: #181818;
		height: 40%;
		display: flex;
    justify-content: center;
		align-items: center;
  }

  .card-deck,
  .card {
    width: 63px;
		height: 88px;
    margin: 8px;
    font-size: 28px;
    font-weight: bold;
  }

  .card-deck:hover,
  .card:hover {
    position: relative;
    right: 5px;
    bottom: 5px;
  }

  .card-deck:active,
  .card:active {
    scale: 90%;
  }

	.hud {
		background-color: #181818;
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
	
