<template>
    <div>
        <div class="headTagLy">
            <h2 class="tag">{{title}}</h2>
            </div>
             <div class="shadowLy create newTask">
                  <el-form :rules="rules" ref="form" :model="form" label-width="80px">
                    <!-- <div>
                       <label>会议类型</label>
                        <el-select class="search-input" v-model="form.meetingtype" placeholder=" ">
                            <el-option
                                    v-for="item in optionsDuty"
                                    :key="item.id"
                                    :label="item.label"
                                    :value="item.id">
                            </el-option>
                        </el-select>
                    </div> -->
                 <div>
                     <el-form-item label="会议主题" prop="title">
                        <el-input placeholder="请输入会议主题" class="wid" v-model="form.title"></el-input>
                      </el-form-item>
                </div>
        
                <div class="f_Etext">
                   <el-form-item label="会议描述" prop="summary">
                      <el-input type="textarea" placeholder="请输入会议内容" v-model="form.summary" class="textrea"></el-input>
                    </el-form-item>
                   </div>
                 <div style="position: relative" class="cle f_Etext">
                    <el-form-item label="参会人员要求" prop="requirement">
                      <el-input type="textarea" placeholder="请输入会议人员要求" v-model="form.requirement" class="textrea"></el-input>
                    </el-form-item>
                    </div>
                <div class="cle">
                    <el-form-item label="会议时间" prop="meetingtime">
                      <el-date-picker
                        v-model="form.meetingtime"
                        type="datetime"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        placeholder="会议时间">
                      </el-date-picker>
                    </el-form-item>
                </div>
                  <div>
                      <el-form-item label="会议地点" prop="address">
                        <el-input v-model="form.address" class="wid" placeholder="请输入会议地点"></el-input>
                      </el-form-item>
                </div>
                <div>
                    <el-form-item label="上报截止" prop="limitetime">
                    <el-date-picker
                      v-model="form.limitetime"
                      type="datetime"
                      value-format="yyyy-MM-dd HH:mm:ss"
                      placeholder="结束时间">
                    </el-date-picker>
                  </el-form-item>   
                </div>
                <div>
                    <label>下发单位</label>
                      <el-button class="copyUnit"  @click="lowerWord">选择下发单位</el-button>
                     <!-- <input type="button" value="选择下发单位" class="copyUnit"  @click="lowerWord"> -->
                    <div class="copyScore">
                          <el-tag
                          v-if="form.receiveorg.length"
                    v-for="tag in form.receiveorg"
                    :key="tag.id"
                    closable
                    :id="tag.id"
                    :disable-transitions="false"
                    @close="handleClose(tag)">
                    {{tag.label}}
                    </el-tag>
                    </div>
                </div>
                <div class="cle">
                    <label>抄送单位</label>
                       <el-button class="copyUnit"  @click="lowerWord">选择抄送单位</el-button>
                    <!-- <input type="button" value="选择抄送单位" class="copyUnit" @click="lowerWord"> -->
                   <div class="copyScore choiceWork">
                          <el-tag
                           v-if="form.duplicateorg.length"
                    v-for="tag in form.duplicateorg"
                    :key="tag.id"
                    closable
                    :id="tag.id"
                    :disable-transitions="false"
                    @close="copyWords(tag)">
                    {{tag.label}}
                    </el-tag>
                    </div>
                </div>
                 <div style="position: relative">
                    <span style="position: absolute;top: 10px;left: 20px;">附件上传</span>
                    <div style="margin-left:90px;">
                          <el-upload
                    class="upload-demo"
                        :action="uploadImg"
                        :on-remove="handleRemove"
                        :file-list="fileAttach"
                        :with-credentials="true" 
                        :onSuccess="uploadSuccess"
                        :onError="uploadError"
                        :before-upload="beforeAvatarUpload"
                       >
                <el-button size="small" type="primary">点击上传</el-button>
                <div slot="tip" class="el-upload__tip">文件只能上传jpg,png,gif,doc,docx,ppt,pptx,xls,xlsx,pdf,txt,zip,rar格式，且不超过5MB</div>
                </el-upload>
              </div>
            </div>
             <div>
                <el-form-item label="会议总分" prop="score">
                  <el-input  class="wid" placeholder="请输入会议总分" v-model.number="form.score" onkeypress="return(/^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/.test(String.fromCharCode(event.keyCode) ) )"></el-input>
                </el-form-item>
                   </div>
                <div class="button clear">
                    <input type="button" class="f_btn f_deepBlue" @click="onBtn(1)" :plain="true" value="保存">
                    <input type="button" class="f_btn f_green" @click="onBtn(2)" :plain="true" value="下发">
                    <input type="button" class="f_btn" style="color:#000;" @click="retunIndex" value="返回">
                 </div>
                  </el-form>
                    <!-- 选择下发单位弹窗 -->
           <el-dialog :visible.sync="dialogWord" class="newDialog f_lowerWord">
             <div class="headTagLy">
                <h2 class="tag">{{wordTitle}}</h2>
              </div>
              <div style="width:80%;max-height:300px;overflow-y:auto;margin:0 auto;">
              <el-tree
                :data="data2"
                show-checkbox
                node-key="id"
                :default-checked-keys="wordTitle == '选择下发单位' ? defaultCopyCheck : dynamicCheck"
                :default-expand-all="true"
                ref="tree"
                :props="defaultProps">
              </el-tree>
              </div>
              <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="getNode">保 存</el-button>
                <el-button @click="dialogWord = false">返 回</el-button>
            </div>
          </el-dialog>   
            </div>
      
    </div>
