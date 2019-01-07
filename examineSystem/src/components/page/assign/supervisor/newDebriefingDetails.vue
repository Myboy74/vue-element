<template>
    <div>
        <div class="headTagLy ">
            <h2 class="tag" v-if="!id">述职评议任务创建</h2>
            <h2 class="tag" v-if="id">述职评议任务修改</h2>
        </div>
        <div class="shadowLy create newSupercior">
            <el-form :rules="rules" ref="form" :model="form" label-width="80px">
                <div>
                    <el-form-item label="任务名称" prop="name" style="margin:20px 0 0 10px">
                        <el-input v-model="form.name" class="wid" placeholder="请输入任务名称"></el-input>
                    </el-form-item>
                </div>
                <div>
                  <el-form-item label="紧急程度" style="margin: 20px 0 10px 10px">
                    <el-select v-model="form.region">
                     <el-option v-for="item in options" :key="item.value" 
                        :label="item.label" :value="item.value">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </div>
                <div style="position: relative;margin: 10px 10px 0">
                   <fileUpload @fileAddress="uploadAdres" @fileSuccess="uploadSuccess" ref="flieUpload"></fileUpload>
                </div>
                <div>
                    <el-form-item label="任务内容" prop="content" style="margin:0 0 20px 10px">
                      <el-input type="textarea" style="width:350px;" v-model="form.content" placeholder="请输入任务描述"></el-input>
                    </el-form-item>
                </div>
                <div class="cle">
                   <el-form-item label="活动时间" prop="time" style="margin:0 0 10px 10px">
                       <el-date-picker style="width:36%" v-model="form.time" 
                       type="daterange" range-separator="至"
                        value-format="yyyy-MM-dd" placeholder="年/月/日" 
                        start-placeholder="开始日期" end-placeholder="结束日期"
                       >
                      </el-date-picker>
                    </el-form-item>
                </div>
              <div class="cle">
                <label>述职明细</label>
                <el-button class="copyUnit" @click="addSubTask" style="margin-left:12px">添加打分</el-button>
                <div class="chlidTable">
                    <el-table :data="form.subTaskList"
                     border stripe 
                     style="width: 100%;margin-top:20px">
                        <el-table-column label="单位名称" width="280">
                           <template slot-scope="scope">
                             <input type="hidden" v-model="scope.row.ddmc">
                              <el-input disabled v-model="scope.row.name" class="f_input el-icon-search" @click.native="seleteMenu(scope.row.ddmc)"></el-input>
                            </template>
                        </el-table-column>
                        <el-table-column  label="描述">
                           <template slot-scope="scope">
                              <el-input v-model="scope.row.ms"></el-input>
                           </template>
                        </el-table-column>
                        <el-table-column  label="分值"  width="100" >
                           <template slot-scope="scope">
                              <el-input v-model="scope.row.tjfz" type="Number"></el-input>
                           </template>
                        </el-table-column>
                        <el-table-column label="评选人"  width="120" >
                           <template slot-scope="scope">
                              <el-input v-model="scope.row.jcr"></el-input>
                           </template>
                        </el-table-column>
                        <el-table-column label="述职时间" width="220">
                           <template slot-scope="scope">
                               <el-date-picker
                               type="datetime"
                                value-format="yyyy-MM-dd HH:mm:ss"
                                placeholder="年-月-日 时/分/秒" class="f_time" style="margin:0 auto"
                                 v-model="scope.row.jcsj">
                              </el-date-picker>
                           </template>
                        </el-table-column>
                        <el-table-column label="备注" width="200">
                           <template slot-scope="scope"  type="index">
                             <i class="removeIcon el-icon-circle-close" @click="removeUnit(scope.row.ddmc)">
                               <!-- {{scope.row.num}} -->
                               </i>
                              <el-input style="width:70%;" v-model="scope.row.bz"></el-input>
                             </template>
                        </el-table-column>
                    </el-table>
                </div>
            </div>
            </el-form>
            <div class="button clear" style="margin-left:20px">
              <button class="f_btn f_green"  @click="submitForm('form')">保存</button>
              <button @click="onIndex">返回</button>
            </div>
           <!-- 选择单位的弹出框 -->
           <el-dialog title="选择单位" :visible.sync="dialogTableVisible">
              <el-tree
              style="max-height:350px;overflow-y:auto"
                :data="treeData"
                show-checkbox
                node-key="id" 
                :props="defaultProps"
                check-strictly
                @check-change="handleClick" 
                ref="treeForm">           
              </el-tree>
              <div slot="footer" class="dialog-footer">
                <el-button @click="dialogTableVisible = false">取 消</el-button>
                <el-button type="primary" @click="getCheckedNodes">确 定</el-button>
              </div>
          </el-dialog>
        </div>
    </div>
