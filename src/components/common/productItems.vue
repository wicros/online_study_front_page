<template>
<div>
<el-row class="class-items-container" :gutter="12">
    <el-col class="product-item" :xs="24" :sm="12" :md="6" :lg="6" :xl="6" v-for="item in datas" :key="item.id">
      <router-link @click.native="updateAnalytics($route.path, constants.category.PRODUCT, constants.activity.CLICK, constants.category.PRODUCT, item.id)" class="link-container" :to="'/products/'+item.id">
        <div class="grid-content">
          <div>
            <img class="title-img" :src="item.image_url || 'null_hot_class_title'" :onerror="defaultImg" alt="">
          </div>
          <div class="include-courses-people-numbers">
            <div class="include-courses">
              <icon name="pen" scale="100"></icon>
              <span>{{$t('m.includeCourses')}}</span>
              <p><span class="count">{{item.courses_count}}</span></p>
            </div>

            <div class="people-numbers">
              <icon name="peoples" scale="100"></icon>
              <span>{{$t('m.readingTheNumberOfPeople')}}</span>
              <p><span class="count">{{item.purchases_count}}</span></p>
            </div>
          </div>
          <div class="description">
            <span>{{item.description}}</span>
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
      :title="this.$t('m.noData')">
    </el-alert>
</div>
  
</template>

<script>
export default {
  props: ["datas"],
  data() {
    return {
      defaultImg: 'this.src="' + require("../../images/11.png") + '"',
    };
  },
};
</script>

<style lang="less" scoped>
  .class-items-container {
    margin-top: -16px;
  }

  .link-container {
    width: 100%;
  }

  .product-item {
    margin-top: 36px;
  }

  .grid-content {
    width: 100%;
    background: #ffffff;
    box-shadow: 0px 12px 30px rgba(0, 0, 0, 0.2);
    border-radius: 8px;
    margin: 0 auto;
    display: -webkit-flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
  }

  .title-img {
    width: 100%;
    height: auto;
    border-radius: 8px 8px 0 0;
  }

  .include-courses-people-numbers,
  .description {
    padding: 10px 0;
    display: flex;
    display: -webkit-flex; /* Safari */
    width: 100%;
    p {
      white-space: nowrap;
      padding: 10px 0;
    }
  }

  .include-courses-people-numbers {
    justify-content: center; /*水平居中*/
    align-items: center; /*指定垂直居中*/
    flex-direction: row;
    height: 30%;
    color: #646464;
    font-size: 12px;
    .include-courses {
      text-align: center;
      flex-grow: 1;
    }
    .people-numbers {
      text-align: center;
      flex-grow: 1;
    }
    .count {
      font-weight: bold;
      color: #6526b8;
      font-size: 14px;
      border: 1px solid #6526b8;
      box-sizing: border-box;
      border-radius: 10px;
      width: 40px;
      height: 20px;
      display: inline-block;
    }
  }

  .description {
    height: 55px;
    overflow: auto;
    padding: 10px 10%;
    span {
      width: 100%;
      font-size: 12px;
      color: #000000;
      white-space: normal;
    }
    &::-webkit-scrollbar {
      width: 2px;
    }
  }
</style>
