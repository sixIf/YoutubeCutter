import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import ChannelVideos from '../views/ChannelVideos.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/channel/videos',
    name: 'channel-videos',
    meta: { layout: "channel-dashboard" },
    component: ChannelVideos,
    props: true
  },
  {
    path: '/channel/playlists',
    name: 'channel-playlists',
    meta: { layout: "channel-dashboard" },
    component: ChannelVideos,
    props: true
  },
  {
    path: '/about',
    name: 'channel-about',
    meta: { layout: "channel-dashboard" },
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: function () {
      return import(/* webpackChunkName: "about" */ '../views/About.vue')
    }
  }
]

const router = new VueRouter({
  mode: 'history',
  routes
})

export default router
