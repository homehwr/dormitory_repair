import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import axios from 'axios'

Vue.config.productionTip = false;

const testUrl = 'http://localhost:8000';

const web = 'http://42.194.183.221:5174';
const trueUrl = testUrl;


axios.defaults.baseURL = trueUrl;
// 定义全局变量（后端路由），通过this.$apiUrl访问
Vue.prototype.$apiUrl = trueUrl;

Vue.use(ElementUI);
Vue.prototype.$axios = axios;

new Vue({
  router,
  store,
  el: '#app',
  render: h => h(App)
}).$mount('#app')
