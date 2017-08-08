export const USER_STATES = {
  NO_USER: 0,
  NEEDS_SIGNIN: 1,
  SIGNED_IN: 2
}

export default {
  namespaced: true,
  state: {
    userId: null,
    user: null,
    status: USER_STATES.NO_USER
  },
  mutations: {
    setUser (state, payload) {
      state.userId = payload.userId
      state.user = payload.user
      state.status = payload.user.isLocal ? USER_STATES.SIGNED_IN : USER_STATES.NEEDS_SIGNIN
    }
  },
  actions: {
    loadFromLS ({commit, state}) {
      const lsAcc = localStorage.getItem('userAccount')
      if (!lsAcc) {
        return
      }
      const acc = JSON.parse(lsAcc)
      commit('setUser', acc)
    },
    loadOrCreateLocal ({commit, state}) {
      const lsAcc = localStorage.getItem('userAccount')
      if (!lsAcc || !lsAcc.user.isLocal) {
        commit('setUser', {userId: 'local', user: {isLocal: true}})
        localStorage.setItem('userAccount', JSON.stringify({userId: 'local', user: {isLocal: true}}))
      } else {
        const acc = JSON.parse(lsAcc)
        commit('setUser', acc)
      }
    },
    saveToLS ({state}) {
      if (!state.user) {
        return
      }
      localStorage.setItem('userAccount', JSON.stringify({userId: state.userId, user: state.user}))
    }
  }
}
