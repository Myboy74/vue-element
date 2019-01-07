<template>
    <div>
        <div class="headTagLy">
            <h2 class="tag">任务办理</h2>
        </div>
        <div class="ms-articleLy shadowLy" style="padding:1px 1px 10px 1px;">
            <ul class="panel-ul">
                <!-- <li class="el-rowLy">
                        <h2 class="mark">
                            项目名称
                        </h2>
                        <span class="row-text">
                           {{taskContent.projectName?taskContent.projectName:"暂无项目名称"}}
                        </span>
                    </li> -->
                <li class="el-rowLy">
                    <h2 class="mark">
                        紧急程度
                    </h2>
                    <span class="row-text">
                        {{taskContent.importantLevelName?taskContent.importantLevelName:"暂无紧急程度等级"}}
                    </span>
                </li>
                <li class="el-rowLy">
                    <h2 class="mark">
                        任务编号
                    </h2>
                    <span class="row-text">
                        {{ subObj.stageNum?subObj.stageNum:"暂无任务编号"}}
                    </span>
                </li>
                <li class="el-rowLy">
                    <h2 class="mark">
                        任务名称
                    </h2>
                    <span class="row-text">
                        {{ subObj.stageName?subObj.stageName:"暂无任务名称"}}
                    </span>
                </li>
                <li class="el-rowLy">
                    <h2 class="mark">
                        任务描述
                    </h2>
                    <span class="row-text">
                        {{ subObj.note?subObj.note:"暂无任务描述"}}
                    </span>
                </li>
                <li class="el-rowLy">
                    <h2 class="mark">
                        起止时间
                    </h2>
                    <span class="row-text">
                        {{subObj.startDate}} -- {{subObj.endDate}}
                    </span>
                </li>
                <li class="el-rowLy">
                    <h2 class="mark">
                        接收时间
                    </h2>
                    <span class="row-text">
                        {{singTime?singTime:"暂无接收时间"}}
                    </span>
                </li>
                <li class="el-rowLy">
                    <h2 class="mark">
                        附件下载
                    </h2>
                    <span class="row-text">
                        <span v-if="arrname.length==0">暂无上传文件</span>
                         <a style="word-break: break-all;
                            word-wrap: break-word;
                            margin: 0 20px 10px 0;
                            "  v-else download
                             v-for="(ite,index) in arrname"
                                :key="index" :href="ite.url" target="_blank">
                                {{ite.name}}
                            </a>
                    </span>
                </li>
            </ul>
            <div class="hr" style="margin-top:0px;"></div>
            <div class="table-content">
                <el-form ref="form" :model="form" label-width="80px">
                    <el-form-item label="任务反馈" style="margin-left:20px;" class="f_taskHandle">
                        <el-input type="textarea" v-model="form.desc" style="width:320px;"></el-input>
                    </el-form-item>
                    <el-form-item label="附件上传" style="margin-left:20px;">
                        <el-upload class="upload-demo" :action="uploadImg" :on-remove="handleRemove" :with-credentials="true"
                            :onSuccess="uploadSuccess" :onError="uploadError" :before-upload="beforeAvatarUpload"
                            :file-list="fileList">
                            <el-button size="small" type="primary">点击上传</el-button>
                            <div slot="tip" class="el-upload__tip" style="margin-left: 12px !important;">文件只能上传jpg,png,gif,doc,docx,ppt,pptx,xls,xlsx,pdf,txt,zip,rar格式，且不超过5MB</div>
                        </el-upload>
                    </el-form-item>
                </el-form>
            </div>
            <div class="clear"></div>
            <div class="hr"></div>
            <div class="button-group" style="border-bottom:none;">
                <div class="f_btn f_deepBlue back-btn" @click="taskSchedule">
                    提交
                </div>
                <div class="f_btn back-btn" @click="backRoute" style="color:#000">
                    返回
                </div>
                <div class="clear"></div>
            </div>
        </div>
    </div>
