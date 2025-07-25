import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import axios from 'axios'
import LocaleProvider from 'antd/es/locale';

Vue.config.productionTip = false;

const testUrl = 'http://localhost:8088';

const web = 'http://42.194.183.221:83/api';
// const trueUrl = testUrl;
const trueUrl = web;


axios.defaults.baseURL = trueUrl;
// 定义全局变量（后端路由），通过this.$apiUrl访问
// Vue.prototype.$apiUrl = trueUrl;

Vue.use(ElementUI);
// 创建axios实例
const service = axios.create({
  baseURL: trueUrl, // 接口基础URL
  timeout: 5000, // 请求超时时间
  withCredentials: true // 重要！跨域时需开启
});

const whiteList = ['/login', '/stu']; // 添加公开路由白名单

// 请求拦截器
service.interceptors.request.use(
  config => {
    // 跳过白名单中的请求
    if (!whiteList.some(path => config.url.startsWith(path))) {
      config.headers.Authorization = "Bearer " + localStorage.getItem("dormitory_token");
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// 响应拦截器
service.interceptors.response.use(
  response => response,
  error => {
    const config = error.config;
    
    // 只拦截401未授权错误
    if (error.response?.status === 401 && !whiteList.some(path => config.url.startsWith(path))) {
      // 清除无效的Token
      localStorage.removeItem("dormitory_token");
      
      // 跳转登录页并携带当前路由信息
      router.replace({
        path: '/login',
        query: {
          redirect: router.currentRoute.fullPath
        }
      });
    }
    
    return Promise.reject(error);
  }
);
Vue.prototype.$axios = service;

new Vue({
  router,
  store,
  el: '#app',
  render: h => h(App)
}).$mount('#app')
