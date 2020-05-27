import Vue from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify';
import 'material-design-icons-iconfont/dist/material-design-icons.css'
import './assets/css/main.styl'
import axios from 'axios'

axios.defaults.baseURL = (process.env.NODE_ENV !== 'production') ? 'http://localhost:8081' : '';

Vue.config.productionTip = false

// global components
Vue.component('default-layout', require('./layouts/Default.vue').default)
Vue.component('channel-dashboard-layout', require('./layouts/ChannelDashboard.vue').default)

// global variable
Vue.prototype.$api_key = 'AIzaSyDeSxTCCjIY0GQGLLFsw7aZeZqtdiSvznI'

Vue.prototype.$error_type = {
  403: 'Quota exceeded for your API key. Buy more credit on your google account or retry tomorrow.',
  400: 'Channel not found. Please verify the channel id.'
}


new Vue({
  router,
  vuetify,
  render: function (h) { return h(App) }
}).$mount('#app')
