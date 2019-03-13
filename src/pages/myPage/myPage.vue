<template>
  <div class="my-page-container">
    <el-row class="personal-info-container layer">
      <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
        <div class="personal-info-left-container">
          <div class="user_img">
            <img :src="userInfo.avatar_url || '/static/avatar.png?my_page'" :onerror="defaultImg" alt="">
          </div>
          <div class="username-container">
            <p class="name ellipsis">{{userInfo.nickname}}</p>
          </div>
          <div class="location-container ellipsis">
            <icon name="location" scale="100"></icon>
            <span>{{ministryFilter}}</span>
          </div>
          <div class="separation-line"></div>
          <div class="settings-container">
            <router-link to="/settings">
              <icon name="settings" scale="100"></icon>
            </router-link>
          </div>
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
        <div class="count-down">
          <span class='count-down-date count-down-date-first'> {{$t('m.distanceTest')}}</span>
          <span class='date-num'>{{countDownNum1}}</span>
          <span class='date-num'>{{countDownNum2}}</span>
          <span class='date-num'>{{countDownNum3}}</span>
          <span class='count-down-date count-down-date-last'>{{$t('m.day')}}</span>
        </div>
      </el-col>
    </el-row>

    <div class="layer learning-container">
      <span class="section-title learning-title"><span>{{$t('m.learning')}}</span></span>
      <el-collapse :class="{'learning-group': true, 'expired': product.expired}" v-for="product in productsData" :key="product.id">
        <el-collapse-item>
          <template slot="title">
            <el-row class="product-container">
              <el-col :xs="7" :sm="7" :md="7" :lg="7" :xl="7">
                <div class="product-picture">
                  <img class="course-icon" :src="product.image_url || 'null_course_icon'" :onerror="defaultImg" alt="">
                </div>
              </el-col>
              <el-col :xs="5" :sm="5" :md="5" :lg="5" :xl="5">
                <div class="study-progress-content">
                  <div class="include-courses">
                    <icon name="pen" scale="200"></icon>
                    <div class="text-container">
                      <p>{{$t('m.includeCourses')}}</p>
                      <span>{{product.courses_count}}</span>
                    </div>
                  </div>
                  <div class="learning-people">
                    <icon name="peoples" scale="200"></icon>
                    <div class="text-container">
                      <p>{{$t('m.readingTheNumberOfPeople')}}</p>
                      <span>{{product.purchases_count}}</span>
                    </div>
                  </div>
                </div>

              </el-col>
              <el-col class="study-description" :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
                <p class="product-name product-description">
                  {{product.name}}
                  <span>{{$t('m.validTill')}}:{{product.expired_at.substring(0,10)}}</span>
                </p>
                <label class="product-description" v-html="product.description"></label>
              </el-col>
            </el-row>
          </template>
          <learning-course-items :expired="product.expired" :datas="product.courses"></learning-course-items>
        </el-collapse-item>
      </el-collapse>

      <el-alert
        class="no-data"
        v-if="productsData && productsData.length === 0"
        type="info"
        show-icon
        center
        :title="$t('m.noData')">
      </el-alert>
    </div>
  </div>
</template>

<script>
  import learningCourseItems from "../../components/common/learningCourseItems.vue";
  import {getUserProuducts} from "../../service/api/userAPI.js";
  import {getMinistries} from "../../service/api/settingAPI.js";
  import {mapState} from "vuex";

  export default {
    components: {
      learningCourseItems
    },
    computed: {
      ...mapState(["userInfo"]),
      examCountDown() {
        const examDates = [
          new Date(2019, 5, 16), // To be announced
          new Date(2019, 10, 10)
        ];
        const today = new Date();

        let target = today;
        if (today < examDates[0]) {
          target = examDates[0];
        } else if (today > examDates[0] && today < examDates[1]) {
          target = examDates[1];
        }

        let diff = Math.ceil((target - today) / 86400000);
        if (diff < 0) {
          diff = 0;
        }

        return (diff + '').padStart(3, '0');
      },
      countDownNum1() {
        return this.examCountDown[0]
      },
      countDownNum2() {
        return this.examCountDown[1]
      },
      countDownNum3() {
        return this.examCountDown[2]
      },
      ministryFilter() {
        let ministry;
        for (let i = 0; i < this.ministryInfos.length; i++) {
          let ministryInfo = this.ministryInfos[i];
          ministry = ministryInfo.ministries.find(item => {
            return item.id === this.userInfo.ministry_id;
          });
          if (ministry) {
            break;
          }
        }
        return (ministry && ministry.name) || this.$t('m.unSetting');
      }
    },
    data() {
      return {
        defaultImg: 'this.src="' + require("../../../static/avatar.png") + '"',
        productsData: [],
        ministryInfos: [],
      };
    },
    created() {
      getUserProuducts()
        .then(response => {
          this.productsData = response.data;
          return getMinistries();
        })
        .then(response => {
          if (response) {
            this.ministryInfos = response.data;
          }
        })
        .catch(error => {
          console.dir(error);
        });
        if (this.userInfo.nickname) {
          document.title = this.userInfo.nickname;
        }
        if (this.$t('m.keywords')) {
          document.querySelector("meta[name='keywords']").setAttribute('content', this.$t('m.keywords'));
        }
        if (this.userInfo.nickname) {
          document.querySelector("meta[name='description']").setAttribute('content', this.userInfo.nickname.substr(0, 120));
        }
    },
  };
