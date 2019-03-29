import Vue from 'vue'

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
    const connection = {
      first: 'e',
      second: 'w',
    }

    const getCl = ({ first, second }) => {
      let cl = ''
      if (first === 'n' || second === 'n') {
        cl = `${cl}n`
      }
      if (first === 's' || second === 's') {
        cl = `${cl}s`
      }
      if (first === 'e' || second === 'e') {
        cl = `${cl}e`
      }
      if (first === 'w' || second === 'w') {
        cl = `${cl}w`
      }
      if (cl === 'e' || cl === 'w') {
        cl = 'ew'
      } else if (cl === 'n' || cl === 's') {
        cl = 'ns'
      }
      return cl
    }

    /**
     * TODO modify last connector and current one
     * so that the align.
     */
    const stackLength = state.mousePath.stack.length

    if (stackLength) {
      const {
        rowIx: lastRowIx,
        colIx: lastColIx,
      } = state.mousePath.stack[stackLength - 1]

      const lastSq = state.squares[lastRowIx][lastColIx]

      /**
       * Assume either rowIx or colIx changed by 1.
       * This should be enforced by calling function.
       */
      if (rowIx < lastRowIx) {
        // went north
        lastSq.connection.second = 'n'
        // assume continuation
        Object.assign(connection, {
          first: 's',
          second: 'n',
        })
      } else if (rowIx > lastRowIx) {
        // went south
        lastSq.connection.second = 's'
        // assume continuation
        Object.assign(connection, {
          first: 'n',
          second: 's',
        })
      } else if (colIx < lastColIx) {
        // went west
        lastSq.connection.second = 'w'
        // assume continuation
        Object.assign(connection, {
          first: 'e',
          second: 'w',
        })
      } else if (colIx > lastColIx) {
        // went east
        lastSq.connection.second = 'e'
        // assume continuation
        Object.assign(connection, {
          first: 'w',
          second: 'e',
        })
      }

      lastSq.cl = `wire-${getCl(lastSq.connection)}`
    }

    if (!state.squares[rowIx][colIx].cl) {
      Vue.set(state.squares[rowIx], colIx, {
        cl: `wire-${getCl(connection)}`,
        connection,
        tmp: true,
      })
    }

    state.mousePath.end = { rowIx, colIx }
    state.mousePath.stack.push(state.mousePath.end)
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
      /**
       * Check for diagonal movement
       */
      const stackLength = state.mousePath.stack.length

      if (stackLength) {
        const {
          rowIx: lastRowIx,
          colIx: lastColIx,
        } = state.mousePath.stack[stackLength - 1]

        if (rowIx !== lastRowIx && colIx !== lastColIx) {
          const rowDiff = lastRowIx - rowIx
          const colDiff = lastColIx - colIx

          if (!state.squares[rowIx][colIx + colDiff].cl) {
            commit('appendMousePath', { rowIx, colIx: colIx + colDiff })
          } else if (!state.squares[rowIx + rowDiff][colIx].cl) {
            commit('appendMousePath', { rowIx: rowIx + rowDiff, colIx })
          }
        }
      }

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
