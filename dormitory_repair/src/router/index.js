import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { chdir } from 'process'
import { component } from 'vue/types/umd'
import path from 'path'


Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/stu'
    // name: 'home',
    // component: HomeView
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  },
  {
    path: '/login',
    component: () => import('../views/adminPage/login.vue'),
  },  
  {
    path:'/manage',
    name:'adminshow',
    component: () => import('../views/adminPage/index.vue'),
    redirect:'/Manage/repair-stats',
    // redirect:'/manage/workers',
    children:[
      {
        path: 'repair-stats',
        component: () => import('../views/adminPage/repair_dataplatform.vue'),
      },
      {
        path: 'repair-charts',
        component: () => import('../views/adminPage/charts.vue'),
      },
      {
        path: 'repair-records',
        component: () => import('../views/adminPage/repair_records.vue')
      },
      {
        path: 'workers',
        component: () => import('../views/adminPage/workers_info.vue')
      },
      {
        path: 'area-management',
        component: () => import('../views/adminPage/area_manage.vue')
      },
      {
        path: 'set-password',
        component: () => import('../views/adminPage/set_password.vue')
      },
    ],
  },
  {
    path: '/worker',
    name: 'workerMainshow',
    redirect: '/worker/index',
    component: () => import('../views/workerPage/mainshow.vue'),
    children: [
      {
        path:'index',
        name: 'workerIndex',
        component: () => import('../views/workerPage/index.vue')
      },
      {
        path:'record',
        name: 'workerRecord',
        component: () => import('../views/workerPage/record.vue')
      },
      {
        path:'upPassword',
        name: 'workerUpPassword',
        component: () => import('../views/workerPage/upPassword.vue')
      },
      {
        path: 'detail',
        name:'workerDetail',
        component: () => import('../views/workerPage/detail.vue')
      }
    ]
  },
  {
    path: '/stu',
    name: 'StuMainshow',
    redirect: '/stu/index',
    component: () => import('../views/studentPage/mainshow.vue'),
    children: [{
      path: 'index',
      name: 'stuIndex',
      component: () => import('../views/studentPage/index.vue')
    },
    {
      path: 'repair',
      name: 'stuRepair',
      component: () => import('../views/studentPage/repair.vue')
    },
    {
      path: 'record',
      name: 'stuRecord',
      component: () => import('../views/studentPage/record.vue')
    },
    {
      path: 'detail',
      name:'stuDetail',
      component: () => import('../views/studentPage/detail.vue')
    }
    ],
  },
  {
    path: '/waveOptics',
    component: () => import('../views/hwrPage/hwrPage.vue')
  },
  {
    path: '/muyang',
    component: () => import('../views/hwrPage/muyang.vue')
  },
]

const router = new VueRouter({
  routes
})

export default router
