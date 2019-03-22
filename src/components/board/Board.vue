<template>
  <div
    ref="board"
    class="board"
  >
    <square
      :key="index"
      v-for="index in squares"
    />

    <!-- <div
      @mouseenter="mouseEnter"
      class="pan pan-left"
    /> -->

    <!-- <div class="pan pan-right" /> -->
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

import Square from './Square'

export default {
  name: 'Board',
  components: {
    Square,
  },
  data() {
    const squares = []

    for (let i = 0; i < 100; ++i) {
      squares[i] = i
    }

    return {
      position: { x: 0, y: 0 },
      squares,
    }
  },
  methods: {
    mouseEnter($ev) {
      console.log($ev)
      console.log(this.$refs.board)
    },
  },
}
</script>
