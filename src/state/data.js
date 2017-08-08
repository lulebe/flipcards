import Vue from 'vue'

import generateUUID from '@/util/IdGenerator'

export default {
  namespaced: true,
  state: {
    decks: {}
  },
  getters: {
    decksAsArray (state) {
      return Object.values(state.decks)
    },
    cardsOfDeck: state => deckId => Object.values(state.decks[deckId].cards)
  },
  mutations: {
    setDecks (state, decks) {
      console.log(decks)
      Vue.set(state, 'decks', decks)
    },
    addDeck (state, {deck, key}) {
      Vue.set(state.decks, key, deck)
    },
    removeDeck (state, key) {
      Vue.delete(state.decks, key)
    }
  },
  actions: {
    loadFromLS ({commit, state, rootState}) {
      if (!rootState.user.userId) {
        return
      }
      const lsData = localStorage.getItem(rootState.user.userId)
      if (!lsData) {
        return
      }
      commit('setDecks', JSON.parse(lsData))
    },
    saveToLS ({state, rootState}) {
      if (!rootState.user.userId) {
        return
      }
      localStorage.setItem(rootState.user.userId, JSON.stringify(state.decks))
    },
    createDeck ({dispatch, commit}, payload) {
      const deckId = generateUUID()
      commit('addDeck', {deck: {'.key': deckId, name: payload.name, cards: {}}, key: deckId})
      dispatch('saveToLS')
    },
    deleteDeck ({dispatch, commit}, deckId) {
      commit('removeDeck', deckId)
      dispatch('saveToLS')
    }
  }
}
