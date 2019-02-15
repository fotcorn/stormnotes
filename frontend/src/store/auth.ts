import { isJWTValid } from '@/api';

export default {
  namespaced: true,
  state: {
    accessToken: null,
    refreshToken: null,
  },
  getters: {
    accessTokenValid(state) {
      return isJWTValid(state.accessToken);
    },
    refreshTokenValid(state) {
      return isJWTValid(state.refreshToken);
    },
  },
  actions: {
    login({ commit }, data) {
      commit('loginMutation', data);
    },
  },
  mutations: {
    loginMutation(state, { accessToken, refreshToken }) {
      state.accessToken = accessToken;
      state.refreshToken = refreshToken;
    },
  },
};
