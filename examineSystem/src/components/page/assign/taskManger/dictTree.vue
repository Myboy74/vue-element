<template>
  <div class="w_tree">
    <span v-if="!isShowing" v-text='fieldShowData.label'></span>
    <span style="position:relative;display: block" class="treess">
      <el-input v-if="isShowing" readonly="" v-model='fieldData.label' @click.stop.native="showTree()" @keyup.native="submit"  @focus="focus" placeholder="请选择字段项"></el-input>
    <div v-if="isShowSelect&&isShowing&&isShowSelectx" :class="{'y_search_box':ktSearch}">
      <el-input v-if="ktSearch" placeholder="请输入内容" class="y_search" v-model="searchVal">
            <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
      </el-input>
      <!--<div v-if="ktSearch&&!searchShow" style="text-align: center;width: 100%">加载中...</div>-->
      <el-tree
        v-if="(ktSearch&&searchShow)||!ktSearch"
        :empty-text="empty"
        :expand-on-click-node="false"
        :props="defaultProps"
         node-key="id"
        :default-expanded-keys="defaultExpandedKeys"
        :load="loadNode"
         lazy
         ref="tree"
         @node-click="handleNodeClick"
         class="objectTree" :class="{'y_search_tree':ktSearch}">
        <span  slot-scope="{ node, data }">
          <span class="el-tree-node__label" orgid="''" :class="{'is-disabled':node.disabled,'el-tree-node__dict':node.data.dictCode!=='ORG'}" >{{node.label}}</span>
        </span>
       </el-tree>
    </div>
    </span>
  </div>
</template>
<style scoped>
.is-disabled {
  cursor: not-allowed;
}
/* .el-form-item__error {
} */
/* .el-tree-node__dict {
  background: url("../../../assets/dict.png") no-repeat;
  background-size: 20px 20px;
} */
</style>


<script>
// span
// 参数
// kt-model 绑定字段
// kt-dict 绑定字段字典
// <dict-tree  :kt-model="table.owner_ship" kt-dict="SFDM" ></dict-tree>

// input
// 参数
// kt-model 绑定字段
// kt-dict 绑定字段字典
// kt-leaf 是否只选择叶子节点
// retdict(data) 回调函数  data={table:'绑定表名',field:'绑定参数名',id:'字典id'}
// kt-table 绑定表名
// kt-field 绑定参数名

