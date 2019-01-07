<template>
    <div>
        <div class="headTagLy">
            <h2 class="tag" style="width:150px;">得分明细</h2>
            <!-- <div class="orglist-btn" @click="toShape">图形</div> -->
            <div class="orglist-btn" @click="gotoBack">返回</div>
            <div class="clear"></div>
        </div>
        <div class="ms-articleLy shadowLy">
            <div class="titleLy">{{title}}</div>
            <div class="clear"></div>
            <div class="list-content">
                <el-table
                border stripe
              :data="tableData"
              style="width: 100%">
                    <el-table-column
                        prop="num"
                        label="序号"
                       >
                    </el-table-column>
                    <el-table-column
                        prop="taskNum"
                        label="任务编号"
                        width="120">
                    </el-table-column>
                    <el-table-column
                        prop="taskName"
                        label="任务标题" width="390">
                    </el-table-column>
                    <el-table-column
                        prop="timeScore"
                        label="时效分">
                    </el-table-column>
                    <el-table-column
                        prop="qualityScore"
                        label="质量分">
                    </el-table-column>
                    <el-table-column
                        prop="adjustScore"
                        label="调度分">
                    </el-table-column>
                    <el-table-column
                        prop="score"
                        label="总分">
                    </el-table-column>
                </el-table>
            </div>
            <div class="clear"></div>
        </div>
    </div>
</template>
<script>
import { postAjax, getAjax } from "../../../api/api.js";
export default {
  created() {
      console.log(this.uid);
    this.autoMove();
  },
  data() {
    return {
        uid:this.$route.query.uid,
        title:"",
        // id:"",
        tableData: [
        // {
        //   detailNum: "1", //序号
        //   taskNum: "XS233233", //任务编号
        //   taskTitle: "关于省属企业开展党纪法规和德兼只是学习测试的补充知识", //任务标题
        //   timeScore: "168", //时效分
        //   qualityScore: "2557", //质量分
        //   dispatchScore: "0", //调度分
        //   totalScore: "37311" //总分
        // },
       
      ]
    };
  },
  methods: {
    gotoBack() {
      this.$router.go(-1);
    },
    autoMove() {
      getAjax("statisticAnalysis/statistic/statisticTaskScore?id=" + this.uid)
        .then(res => {
          // console.log(res);
          this.title=res.data.data.shortName;
          // this.id=res.data.data.id;
          this.tableData=res.data.data.tableData;
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
};
</script>

<style scoped>
.orglist-btn {
  width: 28px;
  height: 26px;
   font-size: 14px;
  border-radius: 5px;
  background-color: #cccccc;
  color: #353639;
  float: right;
  padding: 0px 10px 0px 10px;
  margin: 8px 10px 0px 0px;
  cursor: pointer;
}
.orglist-btn:hover {
  background-color: #e91b1b;
  color: #fff;
  cursor: pointer;
}
.orglist-btn.active {
  width: 28px;
  height: 26px;
  font-size: 14px;
  border-radius: 5px;
  background-color: #e91b1b;
  color: #fff;
  float: right;
  padding: 0px 10px 0px 10px;
  margin: 8px 10px 0px 0px;
  cursor: pointer;
}
.green-article {
  border: #3cc56d 1px solid;
  background-color: rgb(233, 247, 238);
}
.orange-article {
  border: #f9bf2c 1px solid;
  background-color: rgb(245, 239, 224);
}
.list-content {
  float: left;
  margin: 4px 0px 0px 20px;
  width: 85%;
  padding-bottom: 5px;
}
/* table的公共样式 */
.has-gutter {
  height: 25px;
}
.el-table th,
.el-table tr > th {
  background: #ececec;
}
.el-table {
  position: relative;
  overflow: hidden;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  -webkit-box-flex: 1;
  -ms-flex: 1;
  flex: 1;
  width: 100%;
  max-width: 100%;
  font-size: 14px;
  color: #606266;
  border: solid 1px #ececec;
  border-radius: 5px;
  /* border: #ccc solid 1px; */
}
</style>