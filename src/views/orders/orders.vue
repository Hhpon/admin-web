<template>
  <div>
    <el-row>
      <el-table :data="orders" stripe style="width: 100%;">
        <el-table-column align="center" prop="out_trade_no" label="订单号"></el-table-column>
        <el-table-column align="center" prop="address.userName" label="收件人"></el-table-column>
        <el-table-column align="center" prop="address.telNumber" label="联系电话"></el-table-column>
        <el-table-column align="center" prop="address.addressDetail" label="收货地址"></el-table-column>
        <el-table-column align="center" prop="total_fee" label="订单金额"></el-table-column>
        <el-table-column align="center" prop="status" label="订单状态"></el-table-column>
        <el-table-column label="操作" align="center" width="300">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleDetail(scope.$index, scope.row)">订单详情</el-button>
            <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-row>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      orders: []
    };
  },
  mounted() {
    this.getOrders();
  },
  methods: {
    handleEdit(index, row) {
      console.log(index, row);
    },
    handleDetail(index, row) {
      this.$router.push({
        name: "OrderDetail",
        params: { orderDetail: row }
      });
    },
    handleDelete(index, row) {
      console.log(index, row);
      if (
        row.status === "待付款" ||
        row.status === "待收货" ||
        row.status === "待发货" ||
        row.status === "退款中"
      ) {
        this.$message({
          type: "success",
          message: "订单进行中，不可删除!"
        });
      } else {
        this.$confirm("此操作不可逆，是否确认删除订单?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            axios
              .post("https://home.hhp.im/deleteOrders", {
                out_trade_no: row.out_trade_no
              })
              .then(res => {
                if (res.data === "删除订单成功") {
                  this.$message({
                    type: "success",
                    message: "删除订单成功!"
                  });
                  // location.reload();
                  this.getOrders();
                }
              });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消删除订单"
            });
          });
      }
    },
    getOrders() {
      axios.get("https://home.hhp.im/getOrder").then(res => {
        let refundOrder = [];
        let othersOrder = [];
        for (var i = 0; i < res.data.length; i++) {
          if (res.data[i].status === "退款中") {
            refundOrder.unshift(res.data[i]);
          } else {
            othersOrder.unshift(res.data[i]);
          }
        }
        this.orders = refundOrder.concat(othersOrder);
      });
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
