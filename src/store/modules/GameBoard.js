import Vue from 'vue'

const levels = [
  {
    2: {
      3: { cl: 'grn-btn-off' },
      7: { cl: 'org-lgt-w-off', conn: { rowDiff: 0, colDiff: -1 } },
    },
    4: {
      1: { cl: 'grn-btn-off' },
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
  appendMousePath(state, { rowIx, colIx, conn }) {
    const sq = state.squares[rowIx][colIx]

    if (sq.cl && sq.cl.indexOf('wire') < 0) {
      // This method is only for wires.
      return
    }

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

      Object.assign(conn, {
        first: {
          rowDiff: lastRowIx - rowIx,
          colDiff: lastColIx - colIx,
        },
        /**
         * Assume continuation of same direction for now.
         */
        second: Object.assign({}, lastSq.conn.second),
      })

      /**
       * Don't automatically update wire type for a cross piece.
       */
      if (lastSq.cl.indexOf('wire-nsew') < 0) {
        lastSq.cl = getCl(lastSq.conn)
      }
    }

    /**
     * wait until now to get `cl` because `conn` could
     * be modified after looking at the last segment.
     */
    const cl = getCl(conn)

    if (!sq.cl) {
      Vue.set(state.squares[rowIx], colIx, {
        cl,
        conn,
        tmp: true,
      })
    } else if ((sq.cl.indexOf('wire-ew') > -1 && cl.indexOf('wire-ns') > -1)
      || (sq.cl.indexOf('wire-ns') > -1 && cl.indexOf('wire-ew') > -1)) {
      sq.cl = 'wire-nsew-vert-off-horiz-off'
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

      const delay = async () => new Promise(resolve => setTimeout(resolve, 10))

      if (sq.cl.indexOf('wire-nsew') > -1) {
        /**
         * Did it come vertically or horizontally?
         */
        if (rowDiff !== 0) {
          // vertically
          await delay
          sq.cl = sq.cl.replace(`vert-${lastState}`, `vert-${currentState}`)

          evaluateSquare({
            rowDiff: rowDiff,
            colDiff: 0,
            rowIx: rowIx + rowDiff,
            colIx,
            isOn,
          })
        } else if (colDiff !== 0) {
          // horizontally
          await delay()
          sq.cl = sq.cl.replace(`horiz-${lastState}`, `horiz-${currentState}`)

          evaluateSquare({
            rowDiff: 0,
            colDiff: colDiff,
            rowIx,
            colIx: colIx + colDiff,
            isOn,
          })
        }
      } else if (sq.cl.indexOf('wire') > -1) {
        if (-rowDiff === sq.conn.first.rowDiff && -colDiff === sq.conn.first.colDiff) {
          await delay()
          sq.cl = sq.cl.replace(lastState, currentState)

          evaluateSquare({
            rowDiff: sq.conn.second.rowDiff,
            colDiff: sq.conn.second.colDiff,
            rowIx: rowIx + sq.conn.second.rowDiff,
            colIx: colIx + sq.conn.second.colDiff,
            isOn,
          })
        }
      } else if (sq.cl.indexOf('lgt') > -1) {
        // light
        if (-rowDiff === sq.conn.rowDiff && -colDiff === sq.conn.colDiff) {
          await delay()
          sq.cl = sq.cl.replace(lastState, currentState)
        }
      }
    }

    const level = levels[state.currentLevel]

    await Promise.all(Object.keys(level).map(async (rowIx) => {
      await Promise.all(Object.keys(level[rowIx]).map(async (colIx) => {
        const sq = state.squares[rowIx][colIx]
        if (sq.cl.indexOf('btn') > -1) {
          // power button
          await Promise.all([[0,-1],[0,1],[-1,0],[1,0]].map(async ([rowDiff, colDiff]) => {
            await evaluateSquare({
              rowDiff,
              colDiff,
              rowIx: (+rowIx) + rowDiff,
              colIx: (+colIx) + colDiff,
              isOn: sq.cl.indexOf('on') > -1,
            })
          }))
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
    /**
     * Don't let wires be drawn that aren't connected to anything.
     *
     * Need to figured out initial values for wire direction here.
     * Look for nearby buttons and lights, and try to optimize
     * connections to those.
     */
    [[0,-1],[0,1],[-1,0],[1,0]].forEach(([rowDiff, colDiff]) => {
      const sq = state.squares[rowIx + rowDiff][colIx + colDiff]
      if (sq.cl && sq.cl.indexOf('btn') > -1) {
        commit('initializeMousePath', { rowIx, colIx })
        commit('appendMousePath', {
          rowIx,
          colIx,
          conn: {
            first: { rowDiff, colDiff },
            // assume straight line
            second: { rowDiff: -rowDiff, colDiff: -colDiff },
          },
        })
      }
    })
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

        /**
         * Don't allow moves more than 1 square away.
         * Diagonal squares can be 1 square away.
         */
        if (Math.abs(rowIx - lastRowIx) > 1 || Math.abs(colIx - lastColIx) > 1) {
          return
        }

        if (rowIx !== lastRowIx && colIx !== lastColIx) {
          // moved diagonally
          const rowDiff = lastRowIx - rowIx
          const colDiff = lastColIx - colIx

          if (!state.squares[rowIx][colIx + colDiff].cl) {
            commit('appendMousePath', { rowIx, colIx: colIx + colDiff, conn: {} })
          } else if (!state.squares[rowIx + rowDiff][colIx].cl) {
            commit('appendMousePath', { rowIx: rowIx + rowDiff, colIx, conn: {} })
          } else {
            // TODO termination condition
          }
        }
      }

      commit('appendMousePath', { rowIx, colIx, conn: {} })
    }
  },

  mouseUp({ commit }, pos) {
    if (state.mousePath) {
      commit('finalizeMousePath')
    } else if (pos) {
      const { rowIx, colIx } = pos
      const sq = state.squares[rowIx][colIx]
      if (sq.cl && sq.cl.indexOf('btn') > -1) {
        // power button click
        commit('togglePower', { rowIx, colIx })
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
