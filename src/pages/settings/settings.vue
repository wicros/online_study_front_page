<template>
  <div class="settings-container">
    <breadcrumb class="hidden-sm-and-down"></breadcrumb>
    <el-row class="layer container-padding settings-details-container">
      <el-col :xs="6" :sm="6" :md="6" :lg="5" :xl="5">
        <el-menu
          menu-trigger="click"
          @select="handleSelect"
          :default-active="activeIndex">
          <el-menu-item-group>
            <el-menu-item index="1" class="settings-nav-title">{{$t('m.personalSettings')}}</el-menu-item>
            <el-menu-item index="1-1">{{$t('m.personalInfo')}}</el-menu-item>
            <el-menu-item index="1-2">{{$t('m.selectAvatar')}}</el-menu-item>
            <el-menu-item index="1-3">{{$t('m.accountSecurity')}}</el-menu-item>
          </el-menu-item-group>
          <el-menu-item-group>
            <el-menu-item index="2" class="settings-nav-title">{{$t('m.accountCenter')}}</el-menu-item>
            <el-menu-item index="2-1">{{$t('m.myOrder')}}</el-menu-item>
          </el-menu-item-group>
        </el-menu>
      </el-col>
      <el-col :xs="18" :sm="18" :md="18" :lg="19" :xl="19">
        <transition mode="out-in">
          <router-view @updateSettingsNavIndex="updateSettingsNavIndex"></router-view>
        </transition>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import breadcrumb from "../../components/common/breadcrumb.vue";
  import {mapState, mapMutations} from "vuex";
  import {SETTINGS_NAV_INDEX} from "../../store/mutation-types.js";

  export default {
    components: {
      breadcrumb
    },
    created() {
      this.updateSettingsNavIndex();
    },
    data() {
      return {
        activeIndex: this.settingsNavIndex || "1-1"
      };
    },
    methods: {
      ...mapMutations([SETTINGS_NAV_INDEX]),
      updateSettingsNavIndex() {
        this.activeIndex = this.settingsNavIndex || "1-1";
      },
      handleSelect(key, keyPath) {
        if (key !== this.settingsNavIndex) {
          this.SETTINGS_NAV_INDEX(key);
          this.updateSettingsNavIndex();
        }
        switch (key) {
          case "1-1":
            this.$router.push({path: "/profile"});
            break;
          case "1-2":
            this.$router.push({path: "/avatar"});
            break;
          case "1-3":
            this.$router.push({path: "/accountSecurity"});
            break;
          case "2-1":
            this.$router.push({path: "/myOrder"});
            break;

          default:
            break;
        }
      }
    },
    computed: {
      ...mapState(["settingsNavIndex"])
    },
    destroyed() {
      this.SETTINGS_NAV_INDEX("1-1");
    }
  };
</script>


<style lang="less">
  .settings-container {
    .el-form-item__label {
      padding-right: 20px;
    }
    .container-padding {
      padding: 0;
    }
    .el-menu {
      border: 0;
    }
    .el-menu-item {
      color: #646464;

    }
    .el-menu-item.settings-nav-title {
      font-size: 18px;
      font-weight: 800;
      color: #000;

    }
    .el-menu-item.is-active {
      color: #000;
      font-size: 14px;
      font-weight: 800;

    }
    .el-menu-item-group .settings-nav-title.is-active {
      font-size: 18px;
      font-weight: 800;
      color: #000;
    }
    .el-menu-item:focus, .el-menu-item:hover {
      background-color: #fff;
    }
  }

</style>
