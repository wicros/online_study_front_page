<template>
  <div class="payment-wrap">
    <div class="payment-container">
      <breadcrumb class="hidden-sm-and-down"></breadcrumb>
      <el-row class="layer product-container">
        <el-col :xs="24" :sm="24" :md="6" :xl="6" :lg="6">
          <div class="product-card-container">
            <div class="product-title">
              <p>{{orderProduct.product.name}}</p>
              <img class="title-img" :src="orderProduct.product.image_url || 'null_product_title'" :onerror="defaultImg" alt="">
            </div>
            <div class="include-courses-people-numbers">
              <div class="include-courses">
                <icon name="pen" scale="120"></icon>
                <span>{{$t('m.includeCourses')}}</span>
                <p><span class="count">{{orderProduct.product.courses_count}}</span></p>
              </div>
              <div class="people-numbers">
                <icon name="peoples" scale="120"></icon>
                <span>{{$t('m.readingTheNumberOfPeople')}}</span>
                <p><span class="count">{{orderProduct.product.purchases_count}}</span>
                </p>
              </div>
            </div>
            <div class="product-description">{{orderProduct.product.name}}</div>
            <div class="product-price">
              <icon name="cny" scale="100"></icon>
              {{orderProduct.retail_price}}
            </div>
          </div>
        </el-col>
        <el-col :xs="24" :sm="24" :md="18" :xl="18" :lg="18">
          <div class="product-info-container">
            <h3 class="product-info-title">{{$t('m.orderDetail')}}</h3>
            <div class="order-details-container">
              <label class="title"></label>
              <el-table
                :data="[orderProduct]"
                header-cell-product-name="header-row-style">
                <el-table-column
                  :label="$t('m.course')">
                  <template slot-scope="scope">
                    {{scope.row.product.name}}
                    <span class="order-details-name-num">LINC_{{scope.row.id}}_{{new Date(scope.row.created_at).valueOf() || 0}}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  :label="$t('m.price')">
                  <template slot-scope="scope" class="myOrderPrice">
                    {{scope.row.retail_price}}{{$t('m.monetaryUnit')}}
                  </template>
                </el-table-column>
              </el-table>
            </div>

            <div class="tip-container">
              <p>
                {{$t('m.paymentInfo')}}
              </p>
            </div>

            <p class="product-info-title product-info-pay">{{$t('m.paymentMethod')}}</p>

            <div class="product-pay-type-container">
              <div class="product-payments-container">
                <p class="product-payments-title">{{$t('m.paymentAripei')}}</p>
                <div class='product-payments-action'>
                  <icon name="alipay" scale="100"></icon>
                  <el-button @click="handleGoToAlipay">{{$t('m.paymentAripeiBtn')}}</el-button>
                </div>
              </div>

              <div class="payment-middle-separation">
                <div class="product-info-pay-interval">
                  <svg width="4" height="26" viewBox="0 0 4 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <line y1="-0.5" x2="23" y2="-0.5" transform="rotate(90)" stroke="#E6E6E6"/>
                    <line y1="-0.5" x2="4.24264" y2="-0.5" transform="translate(0 23) rotate(45)" stroke="#E6E6E6"/>
                  </svg>
                </div>
                <span>{{$t('m.or')}}</span>
                <div>
                  <svg width="4" height="26" viewBox="0 0 4 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <line y1="-0.5" x2="23" y2="-0.5" transform="translate(4 26) rotate(-90)" stroke="#E6E6E6"/>
                    <line y1="-0.5" x2="4.24264" y2="-0.5" transform="translate(4 3) rotate(-135)" stroke="#E6E6E6"
                          stroke-linejoin="round"/>
                  </svg>
                </div>
              </div>

              <div class="product-payments-container">
                <p class="product-payments-title">{{$t('m.otherPayment')}}</p>
                <div class='product-payment-client-service product-payments-action'>
                  <span class="qr">
                    <icon name="qrcode" scale="58"></icon>
                  </span>
                  <el-button>{{$t('m.otherPaymentQr')}}</el-button>
                </div>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
  import breadcrumb from "../../components/common/breadcrumb.vue";
  import {goToAlipay} from "../../service/api/orderAPI.js";
  import {mapState, mapMutations} from "vuex";

  export default {
    data() {
      return {
        defaultImg: 'this.src="' + require("../../images/11.png") + '"',
      };
    },
    components: {
      breadcrumb,
    },
    computed: {
      ...mapState(["orderProduct"])
    },
    methods: {
      handleGoToAlipay() {
        let newWindow = window.open('about:blank');
        goToAlipay({order_id: this.orderProduct.id})
          .then(response => {
            newWindow.location.href = response.data.url;
            this.$router.push({path: '/myOrder'});
          })
          .catch(err => {
            console.dir(err);
            newWindow.close();
            this.$router.push({path: '/myOrder'});
          });
        this.updateAnalytics(this.$route.path, this.constants.category.PAYMENT, this.constants.activity.CLICK, this.constants.category.PAYMENT, this.orderProduct.id)
      }
    },
    created() {
      if (this.orderProduct.product && Object.keys(this.orderProduct.product).length === 0) {
        this.$message.error(this.$t('m.selectPackage'));
        this.$router.push({
          name: "products"
        });
      }
    }
  };
