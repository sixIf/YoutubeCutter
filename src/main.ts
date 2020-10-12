import "reflect-metadata"
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import 'material-design-icons-iconfont/dist/material-design-icons.css'
import '@/assets/css/main.styl'
import axios from 'axios'
import { YoutubeService } from '@/services/youtubeService'
import { ApiKeyService } from '@/services/apiKeyService'
import { DownloadFolderService } from '@/services/downloadFolderService'
import { YOUTUBE_SERVICE, API_KEY_SERVICE, DOWNLOAD_FOLDER_SERVICE } from '@/config/litterals'
import { ApplicationContainer } from '@/di/index'

Vue.config.productionTip = false

axios.defaults.baseURL = (process.env.NODE_ENV !== 'production') ? 'http://localhost:8081' : ''


new Vue({
    router,
    vuetify,
    provide: {
        [YOUTUBE_SERVICE]: ApplicationContainer.resolve(YoutubeService), // Tsyringe pour injection de dépendence
        [API_KEY_SERVICE]: ApplicationContainer.resolve(ApiKeyService), // Tsyringe pour injection de dépendence
        [DOWNLOAD_FOLDER_SERVICE]: ApplicationContainer.resolve(DownloadFolderService), // Tsyringe pour injection de dépendence
    },
    render: h => h(App)
}).$mount('#app')
