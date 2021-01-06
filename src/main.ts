import "reflect-metadata"
import 'vue-class-component/hooks' 
import '@/router/componentHooks'
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import 'material-design-icons-iconfont/dist/material-design-icons.css'
import '@/assets/css/main.styl'
import { YoutubeService } from '@/services/youtubeService'
import { DownloadFolderService } from '@/services/downloadFolderService'
import { YOUTUBE_SERVICE, DOWNLOAD_FOLDER_SERVICE } from '@/config/litterals'
import { ApplicationContainer } from '@/di/index'
import Vuex from 'vuex'
import store from './store/store'

Vue.use(Vuex);

Vue.config.productionTip = false;
Vue.prototype.$__ = window.i18n.translate;

new Vue({
    store: store,
    router,
    vuetify,
    provide: {
        [YOUTUBE_SERVICE]: ApplicationContainer.resolve(YoutubeService),
        [DOWNLOAD_FOLDER_SERVICE]: ApplicationContainer.resolve(DownloadFolderService),
    },
    render: h => h(App)
}).$mount('#app')

