<template>
  <div class="study-task-list">
    <div class="task-list-container">
      <div v-for="(section, sectionIndex) in lessonDatas.sections" :key="section.id">
        <div class="task-section-title-container">
          <label>{{$t('m.theFirst') + (sectionIndex+1) + $t('m.section') + ':' + section.name}}</label>
        </div>
        <div :disabled="!(lessonDatas.is_purchased || isFree(sectionIndex, index))"
             @click="handleChangeLesson(lesson.id, sectionIndex, index)"
             ref="currentTaskItem"
             v-for="(lesson, index) in section.lessons"
             :key="lesson.id"
             :class="{ 'ellipsis': true, 'task-list-item': true, 'current': lesson.id === currentLesson.id }">
          <p class="task-progress">
            <icon v-if='lessonDatas.is_purchased && lesson.status.finished_at' name="done" scale="100"></icon>
          </p>
          <span class="task-title">
            <span>{{$t('m.task')}}{{index + 1}}:</span>
            {{lesson.name}}
          </span>
        </div>
      </div>
    </div>
    <div class='task-complete-prompt'>{{$t('m.completePrompt')}}</div>
    <div class="task-study-completed-container">
      <el-button @click="handleFinishTheStudy" type="primary">{{$t('m.finishTheStudy')}}</el-button>
    </div>
    <el-dialog
      :title="$t('m.finishTheTask')"
      :visible.sync="studyFinishedDialogVisible"
      width="30%">
      <div class="congratulations-item">
        <p>{{$t('m.congratulationsOnYourCompletion')}}</p>
        <p>“{{$t('m.task')}}:{{currentLesson.name}}”</p>
      </div>

      <div class="congratulations-item finish-progress">
        <p>{{$t('m.youHaveCompletedOfTheCourse') + currentProgress}}%，</p>
        <p>{{$t('m.continueToRefueling')}}</p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button class="next-task" type="primary" @click="handleNextTask">{{$t('m.nextTask')}}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    props: ['currentProgress', 'currentLesson', 'lessonDatas'],
    data() {
      return {
        studyFinishedDialogVisible: false,
        firstLoad: true,
      }
    },
    methods: {
      isFree(sectionIndex, index) {
        return ((index < 2) && sectionIndex === 0 && (this.lessonDatas.sections.length > 1))
      },
      scrollToCurrentLesson() {
        this.$nextTick(() => {
          this.getCurrentLessonElement(element => {
            element.scrollIntoView({block: "center", behavior: "smooth"});
          })
        })
      },
      getCurrentLessonElement(onFinded) {
        if (this.$refs.currentTaskItem) {
          this.$refs.currentTaskItem.forEach(item => {
            if (item.className.indexOf("current") !== -1) {
              onFinded(item);
              return;
            }
          });
        }
      },
      handleChangeLesson(id, sectionIndex, index) {
        if (this.lessonDatas.is_purchased || this.isFree(sectionIndex, index)) {
          this.$router.replace({path: '/courses/' + this.lessonDatas.id + '/lessons/' + id});
        } else {
          this.$message.warning(this.$t('m.pleaseBuyThisCourse'));
        }
      },
      handleFinishTheStudy() {
        this.$emit('onStudyFinished');
      },
      handleNextTask() {
        this.$emit('onStudyFinished');
        this.getCurrentLessonElement(element => {
          if (element.nextElementSibling) {
            element.nextElementSibling.click();
          } else {
            if (element.parentNode.nextElementSibling) {
              element.parentNode.nextElementSibling.children[1].click()
            }
          }
          element.scrollIntoView({block: "center", behavior: "auto"});
          this.studyFinishedDialogVisible = false;
        })
      },
      onFinished() {
        this.studyFinishedDialogVisible = true;
      },
    },
    updated() {
      if (this.firstLoad) {
        this.scrollToCurrentLesson();
        this.firstLoad = false;
      }
    }
  }
</script>

<style lang="scss" scoped>
  .study-task-list /deep/ {
    height: 100%;
    .el-dialog {
      width: 420px;
      height: 280px;
      .el-dialog__header {
        padding: 0;
        padding-top: 32px;
        padding-left: 50px;
        .el-dialog__title {
          font-weight: 600;
          font-size: 24px;
          color: #000000;
        }
        .el-dialog__headerbtn {
          top: 30px;
          right: 50px;
        }
        .el-dialog__close {
          &::before {
            font-size: 24px;
            color: #000000;
          }
        }
      }

      .el-dialog__body {
        padding: 0;
        padding-top: 18px;
        .congratulations-item {
          p {
            font-weight: 600;
            font-size: 16px;
            text-align: center;
            color: #6526B8;
          }
          &.finish-progress {
            margin-top: 10px;
            p {
              color: #646464;
              font-weight: normal;
            }
          }
        }
      }

      .el-dialog__footer {
        padding: 0;
        text-align: center;
        .next-task {
          margin-top: 16px;
          border-radius: 100px;
          span {
            font-weight: 600;
          }
        }
      }
    }
  }

  .task-complete-prompt {
    font-size: 14px;
    text-align: right;
    color: #646464;
    margin-top: 22px;
  }
  .task-study-completed-container /deep/ {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    .el-button {
      border-radius: 25px;
      margin-top: 7px;
      width: 150px;
      height: 48px;
      span {
        font-weight: 600;
      }
    }
  }
  .task-list-container {
    height: 480px;
    width: 100%;
    margin: 0 3%;
    border-bottom: 1px solid #e6e6e6;
    border-top: 1px solid #e6e6e6;
    overflow: auto;
    &::-webkit-scrollbar {
      width: 5px;
    }

    .task-section-title-container {
      background-color: #e6e6e6;
      width: 100%;
      // border-radius: 8px;
      color: #000000;
      label {
        font-weight: 600;
        font-size: 16px;
        padding: 10px 12px;
        display: block;
        text-align: center;
      }
    }

    .task-list-item {
      cursor: pointer;
      font-size: 14px;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      line-height: 55px;
      height: 55px;
      border-bottom: 1px solid #e6e6e6;
      .task-title {
        font-size: 14px;
        font-family: "Sul Sans, PingFang SC";
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
      }

      .task-progress {
        width: 53px;
        min-width: 53px;
        text-align: center;
      }

      &.current {
        color: #6526b8;
        .task-progress {
          color: #00deb7;
        }
      }
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
</style>