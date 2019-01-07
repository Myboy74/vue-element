<template>
    <div class="answerDstails">
        <div class="headTagLy">
            <h2 class="tag">答疑详情</h2>
        </div>
        <div class="ms-articleLy shadowLy" style="padding:1px 1px 10px 1px;">
            <div class="question-article">
                <div class="audit-btn">问题描述</div>
                <div class="question-text">
                   {{titleContent.twbt}}
                </div>
                <div class="fujian-content" style="margin-top:10px;">
                    <span class="fujian-word fl" style="padding: 0 20px 0 0">附件:</span>
                    <div v-if="fileLen" class="fl" style="margin-top:-3px">
                        <a v-for="(item,index) in titleContent.fj" download
                         :key="index" :href="item.url" 
                         target="_blank" class="oladFile">{{item.fileName}}</a>
                    </div>
                    <div v-else class="fl" style="font-size:12px;color:#aeaeae">暂无附件上传</div>
                </div>
                <div class="clear"></div>
            </div>
        </div>
        <div v-for="(item,index) in content" :key="index">
        <div class="ms-articleLy green-article shadowLy" 
        style="padding:1px 1px 10px 1px;"  
        v-if="item.ext2=='0'" >
            <div class="question-article">
                <div class="detail-green-flag">答疑</div>
                <div class="question-date">
                    {{item.twsj}}
                </div>
                <div class="question-text">
                  {{item.twbt}}
                </div>
                <div class="fujian-content">
                    <span class="fujian-word fl" style="padding: 0 20px 0 0">附件:</span>
                    <div v-if="item.fj.length" class="fl" style="margin-top:-2px">
                        <a v-for="(item,index) in item.fj"
                         :key="index" :href="item.url" download
                         target="_blank" class="oladFile">{{item.fileName}}</a>
                    </div>
                    <div v-else class="fl" style="font-size:12px;color:#aeaeae">暂无附件上传</div>
                 </div>
                <div class="clear"></div>
            </div>
        </div>
        <div class="ms-articleLy orange-article shadowLy"
         style="padding:1px 1px 10px 1px;"
         v-if="item.ext2=='1'" >
            <div class="question-article">
                <div class="detail-orange-flag">追问</div>
                <div class="question-date">
                     {{item.twsj}}
                </div>
                <div class="question-text">
                     {{item.twbt}}
                </div>
                <div class="fujian-content">
                    <span class="fujian-word fl" style="padding: 0px 20px 0 0">附件:</span>
                    <div v-if="item.fj.length" class="fl" style="margin-top:-3px"> 
                        <a v-for="(item,index) in item.fj" download
                         :key="index" :href="item.url" 
                         target="_blank" class="oladFile">{{item.fileName}}</a>
                    </div>
                    <div v-else class="fl" style="font-size:12px;color:#aeaeae">暂无附件上传</div>
                 </div>
                <div class="clear"></div>
            </div>
            <div class="f_hf" v-if="item.hflist.length"
             v-for="(val,ind) in item.hflist" :key="ind">
              <div class="f_hfTop"> 
                <span style="font-weight: bolder;color: black">回复追问:</span>
                 {{val.twbt}}
              </div>
              <div class="f_hfTop">
                <span class="fl" style="padding-right: 10px;">附件:</span>
                  <div v-if="val.fj.length" class="fileLoad fl"  style="margin:0;padding-top:-2px"> 
                    <a v-for="(name,num) in val.fj"
                    :key="num" :href="name.url" download
                    target="_blank" class="oladFile">{{name.fileName}}</a>
                  </div>
                  <div v-else class="fl" style="font-size:12px;color:#aeaeae;margin:0;padding-top:2px">暂无附件上传</div>
                  <div class="clear"></div>
                </div>
            </div>
        </div>
        </div>
        <!-- 添加问题对话框 -->
         <el-dialog title="问题添加" :visible.sync="dialogFormVisible">
            <el-form ref="form" :model="form" label-width="80px">
                <el-form-item label="问题描述" :label-width="formLabelWidth">
                    <el-input type="textarea" v-model="form.twbt"></el-input>
                </el-form-item> 
                 <div class="fileTask">
                   <fileUpload @fileSuccess="uploadSuccess" ref="flieUpload"></fileUpload>
                </div>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <div class="f_btn f_deepBlue default" @click="onSave">保 存</div>
                <div class="f_btn default" style="color:#000" @click="dialogFormVisible = false">返 回</div>
            </div>
        </el-dialog>
        <div class="button-group" style="border-bottom:none;">
            <div class="f_btn f_orange default"
            style="margin:4% 0% 0% 0%;"
             @click="addDoubt">
                添加相关追问
            </div>
            <div class="f_btn default" @click="backRoute" style="color:#000">
                返回
            </div>
        </div>
    </div>
