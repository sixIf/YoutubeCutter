import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import Home from '@/views/Home.vue'
import Help from '@/views/Help.vue'
import VideosManager from '@/views/VideosManager.vue'
import store from '@/store/store'

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
        component: Home,
    },
    {            
        name: 'manage-videos',
        path: '/manage-videos',
        component: VideosManager
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
    if (to.name === 'home' && (store.state.fetchedVideosState!.fetchedVideos.length > 0)) next({ name: 'manage-videos' })
    else if (to.name === 'manage-videos' && (store.state.fetchedVideosState!.fetchedVideos.length == 0)) next({ name: 'home' })
    else next()
})

export default router
