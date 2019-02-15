import axios from 'axios';
import { Message } from 'element-ui';
import jwtDecode from 'jwt-decode';
import endsWith from 'lodash.endswith';

import store from '@/store';
import router from '@/router';

const LOGIN_URL = 'token/';
const REFRESH_URL = 'token/refresh/';

const http = axios.create({
  baseURL: '/api/',
});

export async function login(username: string, password: string) {
  let response = null;
  try {
    response = await http.post('token/', {
      username,
      password,
    });
  } catch (error) {
    if (error.response.status === 400) {
      // user/password is wrong
      return false;
    } else {
      // some other error (e.g. 500) occurred
      throw new Error('Login request error');
    }
  }
  await store.dispatch('auth/login', {
    accessToken: response.data.access,
    refreshToken: response.data.refresh,
  });
  return true;
}

export async function refreshToken() {
  let response = null;
  try {
    response = await http.post(REFRESH_URL, {
      refresh: store.state.auth.refreshToken,
    });
  } catch (error) {
    if (error.response.status === 401) {
      // refresh token is not valid
      return false;
    } else {
      // some other error (e.g. 500) occurred
      throw new Error('Refresh token request error');
    }
  }
  await store.dispatch('auth/login', {
    accessToken: response.data.access,
    refreshToken: response.data.refresh,
  });
  return true;
}

export function isJWTValid(token) {
  if (!token) {
    return false;
  }

  let data = null;
  try {
    data = jwtDecode(token);
    const tokenDate = new Date(data.exp * 1000);
    const now = new Date();
    return tokenDate > now;
  } catch (e) {
    return false;
  }
}

const LOGIN_ERROR_MESSAGE = 'login';

export function handleAPIError(error) {
  // do not show error message when error comes from a redirect to login
  if (error.message && error.message === LOGIN_ERROR_MESSAGE) {
    return;
  }
  Message.error('An error has occurred, please try again later');
}

const tryTokensRefresh = async () => {
  if (store.getters['auth/refreshTokenValid']) {
    let success = null;
    try {
      success = await refreshToken();
    } catch (e) {
      // some kind of server error occurred, cancel the request
      throw new axios.Cancel('Token refresh error');
    }
    if (!success) {
      // refreshing failed (probably because it is expired), user has to login again
      router.push({ name: 'Login' });
      throw new axios.Cancel(LOGIN_ERROR_MESSAGE);
    }
  } else {
    // refresh token is expired, user has to login again
    router.push({ name: 'Login' });
    throw new axios.Cancel(LOGIN_ERROR_MESSAGE);
  }
};

// interceptor to handle case when access token is no longer valid
http.interceptors.request.use(
  async config => {
    // login/refresh urls do not require valid tokens
    if (config.url === LOGIN_URL || config.url === REFRESH_URL) {
      return config;
    }

    // if access token is no longer valid (expired), try to refresh it with the refresh token
    if (!store.getters['auth/accessTokenValid']) {
      await tryTokensRefresh();
      // if the refresh is successful, the store now has a valid access token and we can use it to do the request
      // if not, the user will be redirected to the login view
    }
    config.headers.Authorization = 'Bearer ' + store.state.auth.accessToken;
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// interceptor to handle case when we considered the access token still valid
// but the server disagrees and sends back a 401 error
http.interceptors.response.use(
  config => {
    return config;
  },
  async error => {
    if (
      !error.config ||
      endsWith(error.config.url, LOGIN_URL) ||
      endsWith(error.config.url, REFRESH_URL) ||
      !error.response ||
      error.response.status !== 401
    ) {
      return Promise.reject(error);
    }

    // if response code is something else than token invalid (e.g. user was deleted/set inactive), go to login
    if (error.response.data.code !== 'token_not_valid') {
      router.push({ name: 'Login' });
      throw new axios.Cancel(LOGIN_ERROR_MESSAGE);
    }

    await tryTokensRefresh();
    // if successful, the store now has a valid access token and we can retry to request with it
    // if not, the user has been redirected to the login view

    return http.request(error.config);
  }
);

export default http;
