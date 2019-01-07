<template>
    <div class="f_taskManager">
        <div class="headTagLy">
            <h2 class="tag">督导检查列表</h2>
        </div>
        <div class="ms-articleLy shadowLy">
            <label class="label-search">任务名称</label>
            <el-input v-model="form.rwbt" class="search-input" placeholder="请输入任务名称"></el-input>
            <!-- <label class="label-search">发表单位</label>
            <el-input v-model="form.createDw" class="search-input" placeholder="请输入发表单位"></el-input> -->
            <el-button type="primary" style="margin-left:5px;" @click="searchFn">搜索</el-button>
        </div>
        <div class="ms-articleLy shadowLy">
            <h2 class="titleLy">任务列表</h2>
            <!-- <div class="button">
                <input type="button" value="新建" class="f_btn f_green" @click="newTask">
            </div> -->
            <div class="clear"></div>
            <el-table ref="multipleTable" 
            :data="tableData" stripe border
                style="width: 98%;margin:0 auto; border-radius:5px;">
                <el-table-column type="index" label="序号" width="80">
                </el-table-column>
                <el-table-column prop="ddjcNum" label="任务编号">
                </el-table-column>
                <el-table-column label="任务名称" title="name">
                    <template slot-scope="scope">
                        <el-tooltip class="item" effect="dark" :content="scope.row.rwbt" placement="right">
                            <span class="goDetails" @click="goDetails(scope.row.id)">{{scope.row.rwbt}}</span>
                        </el-tooltip>
                    </template>
                </el-table-column>
                <el-table-column prop="createUser" label="发布人">
                </el-table-column>
                <el-table-column prop="kssj" label="发布时间">
                </el-table-column>
                <el-table-column prop="jssj" label="结束时间">
                </el-table-column>
                <el-table-column  prop="tjfz"  label="分值" >
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
      taskList: [], //状态列表
      form: {
        rwbt:"",//	任务标题
        createDw:"",//	发布单位
        pageNo: 1, //分页
        pageSize: 15, //每页数据行数
      }, //默认查询参数的对象
      tableData: [], //表格内容
      currentPage: 1, // //当前页
      totalNum: 1 //总条目数
    };
  },
  mounted() {
    this.autoMove();
  },
  methods: {
    autoMove(){
       let data = qs.stringify(this.form);
      postAjax("ajax/ddjc/ddjc/list2", data).then(res => {
        if (res.status == 200) {
          this.tableData = res.data.data.page.list;
          this.currentPage = res.data.data.page.pageNo; //当前页
          this.totalNum = res.data.data.page.count; //总条目数
        }
      });

    },
    goDetails(id){
      //进入详情
      this.$router.push({
        name:"supervisorCheckDetails",
        query:{
          superDetailsId:id
        }
      })

    },
    searchFn() {
      //顶部查询按钮
      this.autoMove();
    },
    handleSizeChange(val) {
      //当前页数发生变化时
      this.form.pageSize = val;
      this.autoMove();
    },
    handleCurrentChange(val) {
      //当前页发生变化时
      this.form.pageNo = val;
      this.autoMove();
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
.goDetails{
  cursor: pointer;
  color: #4a90e2;
}
</style>
