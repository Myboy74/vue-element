<template>
    <div>
         <div class="headTagLy">
            <h2 class="tag">会议管理</h2>
        </div>
         <div class="ms-articleLy shadowLy">
            <div class="block">
           <label class="label-search">会议标题/编号</label>
           <el-input v-model="searchtesk.title" class="search-input" placeholder="请输入会议标题/编号"></el-input>
            <label class="label-search" style="margin-right:10px;">起止时间</label>
            <el-date-picker
                v-model="searchtesk.time"
                type="daterange"
                value-format="yyyy-MM-dd"
                range-separator="至"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                placeholder="年/月/日">
            </el-date-picker>
            <el-button type="primary" style="padding: 10px 26px;margin-left:5px"  @click="search">搜索</el-button>
            <div>   
         </div>
    </div>
</div>
      <div class="ms-articleLy shadowLy">
          <h2 class="titleLy">会议列表</h2>
          <div class="button">
              <input type="button" value="创建" class="f_btn f_green" @click="newMeeting">
               <input type="button" value="导出" class="f_btn f_orange" @click="exportBtn">
          </div>
          <div class="clear"></div>
          <el-table
            ref="multipleTable"
            :data="tableData"
            tooltip-effect="dark"
            stripe
            border
            @selection-change="handleSelectionChange"
            style="width: 98%;margin:10px auto; border-radius:5px;">
           <el-table-column
      type="selection"
      width="55">
    </el-table-column>
            <el-table-column
              prop="num"
              label="序号"
              width="30"
              >
                 <template slot-scope="scope">{{ scope.row.num }}</template>
            </el-table-column>
            <el-table-column
              prop="meetnum"
              label="会议编号"
             
             >
            </el-table-column>
            <el-table-column
              prop="title"
              label="会议标题"
             >
              <template slot-scope="scope">
                <el-tooltip class="item" effect="dark" :content="scope.row.title" placement="right">
                  <span>{{scope.row.title}}</span>
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column
              prop="meetingtime"
              label="会议时间"
              width="100">
            </el-table-column>
            <el-table-column
              prop="issuenum"
              label="下发" width="40">
               <template slot-scope="scope">
                    <p @click="lowerGo(scope.row.id)" style="width:100%;height:100%;cursor: pointer;">
                      {{scope.row.issuenum}}
                    </p>
                    
              </template>
            </el-table-column>
            <el-table-column
              prop="receivenum"
              label="接收" width="40">
             <template slot-scope="scope">
                    <p @click="receiveGo(scope.row.id)"  style="width:100%;height:100%;cursor: pointer;">
                      {{scope.row.receivenum}}
                    </p>
              </template>
            </el-table-column>
            <el-table-column
              prop="finalnum"
              label="完成" width="40">
               <template slot-scope="scope">
                    <p @click="completeGo(scope.row.id)"  style="width:100%;height:100%;cursor: pointer;">
                      {{scope.row.finalnum}}
                    </p>
              </template>
            </el-table-column>
            <el-table-column
              prop="questionnum"
              label="答疑"
              width="50"
              >
                <template slot-scope="scope">
                    <p @click="taskAnswer(scope.row.id)"  style="width:100%;height:100%;cursor: pointer;">
                        <span style="color:red">  {{scope.row.noanswernum}}</span>/ <span>  {{scope.row.questionnum}}</span> 
                    </p>
                    
              </template>
            </el-table-column>
            <el-table-column
              prop="createtime"
              label="发布时间"
             width="100"
              >
            </el-table-column>
            <el-table-column
              prop="createname"
              label="发布人">
            </el-table-column>
            <el-table-column
              prop="meetStatus"
              label="会议状态">
              <template slot-scope="scope">
                <div v-if="scope.row.meetStatus=='已下发'">
                  <span :class="{violetState:(scope.row.meetStatus=='已下发')}">{{scope.row.meetStatus}}</span>
                </div>
                <div v-if="scope.row.meetStatus=='已完成'">
                  <span :class="{greenState:(scope.row.meetStatus=='已完成')}">{{scope.row.meetStatus}}</span>
                </div>
                <div v-if="scope.row.meetStatus=='已撤销'">
                  <span :class="{greyState:(scope.row.meetStatus=='已撤销')}">{{scope.row.meetStatus}}</span>
                </div>
                 <div v-if="scope.row.meetStatus=='草稿'">
                  <span :class="{redState:(scope.row.meetStatus=='草稿')}">{{scope.row.meetStatus}}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              label="操作" width="150">
              <template slot-scope="scope">
                <div class="f_box">
                    <el-tooltip class="item" effect="dark" content="发布会议" placement="top">
                      <img v-if="scope.row.meetStatus=='草稿'" src="../../../../static/img/Group145.png" @click="releaseTask(scope.row.id)">
                    </el-tooltip>
                    <el-tooltip class="item" effect="dark" content="编辑" placement="top">
                      <img v-if="scope.row.meetStatus=='草稿'" src="../../../../static/img/Group147.png" @click="editMeeting(scope.row.id)">
                    </el-tooltip>
                    <el-tooltip class="item" effect="dark" content="查看详情" placement="top">
                      <img src="../../../../static/img/Group148.png" @click="lookMeeting(scope.row.id)">
                    </el-tooltip>
                    <el-tooltip class="item" effect="dark" content="会议完成" placement="top">
                      <img v-if="scope.row.meetStatus=='已下发'"  src="../../../../static/img/Group149.png" @click="completeTask(scope.row.id)">
                    </el-tooltip>
                    <el-tooltip class="item" effect="dark" content="撤销会议" placement="top">
                      <img v-if="scope.row.meetStatus=='已下发'" src="../../../../static/img/Group151.png" @click="closeTask(scope.row.id)">
                    </el-tooltip>
                    <el-tooltip class="item" effect="dark" content="删除会议" placement="top"> 
                    <img v-if="scope.row.meetStatus=='草稿'||scope.row.meetStatus=='已撤销'"  src="../../../../static/img/Group150.png" @click="deleteBtn(scope.row.id)">
                    </el-tooltip> 
                    <!-- <img src="../../../../static/img/Group810.png" alt="" title="问题答疑"> -->
                    <!-- <img src="../../../../static/img/Group820.png" alt="" title="接收任务"> -->
                    <!-- <img src="../../../../static/img/Group823.png" alt="" title="任务办理"> -->
                  </div>        
                   </template>
            </el-table-column>
          </el-table>
          <el-pagination
            class="fenyeCenter"
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
import { postAjax, getAjax, uploadImg } from "../../../api/api.js";
export default {
  mounted() {
    this.autoMove(this.currentPage3);
  },
  data() {
    return {
      tableData: [], //表格
      optionsNum: [
        //任务标题/编号
        {
          orgId: 4,
          orgName: "HY18091701"
        },
        {
          orgId: 5,
          orgName: "国资委5"
        },
        {
          orgId: 6,
          orgName: "国资委6"
        }
      ],
      searchtesk: {
        //搜索内容
        title: "", //任务标题/编号
        time: "" //起止时间
      },
      multipleSelection: [], //表格选框得数组
      currentPage3: 1, //分页得当前页数
      totalNum: 1 //总条目数
    };
  },
  methods: {
    autoMove(val) {
      /*******************************跳转顶部方法start***************************************/
      let scrollTop = document.getElementsByClassName('content')[0].scrollTop;
      if (scrollTop !== 0) {
        document.getElementsByClassName('content')[0].scrollTop = 0;
      }
      /*******************************跳转顶部方法end***************************************/
      let obj = {
        pageNo: val, //第几页、默认1
        pageSize: "", //每页显示条数 默认15
        startDate: this.searchtesk.time[0], //开始日期
        endDate: this.searchtesk.time[1], //结束日期
        idOrTitle: this.searchtesk.title //任务标题或编号
      };
      let data = qs.stringify(obj);
      postAjax("ajax/meeting/taskMeeting/list", data)
        .then(res => {
          // console.log(res);
          // console.log(res.data.data.page.pageCount);
          this.totalNum = res.data.data.page.pageCount; //总条目数
          this.tableData = res.data.data.page.list;
        })
        .catch(err => {
          this.$message({
            showClose: true,
            message: "数据获取失败",
            type: "error"
          });
        });
    },
    handleCurrentChange(val) {
      //  当前页数
      this.currentPage3 = val;
      this.autoMove(this.currentPage3)
    },
    search() {
      //搜索按钮
      this.autoMove(1);
    },
    handleSelectionChange(val) {
      //表格得选择框
      this.multipleSelection = val;
    },
    exportBtn() {
      //导出按钮
      if (this.multipleSelection.length < 1) {
        this.$message({
          showClose: true,
          message: "请选择一条会议信息进行导出",
          type: "warning"
        });
        return;
      } else if (this.multipleSelection.length > 1) {
        this.$message({
          showClose: true,
          message: "一次只可以导出一个会议信息",
          type: "warning"
        });
        return;
      }
      // this.$confirm("此操作将导出所选的文件信息, 是否继续?", "温馨提示", {
      //   confirmButtonText: "确定",
      //   cancelButtonText: "取消",
      //   type: "warning"
      // })
      //   .then(() => {
      //     this.$message({
      //       type: "success",
      //       message: "导出成功!"
      //     });
      let url = localStorage.getItem("url");
      document.location.href =
        url +
        "/ajax/meeting/taskMeeting/exportExcel?id=" +
        this.multipleSelection[0].id;
      // })
      // .catch(() => {
      //   this.$message({
      //     type: "info",
      //     message: "已取消导出"
      //   });
      // });

      // getAjax("ajax/meeting/taskMeeting/exportExcel?id="+this.multipleSelection[0].id)
      //   .then(res => {
      //     /*  未测试通过* */
      //      console.log(res);

      // })
      // .catch(err => {
      //   this.$message({
      //     showClose: true,
      //     message: "导出失败",
      //     type: "error"
      //     });
      // });
    },
    releaseTask(num) {
      //表格-操作---发布任务
      this.$confirm("此操作会将所选的会议进行下发, 是否继续?", "温馨提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          postAjax("ajax/meeting/taskMeeting/detail?id=" + num)
            .then(res => {
              // console.log(res);
              let date = res.data.data.taskMeeting;
              let form = {
                flag: 2, //1保存还是2下发
                id: num,
                title: date.title, //会议主题
                summary: date.summary, //会议描述
                requirement: date.requirement, //会议人员要求
                meetingtime: date.meetingtime, // 会议时间
                address: date.address, // 截止时间
                limitetime: date.limitetime, //会议地点
                receiveorg: [
                  //   //抄送单位
                  //   { id: 1, name: "标签一" }
                ],
                duplicateorg: [
                  //   //下发单位
                  //   { id: 1, name: "标签一" }
                ],
                score: date.score, //会议总分
                fileList: [] //文件上传
              };
              //下发
              let data = qs.stringify(form);
              postAjax("ajax/meeting/taskMeeting/save", data)
                .then(res => {
                  // console.log(res);
                  /*测试草稿得还在会生成一个已下发的*/
                  this.$message({
                    showClose: true,
                    message: "会议下发成功",
                    type: "success"
                  });
                  this.autoMove(this.currentPage3);
                })
                .catch(err => {
                  this.$message({
                    showClose: true,
                    message: "会议下发失败",
                    type: "error"
                  });
                });
            })
            .catch(err => {
              this.$message({
                showClose: true,
                message: "导出失败",
                type: "error"
              });
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消下发"
          });
        });
      // console.log(num);
    },
    completeTask(num) {
      //表格-操作---任务完成
      this.$confirm("此操作会将所选会议设置为完成会议, 是否继续?", "温馨提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          // this.$message({
          //   type: 'success',
          //   message: '删除成功!'
          // });
          postAjax(
            "ajax/meeting/taskMeetingCheck/finalMeeting?meetingid=" + num
          )
            .then(res => {
              this.$message({
                showClose: true,
                message: "操作成功",
                type: "success"
              });
              this.autoMove(this.currentPage3);
            })
            .catch(err => {
              this.$message({
                showClose: true,
                message: "操作失败",
                type: "error"
              });
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消会议完成"
          });
        });
    },
    closeTask(num) {
      //表格-操作---任务关闭
      // console.log(num);
      this.$confirm("此操作将撤销所选会议, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          postAjax(
            "ajax/meeting/taskMeetingCheck/closeMeeting?meetingid=" + num
          )
            .then(res => {
              this.$message({
                showClose: true,
                message: "操作成功",
                type: "success"
              });
              this.autoMove(this.currentPage3);
            })
            .catch(err => {
              this.$message({
                showClose: true,
                message: "操作失败",
                type: "error"
              });
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消撤销"
          });
        });
    },
    editMeeting(num) {
      //表格-操作---会议编辑
      this.$router.push({
        name: "f_newMeeting",
        query: {
          edit: num
        }
      });
    },
    lookMeeting(num) {
      //表格-操作---会议查看
      this.$router.push({
        name: "f_lookMeeting",
        query: {
          look: num
        }
      });
    },
    deleteBtn(num) {
      //表格-操作---删除
      // console.log(num);
      this.$confirm("此操作会将所选会议永久删除, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          postAjax("ajax/meeting/taskMeeting/delete?id=" + num)
            .then(res => {
              // console.log(res);
              this.$message({
                showClose: true,
                message: "删除成功",
                type: "success"
              });
              this.autoMove(this.currentPage3);
            })
            .catch(err => {
              this.$message({
                showClose: true,
                message: "删除失败",
                type: "error"
              });
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    newMeeting() {
      //新建会议
      this.$router.push({ name: "f_newMeeting" });
    },
    taskAnswer(num) {
      //会议答疑
      // this.$message('功能暂未开放,敬请期待!');
      // return;
      this.$router.push({
        name: "f_taskAnswer",
        query:{
          f_answerId:num
        }
      });
    },
    lowerGo(num) {
      //下发详情
      this.$router.push({
        name: "m_lowerNumber",
        query: {
          id: num
        }
      });
    },
    completeGo(num) {
      //完成详情
      this.$router.push({
        name: "m_completeNumber",
        query: {
          id: num
        }
      });
    },
    receiveGo(num) {
      //接收详情
      this.$router.push({
        name: "m_receiveNumber",
        query: {
          id: num
        }
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
  /* display: inline; */
}
.search-input {
  width: 220px;
  display: inline-block;
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

