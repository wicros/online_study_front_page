<template>
  <div class="course-details-container">

    <breadcrumb class="hidden-sm-and-down"></breadcrumb>

    <el-row class="layer container-padding course-details-content-container">
      <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
        <div class="course-picture grid-content bg-purple" :style="{backgroundImage: `url('${courseData.image_url}')`}"></div>
      </el-col>
      <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
        <div class="course-introduction grid-content bg-purple-light">
          <div class="course-introduction-title">
            <h1>{{courseData.name}}</h1>
          </div>

          <div class="course-introduction-content">
            <div class="course-video-count">
              <icon name="video" scale="100"></icon>
              <p>{{$t('m.video')}} {{videoCount}}</p>
            </div>
            <div class="course-exam-count">
              <icon class="icon" name="test" scale="100"></icon>
              <p>{{$t('m.exercise')}} {{testCount}}</p>
            </div>
            <!-- <div>
              <icon name="exercise" scale="100"></icon>
              <p>{{$t('m.exercise')}} {{exerciseCount}}</p>
            </div> -->
          </div>

          <div class="finish-learning-students">
            <label>{{$t('m.learningStudents') + ': ' + courseData.using_users.length + $t('m.number0fMan')}}</label>
            <div class="course-role">
              <i class="course-role-details" v-for="user in courseData.using_users" :key="user.id">
                 <img :src="user.avatar_url || '/static/avatar.png?course'" :onerror="defaultUserAvatar" :title="user.nickname">
              </i>
            </div>
          </div>

          <div class="container-padding view-directory-container">
            <el-button @click="$store.state.courseDirectoryVisible = true" class="buy-now" type="primary">
              {{$t('m.viewDirectory')}}
            </el-button>
          </div>

          <div class="course-hr-separation-line"></div>
        </div>
      </el-col>
    </el-row>

    <div class="layer container-padding class-with-this-course-container">
      <div class="section-title">
        <span>{{$t('m.productWithThisCourse')}}<b>(6)</b></span>
      </div>
      <product-items :datas="courseData.products"></product-items>
    </div>

    <product-description :title="$t('m.productSectionTitle')" :text="courseData.instruction"></product-description>

    <div class="layer container-padding other-star-courses-container">
      <div class="section-title">
        <span>{{$t('m.otherStarCourses')}}</span>
      </div>
      <star-course-items :datas="courseData.recommend_courses"></star-course-items>
    </div>
    <course-directory :lessonDatas="lessonDatas" ></course-directory>
  </div>
</template>

<script>
  import breadcrumb from "../../components/common/breadcrumb.vue";
  import productItems from "../../components/common/productItems.vue";
  import starCourseItems from "../../components/common/courseItems.vue";
  import productDescription from "../../components/common/productDescription.vue";
  import courseDirectory from "../../components/dialog/courseDirectoryDialog.vue";
  import {mapState, mapMutations} from "vuex";
  import {
    SAVE_BREADCRUMBS,
    REMOVE_BREADCRUMBS,
  } from "../../store/mutation-types.js";
  import {showCourse} from "../../service/api/coursesAPI.js";
  import {getLessons} from "../../service/api/lessonAPI.js";

  export default {
    data() {
      return {
        // defaultImg: 'this.src="' + require("../../images/10.png") + '"',
        defaultUserAvatar: 'this.src="' + require("../../../static/avatar.png") + '"',
        courseData: {recommend_courses: [], using_users: []},
        lessonDatas: {},
        videoCount: 0,
        testCount: 0,
        exerciseCount: 0,
      };
    },
    components: {
      breadcrumb,
      productItems,
      starCourseItems,
      productDescription,
      courseDirectory
    },
    methods: {
      ...mapMutations([
        SAVE_BREADCRUMBS,
        REMOVE_BREADCRUMBS,
      ]),
      calculate_lesson_count() {
        this.lessonDatas.sections.forEach(section => {
          section.lessons.forEach(lesson => {
            if (lesson.lesson_type === this.constants.lessonType.VIDEO) {
              this.videoCount += 1;
            } else if (lesson.lesson_type === this.constants.lessonType.TEST) {
              this.testCount += 1;
            } 
          });
        });
      },
      updateCourseData() {
        showCourse(this.$route.params.id)
          .then(response => {
            this.courseData = response.data;
            this.SAVE_BREADCRUMBS(this.courseData.name);
            return getLessons(this.$route.params.id);
          })
          .then(response => {
            this.lessonDatas = response.data;
            this.calculate_lesson_count();
            if (this.lessonDatas.name) {
              document.title = this.lessonDatas.name + this.$t('m.titleSuffix');
            }
            if (this.$t('m.keywords')) {
              document.querySelector("meta[name='keywords']").setAttribute('content', this.$t('m.keywords'));
            }
            if (this.lessonDatas.description) {
              document.querySelector("meta[name='description']").setAttribute('content', this.lessonDatas.description.substr(0, 120));
            }
            if (this.lessonDatas.id.toString() !== this.$route.params.id.toString()) {
              this.$router.push({path: '/404'});
            }
          })
          .catch(error => {
            console.dir(error);
            this.$router.push({path: '/404'});
          });
      }
    },
    filters: {
      formatDuration(content) {
        let minutes = Math.floor(content / 60);
        let seconds = Math.floor(content % 60);
        return (
          ("" + minutes).padStart(2, 0) + ":" + ("" + seconds).padStart(2, 0)
        );
      }
    },
    beforeRouteUpdate(to, from, next) {
      next();
      this.updateCourseData();
      this.REMOVE_BREADCRUMBS(this.courseData.name);
    },
    created() {
      this.updateCourseData();
    },
    destroyed() {
      this.REMOVE_BREADCRUMBS(this.courseData.name);
    },
    computed: {
      ...mapState(["isSmallScreen", "userAccessToken"])
    }
  };
