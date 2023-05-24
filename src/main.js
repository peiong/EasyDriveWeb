import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import 'element-plus/dist/index.css'
import axios from 'axios'

axios.defaults.withCredentials = true

//axios.defaults.baseURL = 'http://192.168.1.105:8080'
axios.defaults.baseURL = 'https://peirong.co:8443/EasyDrive'

const app = createApp(App)
app.use(router)
app.mount('#app')