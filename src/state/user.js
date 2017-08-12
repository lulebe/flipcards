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
    status: USER_STATES.NO_USER,
    fbConnected: false,
    waitingToMakeOnline: false
  },
  mutations: {
    setUser (state, payload) {
      state.userId = payload.userId
      state.user = payload.user
      state.status = payload.status || (payload.user.isLocal ? USER_STATES.SIGNED_IN : USER_STATES.NEEDS_SIGNIN)
    },
    setStatus (state, status) {
      state.status = status
    },
    signOut (state) {
      state.userId = null
      state.user = null
      state.status = USER_STATES.NO_USER
      state.waitingToMakeOnline = false
    },
    setFbConnected (state, connected) {
      state.fbConnected = connected
    },
    setWaitingToMakeOnline (state, waiting) {
      state.waitingToMakeOnline = waiting
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
    loadOrCreateLocal ({commit, dispatch, state}) {
      const lsAcc = localStorage.getItem('userAccount')
      if (!lsAcc || !lsAcc.user.isLocal) {
        commit('setUser', {userId: 'local', user: {isLocal: true}})
        localStorage.setItem('userAccount', JSON.stringify({userId: 'local', user: {isLocal: true}}))
      } else {
        const acc = JSON.parse(lsAcc)
        commit('setUser', acc)
      }
      dispatch('data/loadFromLS', null, {root: true})
    },
    saveToLS ({state}) {
      if (!state.user) {
        return
      }
      localStorage.setItem('userAccount', JSON.stringify({userId: state.userId, user: state.user}))
    },
    signOut ({state, commit, dispatch}) {
      commit('signOut')
      dispatch('data/signOut', null, {root: true})
      localStorage.removeItem('userAccount')
    },
    firebaseAuthChanged ({commit, dispatch, state}, fbUser) {
      if (fbUser === null && state.user && !state.user.isLocal) {
        dispatch('signOut')
      } else if (fbUser) {
        commit('setUser', {userId: fbUser.uid, user: {isLocal: false}, status: USER_STATES.SIGNED_IN})
        dispatch('data/loadFromLS', null, {root: true})
      }
    }
  }
}
