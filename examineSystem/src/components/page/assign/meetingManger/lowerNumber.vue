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
              prop="officeName"
              label="下发单位名称"
              >
            </el-table-column>
            <el-table-column
              prop="status"
              label="是否接收">
                <template slot-scope="scope">
                    <span v-if="scope.row.status==1" class="redState" >未接收</span> 
                    <span v-else class="greenState">已接收</span>         
                </template>
              </el-table-column>
            <el-table-column
              prop="receiveTime"
              label="接收时间">
              <template slot-scope="scope">
                    <span v-if="scope.row.receiveTime==undefined">--</span> 
                    <span v-else>{{scope.row.receiveTime}}</span>         
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
      id: this.$route.query.id,
      tableData: []  
    };
  },
  created() {
  },
  mounted(){
    this.autoMove(this.$route.query.id);
  },
  methods: {
    returnTop() {
      //返回
      window.history.back(-1);
    },
    autoMove(id) {
      getAjax("ajax/meeting/taskReceivemeeting/issuenumOrgDetail?meetingid=" + id)
        .then(res => {
          this.tableData = res.data
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
