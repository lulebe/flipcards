<template>
  <div>
    <Topbar></Topbar>
    <fieldset class="signin-form">
      <legend>Sign in</legend>
      <button class="google-btn" style="width: 100%;" @click="signinGoogle()">
        <img src="/static/img/icons/google-g-logo.svg" class="idp-btn-img">
        <div class="idp-btn-text">
          sign in with google
        </div>
      </button>
      <h4>or using your e-mail</h4>
      <form @submit.prevent="signin">
        <label for="signin-email">E-Mail</label><br>
        <input type="email" v-model="email" class="full-width" id="signin-email" placeholder="tom@aol.com" required /><br>
        <label for="signin-pw">Password</label><br>
        <input type="password" v-model="password" class="full-width" id="signin-pw" placeholder="**************" required /><br>
        <button type="submit" class="button acc" style="width: 100%">Sign in</button>
        <br><br>
        Have no account? <a href="#/signup">Sign up</a>
      </form>
    </fieldset>
  </div>
</template>

<script>
  import {signInWithGoogle, signInWithEmail} from '@/util/firebase'
  
  import cTopbar from '@/components/Topbar'

  export default {
    components: {
      'Topbar': cTopbar
    },
    data () {
      return {
        password: '',
        email: ''
      }
    },
    methods: {
      signin () {
        signInWithEmail(this.email, this.password)
      },
      signinGoogle () {
        signInWithGoogle()
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