</template>
<script>
import qs from "qs";
import { postAjax, getAjax, uploadImg, oUrl } from "../../../api/api.js";
import fileUpload from "../common/fileUpload.vue";
export default {
  components: {
    fileUpload
  },
  created() {
    if (this.id) {
      this.autoMove(this.id);
    }
  },
  data() {
    return {
      id: this.$route.query.answerDetail,
      attachment: localStorage.getItem("attachment"), //文件预览地址
      uploadAdres: "?uploadPath=taskAnswer", // //上传文件的地址
      titleContent: "", //问题内容描述
      content: "", //追问及回复
      fileLen: 0, //最上面文件上传
      dialogFormVisible: false,
      form: {
        taskid: "", //任务（会议）ID
        parentid: "", //被追加问题ID，追加问题保存时属于必选项
        twbt: "", //提问内容
        fj: "", //附件地址
        ext2: "1" //提问类型：0主题问、1追问
      },
      formLabelWidth: "120px"
    };
  },
  methods: {
    autoMove(id) {
      postAjax("ajax/rwtw/rwtw/xq?id=" + id).then(res => {
        if (res.status == 200) {
          this.titleContent = res.data.data.rwtw; //问题描述

          this.form.parentid = this.titleContent.id; //提问数据ID;
          this.form.taskid = this.titleContent.taskid; //所属会议ID

          this.titleContent.fj = this.fileSplit(this.titleContent.fj);
          this.fileLen = this.titleContent.fj.length;
          this.content = res.data.data.rwhfList; //问题追问及回复
          this.content.forEach(item => {
            item.fj = this.fileSplit(item.fj);
            if (item.hflist.length) {
              item.hflist.forEach(val => {
                val.fj = this.fileSplit(val.fj);
              });
            }
          });
        }
      });
    },
    fileSplit(val) {
      //上传文件分割
      if (val) {
        let tempFileArray = val.split("|");
        let fj = [];
        for (let i in tempFileArray) {
          let tempUrl = decodeURI(this.attachment + tempFileArray[i]);
          let nameArray = tempUrl.split("/");
          let finalName = nameArray.pop();
          finalName = decodeURI(finalName);
          if (tempFileArray[i] !== "") {
            fj.push({
              fileName: finalName,
              url: tempUrl
            });
          }
        }
        return fj;
      } else {
        return [];
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
    backRoute() {
      window.history.go(-1);
    },
    addDoubt() {
      this.dialogFormVisible = true;
      setTimeout(() => {
        this.$refs.flieUpload.auto(this.uploadAdres);
      }, 100);
    },
    onSave() {
      //保存
      // console.log(this.form);
      // return;
      // let data = qs.stringify(this.form);
      postAjax("ajax/rwtw/rwtw/save", this.form).then(res => {
        if (res.status == 200) {
          this.$message({
            message: res.data.message,
            type: "success"
          });
          this.dialogFormVisible = false;
          this.form.twbt = "";
          this.$refs.flieUpload.filelist([]);
          this.autoMove(this.id);
        }
      });
    }
  }
};
</script>

<style scoped>
/* 问题描述标签 */
.audit-btn {
  font-size: 14px;
  border-radius: 5px;
  border: solid 1px #ff7291;
  color: #ff7291;
  display: inline-block;
  padding: 3px 10px 3px 10px;
  margin-right: 1%;
  cursor: pointer;
}
.button-group {
  width: 80%;
  padding-bottom: 5px;
  border-bottom: #ececec 1px solid;
}
/* 按钮默认样式 */
.default {
  display: inline-block;
  margin: 4% 0% 0% 2%;
  text-align: center;
  font-size: 14px;
}
.back-btn {
  /* margin: 4% 0% 0% 5%; */
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
/* 内容标签 */
.question-article {
  width: 96%;
  margin: 2% 0% 0% 2%;
  padding-bottom: 15px;
}
/* 日期样式 */
.question-date {
  display: inline-block;
  width: 20%;
  height: 18px;
  font-size: 12px;
  color: #898a8f;
}
.question-text {
  display: inline-block;
  width: 90%;
  margin-top: 10px;
  font-size: 14px;
  color: #353639;
  word-wrap: break-word;
  padding-bottom: 5px;
}
.question-talk-tag {
  float: right;
  width: 5%;
  cursor: pointer;
  font-size: 14px;
  color: #898a8f;
  text-align: right;
  margin: 20px 0% 0% 0%;
  /* justify-content:center;
    align-items:center */
  vertical-align: middle;
}
.tag-num {
  display: block;
  float: right;
}
.fujian-content {
  width: 80%;
}
.fujian-word {
  display: inline-block;
  font-size: 12px;
  color: #353639;
}
.detail-green-flag {
  display: inline-block;
  width: 30px;
  height: 18px;
  border-right: #d4d4d4 1px solid;
  font-size: 12px;
  color: #3cc56d;
}
.detail-orange-flag {
  display: inline-block;
  width: 30px;
  height: 18px;
  border-right: #d4d4d4 1px solid;
  font-size: 12px;
  color: #f9bf2c;
}
.green-article {
  border: #3cc56d 1px solid;
  background-color: rgb(233, 247, 238);
}
.orange-article {
  border: #f9bf2c 1px solid;
  background-color: rgb(245, 239, 224);
}
.newflie {
  margin-left: 40px;
}
.oladFile {
  font-size: 12px;
  padding: 0 15px 20px 0;
}
.oladFile:hover {
  color: red;
}
.f_hf {
  width: 95%;
  margin: 0 auto;
  font-size: 14px;
  padding-left: 20px;
  border-top: 1px solid rgba(225, 102, 63, 0.3);
}
.f_hfTop {
  margin: 10px 0 5px 0;
}
</style>
