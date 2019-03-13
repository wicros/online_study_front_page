<template>
  <div>
    <el-form :model="userInfo" :rules="rules" ref="userInfo" label-width="100px" :show-message="true"
             class="userinfo-form-container">
      <el-form-item prop="nickname" :label="$t('m.username')">
        <el-input @keydown.enter.native="submitForm('userInfo')" v-model="userInfo.nickname"></el-input>
      </el-form-item>

      <el-form-item prop="email" :label="$t('m.email')">
        <el-input @keydown.enter.native="submitForm('userInfo')" v-model="userInfo.email"></el-input>
      </el-form-item>

      <el-form-item :label="$t('m.sex')">
        <el-radio-group v-model="userInfo.gender">
          <el-radio label="male">{{$t('m.male')}}</el-radio>
          <el-radio label="female">{{$t('m.female')}}</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item prop="ministry" :label="$t('m.liveCity')">
        <el-select :value="userInfo.country_id" class='live-city-select'
                   v-model="userInfo.country_id">
          <el-option v-for="country in ministryInfos" :key="country.id" :label="country.name"
                     :value="country.id"></el-option>
        </el-select>
        <el-select :value="userInfo.ministry_id" class='live-city-select'
                   v-model="userInfo.ministry_id">
          <el-option v-for="ministry in currentMinistryInfo.ministries" :key="ministry.id" :label="ministry.name"
                     :value="ministry.id"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item :label="$t('m.dateOfBirth')">
        <el-date-picker type="date" :placeholder="$t('m.selectDate')" v-model="userInfo.birthday"
                        style="width: 100%;"></el-date-picker>
      </el-form-item>

      <el-form-item class='profileSaveButton'>
        <el-button type="primary" @click="submitForm('userInfo')">{{$t('m.save')}}</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import {mapState, mapMutations} from "vuex";
  import {UPDATE_USER_INFO} from "../../../store/mutation-types.js";
  import {getUserInfo, updateUserInfo} from "../../../service/api/userAPI.js";
  import {getMinistries} from "../../../service/api/settingAPI.js";

  export default {
    data() {
      let checkUsername = (rule, value, callback) => {
        let JAPANESE_REGEXP = /[\u3000-\u303f\u3040-\u309f\u30a0-\u30ff\uff00-\uff9f\u4e00-\u9faf\u3400-\u4dbfA-Za-z0-9_()·.]+/;
        let CHINESE_REGEXP = /[\u4E00-\u9FA5A-Za-z0-9_()·.]+/;

        if (JAPANESE_REGEXP.test(value) || CHINESE_REGEXP.test(value)) {
          callback();
        } else {
          callback(new Error(this.$t('m.pleaseEnterRightUsername')));
        }
      };
      let checkEmail = (rule, value, callback) => {
        let emailReg = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/;
        if (value.trim() !== '' && !emailReg.test(value)) {
          return callback(new Error(this.$t('m.pleaseEnterRightEmail')));
        }
        callback();
      };
      let checkMinistry = (rule, value, callback) => {
        if (this.userInfo.country_id) {
          if (!this.userInfo.ministry_id) {
            return callback(new Error(this.$t('m.selectLiveInCity')));
          }
        }
        callback();
      };

      return {
        rules: {
          nickname: [
            {required: true, message: this.$t('m.pleaseEnterUsername'), trigger: "blur"},
            {min: 3, max: 12, message: this.$t('m.pleaseEnterRightLengthUsername'), trigger: "blur"},
            {validator: checkUsername, trigger: "blur"}
          ],
          email: [
            {validator: checkEmail, trigger: "blur"}
          ],
          ministry: [
            {validator: checkMinistry, trigger: "change"}
          ]
        },
        ministryInfos: [],
        currentMinistryInfo: {}
      };
    },
    created() {
      this.queryUserInfo();
    },
    destroyed() {
      this.queryUserInfo();
    },
    methods: {
      ...mapMutations([UPDATE_USER_INFO]),
      submitForm(formName) {
        this.$refs[formName].validate(valid => {
          if (!valid) return false;
          this.updateUserInfo();
          this.updateAnalytics(this.$route.path, this.constants.category.SETTINGS, this.constants.activity.CLICK, 'submit_profile')
        });
      },
      queryUserInfo() {
        getMinistries()
          .then(response => {
            this.ministryInfos = response.data;
            return getUserInfo()
          })
          .then(response => {
            this.UPDATE_USER_INFO({
              userInfo: response.data
            });
            this.updateCurrentMinistry(this.userInfo.country_id);
          })
          .catch(error => {
            console.dir(error);
          });
      },
      updateUserInfo() {
        this.formatBirthday();
        updateUserInfo(this.userInfo)
          .then(response => {
            if (response.status === 200) {
              this.$message.success(this.$t('m.saveSuccess'))
              this.UPDATE_USER_INFO({
                userInfo: response.data
              })
            }
          })
          .catch(err => {
            console.dir(err);
          })
      },
      formatBirthday() {
        if (this.userInfo.birthday instanceof Date) {
          let date = this.userInfo.birthday;
          let year = date.getFullYear();
          let month = date.getMonth() + 1;
          month = ("" + month).padStart(2, '0');
          let day = date.getDate();
          day = ("" + day).padStart(2, '0');
          this.userInfo.birthday = `${year}-${month}-${day}`
        }
      },
      updateCurrentMinistry(countryId) {
        if (!countryId) {
          this.currentMinistryInfo = {};
          return;
        }

        this.currentMinistryInfo = this.ministryInfos.find(item => {
          return item.id === countryId;
        });
      }
    },
    computed: {
      ...mapState(["userInfo"]),
    },
    watch: {
      "userInfo.country_id": function (newVal) {
        this.updateCurrentMinistry(newVal);
        this.userInfo.ministry_id = null;
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
  .userinfo-form-container /deep/ {
    margin-left: 16px;
    margin-top: 61px;
    overflow-x: auto;
    .el-form-item__content {
      width: 306px;
    }
    .el-input__inner {
      padding-left: 12px;
    }
    .el-input--prefix .el-input__inner {
      padding-left: 30px;
    }
    .el-form-item__label {
      color: #b1b1b1;
      font-size: 16px;
    }
    .el-form-item {
      .live-city-select {
        width: 49%;
      }
      .el-form-item__content {
        button {
          margin-bottom: 50px;
          margin-top: 28px;
          border-radius: 25px;
          padding: 0;
          width: 150px;
          height: 48px;
          span {
            font-size: 16px;
          }
        }
      }
      .el-radio-group {
        .el-radio__label {
          font-size: 16px;
          color: #b1b1b1;
        }
      }
      .el-radio__inner:hover {
        border-color: #00deb7;
      }
      .el-radio__input.is-checked .el-radio__inner {
        background-color: #00deb7;
        border-color: #00deb7;
      }
      .el-radio__inner::after {
        content: none;
      }
      .el-input__inner {
        font-size: 16px;
        color: #000;
        border: 0;
        border-bottom: 1px solid #e6e6e6;
        border-radius: 0;
      }
    }
    .profileSaveButton {
      margin-bottom: 0;
    }
  }
</style>
