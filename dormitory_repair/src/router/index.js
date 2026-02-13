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
    path:'/Manage',
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
    path: '/waveOpticsFinal',
    component: () => import('../views/hwrPage/hwrPage2.vue')
  },
  {
    path: '/muyang',
    component: () => import('../views/hwrPage/muyang.vue')
  },
]

const router = new VueRouter({
  routes
})

// 路由守卫 - 检查登录状态
router.beforeEach((to, from, next) => {
  // 白名单路由，不需要登录即可访问
  const whiteList = ['/login', '/stu', '/about', '/waveOptics', '/waveOpticsFinal', '/muyang'];
  
  // 如果访问的是白名单路由，直接放行
  if (whiteList.includes(to.path) || to.path.startsWith('/stu/')) {
    next();
    return;
  }
  
  // 需要登录的路由，检查localStorage中的用户信息
  const token = localStorage.getItem('dormitory_token');
  const name = localStorage.getItem('dormitory_name');
  const duty = localStorage.getItem('dormitory_duty');
  const workerId = localStorage.getItem('dormitory_workerId');
  const account = localStorage.getItem('dormitory_account');

  
  // 如果必要的用户信息不完整，跳转到登录页
  if (!token || !name || !duty  || !workerId || !account) {
    next('/login');
    return;
  }
  
  // 用户信息完整，放行
  next();
})

export default router
