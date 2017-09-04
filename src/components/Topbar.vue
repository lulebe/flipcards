<template>
  <header class="topbar no-select" :class="{contextual: contextual}">
    <a href="#" @click.prevent="goBack" class="topbar-backbtn">
      <transition name="homeicon">
      <img src="/static/img/icons/android-chrome-192x192.png" v-if="!canGoBack && !contextual" />
      </transition>
      <transition name="backicon">
      <svg v-if="canGoBack && !contextual" viewBox="0 0 24 24">
          <path d="M0 0h24v24H0z" fill="none"/>
          <path fill="#FFFFFF" d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
      </svg>
      </transition>
      <transition name="backicon">
      <svg v-if="contextual" viewBox="0 0 24 24">
          <path d="M0 0h24v24H0z" fill="none"/>
          <path fill="#FFFFFF" d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"/>
      </svg>
      </transition>
    </a>
    <span class="topbar-title" v-if="!contextual">Flipcards</span>
    <span class="topbar-title" v-if="contextual">{{contextualTitle}}</span>
    <div class="links-direct">
      <button v-for="item in items" @click="itemClicked(item.id)" class="link">
        <svg viewBox="0 0 24 24" class="icon">
          <path fill="#ffffff" :d="item.svgPath"/>
        </svg>
        <span class="text">{{item.text}}</span>
        <Tooltip v-if="item.shortcut">{{item.shortcut}}</Tooltip>
      </button>
      <button @click="signOut" class="link" v-if="signedIn && !contextual">
        <svg viewBox="0 0 24 24" class="icon">
          <path fill="#ffffff" d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
        </svg>
        <span class="text">Sign Out</span>
      </button>
      <button @click="menuOpen = !menuOpen" class="link" v-if="items.length > 0 || signedIn">
        <svg viewBox="0 0 24 24" class="icon">
          <path fill="#ffffff" d="M12,16A2,2 0 0,1 14,18A2,2 0 0,1 12,20A2,2 0 0,1 10,18A2,2 0 0,1 12,16M12,10A2,2 0 0,1 14,12A2,2 0 0,1 12,14A2,2 0 0,1 10,12A2,2 0 0,1 12,10M12,4A2,2 0 0,1 14,6A2,2 0 0,1 12,8A2,2 0 0,1 10,6A2,2 0 0,1 12,4Z"/>
        </svg>
        <span class="text">Menu</span>
      </button>
    </div>
    <transition name="overflow">
      <div class="overflow-menu" v-if="menuOpen">
        <div class="overlay" @click.prevent.stop="menuOpen = !menuOpen"></div>
        <button v-for="item in items" @click="itemClicked(item.id)" class="link">
          <svg viewBox="0 0 24 24" class="icon">
            <path :d="item.svgPath"/>
          </svg>
          <span class="text">{{item.text}}</span>
          <Tooltip v-if="item.shortcut">{{item.shortcut}}</Tooltip>
        </button>
        <button @click="signOut" class="link" v-if="signedIn && !contextual">
          <svg viewBox="0 0 24 24" class="icon">
            <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
          </svg>
          <span class="text">Sign Out</span>
        </button>
      </div>
    </transition>
  </header>
</template>
<script>
  import {firebaseAuth} from '@/util/firebase'
  import {bindToTopbar} from '@/util/topbarAdapter'
  import {USER_STATES} from '@/state/user'

  import cTooltip from '@/components/Tooltip'

  let adapterDispatcher = null

  export default {
    name: 'Topbar',
    components: {
      Tooltip: cTooltip
    },
    data () {
      return {
        canGoBack: false,
        contextual: false,
        contextualTitle: '',
        items: [],
        menuOpen: false
      }
    },
    computed: {
      signedIn () { return this.$store.state.user.status === USER_STATES.SIGNED_IN }
    },
    mounted () {
      adapterDispatcher = bindToTopbar({
        items: this.onItemsChanged,
        backEnabled: this.onBackEnabled,
        contextual: this.onContextual,
        contextualTitle: this.onContextualTitle
      })
    },
    destroyed () {
      adapterDispatcher.unbind()
    },
    methods: {
      onItemsChanged (items) {
        this.items = items
      },
      onBackEnabled (enabled) {
        this.canGoBack = enabled
      },
      onContextual (enabled) {
        this.contextual = enabled
      },
      onContextualTitle (title) {
        this.contextualTitle = title
      },
      itemClicked (id) {
        adapterDispatcher.buttonPressed(id)
        this.menuOpen = false
      },
      signOut () {
        this.menuOpen = false
        firebaseAuth.signOut()
        this.$store.dispatch('user/signOut')
        this.$router.push('/')
      },
      goBack () {
        if (this.contextual) {
          adapterDispatcher.contextualCancelled()
        } else if (this.canGoBack) {
          adapterDispatcher.backPressed()
        } else {
          this.$router.push({name: this.signedIn ? 'home' : 'frontpage'})
        }
      }
    }
  }