</template>
<script>
import qs from "qs";
import { postAjax, getAjax, uploadImg, oUrl } from "../../../api/api.js";
export default {
  created() {
    // console.log(this.id);
    this.autoMove(this.id, this.parentId);
  },
  data() {
    return {
      id: this.$route.query.childId,
      detailId: "", //详情id
      parentId: this.$route.query.parentId,
      uploadImg: uploadImg() + "?uploadPath=/underTask", //文件上传地址
      taskContent: "", //任务得基本信息
      singTime: "", //接收时间
      arr: [], //附件下载
      arrname: [], //附件下载名字
      tableData: [
        {
          subNum: "1",
          subName: "XO23333",
          subDetail: "关于国资委任务标题1518号文件",
          startTime: "2018-09-11"
        }
      ],
      form: {
        desc: ""
      },
      fileList: [],
      subObj: {} //子任务对象
    };
  },
  methods: {
    autoMove(childId, pentId) {
      let data = {
        taskId: pentId, //任务ID
        stageId: childId //子任务ID
      };
      let obj = qs.stringify(data);
      getAjax(
        "ajax/task/taskDetail/handle?taskId=" + pentId + "&stageId=" + childId
      ).then(res => {
        this.detailId = res.data.data.taskDetail.id;
        this.taskContent = res.data.data.dayTask;
        this.subObj = res.data.data.taskStage; //子任务对象
        this.singTime = res.data.data.taskDetail.signTime;
        //上半部分上传文件拆分
        if (this.subObj.attachment) {
          this.arr = this.subObj.attachment.split("|");
          this.arr.forEach(element => {
            //获取文件名称
            var index = element.lastIndexOf("/");
            let name = element.substring(index + 1, element.length);
            name = decodeURI(name);
            if (name !== "") {
              this.arrname.push({
                name: name,
                url: this.attachment + element
              });
            }
          });
        }
      });
    },
    toDetail() {
      this.$router.push({
        path: "/subTaskDetail"
      });
    },
    backRoute() {
      this.$router.history.go(-1);
    },
    taskSchedule() {
      //点击提交按钮
      // console.log(this.fileList);
      if (!this.form.desc) {
        this.$message({
          showClose: true,
          message: "请填写要反馈的信息",
          type: "warning"
        });
        return;
      }
      let attamch = this.fileList;
      let arr = [];
      attamch.forEach(item => {
        arr.push(item.url);
      });
      arr = arr.join("|");
      let obj = {
        detailId: this.detailId, //任务信息ID
        context: this.form.desc, //进度内容
        attchment: arr //附件地址
      };
      let data = qs.stringify(obj);
      postAjax("ajax/task/taskSchedule/save", data).then(res => {
        //   console.log(res);
        if (res.data.state == 1) {
          this.$message({
            showClose: true,
            message: res.data.message,
            type: "success"
          });
          this.$router.history.go(-1);
        } else {
          this.$message({
            showClose: true,
            message: res.data.message,
            type: "warning"
          });
        }
      });
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
          "docx , ppt , pptx , xls , xlsx , pdf , txt, rar , zip 格式"
        );
        return false;
      }
    },
    handleRemove(file, fileList) {
      //文件列表移除文件时的钩子
      //   console.log(file);
      if (file.url) {
        for (let i = 0; i < this.fileList.length; i++) {
          if (this.fileList[i].uid == file.uid) {
            this.fileList.splice(i, 1);
          }
        }
      }
    },
    //附件上传失败的返回值
    uploadError(err, file, fileList) { },
    //附件上传成功的返回值
    uploadSuccess(response, file, fileList) {
      // console.log(response);
      // console.log(file);
      //  console.log(fileList);
      let tempUrl = response.data.url;
      this.fileList.push({
        id: file.uid,
        name: response.data.name,
        url: tempUrl
      });
    }
  }
};
</script>

<style scoped>
.panel-ul {
  margin: 10px 0px 0px 30px;
  width: 900px;
  padding-bottom: 10px;
}

.el-rowLy {
  list-style-type: none;
  width: 100%;
  line-height: 25px;
}

.el-rowLy .mark {
  display: inline-block;
  width: 75px;
  height: 50px;
  font-size: 14px;
  font-weight: normal;
  color: #353639;
}

.el-rowLy .row-text {
  display: inline-block;
  width: calc(100% - 106px);
  height: 50px;
  font-size: 14px;
  color: #898a8f;
  word-break: break-word;
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
  padding-bottom: 5px;
  border-bottom: #ececec 1px solid;
}

/* 按钮默认样式 */
.default {
  float: left;
  margin-left: 20px;
}

.back-btn {
  display: inline-block;
  margin: 4% 0% 0% 5%;
  width: 5%;
  text-align: center;
}

.table-content {
  margin-top: 20px;
  float: left;
  width: 92%;
}

.hr {
  margin: 20px 0px 0px 30px;
  width: 80%;
  border-bottom: #ececec 1px solid;
}

.f_box > img {
  cursor: pointer;
}
</style>
