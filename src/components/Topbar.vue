<template>
  <header class="topbar no-select">
    <a href="#" @click.prevent="goBack" class="topbar-title">
      <img src="/static/img/icons/android-chrome-192x192.png" v-if="!canGoBack" />
      <svg v-if="canGoBack" viewBox="0 0 24 24" style="width: 48px; height: 48px; padding: 12px;">
          <path d="M0 0h24v24H0z" fill="none"/>
          <path fill="#FFFFFF" d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
      </svg>
      <span>Flipcards</span>
    </a>
    <div style="float: right;">
      <slot></slot>
      <button @click="signOut" class="link" v-if="signedIn">
      <svg viewBox="0 0 24 24" class="icon">
        <path fill="#ffffff" d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
      </svg>
      <span class="text">Sign Out</span>
      </button>
    </div>
  </header>
</template>
<script>
  import {firebaseAuth} from '@/util/firebase'

  export default {
    props: [
      'signedIn', 'canGoBack'
    ],
    name: 'Topbar',
    data () {
      return {
      }
    },
    methods: {
      signOut () {
        firebaseAuth.signOut()
        this.$store.dispatch('user/signOut')
        this.$router.push('/')
      },
      goBack () {
        if (this.canGoBack) {
          this.$emit('backPressed')
        } else {
          this.$router.push(this.signedIn ? '/home' : '/')
        }
      }
    }
  }
</script>
<style lang="css">
  .topbar {
    background-color: #673ab7;
    height: 64px;
  }
  .topbar .topbar-title > img {
    width: 48px;
    height: 48px;
  }
  .topbar .topbar-title > span {
    font-family: monospace;
    font-weight: bold;
    line-height: 48px;
    font-size: 2rem;
    text-transform: none;
    color: white;
    float: right;
  }
  @media (max-width: 480px) {
    .topbar .topbar-title > span {
      display: none;
    }
  }
  .topbar .topbar-title {
    height: 64px;
    display: inline-block;
    padding: 8px;
  }
  .topbar .topbar-title:hover {
    background-color: rgba(0,0,0,0.2);
    text-decoration: none;
  }
  .topbar > h1 {
    margin: 0;
    display: inline-block;
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
    .topbar .link > .text {
      display: block;
      line-height: 40px;
      font-size: 0.6rem;
    }
    .topbar .link > .icon {
      display: block;
      margin: 0 auto;
      transform: translateY(12px);
    }
  }
</style>
