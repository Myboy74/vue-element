<template>
    <div class="f_taskManager">
        <div class="headTagLy">
            <h2 class="tag">任务管理</h2>
        </div>
        <div class="ms-articleLy shadowLy">
            <div class="block">
                <label class="label-search">任务状态</label>
                <el-select class="search-input" v-model="searchtesk.state" clearable placeholder="全部">
                    <el-option v-for="item in taskList" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                </el-select>
                <label class="label-search">任务标题</label>
                <el-input v-model="searchtesk.title" class="search-input" placeholder="请输入任务标题"></el-input>
               <div>
                 <label class="label-search">创建时间</label>
                <el-date-picker class="search-input" v-model="searchtesk.createTime" type="daterange" value-format="yyyy-MM-dd"
                  range-separator="至"  placeholder="年/月/日">
                </el-date-picker>

                <label class="label-search">截止日期</label>
                <el-date-picker class="search-input" v-model="searchtesk.endTime" type="daterange" value-format="yyyy-MM-dd"
                  range-separator="至"  placeholder="年/月/日">
                </el-date-picker>
                <el-button type="primary" style="margin-left:5px;padding:10px 26px" @click="searchFn(true)">搜索</el-button>
               </div>
                
            </div>
        </div>
        <div class="ms-articleLy shadowLy">
            <h2 class="titleLy">任务列表</h2>
            <div class="button">
                <input type="button" value="新建" class="f_btn f_green" @click="newTask">
                <input type="button" value="发布" class="f_btn f_deepBlue" @click="batchPublish">
                <!-- <input type="button" value="删除" class="f_btn f_bigRed" @click="deteleBtn"> -->
            </div>
            <div class="clear"></div>
            <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" stripe border @selection-change="handleSelectionChange"
                style="width: 98%;margin:10px auto; border-radius:5px;">
                <!-- :selectable="checkboxInit" -->
                <el-table-column type="selection" width="55">
                </el-table-column>
                <el-table-column type="index" label="序号" width="50">
                </el-table-column>
                <el-table-column prop="taskNum" label="任务编号">
                </el-table-column>
                <el-table-column label="任务标题" title="name" width="160">
                  <template slot-scope="scope">
                      <el-tooltip class="item" effect="dark" :content="scope.row.name" placement="right">
                        <span>{{scope.row.name}}</span>
                      </el-tooltip>
                  </template>
                </el-table-column>
                <el-table-column prop="endDate" label="截止日期" width="100">
                </el-table-column>
                <el-table-column prop="publishNum" label="下发" width="50">
                    <template slot-scope="scope">
                        <p @click="lowerGo(scope.row.id)" style="width:100%;height:100%;cursor: pointer;">
                            {{scope.row.publishNum}}
                        </p>
                    </template>
                </el-table-column>
                <el-table-column prop="receiveNum" label="接收" width="50">
                    <template slot-scope="scope">
                        <p @click="receiveGo(scope.row.id)" style="width:100%;height:100%;cursor: pointer;">
                            {{scope.row.receiveNum}}
                        </p>

                    </template>
                </el-table-column>
                <el-table-column prop="completeNum" label="完成" width="50">
                    <template slot-scope="scope">
                        <p @click="completeGo(scope.row.id)" style="width:100%;height:100%;cursor: pointer;">
                            {{scope.row.completeNum}}
                        </p>

                    </template>
                </el-table-column>
                <el-table-column prop="question" label="答疑" width="50">
                    <template slot-scope="scope">
                        <p @click="taskAnswer(scope.row.id)" style="width:100%;height:100%;cursor: pointer;">
                            <span style="color:red">{{scope.row.answers}}</span>/ <span>{{scope.row.questions}}</span>
                        </p>
                    </template>
                </el-table-column>
                <el-table-column prop="taskDate" label="发布时间" width="100">
                </el-table-column>
                <el-table-column prop="createUser" label="发布人">
                </el-table-column>
                <el-table-column prop="taskState" label="任务状态">
                    <template slot-scope="scope">
                        <div v-if="scope.row.status=='1'">
                            <span :class="{violetState:(scope.row.status=='1')}">已保存(草稿)</span>
                        </div>
                        <div v-if="scope.row.status=='2'">
                            <span :class="{greenState:(scope.row.status=='2')}">已发布</span>
                        </div>
                        <div v-if="scope.row.status=='3'">
                            <span :class="{greyState:(scope.row.status=='3')}">已完成</span>
                        </div>
                        <div v-if="scope.row.status=='4'">
                            <span :class="{redState:(scope.row.status=='4')}">已撤销</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="180">
                    <template slot-scope="scope">
                        <div class="f_box">
                            <el-tooltip class="item" effect="dark" content="发布任务" placement="top">
                              <img v-if="scope.row.status=='1'" src="../../../../static/img/Group145.png" alt=""
                                   @click="receiveSingle(scope.row.id)">
                            </el-tooltip>
                            <el-tooltip class="item" effect="dark" content="编辑" placement="top">
                              <img v-if="scope.row.status=='1'" src="../../../../static/img/Group147.png" alt=""
                                  @click="editTask(scope.row.taskNum,scope.row.id,scope.row.status)">
                            </el-tooltip>
                            <el-tooltip class="item" effect="dark" content="查看详情" placement="top">
                              <img src="../../../../static/img/Group148.png" alt="" @click="taskDetails(scope.row.id)">
                            </el-tooltip>
                            <el-tooltip class="item" effect="dark" content="任务完成" placement="top">
                              <img v-if="scope.row.status=='2'" src="../../../../static/img/Group149.png" alt=""
                                  @click="overTask(scope.row.id)">
                            </el-tooltip>
                            <el-tooltip class="item" effect="dark" content="撤销任务" placement="top">
                              <img v-if="scope.row.status=='2'" src="../../../../static/img/Group151.png" alt=""
                                  @click="revokeTask(scope.row.id)">
                            </el-tooltip>
                            <el-tooltip class="item" effect="dark" content="删除任务" placement="top">
                              <img v-if="scope.row.status=='1'||scope.row.status=='4'" v-show="false" src="../../../../static/img/Group150.png"
                                  alt="">
                            </el-tooltip>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination class="fenyeCenter" 
              @size-change="handleSizeChange" 
              @current-change="handleCurrentChange"
              :current-page.sync="currentPage" 
              :page-size="15" 
              layout="prev, pager, next, jumper" 
              :page-count="totalNum">
            </el-pagination>
        </div>
    </div>