</template>

<script>
import qs from "qs";
import { postAjax, getAjax, oUrl, uploadImg } from "../../../../api/api.js";
export default {
  created() {
    if (this.edit) {
      this.title = "编辑会议";
      this.editMove(this.edit);
    } else {
      this.meetingType();
    }
  },
  data() {
    return {
      title: "创建会议",
      edit: this.$route.query.edit,
      optionsDuty: "", //会议类型
      attachmentUrl: localStorage.getItem("attachment"), //上传文件得下载（预览）路径
      uploadImg: uploadImg() + "?uploadPath=/meeting", //文件上传地址
      form: {
        id: "",
        flag: "", //保存还是下发
        // meetingtype: "", //会议类型
        title: "", //会议主题
        summary: "", //会议描述
        requirement: "", //会议人员要求
        meetingtime: "", // 会议时间
        address: "", // 截止时间
        limitetime: "", //会议地点
        receiveorg: [], //下发单位
        duplicateorg: [], //抄送单位
        score: "", //会议总分
        attachment: "" //文件
      },
      fileAttach: [], //文件上传
      attachment: [], //文件上传成功后得数据
      rules: {
        title: [
          {
            required: true,
            message: "请选择会议主题",
            trigger: ["blur", "change"]
          }
        ],
        summary: [
          {
            required: true,
            message: "请输入会议描述",
            trigger: ["blur", "change"]
          },
          {
            pattern: /^([\w\W]){1,500}$/,
            message: "输入的是字符不能超过500",
            trigger: ["blur", "change"]
          }
        ],
        requirement: [
          { required: false, trigger: ["blur", "change"] },
          {
            pattern: /^([\w\W]){1,200}$/,
            message: "输入的是字符不能超过200",
            trigger: ["blur", "change"]
          }
        ],
        meetingtime: [
          {
            required: true,
            message: "请选择会议时间",
            trigger: ["blur", "change"]
          }
        ],
        address: [
          {
            required: true,
            message: "请输入会议地点",
            trigger: ["blur", "change"]
          }
        ],
        limitetime: [
          {
            required: true,
            message: "请选择截止时间",
            trigger: ["blur", "change"]
          }
        ],
        receiveorg: [
          {
            required: true,
            message: "请选择抄送单位",
            trigger: ["blur", "change"]
          }
        ],
        score: [
          {
            required: true,
            message: "请输入会议总分",
            trigger: ["blur", "change"]
          },
          {
            pattern: /^[\d]+$/,
            message: "输入必须是数字",
            trigger: ["blur", "change"]
          }
        ]
      },
      data2: [], //节点树
      defaultProps: {
        children: "children",
        label: "label"
      },
      defaultCopyCheck: [], //默认选择下发和树
      dynamicCheck: [], //默认选择抄送和树
      //抄送单位
      dialogWord: false, //弹框
      wordTitle: "", //弹窗标题
    };
  },
  methods: {
    meetingType() {
      //会议类型
      getAjax("ajax/meeting/taskMeeting/getDict")
        .then(res => {
          // console.log(res);
          this.optionsDuty = res.data;
        })
    },
    editMove(num) {
      //会议编辑
      // console.log(num);
      postAjax("ajax/meeting/taskMeeting/detail?id=" + num)
        .then(res => {
          if (res.status == 200) {
            // console.log(res);
            let date = res.data.data.taskMeeting;
            var wordbottom = []; //下发单位id
            var bottomName = []; //下发单位 名称
            var wordcopy = []; //抄送单位id
            var copyName = []; //抄送单位 名称
            //下发单位 date.receiveorg
            //抄送单位 date.duplicateorg

            //删除数组最后一位
            function truncate(arr) {
              var m = [];
              for (var i = 0; i < arr.length - 1; i++) {
                m.push(arr[i]);
              }
              return m;
            }
            //让获取到的字符串变成数组，
            wordbottom = date.receiveorg.split(","); //下发单位id

            this.defaultCopyCheck = wordbottom; //给下发单位的树赋一个默认值

            bottomName = date.receiveOrgName.split(","); //下发单位 名称
            wordcopy = date.duplicateorg.split(","); //抄送单位id

            this.dynamicCheck = wordcopy; //给抄送单位的树赋一个默认值

            copyName = date.duplicateOrgName.split(","); //抄送单位 名称
            //变成数组形式
            wordbottom = truncate(wordbottom); //下发单位id
            wordcopy = truncate(wordcopy); //抄送单位id

            var bottom = []; //下发单位
            var chao = []; //抄送单位
            // console.log(wordcopy);
            for (var i = 0; i < wordbottom.length; i++) {
              bottom.push({
                id: wordbottom[i],
                label: bottomName[i]
              });
            }
            for (var j = 0; j < wordcopy.length; j++) {
              chao.push({
                id: wordcopy[j],
                label: copyName[j]
              });
            }

            let arr = "";
            arr = date.attachment.split("|");
            arr.forEach((element, ind) => {
              //获取文件名称
              var index = element.lastIndexOf("/");
              element = element.substring(index + 1, element.length);
              element = decodeURI(element);
              this.fileAttach.push({
                name: element,
                url: arr[ind]
              });
              this.attachment.push(arr[ind]);
            });
            this.form = {
              //  flag: "", //1保存还是2下发
              // meetingtype: "", //会议类型
              id: num,
              title: date.title, //会议主题
              summary: date.summary, //会议描述
              requirement: date.requirement, //会议人员要求
              meetingtime: date.meetingtime, // 会议时间
              address: date.address, // 截止时间
              limitetime: date.limitetime, //会议地点
              receiveorg: bottom, //   //下发单位
              duplicateorg: chao, //   //抄送单位
              score: date.score //会议总分
              // attachment: [] //文件上传
            };
          } else {
            this.$message({
              showClose: true,
              message: "会议信息获取失败",
              type: "warning"
            });
            this.$router.push({
              name: "f_meeting"
            });
          }
        })
        .catch(err => { });
    },
    //节点树
    getNode() {
      //点击保存后

      // console.log(this.$refs.tree.getCheckedNodes());
      let obj = this.$refs.tree.getCheckedNodes();
      var arr = [];
      function name(val) {
        // console.log(val);
        let wordId = sessionStorage.getItem("userWordId");
        val.forEach(element => {
          if (element.orgId != wordId && element.orgId != "14192eae-57dd-11e7-9694-0050569a68e4") {  //不能选择该用户本单位
            arr.push({
              id: element.id,
              label: element.label
            });
          }
        });
      }
      let finalArr = [];
      name(obj);
      let idArray = [];
      for (let i in arr) {
        idArray.push(arr[i].id);
      }
      if (this.wordTitle == "选择下发单位") {
        this.form.receiveorg = arr;
        this.defaultCopyCheck = idArray; //给下发单位的树赋值
      } else if (this.wordTitle == "选择抄送单位") {
        this.form.duplicateorg = arr;
        this.dynamicCheck = idArray; //给抄送单位的树赋值
      }
      this.dialogWord = false;
    },
    lowerWord(e) {
      //选择下发单位或抄送单位 开启---弹窗
      //获取单位节点树
      this.wordTitle = e.target.innerText;
      getAjax("ajax/office/sysOffice/treeData").then(res => {
        this.data2 = res.data; //节点树
      });
      this.dialogWord = true;
    },
    //上传附件限制
    beforeAvatarUpload(file) {
      var flag = false; //状态
      var arr = [
        "jpg",
        "png",
        "gif",
        "doc",
        "docx",
        "ppt",
        "pptx",
        "xls",
        "xlsx",
        "pdf",
        "txt",
        "zip",
        "rar",
        "JPG",
        "PNG",
        "GIF",
        "DOC",
        "DOCX",
        "PPT",
        "PPTX",
        "XLS",
        "XLSX",
        "PDF",
        "TXT",
        "ZIP",
        "RAR"
      ];
      //取出上传文件的扩展名
      var index = file.name.lastIndexOf(".");
      var ext = file.name.substr(index + 1);
      //循环比较
      for (var i = 0; i < arr.length; i++) {
        if (ext == arr[i]) {
          flag = true; //一旦找到合适的，立即退出循环
          break;
        }
      }
      var fileSize = file.size / 1024 / 1024 < 5;
      //条件判断
      if (!fileSize) {
        this.$message.error("上传附件大小不能超过 5MB!");
        return false;
      }
      if (!flag) {
        this.$message.error(
          "文件只能上传  jpg , png , gif , doc ," +
          "docx , ppt , pptx , xls , xlsx , pdf , txt, zip, rar 格式"
        );
        return false;
      }
    },
    handleRemove(file, fileList) {
      //文件列表移除文件时的钩子
      // console.log(this.fileAttach)
      if (file.url) {
        let removeFile = this.fileAttach;
        for (let i = 0; i < removeFile.length; i++) {
          if (removeFile[i].uid == file.uid) {
            removeFile.splice(i, 1);
          }
        }
        // console.log(this.fileAttach);// 删除保存在数组中页面中删除的文件
        this.attachment = [];
        this.fileAttach.forEach(item => {
          this.attachment.push(item.url); //保存url 点击保存按钮  下发按钮的时候使用
        });
      }
    },
    //附件上传失败的返回值
    uploadError(err, file, fileList) { },
    //附件上传成功的返回值
    uploadSuccess(response, file, fileList) {
      if (response.state == 1) {
        this.fileAttach.push(file);
        let tempUrl = response.data.url;
        this.attachment.push(tempUrl);
      }

    },
    copyWords(tag) {
      //选择抄送单位
      // console.log(tag);
      this.form.duplicateorg.splice(this.form.duplicateorg.indexOf(tag), 1);
      let tempBottom = this.form.duplicateorg;
      let tempArray = [];
      for (let i in tempBottom) {
        tempArray.push(tempBottom[i].id);
      }
      this.defaultCopyCheck = tempArray; //重新给下发树赋值;
    },
    handleClose(tag) {
      //下发单位
      // console.log(tag);
      this.form.receiveorg.splice(this.form.receiveorg.indexOf(tag), 1);
      let tempChao = this.form.duplicateorg;
      let tempArray = [];
      for (let i in tempChao) {
        tempArray.push(tempChao[i].id);
      }
      this.dynamicCheck = tempArray; //重新给抄送树赋值;
    },
    retunIndex() {
      //返回到上一页
      window.history.back(-1);
    },
    onBtn(val) {
      //点击保存
      if (this.form.meetingtype == "") {
        this.$message({
          message: "会议类型不能为空",
          type: "warning"
        });
        return;
      }
      if (!Boolean(this.form.title)) {
        this.$message({
          message: "会议主题不能为空",
          type: "warning"
        });
        return;
      }
      if (!Boolean(this.form.summary)) {
        this.$message({
          message: "会议描述不能为空",
          type: "warning"
        });
        return;
      }
      if (!Boolean(this.form.meetingtime)) {
        this.$message({
          message: "会议时间不能为空",
          type: "warning"
        });
        return;
      }
      if (!Boolean(this.form.limitetime)) {
        this.$message({
          message: "上报截止时间不能为空",
          type: "warning"
        });
        return;
      }
      if (!Boolean(this.form.address)) {
        this.$message({
          message: "会议地点不能为空",
          type: "warning"
        });
        return;
      }
      if (this.form.receiveorg.length == 0) {
        this.$message({
          message: "下发单位不能为空",
          type: "warning"
        });
        return;
      }

      if (!Number(this.form.score)) {
        this.$message({
          message: "会议总分只能输入数字且不能为空",
          type: "warning"
        });
        return;
      }
      this.form.flag = val;
      // console.log(this.form);
      var wordbottom = ""; //下发单位
      var wordcopy = ""; //抄送单位

      this.form.receiveorg.forEach(res => {
        // wordbottom.push(res.id);
        wordbottom += res.id + ",";
      });
      this.form.duplicateorg.forEach(res => {
        // wordcopy.push(res.id);
        wordcopy += res.id + ",";
      });
      this.form.receiveorg = wordbottom;
      this.form.duplicateorg = wordcopy;
      this.form.attachment = this.attachment.join("|");
      if (val == 1) {
        //保存
        let data = qs.stringify(this.form);
        this.form.receiveorg = []; //下发单位
        this.form.duplicateorg = []; //抄送单位
        postAjax("ajax/meeting/taskMeeting/save", data)
          .then(res => {
            this.$message({
              showClose: true,
              message: "会议保存成功",
              type: "success"
            });
            this.$router.push({ name: "f_meeting" });
          })
          .catch(err => {
            this.$message({
              showClose: true,
              message: "会议保存失败",
              type: "error"
            });
            this.form.receiveorg = "";
            this.form.duplicateorg = "";
          });
      } else if (val == 2) {
        //下发
        let data = qs.stringify(this.form);
        this.form.receiveorg = []; //下发单位
        this.form.duplicateorg = []; //抄送单位
        postAjax("ajax/meeting/taskMeeting/save", data)
          .then(res => {
            // console.log(res);
            this.$message({
              showClose: true,
              message: "会议下发成功",
              type: "success"
            });
            this.$router.push({ name: "f_meeting" });
          })
          .catch(err => {
            this.$message({
              showClose: true,
              message: "会议下发失败",
              type: "error"
            });
          });
      }
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
.create div {
  margin-top: 15px;
}
.create div label {
  margin-left: 20px;
}
.create div > .wid {
  width: 230px;
  height: 35px;
}
.search-input {
  padding-left: 10px;
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
.create .textrea {
  width: 350px;
  height: 80px;
  margin-left: -10px;
  margin-top: 0px;
  /* margin-bottom: 20px; */
  padding: 10px;
  resize: none; /**严禁拉伸*/
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
  margin: 20px;
}
.create .button input {
  margin: 0 5px;
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
  margin-right: 10px;
  margin-bottom: 10px;
}

.choiceWork .el-tag {
  background: #ffecd9 !important;
  color: #ff7e00 !important;
}
</style>



