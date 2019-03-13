<template>
<div>
  <el-row :gutter="17" class="row-bg course-container">
    <el-col class="course-item" :xs="24" :sm="12" :md="8" :lg="8" :xl="8" v-for="item in datas" :key="item.id">
      <router-link @click.native="updateAnalytics($route.path, constants.category.COURSE, constants.activity.CLICK, constants.category.COURSE, item.id)" class="course-item-link" :to="'/courses/'+item.id">
        <div class="grid-content bg-purple">
          <div class="course-content">
            <div class="course-icon-container">
              <img class="course-icon" :src="item.image_url || 'null_course_icon'" :onerror="defaultImg" alt="">
            </div>
            <div class="course-info">
              <div class="course-name">{{item.name}}</div>
              <div class="course-time-peoples">
                <p class="course-info-time">
                  <span class="count">{{item.lessons_count}}</span>{{$t('m.classHour')}}
                </p>
                <p class="course-people-numbers">
                  <span class="count">{{item.purchases_count}}</span>{{$t('m.learningStudents')}}
                </p>
              </div>
              <div class="course-description">
                <p>{{item.description}}</p>
              </div>
            </div>
          </div>
        </div>
      </router-link>
    </el-col>
  </el-row>
  <el-alert
      class="no-data"
      v-if="datas && datas.length === 0"
      type="info"
      show-icon
      center
      :title="$t('m.noData')">
    </el-alert>
</div>
  
</template>

<script>
export default {
  props: ["datas"],
  data() {
    return {
      defaultImg: 'this.src="' + require("../../images/7.png") + '"'
    }
  }
};
</script>


<style lang="less" scoped>
  .course-container {
    margin-top: -16px;
    flex-wrap: wrap;
  }

  .course-item {
    display: -webkit-flex;
    align-items: center;
    justify-content: center;
    margin-top: 36px;
    .course-item-link {
      width: 100%;
    }
  }

  .grid-content {
    border-radius: 8px;
  }

  .course-content {
    background: #ffffff;
    box-shadow: 0px 12px 30px rgba(0, 0, 0, 0.2);
    border-radius: 8px;
    width: 100%;
    height: 120px;
    display: flex;
    display: -webkit-flex; /* Safari */
    justify-content: space-between;
    flex-direction: row;
    align-items: center;
    white-space: nowrap;
    padding-right: 5%;
    .course-icon-container {
      width: 40%;
      height: 100%;
      border-radius: 8px 0 0 8px;
      overflow: hidden;
      img {
        height: 120px;
      }
    }
    .course-info {
      width: 57%;
      height: 120px;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      .course-name {
        font-size: 16px;
        width: 100%;
        color: #000;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: normal;
      }
      .course-time-peoples {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        .course-people-numbers {
          margin-left: 5%;
        }
      }
    }
    .count {
      font-size: 16px;
      color: #6526b8;
      font-weight: bold;
    }
  }

  .course-description {
    max-height: 60px;
    overflow: auto;
    p {
      color: #646464;
      font-size: 12px;
      white-space: normal;
    }
  }
</style>
