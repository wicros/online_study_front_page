<template>

  <div ref="questionResultsForm">
    <div class="study-task-test-content">
      <div ref="studyTestContent" class="study-test-content">
        <div class="test-title-container">
          <div class="test-title-content">
            <h3>{{currentLesson.name}}</h3>
            <el-tag class="hidden-sm-and-down" type="primary">
              {{isReadOver ? $t('m.approved') : $t('m.inTheAnswer')}}
            </el-tag>
          </div>
          <div v-if="isReadOver" class="test-respondent">
            {{$t('m.respondent')}}：<span>{{userInfo.nickname}}</span> {{$t('m.submitDate')}}：{{currentLesson.status &&
            currentLesson.status.finished_at}}
          </div>
        </div>
        <div v-if="isReadOver" class="test-result-container">
          <div class="score-container">
            <icon name="certificate" scale="112"></icon>
            <div class="score">
              <span>{{currentLesson.status.score}}</span>{{$t('m.points')}}
            </div>
            <div class="total-score">{{$t('m.totalScore')}}:{{currentLesson.test.score}}</div>
          </div>
          <div class="question-details">
            <p class="question-type">{{$t('m.singleChoiceQuestion')}}({{testDatas.questions.length}})</p>
            <ul>
              <li>
                <span class="title">{{$t('m.right')}}</span>
                <span class="content">{{rightAnswers}}</span>
              </li>
              <li>
                <span class="title">{{$t('m.error')}}</span>
                <span class="content">{{errorAnswers}}</span>
              </li>
              <li>
                <span class="title">{{$t('m.unanswered')}}</span>
                <span class="content">{{unAnswers}}</span>
              </li>
              <li>
                <span class="title">{{$t('m.score')}}</span>
                <span class="content">{{currentLesson.status.score}}</span>
              </li>
            </ul>
          </div>
          <div class="test-result">
            <p class="tips">
              {{currentLesson.status && currentLesson.status.score >= 60 ? $t('m.congratulationsPassingTheExam') : $t('m.failToPassTheExam')}}
            </p>
            <el-button @click="handleSubmitAndReTest" class="re-test" type="primary">{{$t('m.reTest')}}</el-button>
          </div>
        </div>

        <div class="test-questions">
          <div class="question-type">
            <h3>{{$t('m.singleChoiceQuestion')}}</h3>
            <p>{{$t('m.total') + testDatas.questions.length + $t('m.questions')}},{{$t('m.total') + (currentLesson.test && currentLesson.test.score) + $t('m.points')}}</p>
          </div>
          <el-row ref="questionItems" class="question-item" v-for="(item, questionIndex) in testDatas.questions"
                  :key="item.id">
            <el-col :xs="4" :sm="4" :md="2" :lg="2" :xl="2">
              <div class="grid-content question-number-serial">
                <label>{{questionIndex + 1}}</label>
              </div>
            </el-col>
            <el-col :xs="20" :sm="20" :md="22" :lg="22" :xl="22">
              <div class="question-content grid-content">
                <label class="question-title" v-html="item.stem"></label>
                <!--, 'error-answer' : !currentLesson.answer_status[questionIndex]-->
                <el-radio-group
                  :disabled="isReadOver"
                  ref="answerGroups"
                  :class="{'question-result' : true}"
                  v-model="answers[questionIndex]">
                  <el-radio
                    v-for="(option, index) in item.alternatives"
                    :key="option"
                    :label="index">
                    <div v-html="option"></div>
                  </el-radio>
                </el-radio-group>
              </div>
            </el-col>
            <el-col v-if="!isReadOver" class="hidden-sm-and-down"
                    :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
              <div class="question-item-bottom">
                <el-radio-group
                  :disabled="isReadOver"
                  class="question-result"
                  v-model="answers[questionIndex]">
                  <el-radio
                    class='question-result-options'
                    v-for="(option, index) in item.alternatives"
                    :key="option"
                    :label="index">
                    {{index | formatOptionToABC}}
                  </el-radio>
                </el-radio-group>
              </div>
            </el-col>
            <el-col v-else v-html="item.explanation" :xs="24" :sm="24" :md="24" :lg="24" :xl="24"
                    class="explanation">
            </el-col>
          </el-row>
        </div>
      </div>

    </div>
    <el-row class="study-task-test-status">
      <el-col class="hidden-sm-and-down" :xs="8" :sm="6" :md="4" :lg="3" :xl="3">
        <span class="study-task-test-status-title">{{$t('m.stateOfAnswer')}}</span>
        <span class="study-task-test-status-single">{{$t('m.singleChoiceQuestion')}}</span>
      </el-col>
      <el-col class="test-progress hidden-sm-and-down" :xs="8" :sm="6" :md="16" :lg="15" :xl="15">
        <div
          @click="handleScrollToQuestion(index)"
          :class="{'test-completed-item': answers[index] > -1, 'error-answer': isReadOver && answers[index] !== answerResults[index]}"
          v-for="(item, index) in testDatas.questions"
          :key="item.id">
          {{index + 1}}
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :md="24" :lg="6" :xl="6" class="submit-test-submit-now">
        <el-button class="test-submit-now" type="primary" @click="handleSubmitAndReTest">
          {{isReadOver ? $t('m.reTest') : $t('m.submitNow')}}
        </el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import {getTest} from "../../service/api/lessonAPI.js";
  import {mapState} from "vuex";

  export default {
    props: ['currentLesson'],
    data() {
      return {
        testDatas: {questions: []},
        answers: [],
        answerResults: [],
        isReadOver: false,
      }
    },
    created() {
      this.$emit('init');
    },
    methods: {
      init() {
        this.resetTestFormPosition();
        this.answerResults.length = 0;
        this.answers.length = 0;
        if (this.currentLesson.status.answers && this.currentLesson.status.answers.length > 0) {
          this.answers = [...this.currentLesson.status.answers];
        }
        this.isReadOver = this.currentLesson.status.score > -1;
        this.getTestById(this.currentLesson.test.id)
          .then(() => {
            if (this.isReadOver) {
              this.checkPaper();
            } else {
              this.restoreUserAnswers();
            }
          });
      },
      getTestById(id) {
        return getTest(id)
          .then(response => {
            this.testDatas = response.data;
          })
          .catch(err => {
            console.dir(err)
          })
      },
      saveUserAnswers() {
        if (!this.isReadOver) {
          this.resetAnswersDefaultValue();
          this.$emit('onSubmitTest', this.answers, 'false')
        }
      },
      restoreUserAnswers() {
        if (this.currentLesson.status.answers && this.currentLesson.status.answers.length > 0) {
          this.answers.push(...this.currentLesson.status.answers);
        }
      },
      resetTestFormPosition() {
        if (this.$refs.studyTestContent) {
          this.$refs.studyTestContent.scrollTop = 0;
        }
      },
      handleScrollToQuestion(index) {
        if (this.$refs.questionItems) {
          this.$refs.questionItems[index].$el.scrollIntoView({block: "center", behavior: "smooth"});
        }
      },
      handleSubmitAndReTest() {

        if (this.isReadOver) {
          this.reTest();
        } else {
          this.submitTestResult();
        }
      },
      reTest() {
        const responsiveSize = 'responsive-size';
        this.$confirm(this.$t('m.confirmReTest'), this.$t('m.reTest'), {
          customClass: responsiveSize,
          confirmButtonText: this.$t('m.confirm'),
          cancelButtonText: this.$t('m.cancel'),
          type: 'success'
        }).then(() => {
          this.answerResults.length = this.testDatas.questions.length;
          for (let i = 0; i < this.answerResults.length; i++) {
            this.answerResults[i] = -1;
            this.answers[i] = -1;
          }
          this.currentLesson.status.score = -1;
          this.$emit('onSubmitTest', this.answerResults, 'false');
        }).catch(() => {
        });
      },
      submitTestResult() {

        let answerLength = this.answers.filter(item => {
          return item !== -1;
        }).length;
        let isCompleted = answerLength === this.testDatas.questions.length;
        const responsiveSize = 'responsive-size';
        this.$confirm((isCompleted ? this.$t('m.allDone') : this.$t('m.unfinished')) + this.$t('m.confirmSubmitExamPaper'), this.$t('m.submitExamPaper'), {
          customClass: responsiveSize,
          confirmButtonText: this.$t('m.confirm'),
          cancelButtonText: this.$t('m.cancel'),
          type: isCompleted ? 'success' : 'warning'
        }).then(() => {
          this.checkPaper();
          this.$emit('onSubmitTest', this.answerResults, 'true');
        }).catch(() => {
          this.$message({
            type: 'success',
            message: this.$t('m.checkAgain')
          });
        });
      },
      onUpdatedTest() {
        this.isReadOver = this.currentLesson.status.score > -1;
        if (this.isReadOver) {
          this.updateErrorAnswerDOM();
          this.resetTestFormPosition();
        }
      },
      checkPaper() {
        this.resetAnswersDefaultValue();
        if (this.isReadOver) {
          this.answerResults = [...this.currentLesson.status.answers];
        } else {
          this.answerResults = [...this.answers];
        }
        this.answers.length = 0;

        this.currentLesson.status.score = 0;
        for (let i = 0; i < this.testDatas.questions.length; i++) {
          const question = this.testDatas.questions[i];
          let rightAnswer = parseInt(question.answers[0]);
          if (this.answerResults[i] === rightAnswer) {
            this.currentLesson.status.score += question.scores[0];
          }
          this.answers.push(rightAnswer);
        }
        this.updateErrorAnswerDOM();
      },
      resetAnswersDefaultValue() {

        this.answers.length = this.testDatas.questions.length;
        for (let i = 0; i < this.answers.length; i++) {
          if (this.answers[i] === null || this.answers[i] === undefined) {
            this.answers[i] = -1;
          }
        }
      },
      updateErrorAnswerDOM() {
        if (this.$refs.answerGroups) {
          this.$refs.answerGroups.forEach((rg, index) => {
            if (this.answerResults[index] > -1 && this.answers[index] !== this.answerResults[index]) {
              this.$nextTick(() => {
                rg.$el.children[this.answerResults[index]].className += ' error-answer';
              })
            }
          })
        }
      },
    },
    computed: {
      ...mapState(["userInfo"]),
      rightAnswers() {
        return this.answers.filter((rightAnswer, index) => {
          return rightAnswer === this.answerResults[index];
        }).length;
      },
      errorAnswers() {
        return this.answers.filter((rightAnswer, index) => {
          return this.answerResults[index] !== -1 && rightAnswer !== this.answerResults[index];
        }).length;
      },
      unAnswers() {
        return this.answerResults.filter(answer => {
          return answer === -1;
        }).length;
      }
    },
    filters: {
      formatOptionToABC(content) {
        return String.fromCharCode(65 + parseInt(content));
      }
    },
    watch: {
      $route(to, from) {
       if (to.params.lessonId !== null && to.params.lessonId !== from.params.lessonId) {
          if (this.isReadOver) {
            this.$emit('onSubmitTest', this.currentLesson.status.answers, 'true');
          } else {
            this.saveUserAnswers();
          }
        }
      }
    },
  }
