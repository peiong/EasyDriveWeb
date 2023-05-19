import { createRouter, createWebHistory } from 'vue-router'
import '../style.css'

import main from '@/views/AfterLogin/Main.vue'
import file from '@/views/AfterLogin/File.vue'
import uploading from '@/views/AfterLogin/UpLoading.vue'
import downloading from '@/views/AfterLogin/Downloading.vue'
import completed from '@/views/AfterLogin/Completed.vue'
import scan from '@/views/AfterLogin/Scan.vue'
import trash from '@/views/AfterLogin/Trash.vue'
import preference from '@/views/AfterLogin/Preference.vue'
import axios from 'axios'
import { ElMessage } from 'element-plus'

const router = createRouter(
    {
        history: createWebHistory(import.meta.env.BASE_URL),
        routes: [
            {
                path: '/',
                name: 'before',
                redirect: '/login',
                children: [
                    { path: 'login', name: 'before-login', component: () => import('@/views/BeforeLogin/Login.vue') },
                    { path: 'register', name: 'before-register', component: () => import('@/views/BeforeLogin/Register.vue') },
                    { path: 'recover', name: 'before-recover', component: () => import('@/views/BeforeLogin/Recover.vue') }
                ]
            },
            {
                path: '/main', redirect: '/main/file', component: main,
                children: [
                    {
                        path: "file",
                        name: 'after-file',
                        component: file
                    },
                    {
                        path: "uploading",
                        name: 'after-uploading',
                        component: uploading
                    },
                    {
                        path: "downloading",
                        name: 'after-downloading',
                        component: downloading
                    },
                    {
                        path: "completed",
                        name: 'after-completed',
                        component: completed
                    },
                    {
                        path: "scan",
                        name: 'after-scan',
                        component: scan
                    },
                    {
                        path: "trash",
                        name: 'after-trash',
                        component: trash
                    },
                    {
                        path: "preference",
                        name: 'after-preference',
                        component: preference
                    },
                ]
            },
        ],
        mode: 'history'
    }
)

router.beforeEach((to, from, next) => {
    axios.get('/check/auth')
        .then(res => {
            if (res.data.msg == 'fail' && to.name.startsWith('after')) {
                next('/login')
            } else if (res.data.msg == 'success' && to.name.startsWith('before')) {
                next('/main/file')
            } else { 
                next()
            }
        }).catch(err => {
            ElMessage.error("404，页面未找到")
            next('/login')
        })
    
})

export default router
