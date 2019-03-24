
const levels = [
  {
    25: {
      cl: 'grn-btn',
    },
    29: {
      cl: 'org-lgt',
    },
  },
]

const state = {
  boardHeight: 0,
  boardShiftX: 0,
  boardShiftY: 0,
  boardWidth: 0,
  isLoading: true,
  squares: [],
  viewport: {},
}

const getters = {
  //
}

const mutations = {
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

    for (let i = 0; i < vertBoxes * horizBoxes; ++i) {
      squares[i] = levels[0][i] || 'blank'
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
}

module.exports = {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
}
