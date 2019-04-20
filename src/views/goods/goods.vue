<template>
  <div>
    <el-row>
      <el-table :data="tableGoods" stripe style="width: 100%">
        <el-table-column align="center" prop="name" label="商品"></el-table-column>
        <el-table-column align="center" prop="price" label="价格"></el-table-column>
        <el-table-column align="center" prop="classifyValue" label="分类"></el-table-column>
        <el-table-column align="center" prop="saleAmount" label="销量"></el-table-column>
        <el-table-column align="center" prop="amount" label="库存"></el-table-column>
        <el-table-column label="操作" align="center" width="300">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-row>

    <el-dialog title="编辑商品" :visible.sync="dialogeditForm">
      <el-form :model="editGoodslist" label-width="120px">
        <el-form-item label="商品名称">
          <el-input v-model="editGoodslist.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item clearable label="副标题">
          <el-input v-model="editGoodslist.subTitle"></el-input>
        </el-form-item>
        <el-form-item clearable label="价格">
          <el-input v-model="editGoodslist.price"></el-input>
        </el-form-item>
        <el-form-item clearable label="原价">
          <el-input v-model="editGoodslist.oldPrice"></el-input>
        </el-form-item>
        <el-form-item clearable label="库存">
          <el-input v-model="editGoodslist.amount"></el-input>
        </el-form-item>
        <el-form-item label="分类">
          <el-select
            multiple
            :multiple-limit="multipleLimit"
            v-model="editGoodslist.classifyValue"
            placeholder="请选择"
          >
            <el-option
              v-for="item in classify"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogeditForm = false">取 消</el-button>
        <el-button type="primary" @click="handleConfirm()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      tableGoods: [],
      dialogeditForm: false,
      editGoodslist: {},
      classify: [
        {
          value: "0",
          label: "热卖"
        },
        {
          value: "1",
          label: "水果"
        },
        {
          value: "2",
          label: "生鲜"
        },
        {
          value: "3",
          label: "速食"
        },
        {
          value: "4",
          label: "日百"
        },
        {
          value: "5",
          label: "生活服务"
        }
      ],
      multipleLimit: 2
    };
  },
  computed: {
    buttonValue(row) {}
  },
  mounted() {
    this.gettableGoods();
  },
  methods: {
    // 编辑商品弹窗
    handleEdit(index, row) {
      this.dialogeditForm = true;
      this.editGoodslist = row;
    },

    // 修改商品信息
    handleConfirm() {
      this.dialogeditForm = false;
      var goodList = this.editGoodslist;
      for (var i = 0; i < goodList.classifyValue.length; i++) {
        if (goodList.classifyValue[i] === "热卖") {
          goodList.classifyValue[i] = "0";
        }
        if (goodList.classifyValue[i] === "水果") {
          goodList.classifyValue[i] = "1";
        }
        if (goodList.classifyValue[i] === "生鲜") {
          goodList.classifyValue[i] = "2";
        }
        if (goodList.classifyValue[i] === "速食") {
          goodList.classifyValue[i] = "3";
        }
        if (goodList.classifyValue[i] === "日百") {
          goodList.classifyValue[i] = "4";
        }
        if (goodList.classifyValue[i] === "生活服务") {
          goodList.classifyValue[i] = "5";
        }
      }

      axios.post("/updateGood", { goodList: goodList }).then(res => {
        if (res.data === "修改商品成功") {
          this.$message({
            type: "success",
            message: "修改商品成功!"
          });
          this.gettableGoods();
        }
      });
    },

    // 删除商品
    handleDelete(index, row) {
      console.log(index, row);
      this.$confirm("此操作不可逆，是否确认删除该商品?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          axios
            .post("/deleteGood", {
              goodsId: row.goodsId
            })
            .then(res => {
              if (res.data === "删除商品成功") {
                this.$message({
                  type: "success",
                  message: "删除商品成功!"
                });
              }
              this.gettableGoods();
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除该商品"
          });
        });
    },

    // 获取商品
    gettableGoods() {
      axios.get("/gettableGoods").then(res => {
        for (var i = 0; i < res.data.length; i++) {
          for (var j = 0; j < res.data[i].classifyValue.length; j++) {
            if (res.data[i].classifyValue[j] === "0") {
              res.data[i].classifyValue[j] = "热卖";
            }
            if (res.data[i].classifyValue[j] === "1") {
              res.data[i].classifyValue[j] = "水果";
            }
            if (res.data[i].classifyValue[j] === "2") {
              res.data[i].classifyValue[j] = "生鲜";
            }
            if (res.data[i].classifyValue[j] === "3") {
              res.data[i].classifyValue[j] = "速食";
            }
            if (res.data[i].classifyValue[j] === "4") {
              res.data[i].classifyValue[j] = "日百";
            }
            if (res.data[i].classifyValue[j] === "5") {
              res.data[i].classifyValue[j] = "生活服务";
            }
          }
        }
        this.tableGoods = res.data;
      });
    }
  }
};
</script>