</script>

<style lang="scss" scoped>
  .study-task-test-content /deep/ {
    border: 1px solid #e6e6e6;
    width: 100%;
    height: 100%;
    border-radius: 10px;

    .study-test-content {
      &::-webkit-scrollbar {
        width: 5px;
      }
      overflow: auto;
      width: 100%;
      height: 480px;

      .test-title-container {
        border-bottom: 1px solid #e6e6e6;
        padding: 11px 25px;
        .test-title-content {
          display: flex;
          justify-content: space-between;
          h3 {
            line-height: 30px;
            // width: 80%;
            overflow: hidden;
            text-overflow: ellipsis;
            font-size: 20px;
            white-space: nowrap;
          }
          .el-tag {
            border-radius: 30px;
            height: 30px;
            width: 64px;
            color: #fff;
            font-size: 14px;
            background-color: #00deb7;
          }
        }
        .test-respondent {
          font-size: 12px;
          color: #B1B1B1;
        }
      }

      .test-result-container {
        height: 260px;
        width: 100%;
        padding: 25px 30px;
        display: flex;
        align-items: center;
        justify-content: space-around;
        .score-container {
          height: 200px;
          width: 150px;
          background: #E6E6E6;
          border-radius: 10px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          .score {
            color: #6526B8;
            span {
              font-size: 48px;
              font-family: 'Sul Sans';
            }
          }
          .total-score {
            font-size: 12px;
            color: #646464;
          }
        }

        .question-details {
          width: 240px;
          height: 183px;
          .question-type {
            font-size: 12px;
            color: #B1B1B1;
            text-align: right;
            padding-right: 30px;
          }
          ul {
            margin-top: 10px;
            li {
              height: 40px;
              line-height: 40px;
              border-top: 1px solid #E6E6E6;
              display: flex;
              justify-content: space-around;

              .title {
                color: #646464;
              }
              .content {
                color: #000000;
              }
            }
          }
        }

        .test-result {
          width: 150px;
          height: 129px;
          display: flex;
          flex-direction: column;
          align-items: center;
          .tips {
            font-weight: 600;
            font-size: 18px;
            color: #000000;
          }
          .re-test {
            width: 100%;
            height: 48px;
            border-radius: 25px;
            margin-top: 20px;
            span {
              font-weight: 600;
            }
          }
        }
      }

      .test-questions {
        border-color: #e6e6e6;
        padding: 10px 25px;
        padding-bottom: 0;
        .question-type {
          display: flex;
          align-items: baseline;
          padding-bottom: 14px;

          h3 {
            font-size: 16px;
            // font-weight: bold;
          }

          p {
            font-size: 12px;
            color: #646464;
          }
        }

        .question-item {
          border: 1px solid #e6e6e6;
          border-radius: 5px;
          min-height: 226px;
          padding-top: 20px;
          margin-bottom: 29px;
          .el-radio__input {
            &.is-checked {
              .el-radio__inner {
                background-color: #00deb7;
                border-color: #00deb7;
                padding: 2px;
                &:hover {
                  border-color: #00deb7;
                  color: #00deb7;
                }
                &::after {
                  background-color: #00deb7;
                }
              }
            }
          }
          .el-radio__input.is-checked + .el-radio__label {
            color: #000;
          }
          .el-radio__inner:hover {
            border-color: #dcdfe6;
          }

          .question-item-bottom {
            // height: 46px;
            border-top: 1px solid #e6e6e6;
            overflow: hidden;
            // overflow-y: hidden;
            .el-radio__input.is-checked .el-radio__inner {
              border-color: #e6e6e6;
            }
            .el-radio-group {
              width: 101%;
              height: 100%;
              .question-result-options {
                height: 100%;
                width: 170px;
                line-height: 45px;
                margin: 0;
                text-align: center;
                border-right: 1px solid #e6e6e6;
                border-bottom: 1px solid #e6e6e6;
                margin: 0 -1px -1px 0;
              }
            }
          }
          .question-number-serial {
            width: 36px;
            height: 36px;
            margin-left: 11px;
            border-radius: 50%;
            background-color: #6526b8;
            color: #fff;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            .el-tag {
              padding: 0;
            }
          }
          .question-content {
            color: gray;
            font-size: 15px;
            margin-left: 5px;
            margin-bottom: 22px;
            .el-radio__inner {
              width: 24px;
              height: 24px;
            }

            p, img {
              max-width: 600px;
            }

            .question-title {
              font-size: 16px;
              font-family: "PingFang SC";
              display: inline-block;
              color: #6526b8;
            }

            .question-result {
              padding-top: 20px;
              display: flex;
              flex-direction: column;
              align-items: flex-start;
              .el-radio {
                margin: 8px 0;
              }
              .el-radio__label {
                overflow: hidden;
                text-overflow: ellipsis;
                display: inline-block;
                color: #646464;
                white-space: initial;
                vertical-align: middle;
                width: 95%;
                & > div {
                  p {
                    width: initial;
                  }
                  img {
                    max-width: 560px;
                  }
                }
              }

              .error-answer {
                .el-radio__inner {
                  background-color: #E51137 !important;
                  border-color: #E51137 !important;
                  &::after {
                    background-color: #E51137 !important;
                    border-color: #E51137 !important;
                  }
                }
              }
            }
          }
          .explanation {
            border-top: 1px solid #e6e6e6;
            padding: 20px 35px;
            img {
              max-width: 600px;
            }
          }
        }
      }
    }
  }

  .study-task-test-status /deep/ {
    margin-top: 8px;
    border-radius: 10px;
    border: 1px solid #e6e6e6;
    width: 100%;
    min-height: 92px;
    padding: 15px 25px;

    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 14px;

    .study-task-test-status-title {
      display: block;
      font-size: 16px;
    }
    .study-task-test-status-single {
      display: block;
      box-sizing: border-box;
      line-height: 30px;
      height: 30px;
      width: 64px;
      margin-top: 5px;
      border-radius: 5px;
      color: #6526b8;
      border: 1px solid #6526b8;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      text-align: center;
    }
    .test-progress {
      margin-top: -8px;
      > div {
        width: 26px;
        height: 26px;
        line-height: 26px;
        border-radius: 50%;
        margin: 0 5px;
        margin-top: 8px;
        text-align: center;
        border: 1px solid #ccc;
        float: left;
        cursor: pointer;
      }

      .test-completed-item {
        background-color: #00deb7;
        border-color: #00deb7;
        color: white;

        &.error-answer {
          background-color: #E51137;
          border-color: #E51137;
        }
      }
    }

    .test-submit-now {
      width: 150px;
      height: 48px;
      border-radius: 25px;
      font-size: 14px;
    }
  }
</style>
