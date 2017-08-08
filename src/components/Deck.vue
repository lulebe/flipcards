<template>
  <div>
    <Topbar signedIn="true">
      <button @click="addCard()" class="link">Add Card</button>
    </Topbar>
    <h1 style="margin: 24px;">{{deck.name}}</h1>
    <section class="cardlist" v-if="cards.length > 0">
      <a :href="'#/deck/' + deckId + '/' + card['.key']" class="card" v-for="card in cards" :style="{backgroundColor: card.color}">
        <h2 class="title">{{card.title}}</h2>
        <hr>
        <a href="#" @click.prevent="deleteCard(card)" style="color: #aa3333; font-size: 0.7rem;">DELETE</a>
      </a>
    </section>
    <div class="no-cards" v-if="cards.length === 0">
      You have no cards in this deck so far. Click <small><strong>ADD CARD</strong></small> to add the first one.
    </div>
  </div>
</template>
<script>
  import cTopbar from '@/components/Topbar'

  import {firebaseDb, firebaseStatus, firebaseAuth} from '@/util/firebase'

  export default {
    components: {
      'Topbar': cTopbar
    },
    props: ['deckId'],
    data () {
      return {
        deck: {name: 'Loading...'},
        cards: []
      }
    },
    mounted () {
      if (firebaseStatus.user != null) {
        this.loadDeck(firebaseStatus.user)
      } else {
        const unsub = firebaseAuth.onAuthStateChanged(user => {
          unsub()
          this.loadDeck(user)
        })
      }
    },
    methods: {
      loadDeck (user) {
        this.$bindAsObject('deck', firebaseDb.ref('/users/' + user.uid + '/decks/' + this.deckId))
        this.$bindAsArray('cards', firebaseDb.ref('/users/' + user.uid + '/decks/' + this.deckId + '/cards'))
      },
      addCard () {
        firebaseDb.ref('/users/' + firebaseStatus.user.uid + '/decks/' + this.deckId + '/cards').push({title: 'New Card', color: '#fff59d', front: '', back: ''})
      },
      deleteCard (card) {
        firebaseDb.ref('/users/' + firebaseStatus.user.uid + '/decks/' + this.deckId + '/cards/' + card['.key']).remove()
      }
    }
  }
</script>
<style lang="css" scoped>
  .no-cards {
    margin: 160px 24px 24px;
    text-align: center;
    color: #666;
  }
  .cardlist {
    margin: 16px;
  }
  .card {
    display: inline-block;
    padding: 8px 16px 16px 16px;
    margin: 8px;
    border-radius: 2px;
    box-shadow: 0 2px 3px rgba(0,0,0,0.4);
    transition: box-shadow 0.2s ease, transform 0.2s ease;
    cursor: pointer;
  }
  .card:hover {
    box-shadow: 0 3px 8px rgba(0,0,0,0.3);
    text-decoration: none;
  }
  .card:active {
    box-shadow: 0 5px 15px rgba(0,0,0,0.2);
    transform: scale(1.02);
  }
  .card > hr {
    height: 1px;
    border: none;
    background-color: rgba(0,0,0,0.3);
  }
  .card .title {
    margin: 0;
    font-size: 1rem;
    font-weight: 500;
    color: #111;
  }
</style>
