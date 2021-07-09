<template>
  <div class="registration-form">
    <form class="form">
      <div class="form-body">
        <div class="form-header">
          <h3 class="form-title">Регистрация</h3>
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
              @input.prevent="field.useMask ? phoneMask(field.id, $event) : ''"
              @blur="blurInput(field.id), field.useMask ? phoneMask(field.id, $event) : ''"
              @focus="focusInput(field.id)"
              :type="field.type ? field.type : 'text'"
              :placeholder="field.placeholder ? field.placeholder : ''"
              :name="field.name">

          </div>
          <span class="form-info error"
            v-if="field.error">
          {{field.errorText}}</span>
        </div>

        <button @click.prevent="submitForm" class="form-button">Зарегистрироваться</button>
        <span class="form-info">
          Уже есть аккаунт?
          <a @click.prevent="$emit('showForm', 'login')" href="#">Войти</a>
        </span>
      </div>
    </form>
  </div>
</template>


<script>

import api from '../api'
import { mapMutations } from 'vuex'

export default {
  name: 'registration-form',

  computed: {
    hasErrors() {
      if (this.fields.filter(field => field.error).length > 0) {
        return true
      }
      return false
    },
    phoneNumber() {
      return this.fields.find(field => field.name == 'phone').value.replace(/[^\d]/g, '');
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
        },
        {
          id:'3',
          title: 'ФИО',
          placeholder: 'Например: Иванов Ивин Иванович',
          name: 'name',
          type: 'text',
          error: false,
          errorText: '',
          active: false,
          value: ''
        },
        {
          id:'4',
          title: 'Учебное заведение',
          placeholder: 'Например: гимназия №20',
          name: 'school',
          type: 'text',
          error: false,
          errorText: '',
          active: false,
          value: ''
        },
        {
          id:'5',
          title: 'Телефон',
          useMask: true,
          placeholder: 'Например: 8 (999) 999-99-99',
          name: 'phone',
          type: 'tel',
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

        if (field.name == 'name') {
          field.error = true;
          if (field.value.search(/[a-zA-Z0-9]/g) != -1) {
            field.errorText = 'ФИО не может содержать английские буквы и цифры'
          } else if (field.value.length < 7) {
            field.errorText = 'ФИО не может быть таким коротким'
          } else if (field.value.split(' ').length != 3) {
            field.errorText = 'Укажите ФИО так, как показанно в примере'
          } else {
            field.error = false;
          }
        }

        if (field.name == 'phone' && this.phoneNumber.length != 11) {
          field.error = true;
          field.errorText = 'Неверно указан номер телефона'
        }

        // пасхалка :)
        if (field.name == 'phone' && this.phoneNumber == '88005553535') {
          field.error = true;
          field.errorText = 'Проще позвонить, чем у кого-то занимать!'
        }

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
          if (field.name == 'phone') {
            formData[field.name] = this.phoneNumber;
          } else {
            formData[field.name] = field.value;
          }
        })

        let response = await api.post('auth/registration', {
          body: formData
        })
        let result = await response.json();

        if (response.ok) {
          this.setToken(result.token);
          this.setAuthStatus(true);
          this.$router.go(0);
        } else {
          for(const key in result) {
            let field = this.fields.find(_field => _field.name == key);
            field.error = true;
            field.errorText = result[key][0];
          }
        }
      }
    },

    phoneMask(id, e) {
      if (e.inputType == 'deleteContentBackward') {
        return 0;
      }

      let $input = e.currentTarget;
      let input = this.fields.find(field => field.id == id);

      let selection = $input.selectionStart;

      let needReSelect = selection < input.value.length;
      let value = input.value.replace(/[^\d]/g, '');

      let result = ''

      if (value[0]) {
        if (value[0] != 8 && value[0] != 7) {
          result += '8';
          value = '8' + value;
        } else {
          value[0] == 8 ? result += '8' : result += '+7';
        }
      }

      if (value.length >= 1) {
        result += ' (' + value.substring(1, 4);
      }
      if (value.length >= 4) {
        result += ') ' + value.substring(4, 7)
      }
      if (value.length >= 7) {
        result += '-' + value.substring(7, 9)
      }
      if (value.length >= 9) {
        result += '-' + value.substring(9, 11)
      }

      input.value = result;

      if (selection > 2 &&  selection < 3) {
        selection = 4
      } else if (selection > 6 &&  selection < 8) {
        selection = 9
      } else if (selection == 12) {
        selection++
      } else if (selection == 15) {
        selection++
      }

      if (needReSelect) {
        setTimeout(function () {
          $input.setSelectionRange(selection, selection)
        }, 0);
      }
    }
  }
}
</script>

<style src="../css/form-style.css" scoped>

</style>
