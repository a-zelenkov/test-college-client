<template>
  <header>
    <a href="https://www.sssu.ru/Default.aspx?tabid=671" class="header-logo" target="_blank">
      <img src="http://xn--80acdlojyj9a.xn--p1ai/kes/img/logo.png" alt="">
      <div class="logo-text">
        <span>Колледж экономики</span>
        <span>и сервиса</span>
        <a href="https://www.sssu.ru/Default.aspx" class="logo-isoip" target="_blank">ИСОиП (филиала) ДГТУ в г. Шахты</a>
      </div>
    </a>
    <div class="header-pages">
      <router-link :to="{ name: 'main'}">Главная</router-link>
      <router-link :to="{ name: 'test'}">Тестирование</router-link>
      <router-link :to="{ name: 'profile'}">Профиль</router-link>
      <a v-if="isAuthorized" @click.prevent="logOut()" href="#">Выйти</a>
      <a v-else @click.prevent="goToAuth()" href="#">Войти</a>
    </div>
    <section class="auth">
      <registration-form
        v-if="currentForm == 'registration' && !isAuthorized"
        @close="showForm('')"
        @showForm="showForm"/>

      <login-form
        v-if="currentForm == 'login' && !isAuthorized"
        @close="showForm('')"
        @showForm="showForm"/>
    </section>
  </header>
</template>

<script>

import api from '../api'
import { mapMutations, mapGetters } from 'vuex'

import registrationForm from '../components/registration-form'
import loginForm from '../components/login-form'

export default {
  name: 'main-header',

  methods: {
    ...mapMutations({
      setToken: 'SET_TOKEN',
      showForm: 'SET_CURRENT_FORM',
      setAuthStatus: 'SET_AUTHORIZED'
    }),

    logOut() {
      localStorage.removeItem('token');
      api.get('auth/logout');
      this.setToken('');
      this.setAuthStatus(false);
      if (this.$route.name !== 'main') {
        this.$router.push({ name: "main"});
      }
    },

    goToAuth() {
      this.showForm('login');
    }
  },

  computed: {
    ...mapGetters({currentForm : 'getCurrentForm', isAuthorized: 'isAuthorized'})
  },

  components: {
    registrationForm,
    loginForm
  }
}
</script>

<style scoped>
  header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: var(--color-secondary);
    padding: 20px 8% 20px 5%;
    background: linear-gradient(117deg, #10235eee, var(--color-primary))
  }

  .auth {
    position: absolute;
    top: 210px;
    right: 8%;
    width: 30%;
    display: flex;
    justify-content: flex-end;
    z-index: 100;
  }

  .header-logo {
    display: flex;
    align-items: center;
    color: inherit;
    cursor: pointer;
    text-decoration: none;
  }

  .header-logo img{
    width: 130px;
    height: 130px;
  }

  .logo-text {
    display: flex;
    flex-direction: column;
    margin-left: 15px;
    font-size: 40px;
    font-weight: 600;
    line-height: 0.9em;
    letter-spacing: 0.04em;
    user-select: none;
  }

  .logo-isoip {
    color: #fff;
    font-size: 16px;
    font-weight: 100;
    font-style: italic;
    opacity: .8;
  }

  .logo-isoip:hover {
    opacity: 1;
    text-decoration: none;
  }

  .header-pages {
    display: flex;
    justify-content: space-around;
  }

  .header-pages a{
    font-size: 20px;
    text-decoration: none;
    padding: 5px 20px;
    border-radius: 6px;

    color: var(--color-secondary);
    transition: all .2s linear;
  }

  .router-link-exact-active{
    background-color: var(--color-secondary)!important;
    color: var(--color-primary)!important;
  }

  .header-pages a:hover{
    background-color: var(--color-shadow);
    color: var(--color-primary);
  }

</style>
