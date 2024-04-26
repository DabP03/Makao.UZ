<script setup>
	import { ref } from "vue";
  const props = defineProps({
		username: { type: String },
	});

	let playerList = ref([]);
	let val = ref(0); // thanks to this value, the player list appears; TODO maybe a cleaner solution

</script>

<template>
  <div class="room">
		<h2 class="muted-red"> Logged in as: {{ username }} </h2>
    Room
    <button type="button" @click="$emit('close')"> Exit to lobby </button>
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
