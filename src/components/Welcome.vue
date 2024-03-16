<script setup>
defineProps({
  msg: {
    type: String,
    required: true
  }
})
</script>

<template>
  <div class="greetings">
    <h1 class="muted-red">{{ msg }}</h1>
    <h3>
			Lorem ipsum dolor sit amet.
    </h3>
		<div class="button-group">
			<button type="button"> Login </button>
			<button type="button"> Register </button>
		</div>
  </div>
</template>

<style scoped>
h1 {
  font-weight: 500;
  font-size: 3.6rem;
  position: relative;
  top: -10px;
}

h3 {
  font-size: 1.2rem;
}

.greetings h1,
.greetings h3 {
  text-align: center;
}

.button-group {
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
  .greetings h1,
  .greetings h3 {
    text-align: left;
  }
	.button-group {
		width: 100%;
	}
}
</style>
