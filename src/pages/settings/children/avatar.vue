<template>
  <div class="avatar-container">
    <div class="avatar-uploader-container">
      <div class="avatar-uploader-img">
        <img :src="imageUrl" :onerror="defaultImg" class="avatar">
      </div>
      <div class='avatar-container-select'>
        <p class="tips-title">{{$t('m.uploadPhoto')}}</p>
        <p class="tips">{{$t('m.supportImgTypeTips')}}</p>
        <el-upload
          :action="url"
          :show-file-list="false"
          name="avatar"
          :headers="headers"
          :on-success="handleAvatarSuccess"
          :on-error="handleAvatarError"
          :before-upload="beforeAvatarUpload">
          {{$t('m.uploadPhotoBtn')}}
        </el-upload>
      </div>
    </div>
  </div>
</template>

<script>
  import {mapState, mapMutations} from "vuex";
  import {baseURL, appToken} from '../../../config/env.js'
  import {UPDATE_USER_INFO} from "../../../store/mutation-types.js";
  import {getUserInfo} from "../../../service/api/userAPI.js";

  export default {
    computed: {
      ...mapState(["userAccessToken", "userInfo"]),
    },

    data() {
      return {
        imageUrl: "",
        url: baseURL + "api/v1/users",
        headers: {},
        defaultImg: 'this.src="' + require("../../../../static/avatar.png") + '"',
      };
    },
    created() {
      this.headers = {"X-App-Token": appToken, "Authorization": this.userAccessToken}
      this.initUserInfo()
        .then(() => {
          this.imageUrl = this.userInfo.avatar_url || "/static/avatar.png?js";
        });
    },
    destroyed() {
      this.initUserInfo();
    },
    methods: {
      ...mapMutations([UPDATE_USER_INFO]),
      initUserInfo() {
        return getUserInfo()
          .then(response => {
            this.UPDATE_USER_INFO({userInfo: response.data});
          })
          .catch(error => {
            console.dir(error);
          });
      },
      handleAvatarSuccess(res, file) {
        this.imageUrl = URL.createObjectURL(file.raw);
        this.userInfo.avatar_url = this.imageUrl;
        this.$message.success(this.$t('m.avatarSaveSuccess'));
        this.updateAnalytics(this.$route.path, this.constants.category.SETTINGS, this.constants.activity.CLICK, 'avatar')
      },
      handleAvatarError(res, file) {
        this.$message.error(this.$t('m.avatarSaveFail'))
      },
      beforeAvatarUpload(file) {
        const isAllowPicType =
          file.type === "image/jpeg" ||
          file.type === "image/bmp" ||
          file.type === "image/png";
        // limit size 5M
        const isLTLimit = file.size / 1024 / 1024 < 5;

        if (!isAllowPicType) {
          this.$message.error(this.$t('m.avatarErrorMsgFileType'));
        }
        if (!isLTLimit) {
          this.$message.error(this.$t('m.avatarErrorMsgFileSize'));
        }
        return isAllowPicType && isLTLimit;
      }
    }
  };
</script>


<style lang="scss" scoped>

  ::-webkit-scrollbar /deep/ {
    width: auto;
    height: 5px;
    background-color: #eee;
  }
  .avatar-container {
    margin-left: 10%;
    margin-top: 80px;
    overflow-x: auto;
    .avatar-uploader-container /deep/ {
      margin-bottom: 80px;
      display: flex;
      .avat5ar-container-select {
        display: inline-block;
      }
      .avatar-uploader-img {
        display: inline-block;
        margin-right: 25px;
        width: 200px;
        height: 200px;
        background-color: #fff;
      }
      .el-upload {
        border: 1px solid #6526B8;
        border-radius: 25px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
        width: 240px;
        height: 48px;
        line-height: 48px;
        color: #6526B8;
        font-size: 18px;
        font-weight: 800;
      }

      // .el-upload:hover {
      //   border-color: #409eff;
      // }

      // .avatar-uploader-icon {
      //   display: inline-block;
      //   font-size: 28px;
      //   color: #8c939d;
      //   width: 240px;
      //   height:48px;
      //   line-height: 178px;
      //   text-align: center;
      // }
      .avatar {
        width: 200px;
        height: 200px;
        display: block;
        border-radius: 50%;
        background-color: rgba(177, 177, 177, 0.5)

      }
    }
    .tips {
      margin: 10px 0 46px 0;
      font-size: 14px;
      color: #646464;
    }
    .tips-title {
      font-size: 18px;
      color: #000;
      font-weight: 600;
    }

    .save-cancel-container /deep/ {
      margin-bottom: 50px;
      .el-button {
        border-radius: 25px;
        width: 150px;
        height: 48px;
      }
    }
  }
</style>

