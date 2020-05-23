import Vue from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify';
import 'material-design-icons-iconfont/dist/material-design-icons.css'
import './assets/css/main.styl'
import axios from 'axios'

axios.defaults.baseURL = (process.env.NODE_ENV !== 'production') ? 'http://localhost:8081' : '';

Vue.config.productionTip = false

// global variable
Vue.prototype.$api_key = "AIzaSyDeSxTCCjIY0GQGLLFsw7aZeZqtdiSvznI"

new Vue({
  router,
  vuetify,
  render: function (h) { return h(App) }
}).$mount('#app')