</script>
<style lang="css">
  .topbar {
    background-color: #673ab7;
    height: 64px;
    transition: background-color 0.3s;
  }
  .topbar.contextual {
    background-color: #333;
  }
  .topbar .topbar-backbtn > img {
    width: 48px;
    height: 48px;
    position: absolute;
    left: 8px;
    top: 8px;
  }
  .topbar .topbar-backbtn > svg {
    width: 48px;
    height: 48px;
    padding: 12px;
    position: absolute;
    left: 8px;
    top: 8px;
  }
  .topbar .topbar-title {
    font-family: monospace;
    font-weight: bold;
    line-height: 64px;
    font-size: 1.5rem;
    text-transform: none;
    color: white;
    height: 64px;
    display: inline-block;
    position: absolute;
    left: 72px;
  }
  .topbar.contextual .topbar-title {
    font-family: sans-serif;
  }
  @media (max-width: 480px) {
    .topbar .topbar-title {
      font-size: 1rem;
    }
  }
  .topbar .topbar-backbtn {
    height: 64px;
    display: inline-block;
    width: 64px;
    position: relative;
  }
  .topbar .topbar-backbtn:hover {
    background-color: rgba(0,0,0,0.2);
    text-decoration: none;
  }
  .topbar .links-direct {
    float: right;
  }
  .topbar .links-direct > .link:last-child {
    display: none;
  }
  @media (max-width: 400px) {
    .topbar .links-direct > .link:not(:last-child) {
      display: none;
    }
    .topbar .links-direct > .link:last-child {
      display: inline-block;
    }
  }
  .topbar .link {
    color: white;
    line-height: 64px;
    display: inline-block;
    padding: 0 16px;
    border: none;
    background: transparent;
    cursor: pointer;
    text-transform: uppercase;
    font-size: 0.8rem;
  }
  .topbar .link:hover {
    background-color: rgba(0,0,0,0.2);
    text-decoration: none;
  }
  .topbar .link > .icon {
    width: 24px;
    height: 24px;
    transform: translateY(6px);
  }
  @media (max-width: 610px) {
    .topbar {
      box-shadow: 0 -5px 8px 5px rgba(0,0,0,0.7);
    }
    .topbar .links-direct > .link > .text {
      display: block;
      line-height: 40px;
      font-size: 0.6rem;
    }
    .topbar .links-direct > .link > .icon {
      display: block;
      margin: 0 auto;
      transform: translateY(12px);
    }
  }

  .topbar .overflow-menu {
    background-color: white;
    border-radius: 4px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.4);
    position: absolute;
    right: 4px;
    top: 4px;
    z-index: 11;
    padding: 4px 0;
  }
  .topbar .overflow-menu .overlay {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: -1;
  }
  .topbar .overflow-menu > .link {
    background: transparent;
    color: #333;
    line-height: 48px;
    height: 48px;
    display: table;
  }
  .topbar .overflow-menu > .link .icon {
    fill: #333;
  }
  .topbar .overflow-menu > .link:hover {
    color: #00897b;
  }
  .topbar .overflow-menu > .link:hover .icon {
    fill: #00897b;
  }

  .backicon-enter-active, .backicon-leave-active, .homeicon-enter-active, .homeicon-leave-active {
    transition: transform 0.2s, opacity 0.2s;
  }
  .backicon-enter, .backicon-leave-to {
    transform: rotate(90deg);
    opacity: 0;
  }
  .homeicon-enter, .homeicon-leave-to {
    opacity: 0;
  }

  .overflow-enter-active {
    transition: transform 0.3s, opacity 0.3s cubic-bezier(0.2, 1, 0.3, 1);
  }
  .overflow-leave-active {
    transition: transform 0.2s, opacity 0.2s;
  }
  .overflow-enter, .overflow-leave-to {
    transform: translate(20px, -20px);
    opacity: 0;
  }
  .overflow-enter-active .link {
    animation: overflowitem4 0.3s;
  }
  .overflow-enter-active .link:nth-child(1) {
    animation: overflowitem1 0.3s;
  }
  .overflow-enter-active .link:nth-child(2) {
    animation: overflowitem2 0.3s;
  }
  .overflow-enter-active .link:nth-child(3) {
    animation: overflowitem3 0.3s;
  }

  @keyframes overflowitem1 {
    0% {
      transform: translateX(40px);
    }
    40% {
      transform: translateX(0px);
    }
  }
  @keyframes overflowitem2 {
    0% {
      transform: translateX(40px);
    }
    20% {
      transform: translateX(40px);
    }
    60% {
      transform: translateX(0px);
    }
  }
  @keyframes overflowitem3 {
    0% {
      transform: translateX(40px);
    }
    40% {
      transform: translateX(40px);
    }
    80% {
      transform: translateX(0px);
    }
  }
  @keyframes overflowitem4 {
    0% {
      transform: translateX(40px);
    }
    60% {
      transform: translateX(40px);
    }
    100% {
      transform: translateX(0px);
    }
  }
</style>
