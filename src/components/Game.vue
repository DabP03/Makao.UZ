<script setup>
	import { socket } from "@/socket";
	import { ref } from "vue";
	const emit = defineEmits(['close']);
	const props = defineProps({
		username: { type: String },
		playerList: { type: Array, default: ["one", "two", "three"] }
	});

	let cardHand = ref(["aHearts", "aSpades", "aClubs", "aDiamonds"]);
	let cardOnPile = ref(0);
  let showDemandMenu = ref(false);
  let colors = ["clubs", "diamonds", "hearts", "spades"];
  let figures = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];

	function playCard(cardName, index) {
		socket.emit("game-action", "play-card", index);
		cardHand.value.splice(index, 1); // remove the card from hand; TODO make card removal server-side?
		console.log("Card played:", cardName.name, index);
	}

  function drawCard() {
    console.log(props.username, "drew a card.");
  }

  function demand(item) { // żądanie
    console.log(props.username, "demands:", item)
    showDemandMenu.value = false; 
  }

  function Makao() {
    console.log("Idioto, gramy w pokera.");
  }

  socket.on('game-start', (gameState) => { //not working yet
    cardHand.value = Array.from(gameState.cards); //need filename
    cardOnPile.value = gameState.stackTop;
    console.log("game started", gameState);
  });

	socket.on('game-update', (gameState) => {
    cardHand.value = Array.from(gameState.cards); //need filename
    cardOnPile.value = gameState.stackTop;
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

		<div class="table" v-if="!showDemandMenu">
      <div class="card-pile"> {{ cardOnPile.name }} </div> <!-- where players play their cards -->
			<img
        class="card-deck"
        src="/src/assets/cardSprites/reverseRed.png"
        alt="Card deck"
        @click="drawCard()"> <!-- where players draw cards from -->
		</div>

    <div class="demand" v-if="showDemandMenu"> <!-- TODO render either only colors or figures -->
      <button
        type="button"
        v-for="color in colors"
        @click="demand(color)">
          {{ color }}
      </button>
      <button
        type="button"
        v-for="figure in figures"
        @click="demand(figure)">
          {{ figure }}
      </button>
    </div>

    <div class="card-hand">
      <img
        class="card" 
        :src="'/src/assets/cardSprites/' + cardName + '.png'" 
        :alt=cardName.name
        v-for="(cardName, index) in cardHand" 
        @click="playCard(cardName, index)">
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
		background-color: brown;
		height: 100%;
	}

	.card-pile {
		min-width: 63px; /* 88x63 mm - size of Piatnik poker cards */
		min-height: 88px;
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
	
