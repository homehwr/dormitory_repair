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

const web = 'http://42.194.183.221:5174';
const trueUrl = testUrl;


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
// 请求拦截器
service.interceptors.request.use(
  config => {
    if (config.url != '/login') {
      config.headers.Authorization = "Bearer " + localStorage.getItem("dormitory_token");
    }
    return config;
  },
  error => {
    console.error('请求拦截器错误:', error);
    return Promise.reject(error);
  }
);

service.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    router.push({
      path: "/login"
    })
  }
)
Vue.prototype.$axios = service;

new Vue({
  router,
  store,
  el: '#app',
  render: h => h(App)
}).$mount('#app')
