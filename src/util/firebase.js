import Firebase from 'firebase'

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

export function signOut () {
  return firebaseAuth.signOut()
}

// TODO: subscription functions to connect reactive models to firebase

firebaseAuth.onAuthStateChanged(user => {
  firebaseStatus.authed = !!user
  firebaseStatus.user = user
})
