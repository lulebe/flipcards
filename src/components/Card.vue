<template>
  <div>
    <Topbar signedIn="true" canGoBack="true" @backPressed="$router.push('/deck/'+deckId)">
      <button @click="toggleEditing" v-if="!editing" class="link">Edit</button>
      <button @click="toggleEditing" v-if="editing" class="link">Save</button>
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
