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
        <img class="icon" v-if="!isToolboxOpen" src="@/assets/img/caret-down.svg" />
        <img class="icon" v-else src="@/assets/img/caret-up.svg" />

        <div v-if="isToolboxOpen" class="dropdown toolbox">
          <square
            :key="index"
            v-for="(tool, index) in tools"
            :square="tool"
          />
        </div>
      </div>

      <div class="menu-bar">
        Objective
        <img class="icon" src="@/assets/img/caret-down.svg" />
      </div>

      <div class="menu-bar">
        Controls
        <img class="icon" src="@/assets/img/caret-down.svg" />
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
      'tools',
    ]),
    style() {
      const shift = `left: ${this.boardShiftX}px; top: ${this.boardShiftY}px`
      if (this.boardWidth && this.boardHeight) {
        return `${shift}; width: ${this.boardWidth}px; height: ${this.boardHeight}px`
      }
      return shift
    },
  },
  created() {
    document.addEventListener('keydown', this.keyDown)
    // document.addEventListener('mousewheel', this.scroll)
  },
  beforeDestroy() {
    document.removeEventListener('keydown', this.keyDown)
    // document.removeEventListener('mousewheel', this.scroll)
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
      'pan',
    ]),
    keyDown(ev) {
      if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].indexOf(ev.key) > -1) {
        ev.preventDefault()
        this.pan(ev.key.substring('Arrow'.length))
      }
    },
    scroll(ev) {
      const thresh = 10

      if (ev.deltaX > thresh) {
        this.pan('Right')
      } else if (ev.deltaX < -thresh) {
        this.pan('Left')
      }

      if (ev.deltaY > thresh) {
        this.pan('Down')
      } else if (ev.deltaY < -thresh) {
        this.pan('Up')
      }
    },
  },
}
</script>