// <dict-tree  kt-leaf='1' @retdict='retdict' kt-table='base_person' kt-field='a08001a' :kt-model="step7.base_person.objEdit.a08001a" kt-dict="XLDM" ></dict-tree>
import { postAjax, getAjax, oUrl, uploadImg } from "../../../../api/api.js";
import qs from "qs";
export default {
  props: ["ktModel", "ktType", "ktDict", "ktTable", "ktField", "ktLeaf", "ktSearch"],
  data() {
    return {
      dict: this.ktDict,
      isShowSelect: false,
      defaultProps: {
        isLeaf: "leaf"
      },
      empty: "暂无数据",
      user: JSON.parse(sessionStorage.getItem("user")),
      defaultExpandedKeys: [],
      treeData: [],
      fieldData: {},
      fieldShowData: {},
      searchVal: "",
      searchMark: false,
      searchShow: true,
      searchFirstId: '',
      newData: []
    };
  },
  watch: {
    ktModel(curVal, oldVal) {
      if (curVal !== oldVal) {
        this.getInfo();
      }
    },
  },
  computed: {
    isShowing: function () {
      var flag = this.ktType === "input" ? true : false;
      return flag;
    },
    isShowSelectx: function () {
      let selt = this;
      document.addEventListener("click", function () {
        if (!selt.ktSearch) {
          selt.isShowSelect = false;
        }
      });
      return true;
    },

  },
  created() {
    // console.log(this.ktDict)
  },
  methods: {
    focus() {
      if (this.ktSearch) {
        this.searchMark = false;
        this.searchVal = "";
        this.searchShow = true;
      }
    },
    submit($event) {
      let self = this;
      if ($event.keyCode === 8) {
        self.fieldData = {};
        let obj = {
          table: self.ktTable,
          field: self.ktField,
          dict: self.ktDict,
          id: "",
          code: ""
        };
        //  console.log('obj')
        // console.log(obj)
        self.$emit("retdict", obj);
      }
      // else{
      //   self.fieldData =Object.assign({},self.fieldShowData);
      // }
    },
    getInfo() {
      let self = this;
      if (self.dict != "ORG") {
        let id = self.ktModel;
        self.getData(self.dict).then(res => {
          let data = res.filter(x => x.pcode === id);
          if (data.length > 0) {
            self.fieldData = { label: data[0].label };
            self.fieldShowData = { label: data[0].label };
          } else {
            self.fieldData = {};
            self.fieldShowData = {};
          };
        });
      } else {
        let id = self.ktModel;
        // id = "70a50c44-5024-11e7-8fb4-005056a24d7d";
        let url = "/org/info";
        let orgData = qs.stringify({
          orgId: id
        });
        if (id) {
          postAjax(
            url, orgData
          )
            .then(res => {
              let data = res.data.data; //改成tree需要的格式
              if (data != null) {
                self.fieldData = { label: data.d01001 };
                self.fieldShowData = { label: data.d01001 };
              }
            })
            .catch(err => {
              console.log(err);
            });
        } else {
          self.fieldData = {};
          self.fieldShowData = {};
        }
      }
    },
    showTree() {
      this.isShowSelect = !this.isShowSelect;
      this.$forceUpdate();
    },
    getData(dict, orgId) {
      let self = this;
      if (dict != "ORG") {
        if (sessionStorage.getItem("DICT_" + dict) != null) {
          self.treeData = JSON.parse(sessionStorage.getItem("DICT_" + dict));
          return Promise.resolve(self.treeData);
        }
        return getAjax("ajax/meeting/taskMeeting/getDict?type=" + this.ktDict).then(res => {
          let data = res.data; //改成tree需要的格式
          //处理parentId==null
          data.forEach(function (item) {
            if (item.parentId == null) {
              item.parentId = "";
            }
          });
          sessionStorage.setItem("DICT_" + dict, JSON.stringify(data));
          self.treeData = data;
          return self.treeData;
        });
      } else {
        //除第一次加载之外
        let url = "/org/list";
        let orgData = qs.stringify({
          orgId: orgId
        });
        if (self.user.manageOrgId === orgId) {
          url = "/org/orgList";
          //  如果是第一次加载
        }
        return postAjax(url, orgData)
          .then(res => {
            let data = res.data.data || []; //改成tree需要的格式
            self.treeData = data;
            return data; //解决？
          })
          .catch(err => {
            return err;
          });
      }
    },
    loadNode(node, resolve) {
      let self = this;
      let pid = "";
      if (node.level === 0) {
        if (self.dict === "ORG") {
          if (self.searchMark) {
            pid = self.searchFirstId;
            self.defaultExpandedKeys = [];
          } else {
            self.empty = "暂无数据";
            pid = self.user.manageOrgId;
          }
        }
      } else {
        pid = node.data.id;
      }
      self.getChildren(pid, resolve, self.dict);
    },
    getChildren(id, resolve, dict) {
      let self = this;
      if (self.searchMark) {
        let dataStart = self.treeData.filter(x => x.parentId === id);
        self.defaultExpandedKeys.push(id);
        console.log(self.defaultExpandedKeys);
        if (self.$refs.tree != null && self.$refs.tree.getNode(id) != null && dataStart.length > 0) {
          dataStart.forEach(function (item) {
            self.defaultExpandedKeys.push(item.orgId);
          });
          let data = dataStart.map(x => ({
            id: x.orgId,
            code: x.code,
            label: x.orgName,
            dictCode: dict,
            hasChildren: x.hasChildren,
            leaf: x.hasChildren === "0",
            disabled: x.hasChildren !== "0" && self.ktLeaf === "1"
          }));
          return resolve(data); //解决？
        } else if (self.$refs.tree != null && self.$refs.tree.getNode(id) != null && dataStart.length == 0) {
          return resolve([]); //解决？
        } else {
          // console.log("这是searchInfo");
          self.searchInfo().then(res => {
            let data = res.map(x => ({
              id: x.orgId,
              code: x.code,
              label: x.orgName,
              dictCode: dict,
              hasChildren: x.hasChildren,
              leaf: x.hasChildren === "0",
              disabled: x.hasChildren !== "0" && self.ktLeaf === "1"
            }));
            console.log("111");
            console.log(data);
            if (id === self.searchFirstId) {
              data = data.filter(x => x.id === id);
            }
            return resolve(data); //解决？
          })
            .catch(err => {
              console.log(err);
              return resolve([]);
            });
        }
        // self.searchVal="";
      } else if (dict === "ORG" && !self.searchMark) {
        //第一次请求获取啦两层，用来获取第二层的
        let dataStart = self.treeData.filter(x => x.parentId === id);
        // 设置默认展开的数组
        if (self.user.manageOrgId === id && self.$refs.tree == null && dataStart.length == 0) {
          // console.log("这是第一个if");
          self.defaultExpandedKeys = [self.user.manageOrgId];
        }
        if (self.$refs.tree != null && self.$refs.tree.getNode(id) != null && dataStart.length > 0) {
          // console.log("这是第二个if");
          let data = dataStart.map(x => ({
            id: x.orgId,
            code: x.code,
            label: x.orgName,
            dictCode: dict,
            hasChildren: x.hasChildren,
            leaf: x.hasChildren === "0",
            disabled: x.hasChildren !== "0" && self.ktLeaf === "1"
          }));
          return resolve(data); //解决？
        } else if (self.$refs.tree != null && self.$refs.tree.getNode(id) != null && self.user.manageOrgId === id && dataStart.length == 0) {
          return resolve([]); //解决？
        } else {
          // console.log("这是getData");
          self.getData(dict, id).then(res => {
            let data = res.map(x => ({
              id: x.orgId,
              code: x.code,
              label: x.orgName,
              dictCode: dict,
              hasChildren: x.hasChildren,
              leaf: x.hasChildren === "0",
              disabled: x.hasChildren !== "0" && self.ktLeaf === "1"
            }));
            if (id === self.user.manageOrgId) {
              data = data.filter(x => x.id === id);
            }
            return resolve(data); //解决？
          })
            .catch(err => {
              console.log(err);
              return resolve([]);
            });
        }
        self.searchMark = false;
        self.searchMark = false;
      } else {
        self.getData(dict).then(res => {
          let data = res.filter(x => x.parentId === id).map(x => ({
            id: x.value,
            label: x.label,
            dictCode: dict,
            hasChildren: x.hasChildren,
            leaf: x.hasChildren === "0",
            disabled: x.hasChildren !== "0" && self.ktLeaf === "1"
          }));
          return resolve(data); //解决？
        })
          .catch(err => {
            console.log(err);
            return resolve([]);
          });
      }
    },
    handleNodeClick(data, Node) {
      let self = this;
      let flag = false;
      if (self.ktLeaf === "1") {
        if (Node.data.hasChildren === "0") {
          flag = true;
        }
      } else {
        flag = true;
      }
      if (flag) {
        self.fieldData.label = data.label;
        self.retClick(1, data);
        // 关闭选择器
        self.isShowSelect = false;
      }
    },
    retClick(id, data) {
      if (id == 1) {
        let id = data.id;
        let obj = {
          table: this.ktTable,
          field: this.ktField,
          id: id,
          dict: data.dictCode,
          code: data.code || ""
        };
        this.$emit("retdict", obj);
      } else {
      }
    },
    search() {
      let self = this;
      self.searchShow = false;
      if (this.searchVal) {
        self.searchShow = false;
        self.empty = "加载中....";
        let url = "/org/orgList/byName";
        postAjax(url, qs.stringify({ orgName: this.searchVal }))
          .then(res => {
            if (res.data.code === 200) {
              let data = res.data.data || []; //改成tree需要的格式
              self.treeData = data;
              data = data.filter(x => x.parentId === "");
              if (data.length) {
                self.searchFirstId = data[0].orgId;
              } else {
                self.empty = "暂无数据";
              }
              self.searchMark = true;
              self.searchShow = true;
            } else {
              self.searchMark = true;
              self.empty = res.data.msg;
              self.searchShow = true;
            }
          });
      } else {
        self.empty = "暂无数据";
        self.searchMark = false;
        setTimeout(function () {
          self.searchShow = true;
        }, 500)
      }
    },
    searchInfo() {
      let url = "/org/orgList/byName";
      return postAxios(url, qs.stringify({ orgName: this.searchVal }))
        .then(res => {
          let data = res.data.data || []; //改成tree需要的格式
          self.treeData = data;
          return data; //解决？
        })
        .catch(err => {
          return err
        });
    }
  },
  mounted() {
    this.getInfo();
  }
};
</script>
<style scoped>
.j_upload .el-upload-list li .el-upload-list__item-actions {
  display: none !important;
}
.el-menu--dark .el-submenu .el-menu {
  background-color: #e4e8f1;
}
.el-menu--dark .el-menu-item,
.el-menu--dark .el-submenu__title {
  color: #333;
}
.margin-r20 {
  font-size: 18px;
  font-weight: 800;
}
.el-menu--dark {
  background-color: #fff;
}
.el-submenu__title,
.coles {
  font-weight: bold;
}
.el-menu {
  border-right: 1px solid #ddd;
}
.el-submenu,
.coles {
  /* border-top:  1px solid #ddd; */
  border-bottom: 1px solid #ddd;
}
.mks1 .el-dialog__body {
  padding: 5px 10px;
}

