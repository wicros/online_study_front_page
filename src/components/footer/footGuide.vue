<template>
  <el-footer class="foot-guide hidden-sm-and-down" height="300px">
    <el-row class="footer-content layer" type="flex" justify="space-around">
      <el-col :span="6">
        <div class="logo-container">
          <span>Linc</span>
          <icon name="heart" scale="100"></icon>
          <div class="logo-lovingly-in-tokyo">
            <p>Lovingly</p>
            <p>in Tokyo</p>
          </div>
        </div>
      </el-col>
      <el-col :span="4">
        <ul class="foot-links">
          <li>
            <router-link to="/">{{$t('m.homePage')}}</router-link>
          </li>
          <li>
            <router-link to="/products">{{$t('m.hotProduct')}}</router-link>
          </li>
          <li>
            <router-link to="/courses">{{$t('m.starCourse')}}</router-link>
          </li>
          <li>
            <router-link to="/openCourses">{{$t('m.openClass')}}</router-link>
          </li>
        </ul>
      </el-col>
      <el-col :span="4">
        <ul class="foot-links">
          <li><a href="https://linc-info.com/" target="blank">{{$t('m.aboutMe')}}</a></li>
          <li><a @click="$store.state.userTermDialogVisible = true" href="javascript:void(0)">{{$t('m.termsOfUse')}}</a></li>
        </ul>
      </el-col>
      <el-col :span="4">
        <ul class="foot-links">
          <li>{{$t('m.watchUs')}}:</li>
          <li class="sns-container">
            <a @click="updateAnalytics(this.$route.path, this.constants.category.LINC, this.constants.activity.CLICK, 'zhihu')"
               href="https://www.zhihu.com/people/52japan/activities" target="blank">
              <icon name="zhihu" scale="112"></icon>
            </a>
          </li>
        </ul>
      </el-col>
      <el-col :span="6">
        <div class="copy-right">
          © 2018 Linc, Inc.
        </div>
      </el-col>
    </el-row>
  </el-footer>
</template>

<style lang="less" scoped>
  .foot-guide {
    position: relative;
    color: #fff;
    text-align: left;
    background-color: #673da9;
  }

  .footer-content {
    padding: 0 1%;
    margin: 0 auto !important;
    .el-col {
      padding-top: 56px;
    }
    .logo-container {
      span {
        font-family: "Sul Sans";
        line-height: 36px;
        font-size: 44px;
        margin-right: 5px;
      }
      .logo-lovingly-in-tokyo {
        margin-left: 5px;
        display: inline-block;
        p {
          font-family: "Sul Sans";
          line-height: 12px;
          font-size: 10px;
        }
      }
    }
    .foot-links {
      li, a {
        color: #fff;
        line-height: 2.5;
        font-size: 16px;
      }
      .sns-container {
        > * {
          margin-right: 20px;
        }
      }
    }
    .copy-right {
      font-family: 'Sul Sans';
      float: right;
      margin-right: 5%;
    }
  }
</style>
