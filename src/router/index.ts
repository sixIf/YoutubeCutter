import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import Home from '@/views/Home.vue'
import Help from '@/views/Help.vue'
import { DownloadFolderService } from "@/services/downloadFolderService"
import { ApplicationContainer } from "@/di/index"

Vue.use(VueRouter)

const routes: RouteConfig[] = [
    {
        path: '/exit',
        name: 'exit',
        redirect: { name: 'home' }
    },
    {
        path: '/',
        name: 'home',
        component: Home
    },
    {
        path: '/help',
        name: 'help',
        component: Help
    }
]

const router = new VueRouter({
    mode: process.env.IS_ELECTRON ? 'hash' : 'history',
    base: process.env.BASE_URL,
    routes
})

// Check if Download Folder is set
router.beforeEach((to, from, next) => {
    const downloadFolderService = ApplicationContainer.resolve(DownloadFolderService)
    if (to.name !== 'settings' && (!downloadFolderService.getDownloadFolder())) next({ name: 'settings' })
    else next()
})

export default router