.el-pagination {
  text-align: center;
  margin-top: 5px;
}
.wrapper {
  background: #ddd;
}
.el-breadcrumb {
  padding-left: 20px;
  height: 39px;
  line-height: 39px;
  border-bottom: #ccc 1px solid;
  font-size: 14px;
  background: url(../../../../../src/assets/bc-bg.png) repeat-x;
  margin-bottom: 10px;
}
.el-table {
  font-size: 12px;
}
.el-table td,
.el-table th {
  padding: 3px 8px !important;
}
.crumbs {
  padding: 15px;
  background: #fff;
  font-size: 14px;
  background: url(../../../../../src/assets/bc-bg.png) repeat-x;
}
.ms-doc {
  background: #fff;
  width: 98%;
  border: 1px #ccc solid;
  border-radius: 4px;
  margin: 0 auto;
  padding: 5px;
  margin-bottom: 10px;
}
.mks1 .el-dialog__header {
  border-bottom: 1px solid #d2d2d2;
}

.el-breadcrumb {
  font-size: 12px;
}
.el-form-item__label {
  font-size: 12px;
  width: 100%;
  color: #333;
  text-align: left;
  padding: 0;
}
.el-textarea textarea {
  resize: none;
  height: 100px;
  /* width: 500px; */
}
.el-breadcrumb__item__inner {
  color: #333;
}
th {
  background: #ddd;
  color: #333;
}
.el-tree-node__label {
  font-size: 16px;
  padding-left: 20px;
  /* background: url("../../../../../src/assets/dangwu.png") left no-repeat; */
  background-size: 20px 20px;
}
/* 根节点'+'号样式 */
.el-tree-node__expand-icon {
  font-size: 16px;
  padding-left: 20px;
  color: transparent;
  background: url("../../../../../src/assets/32px.png") left no-repeat;
  background-position: -100px -4px;
}
.el-icon-caret-right:before {
  content: "\E60E";
}
.el-upload--text {
  width: auto !important;
  height: auto !important;
}
.el-tree {
  position: absolute;
  top: 40px;
  left: 0px;
  z-index: 1000;
  width: 100%;
  height: 300px;
  overflow: auto;
  background: rgb(248, 247, 247);
}
/* .el-tree-node>.el-tree-node__children{
      overflow: inherit !important;
  } */
