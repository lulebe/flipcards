<template>
  <div class="page">
    <div class="nav-btns" v-if="!editing">
      <router-link :to="{name: 'card', params: {deckId: deckId, cardId: navIds.prev || '0'}, query: $route.query}" :class="{visible: navIds.prev}" class="nav-btn prev">
        <svg viewBox="0 0 24 24">
            <path fill="#000000" d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
        </svg>
        <Tooltip>or press ←</Tooltip>
      </router-link>
      <span class="spacer"></span>
      <router-link :to="{name: 'card', params: {deckId: deckId, cardId: navIds.next || '0'}, query: $route.query}" :class="{visible: navIds.next}" class="nav-btn next">
        <svg viewBox="0 0 24 24">
            <path fill="#000000" d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
        </svg>
        <Tooltip>or press →</Tooltip>
      </router-link>
    </div>
    <div class="color-picker" v-if="editing">
      <span class="color"
        :class="{picked: eColor === '#ffed96'}"
        @click="eColor = '#ffed96'"
        style="background-color: #ffed96;">
      </span>
      <span class="color"
        :class="{picked: eColor === '#adebad'}"
        @click="eColor = '#adebad'"
        style="background-color: #adebad;">
      </span>
      <span class="color"
        :class="{picked: eColor === '#ffb399'}"
        @click="eColor = '#ffb399'"
        style="background-color: #ffb399;">
      </span>
      <span class="color"
        :class="{picked: eColor === '#bfb3ff'}"
        @click="eColor = '#bfb3ff'"
        style="background-color: #bfb3ff;">
      </span>
    </div>
    <div class="markdown-link-container" v-if="editing">
      You can use
      <a href="https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet" target="_blank">Markdown</a>
      to style your text.
    </div>
    <div style="text-align: center;">
      <input type="checkbox" v-model="backDefault" id="backDefaultCb">
      <label for="backDefaultCb">Show back first</label>
    </div>
    <Cardview :color="cardcolor" class="cardview" ref="card">
      <h1 slot="header" v-if="!editing" class="heading">{{card.title}}</h1>
      <div slot="header" v-if="editing" class="heading-input-container">
        <input type="text" ref="etitle" v-model="eTitle" placeholder="Title" class="heading-input">
      </div>
      <Markdown slot="frontContent" v-if="!editing" :source="card.front"></Markdown>
      <div slot="frontContent" v-if="editing" class="content-input-container">
        <textarea v-model="eFront" placeholder="Front Content" class="content-input"></textarea>
      </div>
      <h2 slot="headerBack" class="heading">{{card.title}}</h2>
      <Markdown slot="backContent" v-if="!editing" :source="card.back"></Markdown>
      <div slot="backContent" v-if="editing" class="content-input-container">
        <textarea v-model="eBack" placeholder="Back Content" class="content-input"></textarea>
      </div>
    </Cardview>
  </div>
