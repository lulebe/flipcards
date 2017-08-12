<template>
  <header class="topbar no-select">
    <a :href="signedIn ? '#/home' : '#/'" class="topbar-title">
      <img src="/static/img/icons/android-chrome-192x192.png" />
      <span>Flipcards</span>
    </a>
    <div style="float: right;">
      <slot></slot>
      <button @click="signout()" class="link" v-if="signedIn">Sign Out</button>
    </div>
  </header>
</template>
<script>
  export default {
    props: [
      'signedIn'
    ],
    name: 'Topbar',
    data () {
      return {
      }
    },
    methods: {
      signout () {
        // TODO
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
  @media (max-width: 450px) {
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
</style>