</script>


<style lang="scss" scoped>
  .course-details-container {
    width: 100%;
  }

  .course-details-content-container {
    padding-top: 0;
    .course-picture {
      background-size: cover;
      background-position: center center;
      overflow: hidden;
    }
  }

  .course-introduction {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    span {
      font-weight: bold;
    }
    .course-introduction-title,
    .course-introduction-content {
      margin: 0 8%;
    }

    .course-introduction-title {
      min-height: 61px;
      line-height: 38px;
      border-top: 1px solid #e6e6e6;
      display: flex;
      align-items: center;
      h1 {
        font-size: 32px;
      }
      .el-tag {
        display: inline-block;
        text-align: center;
        width: 18%;
        height: 40px;
        line-height: 40px;
        margin-left: 8%;
        font-size: 20px;
        color: red;
      }
    }

    .course-introduction-content {
      padding: 4% 0;
      margin: 0 8%;
      height: 61px;
      line-height: 61px;
      display: flex;
      justify-content: start;
      p {
        font-family: "Sul Sans, PingFang SC";
        font-size: 16px;
        color: #646464;
        height: 23px;
        line-height: 19px;
        margin-left: 10px;
      }

      > * {
        width: 100%;
        display: flex;
        align-items: center;
      }
    }

    .course-hr-separation-line {
      width: 84%;
      height: 1px;
      margin: 3% 8%;
      border-bottom: 1px solid #e6e6e6;
    }

    .finish-learning-students {
      padding-top: 10px;
      border-top: 1px solid #e6e6e6;
      margin: 15px 8%;
      label {
        font-size: 14px;
        color: #646464;
        line-height: 16px;
        font-weight: 600;
      }
      .course-role {
        height: 77px;
        margin-top: 15px;
        overflow: hidden;
        .course-role-details {
          width: 36px;
          height: 36px;
          display: inline-block;
          margin-right: 5px;
          border-radius: 50%;
            img{
              width: 100%;
            }
          }
      }
    }
  }

  .view-directory-container /deep/ {
    height: 48px;
    padding-left: 8%;
    width: 30%;
    .el-col {
      float: right;
    }
    padding-top: 1px;
    padding-bottom: 0;
    button {
      background-color: #fff;
      position: relative;
      border-radius: 30px;
      height: 48px;
      vertical-align: middle;
      line-height: 44px;
      width: 140px;
      padding: 20px;
      font-size: 18px;
      span {
        color: #6526b8;
        display: inline-block;
        position: absolute;
        top: 0;
        left: 25%;
        font-size: 18px;
        font-weight: bold;
      }
    }
  }

  .class-with-this-course-container {
    padding-top: 0;
    .section-title {
      b {
        color: red;
        padding-left: 1%;
      }
    }
  }
</style>
