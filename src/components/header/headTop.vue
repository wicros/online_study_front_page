<template>
  <el-header class="head-top-container" :height="'80px'">
    <el-row class="layer">
      <el-col :xs="2" :sm="6" :md="3" :lg="3" :xl="3" class="hidden-sm-and-down logo-col">
        <router-link to="/">
          <img class="grid-content bg-purple" :src="'/static/headlogo.png'"/>
        </router-link>
      </el-col>
      <el-col :xs="4" :sm="2" :md="10" :lg="9" :xl="9">
        <div class="grid-content bg-purple header-menu-container">
          <el-menu :menu-trigger="isSmallScreen ? 'hover': 'click'" :default-active="activeIndex" class="el-menu-demo"
                   mode="horizontal">

            <el-menu-item class="hidden-sm-and-down" index="1">
              <router-link to="/">{{$t('m.homePage')}}</router-link>
            </el-menu-item>
            <el-menu-item class="hidden-sm-and-down" index="2">
              <router-link to="/products">{{$t('m.hotProduct')}}</router-link>
            </el-menu-item>
            <el-menu-item class="hidden-sm-and-down" index="3">
              <router-link to="/courses">{{$t('m.starCourse')}}</router-link>
            </el-menu-item>
            <el-menu-item class="hidden-sm-and-down" index="4">
              <router-link to="/openCourses">{{$t('m.openClass')}}</router-link>
            </el-menu-item>
            <el-submenu :hide-timeout="0" :show-timeout="0" index="4" class="dropdown-menu hidden-md-and-up">
              <template slot="title"><i class="el-icon-tickets"></i></template>
              <el-menu-item index="1">
                <router-link to="/">{{$t('m.homePage')}}</router-link>
              </el-menu-item>
              <el-menu-item index="2">
                <router-link to="/products">{{$t('m.hotProduct')}}</router-link>
              </el-menu-item>
              <el-menu-item index="3">
                <router-link to="/courses">{{$t('m.starCourse')}}</router-link>
              </el-menu-item>
              <el-menu-item index="4">
                <router-link to="/openCourses">{{$t('m.openClass')}}</router-link>
              </el-menu-item>
            </el-submenu>
          </el-menu>

        </div>
      </el-col>
      <el-col :xs="12" :sm="16" :md="7" :lg="8" :xl="8">
        <div class="grid-content bg-purple">
          <form action="javascript:void(0)">
            <el-input
              type="search"
              class="header-search"
              :placeholder="$t('m.pleaseEnterSearchKey')"
              v-model="searchKey"
              @keyup.enter.native="handleSearchKeydown"
              clearable>
            </el-input>
          </form>
        </div>
      </el-col>
      <el-col :xs="8" :sm="6" :md="4" :lg="4" :xl="4">
        <div v-if="!isLogined" class="grid-content header-login-register-container">
          <a @click="registerAction" href="javascript:void(0)">{{$t('m.register')}}</a>
          <a @click="loginAction" href="javascript:void(0)">
          <span class="header-login-container">
            {{$t('m.login')}}
          </span>
          </a>
        </div>
        <div v-else class="grid-content user-message-icon">
          <div v-if="0" class="message-container">
            <icon class="hidden-sm-and-down" name="notification" scale="100"></icon>
            <span class="hidden-sm-and-down">{{$t('m.message')}}</span>
            <div class="hidden-sm-and-down"><p class="message-count">12</p></div>
          </div>
          <router-link class="user-icon-link" to="/myPage">
            <img :src="userInfo.avatar_url || '/static/avatar.png?head_top'" :onerror="defaultImg" alt="">
            <span class="user-nickname ellipsis hidden-sm-and-down">{{userInfo.nickname}}</span>
          </router-link>
          <a class="user-logout" @click="handleLogoutAction" href="javascript:void(0);">{{$t('m.logoff')}}</a>
        </div>
      </el-col>
    </el-row>
    <sign-in-dialog></sign-in-dialog>
    <sign-up-dialog></sign-up-dialog>
    <user-term-dialog></user-term-dialog>
    <forget-password-dialog></forget-password-dialog>
  </el-header>
</template>

