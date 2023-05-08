import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import 'element-plus/dist/index.css'
import axios from 'axios'
import header from '@/components/header.js'

const app = createApp(App)

axios.defaults.withCredentials = true

//本地环境
axios.defaults.baseURL = 'http://192.168.1.102:8080'

//服务器环境    
//axios.defaults.baseURL = 'https://peirong.co:8443/EasyDrive'

app.use(createPinia())
app.use(router)
app.use(header)

app.mount('#app')