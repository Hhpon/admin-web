<template>
  <div>
    <el-row>
      <el-table :data="tableGoods" stripe style="width: 100%">
        <el-table-column align="center" prop="name" label="商品"></el-table-column>
        <el-table-column align="center" prop="price" label="价格"></el-table-column>
        <el-table-column align="center" prop="classifyValue" label="分类"></el-table-column>
        <el-table-column align="center" prop="sliderView" label="轮播"></el-table-column>
        <el-table-column align="center" prop="saleAmount" label="销量"></el-table-column>
        <el-table-column align="center" prop="amount" label="库存"></el-table-column>
        <el-table-column label="操作" align="center" width="300">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
            <!-- <el-button
              size="mini"
            @click="handleDelete(scope.$index, scope.row)">{{buttonValue}}</el-button>-->
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
        <el-button type="primary" @click="dialogeditForm = false">确 定</el-button>
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
          value: "1",
          label: "热卖"
        },
        {
          value: "2",
          label: "水果"
        },
        {
          value: "3",
          label: "生鲜"
        },
        {
          value: "4",
          label: "速食"
        },
        {
          value: "5",
          label: "日百"
        },
        {
          value: "6",
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
    handleEdit(index, row) {
      console.log(index, row);
      this.dialogeditForm = true;
      this.editGoodslist = row;
    },
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
              goodsId: row.goodsId,
              sliderView: row.sliderView
            })
            .then(res => {
              console.log(res);
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
    gettableGoods() {
      axios.get("/gettableGoods").then(res => {
        console.log(res);
        this.tableGoods = res.data;
      });
    }
  }
};
</script>
