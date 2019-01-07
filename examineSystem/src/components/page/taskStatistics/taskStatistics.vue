<template>
<div>
   <div class="headTagLy" style="float:left">
      <h2 class="tag" style="width:150px;">任务信息统计</h2>
      <div class="orglist-btn" @click="toShape">图形</div>
      <div class="orglist-btn active">列表</div>
    </div>
    <div>
        <div class="ms-articleLy shadowLy">
            <div class="titleLy">任务统计列表</div>
            <div class="clear"></div>
            <div class="list-content">
                <table class="list-table" style="border-radius:5px;">
                    <tr class="thead">
                        <td class="thead-row" rowspan="2">发布任务总数</td>
                        <td class="thead-row" colspan="2">任务类型</td>
                        <td class="thead-row" colspan="4">任务状态</td>
                    </tr>
                    <tr class="thead">
                        <td class="thead-row">普通任务</td>
                        <td class="thead-row">会议调度</td>
                        <td class="thead-row">草稿</td>
                        <td class="thead-row">任务进行中</td>
                        <td class="thead-row">已完成</td>
                        <td class="thead-row">已撤销</td>
                    </tr>
                    <template>
                        <tr class="item-row">
                            <td class="item-row-td">{{tableData.publshiTotal==""?0:tableData.publshiTotal}}</td>
                            <td class="item-row-td">{{tableData.ordinaryTask==""?0:tableData.ordinaryTask}}</td>
                            <td class="item-row-td">{{tableData.mettingDispatch==""?0:tableData.mettingDispatch}}</td>
                            <td class="item-row-td">{{tableData.draft==""?0:tableData.draft}}</td>
                            <td class="item-row-td">{{tableData.progressTask==""?0:tableData.progressTask}}</td>
                            <td class="item-row-td">{{tableData.completed==""?0:tableData.completed}}</td>
                            <td class="item-row-td">{{tableData.closed==""?0:tableData.closed}}</td>
                        </tr>
                    </template>
                </table>
            </div>
            <div class="clear"></div>
            <div class="list-content">
                <table class="list-table" style="border-radius:5px;">
                    <tr class="thead">
                        <td class="thead-row" rowspan="2">接收任务总数</td>
                        <td class="thead-row" colspan="2">任务类型</td>
                        <td class="thead-row" colspan="4">任务状态</td>
                    </tr>
                    <tr class="thead">
                        <td class="thead-row">普通任务</td>
                        <td class="thead-row">会议调度</td>
                        <td class="thead-row">待办理</td>
                        <td class="thead-row">已办理</td>
                        <td class="thead-row">已完成</td>
                        <td class="thead-row">已撤销</td>
                    </tr>
                    <template>
                        <tr class="item-row">
                            <td class="item-row-td">{{receiveData.receiveTotal==""?0:receiveData.receiveTotal}}</td>
                            <td class="item-row-td">{{receiveData.ordinaryTask==""?0:receiveData.ordinaryTask}}</td>
                            <td class="item-row-td">{{receiveData.mettingDispatch==""?0:receiveData.mettingDispatch}}</td>
                            <td class="item-row-td">{{receiveData.draft==""?0:receiveData.draft}}</td>
                            <td class="item-row-td">{{receiveData.progressTask==""?0:receiveData.progressTask}}</td>
                            <td class="item-row-td">{{receiveData.completed==""?0:receiveData.completed}}</td>
                            <td class="item-row-td">{{receiveData.closed==""?0:receiveData.closed}}</td>
                        </tr>
                    </template>
                </table>
            </div>
            <div class="clear"></div>
        </div>
    </div>
</div>
    
</template>
<script>
import { postAjax, getAjax } from "../../../api/api.js";
export default {
  created() {
    this.autoMove();
  },
  data() {
    return {
      //发布任务表
      tableData: {
        // publshiTotal: "10",         //发布任务总数
        // ordinaryTask: "100", //普通任务
        // mettingDispatch: "100", //会议调度
        // draft:"10",            //草稿
        // progressTask:"50",     //任务进行中
        // completed:"40",        //已完成
        // closed:"10"            //已关闭
      },
      //接收任务表
      receiveData: {
        // id:1,
        // receiveTotal: "10",         //接收任务总数
        // ordinaryTask: "100", //普通任务
        // mettingDispatch: "100", //会议调度
        // draft:"10",            //草稿
        // progressTask:"50",     //任务进行中
        // completed:"40",        //已完成
        // closed:"10"            //已关闭
      }
    };
  },
  methods: {
    toShape() {
      this.$router.push({ path: "/taskShape" });
    },
    autoMove() {
      let id=sessionStorage.getItem("userWordId");
      getAjax("statisticAnalysis/statistic/statisticTaskTable?id=" + id)
        .then(res => {
          let date = res.data.data;
          // console.log(res.data.data);
          date.forEach(element => {
            if (element.type == 1) {
              //  console.log("发布统计，")
              this.tableData = {
                publshiTotal: element.issueTaskSum, //发布任务总数
                ordinaryTask: element.commonTaskNum, //普通任务
                mettingDispatch: element.meetingNum, //会议调度
                draft: element.draftNum, //草稿
                progressTask: element.goingNum, //任务进行中
                completed: element.finalNum, //已完成
                closed: element.closeNum //已关闭
              };
              console.log(this.tableData);
            } else if (element.type == 2) {
              // console.log("接收统计")
              this.receiveData = {
                //接收任务表
                receiveTotal: element.issueTaskSum, //接收任务总数
                ordinaryTask: element.commonTaskNum, //普通任务
                mettingDispatch: element.meetingNum, //会议调度
                draft: element.draftNum, //草稿
                progressTask: element.goingNum, //任务进行中
                completed: element.finalNum, //已完成
                closed: element.closeNum //已关闭
              };
            }
          });
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
  line-height: 26px;
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
  background-color: #e91b1b;
  color: #fff;
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
  border-radius: 5px;
  margin: 4px 0px 0px 20px;
  width: 85%;
  padding-bottom: 5px;
}
.list-table {
  border: #ffffff solid 2px;
  border-radius: 5px;
  width: 100%;
}
.thead > tr,
td {
  border: #ffffff solid 2px;
}
.thead {
  text-align: center;
}
.thead-row {
  font-size: 14px;
  background: #ececec;
  margin-top: 2px;
  padding: 10px;
  margin-left: 0.5%;
}
.item-row-td {
  padding: 10px;
  text-align: center;
  font-size: 14px;
  border-left: #ececec solid 1px;
  border-right: #ececec solid 1px;
  border-bottom: #ececec solid 1px;
  color:#7d7878;
}
.thead-span-height {
  height: 74px;
  line-height: 74px;
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