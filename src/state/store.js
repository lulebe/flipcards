import Vuex from 'vuex'
import Vue from 'vue'

import userState from './user'
import dataState from './data'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    user: userState,
    data: dataState
  }
})
export default store

/* localstorage stuff */
initFromLS()
function initFromLS () {
  // load user from ls
  store.dispatch('user/loadFromLS')
  // load data from ls
  store.dispatch('data/loadFromLS')
}
