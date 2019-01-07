<template>
    <div>
        <div class="headTagLy">
            <h2 class="tag" style="width:150px;">得分图表</h2>
            <div class="orglist-btn" @click="toShape">图形</div>
            <div class="orglist-btn active">列表</div>
            <div class="clear"></div>
        </div>
        <div class="ms-articleLy shadowLy">
            <div class="titleLy">省国资委党委信息总览</div>
            <div class="clear"></div>
            <div class="list-content">
                <el-table
              :data="tableData"
              style="width: 100%">
                    <el-table-column
                        prop="fieldName"
                        label=" "
                        width="180">
                    </el-table-column>
                    <el-table-column
                        prop="partyOrgSum"
                        label="党组织总数"
                        width="180">
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
export default {
  data() {
    return {
        tableData: [{
            fieldName: '直接管理统计',
            partyOrgSum: '3019',  //党组织总数
            committeeNum: '294', //党委数量
            partyAllOrgNum: '168',  //党总支部数量
            partyOrgNum: '2557', //党支部数量
            outOrg:'0',    //灯塔外党组织数量
            partyNum:'37311'    //党员数量
          }, {
            fieldName: '属地管理统计',
            partyOrgSum: '8463',
            committeeNum: '501',
            partyAllOrgNum: '379',
            partyOrgNum: '7583',
            outOrg:'0',
            partyNum:'180102'
          }, {
            fieldName: '合计',
            partyOrgSum: '11482',
            committeeNum: '785',
            partyAllOrgNum: '547',
            partyOrgNum: '10140',
            outOrg:'0',
            partyNum:'217413'
          }]
    };
  },
  methods: {
      toShape(){
          this.$router.push({path:'/orgShape'});
      }
  }
};
</script>

<style scoped>
.orglist-btn {
  width: 28px;
  height: 26px;
  font-size: 14px;
  border-radius: 5px;
  background-color: #cccccc;
  color: #353639;
  float: right;
  padding: 0px 10px 0px 10px;
  margin:8px 10px 0px 0px;
  cursor: pointer;
}
.orglist-btn:hover {
  background-color: #e91b1b;
  color: #fff;
  cursor: pointer;
}
.orglist-btn.active {
  width: 28px;
  height: 26px;
   font-size: 14px;
  border-radius: 5px;
  background-color: #e91b1b;
  color: #fff;
  float: right;
  padding: 0px 10px 0px 10px;
  margin:8px 10px 0px 0px;
  cursor: pointer;
}
.green-article {
  border: #3cc56d 1px solid;
  background-color: rgb(233, 247, 238);
}
.orange-article {
  border: #f9bf2c 1px solid;
  background-color: rgb(245, 239, 224);
}
.list-content{
  float: left;
  margin:4px 0px 0px 20px;
  width: 85%;
  padding-bottom: 5px;
}
/* table的公共样式 */
.has-gutter{
    height:25px;
}
.el-table th, .el-table tr > th{
    background:#ececec;
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