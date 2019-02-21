import Vue from 'vue';
import Router from 'vue-router';
import Page from './views/Page.vue';
import Login from './views/Login.vue';

Vue.use(Router);

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      redirect: '/wiki/index',
    },
    {
      path: '/wiki/:page(.+)',
      name: 'page',
      component: Page,
    },
    {
      path: '/login',
      name: 'Login',
      component: Login,
    },
  ],
});
