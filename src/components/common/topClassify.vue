<template>
  <div class="layer classify-container hidden-sm-and-down">
    <el-row class="classify-row" align="middle" v-for="(data, parentIndex) in datas" :key="data.name">
      <el-col :span="30" class="classify-item" :xs="8" :sm="6" :md="2" :lg="2" :xl="2">
        <label class="classify-font-common classify-title">{{data.name}}:</label>
      </el-col>
      <el-col :span="30" class="classify-item" :xs="8" :sm="6" :md="2" :lg="2" :xl="2"
              v-for="(item, index) in data.items" :key="item.id">
        <a @click="handleClassify(item, data, parentIndex, index)" class="classify-font-common"
           :class="{'classify-link-active' : data.selectedIndex === index}" href="javascript:void(0)">{{item.name}}</a>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import Vue from "vue";

  export default {
    props: ["datas"],
    methods: {
      handleClassify(item, data, parentIndex, index) {
        this.$nextTick(() => {
          Vue.set(this.datas[parentIndex], "selectedIndex", index);
        });
        this.$emit("search_with_classify", item.id, data.name);
        let category = this.$route.name.search(/product/i) !== -1 ? this.constants.category.PRODUCT : this.constants.category.COURSE;
        this.updateAnalytics(this.$route.path, category, this.constants.activity.CLICK, category)
      }
    },
    updated() {
      this.datas.forEach((data) => {
        if (data.selectedIndex == null) {
          Vue.set(data, "selectedIndex", 0);
        }
      })
    }
  };
</script>


<style lang="less" scoped>
  .classify-container {
    min-height: 280px;
    padding: 20px 40px;
    margin-top: 4%;
    border: 1px solid #b1b1b1;
    box-sizing: border-box;
    border-radius: 8px;
  }

  .classify-row {
    margin: 2% 0;
    line-height: 40px;
    .classify-font-common {
      color: #646464;
      font-size: 16px;
      display: block;
      width: 70px;
      height: 40px;
      text-align: center;
      line-height: 40px;
    }
    .classify-title {
      font-weight: 600;
    }
    .classify-link-active {
      border: 1px solid #6526b8;
      border-radius: 100px;
      box-sizing: border-box;
    }
  }
</style>
