<template>
  <div id="main-root">
     <div id="root-view" class="app-view-box" v-html="content"></div>
  </div>
</template>

<script>
export default {
  name: "App",
  props: {
    loading: Boolean,
    content: String
  }
};
</script>
<style >
#main-root {
  height: 100%;
  width: 100%;
}
.app-view-box{
  width: 100%;
  height: 100%;
}
.app-view-box>div{
  width: 100%;
  height: 100%;
}
</style>