<template>
    <div>
        <div class="headTagLy">
            <h2 class="tag">任务办理</h2>
        </div>
        <div class="ms-articleLy shadowLy">
            <div class="block">
            <label class="label-search" >任务状态</label>
            <el-select class="search-input" v-model="form.status" clearable placeholder="全部">
                <el-option
                        v-for="(item,index) in optionsDuty"
                        :key="index"
                        :label="item.label"
                        :value="item.value">
                </el-option>
            </el-select>
            <label class="label-search" >任务标题/编号</label>
              <el-input class="search-input"  v-model="form.nameOrNum"  placeholder="请输入任务编号"></el-input>
            <label class="label-search" >接收时间</label>
            <el-date-picker
                    class="search-input"
                    v-model="form.receiveDate"
                    type="date"
                    value-format="yyyy-MM-dd"
                    placeholder="年/月/日">
            </el-date-picker>
            <label class="label-search" >截止日期</label>
            <el-date-picker
                    class="search-input"
                    v-model="form.deadline"
                    type="date"
                    value-format="yyyy-MM-dd"
                    placeholder="年/月/日">
            </el-date-picker>
            <el-button type="primary" @click="search" style="padding:10px 26px;margin-left:10px">搜索</el-button>
        </div>
      </div>
      <div class="ms-articleLy shadowLy">
          <h2 class="titleLy">任务列表</h2>
          <div class="clear"></div>
          <div class="table-content">
            <el-table
              :data="tableData"
              border stripe
              style="width: 100%">
              <el-table-column
                label="序号"
                type="index"
                width="35"
               >
              </el-table-column>
              <el-table-column
                prop="taskNum"
                label="任务编号"
               
                >
              </el-table-column>
              <el-table-column
                prop="name"
                label="任务标题"
                >
                <template slot-scope="scope">
                  <el-tooltip class="item" effect="dark" :content="scope.row.name" placement="right">
                    <span>{{scope.row.name}}</span>
                  </el-tooltip>
                </template>
              </el-table-column>
              <el-table-column
                prop="endDate"
                label="任务截止日期"
               >
              </el-table-column>
              <el-table-column
                prop="createTime"
                label="发布日期"
               >
              </el-table-column>
              <el-table-column
                prop="createUser"
                label="发布人"
                >
              </el-table-column>
              <el-table-column
                label="任务状态">
                <template slot-scope="scope">
                  <!-- 0.未签收 1.已签收 2.已提交 3.已审核  4.已撤销-->
                  <div v-if="scope.row.status==0">
                    <span class="orangeState">待接收</span>
                  </div>
                  <div v-else-if="scope.row.status==1">
                    <span class="orangeState">待办理</span>
                  </div>
                  <div v-else-if="scope.row.status==1.1">
                    <span class="blueState">抄送</span>
                  </div> 
                  <div v-else-if="scope.row.status==2">
                    <span class="greenState">已办理</span>
                  </div>
                  <div v-else-if="scope.row.status==3">
                    <span class="greenState">已审核</span>
                  </div>
                  <div v-else-if="scope.row.status==4">
                    <span class="greyState">已撤销</span>
                  </div>
                  <div v-else-if="scope.row.status==5">
                    <span class="blueState">已完成</span>
                  </div>   
                </template>
              </el-table-column>
              <el-table-column
                label="时效"
                sortable>
                <template slot-scope="scope">
                  {{scope.row.rtimescore ? scope.row.rtimescore : 0}}/{{scope.row.timeScore}}
                </template>
              </el-table-column>
              <el-table-column
                label="质量"
               sortable>
                <template slot-scope="scope">
                  {{scope.row.rqualityscore ? scope.row.rqualityscore :  0}}/{{scope.row.qualityScore}}
                </template>
              </el-table-column>
              <!-- <el-table-column
                prop="dispatch"
                label="调度评分">
              </el-table-column> -->
              <el-table-column
                label="总分"
                sortable>
                <template slot-scope="scope">
                  {{scope.row.rscore ? scope.row.rscore : 0}}/{{scope.row.score}}
                </template>
              </el-table-column>
              <el-table-column
                label="操作"
                >
                <template slot-scope="scope">
                  <div class="f_box">
                          <!-- 0.未签收 1.已签收 2.已提交 3.已审核  4.已撤销-->
                    <div v-if="scope.row.status==0"> 
                      <!-- //待接受状态  可查看 -->
                      <el-tooltip class="item" effect="dark" content="接收任务" placement="top">
                         <!-- style="color:#4A90e2; font-size:21px; margin-top:0px; margin-right:2px; font-weight:bold; cursor:pointer;" -->
                       <img src="../../../../static/img/jieshou_btn.png" alt="" @click="acceptFn(scope.row.taskId)">
                      </el-tooltip>
                    </div>
                    <div>
                      <el-tooltip class="item" effect="dark" content="任务详情" placement="top">
                        <img src="../../../../static/img/Group148.png" alt="" @click="taskHandle(scope.row.taskId)">
                      </el-tooltip>
                    </div>
                  <!-- <div v-if="scope.row.status!=3 && scope.row.status!=4 && scope.row.status!=5 && scope.row.status!=1.1"> -->
                 <div>
                  <el-tooltip class="item" effect="dark" content="任务答疑" placement="top">
                      <img src="../../../../static/img/Group810.png" alt="" @click="taskAnswer(scope.row.taskId)">
                     </el-tooltip>
                  </div>
                  <div v-if="scope.row.status==1 || scope.row.status==2">
                      <!-- 待办里  已完成 状态  可查看 -->
                      <el-tooltip class="item" effect="dark" content="任务上报" placement="top">
                        <img src="../../../../static/img/Group823.png" alt="" @click="mettingAction(scope.row.taskId)">
                      </el-tooltip>
                  </div> 
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <el-pagination
            class="fenyeCenter"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page.sync="currentPage3"
            :page-size="15"
            layout="prev, pager, next, jumper"
            :page-count="totalNum">
          </el-pagination>
      </div>
    </div>    