</template>
<script>
import qs from "qs";
import { postAjax, getAjax, uploadImg } from "../../../api/api.js";
export default {
  data() {
    return {
      selectArray: [], //表格选择数组
      taskList: [], //状态列表
      searchtesk: {
        //搜索内容
        state: "",
        title: "",
        createTime: "", //开始时间
        endTime: "" //截止时间
      },
      form: {
        pageNo: 0, //分页
        pageSize: 15, //每页数据行数
        name: "", //标题
        status: "", //状态
        date: "", //开始时间yyyy-mm-dd
        time: "" //结束时间
      }, //默认查询参数的对象
      multipleSelection: [], //表格选择框选择得数组
      currentPage: 1, //当前页
      tableData: [], //表格内容
      routerState: true, //路由新建、编辑状态
      idArray: [], //已选择表格的id数组
      totalNum: 1 //总条目数
    };
  },
  mounted() {
    this.initRaskList(this.form); //初始化任务表格数据
    this.initStateList(); //初始化状态列表；
  },
  methods: {
    // checkboxInit(row, index) {  //复选框的指定禁用
    //   if (row.taskNum=='RW181204023') {

    //     return 0;//不可勾选
    //   } else {
    //     return 1;//可勾选
    //   }
    // },
    initRaskList(fd) {
      //初次加载页面数据
      /*******************************跳转顶部方法start***************************************/
      let contentScrollTop = document.getElementsByClassName("content");
      let scrollTop = contentScrollTop[0].scrollTop;
      if (scrollTop !== 0) {
        document.getElementsByClassName("content")[0].scrollTop = 0;
      }
      /*******************************跳转顶部方法end***************************************/
      let formatData = {
        pageNo: fd.pageNo, //分页
        pageSize: "", //每页数据行数
        name: fd.name, //标题
        status: fd.status, //状态
        date: fd.date, //开始时间yyyy-mm-dd
        time: fd.time, //结束时间
      };
      postAjax("ajax/task/dayTask", qs.stringify(formatData))
        .then(res => {
          if (res.data.state == 1) {
            // console.log(res)
            this.tableData = res.data.data.page.list;
            this.currentPage = res.data.data.page.pageNo; //当前页
            this.totalNum = res.data.data.page.pageCount; //总条目数
          } else {
            this.$message({
              type: "error",
              message: res.data.message
            });
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    initStateList() {
      //初始化状态列表
      let stateType = "taskStatus";
      getAjax("ajax/meeting/taskMeeting/getDict?type=" + stateType).then(
        res => {
          this.taskList = res.data;
          this.taskList.unshift({ value: "", label: "全部" });
        }
      );
    },
    receiveSingle(id) {
      //单条记录发布
      this.$confirm("此操作会将所选任务设置为已发布, 是否继续?", "温馨提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          getAjax("ajax/task/dayTask/issue?id=" + id).then(res => {
            // console.log(res);
            if (res.data.state == 1) {
              this.$message({
                message: res.data.message,
                type: "success"
              });
              this.initRaskList(); //初始化表格数据
            } else {
              this.$message({
                message: res.data.message,
                type: "error"
              });
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消任务发布"
          });
        });
    },
    handleSelectionChange(val) {
      // //表格选框选择的时候
      this.multipleSelection = val;
    },
    batchPublish() {
      //批量发布任务
      for (let i in this.multipleSelection) {
        if (this.multipleSelection[i].status == 1) {
          this.idArray.push(this.multipleSelection[i].id);
        }
      }
      if (this.idArray.length == 0) {
        this.$message({
          message: "请选择一条未发布的任务再进行发布！",
          type: "warning"
        });
        return;
      }
      this.$confirm("此操作会将所选任务设置为已发布, 是否继续?", "温馨提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          postAjax("ajax/task/dayTask/issueMore", this.idArray).then(res => {
            if (res.data.state == 1) {
              this.$message({
                message: res.data.message,
                type: "success"
              });
              this.initRaskList(); //初始化表格数据
            } else {
              this.$message({
                message: res.data.message,
                type: "error"
              });
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消任务发布"
          });
        });
    },
    searchFn(selStatus) {
      let formatData = {
        pageNo: selStatus ? 1 : this.form.pageNo, //分页
        pageSize: this.form.pageSize, //每页数据行数
        name: this.searchtesk.title, //标题
        status: this.searchtesk.state, //状态
        date:
          this.searchtesk.createTime == "" ? [] : this.searchtesk.createTime, //开始时间yyyy-mm-dd
        time: this.searchtesk.endTime == "" ? [] : this.searchtesk.endTime //结束时间
      };
      this.initRaskList(formatData);
    },
    overTask(selId) {
      //完成任务
      this.$confirm("此操作会将所选任务设置为已完成, 是否继续?", "温馨提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          getAjax("ajax/task/dayTask/complete?id=" + selId).then(res => {
            if (res.data.state == 1) {
              this.initRaskList(this.form);
              this.$message({
                message: res.data.message,
                type: "success"
              });
            } else {
              this.$message({
                message: res.data.message,
                type: "error"
              });
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消任务完成"
          });
        });
    },
    revokeTask(selId) {
      //撤销任务
      this.$confirm("此操作会将所选任务设置为已撤销, 是否继续?", "温馨提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          getAjax("ajax/task/dayTask/revoke?id=" + selId).then(res => {
            if (res.data.state == 1) {
              this.initRaskList(this.form);
              this.$message({
                message: res.data.message,
                type: "success"
              });
            } else {
              this.$message({
                message: res.data.message,
                type: "error"
              });
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消任务撤销"
          });
        });
    },
    handleSizeChange(val) {
      this.form.pageSize = val;
      this.searchFn();
    },
    handleCurrentChange(val) {
      this.form.pageNo = val;
      this.searchFn();
    },
    newTask() {
      //新建任务
      this.routerState = false; //改变路由状态值
      this.$router.push({
        name: "f_newTask",
        query: { routeState: this.routerState }
      });
      sessionStorage.setItem("routeState", this.routerState);
    },
    editTask(num, id, state) {
      //编辑任务
      this.routerState = true; //改变路由状态值
      this.$router.push({
        name: "f_newTask",
        query: {
          selId: id,
          routeState: this.routerState,
          taskNum: num,
          status: state
        }
      });
      sessionStorage.setItem("routeState", this.routerState);
    },
    // deteleBtn() {
    //   //删除任务
    //   console.log(this.selectArray);
    // },
    taskAnswer(id) {
      //任务答疑
      // this.$message("功能暂未开放,敬请期待!");
      // return;
      sessionStorage.setItem("detailId", id);
      this.$router.push({
        name: "f_taskAnswer"
      });
    },
    lowerGo(id) {
      //下发数量详情
      this.$router.push({
        name: "f_lowerNumber",
        query: { taskId: id }
      });
    },
    completeGo(id) {
      //完成详情
      this.$router.push({
        name: "f_completeNumber",
        query: { taskId: id }
      });
    },
    receiveGo(id) {
      //接收详情
      this.$router.push({
        name: "f_receiveNumber",
        query: { taskId: id }
      });
    },
    taskDetails(id) {
      //任务详情
      this.$router.push({
        name: "f_taskDetails"
      });
      sessionStorage.setItem("detailId", id);
    }
  }
};
</script>

<style scoped>
.f_taskManager .search-input {
  width: 242px !important;
}
.f_taskManager .el-date-editor--datetimerange {
  width: 241px !important;
}
.label-search {
  text-align: right;
  color: #333;
  font-size: 14px;
  line-height: 40px;
  padding: 10px 0px 0px 10px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
}

.search-input {
  margin: 12px 0px 0px 10px;
}

/*分页样式*/
.fenyeCenter {
  text-align: center;
  margin: 10px auto 0px;
}

.button {
  float: right;
  margin: 10px 7px 0 0;
}

.button input {
  margin-right: 10px;
}

.el-table .cell p {
  width: 100%;
  height: 100%;
  cursor: pointer;
}

.el-table .cell p:hover {
  color: #4a90e2;
}
.box {
  width: 400px;
}
.top {
  text-align: center;
}

.left {
  float: left;
  width: 60px;
}

.right {
  float: right;
  width: 60px;
}

.bottom {
  clear: both;
  text-align: center;
}

.item {
  margin: 4px;
}

.left .el-tooltip__popper,
.right .el-tooltip__popper {
  padding: 8px 10px;
}
</style>
