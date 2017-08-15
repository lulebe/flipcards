<template>
  <div>
    <Topbar signedIn="true" canGoBack="true" @backPressed="$router.push('/deck/'+deckId)">
      <button @click="toggleEditing" v-if="!editing" class="link">
        <svg viewBox="0 0 24 24" class="icon">
          <path fill="#ffffff" d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
      </svg>
        <span class="text">Edit</span>
      </button>
      <button @click="toggleEditing" v-if="editing" class="link">
        <svg viewBox="0 0 24 24" class="icon">
            <path fill="#ffffff" d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z"/>
        </svg>
        <span class="text">Save</span>
      </button>
    </Topbar>
    <div class="color-picker">
      <span class="color" style="background-color: green"></span>
      <span class="color" style="background-color: red"></span>
      <span class="color" style="background-color: blue"></span>
    </div>
    <div class="markdown-link-container" v-if="editing">
      You can use
      <a href="https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet" target="_blank">Markdown</a>
      to style your text.
    </div>
    <div class="markdown-link-container" v-if="!editing">
      <a :href="'#/deck/' + deckId + '/' + navIds.prev" v-if="navIds.prev">prev</a>
      <a :href="'#/deck/' + deckId + '/' + navIds.next" v-if="navIds.next">next</a>
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
      card () { return this.$store.state.data.decks[this.deckId].cards[this.cardId] },
      navIds () { return this.$store.getters['data/navIds'](this.deckId, this.cardId) }
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
    display: block;
    float: left;
    margin-top: 16px;
    margin-left: 16px;
    cursor: pointer;
  }
  .color-picker {
    margin-top: 16px;
    text-align: center;
  }
  .color {
    margin: 0 4px;
    display: inline-block;
    border-radius: 0px;
    height: 32px;
    width: 32px;
    transition: border-radius 0.2s ease;
  }
  .color:hover {
    border-radius: 16px;
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
