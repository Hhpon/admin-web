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
          <el-button v-show="shipBtn" type="danger" size="mini" @click="ship()">发货</el-button>
          <el-button v-show="refundBtn" type="danger" size="mini" @click="refund()">同意退款</el-button>
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
      shipBtn: false,
      refundBtn: false
    };
  },
  mounted() {
    this.getOrderDetail();
  },
  methods: {
    getOrderDetail() {
      this.orderDetail = this.$route.params.orderDetail;
      console.log(this.orderDetail);
      if (this.orderDetail.status === "待发货") {
        this.shipBtn = true;
        this.refundBtn = false;
      } else if (this.orderDetail.status === "退款中") {
        this.shipBtn = false;
        this.refundBtn = true;
      } else {
        this.shipBtn = false;
        this.refundBtn = false;
      }
    },
    // 发货
    ship() {
      this.$confirm("是否确认发货?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          axios
            .post("https://home.hhp.im/changeStatus", {
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
                  axios.post("https://home.hhp.im/changeStatus", {
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
    },

    // 退款
    refund() {
      this.$confirm("是否确认同意退款?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          // 根据下单时间设置商户退款单号
          let myDate = new Date();
          let year = myDate.getFullYear().toString();
          let month =
            (myDate.getMonth() + 1).toString().length === 1
              ? "0" + (myDate.getMonth() + 1).toString()
              : (myDate.getMonth() + 1).toString();
          let date =
            myDate.getDate().toString().length === 1
              ? "0" + myDate.getDate().toString()
              : myDate.getDate().toString();
          let time = myDate.getTime().toString();
          let out_refund_no = "re" + year + month + date + time;

          axios
            .post("https://home.hhp.im/refund", {
              openId: this.orderDetail.openId,
              appid: "wx083cd7624c4db2ec",
              mch_id: "1513854421",
              out_trade_no: this.orderDetail.out_trade_no,
              out_refund_no: out_refund_no,
              total_fee: this.orderDetail.total_fee * 100,
              refund_fee: this.orderDetail.total_fee * 100
            })
            .then(res => {
              console.log(res.data);
              // 退款失败弹出警告提示失败原因
              if (res.data.split("result_code")[1].slice(10, -5) === "FAIL") {
                let err = res.data.split("err_code_des")[1].slice(10, -5);
                this.$message.error(err);
              } else if (
                // 退款成功
                res.data.split("result_code")[1].slice(10, -5) === "SUCCESS"
              ) {
                this.$message({
                  type: "success",
                  message: "退款成功!"
                });
                axios.post("https://home.hhp.im/changeStatus", {
                  out_trade_no: this.orderDetail.out_trade_no,
                  status: "退款成功"
                });
                this.$router.push({ path: "/orders" });
              }
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消退款"
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
