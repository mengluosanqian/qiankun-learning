import axios from 'axios'
import { insertScript } from '@/common/js/registrySystemElement.js'
import Notify from "@/common/services/notify";
import { isMobile } from "@/common/js/util";
export default {
    /**
     * 
     * @param obj  {
     *   debug: true,
     *   appId: '7553792-3735552', // 必填，应用的唯一标识
     *   timestamp: timestamp, // 必填，生成签名的时间戳，int型
     *   nonceStr: 'abc', // 必填，生成签名的随机串
     *   signature: secret.sha1(str)// 必填，签名
     * } 
     */
    config(obj) {
        console.log('lx.config')
        window.lx.config(obj);
    },
    ready() {
        console.log('before ready')
        return new Promise((resolve, reject) => {
            window.lx.ready(function (result) {
                resolve(result)
                console.log('lx.ready')
            })
        })
    },
    onError() {
        window.lx.error(function (res) {
            console.log('lx.error', res)
        });
    },
    getAuthCode(appId) {
        return new Promise((resolve, reject) => {
            window.lx.biz.getAuthCode({
                appId,
                success: function (res) {
                    const { authCode } = res

                    console.log('lx.getAuthCode.success')
                    console.log('res', res)
                    console.log('authCode', authCode)

                    resolve(authCode)

                },
                fail: function (err) {
                    reject(err)
                    console.log('lx.getAuthCode.fail')
                }
            });
        })
    },
    isInLanxin() {
        return window.navigator.userAgent.indexOf("es360messenger") > -1;
    },
    getLanxinAuthCode(next) {
        if (!this.isInLanxin()) {
            const fn = require("@/common/services/registry-system-element");
            fn.default(next);
        } else {
            this.onError();
            //15868416-5111808 绩效正式,12526080-10027008:绩效测试
             this.getAuthCode("12526080-10027008").then((authCode) => {
                axios
                    .get("/gateway/oauth2/lanxin/login", {
                        params: { code: authCode }
                    })
                    .then(res => {
                        const { code, data } = res;
                        if (code === 200) {
                            window.localStorage.setItem("token", data);
                            const fn = require("@/common/services/registry-system-element");
                            fn.default(next);
                            next();
                        }
                    });
            })
        }
    },
    downloadFile(url) {
        return new Promise((resolve, reject) => {
            console.log('lx downloadFile url', url)
            window.lx.utils.downloadFile({
                url,
                success: function (res) {
                    /**
              {
                localId: 'string' //文件下载后的本地id，用于文件预览，音频播放，图片查看等
              }
              */
                    const { localId } = res;
                    resolve(localId)
                    console.log("downloadFile", res);
                    console.log("localId", localId);

                },
                fail: function (err) {
                    console.log("lx downloadFile Fail", err);
                    reject(err)
                }
            });
        })
    },
    previewFile(localId, name = "", type = '') {
        window.lx.utils.previewFile({
            url: localId, //文件URL，或文件选择/下载后的localId，或mediaId(服务端API返回)
            name,
            size: 1000,
            type
        });
    }
    ,
    checkWhatsApp(ua='es360messenger'){
     return window.navigator.userAgent.indexOf(ua) > -1;
    },
    getQueryValue (queryName) {
        var query = decodeURI(window.location.search.substring(1));
        var vars = query.split("&");
        for (var i = 0; i < vars.length; i++) {
          var pair = vars[i].split("=");
          if (pair[0] == queryName) {
            return pair[1];
          }
        }
        return null;
    },
    async getThirdLoginList(cb) {
        const modelCode = this.getQueryValue('modelCode');
      axios.post('/execute/center/data/system/system/third_party_login/thirdLoginList').then( async resp => {
        const { code, data } = resp;
        const whatsApp = [];
        if (code === '200010000') {
          if(Array.isArray(data)) {
            let temp = false;
            for (let item of data) {
              const {code,ua} = item.login_source;
              if(this.checkWhatsApp(ua)){
                  whatsApp.push(item);
                  for (const v of item.params) {
                    if(v.param_key == 'modelCode' && modelCode == v.param_value){
                        temp = true;
                        window.thirdLoginObj = item;
                        return await this.queryJSSDK(code,cb);
                    }
                }
              }
            }
            if(!temp){
                if(whatsApp.length==1){
                    const {code} = whatsApp[0].login_source;
                    window.thirdLoginObj = whatsApp[0];
                    return await this.queryJSSDK(code,cb);
                }else{
                    cb&&cb();
                }
            }
          }else{
            cb&&cb();
          }
        }else{
            cb&&cb();
        }
      });
    },
    evelLoginJs(js_code,cb){
        if(js_code) {
            isMobile&&window.localStorage.removeItem("token");
            isMobile&&window.localStorage.removeItem("personalInfo");
            let compiledJs = js_code;
            if(window.Babel&&window.Babel.transform){
                compiledJs = window.Babel.transform(js_code, {
                    presets: ["env"]
                })
                .code;
            }
            if (compiledJs) {
                window.axios = window.axios?window.axios:axios;
                window.thirdLoginCB = cb;
                eval(`${compiledJs}`);
            }
        }else{
            cb&&cb();
        }
    },
    queryJSSDK(login_source,cb) {
      return axios.post('/execute/center/data/system/system/third_party_login/queryJSSDK', {
        login_source,
      }).then((resp) => {
        const { code, data } = resp;
        if (code === '200010000') {
          if(Array.isArray(data)&& data[0]) {
            let {sdk_path='',js_code=''} = data[0];
            if(sdk_path) {
                sdk_path = sdk_path.startsWith('/')?sdk_path:`/${sdk_path}`;
                insertScript(sdk_path, false, false, () => {this.evelLoginJs(js_code,cb)},() => {
                    Notify.error("SDK加载失败，请上传sdk");
                    this.evelLoginJs(js_code,cb);
                })
            }else{
                this.evelLoginJs(js_code,cb)
            }
          }else{
            cb&&cb()
          }
        }else{
            cb&&cb()
        }
      });
    }

}