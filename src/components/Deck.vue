<template>
  <div class="page">
    <h1 class="no-select" style="margin: 24px;">{{deck.name}}</h1>
    <section class="cardlist" v-if="cards.length > 0">
      <transition-group name="card">
        <router-link :to="{name: 'card', params: {deckId: deckId, cardId: card['.key']}}" class="card" :class="{selected: selectedCards[card['.key']]}" v-for="card in cards" :key="card['.key']" :style="{backgroundColor: card.color}">
          <h2 class="title">{{card.title}}</h2>
          <hr>
          <a href="#" v-if="!selectedCards[card['.key']]" @click.prevent="selectCard(card['.key'])" style="color: #040; font-size: 0.8rem;">select</a>
          <a href="#" v-if="selectedCards[card['.key']]" @click.prevent="deselectCard(card['.key'])" style="color: #a33; font-size: 0.8rem;">deselect</a>
        </router-link>
      </transition-group>
    </section>
    <div class="no-cards no-select" v-if="cards.length === 0">
      You have no cards in this deck so far. Click <small><strong>ADD CARD</strong></small> to add the first one.
    </div>
  </div>
</template>
<script>
  import {bindToPage} from '@/util/topbarAdapter'

  let topbarDispatcher = null
  const TOPBAR_ITEMS = {
    ADD_CARD: 0,
    SHUFFLE: 1,
    DELETE: 2
  }

  export default {
    props: ['deckId'],
    data () {
      return {
        selectedCards: {}
      }
    },
    computed: {
      deck () { return this.$store.state.data.decks[this.deckId] },
      cards () { return this.$store.getters['data/cardsOfDeck'](this.deckId) },
      selectedCardCount () { return Object.keys(this.selectedCards).length }
    },
    mounted () {
      topbarDispatcher = bindToPage({
        backPressed: this.backPressed,
        buttonPressed: this.topbarBtnPressed,
        contextualCancel: this.contextualCancel
      })
      this.setNormalTopbar()
    },
    methods: {
      setNormalTopbar () {
        topbarDispatcher.setContextual(false)
        topbarDispatcher.setBackEnabled(true)
        topbarDispatcher.setItems([
          {
            id: TOPBAR_ITEMS.SHUFFLE,
            text: 'Shuffle',
            svgPath: 'M14.83,13.41L13.42,14.82L16.55,17.95L14.5,20H20V14.5L17.96,16.54L14.83,13.41M14.5,4L16.54,6.04L4,18.59L5.41,20L17.96,7.46L20,9.5V4M10.59,9.17L5.41,4L4,5.41L9.17,10.58L10.59,9.17Z'
          },
          {
            id: TOPBAR_ITEMS.ADD_CARD,
            text: 'Add Card',
            svgPath: 'M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z'
          }
        ])
      },
      setContextualTopbar () {
        topbarDispatcher.setContextualTitle('0 selected')
        topbarDispatcher.setContextual(true)
        topbarDispatcher.setItems([
          {
            id: TOPBAR_ITEMS.DELETE,
            text: 'Delete Cards',
            svgPath: 'M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z'
          }
        ])
      },
      contextualCancel () {
        Object.keys(this.selectedCards).forEach(key => this.$delete(this.selectedCards, key))
      },
      backPressed () {
        this.$router.go(-1)
      },
      topbarBtnPressed (id) {
        switch (id) {
          case TOPBAR_ITEMS.DELETE:
            this.deleteSelectedCards()
            this.setNormalTopbar()
            break
          case TOPBAR_ITEMS.SHUFFLE:
            this.shuffle()
            break
          case TOPBAR_ITEMS.ADD_CARD:
            this.addCard()
        }
      },
      deleteSelectedCards () {
        Object.keys(this.selectedCards).forEach(cardId => this.deleteCard(cardId))
      },
      selectCard (cardId) {
        this.$set(this.selectedCards, cardId, true)
      },
      deselectCard (cardId) {
        this.$delete(this.selectedCards, cardId)
      },
      shuffle () {
        this.$store.commit('data/shuffleDeck', this.deckId)
        this.$router.push({
          name: 'card',
          params: {deckId: this.deckId, cardId: this.$store.state.data.shuffledCardIds[this.deckId][0]},
          query: {shuffle: true}
        })
      },
      addCard () {
        this.$store.dispatch('data/createCard', {title: 'new Card', deckId: this.deckId})
      },
      deleteCard (cardId) {
        this.$store.dispatch('data/deleteCard', {deckId: this.deckId, cardId: cardId})
      }
    },
    watch: {
      selectedCardCount (newCount, oldCount) {
        if (newCount > 0) {
          if (oldCount === 0) {
            this.setContextualTopbar()
          }
          topbarDispatcher.setContextualTitle(newCount + ' selected')
        } else if (newCount === 0 && oldCount > 0) {
          this.setNormalTopbar()
        }
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
    transition: box-shadow 0.2s, transform 0.2s, opacity 0.2s;
    cursor: pointer;
    opacity: 0.85;
  }
  .card.selected {
    box-shadow: 0 5px 17px rgba(0,0,0,0.3);
    transform: scale(1.05);
    opacity: 1;
  }
  .card:not[.selected]:hover {
    box-shadow: 0 3px 8px rgba(0,0,0,0.3);
  }
  .card:hover {
    text-decoration: none;
  }
  .card:active {
    box-shadow: 0 5px 15px rgba(0,0,0,0.2);
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
