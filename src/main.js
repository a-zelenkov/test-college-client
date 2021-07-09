import Vue from 'vue'
import App from './App.vue'

import router from './router'
import store from './store'

new Vue({
  render: h => h(App),
  el: '#app',
  router,
  store
})