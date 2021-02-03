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
    const storeGotVideos = store.state.fetchedVideosState!.fetchedVideos.length > 0;
    switch (to.name) {
        case 'home':
            if (storeGotVideos) next({name: 'manage-videos'});
            else next();
            break;
        case 'manage-videos':
            if (storeGotVideos) next();
            else next({name: 'home'});
            break;
        default:
            next();
            break;
    }
})

export default router
