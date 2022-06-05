// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import VueRouter from "vue-router";
import routes from './router';
import store from './store';
import './global-config/resouce.js';
import notify from '@/common/services/notify'
import $ from 'jquery';
window.$ = $;
window.globalVue=Vue;
//自定义组件名
import './public-path'

Vue.config.productionTip = false;

import {
    axiosConfig,
    //elementConfig,
    //cestcConfig,
    vantConfig,
    componentsMount,
    //methodsMount
} from './global-config';
//elementConfig(Vue); // 引入element
//cestcConfig(Vue); // 引入cestc
vantConfig(Vue); //引入vant
axiosConfig(Vue, store); // 引入axios，配置
componentsMount(Vue); // 全局组件挂载
//methodsMount(Vue); // 全局方法挂载
/* eslint-disable no-new */
Vue.use(VueRouter)
let router = null;
let instance = null;
Vue.prototype.$message = notify;
Vue.prototype.$msg = notify;


/**
 * ---------------工具函数-----------------
 */
import { changePage } from '@/common/js/util.js';
import utils from '@/global-config/utils';

const original = VueRouter.prototype.replace;
VueRouter.prototype.replace = function replace(location) {
   return original.call(this, location).catch(err => err)
}



function render(path) {
	router = new VueRouter({
		base: window.__POWERED_BY_QIANKUN__ ? path : '/',
		mode: 'history',
		routes,
	});
	instance = new Vue({
		router,
		store,
		render: h => h(App),
	}).$mount('#app');


	Vue.prototype.$changePage = changePage(router);

	Vue.prototype.$HttpServiceInvoke = function(url, params, isJflow) {
		let apiPrefix = `/execute/center/data/${this.$options.path}`;
		// 对于blob文件格式，做特殊的处理
		if (params && params.blob === true) {
			const search = this.$route.query;
			const {
				appId,
				modelCode,
			} = search;
			const appCodeMap = JSON.parse(window.localStorage.getItem('appCode')) || {};
			const appCode = (appCodeMap[appId] || {}).appCode || '';
			apiPrefix = `/execute/center/data/${appCode}/${modelCode}/`;
		}
		// 使用/system/system
		if (isJflow) {
			apiPrefix = `/execute/center/data/`;
		}
		return Vue.axios.post(apiPrefix + url, params);
	};

	Vue.prototype.$objectToQueryString = (obj) => {
		return Object.keys(obj)
			.map(function(key) {
				return ""
					.concat(encodeURIComponent(key), "=")
					.concat(encodeURIComponent(obj[key]));
			})
			.join("&");
	}


}
Vue.prototype.$utils = utils;

if (!window.__POWERED_BY_QIANKUN__) {
	render();
}

export async function bootstrap() {
}

export async function mount(props) {
	const path = props.activeApp.activeRule; 
	render(path);
}

export async function unmount() {
	instance.$destroy();
	instance = null;
	router = null;
}

