import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import Home from '@/views/Home.vue'
import ChannelDashboard from '@/views/ChannelDashboard.vue'
import VideoEditor from '@/views/VideoEditor.vue'
import SearchChannel from '@/views/SearchChannel.vue'
import SearchVideos from '@/views/SearchVideos.vue'
import Help from '@/views/Help.vue'
import Settings from '@/views/Settings.vue'
import { ApiKeyService } from "@/services/apiKeyService"
import { DownloadFolderService } from "@/services/downloadFolderService"
import { ApplicationContainer } from "@/di/index"

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
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
        path: '/edit-video/:id',
        name: 'edit-video',
        component: VideoEditor
    },
    {
        path: '/search-channel',
        name: 'search-channel',
        component: SearchChannel
    },
    {
        path: '/search-videos',
        name: 'search-videos',
        component: SearchVideos
    },
    {
        path: '/help',
        name: 'help',
        component: Help
    },
    {
        path: '/settings',
        name: 'settings',
        component: Settings
    },
    {
        path: '/channel/:id/:playlistId?',
        name: 'channel-view',
        component: ChannelDashboard,
    },
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
