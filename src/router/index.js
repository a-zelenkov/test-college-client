import Vue from 'vue';
import VueRouter from 'vue-router';
Vue.use(VueRouter);

// pages
import MainPage from '../pages/MainPage';
import TestPage from '../pages/TestPage';

import TestSelectPage from '../pages/TestSelectPage';

// import AddQuestionPage from '../pages/AddQuestionPage';
import ProfilePage from '../pages/ProfilePage';
import NotFound from '../pages/NotFound';

export default new VueRouter({
  mode: 'history',
  routes: [
    {
      path: '/college',
      name: 'main',
      component: MainPage
    },
    {
      path: '/college/test',
      name: 'test',
      component: TestSelectPage
    },
    {
      name: 'test2',
      path: '/college/test/:id',
      component: TestPage
    },
    // {
    //   path: '/college/add_question',
    //   name: 'add_question',
    //   component: AddQuestionPage
    // },
    {
      path: '/college/me',
      name: 'profile',
      component: ProfilePage
    },
    {
      path: '/college/*',
      component: NotFound
    }
  ]
});
