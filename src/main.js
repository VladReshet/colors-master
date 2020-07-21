import Vue from 'vue'
import App from './App.vue'
import router from './router'
import 'normalize.css'

Vue.config.productionTip = false

Vue.use({
    install (vue, options) {
        vue.prototype.$colors = {
            GREEN: '#5df55d',
            BLUE: '#5f5fff',
            RED: '#f75656',
            YELLOW: '#fbfb00',
            PURPLE: '#e064e0'
        };
    }
});

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
