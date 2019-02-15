import Vue, { PluginObject } from 'vue';
import axios from 'axios';

const config = {
  baseURL: '/api/',
};

const axiosInstance = axios.create(config);

const Plugin: PluginObject<any> = {
  install: vue => {
    vue.$axios = axiosInstance;
  },
};
Plugin.install = vue => {
  vue.$axios = axiosInstance;
  window.axios = axiosInstance;
  Object.defineProperties(vue.prototype, {
    $axios: {
      get() {
        return axiosInstance;
      },
    },
  });
};

Vue.use(Plugin);

export default Plugin;
