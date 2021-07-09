<template>
  <div class="test-page">
    <div v-if="errorMessage" class="error-loading-page">
      {{errorMessage}}
    </div>
    <section v-if="!errorMessage && !showResult" class="questions-section">
      <div class="question"
        v-for="question in questionsInfo"
        :key="question.id"
        v-show="currentQuestion == question.id">
        <h3 class="question-header">{{question.question.value}}</h3>
        <div class="answers">
          <div class="answer"
            @click="select(answer.id)"
            :class="{active: answer.isSelected}"
            v-for="answer in question.answers"
            :key="answer.id">
            {{answer.value}}
          </div>
        </div>
        <div class="controllers">
          <button @click="currentQuestion > 1 ? currentQuestion-- : currentQuestion"
            v-if="currentQuestion > 1"
            type="button"
            class="button">
            Предыдущий вопрос
          </button>
          <button @click="currentQuestion < questionsInfo.length ? currentQuestion++ : currentQuestion"
            v-if="currentQuestion < questionsInfo.length"
            type="button"
            class="button">
            Следующий вопрос
          </button>
          <button @click="sendAnswers" v-if="currentQuestion == questionsInfo.length" type="button" class="button">Завершить тест</button>
        </div>
      </div>
    </section>
    <div v-if="showResult" class="test-result">
      <h2>Результат тестирования: </h2>
      <div>
        <span class="param">Кол-во вопросов:</span>
        <span class="info">{{testResult.questionsCount}}</span>
      </div>
      <div>
        <span class="param">Кол-во ответов:</span>
        <span class="info">{{testResult.answersCount}}</span>
      </div>
      <div>
        <span class="param">Правильных ответов:</span>
        <span class="info">{{testResult.result}}</span>
      </div>
    </div>
  </div>
</template>

<script>
import api from '../api'

export default {
  name: 'test-page',

  data() {
    return {
      currentQuestion: 1,
      questionsInfo: [],
      errorMessage: null,
      showResult: false,
      testResult: {}
    };
  },

  async created() {
    let response;

    try {
      response = await api.get('questions').then(r => r.json());
      if (response == 'Unauthorized') {
        this.errorMessage = 'Необходимо авторизоваться'
      } else if (response && response.result != null) {
        this.testResult = response
        this.showResult = true;
      } else {
        this.questionsInfo = response
      }
    } catch {
      this.errorMessage = 'Не удалось сделать запрос к базе данных.'
    }

  },

  methods: {
    select(id) {
      let question = this.questionsInfo.find(x => x.id == this.currentQuestion);
      let selectedAnswer = question.answers.find(x => x.isSelected == true);
      selectedAnswer ? selectedAnswer.isSelected = false : null;
      question.answers.find(x => x.id == id).isSelected = true;
    },
    async sendAnswers() {
      let info = []
      let response;

      this.questionsInfo.forEach((question) => {
        question.answers.forEach((answer) => {
          if (answer.isSelected) {
            info.push({id: answer.id})
          }
        });
      });

      try {
        response= await api.post('questions/results', {
          body: info
        }).then(r => r.json());
        this.testResult = response;
        this.showResult = true;
        if (response == 'Unauthorized') {
          this.errorMessage = 'Необходимо авторизоваться'
        }
      } catch {
        this.errorMessage = 'Не удалось сделать запрос к базе данных.'
      }
    }
  }
}
</script>

<style scoped>
  .test-page {
    color: var(--color-text);
  }

  .test-result {
    width: 80%;
    margin: 0 auto;
    font-size: 26px;
  }

  .test-result div{
    margin: 10px;
  }

  .param{
    opacity: .7;
  }

  .info{
    margin-left: 15px;
  }

  .questions-section {
    margin: 40px;
    font-size: 26px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
  }

  .question {
    width: 40%;
  }

  .question-header {
    /* text-transform: uppercase; */
    text-align: center;
    margin: 0;
  }

  .answers {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    min-height: 440px;
  }

  .answer {
    box-sizing: border-box;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 10px 0;
    cursor: pointer;
    padding: 20px;
    border: 1px solid;
    border-radius: 10px;
    width: 100%;
    box-shadow: var(--shadow-style) var(--color-shadow);
  }

  .answer:hover {
    box-shadow: var(--shadow-style-hover) var(--color-shadow);
  }

  .answer.active {
    background-color: var(--color-primary);
    color: var(--color-secondary);
    box-shadow: none;
    cursor: default;
  }

  .controllers {
    display: flex;
    justify-content: space-between;
  }

  .button {
    padding: 25px;
    width: 45%;
    margin: 15px 0 5px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: var(--color-primary);
    cursor: pointer;
    border-radius: 10px;
    box-shadow: var(--shadow-style) var(--color-shadow);
    font-family: inherit;
    font-size: 20px;
    color: var(--color-text-active);
    border: none;
    outline: none;
    text-decoration: none;
    font-weight: inherit;
  }

  .button:hover, .button:focus {
   box-shadow: var(--shadow-style-active-button) var(--color-shadow);
  }

</style>
