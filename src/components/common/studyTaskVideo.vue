<template>
  <div v-loading="videoLoading" class="study-video-content">
    <div id="player"></div>
  </div>
</template>

<script>
  import {getVideoToken} from "../../service/api/coursesAPI.js";

  export default {
    props: ['currentLesson'],
    data() {
      return {
        videoLoading: true,
        polyvPlayer: null,
      }
    },
    created() {

      this.updatePolyv();
    },
    watch: {
      $route(to, from) {
        if (to.params.lessonId !== null && to.params.lessonId !== from.params.lessonId) {
          this.destroyPolyv();
        }
      }
    },
    methods: {
      updatePolyv() {
        if (!this.currentLesson.video) {
          return this.$message.error(this.$t('m.getVideoFailed'));
        }
        getVideoToken(this.currentLesson.video.vid)
          .then(response => {
            this.$nextTick(() => {
              if (!this.polyvPlayer) {
                this.polyvPlayer = polyvPlayer({
                  wrap: "#player",
                  height: 480,
                  vid: this.currentLesson.video.vid,
                  df: 0,
                  forceH5: true,
                  playsafe: response.data,
                  watchStartTime: this.currentLesson.status && this.currentLesson.status.video_time
                });
              } else {
                this.polyvPlayer.changeVid({
                  vid: this.currentLesson.video.vid,
                  playsafe: response.data,
                  watchStartTime: this.currentLesson.status && this.currentLesson.status.video_time
                })
              }
              window.s2j_onPlayOver = () => {
                this.$emit('onStudyFinished');
              };
              this.videoLoading = false;
            });
            window.s2j_onVideoPlay = () => {
              this.updateAnalytics(this.$route.path, this.constants.category.VIDEO, this.constants.activity.PLAY, this.constants.category.VIDEO, this.currentLesson.video.id)
            }
          })
          .catch(error => {
            console.dir(error);
          });
      },
      destroyPolyv() {
        if (this.polyvPlayer) {
          this.$emit('onSubmitVideoProgress', this.polyvPlayer.j2s_getCurrentTime(), 'false');
          this.polyvPlayer.HTML5.pause();
          this.polyvPlayer.destroy();
          this.polyvPlayer = null;
        }
      },
    }
  }
</script>

<style lang="less" scoped>
  .study-video-content {
    height: 480px;
    width: 100%;
    border: 1px solid;
  }

  .el-loading-mask {
    width: 100%;
    .el-loading-spinner {
      position: absolute;
    }
  }
</style>