</template>
<script>
  import VueMarkdown from 'vue-markdown'

  import cCardview from '@/components/Cardview'
  import cTooltip from '@/components/Tooltip'

  import keyEvents from '@/util/keyEvents'
  import {bindToPage} from '@/util/topbarAdapter'

  let topbarDispatcher = null
  const TOPBAR_ITEMS = {
    EDIT: 0,
    SAVE: 1
  }

  export default {
    props: ['deckId', 'cardId'],
    components: {
      'Cardview': cCardview,
      'Markdown': VueMarkdown,
      'Tooltip': cTooltip
    },
    data () {
      return {
        editing: false,
        eTitle: '',
        eColor: '',
        eFront: '',
        eBack: '',
        backStack: 1,
        backDefault: false
      }
    },
    computed: {
      card () { return this.$store.state.data.decks[this.deckId].cards[this.cardId] },
      navIds () { return this.$store.getters['data/navIds'](this.deckId, this.cardId, this.$route.query.shuffle) },
      cardcolor () { return this.editing ? this.eColor : this.card.color }
    },
    mounted () {
      keyEvents.$on('flip', () => this.$refs.card && this.$refs.card.flip())
      keyEvents.$on('edit', () => !this.editing && this.toggleEditing())
      keyEvents.$on('save', () => this.editing && this.toggleEditing())
      keyEvents.$on('prev', this.toPrev)
      keyEvents.$on('next', this.toNext)
      topbarDispatcher = bindToPage({
        backPressed: this.backPressed,
        buttonPressed: this.topbarBtnPressed
      })
      topbarDispatcher.setBackEnabled(true)
      this.topbarDisplayEdit()
    },
    beforeDestroy () {
      keyEvents.$off('flip')
      keyEvents.$off('prev')
      keyEvents.$off('next')
      keyEvents.$off('save')
      keyEvents.$off('edit')
    },
    watch: {
      '$route' () {
        this.backStack++
      },
      backDefault (newVal) {
        this.$router.push({
          name: this.$route.name,
          params: this.$route.params,
          query: {...this.$route.query, back: newVal}
        })
      }
    },
    methods: {
      backPressed () {
        this.$router.go(-this.backStack)
      },
      topbarBtnPressed (id) {
        switch (id) {
          case TOPBAR_ITEMS.EDIT:
            this.toggleEditing()
            break
          case TOPBAR_ITEMS.SAVE:
            this.toggleEditing()
        }
      },
      topbarDisplayEdit () {
        topbarDispatcher.setItems([
          {
            id: TOPBAR_ITEMS.EDIT,
            text: 'Edit',
            shortcut: 'CTRL-E',
            svgPath: 'M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z'
          }
        ])
      },
      topbarDisplaySave () {
        topbarDispatcher.setItems([
          {
            id: TOPBAR_ITEMS.SAVE,
            text: 'Save',
            shortcut: 'CTRL-S',
            svgPath: 'M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z'
          }
        ])
      },
      toPrev () {
        this.navIds.prev && this.$router.push({
          name: 'card',
          params: {deckId: this.deckId, cardId: this.navIds.prev},
          query: this.$route.query
        })
      },
      toNext () {
        this.navIds.next && this.$router.push({
          name: 'card',
          params: {deckId: this.deckId, cardId: this.navIds.next},
          query: this.$route.query
        })
      },
      toggleEditing () {
        if (!this.editing) {
          this.eTitle = this.card.title
          this.eColor = this.card.color
          this.eFront = this.card.front
          this.eBack = this.card.back
          this.editing = true
          this.topbarDisplaySave()
          setTimeout(() => this.$refs.etitle.focus(), 100)
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
          this.topbarDisplayEdit()
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
  .nav-btns {
    margin-top: 16px;
    text-align: center;
    text-transform: uppercase;
    font-weight: bold;
    font-size: 1.2rem;
    height: 36px;
  }
  .nav-btns .nav-btn {
    display: inline-block;
    border-radius: 24px;
    height: 36px;
    width: 36px;
    cursor: pointer;
    pointer-events: none;
    opacity: 0;
    transition: background-color 0.2s, transform 0.2s cubic-bezier(0.550, 0.055, 0.675, 0.190);
  }
  .nav-btns .nav-btn.visible {
    pointer-events: initial;
    opacity: 1;
  }
  .nav-btns .nav-btn > svg {
    width: 36px;
    height: 36px;
    transition: transform 1s;
  }
  .nav-btns .nav-btn:hover {
    background-color: rgba(0,0,0,0.2);
  }
  .nav-btns .nav-btn.prev:active {
    transform: scaleX(1.4);
    transform-origin: 100% 50%;
  }
  .nav-btns .nav-btn.prev:active > svg {
    transform: translateX(-8px);
  }
  .nav-btns .nav-btn.next:active {
    transform: scaleX(1.4);
    transform-origin: 0% 50%;
  }
  .nav-btns .nav-btn.next:active > svg {
    transform: translateX(8px);
  }
  .nav-btns .spacer {
    display: inline-block;
    width: 160px;
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
    border-radius: 8px;
  }
  .color.picked {
    border-radius: 16px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.5);
  }
  h1.heading {
    font-size: 1.5rem;
    margin: 16px;
  }
  h2.heading {
    font-size: 1rem;
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
