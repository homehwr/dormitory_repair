import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { component } from 'vue/types/umd'

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
    }
    ],
  }
]

const router = new VueRouter({
  routes
})

export default router
