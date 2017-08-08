<template>
  <div>
    <Topbar></Topbar>
    <fieldset class="signup-form">
      <legend>Sign up</legend>
      <button class="google-btn" style="width: 100%;" @click="signupGoogle()">
        <img src="/static/img/icons/google-g-logo.svg" class="idp-btn-img">
        <div class="idp-btn-text">
          sign in with google
        </div>
      </button>
      <h4>or using your e-mail</h4>
      <form @submit.prevent="signup()">
        <label for="signup-email">E-Mail</label><br>
        <input type="email" v-model="email" class="full-width" id="signup-email" placeholder="tom@aol.com" required /><br>
        <div class="input-group full-width" :class="{invalid: !passwordPatternMatch}">
          <label for="signup-pw">Password</label>
          <input type="password" v-model="password" class="full-width" id="signup-pw2" pattern=".{6,}" placeholder="**************" required />
          <div class="error">Passwords should have at least 6 characters.</div>
        </div>
        <div class="input-group full-width" :class="{invalid: !passwordsMatch}">
          <label for="signup-pw2">Repeat Password</label>
          <input type="password" v-model="passwordRetype" class="full-width" id="signup-pw2" pattern=".{6,}" placeholder="**************" required />
          <div class="error">Passwords don't match.</div>
        </div>
        <button type="submit" class="button acc" style="width: 100%" :disabled="!passwordsMatch || !passwordPatternMatch">Sign up</button>
        <br><br>
        Have an account already? <a href="#/signin">Sign in</a>
      </form>
    </fieldset>
  </div>
</template>

<script>
  import {signInWithGoogle, signUpWithEmail} from '@/util/firebase'
  
  import cTopbar from '@/components/Topbar'

  export default {
    components: {
      'Topbar': cTopbar
    },
    data () {
      return {
        password: '',
        passwordRetype: '',
        email: ''
      }
    },
    computed: {
      passwordsMatch () { return this.password === this.passwordRetype },
      passwordPatternMatch () { return this.password.length >= 6 }
    },
    methods: {
      signup () {
        if (!this.passwordsMatch || !this.passwordPatternMatch) {
          return
        }
        signUpWithEmail(this.email, this.password)
      },
      signupGoogle () {
        signInWithGoogle()
      }
    }
  }
</script>

<style>
  .signup-form {
    max-width: 500px;
    margin: 0 auto;
    transform: translateY(-20px);
    padding: 68px 16px 16px 16px;
    border: none;
    box-shadow: 0 1px 4px rgba(0,0,0,0.3);
    border-radius: 2px;
  }
  .signup-form > legend {
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