</template>

<script>
import qs from "qs";
import { postAjax, getAjax, oUrl, uploadImg } from "../../../../api/api.js";
import fileUpload from "../../common/fileUpload.vue";
export default {
  components: {
    fileUpload
  },
  created() {
    this.autoWord();
    this.autoTree();
    if (this.id) {
      //如果是修改执行
      this.autoEdit(this.id);
    }
  },
  mounted() {
    this.$refs.flieUpload.auto(this.uploadAdres); //给上传地址传一个后缀地址
  },
  data() {
    return {
      id: this.$route.query.editDetails, //修改状态
      uploadAdres: "?uploadPath=debriefing", //上传文件的地址
      attachmentUrl: localStorage.getItem("attachment"), //上传文件得下载（预览）路径
      form: {
        name: "", //任务名称
        content: "", //任务内容
        region: "", //紧急程度
        time: "", //起止时间
        subTaskList: [] //子任务表格
      },
      options: [], //紧急程度下拉框
      rules: {
        name: [
          {
            required: true,
            message: "请输入任务名称",
            trigger: ["blur", "change"]
          }
        ],
        content: [
          {
            required: true,
            message: "请输入任务描述",
            trigger: ["blur", "change"]
          }
        ],
        region: [
          {
            required: true,
            message: "请输入任务名称",
            trigger: ["blur", "change"]
          }
        ],
        time: [
          {
            required: true,
            message: "请输选择时间",
            trigger: ["blur", "change"]
          }
        ]
      },
      defaultProps: {
        children: "children",
        label: "label"
      },
      arrId: 0, //选择的单位的当前id
      dialogTableVisible: false, //弹窗
      i: 0, //设置节点树
      treeData: [], //节点树
      addChildTable: true //打分添加
    };
  },
  methods: {
    autoEdit(id) {
      //是修改状态
      postAjax("ajax/szpy/szpy/form?id=" + id).then(res => {
        if (res.status == 200) {
          let date = res.data.data.szpy;
          this.form = {
            id: id, //	主键值
            name: date.rwbt, //任务名称
            szpyNum: date.szpyNum, //	任务编号
            region: date.jjcd, //紧急程度
            content: date.rwnr, //	任务内容
            fj: date.fj, //附件
            time: [date.kssj, date.jssj], //开始时间//结束时间
            subTaskList: date.khlist //打分明细
          };
          this.form.subTaskList.forEach((item, index) => {
            this.form.subTaskList[index].name = item.shortName;
          });
          if (this.form.fj) {
            let file = [];
            let arr = this.form.fj.split("|");
            arr.forEach((element, ind) => {
              //获取文件名称
              var index = element.lastIndexOf("/");
              element = element.substring(index + 1, element.length);
              element = decodeURI(element);
              if (element) {
                file.push({
                  name: element,
                  url: arr[ind]
                });
              }
            });
            this.$refs.flieUpload.filelist(file);
          }
        }
      });
    },
    autoWord() {
      //紧急程度
      postAjax("ajax/meeting/taskMeeting/getDict?type=taskLevel").then(res => {
        this.options = res.data;
      });
    },
    autoTree() {
      getAjax("ajax/office/sysOffice/treeData").then(res => {
        this.treeData = res.data; //节点树
      });
    },
    seleteMenu(id) {
      //点击选择单位
      this.dialogTableVisible = true;
      this.arrId = id;
    },
    removeUnit(ind) {
      //删除其中一个子任务
      let index = -1;
      for (let i = 0; i < this.form.subTaskList.length; i++) {
        if (this.form.subTaskList[i].ddmc === ind) {
          index = i;
        }
      }
      if (index > -1) {
        this.form.subTaskList.splice(index, 1);
      }
    },
    handleClick(data, checked, node) {
      //节点树(限制只能单选)
      this.i++;
      if (this.i % 2 == 0) {
        if (checked) {
          this.$refs.treeForm.setCheckedNodes([data]);
          //交叉点击节点
        } else {
          this.$refs.treeForm.setCheckedNodes([]);
          //点击已经选中的节点，置空
        }
      }
    },
    uploadSuccess(val) {
      //上传文件的信息
      let str = "";
      val.forEach(element => {
        str += element.url + "|";
      });
      this.form.fj = str;
    },
    addSubTask() {
      //添加打分明细
      if (this.form.subTaskList.length) {
        this.nextList();
        if (!this.addChildTable) {
          return;
        }
      }
      this.form.subTaskList.push({
        name: "",
        ddmc: this.arrId, //单位id
        ms: "", //描述
        tjfz: "", //分值
        jcr: "", //检查人
        jcsj: "", //检查时间
        bz: "" //备注
      });
    },
    nextList() {
      //判断当前存在的任务是否填写
      this.form.subTaskList.forEach(item => {
        if (!item.ddmc || !item.ms || !item.tjfz || !item.jcr || !item.jcsj) {
          this.$message({
            message: "请完善信息!!!",
            type: "warning"
          });
          this.addChildTable = false;
        } else {
          this.addChildTable = true;
        }
      });
    },
    getCheckedNodes() {
      //节点树方法
      let bootId = "";
      let obj = this.$refs.treeForm.getCheckedNodes();
      for (let i in this.treeData) {
        if (this.treeData[i].children) {
          bootId = this.treeData[i].id;
        }
      }
      if (obj[0].id == bootId) {
        this.$message({
          type: "warning",
          message: "您不能选择本单位，请重新选择！"
        });
        return;
      }
      this.dialogTableVisible = false;
      this.form.subTaskList.forEach((item, index) => {
        if (item.ddmc == this.arrId) {
          this.form.subTaskList[index].ddmc = obj[0].id; //单位id
          this.form.subTaskList[index].name = obj[0].label; //单位名称
        }
      });
    },
    onIndex() {
      //返回到首页
      window.history.back(-1);
    },
    submitForm(formName) {
      //保存之前的验证
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.verifyContent();
          if (this.addChildTable) {
            this.lowerHair(); //通过验证则保存
          }
          //如果通过验证 to do...
        } else {
          this.$message({
            message: "您填的信息有误,请进行核实后在保存!!!",
            type: "warning"
          });
          return false;
        }
      });
    },
    verifyLen(val) {
      //验证字符长度
      var len = 0;
      for (var i = 0; i < val.length; i++) {
        var a = val.charAt(i);
        if (a.match(/[^\x00-\xff]/gi) != null) {
          len += 2;
        } else {
          len += 1;
        }
      }
      return len;
    },
    verifyContent() {
      //验证需要验证的内容长度
      this.addChildTable = true;
      let maxChars = 200; //任务名称
      let curr = maxChars - this.verifyLen(this.form.name);
      if (curr < 0) {
        this.$message({
          message: "任务名称字符不得超过200!!!",
          type: "warning"
        });
        this.addChildTable = false;
        return false;
      }
      let maxrwbt = 1000;//任务内容
      let currlen = maxrwbt - this.verifyLen(this.form.content);
      if (currlen < 0) {
        this.$message({
          message: "任务内容字符不得超过1000!!!",
          type: "warning"
        });
        this.addChildTable = false;
        return false;
      }
    },
    lowerHair() {
      if (this.form.subTaskList.length) {
        this.nextList(); //验证是否信息填完整
        if (!this.addChildTable) {
          //如果验证不通过
          return;
        }
      }
      for (let i in this.form.subTaskList) {
        let num = this.form.subTaskList[i].tjfz.indexOf(".");
        if (num) {
          //如果是小数
          let len = this.form.subTaskList[i].tjfz.split(".")[1];
          if(len){
            if (len.length > 2) {
            this.$message({
              message: "请提交2位小数以内分数!!!",
              type: "warning"
            });
            return false;
          }
          }
          
        }
      }
      //验证后保存
      let obj = {
        id: this.id, //	主键值
        rwbt: this.form.name, //任务名称
        szpyNum: "", //	任务编号
        jjcd: this.form.region, //紧急程度
        rwnr: this.form.content, //	任务内容
        fj: this.form.fj, //附件
        kssj: this.form.time[0], //开始时间
        jssj: this.form.time[1], //结束时间
        khlist: this.form.subTaskList //打分明细
      };
      //  let data = qs.stringify(obj);
      postAjax("ajax/szpy/szpy/save", obj).then(res => {
        if (res.data.state == 1) {
          this.$message({
            message: res.data.message,
            type: "success"
          });
          this.$router.push({
            name: "f_debriefingComment"
          });
        } else {
          this.$message({
            message: res.data.message,
            type: "error"
          });
        }
      });
    }
  }
};
</script>

