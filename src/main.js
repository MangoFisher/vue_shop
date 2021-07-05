import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './assets/fonts/iconfont.css'
import TreeTable from 'vue-table-with-tree-grid'

//将axios引入，并且挂在到全局vue实例中
import axios from 'axios'
Vue.prototype.$http = axios

Vue.component('tree-table', TreeTable)

//设置axios请求拦截器，在axios发起所有请求之前，将客户端记录的'token'字段的值，放置到请求的header中的Authorization字段中
axios.interceptors.request.use(config => {
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})

//设置axios 发起http请求的根路径
axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/'

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
