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
  let colors = ["clubs", "diamonds", "hearts", "spades"];
  let figures = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];

	function playCard(cardName, index) {
		socket.emit("game-action", "play-card", index);
		// cardHand.value.splice(index, 1); // remove the card from hand; TODO make card removal server-side?
		// console.log("Card played:", cardName.name, index);
	}

  function drawCard() { // TODO
    socket.emit("game-action", "draw-card");
    //console.log(props.username, "drew a card.");
  }

  function demand(item) { // TODO
    console.log(props.username, "demands:", item)
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
		<div class="muted-red"> Playing as: {{ username }} </div>
		<div class="player-list"> 
			<div class="player-info" v-for="player in playerList"> 
        {{ player.login }}
        <br> 
        {{ player.cardsQuantity }}
      </div>
		</div>

    <div class="card-effects">
      <div v-if="special.value != null"> Special: {{ special.value.name }} </div> 
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
        v-for="option in toChoose"
        @click="demand(option)">
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
			<button type="button" @click="showDemandMenu = true"> [dev] Show demand menu </button>
		</div>
	</div>
</template>

<style scoped> /* TODO rethink divs height when they're filled with content */
	.game {
		background-color: #222222;
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

  .demand,
	.table {
		display: flex;
		justify-content: center;
		align-items: center;
		background-color: #222222;
		height: 100%;
	}

	.card-pile {
		width: 63px; /* 88x63 mm - size of Piatnik poker cards */
		height: 88px;
		background-color: #222222;
		margin: 8px;
	}

	.card-hand {
		background-color: #222222;
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
		background-color: #222222;
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
	
