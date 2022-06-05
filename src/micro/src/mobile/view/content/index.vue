<template>
  <div class="content" :style="{'padding-left':$store.state.oa.isCollapse?'60px':'200px'}">
    <div class="placetop-wrap">
      <div style="flex:1" v-for="(comp,i) in palceTopComponents" :key="i">
        <component class="item" :is="comp"></component>
      </div>
    </div>
    <div class="right clearfix">
      <div class="left-drag">
        <draggable
          class="drag-wrapper"
          v-model="componentsLeft"
          :disabled="!isPageConfig"
          draggable=".item-move"
          v-bind="{
          animation: 500,
          ghostClass: 'ghost',
          handle:'.handle',
          group: 'same'
}"
        >
          <div
            v-for="(comp,i) in componentsLeft"
            :key="i+1"
            :class="['handle',comp.unitMove === 0 ? '':'item-move']"
          >
            <i v-show="isPageConfig && comp.unitMove !== 0" class="el-icon-rank rank-position"></i>
            <component class="item" :is="comp"></component>
          </div>
        </draggable>
      </div>
      <div class="right-drag">
        <draggable
          class="drag-wrapper"
          v-model="componentsRight"
          :disabled="!isPageConfig"
          draggable=".item-move"
          v-bind="{
          animation: 500,
          ghostClass: 'ghost',
          handle:'.handle',
          group: 'same'
}"
        >
          <div
            v-for="(comp,i) in componentsRight"
            :key="i+1"
            :class="['handle',comp.unitMove === 0 ? '':'item-move']"
          >
            <i v-show="isPageConfig && comp.unitMove !== 0" class="el-icon-rank rank-position"></i>
            <component class="item" :is="comp"></component>
          </div>
        </draggable>
      </div>
      <span v-for="(comp,i) in components" v-html="`<style>${comp['moveCss']}</style>`" :key="i"></span>
    </div>
    <div class="page-config-panel" v-if="isPageConfig">
      <div class="item">
        <div class="item-img" @click="onConfigFinish">
          <i class="el-icon-check green"></i>
        </div>
        <div class="item-text">完成</div>
      </div>
      <div class="item" @click="onConfigAdd">
        <div class="item-img">
          <i class="el-icon-plus blue"></i>
        </div>
        <div class="item-text">编辑</div>
      </div>
      <div class="item" @click="onConfigCancel">
        <div class="item-img">
          <i class="el-icon-close red"></i>
        </div>
        <div class="item-text">放弃</div>
      </div>
    </div>
    <el-drawer title="首页组件列表" :visible.sync="showDrawer" :direction="direction" ref="drawer">
      <div class="drawer-body">
        <div class="item">
          <el-checkbox-group v-model="checkedComponentsIds">
            <el-checkbox v-for="(item,i) in allComponents" :key="i" :label="item.id">{{ item.name }}</el-checkbox>
          </el-checkbox-group>
        </div>
        <div class="drawer-footer">
          <el-button @click="onPageConfigAddCancel">取 消</el-button>
          <el-button
            type="primary"
            @click="onPageConfigAddConfirm"
            :loading="pageConfigAddloading"
          >{{ pageConfigAddloading ? '提交中 ...' : '确 定' }}</el-button>
        </div>
      </div>
    </el-drawer>
  </div>
