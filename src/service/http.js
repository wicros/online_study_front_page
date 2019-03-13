import axios from 'axios'
import {baseURL, appToken} from '../config/env.js'
import store from '../store'
import {
  LOADING,
  CLEAR_USER_INFO,
  SESSION_ID
} from '../store/mutation-types.js'
import Vue from 'vue'
import {sha256} from "js-sha256";

axios.interceptors.request.use(config => {
  if (!config.url.endsWith('analytics_logs')) {
    store.commit(LOADING, true);
  }

  if (store.state.userAccessToken) {
    config.headers["Authorization"] = store.state.userAccessToken;
  }

  if (!store.state.sessionId) {
    let hash = sha256.create();
    hash.update('' + Date.now() + Math.random());
    store.commit(SESSION_ID, hash.hex());
  }
  config.headers["X-Session-Id"] = store.state.sessionId;

  return config
}, error => {
  return Promise.reject(error)
});


axios.interceptors.response.use(response => {
  return response
}, error => {
  store.commit(LOADING, false);
  return Promise.reject(error)
});

function errorState(err) {
  let message = "" + err;

  if (err.response) {
    if (err.response.data && err.response.data.error) {
      message = err.response.data.error;
    }

    if (err.response.status === 401) {
      store.state.signInDialogVisible = true;
      store.state.signUpDialogVisible = false;
      store.state.userTermDialogVisible = false;
      store.commit(CLEAR_USER_INFO)
    }
  }

  store.commit(LOADING, false);
  Vue.prototype.$message.error(message);

  return err
}

function successState(res) {
  store.commit(LOADING, false);
  return res;
}

const httpServer = function (url, method, data, config) {

  if (typeof url !== 'string') {
    throw new Error('url is not string!')
  }

  if (arguments.length === 1) {
    method = 'get';
  }

  if (arguments.length >= 2 && typeof arguments[1] !== 'string') {
    method = 'get';
    data = arguments[1];
    config = arguments[2];
  }

  let publicParams = {};

  let headers = {"X-App-Token": appToken};

  if (config && config["X-Referer"]) {
    headers["X-Referer"] = config["X-Referer"];
  }
  if (typeof headers["X-Referer"] === "undefined") {
    headers["X-Referer"] = baseURL + "/#" + store.state.referer;
  }

  let httpDefaultOpts = {
    method,
    baseURL,
    url,
    timeout: 10000,
    params: Object.assign(publicParams, data),
    data: Object.assign(publicParams, data),
    headers: headers
  };

  if (method === 'get') {
    delete httpDefaultOpts.data;
  } else {
    delete httpDefaultOpts.params;
  }

  httpDefaultOpts.headers = Object.assign(httpDefaultOpts.headers, config);

  return new Promise(function (resolve, reject) {
    axios(httpDefaultOpts)
      .then(res => {
        if (res.status === 200) {
          resolve(res);
          successState(res);
        } else {
          reject(res);
          errorState(res);
        }
      })
      .catch(err => {
        reject(err);
        errorState(err);
      })
  });
};

export default httpServer