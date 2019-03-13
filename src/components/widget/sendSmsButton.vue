<template>
        <el-button class="send-verifycode-btn" :disabled="!isSendVerifyCodeButtonActive"
                   @click="sendVerificationCode" type="info">{{verifyCodeButtonContent}}
        </el-button>
</template>

<script>
  import {sendSms} from "../../service/api/signAPI.js";
  export default {
    props: ["areaCode", "phoneNumber"],
    data() {
      return {
        isSendVerifyCodeButtonActive: true,
        verifyCodeButtonContent: this.$t("m.sendVerificationCode"),
        coolDown: 60,
        countDown: 60,
        sendVerifyCodeTimerId: -1,
        filteredPhoneNumber: '',
      }
    },
    created() {
      this.filteredPhoneNumber = this.phoneNumber;
    },
    methods: {
      sendVerificationCode() {
        if (this.phoneNumber.length === 0) {
          return;
        }
        let chinaPhoneReg = /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/;
        if (this.areaCode == "86" && !chinaPhoneReg.test(this.phoneNumber)) {
          return;
        }
        let japanPhoneReg = /^0?\d{10,11}$/;
        if (this.areaCode == "81" && !japanPhoneReg.test(this.phoneNumber)) {
          return;
        }

        this.updateAnalytics(this.$route.path, this.constants.category.SIGN, this.constants.activity.CLICK, 'send_sms_verification_code')

        let sendSmsParams =  { phone: this.filteredPhoneNumber};
        return sendSms(sendSmsParams)
          .then(response => {
            if (response.status === 200) {
              this.sendSMSCountDown();
              this.$message.success(this.$t('m.smsSendSuccess'));
            }
          })
          .catch(err => {
            console.dir(err);
          });
      },
      sendSMSCountDown() {
        this.isSendVerifyCodeButtonActive = false;
        this.verifyCodeButtonContent =
          this.$t('m.resend') + "(" + --this.countDown + ")";
        this.sendVerifyCodeTimerId = setInterval(() => {
          this.verifyCodeButtonContent =
            this.$t('m.resend') + "(" + --this.countDown + ")";
          if (this.countDown === 0) {
            clearInterval(this.sendVerifyCodeTimerId);
            this.isSendVerifyCodeButtonActive = true;
            this.verifyCodeButtonContent = this.$t("m.sendVerificationCode");
            this.countDown = this.coolDown;
          }
        }, 1000);
      },
      filterJapanPhone(newVal) {
        if (this.areaCode == '81' && newVal.startsWith('0')) {
          return this.filteredPhoneNumber = this.areaCode + newVal.substring(1);
        }
        this.filteredPhoneNumber = this.areaCode + newVal;
      }
    },
    watch: {
      phoneNumber(newVal) {
        this.filterJapanPhone(newVal);
      },
      areaCode() {
        this.filterJapanPhone(this.phoneNumber);
      }
    }
  }
</script>

<style lang="scss" scoped>
.send-verifycode-btn /deep/ {
      position: absolute;
      right: 0;
      top: 15px;
      width: 86px;
      height: 30px;
      background: #00deb7;
      border-radius: 15px;
      border: none;
      padding: 0;
      span {
        font-weight: 600;
        font-size: 12px !important;
        text-align: center;
      }
    }
.send-verifycode-btn {
      &:focus,
      &:hover {
        background: #a6a9ad;
        border-color: #a6a9ad;
        color: #fff;
      }
    }
</style>