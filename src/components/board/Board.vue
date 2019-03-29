<template>
  <div
    ref="board"
    class="board"
  >
    <div
      class="viewport"
      :style="style"
    >
      <div
        :key="rowIx"
        v-for="(row, rowIx) in squares"
      >
        <square
          :key="colIx"
          v-for="(sq, colIx) in row"
          :is-center="isCenterSquare({ rowIx, colIx })"
          :square="sq"
          @mouseDown="mouseDown({ rowIx, colIx })"
          @mouseEnter="mouseEnter({ rowIx, colIx })"
          @mouseUp="mouseUp({ rowIx, colIx })"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'

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
      'mouseDown',
      'mouseEnter',
      'mouseUp',
    ]),
    isCenterSquare({ rowIx, colIx }) {
      return rowIx === Math.floor(this.squares.length / 2)
        && colIx === Math.floor(this.squares[rowIx].length / 2)
    },
  },
}
</script>
