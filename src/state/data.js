import Vue from 'vue'

import generateUUID from '@/util/IdGenerator'

export default {
  namespaced: true,
  state: {
    decks: {}
  },
  getters: {
    decksAsArray (state) {
      return Object.values(state.decks).sort((deckA, deckB) => (deckA.name > deckB.name) ? 1 : -1)
    },
    cardsOfDeck: state => deckId => Object.values(state.decks[deckId].cards).sort((cardA, cardB) => (cardA.order > cardB.order) ? 1 : -1)
  },
  mutations: {
    setDecks (state, decks) {
      Vue.set(state, 'decks', decks)
    },
    addDeck (state, {deck, key}) {
      Vue.set(state.decks, key, deck)
    },
    removeDeck (state, key) {
      Vue.delete(state.decks, key)
    },
    addCard (state, {deckId, key, card}) {
      Vue.set(state.decks[deckId].cards, key, card)
    },
    removeCard (state, {deckId, cardId}) {
      const order = state.decks[deckId].cards[cardId].order
      Vue.delete(state.decks[deckId].cards, cardId)
      Object.values(state.decks[deckId].cards).filter(card => card.order > order).forEach(card => {
        card.order = card.order - 1
      })
    },
    saveCard (state, {deckId, cardId, title, color, front, back}) {
      const card = state.decks[deckId].cards[cardId]
      card.title = title
      card.color = color
      card.front = front
      card.back = back
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
    signOut ({commit}) {
      commit('setDecks', {})
    },
    importDecks ({commit, dispatch}, decks) {
      commit('setDecks', decks)
      dispatch('saveToLS')
    },
    createDeck ({dispatch, commit}, payload) {
      const deckId = generateUUID()
      commit('addDeck', {deck: {'.key': deckId, name: payload.name, defaultColor: '#ffed96', cards: {}}, key: deckId})
      dispatch('saveToLS')
    },
    deleteDeck ({dispatch, commit}, deckId) {
      commit('removeDeck', deckId)
      dispatch('saveToLS')
    },
    createCard ({dispatch, commit, state, getters}, payload) {
      const cardId = generateUUID()
      const color = payload.color || state.decks[payload.deckId].defaultColor
      commit('addCard', {card: {'.key': cardId, order: getters.cardsOfDeck(payload.deckId).length, title: payload.title, color: color, front: '', back: ''}, key: cardId, deckId: payload.deckId})
      dispatch('saveToLS')
    },
    deleteCard ({dispatch, commit}, {deckId, cardId}) {
      commit('removeCard', {deckId, cardId})
      dispatch('saveToLS')
    },
    saveCard ({dispatch, commit}, payload) {
      commit('saveCard', payload)
      dispatch('saveToLS')
    }
  }
}
