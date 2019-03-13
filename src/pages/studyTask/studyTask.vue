<template>
    <div class="study-task-container">
        <el-row class="layer study-task-test-title study-task-title">
            <el-col :xs="24" :sm="24" :md="2" :lg="2" :xl="2">
                <div class="back-course-container">
                    <a href="javascript:void(0)" @tap="handleGoBack" @click="handleGoBack">&lt;{{$t('m.backToLesson')}}</a>
                </div>
            </el-col>
            <el-col :xs="24" :sm="24" :md="22" :lg="22" :xl="22">
                <div class="study-task-title ellipsis">
                    <label class="study-task-name">{{currentLesson.name}}</label>
                </div>
            </el-col>
        </el-row>

        <el-row class="layer study-task-content">
            <el-col :xs="24" :sm="24" :md="24" :lg="17" :xl="17">

                <study-task-video ref="studyTaskVideo"
                                  @onSubmitVideoProgress="onSubmitVideoProgress"
                                  @onStudyFinished="onStudyFinished"
                                  v-if="currentLesson.lesson_type === constants.lessonType.VIDEO"
                                  :currentLesson="currentLesson"></study-task-video>

                <study-task-test ref="studyTaskTest"
                                 @onSubmitTest="onSubmitTest"
                                 @onStudyFinished="onStudyFinished"
                                 v-if="currentLesson.lesson_type === constants.lessonType.TEST"
                                 :currentLesson="currentLesson"></study-task-test>
            </el-col>

            <el-col class="hidden-md-and-down" :xs="24" :sm="24" :md="24" :lg="7" :xl="7">
                <study-task-list ref="studyTaskList"
                                 @onStudyFinished="onStudyFinished"
                                 :currentProgress="currentProgress"
                                 :currentLesson="currentLesson"
                                 :lessonDatas="lessonDatas"></study-task-list>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    import {getLessons} from "../../service/api/lessonAPI.js";
    import {updateLessonStatus} from "../../service/api/lessonAPI.js";
    import studyTaskVideo from "../../components/common/studyTaskVideo.vue";
    import studyTaskTest from "../../components/common/studyTaskTest.vue";
    import studyTaskList from "../../components/common/studyTaskList.vue";

    export default {
        components: {
            studyTaskVideo,
            studyTaskTest,
            studyTaskList
        },
        data() {
            return {
                currentProgress: 0,
                lessonDatas: {},
                currentLesson: {},
                lessonStatusParams: {
                    id: 0,
                    finished: "false",
                    lesson_type: "",
                    score: 0,
                    answers: [],
                    video_time: 0
                }
            };
        },
        methods: {
            init() {
                return getLessons(this.$route.params.id)
                    .then(response => {
                        this.lessonDatas = response.data;

                        this.updateCurrentLesson();
                        if (!this.currentLesson.isFree) {
                            this.$message.warning(this.$t('m.pleaseBuy'));
                            this.$router.replace({
                                path: "/courses/" + this.$route.params.id
                            });
                            return;
                        }
                        this.$nextTick(() => {
                            if (
                                this.currentLesson.lesson_type ===
                                this.constants.lessonType.TEST &&
                                this.$refs.studyTaskTest
                            ) {
                                this.$refs.studyTaskTest.init();
                            } else if (
                                this.currentLesson.lesson_type ===
                                this.constants.lessonType.VIDEO &&
                                this.$refs.studyTaskVideo
                            ) {
                                this.$refs.studyTaskVideo.updatePolyv();
                            }
                        });
                        if (this.currentLesson.id.toString() !== this.$route.params.lessonId.toString()) {
                            this.$router.push({path: '/404'});
                        }
                    })
                    .catch(error => {
                        console.dir(error);
                        this.$router.push({path: '/404'});
                    });
            },
            isFree(index, sectionIndex) {
                return (
                    this.lessonDatas.is_purchased ||
                    (index < 2 &&
                        sectionIndex === 0 &&
                        this.lessonDatas.sections.length > 1)
                );
            },
            updateCurrentLesson() {

                this.lessonDatas.sections.forEach((section, sectionIndex) => {
                    section.lessons.forEach((lesson, index) => {
                        lesson.isFree = this.isFree(index, sectionIndex);
                        if (this.$route.params.lessonId * 1 === lesson.id) {
                            this.currentLesson = lesson;
                            if (!this.currentLesson.status) {
                                this.currentLesson.status = {};
                            }
                            this.lessonStatusParams.id = this.currentLesson.id;
                            this.lessonStatusParams.lesson_type = this.currentLesson.lesson_type;
                        }
                    });
                });
            },
            onStudyFinished() {
                if (
                    this.currentLesson.lesson_type === this.constants.lessonType.VIDEO &&
                    this.$refs.studyTaskVideo
                ) {
                    this.updateLessonState("true");
                    if (this.$refs.studyTaskList) {
                        this.$refs.studyTaskList.onFinished();
                    }
                } else if (
                    this.currentLesson.lesson_type === this.constants.lessonType.TEST &&
                    this.$refs.studyTaskTest
                ) {
                    if (this.$refs.studyTaskTest.isReadOver) {
                        this.updateLessonState("true");
                        this.$refs.studyTaskList.onFinished();
                    } else {
                        this.$refs.studyTaskTest.submitTestResult();
                    }
                }
            },
            updateLessonStateAndInit(isFinished) {
                this.updateLessonState(isFinished).then(() => this.init());
            },
            onSubmitVideoProgress(progress, isFinished) {
                this.lessonStatusParams.video_time = progress;
                this.updateLessonStateAndInit(isFinished);
            },
            onSubmitTest(answers, isFinished) {
                this.lessonStatusParams.answers = answers;
                this.updateLessonStateAndInit(isFinished);
            },
            updateLessonState(isFinished) {
                if (!this.lessonDatas.is_purchased) {
                    return Promise.resolve();
                }
                this.lessonStatusParams.finished = isFinished;
                this.lessonStatusParams.score = this.currentLesson.status.score;
                return updateLessonStatus(this.lessonStatusParams)
                    .then(response => {
                        this.currentProgress = response.data.progress;
                        this.currentLesson.status = response.data;
                        if (
                            this.currentLesson.lesson_type === this.constants.lessonType.TEST &&
                            this.$refs.studyTaskTest
                        ) {
                            this.$refs.studyTaskTest.onUpdatedTest();
                        }
                        if (
                            response.data.finished_at &&
                            isFinished === "true" &&
                            response.data.progress === 100
                        ) {
                            this.$message.success(this.$t('m.congratulationsFinished'));
                            this.handleGoBack();
                        }
                    })
                    .catch(err => {
                        console.dir(err);
                        if (
                            this.currentLesson.lesson_type === this.constants.lessonType.TEST &&
                            this.$refs.studyTaskTest
                        ) {
                            this.$refs.studyTaskTest.onUpdatedTest();
                        }
                    });
            },
            handleGoBack() {
                this.$router.push({path: "/courses/" + this.$route.params.id});
            }
        },
        mounted() {

            this.init();
        },
        destroyed() {
            if (
                this.currentLesson.lesson_type === this.constants.lessonType.VIDEO &&
                this.$refs.studyTaskVideo
            ) {
                this.$refs.studyTaskVideo.destroyPolyv();
            } else if (
                this.currentLesson.lesson_type === this.constants.lessonType.TEST &&
                this.$refs.studyTaskTest
            ) {
                this.$refs.studyTaskTest.saveUserAnswers();
            }
        },
        onSubmitVideoProgress(progress, isFinished) {
            this.lessonStatusParams.video_time = progress;
            this.updateLessonState(isFinished);
        },
        onSubmitTest(answers, isFinished) {
            this.lessonStatusParams.answers = answers;
            this.updateLessonState(isFinished);
        },
        updateLessonState(isFinished) {
            if (this.lessonDatas.is_purchased == null || !this.lessonDatas.is_purchased) {
                return;
            }
            this.lessonStatusParams.finished = isFinished;
            this.lessonStatusParams.score = this.currentLesson.status.score;
            return updateLessonStatus(this.lessonStatusParams)
                .then(response => {
                    this.currentProgress = response.data.progress;
                    this.currentLesson.status = response.data;
                    if (
                        this.currentLesson.lesson_type === this.constants.lessonType.TEST &&
                        this.$refs.studyTaskTest
                    ) {
                        this.$refs.studyTaskTest.onUpdatedTest();
                    }
                    if (
                        response.data.finished_at &&
                        isFinished === "true" &&
                        response.data.progress === 100
                    ) {
                        this.$message.success(this.$t('m.congratulationsFinished'));
                        this.handleGoBack();
                    }
                })
                .catch(err => {
                    console.dir(err);
                    if (
                        this.currentLesson.lesson_type === this.constants.lessonType.TEST &&
                        this.$refs.studyTaskTest
                    ) {
                        this.$refs.studyTaskTest.onUpdatedTest();
                    }
                });
        },
        handleGoBack() {
            this.$router.push({path: "/courses/" + this.$route.params.id});
        }
    };
</script>

<style lang="scss">
    @import "../../style/common";
</style>

<style lang="less">
    .study-task-container {
        padding-top: 50px;

        .study-task-title {
            .study-task-name {
                font-weight: 600;
                font-family: "Sul Sans, PingFang SC";
                font-size: 28px;
                line-height: 33px;
            }
            .back-course-container {
                max-width: 96px;
                height: 32px;
                text-align: center;
                line-height: 32px;
                border-radius: 30px;
                background-color: #e6e6e6;
                a {
                    font-family: "PingFang SC";
                    font-weight: 600;
                    font-size: 14px;
                    line-height: 16px;
                }
            }
        }
        .el-button {
            span {
                font-size: 16px;
            }
        }

        .study-task-test-title {
            margin-bottom: 20px;
        }

        .study-task-content {
            position: relative;
        }
    }
    .responsive-size {
        &.el-message-box {
            width: auto;
            min-width: 320px;
        }
    }
</style>
