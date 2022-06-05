<template>
  <div class="oa">
    <router-view />
  </div>
</template>

<script>
import qs from 'qs';
import "../common/ui-lib/element";
import Notify from "@/common/services/notify";
import router from "../router/index.js";
import { insertScript } from '@/common/js/registrySystemElement.js'
import { mapGetters, mapActions, mapMutations } from "vuex";
import watermark from "@/common/services/watermark";
import axios from "axios";
import bridge from "@/mobile/components/common/services/sdk-bridge";
// import store from "@/store";
// import { Popup } from "vant";
const storeMixin = {
  computed: {
    ...mapGetters(["moduleList"]),
  },
  methods: {
    ...mapActions([
      "getModuleList",
      "getPageList",
      "getModuleCommonJsList",
      "getModuleFileList",
    ]),
    ...mapMutations(["setModuleId", "setIsPageConfig"]),
  },
};
export default {
  components: {
    // "van-popup": Popup
  },
  mixins: [storeMixin],
  data() {
    return {
      show: true,
      activedModuleId: "",
      router: router,
      info: "",
      select: "",
      isMenuOpen: true,
      appmodules: [],
      showAppList: false,
      activeAppName: "所有应用",
      menuList: [],
      colorList: [
        "background:#28afd1",
        "background:#2C82FF",
        "background:#44BF97",
        "background:#F5A623",
        "background:#E24F4F",
      ],
      component: '',
      userInfo:null,
    };
  },
  mounted() {
    // this.getAppModules();
    //this.getUserInfo();
    if (!this.isApplication) {
      this.getMenuList();
    }
    console.log("window.VConsoleFlag", window.VConsoleFlag);
    if (window.VConsoleFlag) {
      setTimeout(()=>{
        insertScript('/resources/vconsole.min.js',false,false,()=>{
          new window.VConsole();
        })
      },0)
    }
  },
  methods: {
    // async authLogin() {
    //   new window.VConsole();
    //   const authCode = await appLogin();
    //   this.axios
    //     .get("/gateway/oauth2/lanxin/login", {
    //       params: { code: authCode }
    //     })
    //     .then(res => {
    //       const { code, data } = res;
    //       console.log("/gateway/lanxin/login", res);
    //       if (code === 200) {
    //         window.localStorage.setItem("token", data);
    //         this.getAppModules();
    //         this.getUserInfo();
    //         const fn = require("@/common/services/registry-system-element");
    //         fn.default(function() {
    //           console.log("lanxin");
    //         });
    //         if (!this.isApplication) {
    //           this.getMenuList();
    //         }
    //       }
    //     });
    // },
    onClickApp(data, item) {
      //将当前的menu置为空对象
      this.$store.commit("setCurrentActiveMenu", {});
      //1外部应用 0内部应用
      if (data.origin) {
        if (!data.webAccessPath) {
          Notify.warning("该模块没有配置外部地址链接");
        } else {
          this.activeAppName = data.funcgroupname;
          this.$changePage(data.webAccessPath);
          this.showAppList = false;
          this.activedModuleId = data.funcgroupCode;
        }
      } else {
        this.activeAppName = data.funcgroupname;
        this.jumpToApp(
          item.appid,
          data.funcgroupCode,
          "",
          item.appName,
          data.funcgroupname
        );
      }
    },
    back() {
      this.$router.push({ path: "/content" });
    },
    onCommand(v) {
      if (v === "pageConfig") {
        this.setIsPageConfig(true);
      }
      if (v === "logout") {
        this.logout();
      }
    },
    logout() {
      var _self = this;
      this.$confirm("此操作将登出当前用户, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        _self.sendLoginout();
      });
    },
    sendLoginout() {
      window.localStorage.removeItem("token");
      window.localStorage.removeItem("personalInfo");
      const url = `/gateway/logout?service=${location.origin}`;
      window.open(url, "_self");
    },
    handleIsMenuOpen(flag) {
      this.$store.commit("setIsCollapse", flag);
    },
    //跳转内部应用
    jumpToApp(appid, funcgroupCode, menuid, appName, moduleName, linkTargetId) {
      this.$store.commit("setCurrentActiveMenu", { menuid, linkTargetId });
      this.activedModuleId = funcgroupCode;
      if (appName) {
        this.activeAppName = appName;
      }
      this.showAppList = false;
      this.$changePage({
        appId: appid,
        modelCode: funcgroupCode,
        menuId: menuid,
        appZhName: appName,
        moduleZhName: moduleName,
      });
      this.handleIsMenuOpen(true);
    },
    getMenuList(appid, funcgroupCode, isApplication) {
      !this.userInfo&&this.getUserInfo();
      const params = { appid, funcgroupCode };
      let method = "get";
      let url = "/pkc/user/homePageCustomMenuTree";
      //在内部应用下
      if (isApplication) {
        method = "post";
        url = "/permission/v1/user/mobileEndAuthorityCustomMenuTree";
      }
      this.axios({
        method: method,
        url: url,
        data: method === "post" ? params : { params },
      }).then((resp) => {
        if(resp){
          const { code, data } = resp;
          if (code.startsWith('200')) {
            this.menuList = data;
          }
        }
      });
    },
    getAppModules() {
      this.axios.post(`/pkc/user/myAppModuleTree`).then((resp) => {
        const { code, data } = resp;
        if (code === "200010000") {
          this.appmodules = data;
        }
      });
    },
    getUserInfo() {
      this.axios.post(`/pkc/user/getLoginUserInfo`).then((resp) => {
        const { code, data } = resp;
        if (code === "200010000") {
          this.$store.commit("setUserInfo", data);
          window.localStorage.setItem("personalInfo", JSON.stringify(data));
          watermark&&watermark(data.userName);
          this.userInfo = data;
        }
      });
    },
    transMenuListKey(data) {
      data.title = data.appName;
      for (var i = 0; i < data.children.length; i++) {
        if (data.children[i] && data.children[i].length > 0) {
          this.transMenuListKey(data.children[i]);
        }
      }
    }
  },

  computed: {
    isApplication() {
      return this.$route.path.includes("/application");
    },
    isOutApplication() {
      return this.$route.path === "/out-application";
    },
  },
  watch: {
    $route(v) {
      if (!this.isApplication) {
        this.getMenuList();
      }
      if (v.path === "/content") {
        this.activeAppName = "所有应用";
        this.activedModuleId = "";
      }
    },
  },

  async beforeRouteEnter(to, from, next) {
    const pathName = window.location.pathname;
    if(pathName.startsWith('/open')){
      const origin = `${window.location.origin}/main`;
      const params = {
          headers: {
              "Content-Type": "application/x-www-form-urlencoded"
          },
          withCredentials: true
      };
      const tgt = await axios.post(
          "/cas/v1/tickets",
          qs.stringify({
              username: "hdbmzh",
              password: window.hdbmzh||"Z6d1_f8q9"
          }),
          params
      );
      if (!tgt) {
          Notify.error('用户名或密码错误', '登录失败', 'top-right');
          this.loading = false;
          return;
      }
      // 2.获取st
      const st = await axios.post(
          `/cas/v1/tickets/${tgt}`,
          qs.stringify({
              service: origin
          }),
          params
      );
      if (!st) {
          Notify.error('用户名或密码错误', '登录失败', 'top-right');
          this.loading = false;
          return;
      }
      // 3.获取token
      const {
          code,
          data
      } = await axios.get(
          `/gateway/validTicket?ticket=${st}`, {
              params: {
                  service: origin
              }
          }
      );
      if (code === 200) {
          const token = data;
          if (!token) {
              this.loading = false;
              Notify.error('用户名或密码错误', '登录失败', 'top-right');
              return;
          }
          window.localStorage.setItem('token', token);
          const fn = require("@/common/services/registry-system-element");
          fn.default(next);
      }
    }else{
      const token = to.query.token;
      if (token) {
        window.localStorage.setItem("token", token);
      }
      await bridge.getThirdLoginList(()=>{
        const fn = require("@/common/services/registry-system-element");
        fn.default(next);
      });
    }
  },
};
</script>
<style lang="less">
.all-app-modules-pop {
  padding: 0;
  .pointer {
    cursor: pointer;
  }
}
</style>
<style scoped lang="less">
@import url("./components/common/css/home.less");
@import url("../common/css/header.less");
@import url("../common/css/menu.less");
/deep/ .menu-wrapper {
  .el-menu-tree {
    width: 0px;
  }
  .open {
    background: rgba(0, 0, 0, 0.25);
    border-top-right-radius: 10px;
    border-bottom-right-radius: 10px;
    transition: all 0.3s;
  }
}
.oa {
  height: 100%;
  position: relative;
  .user-info {
    .header {
      vertical-align: middle;
      margin-right: 10px;
    }
  }
  .home {
    position: relative;
    top: 1px;
    right: 5px;
    width: 17px;
    height: 16px;
  }
}
/deep/ .el-card__body {
  position: relative;
}
.content {
  // padding-top: 56px;
  background: rgba(249, 249, 249, 1);
  box-sizing: border-box;
}
.app-modules {
  height: 336px;
  overflow: auto;
  padding: 12px;
}
.app-modules .item {
  margin-bottom: 14px;
}
.app-modules .el-divider--horizontal {
  margin: 6px 0 10px 0;
}
.app-modules .wrapper {
  display: flex;
  width:300px;
  height: auto;
  background: transparent;
  flex-wrap: wrap;
  .module-item {
    width: 30%!important;
    height: 72px!important;
    padding-top: 6px;
    text-align: center;
    position: relative;
    color: #fff;
    border-radius: 4px;
    &:not(:nth-child(3n)) {
      margin-right: 10px;
      margin-bottom: 10px;
    }
    .icon {
      font-size: 30px;
    }
    p {
      padding-top: 4px;
      font-size: 12px;
    }
    .mask {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 92px;
      height: 78px;
      position: absolute;
      top: 0;
      background: rgba(255, 255, 255, 0.5);
      .el-icon-success {
        font-size: 40px;
        color: #00b39e;
      }
    }
  }
}
.mr24 {
  margin-right: 24px;
}
</style>