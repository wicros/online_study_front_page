<template>
  <div class="all-product-container">

    <top-classify @search_with_classify="search_with_classify" :datas="classifyDatas"></top-classify>

    <el-menu :default-active="activeIndex" class="layer container-padding sort-container el-menu-demo"
             mode="horizontal" @select="handleSelectSort">
      <el-menu-item index="1">{{$t('m.recommend')}}</el-menu-item>
      <el-menu-item index="2">{{$t('m.newest')}}</el-menu-item>
      <el-menu-item index="3">{{$t('m.hottest')}}</el-menu-item>
      <!--<el-menu-item index="4">{{$t('m.price')}}<i :class="`el-icon-arrow-${isPriceSortAsc?'up':'down'}`"></i>-->
      <!--</el-menu-item>-->
    </el-menu>

    <div class="layer all-courses-item-container">
      <product-items :datas="currentPageDatas"></product-items>
    </div>

    <el-pagination
      v-if="pageReset"
      class="pagination-container"
      layout="prev, pager, next"
      :page-size="12"
      :current-page.sync="currentPage"
      :total="total"
      @current-change="handlePageChange">
    </el-pagination>
  </div>
</template>

<script>
  import topClassify from "../../components/common/topClassify.vue";
  import productItems from "../../components/common/productItems.vue";
  import {getProducts} from "../../service/api/productsAPI.js";
  import {getThemes, getSubjects} from "../../service/api/coursesAPI.js";
  import {mapMutations} from "vuex"

  export default {
    components: {
      topClassify,
      productItems
    },
    created() {
      this.initDatas();
      if (this.$t('m.titleProducts')) {
        document.title = this.$t('m.titleProducts');
      }
      if (this.$t('m.keywords')) {
        document.querySelector("meta[name='keywords']").setAttribute('content', this.$t('m.keywords'));
      }
      if (this.$t('m.descriptionProducts')) {
        document.querySelector("meta[name='description']").setAttribute('content', this.$t('m.descriptionProducts').substr(0, 120));
      }
    },
    data() {
      return {
        pageReset: false,
        activeIndex: "1",
        sortType: ["recommend_point", "created_at", "purchases_count"],
        isPriceSortAsc: true,
        total: 0,
        currentPage: 1,
        currentPageDatas: [],
        classifyDatas: [],
        all_item: {id: "", name: this.$t("m.all")},
        themeData: [],
        subjectData: [],
        currentSubjectData: [],
        params: {
          text: "",
          school: "",
          style: "",
          subject: "",
          theme: "",
          page: 1,
          order: "recommend_point"
        }
      };
    },
    methods: {
      handleSelectSort(key, keyPath) {
        this.$router.push({path: "/products?order=" + this.sortType[key - 1] });
        this.activeIndex = '' + key;
        this.params.order = this.sortType[key - 1];
        this.pageReset = false;
        this.handlePageChange(1);
        this.updateAnalytics(this.$route.path, this.constants.category.SORT, this.constants.activity.CLICK, this.params.order)
      },
      handlePageChange(currentPage) {
        this.currentPage = currentPage;
        this.params.page = currentPage;
        this.updateProductsData();
      },
       generateSearchParams(){
          let order = this.$route.query.order;
          let index = 0;
           if (this.sortType.includes(order)) {
               index = this.sortType.indexOf(order);
           }
           this.params.order = this.sortType[index];
           this.activeIndex = '' + (index + 1);
       },
      initDatas() {
        this.generateSearchParams();
        const other = this.$t('m.other');
        getThemes()
          .then(response => {
            if (response.status === 200) {
              this.themeData.push(this.all_item);
              this.themeData.push(...response.data);
              this.themeData.splice(this.themeData.findIndex(function(element) {return element.name === other;}), 1);
              return getSubjects();
            }
          })
          .then(response => {
            if (response.status === 200) {
              this.subjectData.push(this.all_item);
              this.subjectData.push(...response.data);
              this.subjectData.splice(this.subjectData.findIndex(function(element) {return element.name === other;}), 1);
              this.currentSubjectData.push(...this.subjectData);
              this.generate_classify_data();
              this.updateProductsData();
            }
          })
          .catch(error => {
            console.log(error);
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
        this.currentPage = 1;
        this.updateProductsData();
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
      updateProductsData() {
        getProducts(this.params)
          .then(response => {
            this.currentPageDatas = response.data.products;
            this.total = response.data.total_pages * 12;
            this.pageReset = true;
          })
          .catch(error => {
            console.log(error);
          });
      }
    }
  };
</script>

<style lang="less">
  .all-product-container {
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
