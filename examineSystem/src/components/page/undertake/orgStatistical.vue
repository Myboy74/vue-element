<template>
    <div>
        <div class="headTagLy">
            <h2 class="tag" style="width:150px;">党组织信息统计</h2>
            <div class="orglist-btn" @click="toShape">图形</div>
            <div class="orglist-btn active">列表</div>
            <div class="clear"></div>
        </div>
        <div class="ms-articleLy shadowLy">
            <div class="titleLy">省国资委党委信息总览</div>
            <div class="clear"></div>
            <div class="list-content">
                <el-table
                stripe
                 border
              :data="tableData"
              >
                    <el-table-column
                        prop="fieldName"
                        label=" "
                        >
                        <template slot-scope="scope">
                          <div v-if="scope.row.fieldName!=='合计'">{{scope.row.fieldName}}统计</div>
                          <div v-else>{{scope.row.fieldName}}</div>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="partyOrgSum"
                        label="党组织总数"
                      >
                    </el-table-column>
                    <el-table-column
                        prop="committeeNum"
                        label="党委数量">
                    </el-table-column>
                    <el-table-column
                        prop="partyAllOrgNum"
                        label="党总支部数量">
                    </el-table-column>
                    <el-table-column
                        prop="partyOrgNum"
                        label="党支部数量">
                    </el-table-column>
                    <el-table-column
                        prop="unionPartyOrgNum"
                        label="联合党支部数量">
                    </el-table-column>
                    <el-table-column
                        prop="tempPartyOrgNum"
                        label="临时党支部数量">
                    </el-table-column>
                    <el-table-column
                        prop="outOrg"
                        label="灯塔外党组织数量">
                    </el-table-column>
                    <el-table-column
                        prop="partyNum"
                        label="党员数量">
                    </el-table-column>
                </el-table>
            </div>
            <div class="clear"></div>
        </div>
        <div class="ms-articleLy shadowLy">
            <div class="titleLy">下级党组织信息统计</div>
            <div class="clear"></div>
    
            <div class="list-content">
                <el-table
                border
                :span-method="arraySpanMethod"
                :data="orgTableData"
                >
                  <el-table-column
                      prop="shortName"
                      label="党组织名称"
                      >
                  </el-table-column>
                   <el-table-column
                      prop="fieldName"
                      label="管理类型"
                      >
                      </el-table-column>
                      <el-table-column
                          prop="partyOrgSum"
                          label="党组织总数"
                        >
                      </el-table-column>
                      <el-table-column
                          prop="committeeNum"
                          label="党委数量">
                      </el-table-column>
                      <el-table-column
                          prop="partyAllOrgNum"
                          label="党总支部数量">
                      </el-table-column>
                      <el-table-column
                          prop="partyOrgNum"
                          label="党支部数量">
                      </el-table-column>
                      <el-table-column
                          prop="unionPartyOrgNum"
                          label="联合党支部数量">
                      </el-table-column>
                      <el-table-column
                          prop="tempPartyOrgNum"
                          label="临时党支部数量">
                      </el-table-column>
                      <el-table-column
                          prop="outOrg"
                          label="灯塔外党组织数量">
                      </el-table-column>
                      <el-table-column
                          prop="partyNum"
                          label="党员数量">
                      </el-table-column>
                  
                </el-table>
            </div>
            <div class="clear"></div>
        </div>
    </div>
</template>
<script>
import { postAjax, getAjax,postTaggle  } from "../../../api/api.js";
export default {
  data() {
    return {
      tableData: [], //省国资委党委信息总览
      orgTableData:[], //下级党组织信息统计表
    };
  },
  mounted() {
    // this.loadGzwTable1();  //正式的
     this.loadGzwTable2();  //暂用卜宪文的
  },
  methods: {
    toShape() {
      this.$router.push({ path: "/orgShape" });
    },
    arraySpanMethod({ row, column, rowIndex, columnIndex }) {
      //合并单元格方法
      if (rowIndex % 2 === 0) {
        //判断条件可以设置成你想合并的行的起始位置
        if (columnIndex === 0) {
          //判断条件可以设置成你想合并的列的起始位置
          return [2, 1];
        }
      }
      if (rowIndex % 2 === 1) {
        //判断条件可以设置成你想合并的行的起始位置
        if (columnIndex === 0) {
          //判断条件可以设置成你想合并的列的起始位置
          return [1, 0];
        }
      }
    },
    loadGzwTable1() {
      let id=sessionStorage.getItem("userWordId");
      getAjax("statisticAnalysis/statistic/orgStatisticAnalysis?id=" + id)
        .then(res => {
          if (res.data.state == 1) {
            this.tableData = res.data.data.tableData;
            getAjax(
              "statisticAnalysis/statistic/orgChildStatisticAnalysis?id=" + id
            )
              .then(res => {
                //获取下级党组织信息统计表数据
                res.data.data.forEach(element => {
                  element.tableData.forEach(item=>{
                    this.orgTableData.push(item);
                  })
                });
               })
              .catch(err => {
                console.log(err);
              });
          } else {
            this.$message({
              type: "error",
              message: res.data.data.message
            });
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
     loadGzwTable2() {
      let id=sessionStorage.getItem("userWordId");
      postTaggle("gzwstatistic/orgStatisticAnalysis?gzwid=" + id)
        .then(res => {
          if (res.status==200) {
            this.tableData = res.data.data.tableData;
            postTaggle(
              "gzwstatistic/orgChildStatisticAnalysis?gzwid=" + id
            )
              .then(res => {
                //获取下级党组织信息统计表数据
                res.data.data.forEach((element,index) => {
                  element.tableData.forEach(item=>{
                    this.orgTableData.push(item);
                  })
                });
               })
              .catch(err => {
                console.log(err);
              });
          } else {
            this.$message({
              type: "error",
              message: res.data.data.message
            });
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
};
</script>

<style scope>
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
   /* font-size: 14px;
  border-radius: 5px; */
  background-color: #e91b1b;
  color: #fff;
  /* float: right; */
  /* padding: 0px 10px 0px 10px;
  margin: 8px 10px 0px 0px;
  cursor: pointer; */
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
  width: 96%;
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
  border: #ccc solid 1px;
}


.tabtop13{
  margin: 0 auto;
  font-size:14px;
  border: 1px solid #cccccc;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
  border-bottom:none; 
}
.tabtop13 tr td{
  text-align: center;
}
.tableTitle td{
  height: 50px;
}
.tableTitle td.borNove{
  border-left:none;
}
.tabtop13 td+td{
  border-left: 1px solid #cccccc;
}
.tabtop13 td{
   border-bottom: 1px solid #cccccc;
}
.tablecon td{
  line-height: 30px;
}
.tablecon td:first-child{
  border-left: 1px solid #cccccc;
}



 
</style>
