<template>
  <div>
    <Topbar signedIn="true" canGoBack="true" @backPressed="$router.push('/home')">
      <button @click="addCard()" class="link">
      <svg viewBox="0 0 24 24" class="icon">
        <path fill="#ffffff" d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
      </svg>
      <span class="text">Add Card</span>
      </button>
    </Topbar>
    <h1 class="no-select" style="margin: 24px;">{{deck.name}}</h1>
    <section class="cardlist" v-if="cards.length > 0">
      <transition-group name="card">
        <a :href="'#/deck/' + deckId + '/' + card['.key']" class="card" v-for="card in cards" :key="card['.key']" :style="{backgroundColor: card.color}">
          <h2 class="title">{{card.title}}</h2>
          <hr>
          <a href="#" @click.prevent="deleteCard(card)" style="color: #aa3333; font-size: 0.7rem;">DELETE</a>
        </a>
      </transition-group>
    </section>
    <div class="no-cards no-select" v-if="cards.length === 0">
      You have no cards in this deck so far. Click <small><strong>ADD CARD</strong></small> to add the first one.
    </div>
  </div>
</template>
<script>
  import cTopbar from '@/components/Topbar'

  export default {
    components: {
      'Topbar': cTopbar
    },
    props: ['deckId'],
    data () {
      return {
      }
    },
    computed: {
      deck () { return this.$store.state.data.decks[this.deckId] },
      cards () { return this.$store.getters['data/cardsOfDeck'](this.deckId) }
    },
    methods: {
      addCard () {
        this.$store.dispatch('data/createCard', {title: 'new Card', deckId: this.deckId})
      },
      deleteCard (card) {
        this.$store.dispatch('data/deleteCard', {deckId: this.deckId, cardId: card['.key']})
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
    transition: box-shadow 0.2s ease, transform 0.2s ease, opacity 0.2s ease;
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

  .card-leave-to {
    transform: scale(0.7);
    opacity: 0;
  }
  .card.card-enter {
    transform: translateY(16px) scale(1.5);
    box-shadow: 0 15px 50px rgba(0,0,0,0.4);
    opacity: 0;
  }
  .card-enter-active, .card-leave-active {
    transform-origin: 50% 50%;
    transition: transform 0.2s ease, opacity 0.2s ease, box-shadow 0.2s ease;
  }
</style>
