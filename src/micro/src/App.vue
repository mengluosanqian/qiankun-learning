<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: "App",
  created() {
    // 在页面加载时读取sessionStorage里的状态信息
    if (sessionStorage.getItem("store") ) {
      this.$store.replaceState(Object.assign({}, this.$store.state,JSON.parse(sessionStorage.getItem("store"))))
    }
    // 全局配置
    window.CAS_PREFIX = process.env.VUE_APP_CAS_PREFIX;
    window.COMMON_SERVER_PREFIX = process.env.VUE_APP_COMMON_SERVER_PREFIX;
    window.FILE_SERVER_PREFIX = process.env.VUE_APP_FILE_SERVER_PREFIX;

    // 在页面刷新之前将vuex里的信息保存到sessionStorage里
    window.addEventListener("beforeunload",()=>{
      sessionStorage.setItem("store",JSON.stringify(this.$store.state))
    })
  },
  mounted(){
    this.$utils.getGaoWeiJs();
    window.addEventListener("storage", (e)=>{
      const pathname = window.location.pathname;
      if(e.key == 'token'&&(!pathname.startsWith('/login')&&!pathname.startsWith('/mobile')&&!pathname.startsWith('/open'))){
        if(!window.userChangeshowRefresh){
          window.userChangeshowRefresh=true;
          this.$confirm('检测到登录信息发生改变，请刷新页面', '提示', {
            confirmButtonText: '重新加载',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            window.location.reload();
          }).catch(() => {
            window.userChangeshowRefresh=false;
          });
        }
      }
    });
  }
};
</script>
<style lang="less">
html,
body {
  margin: 0;
  padding: 0;
}
html,
body {
  height: 100%;
}

#app {
  height: 100%;
}

.text-center {
  text-align: center;
}

a {
  text-decoration: none;
  color: #409eff;
  cursor: pointer;
}

p {
  margin: 0;
}

.ellipsis {
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}

.pull-left {
  float: left;
}

.pull-right {
  float: right;
}
.clear:after{
  content:"";
  display:block;
  clear:both;
}
* {
  outline: none;
}
.top-20 {
  margin-top: 20px;
}
.content-block {
  height: 100%;
  padding-top: 55px;
  box-sizing: border-box;
}
.el-table::before {
  height: 0 !important;
}
.el-table.el-table--border {
  border-bottom: 1px solid #ebeef5;
}
code {
  padding: 2px 4px;
  font-size: 90%;
  color: #c7254e;
  background-color: #f9f2f4;
  border-radius: 4px;
}
pre {
  white-space: pre-wrap;
}
::-webkit-scrollbar-track-piece {
  /* background-color: #fff; */
  border-radius: 0;
}
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
::-webkit-scrollbar-thumb {
  height: 50px;
  background-color: #b8b8b8;
  border-radius: 4px;
  /* outline: 2px solid #fff; */
  /* outline-offset: -2px; */
  /* border: 1px solid #fff; */
  -moz-opacity: 0.5;
  -khtml-opacity: 0.5;
  opacity: 0.5;
}
::-webkit-scrollbar-thumb:hover {
  height: 50px;
  background-color: #b8b8b8;
  border-radius: 4px;
}

.yban-container-m {
  pointer-events: none;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 99999;
  text-align: center;
  overflow: hidden;
  font-size: 32px;
  color: #000;
  & > div {
    transform: rotate(-25deg);
    -webkit-transform: rotate(-25deg);
    -moz-transform: rotate(-25deg);
    -o-transform: rotate(-25deg);
    -ms-transform: rotate(-25deg);
    position: absolute;
    opacity: 0.005;
  }
}
</style>