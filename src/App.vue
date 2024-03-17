<script setup>
import Welcome from './components/Welcome.vue'
</script>

<template>
  <header>
    <img alt="Makao logo" class="logo" src="./assets/a_hearts.png" width="125" height="190" />

    <div class="wrapper">
      <Welcome msg="Makao" />
    </div>
  </header>

  <main>
  </main>
</template>

<style scoped>
header {
  line-height: 1.5;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }
}
</style>
