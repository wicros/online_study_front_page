<template>
  <div class="all-courses-container">

    <top-classify :datas="classifyDatas" @search_with_classify="search_with_classify"></top-classify>

    <el-menu :default-active="activeIndex" class="layer container-padding sort-container"
             mode="horizontal" @select="handleSelectSort">
      <el-menu-item index="1">{{$t('m.recommend')}}</el-menu-item>
      <el-menu-item index="2">{{$t('m.newest')}}</el-menu-item>
      <el-menu-item index="3">{{$t('m.hottest')}}</el-menu-item>
    </el-menu>

    <div class="layer all-courses-item-container">
      <star-course-items :datas="currentPageDatas"></star-course-items>
    </div>

    <el-pagination
      v-if="pageReset"
      class="pagination-container"
      layout="prev, pager, next"
      :page-size="12"
      :total="total"
      :current-page.sync="currentPage"
      @current-change="handlePageChange">
    </el-pagination>
  </div>
</template>

<script>
  import starCourseItems from "../../components/common/courseItems.vue";
  import topClassify from "../../components/common/topClassify.vue";
  import {
    getCourses,
    getThemes,
    getSubjects
  } from "../../service/api/coursesAPI.js";

  export default {
    components: {
      starCourseItems,
      topClassify
    },
    data() {
      return {
        searchKey: "",
        activeIndex: "1",
        currentPageDatas: [],
        currentPage: 1,
        total: 0,
        sortType: ["recommend_point", "created_at", "purchases_count"],
        classifyDatas: [],
        all_item: {id: "", name: this.$t("m.all")},
        themeData: [],
        subjectData: [],
        currentSubjectData: [],
        params: {
          text: "",
          is_open: "false",
          school: "",
          style: "",
          subject: "",
          theme: "",
          page: 1,
          order: "recommend_point"
        },
        pageReset: false
      };
    },
    watch: {
      $route(to, from) {
        this.searchKey = to.query.searchKey;
        this.params.text = this.searchKey;
        this.update_courses_data();
      },
    },
    methods: {
      handleSelectSort(key, keyPath) {
        this.$router.push({path: "/courses?order=" + this.sortType[key - 1] });
        this.activeIndex = '' + key;
        this.params.order = this.sortType[key - 1];
        this.handlePageChange(1);
        this.pageReset = false;
        this.updateAnalytics(this.$route.path, this.constants.category.SORT, this.constants.activity.CLICK, this.params.order)
      },
      handlePageChange(currentPage) {
        this.currentPage = currentPage;
        this.params.page = currentPage;
        this.update_courses_data();
      },
      update_courses_data() {
        return getCourses(this.params)
          .then(response => {
            this.currentPageDatas = response.data.courses;
            this.total = response.data.total_pages * 12;
            this.pageReset = true;
          })
          .catch(error => {
            console.dir(error);
          });
      },
      generate_classify_data() {
        let styleData = [
          this.all_item,
          {id: "art", name: this.$t('m.art')},
          {id: "science", name: this.$t('m.science')}
        ];
        this.classifyDatas.push({name: this.$t('m.searchAffiliation'), items: this.themeData});
        this.classifyDatas.push({name: this.$t('m.searchCourse'), items: styleData});
        this.classifyDatas.push({name: this.$t('m.searchDepartment'), items: this.currentSubjectData});
      },
      search_with_classify(value, type_name) {
        this.params.page = 1;
        if (type_name === this.$t('m.searchAffiliation')) {
          this.params.theme = value;
        } else if (type_name === this.$t('m.searchCourse')) {
          this.params.style = value;
          this.params.subject = '';
          this.filterSubjectData(value);
        } else if (type_name === this.$t('m.searchDepartment')) {
          this.params.subject = value;
        }

        this.update_courses_data();
      },
      filterSubjectData(style) {
        let filterData = this.subjectData.filter(item => {
          if (style === '') {
            return true;
          }
          return item.style === style || item.name === this.$t('m.all');
        });
        this.currentSubjectData.length = 0;
        this.currentSubjectData.push(...filterData);

        delete this.classifyDatas[2].selectedIndex;
      },
      generateSearchParams(){
        let order = this.$route.query.order;
        let index = 0;
        if (this.sortType.includes(order)) {
          index = this.sortType.indexOf(order);
        }
        this.params.order = this.sortType[index];
        this.activeIndex = '' + (index + 1);
      }
    },
    created() {
      this.searchKey = this.$route.query.searchKey;
      this.params.text = this.searchKey;
      this.generateSearchParams();
      const other = this.$t('m.other');
      getThemes()
        .then(response => {
          this.themeData.push(this.all_item);
          this.themeData.push(...response.data);
          this.themeData.splice(this.themeData.findIndex(function(element) {return element.name === other;}), 1);
          return getSubjects();
        })
        .then(response => {
          this.subjectData.push(this.all_item);
          this.subjectData.push(...response.data);
          this.subjectData.splice(this.subjectData.findIndex(function(element) {return element.name === other;}), 1);
          this.currentSubjectData.push(...this.subjectData);
          this.generate_classify_data();
          this.update_courses_data();
        })
        .catch(error => {
          console.dir(error);
        });
      this.classifyDatas.forEach(element => {
        element.selectedIndex = 0;
      });
      if (this.$t('m.titleCourses')) {
        document.title = this.$t('m.titleCourses');
      }
      if (this.$t('m.keywords')) {
        document.querySelector("meta[name='keywords']").setAttribute('content', this.$t('m.keywords'));
      }
      if (this.$t('m.descriptionCourses')) {
        document.querySelector("meta[name='description']").setAttribute('content', this.$t('m.descriptionCourses').substr(0, 120));
      }
    }
  };
</script>


<style lang="less">
  .all-courses-container {
    overflow: hidden;
    .sort-container {
      border-bottom: 0;
      padding-top: 30px;
      .el-menu-item {
        color: #000000;
        font-weight: 600;
        font-size: 18px;
        &.is-active {
          border-bottom: transparent;
          color: #6526b8;
        }
      }
    }
    .all-courses-item-container {
      margin-top: -20px;
      padding-bottom: 30px;
    }
  }
</style>
