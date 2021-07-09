import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    currentForm: 'registration',
    token: '',
    isAuthorized: false
  },
  getters: {
    getCurrentForm(state) {
      return state.currentForm
    },
    getToken(state) {
      return state.token
    },
    isAuthorized(state) {
      return state.isAuthorized
    }
  },
  mutations: {
    SET_CURRENT_FORM(state, payload) {
      state.currentForm = payload
    },
    SET_TOKEN(state, payload) {
      state.token = payload
    },
    SET_AUTHORIZED(state, payload) {
      state.isAuthorized = payload
    }
  },
  actions: {

  }
})