</template>
<script>
import qs from "qs";
import { postAjax, getAjax, uploadImg, oUrl } from "../../../api/api.js";
export default {
  mounted() {
    this.autoStatus();
    this.autoMove(this.form);
  },
  data() {
    return {
      form: {
        nameOrNum: "", //	任务标题/编号
        status: "", //任务状态
        receiveDate: "", //	接收时间
        deadline: "", //	截止日期
        pageNo: 1, //页数
        pageSize: 15 //每页显示条数
      },
      tableData: [], //表格内容
      optionsDuty: [
        // {
        //   orgId: 1,
        //   orgName: "待签收"
        // },
        // {
        //   orgId: 2,
        //   orgName: "国资委2"
        // },
        // {
        //   orgId: 3,
        //   orgName: "国资委3"
        // }
      ],
      searchtesk: {
        state: ""
      },
      // searchNum: {
      //   title: ""
      // },
      // time1: "",
      // time2: "",
      currentPage3: 1, //分页得当前页数
      totalNum: 0 //总条目数
    };
  },
  methods: {
    autoMove(data) {
      /*******************************跳转顶部方法start***************************************/
      let contentScrollTop = document.getElementsByClassName('content');
      let scrollTop = contentScrollTop[0].scrollTop;
      if (scrollTop !== 0) {
        document.getElementsByClassName('content')[0].scrollTop = 0;
      }
      /*******************************跳转顶部方法end***************************************/
      let obj = qs.stringify(data);
      postAjax("ajax/task/taskDetail/list2", obj).then(res => {
        // console.log(res);
        this.totalNum = res.data.data.page.pageCount; //总条目数
        this.tableData = res.data.data.page.list;
      });
    },

    search() {
      this.autoMove(this.form);
    },
    autoStatus() {
      getAjax("sys/dict/diclist?type=taskDetail").then(res => {
        this.optionsDuty.push({ value: '', label: '全部' });
        res.data.forEach(item => {
          this.optionsDuty.push({
            label: item.label,
            value: item.value,
            type: item.type
          });
        });
        // console.log(this.optionsDuty);

        // this.optionsDuty=res.data.data;
      });
    },

    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`);
      this.form.pageNo = val;
      this.autoMove(this.form);
    },
    taskHandle(id) {
      //任务详情
      sessionStorage.setItem("childTask", id);
      sessionStorage.setItem("childTop", 1); //判断是否是跳到上报显示办理按钮
      this.$router.push({
        path: "taskDetail"
      });
    },
    taskAnswer(id) {
      // 任务答疑
      // this.$message({
      //   type: 'info',
      //   message: '此项功能暂未开放，敬请期待！'
      // });
      // return;
      this.$router.push({
        path: "/taskAnswer",
        query: {
          taskAnswer: id
        }
      });
    },
    mettingAction(id) {
      //任务上报
      sessionStorage.setItem("childTask", id);
      sessionStorage.setItem("childTop", 0); //判断是否是跳到上报显示办理按钮
      this.$router.push({
        path: "taskDetail"
      });
    },
    acceptFn(id) {
      //接收任务
      postAjax("ajax/task/taskDetail/makeList?id=" + id).then(res => {
        // console.log(res);
        this.$message({
          type: "success",
          message: "任务接收成功"
        });
        this.autoMove(this.form);
      });
    }
  }
};
</script>

<style scoped>
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
  display: inline-block;
  margin: 12px 0px 0px 10px;
  width: 14%;
}
/*分页样式*/
.fenyeCenter {
  text-align: center;
  margin: 10px auto 0px;
}
/*状态样式 start*/
.orangeState {
  color: #f9bf2c;
}
.redState {
  color: #dd0000;
}
.greenState {
  color: #3cc56d;
}
.blueState {
  color: #4a90e2;
}
.greyState {
  color: #898a8f;
}
.f_box > img {
  cursor: pointer;
}
.table-content {
  margin: 0 auto;
  width: 96%;
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

