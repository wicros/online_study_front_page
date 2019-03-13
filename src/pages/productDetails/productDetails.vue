<template>
  <div>
    <breadcrumb class="hidden-sm-and-down"></breadcrumb>

    <div class="image-and-summary">
      <el-row>
        <el-col :sm="24" :md="12">
          <h1><img class="class-picture" :src="productData.image_url" v-bind:alt="productData.name"></h1>
        </el-col>

        <el-col class="summary" :sm="24" :md="12">
          <div class="hidden-xs-only hidden-sm-only product-name">{{productData.name}}</div>

          <div v-if="productData.id === 1 || productData.id === 10" class="benefit-list">
            <div>{{$t('m.benefit1')}}</div>
            <div>{{$t('m.benefit1Note1')}}</div>
            <div>{{$t('m.benefit2')}}</div>
            <div>{{$t('m.benefit2Note')}}</div>
            <div>{{$t('m.benefit3')}}</div>
            <div>{{$t('m.benefit3Note')}}</div>
          </div>
          <div v-else-if="productData.id === 2 || productData.id === 11" class="benefit-list">
            <div>{{$t('m.benefit1')}}</div>
            <div>{{$t('m.benefit1Note2')}}</div>
            <div>{{$t('m.benefit2')}}</div>
            <div>{{$t('m.benefit2Note')}}</div>
            <div>{{$t('m.benefit3')}}</div>
            <div>{{$t('m.benefit3Note')}}</div>
          </div>
          <div v-else class="benefit-list">
            <div>{{$t('m.benefit2')}}</div>
            <div>{{$t('m.benefit2Note')}}</div>
            <div>{{$t('m.benefit3')}}</div>
            <div>{{$t('m.benefit3Note')}}</div>
          </div>

          <div class="separation-line"></div>

          <div class='finshed-study'>
            <icon name="peoples" scale="120"></icon>
            <span>{{productData.purchases_count}}</span>
            {{$t('m.finishLearning')}}
            [{{$t('m.serviceLife') + productData.limit_month + $t('m.month')}}]
          </div>
        </el-col>
      </el-row>

      <el-row class="buy-btn">
        <el-col class="summary" :sm="{span: 24, offset: 0}" :md="{span: 12, offset: 12}">
          <div class="buy-now-container">
            <!--:disabled="productData.is_purchased"-->
            <el-button @click="handleBuyNow" class="buy-now" type="info">{{productData.is_purchased ? $t('m.purchased') : $t('m.buyNow')}}</el-button>
            <div class="buy-now-inner">
              <span class="using_expired" v-if="productData.is_purchased">{{$t('m.validTill') + productData.using_expired_at.substring(0,10)}}</span>
              <div class='buy-now-course-price'>
                <div class="course-price-inner">
                  <span>{{$t('m.moneySymbol')}}</span>
                  <span class="course-price">{{productData.retail_price}}</span>{{$t('m.monetaryUnit')}}
                </div>
              </div>
            </div>
          </div>

          <div class="separation-line"></div>
        </el-col>
      </el-row>
    </div>

    <div v-if="productData.id === 1 || productData.id === 10" class="vertically-long-image">
      <img :src='require("../../images/liberal_arts_750_01.jpg")'>
      <img :src='require("../../images/liberal_arts_750_02.jpg")'>
      <img :src='require("../../images/liberal_arts_750_03.jpg")'>
      <img :src='require("../../images/liberal_arts_750_04.jpg")'>
      <img :src='require("../../images/liberal_arts_750_05.jpg")'>
      <img :src='require("../../images/liberal_arts_750_06.jpg")'>
      <img :src='require("../../images/liberal_arts_750_07.jpg")'>
      <img :src='require("../../images/liberal_arts_750_08.jpg")'>
      <img :src='require("../../images/liberal_arts_750_09.jpg")'>
      <img :src='require("../../images/liberal_arts_750_10.jpg")'>
    </div>
    <div v-else-if="productData.id === 2 || productData.id === 11" class="vertically-long-image">
      <img :src='require("../../images/science_750_01.jpg")'>
      <img :src='require("../../images/liberal_arts_750_02.jpg")'>
      <img :src='require("../../images/liberal_arts_750_03.jpg")'>
      <img :src='require("../../images/liberal_arts_750_04.jpg")'>
      <img :src='require("../../images/liberal_arts_750_05.jpg")'>
      <img :src='require("../../images/liberal_arts_750_07.jpg")'>
      <img :src='require("../../images/liberal_arts_750_08.jpg")'>
      <img :src='require("../../images/liberal_arts_750_09.jpg")'>
      <img :src='require("../../images/liberal_arts_750_10.jpg")'>
    </div>
    <div v-else>
      <product-description class="instruction" :title="$t('m.productDescription')" :text="productData.instruction"></product-description>

      <div class="courses">
        <div class="section-title">
          <span>{{$t('m.includeStarCourses')}}<b class="courses-count">({{productData.courses_count}})</b></span>
        </div>
        <star-course-items :datas="productData.courses"></star-course-items>
      </div>

      <div class="products">
        <div class="section-title">
          <span>{{$t('m.otherRecommendedProducts')}}</span>
        </div>
        <product-items :datas="productData.recommend_products"></product-items>
      </div>
    </div>
  </div>
</template>

