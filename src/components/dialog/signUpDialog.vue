<template>
  <el-dialog @close="handleSignUpDialogClose"
             :lock-scroll="true"
             :fullscreen="isSmallScreen"
             class="common-dialog"
             :title="$t('m.register')"
             :visible.sync="$store.state.signUpDialogVisible">
    <el-form ref="form" :rules="rules" :show-message="true" :model="form">

      <el-form-item prop="phoneNumber" class="input-and-smsbtn">
        <el-input type="number" :placeholder="$t('m.pleaseEnterPhoneNumber')" v-model="form.phoneNumber"
                  class="input-with-select"
                  @click.native="updateAnalytics($route.path, constants.category.SIGN, constants.activity.INPUT, 'phone_number')">
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
                  v-model="form.verifyCode" auto-complete="off"
                  @click.native="updateAnalytics($route.path, constants.category.SIGN, constants.activity.INPUT, 'vertify_code')"></el-input>
      </el-form-item>

      <el-form-item prop="password">
        <el-row :gutter="formItemGutter">
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
            <el-input type="password" :placeholder="$t('m.pleaseEnterPassword')" class="verifycode-inp"
                      v-model="form.password" auto-complete="off"
                      @click.native="updateAnalytics($route.path, constants.category.SIGN, constants.activity.INPUT, 'password')"></el-input>
          </el-col>
        </el-row>
      </el-form-item>

      <el-form-item prop="passwordAgain">
        <el-row :gutter="formItemGutter">
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
            <el-input type="password" :placeholder="$t('m.pleaseEnterPasswordAgain')" class="verifycode-inp"
                      v-model="form.passwordAgain" auto-complete="off"
                      @click.native="updateAnalytics($route.path, constants.category.SIGN, constants.activity.INPUT, 'password_again')"></el-input>
          </el-col>
        </el-row>
      </el-form-item>

      <el-form-item prop="username" class="register-username">
        <el-row :gutter="formItemGutter">
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
            <el-input @keydown.native.enter="submitRegister" :placeholder="$t('m.pleaseEnterUsername')"
                      class="verifycode-inp" v-model="form.username" auto-complete="off"
                      @click.native="updateAnalytics($route.path, constants.category.SIGN, constants.activity.INPUT, 'username')"></el-input>
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

      <el-form-item prop="isAgreement" class="agreement" label="" :label-width="formLabelWidth">

        <el-checkbox v-model="form.isAgreement" @change="updateAnalytics($route.path, constants.category.SIGN, constants.activity.CHECK, 'user_term', form.isAgreement)">{{$t('m.agree')}}</el-checkbox>
        <span @click="$store.state.userTermDialogVisible = true">{{$t('m.userTerms')}}</span>
      </el-form-item>
    </el-form>

    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitRegister">{{$t('m.register')}}</el-button>
      <div>
        <span>{{$t('m.existingAccount')}} <a @click="loginAction" href="javascript:void(0)">{{$t('m.login')}}</a></span>
      </div>
    </div>
  </el-dialog>
</template>

