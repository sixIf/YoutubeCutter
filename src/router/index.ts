import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import Home from '@/views/Home.vue'
import ChannelDashboard from '@/layouts/ChannelDashboard.vue'
import ChannelVideos from '@/views/ChannelVideos.vue'
import PlaylistVideos from '@/views/PlaylistVideos.vue'
import ChannelPlaylists from '@/views/ChannelPlaylists.vue'
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
        path: '/channel/:channelTitle/:id',
        component: ChannelDashboard,
        children: [
            {
                path: '',
                redirect: { name: 'channel-playlists' }
            },
            {
                path: 'videos/:playlistId',
                name: 'channel-uploaded-videos',
                component: ChannelVideos
            },
            {
                path: 'playlists',
                name: 'channel-playlists',
                component: ChannelPlaylists
            },
            {
                path: 'playlist/:playlistId/:playlistTitle/videos',
                name: 'playlist-videos',
                component: PlaylistVideos
            },
            // {
            //   path: 'help',
            //   name: 'help',
            //   component: Help
            // }
        ]

    },
]

const router = new VueRouter({
    mode: process.env.IS_ELECTRON ? 'hash' : 'history',
    base: process.env.BASE_URL,
    routes
})

// Check if API_Key is set, if not redirect to set api key page
router.beforeEach((to, from, next) => {
    // const apiKeyService = ApplicationContainer.resolve(ApiKeyService)
    const downloadFolderService = ApplicationContainer.resolve(DownloadFolderService)
    if (to.name !== 'settings' && (!downloadFolderService.getDownloadFolder())) next({ name: 'settings' })
    else next()
})

export default router
