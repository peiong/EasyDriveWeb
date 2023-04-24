import { createApp } from 'vue'
// import './style.css'
import App from './App.vue'
import router from './router'

import 'element-plus'
import axios from 'axios'

axios.defaults.baseURL = 'http://192.168.1.102:8080'//生产环境
//axios..defaults.baseURL = 'http://peirong.co:8080'//实际环境

createApp(App).use(router).mount('#app')

