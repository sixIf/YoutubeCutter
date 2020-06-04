import Vue from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify';
import 'material-design-icons-iconfont/dist/material-design-icons.css'
import '@/assets/css/main.styl'
import axios from 'axios'
import { YoutubeService } from '@/api/youtube.ts'
import { YOUTUBESERVICE } from '@/config/litterals'

Vue.config.productionTip = false



axios.defaults.baseURL = (process.env.NODE_ENV !== 'production') ? 'http://localhost:8081' : '';

new Vue({
  router,
  vuetify,
  provide: {
    [YOUTUBESERVICE]: new YoutubeService()
  },
  render: h => h(App)
}).$mount('#app')
