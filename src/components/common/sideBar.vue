<template>
  <ul class="side-bar-container hidden-sm-and-down">
    <li @mouseenter="handlePhoneMouseenter" @mouseleave="handlePhoneMouseleave"
        class="client-service-item">
      <span>
        <icon name="phone" scale="100"></icon>
      </span>
      <p>{{$t('m.clientServicePhone')}}</p>
      <div v-show="isShowPhone" class="pop-container phone-pop-container">
        <span>
          {{$t('m.clientServicePhoneJP')}}
        </span>
        <span>
          +81
        </span>
        <a href="tel:03-6240-2155">03-6240-2155</a>
        <span>
          {{$t('m.clientServicePhoneCH')}}
        </span>
        <span>
          +86
        </span>
        <a href="tel:18210777570">182-1077-7570</a>

      </div>
    </li>
    <li @mouseenter="handleWechatMouseenter" @mouseleave="handleWechatMouseleave"
        class="client-service-item">
        <span>
          <icon name="wechat" scale="200"></icon>
        </span>
      <p>{{$t('m.clientServiceWechat')}}</p>
      <div v-show="isShowWechat" class="pop-container wechat-pop-container">
        <span>{{$t('m.clientServiceWechat')}}: yitoucunmin</span>
        <icon name="qrcode" scale="112"></icon>
      </div>
    </li>
    <li @click="toTop" :class="{'to-top': true, 'show': isShowToTop}">
      <span class="el-icon-arrow-up"></span>
    </li>
  </ul>
</template>

<script>
export default {
  data() {
    return {
      isShowPhone: false,
      isShowWechat: false,
      isShowToTop: false,
      toTopTimer: -1
    };
  },
  methods: {
    toTop() {
      this.toTopTimer = setInterval(() => {
        let target = 0;
        let currentTop =
          document.documentElement.scrollTop || document.body.scrollTop || 0;
        window.scrollBy(0, -170);
        if (currentTop <= target) {
          clearInterval(this.toTopTimer);
        }
      }, 15);
    },
    handlePhoneMouseenter() {
      this.isShowPhone = true;
      this.updateAnalytics(this.$route.path, this.constants.category.PHONE, this.constants.activity.HOVER, this.$route.name);
    },
    handlePhoneMouseleave() {
      this.isShowPhone = false;
    },
    handleWechatMouseenter() {
      this.isShowWechat = true;
      this.updateAnalytics(this.$route.path, this.constants.category.WECHAT, this.constants.activity.HOVER, this.$route.name);
    },
    handleWechatMouseleave() {
      this.isShowWechat = false;
    }
  },
  mounted() {
    window.addEventListener("mousewheel", () => {
      if (this.toTopTimer !== -1) {
        clearInterval(this.toTopTimer);
        this.toTopTimer = -1;
      }
    });
    window.addEventListener("scroll", () => {
      let scrollTop =
        document.body.scrollTop || document.documentElement.scrollTop;
      let clientHeight =
        document.body.clientHeight || document.documentElement.clientHeight;
      let docScrollHeight =
        document.body.scrollHeight || document.documentElement.scrollHeight;
      let toBottomPx = docScrollHeight - scrollTop - clientHeight;
      this.isShowToTop = toBottomPx < 300;
    });
  }
};
</script>


<style lang="less" scoped>
  .side-bar-container {
    width: 90px;
    height: 256px;
    position: fixed;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    z-index: 999;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background: #6526b8;
    border-radius: 100px;
  }

  li {
    position: relative;
    color: white;
    display: flex; /*Flex布局*/
    display: -webkit-flex; /* Safari */
    align-items: center; /*指定垂直居中*/
    justify-content: center; /*水平居中*/
  }

  .client-service-item {
    flex-direction: column;
    margin: 19px 0;
    cursor: pointer;
    p {
      font-size: 12px;
    }
    .pop-container {
      background: #ffffff;
      box-shadow: 0px 12px 30px rgba(0, 0, 0, 0.25);
      border-radius: 4px;
      position: absolute;
      top: 0;
      left: 0;
      transform: translateX(-100%);
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 17px;
      padding-right: 0;
      span {
        font-size: 12px;
        color: #6526b8;
      }
    }

    .phone-pop-container {
      width: 174px;
      a {
        font-family: "Sul Sans";
        font-size: 20px;
        color: #6526b8;
      }
    }

    .wechat-pop-container {
      width: 174px;
      height: 199px;
      padding-left: 10px;
      span {
        padding-left: 12px;
      }
    }
  }

  .to-top {
    width: 0;
    overflow: hidden;
    cursor: pointer;
    transition: all 0.5s cubic-bezier(0.42, 0, 0.58, 1);
    opacity: 0;
    .el-icon-arrow-up {
      font-size: 20px;
      color: #fff;
    }
    &.show {
      width: 70%;
      opacity: 1;
    }
  }
</style>
