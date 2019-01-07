<template>
    <div>
      <div class="account shadowLy">
        <span class="accountTitle" style="float:left;">用户列表</span>
            <el-button type="success" 
            v-if="show"
             class="f_btn"  @click="newAdd"
             style="float:right;margin:0 20px 10px 0">新增</el-button>
            <el-table stripe border :data="tableData" style="width:96%;margin:0 auto">
            <el-table-column label="登录名" prop="loginName">
                </el-table-column>
                    <el-table-column prop="name" label="姓名">
                </el-table-column>
                <el-table-column label="电话">
                    <template slot-scope="scope">
                        {{ scope.row.phone?scope.row.phone:"无" }}
                </template>
                </el-table-column> 
                  <el-table-column prop="remarks" label="备注">
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <!-- <el-tooltip class="item" effect="dark" content="发布任务" placement="top">
                        <img  src="../../../../static/img/Group145.png" alt=""
                            @click="receiveSingle(scope.row.id)">
                        </el-tooltip> -->
                <el-tooltip class="item" effect="dark" content="修改" placement="top">
                    <img src="../../../../static/img/Group147.png" alt=""
                        @click="editTask(scope.row.id)">
                </el-tooltip>
                <!-- <el-tooltip class="item" effect="dark" content="查看详情" placement="top">
                    <img src="../../../../static/img/Group148.png" alt="" @click="taskDetails(scope.row.id)">
                </el-tooltip> -->
                <!-- <el-tooltip class="item" effect="dark" content="任务完成" placement="top">
                    <img src="../../../../static/img/Group149.png" alt=""
                        @click="overTask(scope.row.id)">
                </el-tooltip>
                <el-tooltip class="item" effect="dark" content="撤销任务" placement="top">
                    <img src="../../../../static/img/Group151.png" alt=""
                        @click="revokeTask(scope.row.id)">
                </el-tooltip> -->
                <el-tooltip class="item" effect="dark" content="删除用户" placement="top">
                    <img src="../../../../static/img/Group150.png" alt="" @click="onRemove(scope.row.id)">
                </el-tooltip>
            </template>
        </el-table-column>
        </el-table>
            <div class="total">
                <el-pagination class="fenyeCenter" style="margin-top:10px" 
                @current-change="handleCurrentChange"
                :current-page.sync="currentPage" 
                :page-size="15" 
                layout="prev, pager, next, jumper" 
                :page-count="totalNum">
                </el-pagination>
            </div>      
        </div>
    </div>
</template>

<script>
import qs from "qs";
import { postAjax, getAjax } from "../../../api/api.js";
export default {
  data() {
    return {
      tableData: [],
      attachment: localStorage.getItem("attachment"), //上传文件得下载（预览）路径
      currentPage: 1, //当前页
      totalNum: 1, //总条目数
      num: 0 ,//删除
      show:true,//是否显示新增
    };
  },
  methods: {
    showBtn(val){ //判断新增按钮是否显示
      this.show=val;
    },
    setContent(val) {  //父组件传过来的
      //内容
      let con = val.list;
      //分页
      this.tableData = con;
      this.totalNum = val.pageCount;
      this.currentPage = val.pageNo;
    },
    newAdd() {
      //新建
      this.$emit("tabUserTable", "2");
    },
    handleCurrentChange(val) {
      //当前页:分页
      this.currentPage = val;
      this.$emit("curentPage", this.currentPage);
    },
    editTask(id) {
      //修改
      this.$emit("tabUserTable", "1");
      sessionStorage.setItem("editUserInformation", id);
    },
    onRemove(id) {//删除
      this.$confirm("此操作将永久删除该信息, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.removeTask(id);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    removeTask(id) {//确定删除
      postAjax("ajax/user/sysUser/delete?id=" + id).then(res => {
        if (res.status == 200) {
          this.$message({
            type: "success",
            message: res.data.message
          });
        }
        this.$emit("tableRemove", 1); //传给父级删除了刷新一下数据
      });
    }
  }
};
</script>

<style scoped>
.account {
  width: 99%;
  margin: 10px auto;
  box-sizing: border-box;
  padding: 20px 0;
  border-radius: 5px;
}
.accountTitle {
  display: block;
  padding: 0px 20px 20px 20px;
  font-size: 14px;
}
.f_btn {
  width: 80px;
  height: 36px;
  line-height: 36px;
  padding: 0;
  text-align: center;
  color:none;
  background: #67c23a;
}
.total {
  width: 50%;
  margin: 0 auto;
}
</style>
