import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'

import JsEncrypt from 'jsencrypt'
import 'element-plus'
import axios from 'axios'

axios.defaults.baseURL = 'http://localhost:8080'
// Vue.prototype.$encruption = function (obj) {
//     let encrypt = new JsEncrypt()
//     encrypt.setPublicKey('Re4030dd.')
//     return encrypt.encrypt(obj)
// }

createApp(App).use(router).mount('#app')

