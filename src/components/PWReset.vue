<template>
  <div>
    <Topbar></Topbar>
    <fieldset class="signin-form" v-if="!sent">
      <legend>Password reset</legend>
      <form @submit.prevent="resetpw">
        <label for="signin-email">E-Mail</label><br>
        <input type="email" v-model="email" class="full-width" id="signin-email" placeholder="tom@aol.com" required /><br>
        <button type="submit" class="button acc" style="width: 100%">Reset Password</button>
        <br><br>
        Still remember your password?
        <router-link :to="{name: 'signin'}">Sign in</router-link>
        <br><br>
        Have no account?
        <router-link :to="{name: 'signup'}">Sign up</router-link>
      </form>
    </fieldset>
    <fieldset class="signin-form" v-if="sent">
      <legend>Password reset</legend>
      <p>
        A password reset link has been sent to your E-Mail inbox.
      </p>
    </fieldset>
  </div>
</template>

<script>
  import {sendPWResetEmail} from '@/util/firebase'
  
  import cTopbar from '@/components/Topbar'

  export default {
    components: {
      'Topbar': cTopbar
    },
    data () {
      return {
        email: '',
        sent: false
      }
    },
    methods: {
      resetpw () {
        sendPWResetEmail(this.email)
        .then(() => { this.sent = true })
      }
    }
  }
</script>

<style>
  .signin-form {
    max-width: 500px;
    margin: 0 auto;
    transform: translateY(-20px);
    padding: 68px 16px 16px 16px;
    border: none;
    box-shadow: 0 1px 4px rgba(0,0,0,0.3);
    border-radius: 2px;
  }
  .signin-form > legend {
    transform: translateY(44px);
    font-size: 1.2rem;
    font-weight: bold;
  }

  .google-btn {
    display: inline-block;
    border-radius: 100px;
    background: #f3f3f3;
    border: 2px solid #4885ed;
    cursor: pointer;
    outline: none;
  }
  .google-btn:hover {
    border-color: #f3f3f3;
    background: #4885ed;
  }
  .google-btn:active {
    transform: scaleX(0.97);
  }
  .idp-btn-img {
    display: block;
    float: left;
    height: 26px;
    margin: 4px 4px 4px 0;
    border-radius: 100px;
    padding: 2px;
    box-sizing: border-box;
  }
  .google-btn:hover .idp-btn-img {
    background: #f3f3f3;
  }
  .idp-btn-text {
    text-transform: uppercase;
    font-weight: bold;
    font-size: 0.8rem;
    color: #4885ed;
    line-height: 32px;
    margin-left: 52px;
    margin-right: 16px;
    text-align: center;
  }
  .google-btn:hover .idp-btn-text {
    color: #f3f3f3;
  }
</style>
