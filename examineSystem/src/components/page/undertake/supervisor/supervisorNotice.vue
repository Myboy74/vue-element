<template>
    <div class="f_taskManager">
        <div class="headTagLy">
            <h2 class="tag">通知管理列表</h2>
        </div>
         <div class="ms-articleLy shadowLy">
            <label class="label-search">通知标题</label>
            <el-input v-model="form.messageTitle" class="search-input" placeholder="请输入通知标题"></el-input>
            <el-button type="primary" style="margin-left:5px;" @click="searchFn">搜索</el-button>
        </div>
        <div class="ms-articleLy shadowLy">
            <h2 class="titleLy">任务列表</h2>
            <div class="clear"></div>
            <el-table ref="multipleTable" 
            :data="tableData" stripe border
                style="width: 98%;margin:0 auto; border-radius:5px;">
                <el-table-column type="index" label="序号" width="80">
                </el-table-column>
                <el-table-column label="通知标题" prop="messageTitle">
                    <template slot-scope="scope">
                        <el-tooltip class="item superTitle" effect="dark" :content="scope.row.messageTitle" placement="right">
                            <span @click="onLookDetails(scope.row.id)">{{scope.row.messageTitle}}</span>
                        </el-tooltip>
                    </template>
                </el-table-column>
                <el-table-column label="类型" title="type">
                    <template slot-scope="scope">
                       <!-- <el-tooltip class="item" effect="dark" :content="scope.row.contentType" placement="right"> -->
                            <span>{{scope.row.contentType==0?"文字":"图片"}}</span>
                       <!-- </el-tooltip> -->
                    </template>
                </el-table-column>
                <el-table-column prop="publishDate" label="发布日期">
                </el-table-column>
               
                <!-- <el-table-column label="操作" width="180">
                    <template slot-scope="scope">
                        <div class="f_box">
                            <el-tooltip class="item" effect="dark" content="查看详情" placement="top">
                                <img src="../../../../../static/img/Group148.png" alt="" @click="taskDetails(scope.row.id)">
                            </el-tooltip>
                            <el-tooltip class="item" effect="dark" content="删除任务" placement="top">
                                <img src="../../../../../static/img/Group150.png"
                                    alt="" @click="removeTask(scope.row.id)">
                            </el-tooltip>
                        </div>
                    </template>
                </el-table-column> -->
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
        pageNo: 0, //分页
        pageSize: 15, //每页数据行数
        messageTitle: "" //通知标题
      }, //默认查询参数的对象
      multipleSelection: [], //表格选择框选择得数组
      tableData: [], //表格内容
      idArray: [], //已选择表格的id数组
      currentPage: 1, // //当前页
      totalNum: 1 //总条目数
    };
  },
  created() {
    this.autoMove(this.form);
  },
  methods: {
    autoMove(obj) {
      let data = qs.stringify(obj);
      postAjax("ajax/message/managerMessageNotice/recivelist", data).then(res => {
        // console.log(res);
        this.tableData = res.data.data.list; //表格内容
        this.currentPage = res.data.data.pageNo; //当前页
        this.totalNum = res.data.data.count; //总条目数
      });
    },
    searchFn() {
      //顶部查询按钮
      if (!this.form.messageTitle) {
        this.$message({
          message: "请输入要查询的通知标题",
          type: "warning"
        });
        return;
      }
      this.autoMove(this.form);
    },
    onLookDetails(id) {
      //查看详情
      this.$router.push({
        name: "supervisorNoticeDetail",
        query: {
          id: id
        }
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
.superTitle{
  cursor: pointer;
  color: #4a90e2;
}
</style>
