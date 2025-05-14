import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/HomeView.vue'


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
    path:'/Manage',
    name:'adminshow',
    component: () => import('../views/adminPage/index.vue'),
    redirect:'/Manage/repair_records',
    children:[
      {
        path: '/repair-stats',
        component: () => import('../views/adminPage/repair_dataplatform.vue'),
      },
      {
        path: '/repair-records',
        component: () => import('../views/adminPage/repair_records.vue')
      },
      {
        path: '/workers',
        component: () => import('../views/adminPage/workers_info.vue')
      },
      {
        path: '/area-management',
        component: () => import('../views/adminPage/area_manage.vue')
      },
    ],
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
    }
    ],
  }
]

const router = new VueRouter({
  routes
})

export default router
