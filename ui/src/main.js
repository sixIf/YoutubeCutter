import Vue from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify';
import 'material-design-icons-iconfont/dist/material-design-icons.css'
import './assets/css/main.styl'
import axios from 'axios'
import youtubeService from '@/api/youtube.js'



Vue.config.productionTip = false

// global variable
axios.defaults.baseURL = (process.env.NODE_ENV !== 'production') ? 'http://localhost:8081' : '';
Vue.prototype.$api_key = 'AIzaSyDeSxTCCjIY0GQGLLFsw7aZeZqtdiSvznI'

Vue.prototype.$error_type = {
  403: 'Quota exceeded for your API key. Buy more credit on your google account or retry tomorrow.',
  400: 'Channel not found. Please verify the channel id.'
}


new Vue({
  router,
  vuetify,
  provide: {
    youtubeService
  },
  render: function (h) { return h(App) }
}).$mount('#app')
