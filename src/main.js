import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'

import 'element-plus'
import axios from 'axios'

axios.defaults.baseURL = 'http://localhost:8080'

createApp(App).use(router).mount('#app')

