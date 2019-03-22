import Vue from 'vue'
import Vuex from 'vuex'

import GameBoard from './modules/GameBoard'

Vue.use(Vuex)

const modules = {
  GameBoard,
}

const store = new Vuex.Store({
  modules,
})

Object.keys(modules).forEach((moduleName) => {
  // Dispatch the init action for each module, if one exists
  // Module **must** be namespaced for this to work
  if (modules[moduleName].actions && modules[moduleName].actions.init) {
    if (modules[moduleName].namespaced) {
      store.dispatch(`${moduleName}/init`)
    }
  }
})

export default store
