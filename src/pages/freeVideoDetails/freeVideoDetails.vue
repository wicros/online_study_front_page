<template>
  <div class="free-video-details-container">
    <breadcrumb class="hidden-sm-and-down"></breadcrumb>

    <el-row class="free-video-content-container layer container-padding">
      <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
        <div v-loading="videoLoading" class="video-player-container">
          <div id="player"></div>
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
        <div class="video-description-container ellipsis">
          <label class="title">{{openClassData.name}}</label>
          <label class="content ellipsis" v-html="openClassData.instruction"></label>
        </div>
      </el-col>
    </el-row>

    <div class="layer container-padding open-class">
      <div class="section-title">
        <span>{{$t('m.recommendOpenClass')}}</span>
      </div>
      <open-class-items :datas="openClassData.recommend_courses"></open-class-items>
    </div>
  </div>
</template>

<script>
  import breadcrumb from "../../components/common/breadcrumb.vue";
  import openClassItems from "../../components/common/openClassItems.vue";
  import {mapMutations} from "vuex";
  import {
    SAVE_BREADCRUMBS,
    REMOVE_BREADCRUMBS,
  } from "../../store/mutation-types.js";
  import {showCourse, getVideoToken} from "../../service/api/coursesAPI.js";
  import {getLessons} from "../../service/api/lessonAPI.js";

  export default {
    components: {
      breadcrumb,
      openClassItems
    },
    data() {
      return {
        openClassData: {},
        lessonDatas: {},
        videoLoading: false,
        polyvPlayer: null
      };
    },
    methods: {
      ...mapMutations([SAVE_BREADCRUMBS, REMOVE_BREADCRUMBS]),
      updateCourseData() {
        this.videoLoading = true;
        if (this.polyvPlayer && this.polyvPlayer.HTML5) {
          this.polyvPlayer.HTML5.pause();
        }
        showCourse(this.$route.params.id)
          .then(response => {
            this.openClassData = response.data;
            this.SAVE_BREADCRUMBS(this.openClassData.name);
            if (this.openClassData.name) {
              document.title = this.openClassData.name + this.$t('m.titleSuffix');
            }
            if (this.$t('m.keywords')) {
              document.querySelector("meta[name='keywords']").setAttribute('content', this.$t('m.keywords'));
            }
            if (this.openClassData.description) {
              document.querySelector("meta[name='description']").setAttribute('content', this.openClassData.description.substr(0, 120));
            }
            if (this.openClassData.id.toString() !== this.$route.params.id.toString()) {
              this.$router.push({path: '/404'});
            }
          return getLessons(this.$route.params.id);
          })
          .then(response => {
            this.lessonDatas = response.data;
            if (this.lessonDatas.sections.length > 0 && this.lessonDatas.sections[0].lessons[0].video) {
              return getVideoToken(this.lessonDatas.sections[0].lessons[0].video.vid);
            } else {
              this.$message.error(this.$t('m.notFoundOpenInfo'));
              return Promise.reject(this.$t('m.noOpenInfo'));
            }
          })
          .then(response => {
            this.$nextTick(() => {
              if (!this.polyvPlayer) {
                this.polyvPlayer = polyvPlayer({
                  wrap: "#player",
                  height: 340,
                  vid: this.lessonDatas.sections[0].lessons[0].video.vid,
                  df: 0,
                  playsafe: response.data
                })
              } else {
                this.polyvPlayer.changeVid({
                  vid: this.lessonDatas.sections[0].lessons[0].video.vid,
                  playsafe: response.data
                })
              }
              this.videoLoading = false;
            });
            window.s2j_onVideoPlay = () => {
              this.updateAnalytics(this.$route.path, this.constants.category.VIDEO, this.constants.activity.PLAY, this.constants.category.VIDEO, this.lessonDatas.sections[0].lessons[0].video.id)
            }
          })
          .catch(error => {
            console.dir(error);
            this.$router.push({path: '/404'});
          });
      }
    },
    destroyed() {
      this.REMOVE_BREADCRUMBS(this.openClassData.name);
    },
    beforeRouteUpdate(to, from, next) {
      next();
      this.updateCourseData();
      this.REMOVE_BREADCRUMBS(this.openClassData.name);
    },
    created() {
      this.updateCourseData();
    }
  };
</script>

<style lang="less">
  .free-video-details-container {
    .free-video-content-container {
      padding-top: 0;
      .el-col {
        margin-top: 0;
      }
      .video-player-container {
        position: relative;
        height: 340px;
        .el-loading-spinner {
          width: 100%;
          position: absolute;
        }
        .video-player-container-action {
          width: 98px;
          height: 98px;
          position: absolute;
          cursor: pointer;
          left: 40%;
          top: 35%;
          border-radius: 50%;
          z-index: 200;
          background-color: #6526b8;
          svg {
            position: absolute;
            left: 35%;
            top: 27%;
          }
        }
      }
      .video-description-container {
        box-sizing: border-box;
        height: 340px;
        width: 93%;
        margin-left: 30px;
        border-top: 1px solid #e6e6e6;
        border-bottom: 1px solid #e6e6e6;
        font-family: "Sul Sans";
        color: #000000;
        .title {
          font-size: 32px;
          display: block;
          margin: 10px 0;
        }
        .content {
          font-size: 14px;
          line-height: 1.8em;
          margin-top: 20px;
          white-space: normal;
        }
      }
    }
    .open-class {
      margin-top: 60px;
    }
  }
</style>
