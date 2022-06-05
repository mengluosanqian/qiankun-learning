// import Vue from 'vue';
// import dayjs from 'dayjs'
// import secret from './secret'
import bridge from './sdk-bridge'
// import axios from 'axios'


export default function appLogin() {
    return new Promise((resolve, reject) => {
        console.log('enter appLogin')
        const appId = "12526080-10027008";
        console.log("//////", appId);
        bridge.onError();
        bridge.getAuthCode(appId).then((authCode) => {
            console.log('authCode', authCode)
            resolve(authCode)
        })
        // let js_api_token = '';
        // axios.get(`/gateway/lanxin/jsapitoken`)
        //     .then(res => {
        //         console.log('/gateway/lanxin/jsapitoken', res)
        //         // const { code, data } = res;
        //         // if (code === '200000001') {
        //         js_api_token = res;
        //         const timestamp = dayjs().unix();
        //         const obj = {
        //             js_api_token,
        //             noncestr: "abc",
        //             timestamp,
        //             url: location.origin
        //         }
        //         const str = qs.stringify(obj);
        //         console.log('js_api_token', js_api_token)
        //         console.log('timestamp', dayjs().unix())
        //         console.log('url', location.origin)
        //         console.log('str', str)
        //         console.log('signature', secret.sha1(str))
        //         // bridge.config({
        //         //     debug: true,
        //         //     appId: appId, // 必填，应用的唯一标识
        //         //     timestamp: timestamp, // 必填，生成签名的时间戳，int型
        //         //     nonceStr: 'abc', // 必填，生成签名的随机串
        //         //     signature: secret.sha1(str)// 必填，签名
        //         // })
        //         bridge.onError();
        //         // bridge.ready().then(() => {
        //         bridge.getAuthCode(appId).then((authCode) => {
        //             console.log('authCode', authCode)
        //             resolve(authCode)
        //         })
        //         // })
        //         // }

        //     })
    })
}
