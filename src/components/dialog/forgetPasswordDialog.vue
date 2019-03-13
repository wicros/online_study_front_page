<template>
  <el-dialog @close="handleForgetPasswordDialogClosed"
             :lock-scroll="true"
             :fullscreen="isSmallScreen"
             class="common-dialog"
             :title="$t('m.forgotPassword')"
             :visible.sync="$store.state.forgetPasswordDialogVisible"
             append-to-body>
    <el-form ref="form" :rules="rules" :show-message="true" :model="form">

      <el-form-item prop="phoneNumber" class="input-and-smsbtn">
        <el-input type="number" :placeholder="$t('m.pleaseEnterPhoneNumber')" v-model="form.phoneNumber"
                  class="input-with-select">
          <el-select @change="handleAreaCodeChange" class='numPre' v-model="form.areaCode" slot="prepend" value="1"
                     placeholder="+86">
            <el-option label="+86" value="86">{{$t('m.China')}} +86</el-option>
            <el-option label="+81" value="81">{{$t('m.Japan')}} +81</el-option>
          </el-select>
        </el-input>
        <send-sms-button :areaCode="form.areaCode" :phoneNumber="form.phoneNumber"></send-sms-button>
      </el-form-item>

      <el-form-item prop="verifyCode">
        <el-input type="number" :placeholder="$t('m.pleaseEnterVerificationCode')" class="verifycode-inp"
                  v-model="form.verifyCode" auto-complete="off"></el-input>
      </el-form-item>

      <el-form-item prop="password">
        <el-row :gutter="formItemGutter">
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
            <el-input type="password" :placeholder="$t('m.pleaseEnterPassword')" class="verifycode-inp"
                      v-model="form.password" auto-complete="off"></el-input>
          </el-col>
        </el-row>
      </el-form-item>

      <el-form-item prop="passwordAgain" class="password-again">
        <el-row :gutter="formItemGutter">
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
            <el-input type="password" :placeholder="$t('m.pleaseEnterPasswordAgain')" class="verifycode-inp"
                      v-model="form.passwordAgain" auto-complete="off"></el-input>
          </el-col>
        </el-row>
      </el-form-item>

      <el-form-item class="robatmark" label="" :label-width="formLabelWidth" v-show="recaptchaEnabled">
        <el-row :gutter="formItemGutter">
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
            <ding-xiang-captcha captchaStyle="inline" ref="captcha" @handleRecaptchaVerify="handleRecaptchaVerify" ></ding-xiang-captcha>
          </el-col>
        </el-row>
      </el-form-item>

    </el-form>

    <div slot="footer" class="dialog-footer forget-dialog-footer">
      <el-button type="primary" @click="submitReset">{{$t('m.reset')}}</el-button>
      <p class="email-user-tips">
        {{$t('m.unboundPhoneNumbersUser')}}
      </p>
    </div>

  </el-dialog>

</template>

