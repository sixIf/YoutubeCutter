import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import ChannelVideos from '../views/ChannelVideos.vue'
import ChannelPlaylists from '../views/ChannelPlaylists.vue'
import Help from '../views/Help.vue'
import ChannelDashboard from '../layouts/ChannelDashboard.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/channel/:id',
    component: ChannelDashboard,
    children: [
      {
        path: '',
        redirect: { name: 'channel-videos' }
      },
      {
        path: 'videos',
        name: 'channel-videos',
        component: ChannelVideos
      },
      {
        path: 'playlists',
        name: 'channel-playlists',
        component: ChannelPlaylists
      },
      {
        path: 'help',
        name: 'help',
        component: Help
      }
    ]

  },
  // {
  //   path: '/channel/videos',
  //   name: 'channel-videos',
  //   meta: { layout: "channel-dashboard" },
  //   component: ChannelVideos,
  //   props: true
  // },
  // {
  //   path: '/channel/playlists',
  //   name: 'channel-playlists',
  //   meta: { layout: "channel-dashboard" },
  //   component: ChannelVideos,
  //   props: true
  // },
  // {
  //   path: '/help',
  //   name: 'help',
  //   meta: { layout: "channel-dashboard" },
  //   // route level code-splitting
  //   // this generates a separate chunk (help.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: function () {
  //     return import(/* webpackChunkName: "help" */ '../views/Help.vue')
  //   }
  // }
]

const router = new VueRouter({
  mode: 'history',
  routes
})

export default router
