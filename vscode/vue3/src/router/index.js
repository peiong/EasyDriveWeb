import { createRouter, createWebHistory } from 'vue-router'
import '../style.css'

const router = createRouter(
    {
        history: createWebHistory(import.meta.env.BASE_URL),
        routes: [
            { path: '/', redirect: '/login' },
            { path: '/login', name: 'login', component: () => import('../components/views/Login.vue') },
            { path: '/register', name: 'register', component: () => import('../components/views/Register.vue') },
            { path: '/recover', name: 'recover', component: () => import('../components/views/Recover.vue') },
            { path: '/main', redirect:'main/file', component: () => import('../components/views/Main.vue'),
                children: [
                    {
                        path: "file",
                        name: 'file',
                        component: () => import('../components/views/views-main/FileManagement.vue')
                    },
                    {
                        path: "uploading",
                        name: 'uploading',
                        component: () => import('../components/views/views-main/UpLoading.vue')
                    },
                    {
                        path: "downloading",
                        name: 'downloading',
                        component: () => import('../components/views/views-main/Downloading.vue')
                    },
                    {
                        path: "completed",
                        name: 'completed',
                        component: () => import('../components/views/views-main/Completed.vue')
                    },
                    {
                        path: "scan",
                        name: 'scan',
                        component: () => import('../components/views/views-main/Scan.vue')
                    },
                    {
                        path: "trash",
                        name: 'trash',
                        component: () => import('../components/views/views-main/Trash.vue')
                    },
                    {
                        path: "preference",
                        name: 'preference',
                        component: () => import('../components/views/views-main/Preference.vue')
                    },
                ]
            },  
        ]
    }
)

router.beforeEach(() => {

})
export default router
