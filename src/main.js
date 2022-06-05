import Vue from 'vue'
import App from './App.vue'
import { registerMicroApps, setDefaultMountApp, start } from 'qiankun'
import config from '../config/'
window.pkcSubAPPConfig = {'main':{
  entry:window.location.origin,
  port:window.location.port
}};
Vue.config.productionTip = false
let app = null
/**
 * 渲染函数
 * appContent 子应用html内容
 * loading 子应用加载效果，可选
 */
function render ({ appContent, loading } = {}) {
  if (!app) {
    app = new Vue({
      el: '#container',
      data () {
        return {
          content: appContent,
          loading
        }
      },
      render (h) {
        return h(App, {
          props: {
            content: this.content,
            loading: this.loading
          }
        })
      }
    })
  } else {
    app.content = appContent
    app.loading = loading
  }
}

/**
 * 路由监听
 * @param {*} routerPrefix 前缀
 */
function genActiveRule (routerPrefix) {
  return location => location.pathname.startsWith(routerPrefix)
}

function initApp () {
  render({ appContent: '', loading: true })
}

initApp()

// 注册子应用
const hostname = window.location.hostname;
const microApps = config.subAPP.map(item => {
  const { name, port, activeRule,host } = item
  const origin = window.location.origin;
  window.pkcSubAPPConfig[item.name] = {...item,entry:`http://${host||hostname}:${port}/`}
  return {
    name,
    //entry:`http://${host||hostname}:${port}`,
    entry:(hostname == 'localhost'||hostname == '127.0.0.1')?`http://${host||hostname}:${port}/`:`${origin}/${item.name}/`,
    render,
    activeRule: genActiveRule(activeRule),
    props: {
      activeApp:item
    }
  }
})
registerMicroApps(microApps, {
  beforeLoad: [
    app => {
      console.log('before load', app)
    }
  ], // 挂载前回调
  beforeMount: [
    app => {
      console.log('before mount', app)
    }
  ], // 挂载后回调
  afterUnmount: [
    app => {
      console.log('after unload', app)
    }
  ] // 卸载后回调
})

// 设置默认子应用,与 genActiveRule中的参数保持一致
const getQueryString = (name)=> {
  var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
  var r = location.search.substr(1).match(reg);
  if (r != null) {
      return unescape(r[2]);
  }
  return null;
}
const token = window.localStorage.getItem('token')
if (token&&token!=='null') {
  const roleName = window.localStorage.getItem('roleName')
  switch (roleName) {
    case 'adminEnd':
      setDefaultMountApp('/portal')
      break
    case 'devEnd':
      setDefaultMountApp('/dev')
      break
    case 'userEnd':
      setDefaultMountApp('/portal')
      break
  }
} else {
  const token = getQueryString('token')||getQueryString('thirdSign')
  if(token){
    let temp = false;
    for (const item of config.subAPP) {
      const { activeRule } = item
      if (location.pathname.startsWith(activeRule)) {
        setDefaultMountApp(activeRule)
        temp = true;
        break
      }
    }
    if (!temp) {
      setDefaultMountApp('/login')
    }
  }else{
    let temp = false;
    for (const item of config.subAPP) {
      const { activeRule, auth } = item
      if (!auth && location.pathname.startsWith(activeRule)) {
        setDefaultMountApp(activeRule)
        temp = true;
        break
      }
    }
    if (!temp) {
      setDefaultMountApp('/login')
    }
  }
}

// 启动
start({
  prefetch: false,
  singular: true,
  sandbox:false,
  fetch: window.fetch,
  getPublicPath:(entry) => entry,
  excludeAssetFilter: assetUrl => {
    const whiteList = []
    const whiteWords = ['http://127.0.0.1:9889/register','http://127.0.0.1:9889/verify','http://127.0.0.1:9889/get','http://127.0.0.1:9889/voice']
    if (whiteList.includes(assetUrl)) {
      return true
    }
    return whiteWords.some(w => {
      return assetUrl.includes(w)
    })
  }
})
