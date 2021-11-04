<template>
  <div class="test-select-page">
    <div v-if="errorMessage" class="error-loading-page">
      {{errorMessage}}
    </div>
    <section v-if="!errorMessage" class="tests-section">
      <router-link class="test"
        v-for="test in testsInfo"
        :key="test.id"
        :to="{ name: 'test2', params: {id: test.id}}">
        <h3 class="test-header">{{test.title}}</h3>
        <p>{{test.description}}</p>
      </router-link>
    </section>
  </div>
</template>

<script>
import api from '../api'

export default {
  name: 'test-page',
  data() {
    return {
      testsInfo: [],
      errorMessage: null,
    };
  },

  async created() {
    let response;

    try {
      response = await api.get('questions/tests').then(r => r.json());
      if (response == 'Unauthorized') {
        this.errorMessage = 'Необходимо авторизоваться'
      } else {
        this.testsInfo = response;
      }
    } catch {
      this.errorMessage = 'Не удалось сделать запрос к базе данных.'
    }

  }
}
</script>

<style scoped>
  .test-page {
    color: var(--color-text);
  }

  .tests-section {
    width: 1200px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: repeat(2, minmax(230px, auto));
    padding: 20px;
    grid-gap: 20px;
  }

  .test {
    border: 1px solid;
    display: flex;
    justify-content: center;
    text-decoration: none;
    flex-direction: column;
    color: var(--color-primary);
    border-radius: 4px;
    box-shadow: 0 -1px 3px 1px #919191;
    text-align: center;
    user-select: none;
  }

  .test h3 {
    margin: 0;
    padding: 10px;
    border-bottom: 1px solid;
    text-align: center;
  }

  .test p {
    margin: 0;
    padding: 10px;
    flex-grow: 1;
  }

</style>
