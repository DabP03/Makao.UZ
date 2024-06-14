<script setup>
	import { socket } from "@/socket"; // masz Jaca 2 funkcje jedą do hashowania jedną do sprawdzania
	const emit = defineEmits(['close', 'login-submit', 'open-lobby']);

	var login = "";
	var password = "";

	function loginSubmit() {
		console.log('Login submitted', login, password);
		socket.emit('login-submit', login, password); // emit to server/main.js
		socket.on('login-submit-answer', (result) => {
			if (result) {
				emit('open-lobby', login); // emit to App.vue; TODO lobby opens only if login is valid
				emit('close');
			} else {
				console.log('Can not login')
			}
		});
	}
</script>

<template>
	<div class="login-form">
		<input type="text" v-model.trim="login" placeholder="Login" />

		<input type="password" v-model.trim="password" placeholder="Password" />

		<input type="submit" @click="loginSubmit()" value="Submit" />
		<button type="button" @click="$emit('close')"> Cancel </button>
	</div>
</template>

<style scoped>
	.login-form {
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
  	.login-form {
  	  text-align: left;
			width: 100%;
		}
	}
</style>
