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
        @click="toggleMenuBar('Toolbox')"
      >
        Toolbox
        <img class="icon" v-if="!menu.isToolboxOpen" src="@/assets/img/caret-down.svg" />
        <img class="icon" v-else src="@/assets/img/caret-up.svg" />
      </div>
      <div v-if="menu.isToolboxOpen" class="dropdown toolbox">
        <square
          :key="index"
          v-for="(tool, index) in level.tools"
          :square="tool"
          @mouseDown="currentTool = tool"
        />
      </div>

      <div
        class="menu-bar"
        @click="toggleMenuBar('Objective')"
      >
        Objective
        <img class="icon" v-if="!menu.isObjectiveOpen" src="@/assets/img/caret-down.svg" />
        <img class="icon" v-else src="@/assets/img/caret-up.svg" />
      </div>
      <div v-if="menu.isObjectiveOpen" class="dropdown objective">
        <div class="dropdown-title">
          Level {{ currentLevel + 1 }}: {{ level.title }}
        </div>

        <button
          v-if="!isComplete"
          class="test-btn"
          @click="testAll">
          Test
        </button>

        <button
          v-else
          class="test-btn nxt-lvl-btn"
          @click="nextLevel">
          Next Level
        </button>

        <div
          :key="rowIx"
          v-for="(row, rowIx) in level.objective"
          class="row"
          @click="test({ rowIx })"
        >
          <div
            :key="colIx"
            v-for="(cl, colIx) in row.cl"
            class="cell"
          >
            <div :class="cl" />
          </div>

          <img class="score-check" v-if="row.score === true" src="@/assets/img/check.svg" />

          <img class="score-x" v-else-if="row.score === false" src="@/assets/img/x.svg" />
        </div>
      </div>

      <div
        class="menu-bar"
        @click="toggleMenuBar('Controls')"
      >
        Controls
        <img class="icon" v-if="!menu.isControlsOpen" src="@/assets/img/caret-down.svg" />
        <img class="icon" v-else src="@/assets/img/caret-up.svg" />
      </div>
      <div v-if="menu.isControlsOpen" class="dropdown controls">
        <div class="dropdown-title">
          Game Controls

          <div class="game-control-entry">
            <div class="game-control-entry-title">
              Drawing wire
            </div>
            <div class="game-control-entry-details">
              To draw wire, press your mouse down on a square that is next to an ouput
              and drag it to a square that is next to an input.
            </div>
          </div>

          <div class="game-control-entry">
            <div class="game-control-entry-title">
              Toolbox
            </div>
            <div class="game-control-entry-details">
              To use a tool from the Toolbox, click it once in the toolbox
              and then click the square in which to place it.
              Clicking and dragging also works.
            </div>
          </div>

          <div class="game-control-entry">
            <div class="game-control-entry-title">
              Objective
            </div>
            <div class="game-control-entry-details">
              In the Objective box, you can click a specific test case to see how it performs,
              resulting in either a green check or a red X next to the test case.
              You can also click "Test" to sequentially run through each test case.
              The level is complete when each test case shows a green check beside it.
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'

import { mapState, mapActions } from 'vuex'

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
      isCtrl: false,
      menu: {
        isControlsOpen: false,
        isObjectiveOpen: false,
        isToolboxOpen: false,
      }
    }
  },
  computed: {
    ...mapState('GameBoard', [
      'boardHeight',
      'boardShiftX',
      'boardShiftY',
      'boardWidth',
      'currentLevel',
      'isLoading',
      'squares',
      'level',
    ]),
    isComplete() {
      return this.level.objective.every(o => o.score === true)
    },
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
    document.addEventListener('keyup', this.keyUp)
  },
  beforeDestroy() {
    document.removeEventListener('keydown', this.keyDown)
    document.removeEventListener('keyup', this.keyUp)
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
      'nextLevel',
      'pan',
      'testCase',
    ]),
    keyDown(ev) {
      if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].indexOf(ev.key) > -1) {
        ev.preventDefault()
        this.pan(ev.key.substring('Arrow'.length))
      } else if (ev.key === 'Control') {
        this.isCtrl = true
      }
    },
    keyUp(ev) {
      if (ev.key === 'Control') {
        this.isCtrl = false
      }
    },
    mouseDown({ rowIx, colIx }) {
      if (!this.currentTool && !this.isCtrl) {
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
        /**
         * Check that nothing is being overwritten.
         */
        if (this.currentSquare.tmp) {
          Object.assign(this.currentSquare, this.currentTool.create(), { tmp: false })
          this.currentTool = null
          this.menu.isToolboxOpen = false
        }
      } else if (pos && this.isCtrl) {
        this.$store.dispatch('GameBoard/removePath', pos)
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
    async test({ rowIx }) {
      this.toggleMenuBar('Objective')
      await this.testCase({ rowIx })
      this.toggleMenuBar('Objective')
    },
    async testAll() {
      /**
       * Reset all previous scores.
       */
      this.level.objective.forEach(o => o.score = null)

      /**
       * Run each test sequentially
       */
      for (let rowIx = 0; rowIx < this.level.objective.length; ++rowIx) {
        await this.test({ rowIx })
        await new Promise(resolve => setTimeout(resolve, 1000))
      }
    },
    toggleMenuBar(k) {
      Object.keys(this.menu).forEach((key) => {
        if (key.indexOf(k) > -1) {
          this.menu[key] = !this.menu[key]
        } else {
          this.menu[key] = false
        }
      })
    },
  },
}
</script>
