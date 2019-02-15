import Vue from 'vue';
import Vuex from 'vuex';
import auth from './auth';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    auth,
  },
  plugins: [
    createPersistedState({
      paths: ['auth.accessToken', 'auth.refreshToken'],
    }),
  ],
});
