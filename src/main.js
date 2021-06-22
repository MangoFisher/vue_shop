import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './assets/fonts/iconfont.css'

//将axios引入，并且挂在到全局vue实例中
import axios from 'axios'
Vue.prototype.$http = axios

//设置axios 发起http请求的根路径
axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/'

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
