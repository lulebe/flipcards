<template>
  <div>
    <Topbar signedIn="true"></Topbar>
    <a :href="'#/deck/' + deckId" class="back-link no-select">↶ back to Deck</a>
    <button class="img button" @click="toggleEditing" style="float: right; margin: 16px 16px 0 0;">
      <svg style="width:24px;height:24px" viewBox="0 0 24 24" v-if="!editing">
        <path fill="#000000" d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
      </svg>
      <svg style="width:24px;height:24px" viewBox="0 0 24 24" v-if="editing">
        <path fill="#33aa33" d="M15,9H5V5H15M12,19A3,3 0 0,1 9,16A3,3 0 0,1 12,13A3,3 0 0,1 15,16A3,3 0 0,1 12,19M17,3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V7L17,3Z" />
      </svg>
    </button>
    <div class="markdown-link-container" v-if="editing">
      You can use
      <a href="https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet" target="_blank">Markdown</a>
      to style your text.
    </div>
    <Cardview :color="card.color" class="cardview">
      <h1 slot="header" v-if="!editing" class="heading">{{card.title}}</h1>
      <div slot="header" v-if="editing" class="heading-input-container">
        <input type="text" v-model="eTitle" placeholder="Title" class="heading-input">
      </div>
      <Markdown slot="frontContent" v-if="!editing" :source="card.front"></Markdown>
      <div slot="frontContent" v-if="editing" class="content-input-container">
        <textarea v-model="eFront" placeholder="Front Content" class="content-input"></textarea>
      </div>
      <Markdown slot="backContent" v-if="!editing" :source="card.back"></Markdown>
      <div slot="backContent" v-if="editing" class="content-input-container">
        <textarea v-model="eBack" placeholder="Back Content" class="content-input"></textarea>
      </div>
    </Cardview>
  </div>
</template>
<script>
  import VueMarkdown from 'vue-markdown'

  import cTopbar from '@/components/Topbar'
  import cCardview from '@/components/Cardview'

  export default {
    props: ['deckId', 'cardId'],
    components: {
      'Topbar': cTopbar,
      'Cardview': cCardview,
      'Markdown': VueMarkdown
    },
    data () {
      return {
        editing: false,
        eTitle: '',
        eColor: '',
        eFront: '',
        eBack: ''
      }
    },
    computed: {
      card () { return this.$store.state.data.decks[this.deckId].cards[this.cardId] }
    },
    methods: {
      toggleEditing () {
        if (!this.editing) {
          this.eTitle = this.card.title
          this.eColor = this.card.color
          this.eFront = this.card.front
          this.eBack = this.card.back
          this.editing = true
        } else {
          this.$store.dispatch('data/saveCard', {
            cardId: this.cardId,
            deckId: this.deckId,
            title: this.eTitle,
            color: this.eColor,
            front: this.eFront,
            back: this.eBack
          })
          this.editing = false
        }
      }
    }
  }
</script>
<style lang="css">
  .cardview p {
    margin-top: 2px;
  }
</style>
<style lang="css" scoped>
  .back-link {
    display: inline-block;
    margin-top: 16px;
    margin-left: 16px;
    cursor: pointer;
  }
  .heading {
    font-size: 1.5rem;
    margin: 16px;
  }
  .heading-input-container {
    width: 100%;
    padding: 12px 16px;
  }
  .heading-input {
    font-size: 1.5rem;
    margin: 0;
    padding: 4px 0 2px 0;
    width: 100%;
    display: block;
    font-weight: bold;
  }
  .content-input-container {
    margin-top: 1px;
    width: 100%;
  }
  .content-input {
    width: 100%;
    display: block;
    padding: 0;
    line-height: 1.2rem;
    min-height: 14rem;
    margin: 0;
  }
  .markdown-link-container {
    text-align: center;
    font-size: 0.9rem;
    color: #999;
    position: fixed;
    bottom: 16px;
    width: 100%;
    padding: 16px;
    z-index: 3;
  }
</style>
