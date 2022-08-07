import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import Index from '../views/Index.vue'
import Service from '../views/service/Service.vue'
import Graduation from '../views/graduation/index.vue'
import Login from "../views/Login.vue"
import Register from "../views/Register.vue"
import UserData from "../views/UserData.vue"
import Detail from "../views/Detail.vue"
import Release from "../views/Release.vue"
import Update from "../views/Update.vue"
import NotFound from "../views/404.vue"
import Error from "../views/500.vue"
import Error520 from "../views/520.vue"


const routes: Array<RouteRecordRaw> = [

  {
    path: '/',
    redirect: '/index'
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },

  {
    path: '/index',
    name: 'Index',
    component: Index,
    redirect: '/index/homePage',
    children: [
      {
        path: '/index/homePage',
        name: 'HomePage',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "dailySharing" */ '../views/HomePage.vue')
      },
      {
        path: '/index/dailySharing',
        name: 'DailySharing',

        component: () => import('../views/DailySharing.vue')
      },
      {
        path: '/index/travel',
        name: 'Travel',
        component: () => import('../views/Travel.vue')
      },
      {
        path: '/index/poetry',
        name: 'Poetry',
        component: () => import('../views/Poetry.vue')
      },
      {
        path: '/index/message',
        name: 'Message',
        component: () => import('../views/Message.vue')
      },
      {
        path: '/index/mall',
        name: 'Mall',
        component: () => import('../views/Mall.vue')
      },
      {
        path: '/index/updateLog',
        name: 'UpdateLog',
        component: () => import('../views/UpdateLog.vue')
      },
      {
        path: '/index/aboutUs',
        name: 'AboutUs',
        component: () => import('../views/AboutUs.vue')
      },
    ]
  },

  {
    path: '/register',
    name: 'Register',
    component: Register
  },

  {
    path: '/userData',
    name: 'UserData',
    component: UserData
  },

  {
    path: '/detail',
    name: 'Detail',
    component: Detail
  },

  {
    path: '/release',
    name: 'Release',
    component: Release
  },

  {
    path: '/update',
    name: 'Update',
    component: Update
  },

  {
    path: '/service',
    name: 'Service',
    component: Service,
    redirect: '/service/home',
    children: [
      {
        path: '/service/home',
        name: 'Home',
        component: () => import('../views/service/HomePage.vue')
      },
      {
        path: '/service/notice',
        name: 'Notice',
        component: () => import('../views/service/Notice.vue')
      },
      {
        path: '/service/tag',
        name: 'Tag',
        component: () => import('../views/service/Tag.vue')
      },
      {
        path: '/service/daily',
        name: 'Daily',
        component: () => import('../views/service/DailySharing.vue')
      },
      {
        path: '/service/personal',
        name: 'Personal',
        component: () => import('../views/service/PersonalDocuments.vue')
      },
      {
        path: '/service/diary',
        name: 'Diary',
        component: () => import('../views/service/Diary.vue')
      },
      {
        path: '/service/year',
        name: 'Year',
        component: () => import('../views/service/Year.vue')
      },
      {
        path: '/service/yearPlan',
        name: 'YearPlan',
        component: () => import('../views/service/YearPlan.vue')
      },
      {
        path: '/service/travelManagement',
        name: 'TravelManagement',
        component: () => import('../views/service/Travel.vue')
      },
      {
        path: '/service/link',
        name: 'Link2',
        component: () => import('../views/service/Link.vue')
      },
      {
        path: '/service/log',
        name: 'Log',
        component: () => import('../views/service/UpdateLog.vue')
      },
      {
        path: '/service/userManagement',
        name: 'UserManagement',
        component: () => import('../views/service/UserManagement.vue')
      },
      {
        path: '/service/about',
        name: 'About',
        component: () => import('../views/service/AboutUs.vue')
      },
    ]
  },

  {
    path: '/graduation',
    name: 'Graduation',
    component: Graduation
  },

  {
    path: '/404',
    name: 'NotFound',
    component: NotFound
  },
  {
    path: '/500',
    name: 'Error',
    component: Error
  },
  {
    path: '/maintenance',
    name: 'Error520',
    component: Error520
  },
  {
    path: '/:catchAll(.*)',
    name: 'NotFound',
    component: NotFound
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router;