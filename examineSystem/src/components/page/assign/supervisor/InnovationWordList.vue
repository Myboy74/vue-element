<template>
    <div class="f_taskManager">
        <div class="headTagLy">
            <h2 class="tag">创新工作管理</h2>
        </div>
        <div class="ms-articleLy shadowLy">
             <label class="label-search">状态</label>
                <el-select class="search-input" v-model="form.zt" clearable placeholder="全部" style="width:180px">
                    <el-option v-for="item in taskList" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                </el-select>
            <label class="label-search">发表单位</label>
            <el-input v-model="form.fbname" class="search-input" placeholder="请输入发表单位"></el-input>
           <label class="label-search" style="padding-right:5px">发表时间</label>
            <el-date-picker
                v-model="form.time"
                type="daterange"
                 placeholder="年/月/日"
                 value-format="yyyy-MM-dd"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
                </el-date-picker>
            <el-button type="primary" style="margin-left:5px;" @click="searchFn">搜索</el-button>
       
        </div>
        <div class="ms-articleLy shadowLy">
            <h2 class="titleLy">任务列表</h2>
            <!-- <div class="button">
                <input type="button" value="新建" class="f_btn f_green" @click="newTask">
            </div> -->
            <div class="clear"></div>
            <el-table ref="multipleTable"
                :data="tableData"  stripe border
                style="width: 98%;margin:0 auto; border-radius:5px;">
                <el-table-column type="index" label="序号" width="80"></el-table-column>
                <el-table-column label="任务名称">
                  <template slot-scope="scope">
                      <el-tooltip class="item" effect="dark" :content="scope.row.rwmc" placement="right">
                       <span>{{scope.row.rwmc}}</span>
                      </el-tooltip>
                  </template>
                </el-table-column>
                 <el-table-column prop="fbname" label="发表单位">
                </el-table-column>
                <el-table-column prop="fbrname" label="申请人">
                </el-table-column>
                <el-table-column prop="fbsj" label="发表时间">
                </el-table-column>
                <el-table-column label="状态">
                    <template slot-scope="scope">
                        <span v-if="scope.row.zt==0" :class="{redState:(scope.row.zt==0)}">
                          未审核
                        </span>
                        <span v-if="scope.row.zt==1" :class="{greenState:(scope.row.zt==1)}">
                            已通过 
                        </span>
                        <span v-if="scope.row.zt==2">
                            未通过 
                        </span>
                    </template>
                </el-table-column>
                <el-table-column prop="khfz" label="分值">
                </el-table-column>
                <el-table-column label="操作" width="80">
                    <template slot-scope="scope">
                        <div class="f_box">
                            <!-- <el-tooltip class="item" effect="dark" content="发布任务" placement="top">
                                <img v-if="scope.row.status=='1'" src="../../../../../static/img/Group145.png" alt=""
                                    @click="receiveSingle()">
                            </el-tooltip>
                            <el-tooltip class="item" effect="dark" content="编辑" placement="top">
                                <img v-if="scope.row.status=='1'" src="../../../../../static/img/Group147.png" alt=""
                                    @click="editTask()">
                            </el-tooltip> -->
                            <el-tooltip class="item" effect="dark" content="查看详情" placement="top">
                                <img src="../../../../../static/img/Group148.png" alt="" @click="taskDetails(scope.row.id)">
                            </el-tooltip>
                            <!-- <el-tooltip class="item" effect="dark" content="任务完成" placement="top">
                                <img v-if="scope.row.status=='2'" src="../../../../../static/img/Group149.png" alt=""
                                    @click="overTask()">
                            </el-tooltip>
                            <el-tooltip class="item" effect="dark" content="撤销任务" placement="top">
                                <img v-if="scope.row.status=='2'" src="../../../../../static/img/Group151.png" alt=""
                                    @click="revokeTask()">
                            </el-tooltip>
                            <el-tooltip class="item" effect="dark" content="删除任务" placement="top">
                                <img v-if="scope.row.status=='1'||scope.row.status=='4'" v-show="false" src="../../../../../static/img/Group150.png"
                                    alt="">
                            </el-tooltip> -->
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
              :total="totalNum">
            </el-pagination>
        </div>
    </div>
</template>
<script>
import qs from "qs";
import { postAjax, getAjax, uploadImg } from "../../../../api/api.js";
export default {
  data() {
    return {
      selectArray: [], //表格选择数组
      taskList: [], //状态列表
      value: "", //发表时间
      form: {
        zt: "", //状态值 0、未审核 1、已通过 2、未通过
        fbname: "", //发表单位
        time: "", //发表时间
        pageNo: "1", //分页
        pageSize: 15 //每页数据行数
      }, //默认查询参数的对象
      tableData: [], //表格内容
      routerState: true, //路由新建、编辑状态
      currentPage: 1, // //当前页
      totalNum: 1 //总条目数
    };
  },
  mounted() {
    this.autoWord();
    this.autoMove(this.form);
  },
  methods: {
    autoWord() {
      //状态
      let opType = "cxgz_status";
      postAjax("ajax/meeting/taskMeeting/getDict?type=" + opType).then(res => {
        this.taskList= res.data;
        this.taskList.unshift({
          value:"",label:"全部"
        })
      });
    },
    autoMove(date) {
      let obj = qs.stringify(date);
      postAjax("ajax/cxgzrw/cxgzrw/cxsh", obj).then(res => {
        if (res.data.state == 1) {
        //   console.log(res.data.data.page);
          this.tableData = res.data.data.page.list; //表格内容
          this.currentPage = res.data.data.page.pageNo; //当前页
          this.totalNum = res.data.data.page.count; //总条目数
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    searchFn() {
      //顶部查询按钮
        // console.log(this.form);
      this.autoMove(this.form);
    },
    taskDetails(id){ //查看详情
        // console.log(id);
        this.$router.push({
            name:"f_InnovationDetails",
            query:{
                id:id
            }
        })

    },
    handleSizeChange(val) {
      //当前页数发生变化时
      this.form.pageSize = val;
      this.autoMove(this.form);
    },
    handleCurrentChange(val) {
      //当前页发生变化时
      this.form.pageNo = val;
      this.autoMove(this.form);
    }
  }
};
</script>

<style scoped>
.f_taskManager .search-input {
  width: 200px !important;
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
  /* display: inline; */
}

.search-input {
  /* display: inline-block; */
  margin: 12px 0px 0px 10px;
}

/*分页样式*/
.fenyeCenter {
  text-align: center;
  margin: 10px auto 0px;
}

.button {
  float: right;
  margin: 7px 7px 0 0;
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
