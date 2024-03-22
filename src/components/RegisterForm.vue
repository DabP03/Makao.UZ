<script setup>
	const emit = defineEmits(['close', 'register-submit']);
  
	var login = "";
	var password = "";
	var confirm_password = "";
	
	function registerSubmit() {
		if(password == confirm_password) {
			console.log('register-submitted', login, password);
			emit('register-submit', login, password);
		} else {
			console.log("Passwords don't match");
		}
		emit('close');
	}
</script>

<template>
	<div class="register-form">
		<input type="text" v-model.trim="login" placeholder="Login" />

		<input type="password" v-model.trim="password" placeholder="Password" />

		<input type="password" v-model.trim="confirm_password" placeholder="Confirm password" />

		<button type="button" @click="$emit('close')"> Cancel </button>
		<input type="submit" @click="registerSubmit()" value="Submit" />
	</div>
</template>

<style scoped>
	.register-form {
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

