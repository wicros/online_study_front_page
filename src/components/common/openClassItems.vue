<template>
  <el-row class="open-class-items-container" :gutter="20">
    <el-col class="open-class-item" :xs="24" :sm="12" :md="6" :lg="6" :xl="6" v-for="item in datas" :key="item.id">
      <div @click="handleFreeWatch(item.id)" class="grid-content">
        <div class='grid-content-img'>
          <img :src="item.image_url || 'null_open_class_item'" :onerror="defaultImg" alt="">
        </div>
        <div class='grid-content-des'>
          <h2 class="ellipsis">{{item.name}}</h2>
          <h3>
            <icon scale="100" name="peoples"></icon>
            {{$t('m.readingTheNumberOfPeople')}}<span class="people-numbers">{{item.purchases_count}}</span>
          </h3>
          <el-button @click="handleFreeWatch(item.id)" class="free-watch" size="medium" type="info">
            {{$t('m.freeWatch')}}
          </el-button>
        </div>
      </div>
    </el-col>
    <el-alert
      class="no-data"
      v-if="datas && datas.length === 0"
      type="info"
      show-icon
      center
      :title="this.$t('m.noData')">
    </el-alert>
  </el-row>
</template>

<script>
  export default {
    props: ["datas"],
    data() {
      return {
        defaultImg: 'this.src="' + require("../../images/10.png") + '"'
      };
    },
    methods: {
      handleFreeWatch(id) {
        this.$router.push({
          name: "openCourseDetails",
          params: {id: id}
        });
        this.updateAnalytics(this.$route.path, this.constants.category.OPEN_COURSE, this.constants.activity.CLICK, this.constants.category.OPEN_COURSE, id)
      }
    }
  };
</script>

<style lang="scss" scoped>
  .open-class-items-container {
    margin-top: -16px;
  }

  .open-class-item {
    margin-top: 36px;
  }

  .grid-content {
    cursor: pointer;
    height: 306px;
    display: -webkit-flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    position: relative;
    border-radius: 8px;
    box-shadow: 0px 12px 30px rgba(0, 0, 0, 0.2);
    overflow: hidden;
  }

  h2,
  h3 {
    height: 20px;
    color: white;
    white-space: normal;
    color: #000000;
  }
  .grid-content-img {
    position: absolute;
    top: 0;
    left: 0;
    height: 168px;
    width: 100%;
    overflow: hidden;
    img {
      width: 100%;
    }
  }
  .grid-content-des {
    display: inline-block;
    position: absolute;
    width: 100%;
    padding: 0 18px;
    left: 0;
    bottom: 0;
  }

  h2 {
    font-size: 20px;
    height: 28px;
    font-weight: bold;
    margin-top: 10px;
    font-family: "PingFang SC, Sul Sans";
  }

  h3 {
    color: #646464;
    font-size: 12px;
    line-height: 12px;
    margin-top: 5px;
    font-family: "PingFang SC";
    .people-numbers {
      height: 20px;
      line-height: 20px;
      width: 42px;
      display: inline-block;
      border-radius: 100px;
      margin-left: 6px;
      text-align: center;
      vertical-align: middle;
      color: #fff;
      background-color: #00deb7;
    }
  }

  .free-watch /deep/ {
    width: 110px;
    height: 40px;
    font-size: 16px;
    line-height: 19px;
    color: white;
    background-color: #6526b8;
    border-radius: 100px;
    border: none;
    margin-top: 18px;
    margin-bottom: 18px;
    span {
      vertical-align: top;
      font-weight: bold;
    }
  }
</style>
