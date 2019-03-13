<template>
  <div class="home-container">
    <el-carousel
      :type="$store.state.isSmallScreen? '' : 'card'"
      :arrow="$store.state.isSmallScreen ? 'always' : 'hover'"
      :trigger="$store.state.isSmallScreen ?  'click' : 'hover'">
      <el-carousel-item
        @click.native="updateAnalytics($route.path, constants.category.BANNER, constants.activity.CLICK, constants.category.BANNER, banner.href_url)"
        v-for="banner in banners" :key="banner.id">
        <a :href="banner.href_url" target="blank"><img :src="banner.image_url" alt=""></a>
      </el-carousel-item>
    </el-carousel>

    <el-row class="layer hidden-xs-only brand-advantage-container" :gutter="20">
      <el-col class="brand-advantage-item grid-content" :xs="24" :sm="6" :md="6" :lg="6" :xl="6"
              v-for="item in brandAdvantageDatas" :key="item.iconName">
        <div class="brand-advantage-icon-container">
          <icon scale="100" :name="item.iconName"></icon>
        </div>
        <p class="title">{{item.title}}</p>
        <span class="description" v-html="item.description"></span>
      </el-col>
    </el-row>

    <div class="layer container-padding open-class">
      <div class="section-title">
        <span>{{$t('m.openClass')}}</span>
        <span class="show-all"><router-link to="/openCourses">{{$t('m.showAll')}}</router-link></span>
      </div>
      <open-class-items :datas="openClassDatas"></open-class-items>
    </div>

    <div class="layer container-padding hot-class">
      <div class="section-title">
        <span>{{$t('m.hotProduct')}}</span>
        <span class="show-all"><router-link to="/products">{{$t('m.showAll')}}</router-link></span>
      </div>
      <product-items :datas="hotProductDatas"></product-items>
    </div>

    <div class="layer container-padding star-course">
      <div class="section-title">
        <span>{{$t('m.starCourse')}}</span>
        <span class="show-all"><router-link to="/courses">{{$t('m.showAll')}}</router-link></span>
      </div>
      <star-course-items :datas="starCourseDatas"></star-course-items>
    </div>

    <div class="layer container-padding media-coverage-container">
      <span class="section-title"><span>{{$t('m.mediaCoverage')}}</span></span>
      <div class="media-coverage-content-content">
        <a
          v-for="item in mediaCoverageDatas"
          :href="item.url"
          target="blank">
          <img :src="item.imgUrl" alt=""/>
        </a>
      </div>
    </div>
  </div>
</template>

<script>
  import openClassItems from "../../components/common/openClassItems.vue";
  import productItems from "../../components/common/productItems.vue";
  import starCourseItems from "../../components/common/courseItems.vue";
  import {getHomeCourses} from "../../service/api/coursesAPI.js";
  import {getHomeProducts} from "../../service/api/productsAPI.js";
  import {getBanners} from "../../service/api/homeAPI.js";

  export default {
    created() {
      getBanners()
        .then(response => {
          this.banners = response.data;
          return getHomeProducts();
        })
        .then(response => {
          this.hotProductDatas = response.data;
          return getHomeCourses();
        })
        .then(response => {
          this.starCourseDatas = response.data.courses;
          this.openClassDatas = response.data.free_courses;
        })
        .catch(error => {
          console.log(error);
        });
      if (this.$t('m.titleHome')) {
        document.title = this.$t('m.titleHome');
      }
      if (this.$t('m.keywords')) {
        document.querySelector("meta[name='keywords']").setAttribute('content', this.$t('m.keywords'));
      }
      if (this.$t('m.descriptionHome')) {
        document.querySelector("meta[name='description']").setAttribute('content', this.$t('m.descriptionHome').substr(0, 120));
      }

      this.$store.state.signUpDialogVisible = (this.$route.query.show_sign_up && this.$route.query.show_sign_up === "true");
    },
    components: {
      openClassItems,
      productItems,
      starCourseItems
    },
    methods: {},
    data() {
      return {
        brandAdvantageDatas: [
          {
            iconName: 'idea',
            title: this.$t('m.goodTeacher'),
            description: this.$t('m.goodTeacherDes')
          },
          {
            iconName: 'medal',
            title: this.$t('m.smartSystem'),
            description: this.$t('m.smartSystemDes')
          },
          {
            iconName: 'rocket',
            title: this.$t('m.goodPrice'),
            description: this.$t('m.goodPriceDes')
          },
          {
            iconName: 'custom_service',
            title: this.$t('m.goodService'),
            description: this.$t('m.goodServiceDes')
          },
        ],
        mediaCoverageDatas: [
          {
            imgUrl: './static/media_coverage_logo1.png',
            url: 'https://jp.techcrunch.com/2018/02/14/linc-fundrasing/'
          },
          {
            imgUrl: './static/media_coverage_logo2.png',
            url: 'http://thebridge.jp/2018/02/linc'
          },
          {
            imgUrl: './static/media_coverage_logo3.png',
            url: 'https://prtimes.jp/main/html/rd/p/000000001.000031766.html'
          },
          {
            imgUrl: './static/media_coverage_logo4.png',
            url: 'https://www.nikkei.com/article/DGXMZO26848240T10C18A2XY0000/'
          },
          {
            imgUrl: './static/media_coverage_logo5.png',
            url: 'https://www.jiemodui.com/N/89992.html'
          },
        ],
        openClassDatas: [],
        hotProductDatas: [],
        starCourseDatas: [],
        banners: [],
      };
    }
  };
</script>


<style lang="scss" scoped>
  .home-container {
    .el-carousel /deep/ {
      .el-carousel__container {
        text-align: center;
        .el-carousel__item--card {
          border-radius: 8px;
          max-width: 900px;
          /*box-shadow: 30px 30px 30px rgba(0, 0, 0, 0.1);*/
          a {
            img {
              width: 720px;
            }
          }
        }
      }
      .el-carousel__indicators {
        .el-carousel__indicator {
          .el-carousel__button {
            width: 12px;
            height: 12px;
            border-radius: 50%;
            background: rgba(101, 38, 184, 0.5);
          }
          &.is-active {
            .el-carousel__button {
              background: #6526B8;
            }
          }
        }
      }
    }

    .grid-content {
      display: -webkit-flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
    }

    .section-title {
      position: relative;
      .show-all {
        position: absolute;
        right: 0;
        top: 0;
      }
    }

    .brand-advantage-container {
      width: 940px;
      margin: 60px auto 30px !important;
      .brand-advantage-item {
        height: 263px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .brand-advantage-icon-container {
          border-radius: 50%;
          width: 150px;
          height: 150px;
          background: rgba(101, 38, 184, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .title {
          white-space: nowrap;
          font-family: "Sul Sans";
          font-size: 24px;
          color: #000;
        }
        .description {
          text-align: center;
        }
      }
    }

    .media-coverage-container {
      .section-title {
        text-align: center;
      }
      .media-coverage-content-content {
        text-align: center;
        a {
          img {
            margin: 10px;
            width: 20%;
          }
        }
      }
    }
  }
</style>