<template>
  <div class="all-videos-container">
    <breadcrumb class="hidden-sm-and-down"></breadcrumb>
    <div class="layer all-videos-item-container">
      <open-class-items :datas="openClassDatas"></open-class-items>
    </div>
    <el-pagination
      class="pagination-container"
      layout="prev, pager, next"
      :total="total"
      @current-change="handlePageChange">

    </el-pagination>
  </div>
</template>

<script>
  import breadcrumb from "../../components/common/breadcrumb.vue";
  import openClassItems from "../../components/common/openClassItems.vue";
  import {getCourses} from "../../service/api/coursesAPI.js";

  export default {
    components: {
      openClassItems,
      breadcrumb
    },
    data() {
      return {
        openClassDatas: [],
        total: 0,
        params: {
          is_open: true,
          page: 1,
          order: "purchases_count"
        }
      }
    },
    methods: {
      handlePageChange(currentPage) {
        this.params.page = currentPage;
        this.update_courses_data();
      },
      update_courses_data() {
        return getCourses(this.params)
          .then(response => {
            this.openClassDatas = response.data.courses;
            this.total = response.data.total_pages * 10;
          })
          .catch(error => {
            console.log(error);
          });
      }
    },
    created() {
      this.update_courses_data();
      if (this.$t('m.titleOpenCourses')) {
        document.title = this.$t('m.titleOpenCourses');
      }
      if (this.$t('m.keywords')) {
        document.querySelector("meta[name='keywords']").setAttribute('content', this.$t('m.keywords'));
      }
      if (this.$t('m.descriptionOpenCourses')) {
        document.querySelector("meta[name='description']").setAttribute('content', this.$t('m.descriptionOpenCourses').substr(0, 120));
      }
    }
  }
</script>

<style lang="less">
  .all-videos-container {
    .all-videos-item-container {
      padding-bottom: 30px;
    }
  }
</style>
