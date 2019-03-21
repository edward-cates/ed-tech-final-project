<template>
  <div id="app">
    <board />
  </div>
</template>

<script>
import Board from './components/board/Board.vue'

export default {
  name: 'app',
  components: {
    Board,
  },
}
</script>

<style lang="scss">
@import 'assets/styles/main';
</style>
