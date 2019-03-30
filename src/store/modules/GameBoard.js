import Vue from 'vue'

import GATE from './gates'

const sideLength = 100 + 2 + 4 // width + border + margin

const levels = [
  {
    squares: {
      2: {
        1: { cl: 'grn-btn-off' },
        9: { cl: 'org-lgt-w-off', conn: { rowDiff: 0, colDiff: -1 } },
      },
      4: {
        1: { cl: 'grn-btn-off' },
        9: { cl: 'org-lgt-w-off', conn: { rowDiff: 0, colDiff: -1 } },
      },
      6: {
        1: { cl: 'grn-btn-off' },
        9: { cl: 'org-lgt-w-off', conn: { rowDiff: 0, colDiff: -1 } },
      },
    },
    tools: [
      GATE.SPLIT,
      GATE.NOT,
      GATE.OR,
      GATE.AND,
    ],
  },
]

const state = {
  board: {},
  boardHeight: 0,
  boardShiftX: 0,
  boardShiftY: 0,
  boardWidth: 0,
  currentLevel: 0,
  isLoading: true,
  mousePath: null,
  squares: [],
  tools: [],
  viewport: {},
}

const getters = {
  //
}

/**
 * Look for an input and return the respective
 * { rowDiff, colDiff } object.
 */
function findSecond({ rowIx, colIx }) {
  const diffs = [[0,-1],[0,1],[-1,0],[1,0]].find(([rowDiff, colDiff]) => {
    const sq = state.squares[rowIx + rowDiff][colIx + colDiff]

    let aligns = false

    if (sq.cl && sq.cl.indexOf('lgt') > -1) {
      // light
      aligns = sq.conn.rowDiff === -rowDiff && sq.conn.colDiff === -colDiff
    } else if (sq.cl && sq.cl.indexOf('gate') > -1) {
      // gate
      aligns = sq.inputs.some(({ rowDiff: rd, colDiff: cd }) => rowDiff === -rd && colDiff === -cd)
    }

    return aligns
  })

  if (!diffs) {
    return null
  }

  return { rowDiff: diffs[0], colDiff: diffs[1] }
}

