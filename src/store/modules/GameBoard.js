import Vue from 'vue'

const levels = [
  {
    2: {
      3: { cl: 'grn-btn-off' },
      7: { cl: 'org-lgt' },
    },
  },
]

const state = {
  boardHeight: 0,
  boardShiftX: 0,
  boardShiftY: 0,
  boardWidth: 0,
  currentLevel: 0,
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
    /**
     * For the first wire, we need some logic
     * to pick the best first wire.
     * For the rest, the direction will be updated
     * based on the previous wire segment.
     */
    const connection = {}

    const getCl = ({ first, second }) => {
      let cl = ''
      if (first.rowDiff < 0 || second.rowDiff < 0) {
        cl = `${cl}n`
      }
      if (first.rowDiff > 0 || second.rowDiff > 0) {
        cl = `${cl}s`
      }
      if (first.colDiff > 0 || second.colDiff > 0) {
        cl = `${cl}e`
      }
      if (first.colDiff < 0 || second.colDiff < 0) {
        cl = `${cl}w`
      }
      if (cl === 'e' || cl === 'w') {
        cl = 'ew'
      } else if (cl === 'n' || cl === 's') {
        cl = 'ns'
      }
      return `wire-${cl}-off`
    }

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

      lastSq.conn.second = {
        rowDiff: rowIx - lastRowIx,
        colDiff: colIx - lastColIx,
      }

      Object.assign(connection, {
        first: {
          rowDiff: lastRowIx - rowIx,
          colDiff: lastColIx - colIx,
        },
        /**
         * Assume continuation of same direction for now.
         */
        second: Object.assign({}, lastSq.conn.second),
      })

      if (lastSq.cl !== 'wire-nsew-off') {
        lastSq.cl = getCl(lastSq.conn)
      }
    } else {
      /**
       * Need to figured out initial values for `connection` here.
       * Look for nearby buttons and lights, and try to optimize
       * connections to those.
       */
      for (let rowDiff = -1; !connection.second && rowDiff <= 1; ++rowDiff) {
        for (let colDiff = -1; !connection.second && colDiff <= 1; ++colDiff) {
          const sq = state.squares[rowIx + rowDiff][colIx + colDiff]
          if (sq.cl && sq.cl.indexOf('btn') > -1) {
            connection.first = { rowDiff, colDiff }
            // assume straight line
            connection.second = { rowDiff: -rowDiff, colDiff: -colDiff }
          }
        }
      }
    }

    const sq = state.squares[rowIx][colIx]
    const cl = getCl(connection)

    if (!sq.cl) {
      Vue.set(state.squares[rowIx], colIx, {
        cl,
        conn: connection,
        tmp: true,
      })
    } else if ((sq.cl.indexOf('wire-ew') > -1 && cl.indexOf('wire-ns') > -1)
      || (sq.cl.indexOf('wire-ns') > -1 && cl.indexOf('wire-ew') > -1)) {
      sq.cl = 'wire-nsew-off'
    }

    state.mousePath.end = { rowIx, colIx }
    state.mousePath.stack.push(state.mousePath.end)
  },

  async evaluateBoard(state) {
    const evaluateSquare = async ({
      rowDiff,
      colDiff,
      rowIx,
      colIx,
      isOn,
    }) => {
      const sq = state.squares[rowIx][colIx]

      if (!sq.cl) {
        return
      }

      const lastState = isOn ? 'off' : 'on'
      const currentState = isOn ? 'on' : 'off'

      if (sq.cl.indexOf('wire') > -1) {
        if (-rowDiff === sq.conn.first.rowDiff && -colDiff === sq.conn.first.colDiff) {
          await new Promise(resolve => setTimeout(resolve, 10))
          sq.cl = sq.cl.replace(lastState, currentState)

          evaluateSquare({
            rowDiff: sq.conn.second.rowDiff,
            colDiff: sq.conn.second.colDiff,
            rowIx: rowIx + sq.conn.second.rowDiff,
            colIx: colIx + sq.conn.second.colDiff,
            isOn,
          })
        }
      }
    }

    const level = levels[state.currentLevel]

    await Promise.all(Object.keys(level).map(async (rowIx) => {
      await Promise.all(Object.keys(level[rowIx]).map(async (colIx) => {
        const sq = state.squares[rowIx][colIx]
        if (sq.cl.indexOf('btn') > -1) {
          // power button
          for (let rowDiff = -1; rowDiff <= 1; ++rowDiff) {
            for (let colDiff = -1; colDiff <= 1; ++colDiff) {
              if (rowDiff !== 0 || colDiff !== 0) {
                await evaluateSquare({
                  rowDiff,
                  colDiff,
                  rowIx: (+rowIx) + rowDiff,
                  colIx: (+colIx) + colDiff,
                  isOn: sq.cl.indexOf('on') > -1,
                })
              }
            }
          }
        }
      }))
    }))
  },

  finalizeMousePath(state) {
    /**
     * Clean last path
     */
    state.squares.forEach((row) => {
      row.forEach((square) => {
        if (square.tmp) {
          square.tmp = false
          // Vue.set(row, colIx, {})
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
        const isBlank = !levels[state.currentLevel][row]
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

  togglePower(state, { rowIx, colIx }) {
    const sq = state.squares[rowIx][colIx]

    if (sq.cl.indexOf('off') > -1) {
      sq.cl = sq.cl.replace('off', 'on')
    } else {
      sq.cl = sq.cl.replace('on', 'off')
    }
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
          } else {
            // TODO termination condition
          }
        }
      }

      commit('appendMousePath', { rowIx, colIx })
    }
  },

  mouseUp({ commit }) {
    if (state.mousePath) {
      const { rowIx: rowSx, colIx: colSx } = state.mousePath.start
      const { rowIx: rowEx, colIx: colEx } = state.mousePath.end
      if (rowSx === rowEx && colSx === colEx
        && state.squares[rowSx][colSx].cl.indexOf('btn') > -1) {
        // power button click
        commit('togglePower', { rowIx: rowSx, colIx: colSx })
        state.mousePath = null
      } else {
        commit('finalizeMousePath')
      }
    }

    commit('evaluateBoard')
  },
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
}
