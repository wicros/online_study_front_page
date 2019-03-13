<template>
  <div>
    <head-top></head-top>
    <div class="main-container" v-loading="$store.state.loading">
      <transition mode="out-in">
        <keep-alive>
          <router-view v-if="$route.meta.keepAlive">
          </router-view>
        </keep-alive>
      </transition>
      <transition mode="out-in">
        <router-view v-if="!$route.meta.keepAlive">
        </router-view>
      </transition>
    </div>
    <side-bar></side-bar>
    <foot-guide></foot-guide>
  </div>
</template>

<script>
  import headTop from "./components/header/headTop.vue";
  import footGuide from "./components/footer/footGuide.vue";
  import sideBar from "./components/common/sideBar.vue";

  export default {
    components: {
      headTop,
      footGuide,
      sideBar
    },
  };
</script>


<style lang="scss">
  @import "./style/common";

  .main-container {
    padding-bottom: 100px;
    min-height: 500px;
    .el-loading-spinner {
      position: fixed;

    }
  }

  .v-enter,
  .v-leave-to {
    opacity: 0;
  }

  .v-enter-active,
  .v-leave-active {
    transition: all 0.1s ease;
  }
</style>
