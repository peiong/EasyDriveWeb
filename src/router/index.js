import { createRouter, createWebHistory } from 'vue-router'
import { useStore } from '@/stores'
import '../style.css'

import main from '@/components/afterLogin/Main.vue'
import file from '@/components/afterLogin/FileManagement.vue'
import uploading from '@/components/afterLogin/UpLoading.vue'
import downloading from '@/components/afterLogin/Downloading.vue'
import completed from '@/components/afterLogin/Completed.vue'
import scan from '@/components/afterLogin/Scan.vue'
import trash from '@/components/afterLogin/Trash.vue'
import preference from '@/components/afterLogin/Preference.vue'


const router = createRouter(
    {
        history: createWebHistory(import.meta.env.BASE_URL),
        routes: [
            {
                path: '/',
                name: 'before',
                redirect: '/login',
                children: [
                    { path: 'login', name: 'before-login', component: () => import('@/components/beforeLogin/Login.vue') },
                    { path: 'register', name: 'before-register', component: () => import('@/components/beforeLogin/Register.vue') },
                    { path: 'recover', name: 'before-recover', component: () => import('@/components/beforeLogin/Recover.vue') }
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
    const store = useStore()
    if (store.auth.user != null && to.name.startsWith('before-')) {
        next('/main')
    } else if (store.auth.user == null && to.fullPath.startsWith('/main')) {
        next('/')
    } else if (to.matched.length === 0) {
        next('/main')
    } else {
        next()
    }
})

export default router
