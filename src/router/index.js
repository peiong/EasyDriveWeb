import { createRouter, createWebHistory } from 'vue-router'
import '../style.css'

import main from '@/components/views/Main.vue';
import file from '@/components/views/views-main/FileManagement.vue'
import uploading from '@/components/views/views-main/UpLoading.vue'
import downloading from '@/components/views/views-main/Downloading.vue'
import completed from '@/components/views/views-main/Completed.vue'
import scan from '@/components/views/views-main/Scan.vue'
import trash from '@/components/views/views-main/Trash.vue'
import preference from '@/components/views/views-main/Preference.vue'


const router = createRouter(
    {
        history: createWebHistory(import.meta.env.BASE_URL),
        routes: [
            { path: '/', redirect: '/login' },
            { path: '/login', name: 'login', component: () => import('@/components/views/Login.vue') },
            { path: '/register', name: 'register', component: () => import('@/components/views/Register.vue') },
            { path: '/recover', name: 'recover', component: () => import('@/components/views/Recover.vue') },
            { path: '/main', redirect:'main/file', component: main,
                children: [
                    {
                        path: "file",
                        name: 'file',
                        component: file
                    },
                    {
                        path: "uploading",
                        name: 'uploading',
                        component: uploading
                    },
                    {
                        path: "downloading",
                        name: 'downloading',
                        component: downloading
                    },
                    {
                        path: "completed",
                        name: 'completed',
                        component: completed
                    },
                    {
                        path: "scan",
                        name: 'scan',
                        component: scan
                    },
                    {
                        path: "trash",
                        name: 'trash',
                        component: trash
                    },
                    {
                        path: "preference",
                        name: 'preference',
                        component: preference
                    },
                ]
            },  
        ]
    }
)

router.beforeEach(() => {

})
export default router
