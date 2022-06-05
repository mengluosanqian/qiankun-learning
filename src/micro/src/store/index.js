import Vue from 'vue';
import Vuex from 'vuex'; //引入 vuex

import app from './modules/app.js';
import oa from './modules/oa.js';
import dev from './modules/dev.js';
import search from './modules/search.js';
import getters from './getters'
Vue.use(Vuex); //使用 vuex

/** mutation、getter、action 默认是注册在全局store的，访问时不需要指定模块名。state需要 */
export default new Vuex.Store({
    modules: {
        app,
        oa,
        dev,
        search,
    },
    getters
})