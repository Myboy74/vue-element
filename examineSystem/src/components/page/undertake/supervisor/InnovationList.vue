<template>
    <div class="f_taskManager">
        <div class="headTagLy">
            <h2 class="tag">创新工作任务列表</h2>
        </div>
        <div class="ms-articleLy shadowLy">
            <label class="label-search">任务名称</label>
            <el-input v-model="form.rwmc" class="search-input" placeholder="请输入任务名称"></el-input>
            <label class="label-search">状态查询</label>
             <el-select v-model="form.zt" placeholder="请选择"  class="search-input" >
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            <!-- <el-input v-model="form.fbdw" class="search-input" placeholder="请输入发表单位"></el-input> -->
            <el-button type="primary" style="margin-left:5px;" @click="searchFn">搜索</el-button>
        </div>
        <div class="ms-articleLy shadowLy">
            <h2 class="titleLy">任务列表</h2>
            <div class="button">
                <input type="button" value="新建" class="f_btn f_green" @click="newTask">
            </div>
            <div class="clear"></div>
            <el-table :data="tableData" stripe border
                style="width: 98%;margin:0 auto; border-radius:5px;">
                <el-table-column type="index" label="序号" width="80">
                </el-table-column>
                <el-table-column prop="rwNum" label="任务编号">
                </el-table-column>
                <el-table-column label="任务名称" title="rwmc">
                    <template slot-scope="scope">
                        <el-tooltip class="item" effect="dark" :content="scope.row.rwmc" placement="right">
                            <span>{{scope.row.rwmc}}</span>
                        </el-tooltip>
                    </template>
                </el-table-column>
                <el-table-column prop="fbname" label="发布单位">
                </el-table-column>
                <el-table-column prop="fbrname" label="申请人">
                </el-table-column>
                <el-table-column prop="rwkssj" label="任务时间">
                    <!-- <template slot-scope="scope">
                        <p @click="lowerGo()" style="width:100%;height:100%;cursor: pointer;">
                            {{scope.row.taskDate}}
                        </p>
                    </template> -->
                </el-table-column>
                <el-table-column label="状态">
                    <template slot-scope="scope">
                        <div v-if="scope.row.zt==0">
                    <span class="orangeState">{{scope.row.ztName}}</span>
                  </div>
                  <div v-else-if="scope.row.zt==1">
                   <span class="greenState">{{scope.row.ztName}}</span>
                  </div>
                  <div v-else-if="scope.row.zt==2">
                    <span class="redState">{{scope.row.ztName}}</span>
                  </div>   
                    </template>
                </el-table-column>
                <el-table-column prop="khfz" label="分值">
                    <!-- <template slot-scope="scope">
                        <p @click="receiveGo()" style="width:100%;height:100%;cursor: pointer;">
                            {{scope.row.score}}
                        </p>
                    </template> -->
                </el-table-column>
                <el-table-column label="操作">
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
                            </el-tooltip> -->
                            <el-tooltip class="item" effect="dark" content="撤销任务" placement="top">
                                <img v-if="scope.row.zt=='0'" src="../../../../../static/img/Group151.png" alt=""
                                    @click="revokeTask(scope.row.id)">
                            </el-tooltip>
                            <!-- <el-tooltip class="item" effect="dark" content="删除任务" placement="top">
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
      form: {
        rwmc: "", //	任务名称
        zt: "", //	状态
        pageNo: 0, //分页
        pageSize: 15 //每页数据行数
      }, //默认查询参数的对象
      options:[],//状态
      tableData: [], //表格内容
      currentPage: 1, // //当前页
      totalNum: 1, //总条目数
    };
  },
  mounted() {
    this.autoMove();
    this.autoZt();
  },
  methods: {
    autoMove() {
      let obj = qs.stringify(this.form);
      postAjax("ajax/cxgzrw/cxgzrw/list", obj).then(res => {
        if (res.data.state == 1) {
          this.tableData = res.data.data.page.list;
          this.currentPage = res.data.data.page.pageNo; //当前页
          this.totalNum = res.data.data.page.count; //总条目数
        }
      });
    },
    autoZt(){ //状态查询
      postAjax("ajax/meeting/taskMeeting/getDict?type=cxgz_status").then(res => {
        if (res.status == 200) {
          this.options=res.data;
          this.options.unshift({
            label:"全部",
            value:""
          })
        }
      });

    },
    taskDetails(id) {
      //查看详情
      // console.log(id);
      this.$router.push({
        name: "innovationDetails",
        query: {
          id: id
        }
      });
    },
    revokeTask(id) {
      //撤销任务
      this.$confirm("是否确认撤销任务?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          postAjax("ajax/cxgzrw/cxgzrw/delete?id=" + id).then(res => {
            if (res.data.state == 1) {
              this.$message({
                showClose: true,
                message: "撤销成功",
                type: "success"
              });
              this.autoMove();
            }else{
              this.$message.error(res.data.message);
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消撤销任务"
          });
        });
    },
    searchFn() {
      //顶部查询按钮
      this.autoMove();
    },
    newTask() {
      //创建任务
      this.$router.push({
        name: "newInnovation"
      });
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
