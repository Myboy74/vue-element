<template>
    <div class="userManage">
        <div class="global-panel">
            <article class="left-panel shadowLy" >
                <div class="left-panel-title">
                    <span>组织机构</span>
                </div>
                <div class="item-tree-area tree f_treeW" style="min-height:250px;max-height:500px;overflow-y:auto">
                    <el-tree
                     
                        :props="defaultProps"
                        :load="treeData"
                        lazy
                        @node-click="nodeClick"
                       >
                        </el-tree>
                </div>
            </article>
            <article class="right-panel" style="border:none">
                <div class="headTagLy">
                    <h2 class="tag">组织用户维护</h2> 
                    <span style="display:none">{{tabelType}}</span>
                </div>
                <div class="account shadowLy">
                    <span class="accountTitle" style="float:left">{{wordObj.name}}</span>
                    <el-button type="success" class="f_btn" 
                     style="float:right;margin:0 20px 10px 0"
                      @click="newAdd(wordObj.id)">添加机构</el-button>
                   
                     <el-table
                        :data="tableDataTop" border stripe
                        style="width: 96%;margin:0 auto">
                        <el-table-column
                            label="企业名称">
                                <template slot-scope="scope">
                                    <el-tooltip class="item" effect="dark" :content="scope.row.name" placement="right">
                                        <span>{{scope.row.name}}</span>
                                    </el-tooltip>
                                </template>
                        </el-table-column>
                        <el-table-column
                            prop="shortName"
                            label="企业简称">
                        </el-table-column>
                        <el-table-column
                            label="企业类别">
                            <template slot-scope="scope">
                              <el-tooltip class="item" effect="dark" :content="scope.row.type" placement="right">
                                <span>{{scope.row.type}}</span>
                              </el-tooltip>
                            </template>
                        </el-table-column>
                         <el-table-column
                            prop="fax"
                            label="党员数量">
                        </el-table-column>
                         <el-table-column
                            prop="address"
                            label="是否直管">
                            <template slot-scope="scope">
                                <span v-if="scope.row.useable=='1'">是</span>
                                <span v-else>否</span>
                              </template>
                        </el-table-column>
                          <el-table-column
                            prop="email"
                            label="组织类别">
                        </el-table-column>
                          <el-table-column
                            prop="primaryPerson"
                            label="联系人">
                        </el-table-column>
                          <el-table-column
                            prop="phone"
                            label="联系电话">
                        </el-table-column>
                        </el-table>
                </div>
                <div class="account shadowLy">
                    <span class="accountTitle">下级党组织列表</span>
                    <el-table stripe :data="tableData" border style="width:96%;margin:0 auto">
                    <el-table-column label="企业名称">
                        <template slot-scope="scope">
                                <!-- <el-tooltip class="item" effect="dark" :content="scope.row.num" placement="right"> -->
                                <span>{{scope.row.name}}</span>
                                <!-- </el-tooltip> -->
                            </template>
                            </el-table-column>
                                <el-table-column prop="shortName" label="企业简称">
                            </el-table-column>
                            <el-table-column prop="type" label="企业类别" >
                              <template slot-scope="scope">
                                <el-tooltip class="item" effect="dark" :content="scope.row.type" placement="right">
                                  <span>{{scope.row.type}}</span>
                                </el-tooltip>
                              </template>
                            </el-table-column>
                            <el-table-column prop="primaryPerson" label="联系人">
                            </el-table-column>
                            <el-table-column prop="phone" label="联系电话">
                            </el-table-column>
                            <el-table-column label="操作">
                                <template slot-scope="scope">
                                    <!-- <el-tooltip class="item" effect="dark" content="发布任务" placement="top">
                                    <img  src="../../../../static/img/Group145.png" alt=""
                                        @click="receiveSingle(scope.row.id)">
                                    </el-tooltip> -->
                            <el-tooltip class="item" effect="dark" content="编辑" placement="top">
                                <img src="../../../../static/img/Group147.png" alt=""
                                    @click="editTask(scope.row.id)">
                            </el-tooltip>
                            <el-tooltip class="item" effect="dark" content="查看详情" placement="top">
                                <img src="../../../../static/img/Group148.png" alt="" @click="taskDetails(scope.row.id)">
                            </el-tooltip>
                          <!--   <el-tooltip class="item" effect="dark" content="任务完成" placement="top">
                                <img src="../../../../static/img/Group149.png" alt=""
                                    @click="overTask(scope.row.id)">
                            </el-tooltip>
                            <el-tooltip class="item" effect="dark" content="撤销任务" placement="top">
                                <img src="../../../../static/img/Group151.png" alt=""
                                    @click="revokeTask(scope.row.id)">
                            </el-tooltip> -->
                            <el-tooltip class="item" effect="dark" content="删除组织" placement="top">
                                <img src="../../../../static/img/Group150.png"
                                    alt="" @click="revokeTask(scope.row.id)">
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
            </article>
        </div>   
    </div>
</template>