</template>
<script>
import Notify from "@/common/services/notify";
import domMixin from "@/common/mixin/dom";
import { mapGetters, mapActions, mapMutations } from "vuex";
const storeMixin = {
  computed: {
    ...mapGetters([
      // "menuList",
      "moduleCommonJsList",
      "moduleFileList",
      "modelCode",
      "isMenuOpen",
      "isPageConfig"
    ])
  },
  methods: { ...mapActions([]), ...mapMutations(["setIsPageConfig"]) }
};
export default {
  id: "bbbb",
  name: "oa.content",
  mixins: [storeMixin, domMixin],
  data() {
    return {
      pageConfigAddloading: false,
      showDrawer: false,
      direction: "rtl",
      dialogVisible: false,
      appmodules: [],
      components: [], //首页组件
      palceTopComponents: [], //顶置的首页组件
      componentsLeft: [],
      componentsRight: [],
      componentsClone: [], //首页组件-初始状态
      allComponents: [], //编辑页面-所有首页组件
      checkedComponentsIds: [], //编辑页面-已选的首页组件
      checkedComponentsIdsClone: [], //编辑页面-已选的首页组件-初始状态
      value: ""
    };
  },
  components: {},
  mounted() {
    //this.onClickMenu();
    this.fetchHomePage();
    this.getAppModules();
    console.log("bbbb", this.$options);
  },
  methods: {
    // 配置完成-新增的组件
    onConfigFinish() {
      const compIdsLeft = this.componentsLeft.map(item => {
        return { id: item.id, direction: 0 };
      });
      const compIdsRight = this.componentsRight.map(item => {
        return { id: item.id, direction: 1 };
      });
      const compIdsTop = this.palceTopComponents.map(item => {
        return { id: item.id };
      });
      const compIds = compIdsLeft.concat(compIdsRight).concat(compIdsTop);
      const compCloneIds = this.componentsClone.map(item => {
        return { id: item.id, direction: item.direction };
      });
      const param = { sort: compIds, refer: compCloneIds };

      this.axios.put(`/pkc/home`, param).then(resp => {
        console.log(resp);
        this.fetchHomePage();
        this.setIsPageConfig(false);
        Notify.success("成功完成页面设置！");
      });
    },
    onConfigAdd() {
      this.axios.get(`/pkc/home/allData`).then(resp => {
        console.log(resp);
        const { code, data } = resp;
        if (code === "200010000") {
          this.allComponents = data;
          const compIds = this.componentsClone.map(item => {
            return item.id;
          });
          this.checkedComponentsIds = compIds;
          this.checkedComponentsIdsClone = compIds;
          this.$forceUpdate();
          this.showDrawer = true;
        }
      });
    },
    onConfigCancel() {
      this.$confirm("确定放弃本次编辑？")
        .then(() => {
          this.fetchHomePage();
          this.setIsPageConfig(false);
        })
        .catch(() => {});
    },
    onPageConfigAddCancel() {
      this.showDrawer = false;
    },
    onPageConfigAddConfirm() {
      this.pageConfigAddloading = true;

      const origin = this.checkedComponentsIdsClone;
      const now = this.checkedComponentsIds;
      const deleteIds = origin
        .concat(now)
        .filter(v => origin.includes(v) && !now.includes(v));
      const addIds = now
        .concat(origin)
        .filter(v => now.includes(v) && !origin.includes(v));
      console.log("addIds", addIds);
      console.log("deleteIds", deleteIds);

      const param = {
        aIds: addIds, //新增的组件
        dIds: deleteIds //删除的组件
      };
      this.axios.post(`/pkc/home`, param).then(resp => {
        console.log(resp);
        this.fetchHomePage().then(() => {
          this.pageConfigAddloading = false;
          this.showDrawer = false;
          Notify.success("页面组件编辑成功！");
        });
      });
    },
    handleIsMenuOpen(flag) {
      this.$store.commit("setIsMenuOpen", flag);
    },
    handleShowDialog() {
      this.dialogVisible = true;
    },
    handleAddModuleSubmit() {
      this.dialogVisible = false;
    },
    handleAddModuleClose() {
      this.dialogVisible = false;
    },
    // 获取首页组件列表
    fetchHomePage() {
      this.components = [];
      this.componentsLeft = [];
      this.componentsRight = [];
      this.palceTopComponents = [];
      this.componentsClone = [];

      return this.axios.get(`/pkc/home/all`).then(resp => {
        const { code, data } = resp;
        if (code === "200010000") {
          data.forEach(item => {
            this.onLoadPage(item);
          });
        }
      });
    },
    onLoadPage(item) {
      if (item) {
        var {
          id,
          moveJs,
          moveCss,
          moveHtml,
          componentName,
          unitMove,
          direction,
          path
        } = item;
      }
      const component = {
        name: componentName,
        template: moveHtml,
        path: path,
        moveCss: moveCss,
        id,
        unitMove,
        direction
      };
      // 转译ECMAScript 2015+ 语法
      let compiledJs = moveJs;
      if(window.Babel&&window.Babel.transform){
          compiledJs = window.Babel.transform(moveJs, {
              presets: ["env"]
          })
          .code;
      }
      if (compiledJs) {
        eval(`${compiledJs};window.obj = obj`);
        if (component.name === "common-modules") {
          this.palceTopComponents.push({
            ...component,
            ...window.obj
          });
        } else {
          this.components.push({
            ...component,
            ...window.obj
          });
        }
      } else {
        if (component.name === "common-modules") {
          this.palceTopComponents.push(component);
        } else {
          this.components.push(component);
        }
      }
      this.componentsClone = [...this.components, ...this.palceTopComponents];

      const left = this.components.filter(item => item.direction === 0);
      const right = this.components.filter(item => item.direction === 1);
      this.componentsLeft = [...left];
      this.componentsRight = [...right];

      this.$forceUpdate();
    },
    getAppModules() {
      this.axios.post(`/pkc/user/myAppModuleTree`).then(resp => {
        if(resp){
          const { code, data } = resp;
          if (code === "200010000") {
            this.appmodules = data;
          }
        }
      });
    }
  }
};
</script>
<style scoped lang="less">
@import url("../../components/common/css/home.less");
.content {
  background: rgba(249, 249, 249, 1);
  .placetop-wrap {
    display: flex;
  }
  .right {
    width: 100%;
    display: flex;
    .drag-wrapper {
      min-height: 200px;
    }
    .left-drag {
      box-sizing: border-box;
      flex: 2;
      max-width: 66.6%;
      padding-right: 20px;
      padding-left: 20px;
    }
    .right-drag {
      box-sizing: border-box;
      flex: 1;
      max-width: 33.3%;
      padding-right: 18px;
    }
  }
}
.clearfix:after {
  content: " ";
  clear: both;
}
.content .left .person-info .info .place,
.content .left .person-info .info .position {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 80px;
}
.rank-position {
  color: #f56c60;
  position: absolute;
  right: 0;
  z-index: 2;
  font-weight: bold;
  font-size: 20px;
  cursor: pointer;
}
.handle {
  position: relative;
}

