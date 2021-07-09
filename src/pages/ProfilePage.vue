<template>
  <div class="profile-page">
    <div v-if="errorMessage" class="error-loading-page">
      {{errorMessage}}
    </div>
    <section v-if="!errorMessage" class="profile-section">
      <h1>Профиль</h1>
      <div class="profile-info">
        <div class="profile-contact">
          <div class="profile-info-block">
            <span>ФИО</span>
            <input type="text" v-model="profileInfo.name">
          </div>
          <div class="profile-info-block">
            <span>Учебное заведение</span>
            <input type="text" v-model="profileInfo.school">
          </div>
          <div class="profile-info-block">
            <span>Телефон</span>
            <input type="text" v-model="profileInfo.phone">
          </div>
        </div>
        <div class="profile-auth">
          <div class="profile-info-block">
            <span>Логин</span>
            <input type="text" v-model="profileInfo.login">
          </div>
          <div class="profile-info-block">
            <span>Пароль</span>
            <input type="password" v-model="profileInfo.password">
            <span class="password-info">* Пароль не будет отображаться, но вы можете его изменить.</span>
          </div>
        </div>
      </div>
      <button class="button" @click="updateInfo">Сохранить изменения</button>
    </section>
  </div>
</template>

<script>
import api from '../api'

export default {
  name: 'profile-page',

  data() {
    return {
      errorMessage: null,
      profileInfo: {}
    };
  },

  async created() {
    await this.getUserInfo();
  },

  methods: {
    async getUserInfo() {
      let response;

      try {
        response = await api.get('auth/me').then(r => r.json());
      } catch {
        this.errorMessage = 'Не удалось сделать запрос к базе данных.';
      }

      if (response == 'Unauthorized') {
        this.errorMessage = 'Необходимо авторизоваться';
      } else {
        this.profileInfo = response;
        if (this.profileInfo) {
          this.profileInfo.password = '';
        }
      }
    },

    async updateInfo() {
      let response;

      try {
        response = await api.post('auth/me', {
          body: this.profileInfo
        }).then(r => r.json());
      } catch {
        this.errorMessage = 'Не удалось сделать запрос к базе данных.';
      }

      if (response == 'Unauthorized') {
        this.errorMessage = 'Необходимо авторизоваться';
      }
      await this.getUserInfo();
    }
  }
}
</script>

<style scoped>
  .profile-page {
    color: var(--color-text);
  }

  .profile-section {
    width: 80%;
    margin: 0 auto;
    font-size: 26px;
  }

  .profile-info {
    display: flex;
    justify-content: space-between;
    width: 40%;
  }

  .profile-info-block {
    margin-right: 20px;
    display: flex;
    max-width: 400px;
    flex-direction: column;
  }

  .profile-info-block input{
    margin: 10px 0 30px;
    max-height: 60px;
    padding: 5px 10px;
    border-radius: 10px;
    font-size: 20px;
    box-shadow: var(--shadow-style) var(--color-shadow);
    outline: none;
  }

  .profile-info-block input:hover, .profile-info-block input:focus {
   box-shadow: var(--shadow-style-hover) var(--color-shadow);
 }

  .password-info {
    font-size: 14px;
    max-width: 200px;
    margin-top: -20px;
    font-style: italic;
  }

</style>
