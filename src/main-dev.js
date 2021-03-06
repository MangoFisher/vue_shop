import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './assets/fonts/iconfont.css'
import TreeTable from 'vue-table-with-tree-grid'
//导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
//将axios引入，并且挂在到全局vue实例中
import axios from 'axios'
Vue.prototype.$http = axios
import echarts from "echarts"
// Vue.prototype.$echarts = echarts;

import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

// import { config } from 'vue/types/umd'


Vue.component('tree-table', TreeTable)
Vue.use(VueQuillEditor)
//全局注册对时间进行格式化的过滤器
Vue.filter('dateFormat', function(original) {
  const dt = new Date(original)
  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 + '').padStart(2, '0')
  const d = (dt.getDate() + '').padStart(2, '0')

  const hh = (dt.getHours() + '').padStart(2, '0')
  const mm = (dt.getMinutes() + '').padStart(2, '0')
  const ss = (dt.getSeconds() + '').padStart(2, '0')

  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})

//设置axios请求拦截器，在axios发起所有请求之前，将客户端记录的'token'字段的值，放置到请求的header中的Authorization字段中
axios.interceptors.request.use(config => {
  NProgress.start()
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})

axios.interceptors.response.use(config => {
  NProgress.done()
  return config
})

//设置axios 发起http请求的根路径
axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/'

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
