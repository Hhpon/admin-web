<template>
  <div class="app">
    <div class="top">
      <div class="title">
        <div class="item">订单号：</div>
        <div class="item">订单状态：</div>
        <div class="item">收货人：</div>
        <div class="item">联系电话：</div>
        <div class="item">收货地址：</div>
        <div class="item">订单总价：</div>
      </div>
      <div class="content">
        <div class="item">{{orderDetail.out_trade_no}}</div>
        <div
          class="item"
          style="color:#fd2844;display:flex;justify-content:space-between;align-items:center;"
        >
          {{orderDetail.status}}
          <el-button v-show="showBtn" type="danger" size="mini" @click="changeOrderStatus()">发货</el-button>
        </div>
        <div class="item">{{orderDetail.address.userName}}</div>
        <div class="item">{{orderDetail.address.telNumber}}</div>
        <div class="item">{{orderDetail.address.addressDetail}}</div>
        <div class="item" style="color:#fd2844">￥{{orderDetail.total_fee}}</div>
      </div>
    </div>
    <div class="goods">
      <div class="title">商品详情：</div>
      <div>
        <div class="payGoods" v-for="item in orderDetail.payGoods">
          <img :src="item.titleUrl" alt>
          <div class="detail">
            <div>
              <div>{{item.name}}</div>
              <div class="nameItem">{{item.subTitle}}</div>
            </div>
            <div class="num">
              <span class="numItem">￥{{item.price}}</span>
              <span class="numItem">x{{item.shoppingNum}}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { setTimeout } from "timers";
export default {
  data() {
    return {
      orderDetail: {},
      showBtn: false
    };
  },
  mounted() {
    this.getOrderDetail();
  },
  methods: {
    getOrderDetail() {
      this.orderDetail = this.$route.params.orderDetail;
      if (this.orderDetail.status === "待发货") {
        this.showBtn = true;
      } else {
        this.showBtn = false;
      }
    },
    changeOrderStatus() {
      this.$confirm("是否确认发货?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          axios
            .post("http://127.0.0.1:7001/ship", {
              out_trade_no: this.orderDetail.out_trade_no,
              status: "待收货"
            })
            .then(res => {
              if (res.data === "ok") {
                this.$message({
                  type: "success",
                  message: "发货成功!"
                });
                this.$router.push({ path: "/orders" });
                setTimeout(() => {
                  axios.post("http://127.0.0.1:7001/ship", {
                    out_trade_no: this.orderDetail.out_trade_no,
                    status: "已完成"
                  });
                }, 1296000000);
              }
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消发货"
          });
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.app {
  .top {
    width: 50%;
    display: flex;
    align-items: center;
    margin-left: 30px;
    .title {
      .item {
        padding: 10px;
      }
    }
    .content {
      margin-left: 20px;
      .item {
        border-bottom: 1px solid #f9f9f9;
        padding: 10px;
      }
    }
  }

  .goods {
    display: flex;
    align-items: center;
    margin-top: 10px;
    .title {
      margin-left: 40px;
    }
    .payGoods {
      display: flex;
      align-items: center;
      margin-left: 40px;
      margin-top: 10px;
      img {
        width: 100px;
        height: 100px;
      }
      .detail {
        height: 100px;
        margin-left: 30px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        .nameItem {
          color: #bab8bd;
          font-size: 12px;
          margin-top: 5px;
        }
        .num {
          .numItem {
            color: #bab8bd;
            font-size: 12px;
            margin-right: 80px;
          }
        }
      }
    }
  }
}
</style>
