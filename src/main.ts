import "reflect-metadata"
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import 'material-design-icons-iconfont/dist/material-design-icons.css'
import '@/assets/css/main.styl'
import axios from 'axios'
import { container } from 'tsyringe'
import { YoutubeService } from '@/services/youtubeService'
import { ApiKeyService } from '@/services/apiKeyService'
import { YOUTUBESERVICE, APIKEYSERVICE } from '@/config/litterals'
import { ApplicationContainer } from '@/di/index'

Vue.config.productionTip = false

axios.defaults.baseURL = (process.env.NODE_ENV !== 'production') ? 'http://localhost:8081' : '';



new Vue({
  router,
  vuetify,
  provide: {
    [YOUTUBESERVICE]: ApplicationContainer.resolve(YoutubeService), // Tsyringe pour injection de dépendence
    [APIKEYSERVICE]: ApplicationContainer.resolve(ApiKeyService), // Tsyringe pour injection de dépendence
  },
  render: h => h(App)
}).$mount('#app')
