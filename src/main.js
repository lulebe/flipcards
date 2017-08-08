import Vue from 'vue'

import App from './App'
import router from './router'
import store from './state/store'

Vue.config.productionTip = false

// ls and version init
localStorage.setItem('version', '1')

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