</script>

<style lang="scss" scoped>
  .payment-wrap {
    overflow-x: auto;
  }

  .payment-container {
    .product-container {
      margin-top: 20px;
      .product-card-container {
        height: 297px;
        width: 251px;
        position: relative;
        box-shadow: 0px 12px 30px rgba(0, 0, 0, 0.2);
        border-radius: 8px;
        .product-title {
          overflow: hidden;
          height: 100px;
          width: 100%;
          font-size: 20px;
          color: white;
          text-align: center;
          display: flex;
          justify-content: center;
          align-items: center;
          p {
            font-size: 20px;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }
          .title-img {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100px;
            border-radius: 8px 8px 0 0;
            z-index: -1;
          }
        }
        .product-description {
          height: 77px;
          padding: 0 18px;
          font-size: 12px;
          font-family: "PingFang SC";
          color: #000;
          overflow: hidden;
        }
        .include-courses-people-numbers {
          padding: 10px 0;
          display: flex;
          display: -webkit-flex; /* Safari */
          width: 100%;
          height: 68px;
          justify-content: center;
          align-items: center;
          flex-direction: row;
          p {
            white-space: nowrap;
          }
          .include-courses,
          .people-numbers {
            text-align: center;
            flex-grow: 1;
            font-size: 12px;
            color: #646464;
            font-family: "PingFang SC";
            svg {
              vertical-align: middle;
            }
          }
          .count {
            font-size: 14px;
            font-weight: bold;
            width: 42px;
            height: 22px;
            color: #6526b8;
            display: inline-block;
            border: 1px solid #6526b8;
            border-radius: 25px;
          }
        }
        .product-price {
          padding: 0 18px;
          font-size: 24px;
          color: #6526b8;
          font-family: "Sul Sans";
          overflow: hidden;
        }
      }
      .product-info-container {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: flex-start;
        .product-info-title {
          margin: 0;
          font-family: "PingFang SC";
          font-size: 18px;
          color: #000;
          font-weight: 800;
        }
        .order-details-container /deep/ {
          width: 100%;
          margin-top: 15px;
          .el-table--enable-row-hover .el-table__body tr:hover > td {
            background-color: #fff;
          }
          .header-row-style {
            .cell {
              color: #b1b1b1;
            }
          }
          .cell {
            color: #000;
            padding: 0;
          }
          .order-details-name-num {
            font-family: "Sul Sans";
            line-height: 15px;
            display: block;
            color: #646464;
            font-size: 12px;
          }
        }
        .tip-container {
          margin: 0;
          width: 100%;
          p {
            padding: 18px 20px;
            border-radius: 8px;
            font-size: 12px;
            color: #6526b8;
            background-color: #faf6ff;
          }
        }
        .product-info-pay {
          margin-top: 50px;
        }
        .product-pay-type-container {

          .product-payments-container {
            color: #b1b1b1;
            font-size: 12px;
            margin-bottom: 20px;
            .product-payments-action {
              display: flex;
              align-items: center;
              height: 50px;
              .el-button /deep/ {
                margin-left: 20px;
                padding: 0;
                width: 128px;
                height: 50px;
                border-radius: 25px;
                background-color: #6526b8;
                border-color: #6526b8;
                color: #fff;
                span {
                  font-size: 16px;
                }
              }
            }
          }

          .payment-middle-separation {
            margin: 0 70px;
            .product-info-pay-interval {
              span {
                color: #646464;
              }
            }
          }

          .product-payment-client-service {
            .qr {
              width: 80px;
              height: 80px;
              display: inline-block;
            }
            &.product-payments-action .el-button {
              cursor: auto;
              border: 2px solid #6526b8;
              background-color: #fff;
              color: #6526b8;
            }
          }
        }
      }
    }
  }
</style>
