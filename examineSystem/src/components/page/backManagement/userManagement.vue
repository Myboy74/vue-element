<template>
    <div class="userManage">
        <div class="global-panel">
            <article class="left-panel shadowLy">
                <div class="left-panel-title">
                    <span>组织机构</span>
                </div>
                <div class="item-tree-area f_treeW" style="min-height:250px;max-height:500px;overflow-y:auto;overflow-x:auto">
                    <el-tree
                        :props="defaultProps"
                        :load="treeData"
                        lazy
                        @node-click="nodeClick">
                        </el-tree>
                </div>
            </article>
            <article class="right-panel" style="border:none">
                <div class="headTagLy">
                    <h2 class="tag">组织用户维护</h2>
                </div>
                <div class="account shadowLy">
                    <span class="accountTitle">{{wordObj.name}}</span>
                     <el-table
                        :data="tableDataTop" border stripe
                        style="width: 96%;margin:0 auto">
                        <el-table-column
                            label="企业名称">
                            <template slot-scope="scope">
                              <el-tooltip class="item" effect="dark"
                               :content="scope.row.name" placement="right">
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
                            label="党员管理">
                        </el-table-column>
                         <el-table-column
                            prop="address"
                            label="是否直管">
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
                <user-table v-show="show=='0'"  @tabUserTable="isShow" @curentPage="pageNo" @tableRemove="removeTask" ref="userTable"></user-table>
                <edit-user v-show="show=='1'" @tabUserTable="isShow" @newTask="removeTask" ref="editUser"></edit-user>
                <new-user v-show="show=='2'"  @tabUserTable="isShow"  @newTask="removeTask" ref="newUser"></new-user>

            </article>
        </div>
    </div>
</template>

<script>
import qs from "qs";
import { postAjax, getAjax } from "../../../api/api.js";
import userTable from "./userTable.vue";
import newUser from "./newUser.vue";
import editUser from "./editUser.vue";
export default {
  created() {
    this.autoType();
    this.autoTable(this.userId, this.pageNum);
  },
  data() {
    return {
      userId: sessionStorage.getItem("userWordId"), //用户的单位id(其他地方也使用了id会重新复制)
      userWordId: sessionStorage.getItem("userWordId"), //用户的单位id(始终是固定的)
      defaultProps: {
        //搜索下面得节点树
        label: "name",
        children: "zones",
        isLeaf: "leaf"
      },
      tabelType: [], //企业类别
      attachment: localStorage.getItem("attachment"), //上传文件得下载（预览）路径
      tableDataTop: [], //最上面表格.xx账户信息
      show: "0", //控制显示最下面带分页的表格还是新增页面
      wordObj: {}, //点击节点树 //XXX账户及id
      tableBottom: {}, //右面最下面的表格信息及分页
      pageNum: "1", //当前页数
      removeNum: 0 //删除用户信息
    };
  },
  methods: {
    autoType() {
      //判断企业类别
      postAjax("ajax/meeting/taskMeeting/getDict?type=qylb").then(res => {
        this.tabelType = res.data;
      });
    },
    tableReturnType(num) {
      //处理获取到的企业类别
      num = num.split(",");
      let typeName = "";
      for (let i = 0; i < this.tabelType.length; i++) {
        for (let j = 0; j < num.length; j++) {
          if (this.tabelType[i].value == num[j]) {
            typeName += this.tabelType[i].label + ",";
          }
        }
      }
      return typeName;
    },
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
            // console.log(res)
            if (res.data) {
              this.wordObj = {
                id: res.data.data[0].id,
                name: res.data.data[0].name
              };
              // sessionStorage.setItem("userManageId",this.wordObj.id);
              // sessionStorage.setItem("userManageName",this.wordObj.name);
              if (res.data.data[0].id == this.userWordId) {
                //如果id相同隐藏新增按钮
                this.$refs.userTable.showBtn(false);
              }
              this.userId = res.data.data[0].id;
              this.autoTableTop(this.userId);
              // this.$refs.newUser.setWord(this.wordObj) //将单位传给新建
              // this.$refs.editUser.setWord(this.wordObj) //将单位传给编辑
              return resolve(res.data.data);
            } else {
              this.wordObj = {};
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
        id: data.id,
        name: data.name
      };
      if (data.id == this.userWordId) {
        this.$refs.userTable.showBtn(false);
      } else {
        this.$refs.userTable.showBtn(true);
        this.userId = data.id;
        this.autoTable(this.userId, this.pageNum);
        this.autoTableTop(this.userId);
        sessionStorage.setItem("userManageId", this.wordObj.id);
        sessionStorage.setItem("userManageName", this.wordObj.name);
        this.$refs.newUser.setWord(this.wordObj); //将单位传给新建
        this.$refs.editUser.setWord(this.wordObj); //将单位传给编辑
      }
    },
    autoTableTop(id) {
      //获取xxxx账户信息
      this.tableDataTop = [];
      postAjax("ajax/officeTree/sysOfficeTree/info/" + id).then(res => {
        if (res.status == 200) {
          res.data.data.type = this.tableReturnType(res.data.data.type);
          this.tableDataTop.push(res.data.data);
        }
      });
    },
    autoTable(id, num) {
      let obj = {
        "sysOffice.id": id, //组织id
        parentIds: "", //密码
        pageNo: num,
        pageSize: 15
      };
      let date = qs.stringify(obj);
      postAjax("ajax/user/sysUser/list", date).then(res => {
        if (res.status == 200) {
          let childList = res.data.data.page.list;
          childList.forEach((item, index) => {
            item.sysOffice.type = this.tableReturnType(item.sysOffice.type);
          });
          this.tableBottom = res.data.data.page;
          this.$refs.userTable.setContent(this.tableBottom); //编辑状态如果有内容放入内容
        }
      });
    },
    pageNo(val) {
      //切换页
      this.pageNum = val;
      this.autoTable(this.userId, this.pageNum);
    },
    removeTask(val) {
      //删除
      this.removeNum = val; //删除用户信息
      if (this.removeNum == 1) {
        this.autoTableTop(this.userId);
        this.autoTable(this.userId, this.pageNum);
      }
      this.removeNum = 0;
    },
    isShow(val) {
      //点击新增或者返回具体显示哪一个组件
      this.show = val;
      if (this.show == "1") {
        setTimeout(() => {
          //延迟执行,确保session已经改变
          this.$refs.editUser.auto(); //编辑状态如果有内容放入内容
        }, 100);
      }
    }
  },
  components: {
    userTable,
    newUser,
    editUser
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
</style>