.el-dialog__body {
  margin: 10px 0;
}
.elcs .el-input__inner {
  height: 32px;
  font-size: 12px;
}

.cf::after,
.cf::before {
  content: "";
  height: 0;
  line-height: 0;
  display: block;
  visibility: hidden;
  clear: both;
}

.cf {
  zoom: 1;
}
.mks1 .el-dialog__header {
  padding-top: 15px;
}

.el-table.y_el_table td,
.el-table.y_el_table th {
  padding: 7px 0 !important;
  font-size: 14px;
  line-height: 5px;
}
.el-table.y_el_table th {
  background-color: #f5f7fa;
  color: #606266;
}
.el-date-table th {
  background-color: #fff;
}

.ms-doc .el-form-item__content .el-select .el-input--suffix .el-input__inner {
  padding-right: 15px !important;
}

/*定义滚动条高宽及背景 高宽分别对应横竖滚动条的尺寸*/

::-webkit-scrollbar {
  width: 9px;
  /*滚动条宽度*/
  height: 9px;
  /*滚动条高度*/
}

/*定义滚动条轨道 内阴影+圆角*/

::-webkit-scrollbar-track {
  /* -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);   */
  border-radius: 3px;
  /*滚动条的背景区域的圆角*/
  background-color: none;
  /*滚动条的背景颜色*/
}

/*定义滑块 内阴影+圆角*/

::-webkit-scrollbar-thumb {
  border-radius: 3px;
  /*滚动条的圆角*/
  /* -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,.3);   */
  background-color: #e1e1e1;
  /*滚动条的背景颜色*/
}

.j_elabel .el-form-item__label {
  line-height: 22px;
}
.isfold {
  margin-bottom: 0px;
}

/* .el-dialog__title::before {
    content: "";
    display: inline-block;
    height: 25px;
    margin-right: 10px;
    width: 2px;
    background: #e91b1b;
    vertical-align: bottom;
  } */
.mks1 .el-dialog__header {
  text-align: left;
}
/* 树形菜单单击动画屏蔽 */
.el-tree-node__expand-icon.expanded {
  -webkit-transform: none;
  transform: none;
  background: url("../../../../../src/assets/32px.png") left no-repeat;
  background-position: -132px -4px;
}
/* .el-tree-node{
        background-image: url("../../src/assets/32px.png");
        background-position: -292px -4px;
        background-repeat: repeat-y;
    } */
