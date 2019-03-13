<template>
  <div class="account-security-container">
    <el-row class="password-container">
      <el-col class="title hidden-sm-and-down" :xs="4" :sm="4" :md="4" :lg="4" :xl="4">{{$t('m.loginPassword')}}
      </el-col>
      <el-col class="description hidden-sm-and-down" :xs="16" :sm="16" :md="16" :lg="16" :xl="16">
        {{$t('m.changePasswordTips')}}
      </el-col>
      <el-col :xs="24" :sm="24" :md="4" :lg="4" :xl="4">
        <el-button @click="changePwdAction" type="primary">{{$t('m.changePassword')}}</el-button>
      </el-col>
    </el-row>
    <el-row class="phone-container">
      <el-col class="title hidden-sm-and-down" :xs="4" :sm="4" :md="4" :lg="4" :xl="4">{{$t('m.phoneNumber')}}</el-col>
      <el-col class="description hidden-sm-and-down" :xs="16" :sm="16" :md="16" :lg="16" :xl="16">{{'+'+userInfo.phone |
        splitAreaCode}}
      </el-col>
      <el-col :xs="24" :sm="24" :md="4" :lg="4" :xl="4">
        <el-button @click="changePhoneAction" type="primary">{{$t('m.phoneSetting')}}</el-button>
      </el-col>
    </el-row>

    <el-dialog @close="handleChangePwdDialogClosed" class="change-info-dialog-container" :fullscreen="isSmallScreen"
               :title="$t('m.changePassword')" :visible.sync="changePwdDialogVisible">
      <el-form ref="pwdForm" :rules="rules" :model="pwdForm">
        <el-form-item>
          <el-input @keydown.native.enter="handleChangePassword" type="password"
                    :placeholder="$t('m.pleaseEnterCurrentPassword')" v-model="pwdForm.password"
                    auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item prop="new_password">
          <el-input @keydown.native.enter="handleChangePassword" type="password"
                    :placeholder="$t('m.pleaseEnterNewPassword')" v-model="pwdForm.new_password"
                    auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item prop="new_password_confirmation">
          <el-input @keydown.native.enter="handleChangePassword" type="password"
                    :placeholder="$t('m.pleaseEnterPasswordAgain')"
                    v-model="pwdForm.new_password_confirmation" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleChangePassword">{{$t('m.confirm')}}</el-button>
        <span class="cancel-container"><a href="javascript:void(0);" @click="changePwdDialogVisible = false">{{$t('m.cancel')}}</a></span>
      </div>
    </el-dialog>

    <el-dialog @close="handleChangePhoneDialogClosed" class="change-info-dialog-container change-phone-dialog-container"
               :fullscreen="isSmallScreen"
               :title="$t('m.phoneChange')" :visible.sync="changePhoneDialogVisible">
      <el-form ref="phoneForm" :rules="rules" :model="phoneForm">

        <el-form-item prop="new_phone" class="input-and-smsbtn">
          <el-input type="number" :placeholder="$t('m.pleaseEnterPhoneNumber')" v-model="phoneForm.new_phone"
                    class="input-with-select">
            <el-select @change="handleAreaCodeChange" class='numPre' v-model="phoneForm.areaCode" slot="prepend"
                       value="1"
                       placeholder="+86">
              <el-option label="+86" value="86">{{$t('m.China')}} +86</el-option>
              <el-option label="+81" value="81">{{$t('m.Japan')}} +81</el-option>
            </el-select>
          </el-input>
          <send-sms-button :areaCode="phoneForm.areaCode" :phoneNumber="phoneForm.new_phone"></send-sms-button>
        </el-form-item>

        <el-form-item prop="sms_token">
          <el-input type="number" :placeholder="$t('m.pleaseEnterVerificationCode')" class="verifycode-inp"
                    v-model="phoneForm.sms_token" auto-complete="off"></el-input>
        </el-form-item>

        <el-form-item>
          <el-input @keydown.native.enter="handleChangePhone" type="password" :placeholder="this.$t('m.pleaseEnterPassword')"
                    v-model="phoneForm.password" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleChangePhone">{{this.$t('m.confirm')}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {mapState, mapMutations} from "vuex";
  import {UPDATE_USER_INFO} from "../../../store/mutation-types.js";
  import {updatePhone, updatePassword} from "../../../service/api/userAPI.js";
  import sendSmsButton from "../../../components/widget/sendSmsButton.vue";

  export default {
    components: {
      sendSmsButton
    },
    data() {
      let checkPhoneNumber = (rule, value, callback) => {
        let chinaPhoneReg = /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/;
        if (this.phoneForm.areaCode === "86") {
          if (!chinaPhoneReg.test(value)) {
            return callback(new Error(this.$t('m.pleaseEnterRightChinaNumber')));
          }
        }
        let japanPhoneReg = /^0?\d{10,11}$/;
        if (this.phoneForm.areaCode === "81") {
          if (!japanPhoneReg.test(value)) {
            return callback(new Error(this.$t('m.pleaseEnterRightJapanNumber')));
          }
        }

        callback();
      };
      let checkPassword = (rule, value, callback) => {
        if (this.pwdForm.new_password_confirmation) {
          this.$refs["pwdForm"].validateField("new_password_confirmation");
        }
        let passwordReg = /^(?=.*\d)(?=.*[a-z]).{6,}$/;
        if (!passwordReg.test(value)) {
          return callback(new Error(this.$t('m.pleaseEnterRightPassword')));
        }
        callback();
      };
      let checkPasswordConfirmation = (rule, value, callback) => {
        if (this.pwdForm.new_password !== value) {
          return callback(new Error(this.$t('m.passwordDifferent')));
        }
        callback();
      };
      return {
        formLabelWidth: this.isSmallScreen ? "0px" : "120px",
        changePwdDialogVisible: false,
        pwdForm: {
          password: "",
          new_password: "",
          new_password_confirmation: ""
        },
        changePhoneDialogVisible: false,
        phoneForm: {
          areaCode: "",
          new_phone: "",
          sms_token: "",
          password: ""
        },
        rules: {
          new_phone: [
            {required: true, message: this.$t('m.pleaseEnterPhoneNumber'), trigger: "blur"},
            {validator: checkPhoneNumber, trigger: "blur"}
          ],
          sms_token: [
            {required: true, message: this.$t('m.pleaseEnterVerificationCode'), trigger: "blur"},
            {min: 6, max: 6, message: this.$t('m.pleaseEnterRightLengthVerificationCode'), trigger: "blur"}
          ],
          new_password: [
            {required: true, message: this.$t('m.pleaseEnterPassword'), trigger: "blur"},
            {validator: checkPassword, trigger: "blur"}
          ],
          new_password_confirmation: [
            {required: true, message: this.$t('m.pleaseEnterPasswordAgain'), trigger: "blur"},
            {validator: checkPasswordConfirmation, trigger: "blur"}
          ]
        }
      };
    },

    methods: {
      ...mapMutations([UPDATE_USER_INFO]),
      changePwdAction() {
        this.changePwdDialogVisible = true;
        this.updateAnalytics(this.$route.path, this.constants.category.SETTINGS, this.constants.activity.CLICK, 'open_change_password_dialog')

      },
      changePhoneAction() {
        this.changePhoneDialogVisible = true;
        this.updateAnalytics(this.$route.path, this.constants.category.SETTINGS, this.constants.activity.CLICK, 'open_change_phone_dialog')

      },
      handleChangePwdDialogClosed() {
        this.resetPwdForm();
        this.$refs["pwdForm"].clearValidate();
        this.updateAnalytics(this.$route.path, this.constants.category.SETTINGS, this.constants.activity.CLICK, 'close_change_password_dialog')

      },
      resetPwdForm() {
        this.pwdForm = {
          password: "",
          new_password: "",
          new_password_confirmation: ""
        };
      },
      handleAreaCodeChange() {
        this.$refs["phoneForm"].validateField("new_phone");
      },
      handleChangePhoneDialogClosed() {
        this.resetPhoneForm();
        this.updateAnalytics(this.$route.path, this.constants.category.SETTINGS, this.constants.activity.CLICK, 'close_change_phone_dialog')

      },
      resetPhoneForm() {
        this.phoneForm.password = "";
        this.initPhoneInfo();
        this.$refs["phoneForm"].clearValidate();
      },
      handleChangePassword() {
        this.updateAnalytics(this.$route.path, this.constants.category.SETTINGS, this.constants.activity.CLICK, 'submit_change_password')
        this.$refs["pwdForm"].validate(valid => {
          if (!valid) return;
          updatePassword(this.pwdForm)
            .then(response => {
              if (response.status === 200) this.$message.success(this.$t('m.successChangePassword'))
              this.changePwdDialogVisible = false;
            })
            .catch(err => {
              console.dir(err);
            })
        });
      },
      handleChangePhone() {
        this.updateAnalytics(this.$route.path, this.constants.category.SETTINGS, this.constants.activity.CLICK, 'submit_change_phone')
        this.$refs["phoneForm"].validate(valid => {
          if (!valid) return;

          let phoneParams = {};
          Object.assign(phoneParams, this.phoneForm);

          if (phoneParams.areaCode == '81' && phoneParams.new_phone.startsWith('0')) {
            phoneParams.new_phone = phoneParams.new_phone.substring(1);
          }
          phoneParams.new_phone = phoneParams.areaCode + phoneParams.new_phone;

          updatePhone(phoneParams)
            .then(response => {
              if (response.status === 200) this.$message.success(this.$t('m.successChangePhone'))
              this.changePhoneDialogVisible = false;
              this.UPDATE_USER_INFO({
                userInfo: response.data
              })
            })
            .catch(err => {
              console.dir(err);
            });

        });
      },
      initPhoneInfo() {
        if (Object.keys(this.userInfo).length > 0) {
          this.phoneForm.areaCode = this.userInfo.phone.substr(0, 2);
          this.phoneForm.new_phone = this.userInfo.phone.substr(2);
        }
      }
    },
    computed: {
      ...mapState(["isSmallScreen", "userInfo"])
    },
    created() {
      this.initPhoneInfo();
    },
    filters: {
      splitAreaCode(content) {
        return content.substr(0, 3) + ' ' + content.substring(3);
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
  .account-security-container {
    margin-left: 10%;
    margin-top: 80px;
    overflow-x: auto;

    .password-container,
    .phone-container {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      margin-bottom: 20px;
      .title {
        font-size: 16px;
        font-weight: 600;
        color: #000000;
      }
      .description {
        font-size: 14px;
        color: #646464;
      }
      .el-button /deep/ {
        width: 86px;
        height: 30px;
        padding: 0;
        background: #00deb7;
        border-radius: 15px;
        border: none;
        span {
          font-size: 12px;
        }
      }
    }

    .phone-container {
      border: none;
    }

    .change-info-dialog-container /deep/ {
      .el-dialog {
        width: 480px;
        padding: 32px 20px;
        margin-top: 8% !important;
        .el-dialog__header {
          padding: 0;
          .el-dialog__title,
          .el-dialog__close {
            font-size: 24px;
            font-weight: 600;
            color: #000000;
          }
          .el-dialog__headerbtn {
            top: 32px;
            right: 20px;
          }
        }

        .el-dialog__body {
          padding: 35px 0;
          .el-form-item {
            margin: 0;
            .el-form-item__content {
              line-height: 60px;
              span {
                font-size: 16px;
              }
            }
          }
          .el-input__inner {
            height: 60px;
            border: none;
            border-radius: 0;
            color: #000;
            font-size: 16px;
            border-bottom: 1px solid #e6e6e6;
            padding-right: 0;
            &::-webkit-input-placeholder {
              color: #b1b1b1;
            }
            &::-moz-placeholder {
              /* Mozilla Firefox 19+ */
              color: #b1b1b1;
            }
            &:-moz-placeholder {
              /* Mozilla Firefox 4 to 18 */
              color: #b1b1b1;
            }
            &:-ms-input-placeholder {
              /* Internet Explorer 10-11 */
              color: #b1b1b1;
            }
          }
        }

        .el-dialog__footer {
          padding: 0;
        }
        .dialog-footer {
          display: flex;
          justify-content: center;
          flex-direction: column;
          padding: 15px 0;
          .el-button {
            margin-left: 0;
            &.el-button--primary {
              span {
                font-size: 16px;
                font-weight: 600;
              }
              border-radius: 25px;
            }
          }

          .cancel-container {
            text-align: center;
            color: #6526b8;
            a {
              display: inline-block;
              margin-top: 24px;
              font-size: 16px;
              font-weight: 600;
            }
          }
        }
      }
    }

    .change-phone-dialog-container /deep/ {
      .el-dialog {
        .el-dialog__body {
          .input-and-smsbtn {
            text-align: left;
            .el-form-item__content {
              .el-input-group {
                width: calc(100% - 86px);
              }
            }
          }
          .el-select {
            margin-right: 5px;
            .el-input {
              width: 80px;
            }
          }
          .input-with-select {
            .el-input-group__prepend {
              background-color: #fff;
              padding-right: 0;
              margin-right: 5px;
            }
            .el-input-group__prepend .numPre input {
              color: #000;
              font: 19px bold;
            }
          }
          .el-input-group__append,
          .el-input-group__prepend {
            border: 0;
          }
          .el-select.numPre .el-input .el-select__caret {
            color: #000;
            font-weight: bold;
          }
        }
        .el-dialog__footer {
          .dialog-footer {
            line-height: 110px;
          }
        }
      }
      .el-input-group__prepend {
        padding-right: 0;
      }
    }
  }
</style>
