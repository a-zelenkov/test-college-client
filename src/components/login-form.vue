<template>
  <div class="login-form">
    <form class="form">
      <div class="form-body">
        <div class="form-header">
          <h3 class="form-title">Вход</h3>
          <span @click="$emit('close')" class="form-close">&#10006;</span>
        </div>

        <div class="field-wrapper"
          v-for="field in fields"
          :key="field.id">

          <div class="form-field"
            @mousedown="clickInputField"
            :class="{'error': field.error, 'active': field.active}">

            <span>{{field.title}}</span>

            <input class="form-input" ref = "input"
              v-model.trim="field.value"
              @blur="blurInput(field.id)"
              @focus="focusInput(field.id)"
              :type="field.type ? field.type : 'text'"
              :placeholder="field.placeholder ? field.placeholder : ''"
              :name="field.name">
          </div>
          <span class="form-info error"
            v-if="field.error">
          {{field.errorText}}</span>
        </div>

        <button @click.prevent="submitForm" class="form-button">Войти</button>
        <span class="form-info">
          Нет аккаунта?
          <a @click.prevent="$emit('showForm', 'registration')" href="#">Зарегистрироваться</a>
        </span>
      </div>
    </form>
  </div>
</template>


<script>

import api from '../api'
import { mapMutations } from 'vuex'

export default {
  name: 'login-form',

  computed: {
    hasErrors() {
      if (this.fields.filter(field => field.error).length > 0) {
        return true
      }
      return false
    }
  },

  data() {
    return {
      fields: [
        {
          id:'1',
          title: 'Логин',
          placeholder: 'Введите логин',
          name: 'login',
          type: 'text',
          error: false,
          errorText: '',
          active: false,
          value: ''
        },
        {
          id:'2',
          title: 'Пароль',
          placeholder: 'Введите пароль',
          name: 'password',
          type: 'password',
          error: false,
          errorText: '',
          active: false,
          value: ''
        }
      ],
    };
  },

  methods: {
    ...mapMutations({
      setToken: 'SET_TOKEN',
      setAuthStatus: 'SET_AUTHORIZED'
    }),

    clickInputField(e) {
      let $target = e.currentTarget;
      let $input = $target.querySelector('.form-input');
      $input.focus();
      $input.setSelectionRange($input.value.length, $input.value.length);
      if (e.target !== $input) {
        e.preventDefault();
      }
    },
    focusInput(id) {
      this.fields.find(field => field.id == id).active = true;
      this.fields.find(field => field.id == id).error = false;
    },
    blurInput(id) {
      this.fields.find(field => field.id == id).active = false;
    },

    validateForm() {
      this.fields.forEach((field) => {
        field.error = false;
        field.errorText = ''

        if (field.value == '') {
          field.error = true;
          field.errorText = 'Это обязательное поле'
        }
      });
    },

    async submitForm() {
      this.validateForm();
      if (!this.hasErrors) {
        let formData = {}
        this.fields.forEach((field) => {
            formData[field.name] = field.value;
        })

        let response = await api.post('auth/login', {
          body: formData
        })
        let result = await response.json();

        if (response.ok) {
          this.setToken(result.token);
          this.setAuthStatus(true);
          localStorage.setItem('token', result.token);
          this.$router.go(0);
        } else {
          for(const key in result) {
            let field = this.fields.find(_field => _field.name == key);
            if (field.name == 'password') {
              field.value = ''
            }
            field.error = true;
            field.errorText = result[key][0];
          }
        }
      }
    },
  }
}
</script>

<style scoped>
  @import url('../css/form-style.css');
  .form {
    width: 320px;
  }
</style>
