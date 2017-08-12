<template>
  <div>
    <Topbar signedIn="true">
      <button @click="createDeckModalOpen = true" class="link">New Deck</button>
    </Topbar>
    <h1 class="no-select" style="margin: 24px;">Your Decks</h1>
    <ul class="decklist" v-if="decks.length > 0">
      <li class="deck" v-for="deck in decks">
        <button class="button img delbtn" @click="deleteDeck(deck)">
          <svg style="width:24px;height:24px" viewBox="0 0 24 24">
            <path fill="#880000" d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z" />
          </svg>
        </button>
        <a :href="'#/deck/'+deck['.key']">{{deck.name}}</a>
      </li>
    </ul>
    <div class="no-decks no-select" v-if="decks.length === 0" unselectable="on">You have no decks yet. Click <small><strong>NEW DECK</strong></small> to create one.</div>
    <Modal
      :open="createDeckModalOpen"
      title="Create a new Deck"
      cancelText="cancel"
      okText="create Deck"
      @ok="createDeck()"
      @cancel="createDeckModalOpen = false"
      class="no-select">
        <form @submit.prevent="createDeck()">
          <div class="input-group full-width">
            <label for="newdeckname">Deck Name</label>
            <input type="text" v-model="newDeckName" class="full-width" id="newdeckname" placeholder="electrical engineering" required />
          </div>
        </form>
    </Modal>
  </div>
</template>
<script>
  import cTopbar from '@/components/Topbar'
  import cModal from '@/components/Modal'

  export default {
    components: {
      'Topbar': cTopbar,
      'Modal': cModal
    },
    data () {
      return {
        createDeckModalOpen: false,
        newDeckName: ''
      }
    },
    computed: {
      decks () { return this.$store.getters['data/decksAsArray'] }
    },
    methods: {
      createDeck () {
        this.createDeckModalOpen = false
        this.$store.dispatch('data/createDeck', {name: this.newDeckName})
        this.newDeckName = ''
      },
      deleteDeck (deck) {
        this.$store.dispatch('data/deleteDeck', deck['.key'])
      }
    }
  }
</script>
<style lang="css">
  .decklist {
    margin: 24px;
    list-style: none;
    padding: 0;
  }
  .decklist .deck > a {
    padding: 16px;
    display: block;
    margin-right: 64px;
  }
  .decklist .deck {
    border-top: 1px solid lightgrey;
  }
  .decklist .deck:first-child {
    border-top: none;
  }
  .decklist .deck:hover {
    background: rgba(0,0,0,0.05);
  }
  .decklist .deck:active {
    background: rgba(0,0,0,0.1);
  }
  .deck .delbtn {
    float: right;
    display: block;
    margin-right: 16px;
    margin-top: 10px;

  }
  .no-decks {
    margin: 160px 24px 24px;
    text-align: center;
    color: #666;
  }
</style>
