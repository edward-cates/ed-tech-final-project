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
        @mousedown="toggleMenuBar('none')"
      >
        <square
          :key="colIx"
          v-for="(sq, colIx) in row"
          :square="sq"
          @mouseDown="mouseDown({ rowIx, colIx })"
          @mouseEnter="mouseEnter({ sq, rowIx, colIx })"
          @mouseLeave="mouseLeave({ sq })"
          @mouseUp="mouseUp({ rowIx, colIx })"
          @rightClick="rightClick({ rowIx, colIx })"
        />
      </div>
    </div>

    <div class="menu">
      <div
        class="menu-bar"
        @click="toggleMenuBar('Levels')"
      >
        Levels
        <img class="icon" v-if="!menu.isLevelsOpen" src="@/assets/img/caret-down.svg" />
        <img class="icon" v-else src="@/assets/img/caret-up.svg" />
      </div>
      <div v-if="menu.isLevelsOpen" class="dropdown levels">
        <div
          :key="index"
          v-for="(level, index) in levels.filter((l, i) => i <= maxLevel)"
        >
          <div
            class="level"
            @click="setLevel({ index })"
          >
            Level {{ index + 1 }}: {{ level.title }}
          </div>
        </div>
      </div>

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
          :tooltip="tool.tooltip"
          @mouseDown="currentTool = tool" />
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
        </div>

        <div class="game-control-entry">
          <div class="game-control-entry-title">
            Removing wire and tools
          </div>
          <div class="game-control-entry-details">
            Right click on wire or a tool to remove it.
          </div>
        </div>

        <div class="game-control-entry">
          <div class="game-control-entry-title">
            Drawing wire
          </div>
          <div class="game-control-entry-details">
            To draw wire, press your mouse down on a square that is <i>next</i> to an ouput
            and drag it to a square that is <i>next</i> to an input.
          </div>
        </div>

        <div class="game-control-entry">
          <div class="game-control-entry-title">
            Tools & Toolbox
          </div>
          <div class="game-control-entry-details">
            To use a tool from the Toolbox, click it once in the toolbox
            and then click the square in which to place it.
            Clicking and dragging also works.
            <br><br>
            Arrows pointing to the center of a tool are input, and arrows pointing away from center are outputs.
          </div>
        </div>

        <div class="game-control-entry">
          <div class="game-control-entry-title">
            Objective
          </div>
          <div class="game-control-entry-details">
            In the Objective box, you can click a specific test case to see how it performs,
            resulting in either a green check or a red X next to the test case.
            You can also click "Check Your Solution" to sequentially run through each test case.
            The level is complete when each test case shows a green check beside it.
          </div>
        </div>

        <div class="game-control-entry">
          <div class="game-control-entry-title">
            Pan the breadboard
          </div>
          <div class="game-control-entry-details">
            You can pan the board using the arrow keys.
          </div>
        </div>
      </div>
    </div>

    <div
      v-if="level"
      class="objective"
    >
      <div class="title">
        Level {{ currentLevel + 1 }}: {{ level.title }}
      </div>

      <div
        class="info"
        @click="showObjectiveInfo = !showObjectiveInfo"
      >
        <img src="@/assets/img/info.svg" />
        Click to toggle objective summary
      </div>

      <template v-if="!showObjectiveInfo">
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

          <img class="score-loading" v-if="row.isLoading" src="@/assets/img/loading.gif" />

          <img class="score-check" v-else-if="row.score === true" src="@/assets/img/check.svg" />

          <img class="score-x" v-else-if="row.score === false" src="@/assets/img/x.svg" />

          <div class="score-detail">
            {{ row.detail }}
          </div>
        </div>
      </template>

      <div
        v-else
        class="explanation"
      >
        {{ level.explanation }}
        <br><br>
        Click "Check Your Solution" to check your solution and make it to the next level.
      </div>

      <button
        v-if="isTesting || isTestingAll"
        class="test-btn loading-btn"
      >
        <img src="@/assets/img/loading.gif" />
      </button>

      <button
        v-else
        class="test-btn"
        @click="testAll">
        Check Your Solution
      </button>

      <button
        v-bind:disabled="!isComplete"
        class="test-btn nxt-lvl-btn"
        @click="nextLevel">
        Go to the Next Level
      </button>
    </div>

    <div
      class="modal"
      v-if="level && level.alert && !isAlertDismissed">
      <div class="text">
        {{ level.alert }}
        <br><br>
        <button @click="dismissAlert">ok</button>
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
      isTesting: false,
      isTestingAll: false,
      menu: {
        isLevelsOpen: false,
        isControlsOpen: false,
        isObjectiveOpen: false,
        isToolboxOpen: false,
      },
      showObjectiveInfo: false,
    }
  },
  computed: {
    ...mapState('GameBoard', [
      'boardHeight',
      'boardShiftX',
      'boardShiftY',
      'boardWidth',
      'currentLevel',
      'isAlertDismissed',
      'isLoading',
      'squares',
      'level',
      'levels',
      'maxLevel',
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
  },
  beforeDestroy() {
    document.removeEventListener('keydown', this.keyDown)
  },
  mounted() {
    const board = this.$refs.board.getBoundingClientRect()

    this.loadViewport({
      board,
    })
  },
  methods: {
    ...mapActions('GameBoard', [
      'dismissAlert',
      'loadViewport',
      // 'mouseDown',
      // 'mouseEnter',
      // 'mouseUp',
      'nextLevel',
      'pan',
      'setLevel',
      'testCase',
    ]),
    keyDown(ev) {
      if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].indexOf(ev.key) > -1) {
        ev.preventDefault()
        this.pan(ev.key.substring('Arrow'.length))
      }
    },
    mouseDown({ rowIx, colIx }) {
      if (!this.currentTool) {
        const sq = this.squares[rowIx][colIx]

        const areSurroundingsEmpty = [[0,-1],[0,1],[-1,0],[1,0]].every(([rowDiff, colDiff]) => {
          return !this.squares[rowIx + rowDiff][colIx + colDiff].cl
        })

        if (sq.cl && sq.cl.indexOf('gate') > -1 && areSurroundingsEmpty) {
          this.currentTool = this.level.tools.find((tool) => {
            const prefix = tool.cl.substr(0, tool.cl.indexOf('gate-'))
            return (sq.cl.indexOf(prefix) === 0)
          })

          /**
           * FIXME
           * This logic should reside in the `GameBoard` VueX controller
           */
          Vue.set(this.squares[rowIx], colIx, {
            cl: this.currentTool.cl,
            tmp: true,
          })
        } else {
          this.$store.dispatch('GameBoard/mouseDown', { rowIx, colIx })
        }
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
          this.$store.dispatch('GameBoard/mouseUp') // render board
        }
      } else {
        this.$store.dispatch('GameBoard/mouseUp', pos)
      }
    },
    rightClick({ rowIx, colIx }) {
      this.$store.dispatch('GameBoard/removePath', { rowIx, colIx })
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
      this.isTesting = true

      Vue.set(this.level.objective[rowIx], 'isLoading', true)
      await this.testCase({ rowIx })
      this.level.objective[rowIx].isLoading = false

      this.isTesting = false
    },
    async testAll() {
      this.isTestingAll = true

      /**
       * Reset all previous scores.
       */
      this.level.objective.forEach(o => o.score = null)

      /**
       * Run each test sequentially
       */
      for (let rowIx = 0; rowIx < this.level.objective.length; ++rowIx) {
        await this.test({ rowIx })
      }

      this.isTestingAll = false
    },
    toggleMenuBar(k) {
      Object.keys(this.menu).forEach((key) => {
        if (key.indexOf(k) > -1) {
          this.menu[key] = !this.menu[key]
        } else {
          this.menu[key] = false
        }
      })

      this.showObjectiveInfo = false
    },
  },
}
</script>
