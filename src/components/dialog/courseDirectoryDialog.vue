<template>
  <el-dialog
    class="course-directory-dialog"
    :title="$t('m.courseDirectory')"
    center
    :fullscreen="isSmallScreen"
    :modal-append-to-body="true"
    :visible.sync="$store.state.courseDirectoryVisible">
    <div class="course-directory-task-container" v-for="(section,sectionIndex) in lessonDatas.sections"
         :key="section.id">
      <div class="course-directory-title-container">
        <label>{{`第${sectionIndex+1}节:${section.name}`}}</label>
      </div>
      <el-row :gutter="15" :disabled="!(lessonDatas.is_purchased || isFree(sectionIndex, index))"
              class="course-directory-item" @click.native="handleStartTask(lesson, index, sectionIndex)"
              v-for="(lesson, index) in section.lessons" :key="lesson.id">
        <el-col :xs="20" :sm="20" :md="12" :lg="17" :xl="17" class="course-directory-name">
          <span>{{$t('m.task')}}{{index + 1}}:</span>
          <span>{{lesson.name}}</span>
          <icon v-if="lessonDatas.is_purchased && lesson.status.finished_at" name="finished" scale="100"></icon>
        </el-col>
        <el-col :xs="0" :sm="0" :md="4" :lg="3" :xl="3" class="free-button-container hidden-sm-and-down">
          <el-button class="free-button" v-if="isFree(sectionIndex, index) && !lessonDatas.is_purchased"
                     type="info">{{$t('m.forFree')}}
          </el-button>
        </el-col>
        <el-col :xs="4" :sm="4" :md="4" :lg="2" :xl="2" class="course-directory-type-duration">
          <icon v-if="lesson.lesson_type === constants.lessonType.VIDEO" name="video" scale="90"></icon>
          <icon v-else-if="lesson.lesson_type === constants.lessonType.TEST" name="test" scale="90"></icon>
        </el-col>
        <el-col :xs="0" :sm="0" :md="4" :lg="2" :xl="2" class="course-directory-type-duration hidden-sm-and-down">
          <span v-if="lesson.lesson_type === constants.lessonType.VIDEO">{{lesson.video ? lesson.video.duration : '00:00:00'}}</span>
        </el-col>
      </el-row>
    </div>
  </el-dialog>
</template>

<script>
  import {mapState, mapMutations} from "vuex";
  import {
    COURSE_TASK_INFO,
    COURSE_STATUS_INFO
  } from "../../store/mutation-types.js";

  export default {
    props: ["lessonDatas"],

    methods: {
      isFree(sectionIndex, index){
        return index < 2 && sectionIndex === 0 && this.lessonDatas.sections.length > 1
      },
      handleStartTask(lesson, index, sectionIndex) {
        this.updateAnalytics(this.$route.path, this.constants.category.LESSON, this.constants.activity.CLICK, this.constants.category.LESSON, lesson.id)
        if (this.lessonDatas.is_purchased || this.isFree(sectionIndex, index)) {
           this.$router.push({path: '/courses/' + this.lessonDatas.id + '/lessons/' + lesson.id});
           this.$store.state.courseDirectoryVisible = false;
        }else {
           this.$message.warning("请购买该课程");
        }
      }
    },
    computed: {
      ...mapState(["isSmallScreen"]),
    },
    destroyed() {
      this.$store.state.courseDirectoryVisible = false;
    },
  }
</script>

<style lang="scss" scoped>
  .course-directory-dialog /deep/ {
    .el-dialog {
      width: 960px;
    }
    .el-dialog__header {
      text-align: left;
      padding: 32px 50px;
      z-index: 1;
      .el-dialog__title {
        padding-bottom: 0;
        font-size: 24px;
        line-height: 28px;
        color: #000;
      }
      .el-dialog__headerbtn {
        top: 35px;
        right: 50px;
        i {
          width: 24px;
          height: 24px;
          font-size: 24px;
          color: #000;
        }
      }
    }
    .el-dialog__body {
      padding: 0 45px;
      text-align: left;
      height: 500px;
      overflow: auto;
      &::-webkit-scrollbar {
        width: 1%;
      }
      &::-webkit-scrollbar-thumb {
        border-radius: 4px;
      }
    }
  }

  .course-directory-task-container {
    .course-directory-item {
      &:last-child {
        border-bottom: none;
      }
      &[disabled="disabled"] {
        span {
          color: #ccc;
        }
      }
    }
  }

  .course-directory-title-container {
    background-color: #e6e6e6;
    width: 100%;
    border-radius: 8px;
    color: #000000;
    label {
      font-weight: 600;
      font-size: 16px;
      padding: 10px 12px;
      display: block;
    }
  }

  .course-directory-item {
    height: 57px;
    cursor: pointer;
    border-bottom: 1px solid #e6e6e6;
    align-items: center;
    padding-left: 10px;
    // margin-top: 2%;
    // padding-bottom: 2%;
    display: flex;
    .free-button-container {
      display: flex;
      justify-content: flex-end;
    }
    .el-col {
      line-height: 19px;
      font-size: 16px;
      font-family: "Sul Sans, PingFang SC";
    }
    .free-button {
      display: flex;
      justify-content: center;
      width: 64px;
      height: 30px;
      border-radius: 20px;
      background-color: #00deb7;
      border-color: #00deb7;
      padding: 0;
    }
    .course-directory-name {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      span {
        margin-right: 8px;
        font-size: 16px;
        color: #000000;
        font-family: "PingFang SC";
      }
    }
    .course-directory-type-duration {
      display: flex;
      align-content: center;
      justify-content: flex-end;
      svg {
        padding-right: 15px;
      }
      span {
        color: #646464;
        font-family: "mono";
      }
    }
  }
</style>