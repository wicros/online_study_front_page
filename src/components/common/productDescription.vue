<template>
  <div class="container">
    <h2 class="title">{{title}}</h2>
    <div v-html="text" class="content"></div>
  </div>
</template>

<script>
export default {
  props: ["title","text"],
  data() {
    return {
      defaultImg: 'this.src="' + require("../../images/7.png") + '"'
    };
  }
};
</script>

<style lang="less" scoped>
  .container {
    padding: 30px 0;
  }

  .title {
    font-size: 24px;
  }

  .content {
    margin-top: 30px;
    min-height: 100px;
    font-size: 16px;
  }

  @media screen and (max-width: 992px) {
    .container {
      padding-left: 10px;
      padding-right: 10px;
    }
  }

  @media screen and (min-width: 992px) {
    .container {
      width: 1040px;
      min-width: 1040px;
      margin-left: auto;
      margin-right: auto;
    }
  }
</style>
