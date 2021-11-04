<template>
  <div class="test-page">
    <div v-if="errorMessage && !loading" class="error-loading-page">
      {{errorMessage}}
    </div>
    <section v-if="!errorMessage && !showResult && !loading" class="questions-section">
      <div class="test-nav-wrapper">
        <h2>Навигация</h2>
        <div class="test-nav">
          <span
          v-for="question,i in questionsInfo"
          :key="question.id"
          @click="toQuestion(i+1)"
          :class="{active: question.answers.find(x => x.isSelected) != null, selected: currentQuestion == i+1}">
            {{i+1}}
          </span>
        </div>
      </div>
      <div class="questions">
        <span class="question-number">{{currentQuestion}}/{{questionsInfo.length}}</span>
        <div class="question"
          v-for="question,i in questionsInfo"
          :key="question.id"
          v-show="currentQuestion == i+1">
          <h3 class="question-header">{{question.question.value}}</h3>
          <div class="answers">
            <div class="answer"
              @click="select(question.id, answer.id)"
              :class="{active: answer.isSelected}"
              v-for="answer in question.answers"
              :key="answer.id">
              {{answer.value}}
            </div>
          </div>
          <div class="controllers">
            <button @click="currentQuestion > 1 ? currentQuestion-- : currentQuestion"
              :disabled="currentQuestion <= 1"
              class="button">
              Предыдущий вопрос
            </button>
            <button @click="currentQuestion < questionsInfo.length ? currentQuestion++ : currentQuestion"
              :disabled="currentQuestion == questionsInfo.length"
              class="button">
              Следующий вопрос
            </button>
          </div>
          <div class="controllers">
            <button @click="sendAnswers"
            v-if="currentQuestion == questionsInfo.length || answers.length == questionsInfo.length"
            :disabled="answers.length < questionsInfo.length"
            class="button">Завершить тест</button>
          </div>
        </div>
      </div>
    </section>
    <div v-if="showResult" class="test-result">
      <h2>Результат тестирования: </h2>
      <p>Вы ответили на {{testResult.answersCount}} из {{testResult.questionsCount}} вопросов.</p>
      <div v-if="testResult.type == 'score'">
        <div>
          <span class="param">Ваш результат:</span>
          <span class="info">{{testResult.score}} баллов.</span>
        </div>
        <div class="result-description">
          <div class="description-item"
          v-show="testResult.score >= 49">
            <h3>От 49 до 60 баллов</h3>
            <div class="description-content">
              <span>Высокий интерес к знаковым системам.</span>
              <span>Вы могли бы найти себя в профессиях или специальностях, связанных с:</span>
              <span>- программированием;</span>
              <span>- экономикой;</span>
              <span>- бухгалтерией;</span>
              <span>- страховым делом.</span>
            </div>
          </div>
          <div class="description-item"
          v-show="testResult.score >= 37 && testResult.score <= 48">
            <h3>От 37 до 48 баллов</h3>
            <div class="description-content">
              <span>Вы показали повышенный интерес к знаковым системам.</span>
              <span>Вы могли бы найти себя в профессиях или специальностях, связанных с:</span>
              <span>- программированием;</span>
              <span>- техническим обслуживанием и ремонтом двигателей;</span>
              <span>- экономикой;</span>
              <span>- бухгалтерией;</span>
              <span>- гостиничным делом;</span>
              <span>- страховым делом.</span>
            </div>
          </div>
          <div class="description-item"
          v-show="testResult.score >= 25 && testResult.score <= 36">
            <h3>От 25 до 36 баллов</h3>
            <div class="description-content">
              <span>Вы показали некоторый интерес к знаковым системам.</span>
              <span>Вы могли бы найти себя в профессиях или специальностях, связанных с:</span>
              <span>- техническим обслуживанием и ремонтом двигателей;</span>
              <span>- экономикой;</span>
              <span>- бухгалтерией;</span>
              <span>- гостиничным делом.</span>
            </div>
          </div>
          <div class="description-item"
          v-show="testResult.score >= 13 && testResult.score <= 24">
            <h3>От 13 до 24 баллов</h3>
            <div class="description-content">
              <span>Вы показали некоторый интерес к знаковым системам.</span>
              <span>Вы могли бы найти себя в профессиях или специальностях, связанных с:</span>
              <span>- искусством;</span>
              <span>- рекламой;</span>
              <span>- дизайном;</span>
              <span>- психологией.</span>
            </div>
          </div>
          <div class="description-item"
          v-show="testResult.score <= 12">
            <h3>От 0 до 12 баллов</h3>
            <div class="description-content">
              <span>Вы показали некоторый интерес к знаковым системам.</span>
              <span>Рекомендуем вам развивать в себе волевые качества, умение планировать, дисциплинированность.</span>
            </div>
          </div>
        </div>
      </div>
      <div v-if="testResult.type == 'select'">
        <div>
          <span class="param">Наиболее подходящая специальность:</span>
          <span class="info" v-if="testResult.mostPopular == 0">Не определена.</span>
          <span class="info" v-if="testResult.mostPopular == 1">Техническое обслуживание и ремонт двигателей, систем и агрегатов автомобилей.</span>
          <span class="info" v-if="testResult.mostPopular == 2">Информационные системы и программирование.</span>
          <span class="info" v-if="testResult.mostPopular == 3">Экономика и бухгалтерский учет.</span>
          <span class="info" v-if="testResult.mostPopular == 4">Страховое дело.</span>
          <span class="info" v-if="testResult.mostPopular == 5">Гостиничное дело.</span>
          <span class="info" v-if="testResult.mostPopular == 6">Контролер банка.</span>
        </div>
      </div>
      <div v-if="testResult.type == 'graph'">
        <div class="result-description">
          <div class="description-item">
            <span class="param">Образование:</span>
            <span class="info">{{ testResult.info.educationType }}</span>
          </div>
          <div class="description-item">
            <span class="param">Место обучения:</span>
            <span class="info">{{ testResult.info.educationPlace }}</span>
          </div>
          <div class="description-item">
            <span class="param">Техническое обслуживание и ремонт двигателей, систем и агрегатов автомобилей: {{testResult.info.graph1}}%</span>
            <div class="graph">
              <div class="graph-line" :style="{width: `${testResult.info.graph1}%`}">
              </div>
            </div>
          </div>
          <div class="description-item">
            <span class="param">Информационные системы и программирование: {{testResult.info.graph2}}%</span>
            <div class="graph">
              <div class="graph-line" :style="{width: `${testResult.info.graph2}%`}">
              </div>
            </div>
          </div>
          <div class="description-item">
            <span class="param">Экономика и бухгалтерский учет: {{testResult.info.graph3}}%</span>
            <div class="graph">
              <div class="graph-line" :style="{width: `${testResult.info.graph3}%`}">
              </div>
            </div>
          </div>
          <div class="description-item">
            <span class="param">Страховое дело: {{testResult.info.graph4}}%</span>
            <div class="graph">
              <div class="graph-line" :style="{width: `${testResult.info.graph4}%`}">
              </div>
            </div>
          </div>
          <div class="description-item">
            <span class="param">Гостиничное дело: {{testResult.info.graph5}}%</span>
            <div class="graph">
              <div class="graph-line" :style="{width: `${testResult.info.graph5}%`}">
              </div>
            </div>
          </div>
          <div class="description-item">
            <span class="param">Контролер банка: {{testResult.info.graph6}}%</span>
            <div class="graph">
              <div class="graph-line" :style="{width: `${testResult.info.graph6}%`}">
              </div>
            </div>
          </div>
        </div>
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
      loading : true,
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
      response = await api.get(`questions?test_id=${this.$route.params.id}`).then(r => r.json());
      if (response == 'Unauthorized') {
        this.errorMessage = 'Необходимо авторизоваться'
      } else if (response && response.score != null) {
        this.testResult = response;
        this.showResult = true;
        console.log(this.testResult);
      } else {
        this.questionsInfo = response;
      }
    } catch {
      this.errorMessage = 'Не удалось сделать запрос к базе данных.';
    }
    this.loading = false;

  },

  computed: {
    answers() {
      let a = []
      this.questionsInfo.forEach((question) => {
        question.answers.forEach((answer) => {
          if (answer.isSelected) {
            a.push({id: answer.id})
          }
        });
      });
      return a
    }
  },


  methods: {
    toQuestion(questionId) {
      this.currentQuestion = questionId
    },

    select(questionId, answerId) {

      let question = this.questionsInfo.find(x => x.id == questionId);
      let selectedAnswer = question.answers.find(x => x.isSelected == true);
      selectedAnswer ? selectedAnswer.isSelected = false : null;
      question.answers.find(x => x.id == answerId).isSelected = true;
    },
    async sendAnswers() {
      let info = {
        testId: this.$route.params.id,
        questionsCount: this.questionsInfo.length,
        answers: []
      }
      let response;

      this.questionsInfo.forEach((question) => {
        question.answers.forEach((answer) => {
          if (answer.isSelected) {
            info.answers.push({id: answer.id})
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
  .graph {
    width: 400px;
    height: 40px;
    border: 1px solid;
  }

  .graph-line {
    height: 40px;
    background-color: var(--color-primary);
  }

  .test-page {
    color: var(--color-text);
  }

  .test-nav-wrapper {
    margin-top: 120px;
    margin-left: -360px;
    margin-right: 60px;
  }

  .test-nav {
    display: flex;
    flex-wrap: wrap;
    width: 300px;
  }

  .test-nav span{
    margin: 4px;
    flex-basis: 30px;
    border: 1px solid;
    display: flex;
    justify-content: center;
    padding: 4px;
    cursor: pointer;
    user-select: none;
  }

  .test-nav span.active{
    background-color: var(--color-primary);
    color: var(--color-secondary);
  }

  .test-nav span.selected{
    outline: 3px solid var(--color-primary);
  }

  .test-result {
    width: 80%;
    margin: 0 auto;
    font-size: 24px;
  }

  .description-item {
    margin: 10px;
  }

  .description-content {
    display: flex;
    flex-direction: column;
  }

  .description-content span{
    margin: 10px 0;
  }

  .param {
    opacity: .7;
  }

  .info {
    margin-left: 15px;
  }

  .questions-section {
    margin: 40px;
    font-size: 20px;
    display: flex;
    justify-content: center;
  }

  .questions {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    position: relative;
  }

  .question-number {
    position: absolute;
    left: 0;
    top: -20px;
  }

  .question {
    width: 800px;
  }

  .question-header {
    margin: 0;
    min-height: 120px;
    display: flex;
    align-items: center;
    justify-content: center;
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
    width: 45%;
  }

</style>
