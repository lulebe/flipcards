import Vue from 'vue'
import Ripple from 'vue-ripple-directive'

import App from './App'
import router from './router'
import store from './state/store'

Vue.config.productionTip = false

Vue.directive('ripple', Ripple)

// ls and version init
localStorage.setItem('version', '1')

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
