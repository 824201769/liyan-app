import App from './App'
import uView from '@/uni_modules/uview-ui'
import {
	toPath
} from "@/common/index.js";
import MescrollMixin from '@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js';
// #ifndef VUE3
import Vue from 'vue'
Vue.config.productionTip = false
App.mpType = 'app'
Vue.mixin(MescrollMixin);
Vue.prototype.$toPath = toPath
const app = new Vue({
    ...App
})
require('./common/request.js')(app)
app.$mount()
// #endif
Vue.use(uView)
// #ifdef VUE3
import { createSSRApp } from 'vue'
export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}
// #endif