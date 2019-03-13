<template>
  <el-dialog @close="handleSignInDialogClose"
             :lock-scroll="true"
             :fullscreen="isSmallScreen"
             class="common-dialog"
             :title="$t('m.login')"
             :visible.sync="$store.state.signInDialogVisible">
    <el-form ref="form" :rules="rules" :show-message="true" :model="form">

      <el-form-item v-if="phoneLoginType" prop="phoneNumber">
        <el-input type="number" :placeholder="$t('m.pleaseEnterPhoneNumber')" v-model="form.phoneNumber"
                  class="input-with-select">
          <el-select @change="handleAreaCodeChange" class='numPre' v-model="form.areaCode" slot="prepend" value="1"
                     placeholder="+86">
            <el-option label="+86" value="86">{{$t('m.China')}} +86</el-option>
            <el-option label="+81" value="81">{{$t('m.Japan')}} +81</el-option>
          </el-select>
        </el-input>
      </el-form-item>

      <el-form-item v-else prop="email">
        <el-input type="email" :placeholder="$t('m.pleaseEnterEmail')" v-model="form.email"></el-input>
      </el-form-item>

      <el-form-item prop="password">
        <el-row :gutter="formItemGutter">
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
            <el-input @keydown.native.enter="submitLogin" type="password"
                      :placeholder="$t('m.pleaseEnterPassword')" class="verifycode-inp" v-model="form.password"
                      auto-complete="off"></el-input>
          </el-col>
        </el-row>
      </el-form-item>

      <el-form-item class="remember-me" label="" :label-width="formLabelWidth">
        <el-checkbox v-model="form.isRememberMe">{{$t('m.rememberMe')}}</el-checkbox>
        <a @click="forgotPasswordAction"
           href="javascript:void(0)">{{$t('m.forgotPassword')}}</a>
      </el-form-item>

      <el-form-item class="robatmark" label="" :label-width="formLabelWidth" v-show="recaptchaEnabled">
        <el-row :gutter="formItemGutter">
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
            <ding-xiang-captcha captchaStyle="inline" ref="captcha" @handleRecaptchaVerify="handleRecaptchaVerify" ></ding-xiang-captcha>
          </el-col>
        </el-row>
      </el-form-item>

    </el-form>

    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitLogin">{{$t('m.login')}}</el-button>
      <div>
        <span>{{$t('m.noAccount')}} <a @click="registerAction"
                                       href="javascript:void(0)">{{$t('m.registerNow')}}</a></span>
        <span class="change-login-span">
            <a v-if="phoneLoginType" @click="changeLoginType" href="javascript:void(0)">{{$t('m.emailSignIn')}}</a>
            <a v-else @click="changeLoginType" href="javascript:void(0)">{{$t('m.phoneSignIn')}}</a>
          </span>
      </div>
    </div>
  </el-dialog>
</template>

