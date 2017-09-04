<template>
  <div class="page">
    <h1 class="no-select" style="margin: 24px;">Settings</h1>
    <div v-if="userIsLocal" class="settings-panel">
      <h2 class="no-select">Create online Account</h2>
      <p class="no-select">
        An online account allows you to snychronize your Decks between multiple devices.
        This allows a better workflow, like editing cards on a computer and then using
        them on your phone. If you don't active an online account, your data will still
        be stored safely on your current device.
      </p>
      <button class="google-btn" style="width: 100%;" @click="signupGoogle()">
        <img src="/static/img/icons/google-g-logo.svg" class="idp-btn-img">
        <div class="idp-btn-text no-select">
          sign in with google
        </div>
      </button>
      <h4 class="no-select">or using your e-mail</h4>
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
      </form>
    </div>
    <div class="settings-panel" v-if="!userIsLocal && isFirebaseEmailUser">
      <h2>Change Password</h2>
      
    </div>
    <div class="settings-panel no-select">
      <h2>Delete Account</h2>
      <p><strong>Warning:</strong> Clicking here deletes all your decks forever.</p>
      <button class="button acc" @click="deleteAccount">delete Account</button>
    </div>
  </div>
</template>
<script>
  import {signInWithGoogle, signUpWithEmail, isFirebaseEmailUser, fbDeleteAcc} from '@/util/firebase'
  import {bindToPage} from '@/util/topbarAdapter'

  export default {
    data () {
      return {
        password: '',
        passwordRetype: '',
        email: '',
        isFirebaseEmailUser: false
      }
    },
    computed: {
      userIsLocal () { return this.$store.state.user.user.isLocal },
      passwordsMatch () { return this.password === this.passwordRetype },
      passwordPatternMatch () { return this.password.length >= 6 }
    },
    mounted () {
      const tD = bindToPage({
        backPressed: this.backPressed
      })
      tD.setItems([])
      tD.setBackEnabled(true)
      this.isFirebaseEmailUser = isFirebaseEmailUser()
    },
    methods: {
      backPressed () {
        this.$router.go(-1)
      },
      signup () {
        if (!this.passwordsMatch || !this.passwordPatternMatch) {
          return
        }
        this.$store.commit('user/setWaitingToMakeOnline', true)
        signUpWithEmail(this.email, this.password)
      },
      signupGoogle () {
        this.$store.commit('user/setWaitingToMakeOnline', true)
        signInWithGoogle()
      },
      deleteAccount () {
        if (this.userIsLocal) {
          window.localStorage.clear()
          this.$store.commit('user/signOut')
        } else {
          fbDeleteAcc()
          .then(() => { window.localStorage.clear() })
          this.$store.commit('user/signOut')
        }
      }
    }
  }
</script>
<style lang="css">
  .settings-panel {
    margin: 0 auto;
    width: 100%;
    max-width: 600px;
    padding: 16px;
    border: none;
    box-shadow: 0 1px 4px rgba(0,0,0,0.3);
    border-radius: 2px;
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
