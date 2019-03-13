import http from '../http.js'
import store from '../../store'
import {baseURL} from '../../config/env.js'

export const updateAnalytics = (path, category, action, label, value) => sendEvent(path, category, action, label, value);

function find_referer () {
  let referer = '';
  if (store.state.referer === '') {
    referer = '';
  } else if (store.state.referer.startsWith('http')) {
    referer = store.state.referer
  } else {
    referer = baseURL + "/#" + store.state.referer;
  }

  return referer;
}

export const sendPageview = function (path, via) {
  http('/api/v1/analytics_logs', 'post', {
    hit_type: 'pageview',
    path,
    category: '',
    activity: '',
    label: '',
    value: '',
    via : via
  }, {'X-Referer': find_referer()});
};

export const sendEvent = function (path, category, action, label, value) {
  http('/api/v1/analytics_logs', 'post', {
    hit_type: 'event',
    path: "/#" + path,
    category,
    action,
    label,
    value
  }, {'X-Referer': find_referer()});
};
