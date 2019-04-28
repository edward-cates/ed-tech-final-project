import Vue from 'vue'

const sideLength = 100 + 2 + 4 // width + border + margin

import levels from './levels'
import gates from './gates'

// localStorage.clear()

const state = {
  board: {},
  boardHeight: 0,
  boardShiftX: 0,
  boardShiftY: 0,
  boardWidth: 0,
  currentLevel: 0,
  isAlertDismissed: false,
  isLoading: true,
  mousePath: null,
  squares: [],
  level: null,
  levels,
  maxLevel: +localStorage.getItem('maxLevel') || 0,
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
    const row = state.squares[rowIx + rowDiff]

    if (!row) {
      return false
    }

    const sq = row[colIx + colDiff]

    if (!sq) {
      return false
    }

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
     *
     * `!!conn.second` means wire is set. Will only be able to change
     * this square if crossing over it.
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

      /**
       * `findSecond` looks to hook up to an input.
       * Already do this if another wire hasn't already
       * done it.
       */
      const isCross = !!state.squares[rowIx][colIx].cl

      Object.assign(conn, {
        first: {
          rowDiff: lastRowIx - rowIx,
          colDiff: lastColIx - colIx,
        },
        // deep copy `lastSq.conn.second`
        second: (isCross ? null : findSecond({ rowIx, colIx })) || {
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

  /**
   * TODO Check solutions while evaluating board.
   */
  async evaluateBoard(state, resolve) {
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
          // TODO check solution
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

    if (resolve) {
      resolve()
    }
  },

  finalizeMousePath(state) {
    /**
     * If path doesn't end at an input, remove it.
     * Otherwise, set it in place.
     */
    const doesTerminate = !!findSecond(state.mousePath.end)

    if (doesTerminate) {
      /**
       * Previous scores no longer valid.
       */
      const level = levels[state.currentLevel]
      level.objective.forEach(o => o.score = null)
    }

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

  render(state) {
    state.isAlertDismissed = false

    let vertBoxes = Math.ceil(state.board.height / sideLength)
    let horizBoxes = Math.ceil(state.board.width / sideLength)
    /**
     * Make # boxes in each direction odd
     * so there can be a centered box in the middle.
     */
    vertBoxes = vertBoxes + ((vertBoxes + 1) % 2)
    horizBoxes = horizBoxes + ((horizBoxes + 1) % 2)

    const level = levels[state.currentLevel]
    const solution = JSON.parse(localStorage.getItem(`level-${state.currentLevel}-solution`))

    if (solution) {
      for (let row = 0; row < solution.length; row += 1) {
        for (let col = 0; col < solution[row].length; col += 1) {
          if (solution && solution[row] && solution[row][col]) {
            const sq = solution[row][col]

            if (!sq.cl) {
              // do nothing
            } else if (sq.cl.indexOf('gate') > -1) {
              const ix = sq.cl.indexOf('gate-')
              const gateType = sq.cl.substr(0, ix)
              solution[row][col] = Object.values(gates)
                .find(g => g.cl.indexOf(gateType) === 0).create()
            } else if (['wire', 'btn', 'lgt'].some(key => sq.cl.indexOf(key) > -1)) {
              solution[row][col].cl = solution[row][col].cl.replace('on', 'off')
            }
          }
        }
      }

      state.squares = solution
      vertBoxes = solution.length
      horizBoxes = solution[0].length
    } else {
      const squares = []

      for (let row = 0; row < vertBoxes; ++row) {
        squares[row] = []
        for (let col = 0; col < horizBoxes; ++col) {
          if (level.squares[row] && level.squares[row][col]) {
            squares[row][col] = level.squares[row][col]
          } else {
            squares[row][col] = {}
          }
        }
      }

      state.squares = squares
    }

    state.level = level

    state.boardHeight = vertBoxes * sideLength
    state.boardWidth = horizBoxes * sideLength

    const extraX = state.boardWidth - state.board.width
    const extraY = state.boardHeight - state.board.height

    state.boardShiftX = -(extraX / 2)
    state.boardShiftY = -(extraY / 2)
  },

  saveSolution() {
    localStorage.setItem(`level-${state.currentLevel}-solution`, JSON.stringify(state.squares))
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
  dismissAlert() {
    state.isAlertDismissed = true
  },

  loadViewport({ state, commit }, { board }) {
    state.board = board
    commit('render')
    commit('evaluateBoard')
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
      const row = state.squares[rowIx + rowDiff]

      if (!row) {
        return
      }

      sq = row[colIx + colDiff]

      if (!sq) {
        return
      }

      let aligns = false

      if (sq.cl && sq.cl.indexOf('btn') > -1) {
        aligns = true
      } else if (sq.cl && sq.cl.indexOf('gate') > -1) {
        /**
         * Check all the gate's outputs to see if
         * the gate aligns with this square.
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
         * Diagonal squares are 1 square away.
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
    commit('saveSolution')
  },

  nextLevel({ state, commit }) {
    if (state.currentLevel === levels.length - 1) {
      alert('Congratulations, You beat the game! For the next challenge, Google "Nand Game". You can also Google "Digital Logic Design" or any of the level names in quotations from this game.')
      return
    }

    state.currentLevel += 1

    if (state.currentLevel > state.maxLevel) {
      localStorage.setItem('maxLevel', state.currentLevel)
      state.maxLevel = state.currentLevel
    }

    commit('render')
    commit('evaluateBoard')
  },

  pan({ commit }, direction) {
    commit(`pan${direction}`)
  },

  removePath({ state, commit }, { rowIx, colIx }) {
    const clearSquare = ({ rowDiff, colDiff, totalRowDiff, totalColDiff, isFirst }) => {
      const sq = state.squares[rowIx + totalRowDiff][colIx + totalColDiff]

      if (sq.cl && sq.cl.indexOf('lgt') > -1) {
        sq.cl = sq.cl.replace('on', 'off')
        return false
      }

      if (sq.cl && sq.cl.indexOf('gate') > -1) {
        if (!isFirst) {
          /**
           * `second` indicates that this gate sits at the end of a wire
           * that just went away.
           */
          const input = sq.inputs
            .find(input => input.rowDiff === -rowDiff && input.colDiff === -colDiff)

          if (input) {
            input.isOn = false  
            sq.evaluate()
          }

          return false
        } else {
          Vue.set(state.squares[rowIx + totalRowDiff], colIx + totalColDiff, {})

          sq.inputs.forEach(input => clearSquare({
            rowDiff: input.rowDiff,
            colDiff: input.colDiff,
            totalRowDiff: totalRowDiff + input.rowDiff,
            totalColDiff: totalColDiff + input.colDiff,
          }))

          sq.outputs.forEach(output => clearSquare({
            rowDiff: output.rowDiff,
            colDiff: output.colDiff,
            totalRowDiff: totalRowDiff + output.rowDiff,
            totalColDiff: totalColDiff + output.colDiff,
          }))

          return true
        }
      }

      if (sq.cl && sq.cl.indexOf('wire-nsew') > -1) {
        if (isFirst) {
          Vue.set(state.squares[rowIx + totalRowDiff], colIx + totalColDiff, {})

          const offsets = [[0,-1],[0,1],[-1,0],[1,0]]

          offsets.forEach(([rd, cd]) => clearSquare({
            rowDiff: rd,
            colDiff: cd,
            totalRowDiff: totalRowDiff + rd,
            totalColDiff: totalColDiff + cd,
          }))
        } else if (rowDiff !== 0) {
          /**
           * Wire vertically adjacent is being wiped.
           */
          const isOn = sq.cl.indexOf('horiz-on') > -1
          sq.cl = `wire-ew-${isOn ? 'on' : 'off'}`
          /**
           * Get connection info from square to the left.
           */
          const leftSq = state.squares[rowIx + totalRowDiff][colIx + totalColDiff - 1]
          if (!leftSq.conn || leftSq.conn.second.colDiff === 1) {
            /**
             * Square to the left goes left-to-right.
             * This square should go left-to-right.
             */
            sq.conn = {
              first: { rowDiff: 0, colDiff: -1 },
              second: { rowDiff: 0, colDiff: 1 },
            }
          } else {
            /**
             * Square to the left goes right-to-left.
             * This square should go right-to-left.
             */
            sq.conn = {
              first: { rowDiff: 0, colDiff: 1 },
              second: { rowDiff: 0, colDiff: -1 },
            }
          }
        } else {
          /**
           * Wire horizontally adjacent is being wiped.
           */
          const isOn = sq.cl.indexOf('vert-on') > -1
          sq.cl = `wire-ns-${isOn ? 'on' : 'off'}`
          /**
           * Get connection info from square above.
           */
          const aboveSq = state.squares[rowIx + totalRowDiff - 1][colIx + totalColDiff]
          if (!aboveSq.conn || aboveSq.conn.second.rowDiff === 1) {
            /**
             * Square above goes top-to-bottom. So should this square.
             */
            sq.conn = {
              first: { rowDiff: -1, colDiff: 0 },
              second: { rowDiff: 1, colDiff: 0 },
            }
          } else {
            /**
             * Square above goes bottom-to-top. So should this square.
             */
            sq.conn = {
              first: { rowDiff: 1, colDiff: 0 },
              second: { rowDiff: -1, colDiff: 0 },
            }
          }
        }

        clearSquare({
          rowDiff,
          colDiff,
          totalRowDiff: totalRowDiff + rowDiff,
          totalColDiff: totalColDiff + colDiff,
        })

        return true
      }

      if (sq.cl && sq.cl.indexOf('wire') > -1) {
        /**
         * Make sure the orientation aligns
         */
        if (!(isFirst
          || sq.conn.first.rowDiff === -rowDiff && sq.conn.first.colDiff === -colDiff
          || sq.conn.second.rowDiff === -rowDiff && sq.conn.second.colDiff === -colDiff)) {
          return false
        }

        Vue.set(state.squares[rowIx + totalRowDiff], colIx + totalColDiff, {})

        clearSquare({
          rowDiff: sq.conn.first.rowDiff,
          colDiff: sq.conn.first.colDiff,
          totalRowDiff: totalRowDiff + sq.conn.first.rowDiff,
          totalColDiff: totalColDiff + sq.conn.first.colDiff,
        })

        clearSquare({
          rowDiff: sq.conn.second.rowDiff,
          colDiff: sq.conn.second.colDiff,
          totalRowDiff: totalRowDiff + sq.conn.second.rowDiff,
          totalColDiff: totalColDiff + sq.conn.second.colDiff,
        })

        return true
      }

      return false
    }

    if (clearSquare({ rowDiff: 0, colDiff: 0, totalRowDiff: 0, totalColDiff: 0, isFirst: true })) {
      /**
       * Reset scores if something was changed.
       */
      const level = levels[state.currentLevel]
      level.objective.forEach(o => o.score = null)

      commit('evaluateBoard')
    }
  },

  setLevel({ commit }, { index }) {
    state.currentLevel = index
    commit('render')
    commit('evaluateBoard')
  },

  async testCase({ state, commit }, { rowIx: objectiveIx }) {
    const level = levels[state.currentLevel]
    const test = level.objective[objectiveIx]
    /**
     * Set inputs according to `objective`
     * and check outputs.
     */
    let isDiff = false

    const bulbs = []

    state.squares.forEach((row) => {
      row.forEach((sq) => {
        if (sq.cl && sq.cl.indexOf('btn') > -1) {
          // power button
          /**
           * Find corresponding input
           * No color should be used for anything more than once.
           */
          const isOn = test.cl.find(o => o.indexOf(sq.cl.substr(0, 3)) > -1).indexOf('on') > -1

          if (isOn !== sq.cl.indexOf('on') > -1) {
            /**
             * At least 1 button changed
             */
            isDiff = true
          }

          sq.cl = sq.cl.replace(isOn ? 'off' : 'on', isOn ? 'on' : 'off')
        } else if (sq.cl && sq.cl.indexOf('lgt') > -1) {
          // bulb a.k.a. output
          bulbs.push(sq)
        }
      })
    })

    if (test.score !== null && !isDiff) {
      return
    }

    await new Promise(resolve => commit('evaluateBoard', resolve))

    /**
     * See the evaluated board for a second.
     */
    await new Promise(resolve => setTimeout(resolve, 500))

    /**
     * Animate the drawing of the score.
     */
    test.score = null
    // setTimeout(() => {
      /**
       * After the board is evaluated,
       * check the outputs (bulbs).
       */
      test.score = bulbs.every((sq) => {
        const shouldBeOn = test.cl.find(o => o.indexOf(sq.cl.substr(0, 3)) > -1).indexOf('on') > -1
        return shouldBeOn === (sq.cl.indexOf('on') > -1)
      })
    // }, 100)
  },
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
}
