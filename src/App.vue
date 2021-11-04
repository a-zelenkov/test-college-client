<template>
  <div id="app">
    <main-header/>
    <router-view></router-view>
  </div>
</template>

<script>
import mainHeader from './components/main-header'
import { mapMutations } from 'vuex'

export default {
  name: 'App',

  created() {
    let token = localStorage.getItem('token');
    if (token !== null) {
      this.setToken(token);
      this.setAuthStatus(true)
    }
  },

  methods: {
    ...mapMutations({
      setToken: 'SET_TOKEN',
      setAuthStatus: 'SET_AUTHORIZED'
    }),
  },

  components: {
    mainHeader
  }
}
</script>

<style src="./css/general.css">

</style>
