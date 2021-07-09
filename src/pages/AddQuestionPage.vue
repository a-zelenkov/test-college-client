<template>
  <div class="add-question-page">
    <main>
      <section class="input-section">
        <div class="input-wrapper">
          <input type="text" name="question" placeholder="Вопрос"
            v-model.trim="questionBuilder.question.value">
        </div>
        <div class="input-wrapper">
          <input type="text" name="answer" placeholder="Вариант ответа"
            v-model.trim="answer.value">
        </div>
        <div class="input-wrapper">
          <span>Ответ верный: </span>
          <input type="checkbox" name="" value=""
            v-model="answer.isCorrect">
        </div>
        <div class="input-wrapper">
          <button type="button" name="button"
            @click="addAnswer">Добавить ответ</button>
        </div>
      </section>
      <section>
        <div class="question">
          {{questionBuilder.question.value}}
        </div>
        <div class="answers">
          <div v-for="answer,i in questionBuilder.answers" :key="i" :class="{correct: answer.isCorrect}" class="answer">
            {{answer.value}}
            <button @click="deleteAnswer(answer)" type="button" name="button">X</button>
          </div>
        </div>
      </section>
      <button @click="addQuestion" type="button" name="button">Добавить вопрос</button>
    </main>
  </div>
</template>

<script>
import api from '../api'

export default {
  name: 'add-question-page',

  data() {
    return {
      questionBuilder: {
        question: {
          value: ''
        },
        answers: []
      },
      answer: {
        value: '',
        isCorrect: false
      }
    };
  },

  methods: {
    addAnswer() {
      if (this.answer.value == '') {
        return;
      }
      this.questionBuilder.answers.push({ ...this.answer });
      this.answer.value = '';
      this.answer.isCorrect = false;
    },
    async addQuestion() {
      let response;
      try {
        response = await api.post('questions', {
          body: this.questionBuilder
        }).then(r => r.json());
      } catch {
        response = 'Не удалось сделать запрос к базе данных.'
      }
      console.log(response);
    },
    deleteAnswer(answer) {
      let i = this.questionBuilder.answers.findIndex(x => x == answer);
      this.questionBuilder.answers.splice(i, 1);
    }
  }
}
</script>

<style scoped>
  main {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 30px;
  }

  .input-section {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .input-wrapper {
    width: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .input-section input[type="text"] {
    width: 100%;
    height: 40px;
    margin: 10px 0;
  }

  .input-section input[type="checkbox"] {
    width: 20px;
    height: 50px;
  }

  section {
    width: 40%;
  }

  .question {
    text-align: center;
    text-transform: uppercase;
    font-size: 26px;
    font-weight: 500;
    margin: 160px 0 20px;
  }

  .answer {
    border: 1px solid #000;
    display: flex;
    justify-content: space-between;
    padding: 5px;
    margin: 10px;
  }

  .correct {
    background-color: #afa;
    border: 5px solid #0f0;
  }

</style>