<script>
  import {mapState} from "vuex";
  import {resetPassword} from "../../service/api/signAPI.js";
  import sendSmsButton from "../widget/sendSmsButton.vue";
  import dingXiangCaptcha from "../widget/dingXiangCaptcha.vue";
  import {recaptchaEnabled} from "../../config/env.js";

  export default {
    components: {
      dingXiangCaptcha,
      sendSmsButton
    },
    data() {
      let checkPhoneNumber = (rule, value, callback) => {
        let chinaPhoneReg = /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/;
        if (this.form.areaCode == "86") {
          if (!chinaPhoneReg.test(value)) {
            return callback(new Error(this.$t('m.pleaseEnterRightChinaNumber')));
          }
        }
        let japanPhoneReg = /^0?\d{10,11}$/;
        if (this.form.areaCode == "81") {
          if (!japanPhoneReg.test(value)) {
            return callback(new Error(this.$t('m.pleaseEnterRightJapanNumber')));
          }
        }
        callback();
      };
      let checkPassword = (rule, value, callback) => {
        if (this.form.passwordAgain) {
          this.$refs["form"].validateField("passwordAgain");
        }
        let passwordReg = /^(?=.*\d)(?=.*[a-z]).{6,}$/;
        if (!passwordReg.test(value)) {
          return callback(new Error(this.$t('m.pleaseEnterRightPassword')));
        }
        callback();
      };
      let checkPasswordConfirmation = (rule, value, callback) => {
        if (this.form.password !== value) {
          return callback(new Error(this.$t('m.passwordDifferent')));
        }
        callback();
      };
      return {
        isSendVerifyCodeButtonActive: true,
        verifyCodeButtonContent: this.$t("m.sendVerificationCode"),
        formLabelWidth: this.isSmallScreen ? "0px" : "100px",
        recaptchaEnabled: recaptchaEnabled,
        formItemGutter: 5,
        form: {
          areaCode: "86",
          phoneNumber: "",
          verifyCode: "",
          password: "",
          passwordAgain: "",
          recaptcha: "",
        },
        rules: {
          phoneNumber: [
            {required: true, message: this.$t('m.pleaseEnterPhoneNumber'), trigger: "blur"},
            {validator: checkPhoneNumber, trigger: "blur"}
          ],
          verifyCode: [
            {required: true, message: this.$t('m.pleaseEnterVerificationCode'), trigger: "blur"},
            {min: 6, max: 6, message: this.$t('m.pleaseEnterRightLengthVerificationCode'), trigger: "blur"}
          ],
          password: [
            {required: true, message: this.$t('m.pleaseEnterPassword'), trigger: "blur"},
            {validator: checkPassword, trigger: "blur"}
          ],
          passwordAgain: [
            {required: true, message: this.$t('m.pleaseEnterPasswordAgain'), trigger: "blur"},
            {validator: checkPasswordConfirmation, trigger: "blur"}
          ],
        },
      }
    },
    methods: {
      resetForm() {
        this.form.phoneNumber = "";
        this.form.verifyCode = "";
        this.form.password = "";
        this.form.passwordAgain = "";
        this.form.recaptcha = "";
      },
      handleForgetPasswordDialogClosed() {
        this.resetForm();
        this.$store.state.forgetPasswordDialogVisible = false;
        this.$refs["form"].clearValidate();
      },
      handleAreaCodeChange() {
        this.$refs["form"].validateField("phoneNumber");
      },
      handleRecaptchaVerify(response) {
        this.form.recaptcha = response;
      },
      submitReset() {
        this.$refs["form"].validate(valid => {
          if (!valid) return false;

          if (recaptchaEnabled && !this.form.recaptcha) {
            this.$message.warning(this.$t('m.pleaseVerifyIdentity'));
            return false
          }

          let params = {
            sms_token: this.form.verifyCode,
            new_password: this.form.password,
            new_password_confirmation: this.form.passwordAgain,
          };

          if (this.form.areaCode == '81' && this.form.phoneNumber.startsWith('0')) {
            params.phone = this.form.areaCode + this.form.phoneNumber.substring(1);
          } else {
            params.phone = this.form.areaCode + this.form.phoneNumber;
          }

          resetPassword(params).then(response => {
            this.handleForgetPasswordDialogClosed();
            if (response.status === 200) {
              this.$message.success(this.$t('m.resetSuccess'));
            }
          })
            .catch(err => {
              console.dir(err);
            });
        });
      },
    },
    computed: {
      ...mapState([
        "isSmallScreen"
      ])
    }
  }
</script>

<style lang="less">
  @import "dialog";
</style>

<style lang="scss" scoped>
  .common-dialog {
    .input-and-smsbtn {
      text-align: left;
      .el-form-item__content {
        .el-input-group {
          width: calc(100% - 86px);
        }
      }
    }
  }

  .google-recaptcha-container {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 10px 0;
  }

  .email-user-tips {
    font-size: 10px;
    color: darkgray;
  }
</style>