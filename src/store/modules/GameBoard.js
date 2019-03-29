import Vue from 'vue'
import { stat } from 'fs';

const levels = [
  {
    2: {
      3: { cl: 'grn-btn' },
      7: { cl: 'org-lgt' },
    },
  },
]

const state = {
  boardHeight: 0,
  boardShiftX: 0,
  boardShiftY: 0,
  boardWidth: 0,
  isLoading: true,
  mousePath: null,
  squares: [],
  viewport: {},
}

const getters = {
  //
}

const mutations = {
  /**
   * Fill `squares` to draw `mousePath`
   * 
   * Don't overwrite permanent fixtures.
   * Cross over existing paths where applicable.
   * Needs to take into account input/output directions.
   */
  appendMousePath(state, { rowIx, colIx }) {
    state.mousePath.end = { rowIx, colIx }
    state.mousePath.stack.push(state.mousePath.end)

    if (!state.squares[rowIx][colIx].cl) {
      /**
       * TODO modify last connector and current one
       * so that the align.
       */

      Vue.set(state.squares[state.mousePath.end.rowIx], state.mousePath.end.colIx, {
        cl: 'wire',
        tmp: true,
      })
    }
  },

  finalizeMousePath(state) {
    /**
     * Clean last path
     */
    state.squares.forEach((row) => {
      row.forEach((square, colIx) => {
        if (square.tmp) {
          Vue.set(row, colIx, {})
        }
      })
    })    

    state.mousePath = null
  },

  initializeMousePath(state, { rowIx, colIx }) {
    state.mousePath = {
      start: { rowIx, colIx },
      end: null,
      stack: [],
    }
  },

  render(state, { board }) {
    const side = 100 + 2 + 4 // width + border + margin

    let vertBoxes = Math.ceil(board.height / side)
    let horizBoxes = Math.ceil(board.width / side)
    /**
     * Make # boxes in each direction odd
     * so there can be a centered box in the middle.
     */
    vertBoxes = vertBoxes + ((vertBoxes + 1) % 2)
    horizBoxes = horizBoxes + ((horizBoxes + 1) % 2)

    const squares = []
    for (let row = 0; row < vertBoxes; ++row) {
      squares[row] = []
      for (let col = 0; col < horizBoxes; ++col) {
        // TODO this is temporary
        const isBlank = !levels[0][row]
        squares[row][col] = isBlank ? {} : (levels[0][row][col] || {})
      }
    }

    state.squares = squares

    state.boardHeight = vertBoxes * side
    state.boardWidth = horizBoxes * side

    const extraX = state.boardWidth - board.width
    const extraY = state.boardHeight - board.height

    state.boardShiftX = -(extraX / 2)
    state.boardShiftY = -(extraY / 2)
  },
}

const actions = {
  loadViewport({ commit }, { board }) {
    commit('render', { board })
  },

  mouseDown({ commit }, { rowIx, colIx }) {
    commit('initializeMousePath', { rowIx, colIx })
    commit('appendMousePath', { rowIx, colIx })
  },

  mouseEnter({ state, commit }, { rowIx, colIx }) {
    if (state.mousePath) {
      commit('appendMousePath', { rowIx, colIx })
    }
  },

  mouseUp({ commit }) {
    if (state.mousePath) {
      commit('finalizeMousePath')
    }
  },
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
}
