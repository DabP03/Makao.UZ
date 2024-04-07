<script setup>
	import { ref } from "vue";
	import Welcome from "./components/Welcome.vue";
	import Lobby from "./components/Lobby.vue";
	
	var lobbyOpen = ref(false);
	var username = "";
	var logoVisible = ref(true);

	function openLobby(login) {
		lobbyOpen.value = true;
		username = login;
	}
</script>

<template>
  <main>
		<img v-if="logoVisible" alt="Makao logo" class="logo" src="./assets/a_hearts.png" width="125" height="190" />

    <div class="wrapper">
      <Welcome msg="Makao" username
				v-if="!lobbyOpen"
				@open-lobby="openLobby"/> <!-- open-lobby emit from Welcome.vue <- LoginForm.vue -->
			<Lobby :username=username
				v-else-if="lobbyOpen" 
				@close="lobbyOpen=false"
				@logo-hide="logoVisible=false"
				@logo-show="logoVisible=true"/>
    </div>
  </main>
</template>

<style scoped>
main {
  line-height: 1.5;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

@media (min-width: 1024px) {
	main {
    display: flex;
    place-items: center;
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  main .wrapper {
    display: flex;
    place-items: center;
    flex-wrap: wrap;
  }
}
</style>
