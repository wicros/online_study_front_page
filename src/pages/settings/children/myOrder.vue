<template>
  <div class="my-order-wrap">
    <div class="my-order-container">
      <el-table
        :data="myOrderDatas"
        :header-cell-class-name="tableHeaderRowClassName">
        <el-table-column
          prop="product.name"
          :label="$t('m.course')"
          width="300">
          <template slot-scope="scope">
            {{scope.row.product.name}}
            <span class="myOrderDatasNameNum">LINC_{{scope.row.id}}_{{new Date(scope.row.created_at).valueOf()}}</span>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('m.price')"
          width="140">
          <template slot-scope="scope" class="myOrderPrice">
            {{scope.row.retail_price}}{{$t('m.monetaryUnit')}}
          </template>
        </el-table-column>
        <el-table-column
          prop="created_at"
          :label="$t('m.orderDate')"
          width="230">
        </el-table-column>
        <el-table-column
          :label="$t('m.orderStatus')"
          width="216">
          <template slot-scope="scope">
            <span class='myOrderStatus myOrderPaidStatus'> {{orderStatuses[scope.row.status]}}</span>
            <span class='myOrderStatus'>
                <a v-if="scope.row.status === 'unpaid'" @click="handleOrderAction(scope.row)" href="javascript:void(0)">
                  {{$t('m.orderPayment')}}
                </a>
                <a v-if="scope.row.status === 'unpaid' || scope.row.status === 'in_progress'" @click="cancelOrderAction(scope.row)" href="javascript:void(0)">
                  {{$t('m.orderCancel')}}
                </a>
                <span class="myOrderStatusService" v-if="!(scope.row.status ==='unpaid')">
                  <a @click="handleClientService" href="javascript:void(0)">{{$t('m.contactCustomerService')}}</a>
                  <icon name="qrcode_small" scale="100"></icon>
                </span>                
            </span>
          </template>
        </el-table-column>
      </el-table>

      <el-dialog
        :title="$t('m.contactCustomerService')"
        :visible.sync="clientServiceDialogVisible"
        width="30%">
        <div class="phone-container">
          <span>
            {{$t('m.clientServicePhoneJP')}}
          </span>
          <a href="tel:03-6240-2155">+81 03-6240-2155</a>
          <span>
            {{$t('m.clientServicePhoneCH')}}
          </span>
          <a href="tel:18210777570">+86 182-1077-7570</a>
        </div>
        <div class="wechat-container">
          <span>{{$t('m.clientServiceWechat')}}: yitoucunmin</span>
          <icon name="qrcode" scale="112"></icon>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
  import {getOrders, cancelOrders} from "../../../service/api/orderAPI.js";
  import {mapMutations} from "vuex";
  import {ORDER_PRODUCT, SETTINGS_NAV_INDEX} from "../../../store/mutation-types.js";

  export default {
    methods: {
      ...mapMutations([ORDER_PRODUCT, SETTINGS_NAV_INDEX]),
      tableHeaderRowClassName({row, rowIndex}) {
        return "header-row-style";
      },
      handleOrderAction(data) {
        switch (data.status) {
          case "unpaid":
            this.ORDER_PRODUCT(data);
            this.$router.push({name: "payment"});
            break;
          case 1:
            break;
        }
      },
      handleClientService() {
        this.clientServiceDialogVisible = true;
      },
      cancelOrderAction(data) {
        cancelOrders({id: data.id})
          .then(response => {
            this.getOrderDatas();
            this.$message.success(this.$t('m.cancelOrderMsg'));
          })
          .catch(err => {
            console.dir(err);
          });
      },
      getOrderDatas() {
        getOrders()
          .then(response => {
            this.myOrderDatas = response.data;
          })
          .catch(error => {
            console.log(error);
          });
      }
    },
    data() {
      return {
        myOrderDatas: [],
        orderStatuses: {"unpaid": this.$t('m.unpaid'), "in_progress": this.$t('m.progress'), "done": this.$t('m.done')},
        clientServiceDialogVisible: false
      };
    },
    created() {
      this.getOrderDatas();
      this.SETTINGS_NAV_INDEX(this.$route.meta.navIndex);
      this.$emit('updateSettingsNavIndex');
    }
  };
</script>

<style lang="scss" scoped>
  ::-webkit-scrollbar /deep/ {
    width: auto;
    height: 5px;
    background-color: #eee;
  }
  .my-order-wrap {
    overflow-x: auto;
  }
  .my-order-container /deep/ {
    margin-top: 61px;
    width: 810px;
    .myOrderDatasNameNum {
      font-family: "Sul Sans";
      line-height: 15px;
      display: block;
      color: #646464;
      font-size: 12px;
    }
    .myOrderPaidStatus {
      font-size: 14px;
      color: #000;
    }
    .myOrderStatus {
      display: flex;
      /*justify-content: center;*/
      align-items: center;
      line-height: 1.3;
      a {
        color: #6526b8;
        font-size: 12px;
      }
      > * {
        margin-right: 5px;
      }
      .myOrderStatusService {
        display: flex;
        align-items: center;
        svg {
          margin-left: 5px;
        }
      }
    }
    .el-table {
      .cell {
        height: 42px;
        font-family: "Sul Sans, PingFang SC";
        color: #000;
        font-size: 14px;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .el-table__header-wrapper {
        overflow: hidden;
        .header-row-style {
          background-color: #fff;
          padding-bottom: 0;
          .cell {
            height: 29px;
            font-size: 12px;
            color: #b1b1b1;
          }
        }
      }

      .el-table__body-wrapper {
        overflow: hidden;
      }

      .el-table--enable-row-hover .el-table__body tr:hover > td {
        background-color: #fff;
      }
    }

    .el-dialog__body {
      padding-top: 0;
      display: flex;
      justify-content: space-around;
      .phone-container {
        display: flex;
        flex-direction: column;
        justify-content: center;
        * {
          margin-top: 5px;
          color: #000;
        }
      }
      .wechat-container {
        display: flex;
        flex-direction: column;
        span {
          color: #000;
          text-align: center;
        }
      }
    }
  }
</style>
