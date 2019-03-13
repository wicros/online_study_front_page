import {
  NAV_INDEX,
  SETTINGS_NAV_INDEX,
  UPDATE_USER_INFO,
  USER_ACCESS_TOKEN,
  ORDER_PRODUCT,
  COURSE_TASK_INFO,
  COURSE_STATUS_INFO,
  MINISTRY_INFOS,
  CURRENT_LESSON,
  SESSION_ID,
  REFERER
} from './mutation-types'

import {
  getSessionStorage,
  getLocalStorage
} from '../config/mUtils.js'

export default {
  getNavIndex(state) {
    return getSessionStorage(NAV_INDEX);
  },
  getSettingsNavIndex(state) {
    return getSessionStorage(SETTINGS_NAV_INDEX);
  },
  queryUserInfo(state) {
    return JSON.parse(getSessionStorage(UPDATE_USER_INFO) || getLocalStorage(UPDATE_USER_INFO) || '{}');
  },
  getUserAccessToken(state) {
    return getSessionStorage(USER_ACCESS_TOKEN) || getLocalStorage(USER_ACCESS_TOKEN) || '';
  },
  getOrderProduct(state) {
    return JSON.parse(getSessionStorage(ORDER_PRODUCT) || '{"product":{}}');
  },
  getCourseTaskInfo(state) {
    return JSON.parse(getSessionStorage(COURSE_TASK_INFO) || '{}');
  },
  getCourseStatusInfo(state) {
    return JSON.parse(getSessionStorage(COURSE_STATUS_INFO) || '{}');
  },
  currentLesson(state) {
    return JSON.parse(getSessionStorage(CURRENT_LESSON) || '{"test":{}}')
  },
  getSessionId(state) {
    return getLocalStorage(SESSION_ID) || '';
  },
  getReferer(state) {
    return getLocalStorage(REFERER) || '';
  },
};