.page-config-panel {
  display: flex;
  justify-content: space-around;
  align-items: center;
  background: rgba(0, 0, 0, 0.6);
  border-radius: 2px 0px 0px 0px;
  position: fixed;
  bottom: 0;
  right: 0;
  width: 175px;
  height: 78px;
  .item {
    cursor: pointer;
  }
  .item-img {
    font-weight: bold;
    text-align: center;
    line-height: 30px;
    width: 30px;
    height: 30px;
    background: rgba(255, 255, 255, 1);
    border-radius: 50%;
  }
  .item-text {
    font-weight: 400;
    color: rgba(255, 255, 255, 0.56);
  }
  .green {
    color: #6dd400;
    font-weight: bold;
  }
  .blue {
    color: #1262d5;
    font-weight: bold;
  }
  .red {
    color: #f56c60;
    font-weight: bold;
  }
}
/*抽屉*/
.el-drawer {
  overflow: auto;
}

/deep/ .el-drawer__header {
  margin-bottom: 0px !important;
}

/deep/ .el-drawer__body {
  position: relative;
  padding-bottom: 60px;
  .el-divider--horizontal {
    margin: 8px 0px -10px 20px;
  }
  .el-checkbox {
    width: 118px;
    margin-left: 20px;
    padding: 8px 0px 8px 8px;
    border: 1px solid #dcdfe6;
    margin-right: 0px;
    margin-top: 20px;
    box-sizing: border-box;
  }
  .el-checkbox__label {
    padding-left: 6px;
  }
  .item {
    margin-top: 20px;
  }
}
.drawer-body {
  padding-right: 10px;
}
.el-divider--horizontal {
  margin: 10px 0 0 0;
}

.drawer-footer {
  position: absolute;
  left: 20px;
  bottom: 10px;
}
</style>