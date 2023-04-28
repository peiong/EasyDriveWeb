import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import 'element-plus/dist/index.css'
import axios from 'axios'

const app = createApp(App)

axios.defaults.withCredentials = true
axios.defaults.baseURL = 'http://192.168.1.102:8080'          //本地环境
//axios.defaults.baseURL = 'https://peirong.co:8443/EasyDrive'    //服务器环境

app.use(createPinia())
app.use(router)

app.mount('#app')