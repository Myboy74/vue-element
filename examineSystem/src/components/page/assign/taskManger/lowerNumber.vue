<template>
    <div>
         <div class="headTagLy">
            <h2 class="tag">下发数量</h2>
        </div>
        <div class="ms-articleLy shadowLy" style="overflow:hidden;">
        <el-table
          :data="tableData"
          stripe
          border
          style="width: 60%;margin:20px; border-radius:5px;">
            <el-table-column
              prop="name"
              label="下发单位名称"
              >
            </el-table-column>
            <el-table-column
              prop="status"
              label="是否接收">
                <template slot-scope="scope">
                    <span v-if="scope.row.status" class="greenState">已接收</span>
                    <span v-else class="redState">未接收</span>         
                </template>
              </el-table-column>
            <el-table-column
              prop="createTime"
              label="接收时间">
              <template slot-scope="scope">
                    <span v-if="scope.row.createTime">{{scope.row.createTime}}</span>
                    <span v-else>--</span>         
                </template>
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
  data() {
    return {
      taskId:this.$route.query.taskId,
      tableData: []  
    };
  },
  mounted(){
    if(this.taskId){
       this.autoMove(this.taskId);
    }
  },
  methods: {
    returnTop() {
      //返回
      window.history.back(-1);
    },
    autoMove(id) {
      getAjax("ajax/task/taskDetail/detailnum?id=" + id)
        .then(res => {
          // console.log(res);
          this.tableData = res.data.data
        }).catch(err => {
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
