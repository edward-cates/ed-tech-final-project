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
          @mouseEnter="mouseEnter({ sq, rowIx, colIx })"
          @mouseLeave="mouseLeave({ sq })"
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
      </div>
      <div v-if="isToolboxOpen" class="dropdown toolbox">
        <square
          :key="index"
          v-for="(tool, index) in level.tools"
          :square="tool"
          @mouseDown="currentTool = tool"
        />
      </div>

      <div
        class="menu-bar"
        @click="isObjectiveOpen = !isObjectiveOpen"
      >
        Objective
        <img class="icon" v-if="!isObjectiveOpen" src="@/assets/img/caret-down.svg" />
        <img class="icon" v-else src="@/assets/img/caret-up.svg" />
      </div>
      <div v-if="isObjectiveOpen" class="dropdown objective">
        Level 1 Object: Power
        <div
          :key="rowIx"
          v-for="(row, rowIx) in level.objective"
          class="row"
        >
          <div
            :key="colIx"
            v-for="(cl, colIx) in row"
            class="cell"
          >
            <div :class="cl" />
          </div>
        </div>
      </div>

      <div class="menu-bar">
        Controls
        <img class="icon" src="@/assets/img/caret-down.svg" />
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'

import { mapState, mapGetters, mapActions } from 'vuex'

import Square from './Square'

export default {
  name: 'Board',
  components: {
    Square,
  },
  data() {
    return {
      currentSquare: null,
      currentTool: null,
      isObjectiveOpen: false,
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
      'level',
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
      // 'mouseDown',
      // 'mouseEnter',
      // 'mouseUp',
      'pan',
    ]),
    keyDown(ev) {
      if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].indexOf(ev.key) > -1) {
        ev.preventDefault()
        this.pan(ev.key.substring('Arrow'.length))
      }
    },
    mouseDown({ rowIx, colIx }) {
      if (!this.currentTool) {
        this.$store.dispatch('GameBoard/mouseDown', { rowIx, colIx })
      }
    },
    mouseEnter({ sq, rowIx, colIx }) {
      this.currentSquare = sq

      if (this.currentTool) {
        if (!sq.cl) {
          Vue.set(sq, 'cl', this.currentTool.cl)
          sq.tmp = true
        }
      } else {
        this.$store.dispatch('GameBoard/mouseEnter', { rowIx, colIx })
      }
    },
    mouseLeave({ sq }) {
      if (this.currentTool && sq.tmp) {
        sq.cl = undefined
        sq.tmp = undefined
      }
    },
    mouseUp(pos) {
      if (this.currentTool) {
        Object.assign(this.currentSquare, this.currentTool.create(), { tmp: false })
        this.currentTool = null
        this.isToolboxOpen = false
      } else {
        this.$store.dispatch('GameBoard/mouseUp', pos)
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
