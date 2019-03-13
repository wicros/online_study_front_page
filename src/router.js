const homeComponent = () => import('./pages/home/home.vue');
const allProductsComponent = () => import('./pages/allProducts/allProducts.vue');
const productDetailsComponent = () => import('./pages/productDetails/productDetails.vue');
const allCoursesComponent = () => import('./pages/allCourses/allCourses.vue');
const courseDetailsComponent = () => import('./pages/courseDetails/courseDetails.vue');
const studyTaskComponent = () => import('./pages/studyTask/studyTask.vue');
const paymentComponent = () => import('./pages/payment/payment.vue');
const myPageComponent = () => import('./pages/myPage/myPage.vue');
const settingsComponent = () => import('./pages/settings/settings.vue');
const profileComponent = () => import('./pages/settings/children/profile.vue');
const avatarComponent = () => import('./pages/settings/children/avatar.vue');
const accountSecurityComponent = () => import('./pages/settings/children/accountSecurity.vue');
const myOrderComponent = () => import('./pages/settings/children/myOrder.vue');
const allVideosComponent = () => import('./pages/allVideos/allVideos.vue');
const freeVideoDetailsComponent = () => import('./pages/freeVideoDetails/freeVideoDetails.vue');
const pageNotFoundComponent = () => import('./components/common/pageNotFound.vue');


export default [
  {
    path: '*',
    redirect: '/404'
  },
  {
    name: 'pageNotFound',
    path: '/404',
    component: pageNotFoundComponent,
    meta: { keepAlive: false }
  },
  {
    name: 'home',
    path: '/',
    component: homeComponent,
    meta: { keepAlive: false, navIndex: '1' }
  },
  {
    name: 'products',
    path: '/products',
    component: allProductsComponent,
    meta: { breadcrumb: '热门套餐', keepAlive: false, navIndex: '2' }
  },
  {
    name: 'courses',
    path: '/courses',
    component: allCoursesComponent,
    meta: { breadcrumb: '明星课程', keepAlive: false, navIndex: '3' }
  },
  {
    name: 'openCourses',
    path: '/openCourses',
    component: allVideosComponent,
    meta: { breadcrumb: '公开课', keepAlive: false, navIndex: '4' }
  },
  {
    name: 'coursesDetail',
    path: '/courses/:id',
    component: courseDetailsComponent,
    meta: { breadcrumb: '', keepAlive: false }
  },
  {
    name: 'productDetail',
    path: '/products/:id',
    component: productDetailsComponent,
    meta: { breadcrumb: '', keepAlive: false }
  },
  {
    name: 'lessons',
    path: '/courses/:id/lessons/:lessonId',
    component: studyTaskComponent,
    meta: {
      keepAlive: false
    }
  },
  {
    name: 'payment',
    path: '/payment',
    component: paymentComponent,
    meta: {
      breadcrumb: '购买课程',
      keepAlive: false,
      requireAuth: true
    }
  },
  {
    name: 'myPage',
    path: '/myPage',
    component: myPageComponent,
    meta: {
      breadcrumb: '个人页面',
      keepAlive: false,
      requireAuth: true
    }
  },
  {
    path: '/settings',
    redirect: '/profile'
  },
  {
    name: 'settings',
    path: '/settings',
    component: settingsComponent,
    meta: {
      breadcrumb: '设置',
      keepAlive: false,
      requireAuth: true
    },
    children: [
      {
        name: 'profile',
        path: '/profile',
        component: profileComponent,
        meta: {
          breadcrumb: '设置',
          keepAlive: false,
          navIndex: '1-1',
          requireAuth: true
        }
      },
      {
        name: 'avatar',
        path: '/avatar',
        component: avatarComponent,
        meta: {
          breadcrumb: '设置',
          keepAlive: false,
          navIndex: '1-2',
          requireAuth: true
        }
      },
      {
        name: 'accountSecurity',
        path: '/accountSecurity',
        component: accountSecurityComponent,
        meta: {
          breadcrumb: '设置',
          keepAlive: false,
          navIndex: '1-3',
          requireAuth: true
        }
      },
      {
        name: 'myOrder',
        path: '/myOrder',
        component: myOrderComponent,
        meta: {
          breadcrumb: '设置',
          keepAlive: false,
          navIndex: '2-1',
          requireAuth: true
        }
      }
    ]
  },
  {
    name: 'openCourseDetails',
    path: '/openCourses/:id',
    component: freeVideoDetailsComponent,
    meta: { breadcrumb: '', keepAlive: false,  requireAuth: true}
  },
];
