<template>
  <el-form ref="form" :model="goodsList" label-width="150px">
    <el-form-item clearable required label="商品名称/规格">
      <el-input v-model="goodsList.name"></el-input>
    </el-form-item>
    <el-form-item clearable required label="副标题">
      <el-input v-model="goodsList.subTitle"></el-input>
    </el-form-item>
    <el-form-item clearable required label="价格">
      <el-input v-model="goodsList.price"></el-input>
    </el-form-item>
    <el-form-item clearable required label="原价">
      <el-input v-model="goodsList.oldPrice"></el-input>
    </el-form-item>
    <el-form-item clearable required label="库存">
      <el-input v-model="goodsList.amount"></el-input>
    </el-form-item>
    <el-form-item required label="分类">
      <el-select
        multiple
        :multiple-limit="multipleLimit"
        v-model="goodsList.classifyValue"
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
    <el-form-item label="是否为轮播图">
      <el-switch v-model="goodsList.sliderView" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
    </el-form-item>
    <el-form-item v-if="goodsList.sliderView" required label="上传轮播图">
      <el-upload
        action="http://up-z1.qiniup.com"
        :data="uploadForm"
        list-type="picture-card"
        :before-upload="beforeUpload"
        :on-success="handleSlider"
        :limit="titleLimit"
        :on-exceed="onExceed"
      >
        <i class="el-icon-plus"></i>
      </el-upload>
      <el-row class="sliderNote">（轮播图只能显示最近上传的三个商品！！！）</el-row>
    </el-form-item>
    <el-form-item required label="上传头图">
      <el-upload
        action="http://up-z1.qiniup.com"
        :data="uploadForm"
        list-type="picture-card"
        :before-upload="beforeUpload"
        :on-success="handleTitle"
        :limit="titleLimit"
        :on-exceed="onExceed"
      >
        <i class="el-icon-plus"></i>
      </el-upload>
    </el-form-item>
    <el-form-item required label="上传详情图">
      <el-upload
        action="http://up-z1.qiniup.com"
        :data="uploadForm"
        list-type="picture-card"
        :before-upload="beforeUpload"
        :on-success="handleDetails"
      >
        <i class="el-icon-plus"></i>
      </el-upload>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmit">立即创建</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import axios from "axios";
export default {
  inject: ["reload"],
  data() {
    return {
      goodsList: {
        name: "",
        subTitle: "",
        price: "",
        oldPrice: "",
        amount: "",
        classifyValue: [],
        sliderUrl: "",
        titleUrl: "",
        detailsUrl: [],
        sliderView: false
      },
      uploadForm: {
        token: "",
        key: null
      },
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
      multipleLimit: 2,
      titleLimit: 1
    };
  },
  mounted() {
    //计算本地的token是否可用
    if (!localStorage.token) {
      this.getToken();
      console.log("本地不存在 token");
    } else {
      const timeNow = new Date().getTime();
      const timegap = timeNow - localStorage.timeNow;
      if (timegap > 3600000) {
        this.getToken();
        console.log("本地 token 超时了");
      } else {
        console.log("本地 token 可以使用！");
      }
    }
  },
  methods: {
    // 在上传文件之前设置上传文件的名字已经上传文件所需的 token
    beforeUpload(file) {
      this.uploadForm.key = file.name;
      this.uploadForm.token = localStorage.token;
    },
    // 上传商品信息
    onSubmit() {
      axios.post("/uploadMes", { goodsList: this.goodsList }).then(res => {
        if (res.data === "ok") {
          alert("上传成功！");
          location.reload();
        }
      });
    },
    // 向服务器请求 token
    getToken() {
      axios.get("/gettoken").then(res => {
        const timeNow = new Date().getTime();
        localStorage.token = res.data;
        localStorage.timeNow = timeNow;
      });
    },
    onExceed() {
      alert("头图只能上传一张哦！");
    },
    // 上传图片成功以后获取图片的 url
    handleTitle(response, file, fileList) {
      const titleUrl = "https://cdn.hhp.im/" + response.key;
      this.goodsList.titleUrl = titleUrl;
    },
    handleDetails(response, file, fileList) {
      var detailsUrl = "https://cdn.hhp.im/" + response.key;
      this.goodsList.detailsUrl.push(detailsUrl);
    },
    handleSlider(response, file, fileList) {
      var sliderUrl = "https://cdn.hhp.im/" + response.key;
      this.goodsList.sliderUrl = sliderUrl;
    }
  }
};
</script>
<style lang="scss" scoped>
.sliderNote {
  font-size: 13px;
  font-style: italic;
  color: #ccc;
}
</style>