<script>
  import "element-ui/lib/theme-chalk/display.css";
  import {mapState, mapMutations} from "vuex";
  import forgetPasswordDialog from "../dialog/forgetPasswordDialog.vue";
  import signInDialog from "../dialog/signInDialog.vue";
  import signUpDialog from "../dialog/signUpDialog.vue";
  import userTermDialog from "../dialog/userTermDialog.vue";
  import {NAV_INDEX, CLEAR_USER_INFO} from "../../store/mutation-types.js";
  import {updateAnalytics} from "../../service/api/analyticsAPI.js";

  export default {
    components: {
      forgetPasswordDialog,
      signInDialog,
      signUpDialog,
      userTermDialog
    },
    data() {
      return {
        activeIndex: this.navIndex || "1",
        searchKey: "",
        defaultImg: 'this.src="' + require("../../../static/avatar.png") + '"',
      }
    },
    created() {
      this.updateNavIndex();
    },
    methods: {
      ...mapMutations([NAV_INDEX, CLEAR_USER_INFO]),
      updateNavIndex() {
        if (this.$route.meta.navIndex) {
          this.activeIndex = this.$route.meta.navIndex;
          this.NAV_INDEX(this.$route.meta.navIndex);
          return;
        }
        this.activeIndex = this.navIndex || "1";
      },
      handleSearchKeydown() {
        this.$router.push({
          path: "/courses",
          query: {searchKey: this.searchKey, timestrap: Date.now()}
        });
      },
      loginAction() {
        this.$store.state.signInDialogVisible = true;
        this.$store.state.signUpDialogVisible = false;
        this.$store.state.userTermDialogVisible = false;
        updateAnalytics(this.$route.path, this.constants.category.SIGN, this.constants.activity.CLICK, 'open_sign_in_dialog')
      },
      registerAction() {
        this.$store.state.signUpDialogVisible = true;
        this.$store.state.signInDialogVisible = false;
        this.$store.state.userTermDialogVisible = false;
        updateAnalytics(this.$route.path, this.constants.category.SIGN, this.constants.activity.CLICK, 'open_sign_up_dialog')
      },
      handleAreaCodeChange() {
        this.$refs["form"].validateField("phoneNumber");
      },
      handleLogoutAction() {
        updateAnalytics(this.$route.path, this.constants.category.SIGN, this.constants.activity.CLICK, 'log_out')
        this.CLEAR_USER_INFO();
        this.$message.success(this.$t('m.logoffSuccess'));
        this.$router.push({path: "/"})
      },
    },
    watch: {
      $route(to, from) {
        if (to.path !== "/courses") {
          this.searchKey = "";
        }
        if (to.meta.breadcrumb === this.$t('m.setting')) {
          return;
        }
        this.updateNavIndex();
      }
    },
    computed: {
      ...mapState([
        "isSmallScreen",
        "navIndex",
        "userInfo",
        "isLogined"
      ])
    }
  };
</script>

<style lang="scss">
  .head-top-container {
    .el-menu--horizontal > .el-submenu.is-active .el-submenu__title {
      background-color: #6526b8;
      &:hover {
        i {
          color: #fff;
        }
      }
    }

    .dropdown-menu {
      .el-submenu__title {
        padding: 0;
        line-height: 80px;
      }
    }
  }
</style>

<style lang="scss" scoped>
  .el-menu--horizontal .el-menu-item:not(.hidden-sm-and-down) a {
      color: #909399;
  }

  .el-menu--horizontal .el-menu-item.is-active:not(.hidden-sm-and-down) a {
      color: #303133;
  }

  .head-top-container {
    color: rgba(255, 255, 255, 0.7);
    background-color: #6526b8;
    text-align: center;
    width: 100%;
    line-height: 80px;
    overflow: hidden;
  }

  .logo-col {
    height: 100%;
    img {
      margin: 12px 0px 0px -75px;
      width: 120%;
    }
  }

  .el-col {
    margin: 0;
  }

  .header-menu-container {
    .el-menu {
      border-bottom: 0;
      background-color: #6526b8;
      & > .el-menu-item {
        color: rgba(255, 255, 255, 0.7);
        background-color: transparent;
        height: 100%;
        border-bottom: none;
        &:hover {
          background-color: transparent;
        }
        &.is-active {
          background-color: transparent;
          border-bottom-color: transparent;
          color: #ffffff;
        }
        a {
          display: inline-block;
          font-size: 15px;
          line-height: 80px;
        }
      }
    }
  }

  .header-search /deep/ {
    input::-webkit-input-placeholder {
      color: rgba(255, 255, 255, 0.7);
    }
    input::-moz-placeholder {
      /* Mozilla Firefox 19+ */
      color: rgba(255, 255, 255, 0.7);
    }
    input:-moz-placeholder {
      /* Mozilla Firefox 4 to 18 */
      color: rgba(255, 255, 255, 0.7);
    }
    input:-ms-input-placeholder {
      /* Internet Explorer 10-11 */
      color: rgba(255, 255, 255, 0.7);
    }
    input {
      color: rgba(255, 255, 255, 0.7);
      background: #8a4fd7;
      border: 2px solid #a16fe2;
      box-sizing: border-box;
      border-radius: 100px;
    }
    ::-webkit-search-cancel-button {
      -webkit-appearance: none;
    }
  }

  .header-login-register-container {
    text-align: right;
    a {
      color: #ffffff;
      text-decoration: none;
      font-size: 15px;
      margin: 0 2%;
    }
    .header-login-container {
      border: 2px solid #ffffff;
      box-sizing: border-box;
      border-radius: 18.5px;
      padding: 3% 6%;
    }
  }

  .user-message-icon {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    white-space: nowrap;
    // width: 250px;
    height: 80px;
    > * {
      color: #fff;
      margin: 0 3px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .message-container > * {
      margin: 0 3px;
    }
    .message-count {
      display: inline-block;
      line-height: 17px;
      width: 24px;
      height: 17px;
      font-size: 12px;
      text-align: center;
      color: #6526b8;
      background: #00deb7;
      border-radius: 8.5px;
    }
    .user-icon-link {
      height: 28px;
      overflow: hidden;
      img {
        width: 28px;
        height: 28px;
        border-radius: 50%;
      }
      > * {
        margin: 0 3px;
      }
    }
    .user-nickname {
      display: block;
    }
    .user-logout {
      text-decoration: underline;
      color: skyblue;
      display: inline;
      line-height: 1;
    }
  }
</style>
