<template>
  <div class="page">
    <div v-if="userIsLocal" class="user-local-container">
      <p>
        <router-link :to="{name: 'settings'}" class="link" v-ripple>Create an online account</router-link> if you want to use your cards across multiple devices.
      </p>
    </div>
    <h1 class="no-select" style="margin: 24px;">Your Decks</h1>
    <ul class="decklist" v-if="decks.length > 0">
      <li class="deck" v-for="deck in decks">
        <button class="button img delbtn" @click="openDeleteDeckModal(deck)" aria-label="delete deck">
          <svg style="width:24px;height:24px" viewBox="0 0 24 24">
            <path fill="#880000" d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z" />
          </svg>
        </button>
        <router-link :to="{name: 'deck', params: {deckId: deck['.key']}}">
          {{deck.name}}<br>
          <span class="card-count">{{deck.cardCount}} cards</span>
        </router-link>
      </li>
    </ul>
    <div class="no-decks no-select" v-if="decks.length === 0">
      You have no decks yet. Click <small><strong>NEW DECK</strong></small> to create one.
    </div>
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
            <input type="text" ref="nameInput" v-model="newDeckName" class="full-width" id="newdeckname" placeholder="electrical engineering" required />
          </div>
        </form>
    </Modal>
    <Modal
      :open="deleteDeckModalOpen"
      title="Delete Deck"
      cancelText="cancel"
      okText="delete"
      @ok="deleteDeck()"
      @cancel="cancelDeleteDeck()"
      class="no-select">
        Really delete {{toBeDeletedName}}? This cannot be undone!
    </Modal>
  </div>
</template>
<script>
  import cModal from '@/components/Modal'

  import {bindToPage} from '@/util/topbarAdapter'

  let topbarDispatcher = null
  const TOPBAR_ITEMS = {
    NEW_DECK: 0,
    SETTINGS: 1
  }

  export default {
    components: {
      'Modal': cModal
    },
    data () {
      return {
        createDeckModalOpen: false,
        deleteDeckModalOpen: false,
        toBeDeletedName: null,
        toBeDeletedKey: null,
        newDeckName: ''
      }
    },
    computed: {
      userIsLocal () { return this.$store.state.user.user.isLocal },
      decks () {
        return this.$store.getters['data/decksAsArray'].map(deck => ({
          ...deck,
          cardCount: this.$store.getters['data/cardsOfDeck'](deck['.key']).length
        }))
      }
    },
    mounted () {
      topbarDispatcher = bindToPage({
        buttonPressed: this.topbarBtnPressed
      })
      topbarDispatcher.setBackEnabled(false)
      topbarDispatcher.setItems([
        {
          id: TOPBAR_ITEMS.NEW_DECK,
          text: 'New Deck',
          svgPath: 'M19 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-2 10h-4v4h-2v-4H7v-2h4V7h2v4h4v2z'
        },
        {
          id: TOPBAR_ITEMS.SETTINGS,
          text: 'Settings',
          svgPath: 'M19.43 12.98c.04-.32.07-.64.07-.98s-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.3-.61-.22l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65C14.46 2.18 14.25 2 14 2h-4c-.25 0-.46.18-.49.42l-.38 2.65c-.61.25-1.17.59-1.69.98l-2.49-1c-.23-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64l2.11 1.65c-.04.32-.07.65-.07.98s.03.66.07.98l-2.11 1.65c-.19.15-.24.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1c.52.4 1.08.73 1.69.98l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49-.42l.38-2.65c.61-.25 1.17-.59 1.69-.98l2.49 1c.23.09.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.65zM12 15.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z'
        }
      ])
    },
    methods: {
      topbarBtnPressed (id) {
        switch (id) {
          case TOPBAR_ITEMS.NEW_DECK:
            this.createDeckModalOpen = true
            setTimeout(() => this.$refs.nameInput && this.$refs.nameInput.focus(), 100)
            break
          case TOPBAR_ITEMS.SETTINGS:
            this.$router.push({name: 'settings'})
        }
      },
      createDeck () {
        this.createDeckModalOpen = false
        this.$store.dispatch('data/createDeck', {name: this.newDeckName})
        this.newDeckName = ''
      },
      openDeleteDeckModal (deck) {
        this.toBeDeletedName = deck.name
        this.toBeDeletedKey = deck['.key']
        this.deleteDeckModalOpen = true
      },
      deleteDeck () {
        this.$store.dispatch('data/deleteDeck', this.toBeDeletedKey)
        this.deleteDeckModalOpen = false
      },
      cancelDeleteDeck () {
        this.deleteDeckModalOpen = false
        this.toBeDeletedName = null
        this.toBeDeletedKey = null
      }
    }
  }
</script>
<style lang="css">
  .user-local-container {
    width: 100%;
    max-width: 600px;
    margin: 0 auto;
    padding: 0 16px;
    text-align: center;
  }
  .decklist {
    margin: 24px;
    list-style: none;
    padding: 0;
  }
  .decklist .deck > a {
    padding: 16px;
    display: block;
    margin-right: 64px;
    text-decoration: none;
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
  .decklist .deck .delbtn {
    float: right;
    display: block;
    margin-right: 16px;
    margin-top: 18px;
  }
  .decklist .deck .card-count {
    color: grey;
    font-size: 0.8rem;
  }
  .no-decks {
    margin: 160px 24px 24px;
    text-align: center;
    color: #666;
  }
</style>