const mutations = {
  /**
   * Fill `squares` to draw `mousePath`
   * 
   * Don't overwrite permanent fixtures.
   * Cross over existing paths where applicable.
   * Needs to take into account input/output directions.
   *
   * Assume either rowIx or colIx changed by 1.
   * This should be enforced by calling function.
   */
  appendMousePath(state, { rowIx, colIx, conn }) {
    const sq = state.squares[rowIx][colIx]

    const canDraw = () => {
      if (sq.cl) {
        /**
         * Since something already exists in this square,
         * this method is only allowed to proceed if it's trying
         * to draw a cross-wire.
         */
        if (sq.cl.indexOf('wire-ew-') > -1
          && conn.first.colDiff === 0 && conn.second.colDiff === 0) {
          // is horizontal and trying to cross vertically
        } else if (sq.cl.indexOf('wire-ns-') > -1
          && conn.first.rowDiff === 0 && conn.second.rowDiff === 0) {
          // is vertical and trying to cross horizontally
        } else {
          return false
        }
      }

      return true
    }

    /**
     * `conn` is initialized by calling method for the
     * first square in the path.
     * After that, it's initialized below using the
     * previous square in the path.
     */
    if (conn.second && !canDraw()) {
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

      Object.assign(conn, {
        first: {
          rowDiff: lastRowIx - rowIx,
          colDiff: lastColIx - colIx,
        },
        // deep copy `lastSq.conn.second`
        second: findSecond({ rowIx, colIx }) || {
          rowDiff: rowIx - lastRowIx,
          colDiff: colIx - lastColIx,
        },
      })

      /**
       * Now `conn` is initialized, so we
       * can check `canDraw`.
       */
      if (!canDraw()) {
        return
      }

      /**
       * Don't automatically update wire type for a cross piece.
       */
      if (lastSq.cl.indexOf('wire-nsew') < 0) {
        // not a cross-wire
        lastSq.conn.second = {
          rowDiff: rowIx - lastRowIx,
          colDiff: colIx - lastColIx,
        }

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
    } else if (sq.cl.indexOf('wire-ew') > -1 && cl.indexOf('wire-ns') > -1) {
      // save cl to revert to
      sq.tmp = sq.cl
      const horizOn = sq.cl.indexOf('on') > -1 ? 'on' : 'off'
      sq.cl = `wire-nsew-vert-off-horiz-${horizOn}`
    } else if (sq.cl.indexOf('wire-ns') > -1 && cl.indexOf('wire-ew') > -1) {
      // save cl to revert to
      sq.tmp = sq.cl
      const vertOn = sq.cl.indexOf('on') > -1 ? 'on' : 'off'
      sq.cl = `wire-nsew-vert-${vertOn}-horiz-off`
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

          await evaluateSquare({
            rowDiff,
            colDiff: 0,
            rowIx: rowIx + rowDiff,
            colIx,
            isOn,
          })
        } else if (colDiff !== 0) {
          // horizontally
          await delay()
          sq.cl = sq.cl.replace(`horiz-${lastState}`, `horiz-${currentState}`)

          await evaluateSquare({
            rowDiff: 0,
            colDiff,
            rowIx,
            colIx: colIx + colDiff,
            isOn,
          })
        }
      } else if (sq.cl.indexOf('wire') > -1) {
        if (-rowDiff === sq.conn.first.rowDiff && -colDiff === sq.conn.first.colDiff) {
          await delay()
          sq.cl = sq.cl.replace(lastState, currentState)

          await evaluateSquare({
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
      } else if (sq.cl.indexOf('gate') > -1) {
        // gate
        const input = sq.inputs.find(({ rowDiff: rd, colDiff: cd }) => rowDiff === -rd && colDiff === -cd)
        if (input) {
          input.isOn = isOn
          // update outputs
          sq.evaluate()

          await Promise.all(sq.outputs.map(async (out) => evaluateSquare({
            rowDiff: out.rowDiff,
            colDiff: out.colDiff,
            rowIx: rowIx + out.rowDiff,
            colIx: colIx + out.colDiff,
            isOn: out.isOn,
          })))
        }
      }
    }

    await Promise.all(state.squares.map(async (row, rowIx) => {
      await Promise.all(row.map(async (sq, colIx) => {
        if (sq.cl && sq.cl.indexOf('btn') > -1) {
          // power button
          await Promise.all([[0,-1],[0,1],[-1,0],[1,0]].map(async ([rowDiff, colDiff]) => {
            await evaluateSquare({
              rowDiff,
              colDiff,
              rowIx: rowIx + rowDiff,
              colIx: colIx + colDiff,
              isOn: sq.cl.indexOf('on') > -1,
            })
          }))
        } else if (sq.cl && sq.cl.indexOf('gate') > -1) {
          // gate
          await Promise.all(sq.outputs.map(async ({ rowDiff, colDiff, isOn }) => {
            await evaluateSquare({
              rowDiff,
              colDiff,
              rowIx: rowIx + rowDiff,
              colIx: colIx + colDiff,
              isOn,
            })
          }))
        }
      }))
    }))
  },

  finalizeMousePath(state) {
    /**
     * If path doesn't end at an input, remove it.
     * Otherwise, set it in place.
     */
    const doesTerminate = !!findSecond(state.mousePath.end)

    state.mousePath.stack.forEach(({ rowIx, colIx }) => {
      const sq = state.squares[rowIx][colIx]

      if (doesTerminate) {
        sq.tmp = false
      } else {
        if (sq.tmp !== true) {
          // cross-wire
          sq.cl = sq.tmp
          sq.tmp = false
        } else {
          Vue.set(state.squares[rowIx], colIx, {})
        }
      }
    })

    state.mousePath = null
  },

  initializeMousePath(state, { rowIx, colIx }) {
    state.mousePath = {
      start: { rowIx, colIx },
      end: { rowIx, colIx },
      stack: [],
    }
  },

  panLeft(state) {
    state.boardShiftX += sideLength

    if (state.boardShiftX > 0) {
      /**
       * There's black space to the left of the board.
       * Fix this by adding a new column.
       */
      state.boardShiftX -= sideLength
      state.boardWidth += sideLength

      state.squares.forEach((row) => {
        row.splice(0, 0, {})
      })
    }
  },

  panRight(state) {
    state.boardShiftX -= sideLength

    if (state.boardWidth + state.boardShiftX - state.board.width < 0) {
      /**
       * Client rectangle is larger than visible viewport area.
       * Add a column.
       */
      state.boardWidth += sideLength

      state.squares.forEach((row) => {
        row.push({})
      })
    }
  },

  panUp(state) {
    state.boardShiftY += sideLength

    if (state.boardShiftY > 0) {
      /**
       * There's black space to the left of the board.
       * Fix this by adding a new column.
       */
      state.boardShiftY -= sideLength
      state.boardHeight += sideLength

      const row = state.squares[0].map(() => ({}))
      state.squares.splice(0, 0, row)
    }
  },

  panDown(state) {
    state.boardShiftY -= sideLength

    if (state.boardHeight + state.boardShiftY - state.board.height < 0) {
      /**
       * Client rectangle is larger than visible viewport area.
       * Add a column.
       */
      state.boardHeight += sideLength

      const row = state.squares[0].map(() => ({}))
      state.squares.push(row)
    }
  },

  render(state, { board }) {
    state.board = board

    let vertBoxes = Math.ceil(board.height / sideLength)
    let horizBoxes = Math.ceil(board.width / sideLength)
    /**
     * Make # boxes in each direction odd
     * so there can be a centered box in the middle.
     */
    vertBoxes = vertBoxes + ((vertBoxes + 1) % 2)
    horizBoxes = horizBoxes + ((horizBoxes + 1) % 2)

    const level = levels[state.currentLevel]

    const squares = []
    for (let row = 0; row < vertBoxes; ++row) {
      squares[row] = []
      for (let col = 0; col < horizBoxes; ++col) {
        // TODO this is temporary
        const isBlank = !level.squares[row]
        squares[row][col] = isBlank ? {} : (level.squares[row][col] || {})
      }
    }

    state.squares = squares
    state.tools = level.tools

    state.boardHeight = vertBoxes * sideLength
    state.boardWidth = horizBoxes * sideLength

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
    let sq = state.squares[rowIx][colIx]
    if (sq.cl && sq.cl.indexOf('btn') > -1) {
      return
    }
    /**
     * Don't let wires be drawn that aren't connected to anything.
     *
     * Need to figured out initial values for wire direction here.
     * Look for nearby buttons and lights, and try to optimize
     * connections to those.
     */
    [[0,-1],[0,1],[-1,0],[1,0]].forEach(([rowDiff, colDiff]) => {
      let aligns = false

      sq = state.squares[rowIx + rowDiff][colIx + colDiff]

      if (sq.cl && sq.cl.indexOf('btn') > -1) {
        aligns = true
      } else if (sq.cl && sq.cl.indexOf('gate') > -1) {
        /**
         * A gate output must align with diffs
         */
        aligns = sq.outputs.some(({ rowDiff: rd, colDiff: cd }) => rowDiff === -rd && colDiff === -cd)
      }

      if (aligns) {
        commit('initializeMousePath', { rowIx, colIx })
        commit('appendMousePath', {
          rowIx,
          colIx,
          conn: {
            first: { rowDiff, colDiff },
            second: findSecond({ rowIx, colIx }) || { rowDiff: -rowDiff, colDiff: -colDiff },
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

  pan({ commit }, direction) {
    commit(`pan${direction}`)
  },
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
}