<script>
  import breadcrumb from "../../components/common/breadcrumb.vue";
  import starCourseItems from "../../components/common/courseItems.vue";
  import productItems from "../../components/common/productItems.vue";
  import productDescription from "../../components/common/productDescription.vue";
  import {showProduct} from "../../service/api/productsAPI.js";
  import {createOrder} from "../../service/api/orderAPI.js";
  import {mapMutations} from "vuex";
  import {
    SAVE_BREADCRUMBS,
    REMOVE_BREADCRUMBS,
    ORDER_PRODUCT,
  } from "../../store/mutation-types.js";

  export default {
    components: {
      breadcrumb,
      starCourseItems,
      productItems,
      productDescription
    },
    data() {
      return {
        // defaultImg: 'this.src="' + require("../../images/9.png") + '"',
        defaultUserAvatar: 'this.src="' + require("../../../static/avatar.png") + '"',
        productData: {}
      };
    },
    methods: {
      ...mapMutations([SAVE_BREADCRUMBS, REMOVE_BREADCRUMBS, ORDER_PRODUCT]),
      handleBuyNow() {
        this.updateAnalytics(this.$route.path, this.constants.category.PRODUCT, this.constants.activity.CLICK, 'buy_product', this.productData.id)
        let params = {product_id: this.productData.id}
        createOrder(params)
          .then(response => {
            this.ORDER_PRODUCT(response.data);
            this.$router.push({
              name: "payment"
            });
          })
          .catch(err => {
            if (err.response.status === 400 && err.response.data.error === this.$t('m.alreadyOrdered')) {
              this.$message.warning(err.response.data.error);
              this.$router.push({path: '/myOrder'})
            }
          });
      },
      updateProductData(id) {
        showProduct(id)
          .then(response => {
            this.productData = response.data;
            this.SAVE_BREADCRUMBS(this.productData.name);
            if (this.productData.name) {
              document.title = this.productData.name + this.$t('m.titleSuffix');
            }
            if (this.$t('m.keywords')) {
              document.querySelector("meta[name='keywords']").setAttribute('content', this.$t('m.keywords'));
            }
            if (this.productData.description) {
              document.querySelector("meta[name='description']").setAttribute('content', this.productData.description.substr(0, 120));
            }
            if (this.productData.id.toString() !== this.$route.params.id.toString()) {
              this.$router.push({path: '/404'});
            }
          })
          .catch(error => {
            console.dir(error);
            this.$router.push({path: '/404'});
          });
      }
    },
    beforeRouteUpdate(to, from, next) {
      next();
      this.updateProductData(to.params.id);
      this.REMOVE_BREADCRUMBS(this.productData.name);
    },
    destroyed() {
      this.REMOVE_BREADCRUMBS(this.productData.name);
    },
    created() {
      this.updateProductData(this.$route.params.id);
    }
  };
</script>

<style lang="scss" scoped>
  $buy-btn-offset: -65px;

  .class-picture {
    width: 100%;
    height: auto;
  }

  .summary {
    padding: 0 10px;
  }

  .separation-line {
    width: 100%;
    height: 1px;
    border-top: 1px solid #e6e6e6;
  }

  .finshed-study {
    margin-top: 10px;
    font-size: 14px;
    color: #646464;
  }
  .product-name {
    font-size: 24px;
    margin-bottom: 10px;
  }
  .benefit-list {
    font-size: 14px;
    color: #646464;

    & > div:nth-child(odd) {
      border-left: 6px solid #6526b8;
      padding-left: 6px;
    }
    & > div:nth-child(even) {
      margin-left: 20px;
      margin-bottom: 10px;
    }
  }

  .buy-now-container {
    display: flex;
    justify-content: space-between;
    padding-top: 1px;
    padding-bottom: 10px;
    .using_expired{
        font-size: 10px;
        line-height: 2;
      }
    .buy-now /deep/ {
      background-color: #6526b8;
      border-color: #6526b8;
      position: relative;
      border-radius: 30px;
      height: 48px;
      vertical-align: middle;
      width: 140px;
      padding: 0;
      font-size: 18px;
      span {
        color: #fff;
        display: inline-block;
        font-size: 18px;
        font-weight: bold;
      }
    }
    .buy-now-inner {
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      width: calc(100% - 150px);
      line-height: 1;
    }
    .buy-now-course-price {
      display: inline-block;
      text-align: right;
      .course-price-inner {
        display: inline-block;
        color: #6526b8;
        font-size: 24px;
        overflow: hidden;
        span {
          float: left;
          font-size: 24px;
        }
      }
    }
  }

  .courses-count {
    color: red;
    padding-left: 1%;
  }

  .products {
    margin-top: 30px;
  }

  @media screen and (min-width: 992px) {
    .courses,
    .products,
    .image-and-summary {
      width: 1040px;
      min-width: 1040px;
      margin-left: auto;
      margin-right: auto;
    }

    .vertically-long-image {
      width: 750px;
      min-width: 750px;
      margin-left: auto;
      margin-right: auto;
    }

    .buy-btn {
      top: $buy-btn-offset;
    }
    .instruction {
      margin-top: $buy-btn-offset;
    }
  }

  @media screen and (max-width: 992px) {
    .vertically-long-image {
      margin-left: auto;
      margin-right: auto;

      & img {
        max-width: 100%;
      }
    }
  }
</style>
