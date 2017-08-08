<template>
  <div class="jumbotron">
    <div class="content">
      <div class="brandname">Flipcards</div>
      <h1>Digital Index Cards</h1>
      <p>Study effectively with online Index Cards, synced in real time across all your devices.</p>
      <div class="ctas">
        <a href="#/signup" class="button acc">Sign up</a>
        <a href="#/signin" class="button prim">Sign in</a>
      </div>
      Or <a href="#" @click.prevent="signInLocally" class="local-link">sign In locally</a> and add synchronization later.
    </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {
      }
    },
    methods: {
      signInLocally () {
        this.$store.dispatch('user/loadOrCreateLocal')
        this.$router.replace('/home')
      }
    }
  }
</script>

<style>
  .jumbotron {
    padding: 48px 24px 64px 24px;
    background-color: #673ab7;
    color: #f3f3f3;
  }
  .jumbotron .content {
    max-width: 500px;
    text-align: center;
    margin: 0 auto;
  }
  .brandname {
    font-family: monospace;
    letter-spacing: 0em;
    font-weight: bold;
    color: white;
    font-size: 3rem;
    margin-bottom: 64px;
  }
  .ctas {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    margin-top: 48px;
    margin-bottom: 24px;
  }
  .ctas .button {
    padding: 10px 20px;
  }
  .local-link {
    color: orange;
  }
</style>
