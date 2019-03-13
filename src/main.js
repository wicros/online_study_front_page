import Vue from 'vue'
import VueRouter from 'vue-router'
import VueAnalytics from 'vue-analytics'
import VueI18n from "vue-i18n";
import App from './App.vue'
import icon from './components/common/icon.vue'
import store from './store/'
import routes from './router.js'
import {routerMode} from './config/env.js'
import messages from './language/messages.js'
import constants from './constants/'
import {CLEAR_BREADCRUMBS, SAVE_BREADCRUMBS, REFERER} from './store/mutation-types.js'
import {updateAnalytics} from './service/api/analyticsAPI.js'

import 'element-ui/lib/theme-chalk/index.css'
import 'element-ui/lib/theme-chalk/display.css'
import './theme/index.css'
import './style/mobile.scss'
import './style/fonts.css'

import {
  Pagination,
  Dialog,
  Menu,
  Submenu,
  MenuItem,
  MenuItemGroup,
  Input,
  Radio,
  RadioGroup,
  Select,
  Option,
  Button,
  Table,
  TableColumn,
  DatePicker,
  Breadcrumb,
  BreadcrumbItem,
  Form,
  FormItem,
  Tag,
  Alert,
  Icon,
  Row,
  Col,
  Upload,
  Carousel,
  CarouselItem,
  Collapse,
  CollapseItem,
  Header,
  Footer,
  Loading,
  Message,
  MessageBox,
  Progress,
  Checkbox
} from 'element-ui';
import {sendPageview} from "./service/api/analyticsAPI";

Vue.use(Pagination);
Vue.use(Progress);
Vue.use(Dialog);
Vue.use(Menu);
Vue.use(Submenu);
Vue.use(MenuItem);
Vue.use(MenuItemGroup);
Vue.use(Input);
Vue.use(Radio);
Vue.use(RadioGroup);
Vue.use(Alert);
Vue.use(Select);
Vue.use(Option);
Vue.use(Button);
Vue.use(Table);
Vue.use(TableColumn);
Vue.use(DatePicker);
Vue.use(Breadcrumb);
Vue.use(BreadcrumbItem);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Tag);
Vue.use(Row);
Vue.use(Col);
Vue.use(Upload);
Vue.use(Carousel);
Vue.use(CarouselItem);
Vue.use(Collapse);
Vue.use(CollapseItem);
Vue.use(Header);
Vue.use(Footer);
Vue.use(Checkbox);
Vue.use(Loading.directive);
Vue.prototype.$loading = Loading.service;
Vue.prototype.$message = Message;
Vue.prototype.$confirm = MessageBox.confirm;

Vue.use(VueRouter)

Vue.use(VueI18n)

Vue.component('icon', icon)

Vue.prototype.constants = constants
Vue.prototype.updateAnalytics = updateAnalytics;
store.commit('IS_SMALL_SCREEN')

const router = new VueRouter({
  routes,
  mode: routerMode,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      if (from.meta.keepAlive) {
        from.meta.savedPosition = document.body.scrollTop;
      }
      return {x: 0, y: to.meta.savedPosition || 0}
    }
  }
});

try {
  if(store.state.isLogined && store.state.userInfo.id){
    Vue.use(VueAnalytics, {
      id: 'UA-113872085-1',
      router,
      autoTracking: {
        pageviewTemplate (route) {
          return {
            page: route.path,
            title: document.title,
            location: window.location.href
          }
        }
      },
      set: [
        { field: 'userId', value: store.state.userInfo.id }
      ]
    });
  }else{
    Vue.use(VueAnalytics, {
      id: 'UA-113872085-1',
      router,
      autoTracking: {
        pageviewTemplate (route) {
          return {
            page: route.path,
            title: document.title,
            location: window.location.href
          }
        }
      }
    });
  }
} catch(error) {
  console.log(error);
}

const i18n = new VueI18n({
  locale: 'zh-CN',
  //this.$i18n.locale
  messages
});

let vm = new Vue({
  el: '#app',
  render: c => c(App),
  store,
  router,
  i18n
});

store.commit(REFERER, document.referrer);

router.beforeEach((to, from, next) => {
  if (to.meta.requireAuth && !store.state.isLogined) {
    Vue.prototype.$message.error(vm.$t('m.pleaseSignInFirst'));
    store.state.signInDialogVisible = true;
    store.state.signUpDialogVisible = false;
    store.state.userTermDialogVisible = false;
    next({path: from.fullPath})
  } else {
    next();
  }
});

router.afterEach((to, from) => {
  sendPageview('/#' + to.fullPath, to.query.via);
  store.commit(REFERER, to.fullPath);

  let rootPage = ['home', 'products', 'courses', 'openCourses', 'myPage']
  if (rootPage.indexOf(to.name) !== -1) { //|| !to.meta.breadcrumb
    store.commit(CLEAR_BREADCRUMBS)
  }

  if (to.meta.breadcrumb) {
    store.commit(SAVE_BREADCRUMBS, to.meta.breadcrumb)
  }
});

Vue.filter('formatDateString', function (dateStr) {
  let date = new Date(dateStr);
  return date.getFullYear()
    + '-' + (date.getMonth() + 1 + '').padStart(2, '0')
    + '-' + (date.getDate() + '').padStart(2, '0')
    + ' ' + (date.getHours() + '').padStart(2, '0')
    + ':' + (date.getMinutes() + '').padStart(2, '0');
});

window.onmousewheel = document.onmousewheel = function (e) {
  e = e || window.event;
  if (e.target.type === 'number') {
    e.preventDefault();
  }
}

export default {
  router
}
