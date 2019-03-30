<template>
  <div
    ref="board"
    class="board"
  >
    <div
      class="viewport"
      :style="style"
      @mouseup="mouseUp()"
    >
      <div
        :key="rowIx"
        v-for="(row, rowIx) in squares"
      >
        <square
          :key="colIx"
          v-for="(sq, colIx) in row"
          :square="sq"
          @mouseDown="mouseDown({ rowIx, colIx })"
          @mouseEnter="mouseEnter({ rowIx, colIx })"
          @mouseUp="mouseUp({ rowIx, colIx })"
        />
      </div>
    </div>

    <div class="menu">
      <div
        class="menu-bar"
        @click="isToolboxOpen = !isToolboxOpen"
      >
        Toolbox
        <img v-if="!isToolboxOpen" src="@/assets/img/caret-down.svg" />
        <img v-else src="@/assets/img/caret-up.svg" />

        <div v-if="isToolboxOpen" class="dropdown toolbox">
        </div>
      </div>

      <div class="menu-bar">
        Objective
        <img src="@/assets/img/caret-down.svg" />
      </div>

      <div class="menu-bar">
        Controls
        <img src="@/assets/img/caret-down.svg" />
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
  data() {
    return {
      isToolboxOpen: false,
    }
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
  },
}
</script>