<script>
import qs from "qs";
import { postAjax, getAjax } from "../../../api/api.js";
export default {
  created() {
    this.autoType();
    this.autoTable(this.userId,this.currentPage);
  },
  data() {
    return {
      userId: sessionStorage.getItem("userWordId"), //用户的单位id
      wordObj: {}, //XXX下属组织及id
      defaultProps: {
        //搜索下面得节点树
        label: "name",
        children: "zones",
        isParent: "isParent"
      },
      attachment: localStorage.getItem("attachment"), //上传文件得下载（预览）路径
      tableDataTop: [], //最上面表格<.xx账户信息>
      tableData: [], //最下面表格<下级党组织列表>
      tabelType: [], //表格的类型:看企业类别具体是什么名字
      currentPage: 1, //当前页
      totalNum: 1 //总条目数
    };
  },
  methods: {
    treeData(node, resolve) {
      //节点树懒加载数据
      let obj = {};
      if (node.data === undefined) {
        //   //初次加载，只加载根节点
        obj = {
          id: this.userId
        };
        let date = qs.stringify(obj);
        postAjax("ajax/officeTree/sysOfficeTree/treehead", date).then(res => {
          if (res.status == 200) {
            // console.log(res);
            if(res.data.data){
              this.wordObj = {
                id:res.data.data[0].id,
                name:res.data.data[0].name
              }
              return resolve(res.data.data);
            }else{
              this.wordObj ={};
              return resolve([]);
            }
           
          }
        });
      } else {
        obj = {
          pid: node.data.id
        };
        let date = qs.stringify(obj);
        postAjax("ajax/officeTree/sysOfficeTree/treeList", date).then(res => {
          //再次加载，只加载点击节点的
          if (res.status == 200) {
            if (res.data.data) {
              //如果获取到内容显示
              return resolve(res.data.data);
            } else {
              //如果下一级没有了那就返回空
              return resolve([]);
            }
          }
        });
      }
    },
    nodeClick(data) {
      //点击节点树获取内容
      this.wordObj = {
        id:data.id,
        name: data.name
        };
      this.autoTable(data.id,this.currentPage);
    },
    autoType() {
      //判断企业类别
      postAjax("ajax/meeting/taskMeeting/getDict?type=qylb").then(res => {
        this.tabelType = res.data;
      })
    },
    autoTable(id,num) {
      //右侧列表
      let obj = {
        pid: id,
        pageNo:num,
        pageSize:15
      };
      let date = qs.stringify(obj);
      this.tableDataTop = [];
      let arr = "";
      postAjax("ajax/officeTree/sysOfficeTree/list", date).then(res => {
        if (res.status == 200) {
          // console.log(res);
          /*****右侧表格最上面*******/ 
          let txt=res.data.data.sysOffice;
          txt.type=this.tableReturnType(txt.type);
          this.tableDataTop.push(txt);
          /*******右侧表格最下面*********/ 
          this.currentPage = res.data.data.list.pageNo; //当前页
          this.totalNum = res.data.data.list.pageCount //总条目数
          let childList = res.data.data.list.list;
          childList.forEach(item => {
            item.type = this.tableReturnType(item.type);
          });
          this.tableData = childList;
        }
      });
    },
    tableReturnType(num) {  //处理获取到的企业类别
      num = num.split(",");
      let typeName="";
      for (let i = 0; i < this.tabelType.length; i++) {
        for (let j = 0; j < num.length; j++) {
          if (this.tabelType[i].value == num[j]) {
            typeName += this.tabelType[i].label + ",";
          }
        }
      }
      return typeName;
    },
    newAdd(id) {
      //添加机构
      this.$router.push({
        name: "newOrganization",
        query:{
          newId:id
        }
      });
    },
    handleCurrentChange(val) {
      //分页
      this.currentPage=val;
      this.autoTable(this.userId,val);
    },
    taskDetails(id){  //查看详情
      this.$router.push({
        name:"organizationDetails",
        query:{
          lookId:id
        }
      })
    },
    editTask(id) {//编辑
      this.$router.push({
        name:"newOrganization",
        query:{
          editId:id
        }
      })
    },
    revokeTask(id) { //任务撤销 
      // console.log(id);
      this.$confirm('此操作将永久删除该信息, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
            this.removeTask(id);
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
     
    },
    removeTask(id){
       postAjax("ajax/officeTree/sysOfficeTree/delete/" + id).then(res => {
        if (res.status == 200) {
          this.$message({
            type: 'success',
            message: res.data.message
          });
        this.autoTable(this.wordObj.id,this.currentPage);
        }
      });
       
    }
  }
};
</script>

<style scoped>
.global-panel {
  width: 100%;
  height: 100%;
  float: left;
}

/* 右侧样式 */
.panel-ul {
  width: 100%;
  margin: 10px auto;
  box-sizing: border-box;
  /* margin: 10px 5px 0 5px; */
  padding-bottom: 10px;
}
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

.el-rowLy {
  list-style-type: none;
  width: 100%;
  min-height: 35px;
}

.el-rowLy .mark {
  float: left;
  width: 92px;
  font-size: 14px;
  font-weight: normal;
  color: #353639;
}

.el-rowLy .row-text {
  display: inline-block;
  width: calc(100% - 106px);
  font-size: 14px;
  color: #898a8f;
}

.el-rowLy .row-text a {
  color: #4a90e2;
  cursor: pointer;
}

.el-rowLy .row-text a:hover {
  color: #dd0000;
  cursor: pointer;
}

.button-group {
  margin-left: 30px;
  width: 80%;
  height: 54px;
  border-bottom: #ececec 1px solid;
}

/* 按钮默认样式 */
.default {
  font-size: 14px;
  float: left;
  margin-left: 20px;
}

.table-content {
  margin-top: 20px;
  float: left;
  width: 90%;
}

.hr {
  margin: 20px 0px 0px 30px;
  width: 80%;
  border-bottom: #ececec 1px solid;
}

.back-btn {
  margin: 4% 0% 0% 5%;
  width: 5%;
  text-align: center;
}

.audit-btn {
  font-size: 14px;
  border-radius: 5px;
  border: solid 1px #39d1e8;
  color: #39d1e8;
  display: inline-block;
  padding: 3px 20px;
  margin-right: 5px;
  cursor: pointer;
}

.audit-btn:hover {
  border: solid 1px #ff7291;
  color: #ff7291;
  cursor: pointer;
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
