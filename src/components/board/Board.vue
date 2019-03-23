<template>
  <div
    ref="board"
    class="board"
  >
    <div
      class="viewport"
      :style="style"
    >
      <square
        :key="index"
        v-for="(type, index) in squares"
        :is-center="isCenterSquare(index)"
        :label="(index + 1)"
        :type="type"
      />
    </div>
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'

import Square from './Square'

export default {
  name: 'Board',
  components: {
    Square,
  },
  computed: {
    ...mapState('GameBoard', [
      'boardHeight',
      'boardShiftX',
      'boardShiftY',
      'boardWidth',
      'isLoading',
      'squares',
    ]),
    style() {
      const shift = `left: ${this.boardShiftX}px; top: ${this.boardShiftY}px`
      if (this.boardWidth && this.boardHeight) {
        return `${shift}; width: ${this.boardWidth}px; height: ${this.boardHeight}px`
      }
      return shift
    },
  },
  mounted() {
    const board = this.$refs.board.getBoundingClientRect()

    this.loadViewport({
      board,
    })
  },
  methods: {
    ...mapActions('GameBoard', [
      'loadViewport',
    ]),
    isCenterSquare(index) {
      const centerIndex = Math.floor(this.squares.length / 2)
      return index === centerIndex
    },
    mouseEnter($ev) {
      console.log($ev)
      console.log(this.$refs.board)
    },
  },
}
</script>