</script>

<style lang="less">
  .my-page-container {
    padding-top: 70px;
    .personal-info-container {
      margin-bottom: 50px;
      .personal-info-left-container {
        display: flex;
        align-items: center;
        > * {
          margin: 0 15px;
        }
        .user_img {
          background-color: #e6e6e6;
          border-radius: 50%;
          img {
            border-radius: 50%;
          }
        }
        .username-container {
          max-width: 160px;
          .name {
            font-size: 24px;
            color: #000;
            font-weight: bold;
          }
        }
        .location-container {
          max-width: 120px;
          font-size: 14px;
          color: #646464;
        }
        .separation-line {
          width: 1px;
          height: 28px;
          margin: 0;
          background-color: #e6e6e6;
        }
      }

      .count-down {
        display: flex;
        align-items: center;
        font-size: 18px;
        text-align: center;
        padding: 20px 40px !important;
        height: 120px;
        box-sizing: border-box;
        border: 2px solid #e6e6e6;
        box-sizing: border-box;
        border-radius: 10px;
        .count-down-date {
          font-size: 18px;
          font-weight: 600;
        }
        .count-down-date-first {
          width: 72px;
          font-size: 18px;
          display: inline-block;
          text-align: left;
          margin-right: 20px;
        }
        .count-down-date-last {
          margin-left: 15px;
        }
        .date-num {
          margin-right: 5px;
          height: 80px;
          line-height: 80px;
          width: 54px;
          font-size: 48px;
          color: #fff;
          display: inline-block;
          border-radius: 7px;
          background-color: #00deb7;
        }
      }
    }

    .learning-container {

      .el-collapse {
        border: none;
        .el-collapse-item {
          margin: 0;
          .el-collapse-item__header {
            border-radius: 5px;
            background-color: #fff;
            height: 180px;
            line-height: 180px;
            padding: 10px 15px;
            padding-bottom: 0;
            border: none;
            border-right: 1px solid #e6e6e6;
            overflow: hidden;
            &.is-active {
              border-bottom: 1px solid #e6e6e6;
            }
          }
          .el-collapse-item__arrow {
            line-height: 160px;
            text-align: center;
            &::before {
              color: #6526B8;
              font-size: 24px;
              font-weight: 600;
            }
          }
          .el-collapse-item__wrap {
            border: none;
            width: 100%;
            .el-collapse-item__content {
              padding-bottom: 15px;
            }
          }
        }
      }

      .learning-group {
        margin-bottom: 36px;
        overflow: hidden;
        background: #ffffff;
        box-shadow: 0px 12px 30px rgba(0, 0, 0, 0.2);
        border-radius: 10px;

        &.expired {
          *, *::before {
            color: #cccccc !important;
            background-color: #ffffff;
          }
        }
      }

      .learning-title {
        margin-bottom: 30px;
        span {
          font-size: 30px;
        }
      }

      .product-container {
        overflow: hidden;
        text-overflow: ellipsis;
        height: 100%;
        margin: 0 !important;
        background-color: #fff;
        box-sizing: border-box;
        .study-description {
          height: 100%;
          border-right: 1px solid #e6e6e6;
          display: flex;
          justify-content: flex-start;
          flex-direction: column;
          overflow: auto;
          .product-description {
            line-height: 2em;
            padding-right: 20px;
            color: #000;
          }
          .product-name {
            color: #6526B8;
          }
        }

        .product-picture {
          overflow: hidden;
          height: 160px;
          max-width: 240px;
          img {
            height: 160px;
          }
        }


        .study-progress-content {
          width: 100%;
          height: 160px;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          justify-content: space-around;
          overflow: hidden;
          .include-courses,
          .learning-people {
            font-size: 16px;
            display: flex;
            justify-content: center;
            align-items: center;
            line-height: 1;
            .text-container {
              border-left: 2px solid #e6e6e6;
              p {
                color: #000;
              }
              span {
                height: 30px;
                display: inline-block;
                color: #6526b8;
                margin-top: 8px;
              }
            }
          }
        }
      }
    }
  }
</style>