<style scoped>
.create {
  padding: 10px;
  margin-top: 10px;
  font-size: 14px;
}
.create > div {
  margin-top: 10px;
}
.create div label {
  margin-left: 20px;
}

.wid {
  width: 220px;
}

.create .ui-selectmenu-button.ui-button {
  height: 25px !important;
  margin-left: 10px;
}

.create .ui-selectmenu-text {
  margin-top: 5px;
}

.create .ui-selectmenu-icon.ui-icon {
  margin-top: 3px;
}

.create div input.scoreInput {
  width: 45px;
  margin: 10px 25px;
  padding-left: 0;
  text-align: center;
}

.copyUnit {
  margin: 10px 15px 0;
}

.create .childTable {
  text-align: center;
}

.create .childTable p {
  border: 1px solid black;
  border-bottom: none;
  color: black;
  margin: 20px 0 0 0;
  padding: 10px 0;
  font-weight: bold;
  background: #3dadf2;
}

.create .button {
  height: 30px;
  margin: 20px auto;
}

.create .button button {
  border: none;
  float: left;
  margin-right: 30px;
  padding: 10px 30px;
  border-radius: 5px;
  /* color: white; */
}

.create .button button:last-child:hover {
  background: #e6e0e0;
}

.create div.topScore {
  margin-left: 90px;
  border: 1px solid #cccccc;
  border-radius: 5px;
}

