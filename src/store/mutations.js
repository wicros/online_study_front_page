import {
  IS_SMALL_SCREEN,
  NAV_INDEX,
  SETTINGS_NAV_INDEX,
  SAVE_BREADCRUMBS,
  REMOVE_BREADCRUMBS,
  CLEAR_BREADCRUMBS,
  UPDATE_USER_INFO,
  CLEAR_USER_INFO,
  USER_ACCESS_TOKEN,
  ORDER_PRODUCT,
  COURSE_TASK_INFO,
  COURSE_STATUS_INFO,
  LOADING,
  SESSION_ID,
  MINISTRY_INFOS,
  CURRENT_LESSON,
  REFERER
} from "./mutation-types.js"

import {
  isSmallScreen,
  setSessionStorage,
  setLocalStorage,
} from '../config/mUtils.js'

export default {
  [IS_SMALL_SCREEN](state) {
    state.isSmallScreen = isSmallScreen()
  },
  [NAV_INDEX](state, navIndex) {
    state.navIndex = navIndex
    setSessionStorage(NAV_INDEX, navIndex)
  },
  [SETTINGS_NAV_INDEX](state, settingsNavIndex) {
    state.settingsNavIndex = settingsNavIndex
    setSessionStorage(SETTINGS_NAV_INDEX, settingsNavIndex)
  },
  [SAVE_BREADCRUMBS](state, breadcrumb) {
    let breadcrumbIndex = state.breadcrumbs.indexOf(breadcrumb)
    if (breadcrumbIndex === -1) {
      state.breadcrumbs.push(breadcrumb)
    } else {
      state.breadcrumbs.push(state.breadcrumbs[breadcrumbIndex])
      state.breadcrumbs.splice(breadcrumbIndex, 1)
    }
    setSessionStorage(SAVE_BREADCRUMBS, JSON.stringify(state.breadcrumbs) || '[]')
  },
  [REMOVE_BREADCRUMBS](state, breadcrumb) {
    let breadcrumbIndex = state.breadcrumbs.findIndex(item => {
      return item === breadcrumb
    })
    if (breadcrumbIndex !== -1) {
      state.breadcrumbs.splice(breadcrumbIndex, 1)
      setSessionStorage(SAVE_BREADCRUMBS, JSON.stringify(state.breadcrumbs) || '[]')
    }
  },
  [CLEAR_BREADCRUMBS](state) {
    state.breadcrumbs = []
    setSessionStorage(SAVE_BREADCRUMBS, '[]')
  },
  [UPDATE_USER_INFO](state, params = {userInfo: {}, isRemember: true}) {
    state.userInfo = params.userInfo;
    setSessionStorage(UPDATE_USER_INFO, state.userInfo)
    if (params.isRemember) {
      setLocalStorage(UPDATE_USER_INFO, state.userInfo)
    }
  },
  [CLEAR_USER_INFO](state) {
    state.userInfo = {}
    state.userAccessToken = ''
    state.isLogined = false;
    state.orderProduct = {}
    state.courseTaskInfo = {}
    state.courseStatusInfo = {}
    state.ministryInfos = []

    setSessionStorage(USER_ACCESS_TOKEN, state.userAccessToken)
    setLocalStorage(USER_ACCESS_TOKEN, state.userAccessToken)

    setSessionStorage(UPDATE_USER_INFO, state.userInfo)
    setLocalStorage(UPDATE_USER_INFO, state.userInfo)

    setSessionStorage(ORDER_PRODUCT, state.orderProduct)
    setSessionStorage(COURSE_TASK_INFO, state.courseTaskInfo)
    setSessionStorage(COURSE_STATUS_INFO, state.courseStatusInfo)

    setLocalStorage(MINISTRY_INFOS, state.ministryInfos)
  },
  [USER_ACCESS_TOKEN](state, params = {token: '', isRemember: false}) {
    state.userAccessToken = params.token
    state.isLogined = !!params.token;
    if (params.isRemember) {
      setLocalStorage(USER_ACCESS_TOKEN, params.token)
    }
    setSessionStorage(USER_ACCESS_TOKEN, params.token)
  },
  [ORDER_PRODUCT](state, orderProduct) {
    state.orderProduct = orderProduct
    setSessionStorage(ORDER_PRODUCT, orderProduct)
  },
  [COURSE_TASK_INFO](state, courseTaskInfo) {
    state.courseTaskInfo = courseTaskInfo
    setSessionStorage(COURSE_TASK_INFO, state.courseTaskInfo)
  },
  [COURSE_STATUS_INFO](state, courseStatusInfo) {
    state.courseStatusInfo = courseStatusInfo
    setSessionStorage(COURSE_STATUS_INFO, state.courseStatusInfo)
  },
  [LOADING](state, isLoading) {
    state.loading = isLoading
  },
  [CURRENT_LESSON](state, currentLesson) {
    state.currentLesson = currentLesson
    setSessionStorage(CURRENT_LESSON, state.currentLesson)
  },
  [SESSION_ID](state, sessionId) {
    state.sessionId = sessionId
    setLocalStorage(SESSION_ID, state.sessionId)
  },
  [REFERER](state, referer) {
    state.referer = referer
    setLocalStorage(REFERER, state.referer)
  },
};
