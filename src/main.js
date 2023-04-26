import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import 'element-plus'
import axios from 'axios'
axios.defaults.withCredentials = true

//axios.defaults.baseURL = 'http://192.168.1.102:8080'      //本地环境
axios.defaults.baseURL = 'https://peirong.co:8443/EasyDrive'//服务器环境

createApp(App).use(router).mount('#app')