<script>
  import {mapState, mapMutations} from "vuex";
  import dingXiangCaptcha from "../widget/dingXiangCaptcha.vue";
  import {recaptchaEnabled} from "../../config/env.js";
  import {signHeader} from "../../service/sign.js";
  import sendSmsButton from "../widget/sendSmsButton.vue";
  import {signUp, signIn} from "../../service/api/signAPI.js";
  import {UPDATE_USER_INFO, USER_ACCESS_TOKEN} from "../../store/mutation-types.js";

  export default {
    components: {
      sendSmsButton,
      dingXiangCaptcha
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
      let checkUsername = (rule, value, callback) => {
        let JAPANESE_REGEXP = /[\u3000-\u303f\u3040-\u309f\u30a0-\u30ff\uff00-\uff9f\u4e00-\u9faf\u3400-\u4dbfA-Za-z0-9_()·.]{3,12}/;
        let CHINESE_REGEXP = /[\u4E00-\u9FA5A-Za-z0-9_()·.]{3,12}/;
        if (JAPANESE_REGEXP.test(value) || CHINESE_REGEXP.test(value)) {
          callback();
        } else {
          callback(new Error(this.$t('m.pleaseEnterRightUsername')));
        }
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
      let checkAgreement = (rule, value, callback) => {
        if (!value) {
          return callback(new Error(this.$t('m.pleaseAgreeTermsOfUser')));
        }
        callback();
      };
      return {
        recaptchaEnabled: recaptchaEnabled,
        searchKey: "",
        userTermsDialogVisible: false,
        sendVerifyCodeTimerId: -1,
        form: {
          areaCode: "86",
          phoneNumber: "",
          verifyCode: "",
          password: "",
          passwordAgain: "",
          username: "",
          recaptcha: "",
          isAgreement: false,
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
          username: [
            {required: true, message: this.$t('m.pleaseEnterUsername'), trigger: "blur"},
            {min: 3, max: 12, message: this.$t('m.pleaseEnterRightLengthUsername'), trigger: "blur"},
            {validator: checkUsername, trigger: "blur"}
          ],
          isAgreement: [
            {required: true, message: this.$t('m.pleaseAgreeTermsOfUser'), trigger: "change"},
            {validator: checkAgreement, trigger: "change"}
          ]
        },
        formLabelWidth: this.isSmallScreen ? "0px" : "100px",
        formItemGutter: 5,
        params: {
          phone: "",
          nickname: "",
          password: "",
          password_confirmation: "",
          recaptcha: "",
          sms_token: ""
        },
      };
    },
    methods: {
      ...mapMutations([UPDATE_USER_INFO, USER_ACCESS_TOKEN]),
      handleAreaCodeChange() {
        this.$refs["form"].validateField("phoneNumber");
        this.updateAnalytics(this.$route.path, this.constants.category.SIGN, this.constants.activity.CLICK, 'change_sign_up_area_code', this.form.areaCode)
      },
      submitRegister() {
        this.updateAnalytics(this.$route.path, this.constants.category.SIGN, this.constants.activity.CLICK, 'sign_up_submit')
        this.$refs["form"].validate(valid => {
          if (!valid) return false;
          if (recaptchaEnabled && !this.form.recaptcha) {
            this.$message.warning(this.$t('m.pleaseVerifyIdentity'));
            return false
          }
          if (this.form.areaCode == '81' && this.form.phoneNumber.startsWith('0')) {
            this.params.phone = this.form.areaCode + this.form.phoneNumber.substring(1);
          } else {
            this.params.phone = this.form.areaCode + this.form.phoneNumber;
          }
          this.params.nickname = this.form.username;
          this.params.password = this.form.password;
          this.params.password_confirmation = this.form.passwordAgain;
          this.params.sms_token = this.form.verifyCode;
          this.params.recaptcha = this.form.recaptcha;
          let headers = signHeader("/api/v1/users/sign_up");
          signUp(this.params, headers)
            .then(response => {
              if (response.status === 200) {
                this.submitLogin();
              }
            })
            .catch(err => {
              console.dir(err);
            });
        });
      },
      submitLogin() {
        let headers = signHeader("/api/v1/users/sign_in");
        signIn(this.params, headers)
            .then(response => {
              if (response.status === 200) {
                this.$message.success(this.$t('m.signInSuccess'));
                this.handleSignUpDialogClose();
                this.USER_ACCESS_TOKEN({
                  token: response.data.access_token,
                  isRemember: this.form.isRememberMe
                });
                this.UPDATE_USER_INFO({
                  userInfo: response.data,
                  isRemember: this.form.isRememberMe
                });
                location.reload(true);
                this.$ga.set('userId', response.data.id);
              }
            })
            .catch(err => {
              console.dir(err);
            });
      },
      resetForm() {
        this.form.phoneNumber = "";
        this.form.verifyCode = "";
        this.form.password = "";
        this.form.passwordAgain = "";
        this.form.username = "";
        this.form.recaptcha = "";
        this.form.isAgreement = false;
        this.$refs.captcha.reload();
        this.$refs["form"].clearValidate();
      },
      handleSignUpDialogClose() {
        this.$store.state.signUpDialogVisible = false;
        this.resetForm();
        this.updateAnalytics(this.$route.path, this.constants.category.SIGN, this.constants.activity.CLICK, 'close_sign_up_dialog')
      },
      handleRecaptchaVerify(response) {
        this.form.recaptcha = response;
      },
      loginAction() {
        this.$store.state.signInDialogVisible = true;
        this.$store.state.signUpDialogVisible = false;
        this.$store.state.userTermDialogVisible = false;
        this.updateAnalytics(this.$route.path, this.constants.category.SIGN, this.constants.activity.CLICK, 'open_sign_in_dialog')
      }
    },
    computed: {
      ...mapState([
        "isSmallScreen",
      ])
    }
  }
</script>

<style lang="less">
  @import "dialog";
</style>

<style lang="scss" scoped>
  .common-dialog {
    .register-username {
      margin-bottom: 25px;
    }
    .input-and-smsbtn {
      text-align: left;
      .el-form-item__content {
        .el-input-group {
          width: calc(100% - 86px);
        }
      }
    }
  }

  .agreement /deep/ {
    text-align: center;
    height: 40px;
    font-size: 14px;
    color: #646464;
    span {
      cursor: pointer;
      font-size: 14px;
      color: #6526b8;
    }
    .el-form-item__error {
      top: 10px;
      width: 120px;
      left: auto;
      left: initial;
    }
  }
</style>