.topScore p span {
  display: inline-block;
  padding: 5px 56px;
}

.topScore p span.total {
  display: block;
  float: right;
  padding: 0;
  margin: 18px 42px 0 0;
}

.topScore p span + span {
  border-left: 1px solid #cccccc;
}

.iconfont {
  margin-left: -25px;
}
.create div.copyScore,
.create div.chlidTable {
  margin-left: 90px;
}
.copyScore .el-tag,
.choiceWork .el-tag {
  background: #e7eaf9 !important;
  color: #5c74d8 !important;
  border: none !important;
  margin: 0 10px 10px 0;
}
.choiceWork .el-tag {
  background: #ffecd9 !important;
  color: #ff7e00 !important;
}
.el-date-editor.el-input {
  margin-left: 12px;
}
.dict-tree-list > .el-tree {
  width: 228px !important;
}
.dict-tree-list > .el-tree .el-tree-node__content {
  width: 49% !important;
  text-align: left !important;
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
.f_input::after {
  content: "";
  width: 18%;
  height: 100%;
  position: absolute;
  top: 0;
  right: 0;
  cursor: pointer;
  background: #cccc;
  border-radius: 5%;
}
.removeIcon {
  width: 20px;
  height: 20px;
  position: absolute;
  top: 40%;
  right: 0%;
  cursor: pointer;
  border-radius: 5%;
  transform: translate(-40%, -20%);
}
.f_time {
  width: 195px !important;
}
</style>
