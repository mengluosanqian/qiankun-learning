<template>
  <div class="content">
    <div class="right">
      <!-- <el-breadcrumb class="breadcrumb-style" separator="/">
        <el-breadcrumb-item>{{appZhName}}</el-breadcrumb-item>
        <el-breadcrumb-item>{{moduleZhName}}</el-breadcrumb-item>
      </el-breadcrumb>-->
      <div id="module-js"></div>
      <component v-if="component&&!unauth" :is="component"></component>
    </div>
    <yi-dong-duan-common-mobile-page v-if="unauth">
      <common-mobile-index-header title="暂无权限">
      </common-mobile-index-header>
      <template slot="body">
        <div  style="position: absolute;top: 50%;margin-top: -135px;"><img src="/images/unauth.png" /></div>
      </template>
    </yi-dong-duan-common-mobile-page>
  </div>
</template>
<script>
import {composeComponent} from "@/common/js/registrySystemElement";
import Notify from "@/common/services/notify";
import domMixin from "@/common/mixin/dom";
import { mapGetters, mapActions, mapMutations } from "vuex";
import { setTimeout } from "timers";
import { concatFileServerPrefix } from "./../../../common/js/config";
import Vue from "vue";
const storeMixin = {
  computed: {
    ...mapGetters([
      "menuList",
      "moduleCommonJsList",
      "moduleFileList",
      "cdnFileList",
      "modelCode"
    ])
  },
  methods: {
    ...mapActions([
      "getModuleList",
      "getPageList",
      "getMenuList",
      "getModuleCommonJsList",
      "getModuleFileList",
      "getCdnFileList"
    ]),
    ...mapMutations(["setModuleId"])
  }
};
export default {
  name: "oa.application",
  mixins: [storeMixin, domMixin],
  data() {
    return {
      commonModuleCompMap: {},
      activedMenuId: "",
      component: {
        template: "<div></div>"
      },
      selectedMenu: {},
      unauth:false,
      hasLoadCommonModule:{},
      currentModelCode:'',
    };
  },
  created() {
    this.getModuleCommon();
    this.init();
  },
  mounted() {},
  computed: {
    appZhName() {
      return this.$route.query.appZhName;
    },
    moduleZhName() {
      return this.$route.query.moduleZhName;
    }
  },
  methods: {
    async init() {
      const { appId, modelCode, menuId } = this.$route.query;
      if (menuId) {
        this.activedMenuId = menuId;
      }
      if(this.currentModelCode !== modelCode) {
        this.currentModelCode = modelCode;
        await this.onLoadModule(modelCode, appId);
        // 加载菜单
        this.$parent.getMenuList(appId, modelCode, true);
      } else {
        this.checkCurrentView(this.$parent.menuList);
      }
    },
    async onLoadModule(modelCode) {
      this.setModuleId(modelCode);

      // 加载模块公共js
      await this.getModuleCommonJsList(modelCode);
      // 加载模块第三方文件js、css
      await this.getModuleFileList(modelCode);
      // 加载模块CDN js、css
      await this.getCdnFileList(modelCode);
    },
    getModuleCommon() {
      this.hasLoadCommonModule[this.$route.query.modelCode] = true;
      return this.axios
        .get(`/pkc/page/all/type/${this.$route.query.modelCode}/3?compress=false`)
        .then(data => {
          if (data.code === "200010000") {
            if (!data.data.length) return;
            data.data.forEach(item => {
              composeComponent(item,resp=>{
                const {componentName,componentObj} = resp;
                this.commonModuleCompMap[componentName] = componentObj;
              })
            });
          }
        })
    },
    getSelectedMenu(list) {
      for (let i = 0; i < list.length; i++) {
        if (list[i].menuid === this.activedMenuId) {
          this.selectedMenu = list[i];
          return;
        }
        if (list[i].children.length > 0) {
          this.getSelectedMenu(list[i].children);
        }
      }
    },
    //加载某个菜单绑定的页面组件
    onLoadMenu(linkTargetId) {
      if (!linkTargetId) {
        Notify.warning("该菜单还没有配置页面!");
        return;
      }
      this.axios.get(`/pkc/page/${linkTargetId}?compress=false`).then(resp => {
        const { code, data } = resp;
        if (code === "200010000" && data) {
          this.loadPageComponent(data);
          setTimeout(()=>{
            const temp = document.getElementById('pkc-loading-contact');
            temp&&temp.remove();
          },0)
          return;
        }
        Notify.error("该菜单没有对应的页面组件");
      });
    },

    loadPageComponent(item) {
      composeComponent(item,resp=>{
        // try {
        //   if(this.component.name){
        //     const temp = document.querySelector(`style[system-component=${this.component.name}]`);
        //     temp&&temp.remove();
        //   }
        // } catch (error) {
        //     console.dir(error)
        // }
        const {componentName, componentObj} = resp;
        this.component = componentObj
      },this)
    },
    async checkCurrentView(list){
      if (Array.isArray(list) && list.length) {
        this.selectedMenu = {};
        this.getSelectedMenu(list);
        if(!this.hasLoadCommonModule[this.$route.query.modelCode]){
            await this.getModuleCommon();
          }
        if (this.$route.query.linkTargetId) {
          this.onLoadMenu(this.$route.query.linkTargetId);
          console.log("activedMenuId", this.activedMenuId);
          this.$store.commit("setDefaultActiveMenu", this.activedMenuId);
          return;
        }
        if (this.selectedMenu.menuid) {
          this.$store.commit("setDefaultActiveMenu", this.selectedMenu.menuid);
          this.onLoadMenu(this.selectedMenu.linkTargetId);
          return;
        }
        let { linkTargetId, menuid } = list[0];
        if (list[0].children && list[0].children.length > 0) {
          linkTargetId = list[0].children[0].linkTargetId;
          menuid = list[0].children[0].menuid;
        }
        if (linkTargetId) {
          this.onLoadMenu(linkTargetId);
          this.activedMenuId = menuid;
          this.$store.commit("setDefaultActiveMenu", this.activedMenuId);
        }
      }else{
        setTimeout(()=>{
            const temp = document.getElementById('pkc-loading-contact');
            temp&&temp.remove();
          },0)
          this.unauth=true;
        }
    }
  },
  watch: {
    // 根据选择的菜单id加载页面组件
     async "$parent.menuList"(list) {
       this.checkCurrentView(list);
    },
    // 加载模块公共js
    moduleCommonJsList(v) {
      if (!v.length) return;
      document.getElementById("module-js").innerHTML = "";
      v.forEach(item => {
        if (item.jsText) {
          this.loadScriptString(item.jsText);
        }
      });
    },
    // 加载模块第三方文件js、css
    moduleFileList(arr) {
      const jsfileDomList = document.querySelectorAll("script[modelCode]");
      const cssfileDomList = document.querySelectorAll("link[modelCode]");
      jsfileDomList.forEach(dom => {
        document.body.removeChild(dom);
      });
      cssfileDomList.forEach(dom => {
        document.head.removeChild(dom);
      });

      arr.forEach(file => {
        const { path, fileExt, modelCode } = file;
        // const url = `/pkc${path}`;
        const url = `${concatFileServerPrefix(path)}`;
        if (fileExt === "js") {
          this.insertScript(url, modelCode);
        }
        if (fileExt === "css") {
          this.insertLink(url, modelCode);
        }
      });
    },
    // 加载模块CDN
    cdnFileList(arr) {
      const jsfileDomList = document.querySelectorAll("script[cdn]");
      const cssfileDomList = document.querySelectorAll("link[cdn]");
      jsfileDomList.forEach(dom => {
        document.body.removeChild(dom);
      });
      cssfileDomList.forEach(dom => {
        document.head.removeChild(dom);
      });

      arr.forEach(file => {
        const { urlV, typeV, modelCode } = file;

        if (typeV === "js") {
          this.insertScript(urlV, modelCode, true);
        }
        if (typeV === "css") {
          this.insertLink(urlV, modelCode, true);
        }
      });
    },
    $route() {
      this.init();
    }
  }
};
</script>
<style lang="less">
html {
  font-size: 0.1333vw;
}
.content {
  .left {
    float: left;
    width: 200px;
    height: 100%;
    .el-menu {
      min-height: 100% !important;
    }
  }
  .right {
    height: 100%;
    // padding: 20px;
    .breadcrumb-style {
      padding: 10px 20px;
      margin-bottom: 10px;
    }
  }
}
.grid-content {
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.17);
  border-radius: 4px;
  border-top: none;
  margin: 0px 0px 22px 0px;
  padding: 0px 18px 4px 14px;
}

.grid-content .el-table td {
  border: none;
  font-size: 14px;
}

.grid-content .el-table th.is-leaf {
  border: none;
  font-size: 14px;
}

.grid-content .el-table::before {
  background-color: #ffffff;
}

.grid-content .el-table__header-wrapper {
  display: none;
}

.grid-content .table-head {
  font-size: 16px;
  padding-top: 13px;
}

.grid-content .refresh {
  float: right;
}

.grid-content img {
  vertical-align: middle;
  margin-right: 18px;
  margin-top: -2px;
}
</style>