<script>
  import {mapState, mapMutations} from "vuex";
  import dingXiangCaptcha from "../widget/dingXiangCaptcha.vue";
  import {UPDATE_USER_INFO, USER_ACCESS_TOKEN} from "../../store/mutation-types.js";
  import {signIn} from "../../service/api/signAPI.js";
  import {signHeader} from "../../service/sign.js";
  import {recaptchaEnabled} from "../../config/env.js";

  export default {
    components: {
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
        let japanPhoneReg = /^\d{10,11}$/;
        if (this.form.areaCode == "81") {
          if (!japanPhoneReg.test(value)) {
            return callback(new Error(this.$t('m.pleaseEnterRightJapanNumber')));
          }
        }
        callback();
      };
      return {
        phoneLoginType: true,
        recaptchaEnabled: recaptchaEnabled,
        form: {
          areaCode: "86",
          phoneNumber: "",
          email: "",
          password: "",
          recaptcha: "",
          isRememberMe: true,
        },
        rules: {
          phoneNumber: [
            {required: true, message: this.$t('m.pleaseEnterPhoneNumber'), trigger: "blur"},
            {validator: checkPhoneNumber, trigger: "blur"}
          ],
          email: [
            {required: true, message: this.$t('m.pleaseEnterEmail'), trigger: "blur"},
          ],
          password: [
            {required: true, message: this.$t('m.pleaseEnterPassword'), trigger: "blur"},
            // {validator: checkPassword, trigger: "blur"}
          ]
        },
        formLabelWidth: this.isSmallScreen ? "0px" : "100px",
        formItemGutter: 5,
        params: {
          phone: "",
          email: "",
          password: "",
          recaptcha: "",
        },
      };
    },
    methods: {
      ...mapMutations([UPDATE_USER_INFO, USER_ACCESS_TOKEN]),
      changeLoginType() {
        this.phoneLoginType = !this.phoneLoginType;
        this.resetForm();
        this.updateAnalytics(this.$route.path, this.constants.category.SIGN, this.constants.activity.CLICK, 'change_login_type', this.phoneLoginType)
      },
      handleAreaCodeChange() {
        this.$refs["form"].validateField("phoneNumber");
        this.updateAnalytics(this.$route.path, this.constants.category.SIGN, this.constants.activity.CLICK, 'change_sign_in_area_code', this.form.areaCode)
      },
      submitLogin() {
        this.$refs["form"].validate(valid => {
          if (!valid) return false;
          if (recaptchaEnabled && !this.form.recaptcha) {
            this.$message.warning(this.$t('m.pleaseVerifyIdentity'));
            return false
          }
          if (this.phoneLoginType) {
            if (this.form.areaCode == '81' && this.form.phoneNumber.startsWith('0')) {
              this.params.phone = this.form.areaCode + this.form.phoneNumber.substring(1);
            } else {
              this.params.phone = this.form.areaCode + this.form.phoneNumber;
            }
          } else {
            this.params.email = this.form.email;
          }
          this.params.password = this.form.password;
          this.params.recaptcha = this.form.recaptcha;
          let headers = signHeader("/api/v1/users/sign_in");
          signIn(this.params, headers)
            .then(response => {
              if (response.status === 200) {
                this.$message.success(this.$t('m.signInSuccess'));
                this.handleSignInDialogClose();
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
        });
      },
      resetForm() {
        this.form.email = "";
        this.form.phoneNumber = "";
        this.form.password = "";
        this.$refs["form"].clearValidate();
        this.$refs.captcha.reload();
      },
      handleSignInDialogClose() {
        this.$store.state.signInDialogVisible = false;
        this.resetForm();
        this.updateAnalytics(this.$route.path, this.constants.category.SIGN, this.constants.activity.CLICK, 'close_sign_in_dialog')
      },
      handleRecaptchaVerify(response) {
        this.form.recaptcha = response;
      },
      registerAction() {
        this.$store.state.signUpDialogVisible = true;
        this.$store.state.signInDialogVisible = false;
        this.$store.state.userTermDialogVisible = false;
        this.updateAnalytics(this.$route.path, this.constants.category.SIGN, this.constants.activity.CLICK, 'open_sign_up_dialog')
      },
      forgotPasswordAction() {
        this.$store.state.forgetPasswordDialogVisible = true;
        this.$store.state.signInDialogVisible = false;
        this.$store.state.signUpDialogVisible = false;
        this.$store.state.userTermDialogVisible = false;
        this.updateAnalytics(this.$route.path, this.constants.category.SIGN, this.constants.activity.CLICK, 'open_forgot_password_dialog')
      }
    },
    computed: {
      ...mapState([
        "isSmallScreen",
        "userInfo",
      ])
    }
  }
</script>

<style lang="less">
  @import "dialog";
</style>

<style lang="less" scoped>
  .remember-me {
    margin: 25px 0;
    > div {
      overflow: hidden;
      .el-checkbox {
        float: left;
      }
    }
  }
</style>
