<template>
  <div>
    <el-row :gutter="10" class="row-bg learning-course-container">
      <el-col class="learning-course-item" :xs="24" :sm="12" :md="8" :lg="8" :xl="8" v-for="item in datas"
              :key="item.id">
        <div class="grid-content-item">
          <div class="learning-course-content">
            <div class="course-icon">
              <img :src="item.image_url || 'null_course'" :onerror="defaultImg" alt="">
            </div>
            <div class="learning-course-info">
              <div class="course-name ellipsis">{{item.name}}</div>
              <div class="course-time-peoples">
                <p class="learning-course-info-time">
                  <span class="count">{{item.lessons_count}}</span>
                  <span class="count-des">{{$t('m.classHour')}}</span>
                </p>
                <p class="course-people-numbers">
                  <span class="count">{{item.purchases_count}}</span>
                  <span class="count-des">{{$t('m.peopleLearned')}}</span>
                </p>
              </div>
              <div class="task-description">
                <div v-if="item.progress == 100" class="course-study-finish">
                  <icon name="finished" scale="100"></icon>
                </div>
                <div class="course-study-des">
                  <p v-if="item.last_viewed_at" class="course-study-date">{{item.last_viewed_at | formatDateString}}</p>
                  <p class="course-study-task ellipsis">{{item.last_viewed_lesson ? item.last_viewed_lesson.name :
                    $t('m.startLearningRight')}}</p>
                </div>
              </div>
            </div>
          </div>
          <div class="grid-content-bottom">
            <div class="progress">
              <el-progress v-if="item.progress" :show-text="false" color="#00DEB7" :width="32" type="circle"
                           :percentage="parseInt(item.progress) || 0"></el-progress>
              <p v-if="item.progress">
                <span>{{$t('m.totalProgress')}}</span><br>
                <span>{{item.progress}}%</span>
              </p>
            </div>
            <div class="handle-container">
              <el-button v-show="!expired" @click="showDirectory(item.id)" class="show-directory">{{$t('m.viewDirectory')}}</el-button>
              <el-button v-show="!expired" @click="startStudy(item.id, item.last_viewed_lesson)" type="primary"
                         class="grid-content-bottom-study">{{item.last_viewed_lesson ?
                $t('m.continueLearning') : $t('m.startLearning')}}
              </el-button>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
    <el-alert
      v-if="datas && datas.length === 0"
      type="info"
      show-icon
      center
      :title="$t('m.noData')">
    </el-alert>
    <course-directory :lessonDatas="lessonDatas"></course-directory>
  </div>
</template>

<script>
  import courseDirectory from "../dialog/courseDirectoryDialog.vue"
  import {showCourse} from "../../service/api/coursesAPI.js";
  import {getLessons} from "../../service/api/lessonAPI.js";
  import {COURSE_TASK_INFO, COURSE_STATUS_INFO} from "../../store/mutation-types.js"
  import {mapMutations} from "vuex"

  export default {
    props: ["expired", "datas"],
    data() {
      return {
        defaultImg: 'this.src="' + require("../../images/7.png") + '"',
        lessonDatas: {}
      };
    },
    components: {
      courseDirectory
    },
    methods: {
      showDirectory(id) {
        this.getCourseDataById(id)
          .then(() => {
            this.$store.state.courseDirectoryVisible = true;
          })
      },
      startStudy(courseId, last_viewed_lesson) {
        this.getCourseDataById(courseId)
          .then(() => {
            let id = last_viewed_lesson ? last_viewed_lesson.id : this.lessonDatas.sections[0].lessons[0].id;
            this.$router.push({path: '/courses/' + courseId + '/lessons/' + id});
          })
      },
      getCourseDataById(id) {
        return getLessons(id)
          .then(response => {
            this.lessonDatas = response.data;
          })
      }
    }
  };
</script>


<style lang="less" scoped>
  .learning-course-container {
    margin: 0 6.5px !important;
    flex-wrap: wrap;
  }

  .learning-course-item {
    display: -webkit-flex;
    align-items: center;
    justify-content: center;
    margin-top: 15px;
    overflow: hidden;
  }
  .grid-content-item {
    border: 1px solid #e6e6e6;
    border-radius: 5px;
    overflow: hidden;
    padding: 10px;
  }
  .learning-course-content {
    background: #ffffff;
    width: 100%;
    height: 128px;
    display: flex;
    display: -webkit-flex; /* Safari */
    justify-content: space-between;
    align-items: center;
    white-space: nowrap;
    overflow: hidden;
    .course-icon {
      width: 110px;
      height: 110px;
      min-width: 110px;
      overflow: hidden;
      img {
        height: 110px;
      }
    }
    .learning-course-info {
      padding-left: 22px;
      width: 200px;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      .course-name {
        font-size: 18px;
        height: 26px;
        color: #000;
        margin-bottom: 4px;
      }
      .course-time-peoples {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        height: 34px;
        border-bottom: 1px solid #e6e6e6;
        padding-bottom: 14px;
        .course-people-numbers {
          margin-left: 12px;
        }
      }
    }
    .count {
      font-size: 16px;
      color: #6526b8;
      font-weight: bold;
      .count-dec {
        font-size: 14px;
      }
    }
    .learning-course-info-time {
      display: -webkit-flex;
      display: flex;
      -webkit-align-items: center;
      align-items: center;
      .count-des {
        margin: 0 2px;
      }
      .count-hour {
        border: 1px solid #646464;
        border-radius: 9px;
        font-size: 10px;
        color: #646464;
        width: 40px;
        height: 18px;
        line-height: 19px;
        text-align: center;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        display: inline-block;
      }
    }

    .task-description {
      width: 170px;
      height: 35px;
      display: flex;
      align-items: center;
      margin-top: 10px;
      .course-study-finish {
        line-height: 1;
        margin-right: 8px;
      }
      .course-study-des {
        width: 90%;
        p {
          font-size: 12px;
        }
        .course-study-date {
          color: #646464;
        }
      }
    }
  }

  .grid-content-bottom {
    height: 32px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .progress {
      display: flex;
      p {
        height: 32px;
        line-height: 1;
        margin-left: 8px;
        span {
          font-size: 12px;
          color: #000;
          &:last-child {
            color: #646464;
          }
        }
      }
    }
    .el-button {
      padding: 0;
      width: 84px;
      height: 32px;
      border-radius: 15px;
    }
    .grid-content-bottom-study {
    }
  }
</style>
