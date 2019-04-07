import Vue from 'vue';
import axios from 'axios';

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import 'iview/dist/styles/iview.css';
import './styles/common.css';
import 'jsoneditor/dist/jsoneditor.css';

import App from './App';
import router from './router';
import store from './store';
import db from './datastore';

if (!process.env.IS_WEB) Vue.use(require('vue-electron'));
Vue.http = Vue.prototype.$http = axios;
Vue.config.productionTip = false;

Vue.use(ElementUI);
Vue.prototype.$db = db;

Vue.use(require('vue-moment'));

let EventBus = new Vue();
Object.defineProperties(Vue.prototype, {
    $bus: {
        get: function() {
            return EventBus;
        }
    }
});

/* eslint-disable no-new */
new Vue({
    components: { App },
    router,
    store,
    template: '<App/>'
}).$mount('#app');
