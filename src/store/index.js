import Vue from 'vue'
import Vuex from 'vuex'
import mutations from './mutations'
import getters from './getters'

Vue.use(Vuex);

const state = {
  isSmallScreen: false,
  navIndex: getters.getNavIndex(state) || '1',
  settingsNavIndex: getters.getSettingsNavIndex(state) || '1-1',
  breadcrumbs: [],
  userInfo: getters.queryUserInfo(state),
  userAccessToken: getters.getUserAccessToken(state),
  sessionId: getters.getSessionId(state),
  referer: getters.getReferer(state),
  isLogined: !!getters.getUserAccessToken(state),
  orderProduct: getters.getOrderProduct(state),
  courseTaskInfo: getters.getCourseTaskInfo(state),
  courseStatusInfo: getters.getCourseStatusInfo(state),
  courseDirectoryVisible: false,
  loading: false,
  currentLesson: getters.currentLesson(state),
  signUpDialogVisible: false,
  signInDialogVisible: false,
  forgetPasswordDialogVisible: false,
  userTermDialogVisible: false
};

export default new Vuex.Store({
  state,
  getters,
  mutations,
})