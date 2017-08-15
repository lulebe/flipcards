import Firebase from 'firebase'

import store from '@/state/store'

const firebaseApp = Firebase.initializeApp({
  apiKey: 'AIzaSyDbZSXOKXxwar2g4PhKHkOnuIP2PEBGTa4',
  authDomain: 'flipcards-e7350.firebaseapp.com',
  databaseURL: 'https://flipcards-e7350.firebaseio.com',
  projectId: 'flipcards-e7350',
  storageBucket: 'flipcards-e7350.appspot.com',
  messagingSenderId: '502605709118'
})

const GoogleProvider = new Firebase.auth.GoogleAuthProvider()

export const firebaseAuth = firebaseApp.auth()

export const firebaseDb = firebaseApp.database()

export const firebaseStatus = {authed: false, user: null}

export function signInWithGoogle () {
  return firebaseAuth.signInWithPopup(GoogleProvider)
}

export function signUpWithEmail (email, password) {
  return firebaseAuth.createUserWithEmailAndPassword(email, password)
}

export function signInWithEmail (email, password) {
  return firebaseAuth.signInWithEmailAndPassword(email, password)
}

// firebase to vuex connection

var deactivateDownSync = null

firebaseAuth.onAuthStateChanged(user => {
  deactivateDownSync && deactivateDownSync()
  firebaseStatus.authed = !!user
  firebaseStatus.user = user
  store.dispatch('user/firebaseAuthChanged', user)
  if (user) {
    if (store.state.user.waitingToMakeOnline) {
      syncAllDataUp(user)
      store.commit('user/setWaitingToMakeOnline', false)
    }
    deactivateDownSync = activateDownSync(user.uid)
  }
})

firebaseDb.ref('.info/connected').on('value', val => {
  store.commit('user/setFbConnected', val)
})

function syncAllDataUp (user) {
  const decks = JSON.parse(JSON.stringify(store.state.data.decks))
  for (let deckId in decks) {
    delete decks[deckId]['.key']
    for (let cardId in decks[deckId].cards) {
      delete decks[deckId].cards[cardId]['.key']
    }
  }
  firebaseDb.ref('/users/' + user.uid + '/decks').set(decks)
}

function syncAllDataDown (fbDecks) {
  if (!store.state.user.fbConnected) {
    return
  }
  try {
    const decks = JSON.parse(JSON.stringify(fbDecks))
    for (let deckId in decks) {
      decks[deckId]['.key'] = deckId
      for (let cardId in decks[deckId].cards) {
        decks[deckId].cards[cardId]['.key'] = cardId
      }
      if (!decks[deckId].cards) {
        decks[deckId].cards = {}
      }
    }
    store.dispatch('data/importDecks', decks || {})
  } catch (e) {}
}

function activateDownSync (userId) {
  return firebaseDb.ref('/users/' + userId + '/decks').on('value', val => {
    syncAllDataDown(val)
  })
}

store.subscribe((mutation, state) => {
  if (mutation.type.substring(0, 4) === 'data' && mutation.type !== 'data/setDecks' && firebaseStatus.authed && firebaseStatus.user.uid === state.user.userId) {
    syncAllDataUp(firebaseStatus.user)
  }
})
