<template>
  <div class="out-application">
    <iframe width="100%" height="100%" scrolling="yes" :src="url" frameborder="0"></iframe>
  </div>
</template>

<script>
export default {
  data() {
    return {
      url: ""
    };
  },
  created() {
    this.url = this.$route.query.url;
  },
  watch: {
    $route() {
      this.url = this.$route.query.url;
    }
  }
};
</script>
<style scoped lang="less">
.out-application {
  height: calc(100% - 56px);
  padding-top: 56px;
}
</style>