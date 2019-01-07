<template>
    <div>
         <div class="headTagLy">
            <h2 class="tag">完成数量</h2>
        </div>
        <div class="ms-articleLy shadowLy" style="overflow:hidden;">
        <el-table
          :data="tableData"
          stripe
          border
          style="width: 60%;margin:20px; border-radius:5px;">
            <el-table-column type="index" label="序号" width="50">
            </el-table-column>
            <el-table-column
              prop="officeName"
              label="已完成单位名称"
            >
            </el-table-column>
            <el-table-column
              prop="updateDate"
              label="完成时间">
            </el-table-column>
        </el-table> 
        <button class="f_btn" style="margin-left:20px;color:#000;" @click="returnTop">返回</button>
    </div>     
  </div>
</template>

<script>
import qs from "qs";
import { postAjax, getAjax, uploadImg } from "../../../../api/api.js";
export default {
  created() {
    this.autoMove(this.id);
  },
  data() {
    return {
      id: this.$route.query.id,
      tableData: []
    };
  },
  methods: {
    returnTop() {
      //返回
      window.history.back(-1);
    },
    autoMove(id) {
      postAjax(
        "ajax/meeting/taskReceivemeeting/finalOrgDetail?meetingid=" + id
      )
        .then(res => {
          // console.log(res);
          this.tableData = res.data.data.list;
        })
        .catch(err => {
          this.$message({
            showClose: true,
            message: "信息获取失败",
            type: "error"
          });
          window.history.back(-1);
        });
    }
  }
};
</script>

<style>
</style>
