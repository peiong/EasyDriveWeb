import { createRouter, createWebHistory } from 'vue-router'
import '../style.css'

import main from '@/views/afterLogin/Main.vue'
import file from '@/views/afterLogin/File.vue'
import uploading from '@/views/afterLogin/UpLoading.vue'
import downloading from '@/views/afterLogin/Downloading.vue'
import completed from '@/views/afterLogin/Completed.vue'
import scan from '@/views/afterLogin/Scan.vue'
import trash from '@/views/afterLogin/Trash.vue'
import preference from '@/views/afterLogin/Preference.vue'
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
                    { path: 'login', name: 'before-login', component: () => import('@/views/beforeLogin/Login.vue') },
                    { path: 'register', name: 'before-register', component: () => import('@/views/beforeLogin/Register.vue') },
                    { path: 'recover', name: 'before-recover', component: () => import('@/views/beforeLogin/Recover.vue') }
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


// 全局路由前置守卫
// 检查session判断是否登录，并传回登录的类型（用户or管理员）
// 未登录时访问主页，跳转至登录页面
// 已登录时访问登录页面，跳转至主页
router.beforeEach((to, from, next) => {
    axios.get('/check/user2')
        .then(res => {
            if (res.data.msg == 'fail' && to.name.startsWith('after')) {
                next('/login')
            } else if (res.data.msg == 'success' && to.name.startsWith('before')) {
                next('/main')
            } else {
                axios.get('/check/user')
                .then(res => {
                    if (res.data.username != null && to.name.startsWith('before')) {
                        next('/main')
                    } else if (res.data.username == null && to.name.startsWith('after')) {
                        next('/login')
                    }
                })
                next()
            }
        }).catch(err => {
            ElMessage.error("服务器无响应，请联系管理员")
        })
})

export default router
