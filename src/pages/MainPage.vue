<template>
  <div class="main-page">
    <section class="text-main">
      <div>
        <h1>Ждем новых студентов!</h1>
        <p>Колледж экономики и сервиса ИСОиП (филиала) ДГТУ в г. Шахты приглашает выпускников 9, 11 классов на обучение по программам подготовки специалистов среднего звена и квалифицированных рабочих и служащих.</p>
        <p>Прием на обучение ведется за счет бюджетных ассигнованийти и на коммерческой основе. Зачисление абитуриентов проводится без сдачи вступительных экзаменов.</p>
        <div class="images">
          <img class="image image-position-1" src="https://www.sssu.ru/Portals/0/%D0%9A%D0%AD%D0%A1/5.jpg">
          <img class="image image-position-2" src="https://www.sssu.ru/Portals/0/%D0%9A%D0%AD%D0%A1/iPuQmACTcvU.jpg">
          <img class="image image-position-3" src="https://www.sssu.ru/Portals/0/%D0%9A%D0%AD%D0%A1/6.jpg">
        </div>
      </div>
      <div class="text-registration">
        <h1>Узнай своё направление!</h1>
        <p>Пройди небольшое тестирование, чтобы узнать, какая специальность подходит именно тебе!</p>
      </div>
      <button @click.prevent="showForm('registration')" class="button">Зарегистрироваться</button>
    </section>
  </div>
</template>

<script>

import { mapMutations } from 'vuex';

export default {
  name: 'main-page',

  methods: {
    ...mapMutations({
      showForm: 'SET_CURRENT_FORM'
    })
  }
}

</script>

<style scoped>
  .main-page {
    display: flex;
    padding: 30px 8%;
  }

  .text-main {
    width: 70%;
    min-width: 800px;
    color: var(--color-text);
    font-size: 20px;
  }

  .auth {
    width: 30%;
    display: flex;
    justify-content: flex-end;
  }

  .text-main h1{
    margin-top: 0;
  }

  .images {
    position: relative;
    height: 330px;
    user-select: none;
  }

  .image {
    max-width: 400px;
    max-height: 400px;
    position: absolute;
    border-radius: 8px;
    box-shadow: 5px -5px 60px -5px #666;
  }

  .image-position-1 {
    left: -10px;
    top: 20px
  }

  .image-position-2 {
    left: 370px;
    top: 60px;
  }

  .image-position-3 {
    left: 790px;
    top: -30px;
  }



</style>
