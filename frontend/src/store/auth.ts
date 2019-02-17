import { isJWTValid } from '@/api';

export default {
  namespaced: true,
  state: {
    accessToken: null,
    refreshToken: null,
  },
  getters: {
    accessTokenValid(state: any) {
      return isJWTValid(state.accessToken);
    },
    refreshTokenValid(state: any) {
      return isJWTValid(state.refreshToken);
    },
  },
  actions: {
    login({ commit }: { commit: any }, data: any) {
      commit('loginMutation', data);
    },
  },
  mutations: {
    loginMutation(
      state: any,
      {
        accessToken,
        refreshToken,
      }: { accessToken: string; refreshToken: string }
    ) {
      state.accessToken = accessToken;
      state.refreshToken = refreshToken;
    },
  },
};