.el-tree-node:last-child {
  background-image: url("");
}
/* 叶子节点样式 */
.is-leaf {
  background-image: url("../../../../../src/assets/32px.png") left no-repeat;
  background-position: -68px -4px;
}
.is-current {
  background: transparent !important;
}
.is-current > .el-tree-node__content > .custom-tree-node {
  background: #beebff;
  border-radius: 2px;
  box-shadow: inset 0 0 1px #999999;
  text-align: left;
}

.el-tree-node__content {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  width: 94%;
  min-height: 25px;
  padding-bottom: 5px;
  cursor: pointer;
  margin-bottom: 0px;
  border-radius: 5px;
  justify-content: left !important;
}
.is-current > .el-tree-node__content {
  height: 35px;
  line-height: 20px;
  justify-content: left !important;
}
.j_dia .el-dialog__header::before {
  content: "";
  display: inline-block;
  height: 25px;
  margin-right: 10px;
  width: 2px;
  background: #e91b1b;
  vertical-align: bottom;
}

.el-form-item__error {
  position: absolute;
  top: -35px;
  background: #fff;
  /* min-width: 120px; */
  border-radius: 4px;
  border: 1px solid #fbc4c4;
  padding: 7px;
  z-index: 2000;
  /*color: #606266;*/
  color: #f56c6c;
  line-height: 1.4;
  text-align: center;
  margin: 0;
  font-size: 12px;
  -webkit-box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}
.el-textarea {
  display: block;
}

.el-form-item__error:after {
  border-width: 6px;
  position: absolute;
  display: block;
  width: 0;
  height: 0;
  border-color: transparent;
  border-style: solid;
  border-top-color: #fbc4c4;
  border-bottom-width: 0;
  content: " ";
  bottom: -6px;
  left: 0;
  right: 0;
  margin: auto;
}
.j_input .el-input {
  width: 95px;
}

.el-tabs__item:hover {
  color: #303133;
  cursor: pointer;
}

.el-tabs__active-bar {
  background-color: #e91b1b;
}

.el-tabs__item.is-active {
  color: #e91b1b;
  font-weight: bold;
}
.j_wid .el-form-item__content {
  width: 150px;
}
.j_dia .el-form-item {
  margin-bottom: 0px;
}
.j_dia .el-form-item span {
  font-weight: normal;
}
.sidebar .el-menu-vertical-demo .el-menu-item.is-active {
  color: #e91b1b;
}
.j_t1 {
  width: 22px;
  height: 22px;
  display: inline-block;
  background: url(../../../../../static/img/icons-22.png) no-repeat;
  background-position: 0px -748px;
  /* background-position-x: -66px; */
}
.j_t2 {
  width: 22px;
  height: 22px;
  display: inline-block;
  background: url(../../../../../static/img/icons-22.png) no-repeat;
  background-position: 0px -748px;
  background-position-x: -66px;
}
.j_lz .el-form-item__label {
  text-indent: 9px;
}
.j_supin .el-input__inner {
  width: 175px;
}
.el-form-item__label {
  font-size: 14px;
  width: 100%;
  color: #333;
  text-align: left;
  padding: 0;
  font-weight: bold;
}
.el-row {
  box-sizing: border-box;
  border-bottom: 1px solid #e2e6ea;
}
.el-form-item {
  margin-bottom: 0 !important;
  padding: 3px 0px;
}

.j_form .el-form-item {
  margin: 0;
}
.noline .el-form--inline .el-form-item__label {
  line-height: 20px;
}
.j_dia .el-input__inner {
  width: 202px;
}
.j_dia2 .el-dialog__body {
  height: 400px;
  overflow-y: auto;
}
.j_mid label {
  margin-top: 10px;
}
.j_dia3 .el-dialog__body {
  margin-top: 0px;
}
.el-form-item__label {
  font-size: 12px;
}
.j_tabs .el-tabs__nav-scroll {
  margin-left: 15px;
}
.j_tabs .el-tabs__nav-prev {
  left: 10px;
}
.j_tabs .el-tabs__nav-next {
  right: 5px;
}
.showfujian .el-upload--picture-card {
  display: none;
}
.j_pop {
  top: 50px !important;
  width: 100px;
}
.j_pop .el-dropdown-menu__item {
  line-height: 12px;
}
.j_icon {
  background: url(../../../../../static/img/lnews.png);
  width: 32px;
  height: 32px;
  display: inline-block;
}
.j_elm {
  padding-left: 10px !important;
  border-top: 1px solid #ddd;
}
</style>
