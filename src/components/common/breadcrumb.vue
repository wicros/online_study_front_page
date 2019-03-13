<template>
  <el-breadcrumb class="layer breadcrumb-navigator" separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{path: '/'}">{{$t('m.homePage')}}</el-breadcrumb-item>
    <el-breadcrumb-item v-for="(item, index) in breadcrumbs" :key="index">{{item}}</el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script>
import { mapState, mapMutations, mapGetters } from "vuex";
export default {
  computed: {
    ...mapState(["breadcrumbs"])
  }
};
</script>

<style lang="scss" scoped>
  .breadcrumb-navigator /deep/ {
    padding: 20px 0;
    span {
      font-size: 18px;
      color: #646464;
    }
  }
</style>