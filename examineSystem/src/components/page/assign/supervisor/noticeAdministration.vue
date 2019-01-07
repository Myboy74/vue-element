<template>
    <div class="noticeAdministion">
         <div class="headTagLy">
            <h2 class="tag">通知管理详情</h2>
        </div>
        <div class="noticeTxt">
            <el-form ref="form" :model="form" label-width="80px">
                <div>
                    <el-form-item label="通知标题">
                    <el-input v-model="form.messageTitle" :disabled="show" placeholder="请输入会议主题"></el-input>
                </el-form-item>
                 <el-form-item label="">
                    <el-select v-model="form.messageType" :disabled="show">
                    <el-option label="通知" value="0"></el-option>
                    <!-- <el-option label="公告" value="1"></el-option>
                    <el-option label="广告" value="5"></el-option> -->
                    </el-select>
                </el-form-item>
                </div>
               <div class="cle">
                    <el-form-item label="日历日期">
                        <el-date-picker
                        v-model="form.calendarDate"
                        type="date"
                        :disabled="show"
                        value-format="yyyy-MM-dd"
                        placeholder="选择日期">
                    </el-date-picker>
                </el-form-item>
                 <el-form-item label="类型">
                    <el-select v-model="form.contentType" :disabled="show">
                    <el-option label="文字" value="0"></el-option>
                    <!-- <el-option label="图文" value="1"></el-option> -->
                    </el-select>
                </el-form-item>
               </div>
               <div>
                    <el-form-item label="发布日期" class="cle">
                    <el-date-picker
                    :disabled="show"
                    v-model="form.publishDate"
                    type="date"
                    value-format="yyyy-MM-dd"
                    placeholder="选择日期">
                    </el-date-picker>
                </el-form-item>
                 <el-form-item label="发布人">
                    <el-input v-model="form.publishPersonName" :disabled="show" class="release"></el-input>
                </el-form-item>
               </div>
                
                <el-form-item label="展示类型"  class="cle">
                    <el-radio-group v-model="form.showType" :disabled="show">
                    <el-radio label="1">置顶</el-radio>
                    <el-radio label="0">不置顶</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="关键字" class="cle">
                    <el-input v-model="form.keyword" :disabled="show"></el-input>
                </el-form-item>
                <div class="f_uplaoad cle" v-if="show">
                     <el-form-item label="附件上传" class="cle">
                      <div v-if="fileList.length" class="fileA">
                    <a v-for="(item,index) in fileList"  
                     download :key="index" :href="item.url"
                      target="_blank" >{{item.fileName}}</a>
                </div>
                <div v-else style="color:#aeaeae;padding-top:5px">暂无附件上传</div>
                </el-form-item>
                </div>
                <div class="f_uplaoad cle">
                    <el-form-item label="附件上传">
                     <el-upload
                    class="upload-demo"
                    :action="uploadImg"
                    :on-remove="handleRemove" 
                    :onSuccess="handleSuccess" 
                    :before-upload="handleAvatarUpload"
                    multiple
                    :file-list="fileList">
                    <el-button size="small" type="primary">点击上传</el-button>
                    <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过5MB</div>
                </el-upload>
                      </el-form-item>
                </div>
                <div style="margin-top:10px;clear:both;position: relative;">
                  <span style="font-size:14px;color: #606266;padding-left:35px;position: absolute;">正文</span>
                  <udit style="margin-left:80px" :defaultMsg="defaultMsg" ref="ue"></udit>
                </div>
              </el-form>
        </div>
         <div class="cle" style="margin-top:10px">
                    <el-button type="success" :disabled="disFb" v-if="!show" @click="onBtn">发布</el-button>
                    <!-- <input type="button" disabled value="发布" style="padding: 10px 30px;" >  -->
                    <button class="boton" @click="onReturn">返回</button>
                </div> 
    </div>
</template>
<script>
import qs from "qs";
import { postAjax, getAjax, uploadImg } from "../../../../api/api.js";
import udit from "../../common/udit.vue";
import { setTimeout } from 'timers';
export default {
  components: {
    udit
  },
  created() {
    if (this.id) {
      this.autoMove(this.id);
    }
  },
  data() {
    return {
      id: this.$route.query.id,
      show: this.$route.query.show,  //是否可编辑
      imgUrl: uploadImg(),
      attachment: localStorage.getItem("attachment"), //上传文件得下载（预览）路径
      uploadImg: uploadImg() + "?uploadPath=task", //文件上传地址
      arr: [], //上传的文件
      form: {
        id: "",
        messageTitle: "", //通知标题
        messageType: "0", //通知标题后面的选择框
        calendarDate: "", //日历日期
        contentType: "0", //日历日期 后面的类型
        publishDate: "", //发布日期
        publishPersonName: sessionStorage.getItem("userName"), //发布日期后面的   发布人
        showType: "1", //展示类型
        keyword: "", //关键字
        messageContent: "", //正文
        previewPhotoUrl: "", //	缩略图URL(附件上传))
        publishStatus: "1" //发布状态（0：草稿；1：发布）|
      },
      fileList: [], //附件上传
      disFb: false, //点击发布的锁
      defaultMsg:"" //UE(ueditor)的内容
    };
  },
  methods: {
    autoMove(id) { //详情
      let obj = {
        id: id
      };
    
      let data = qs.stringify(obj);
      postAjax("ajax/message/managerMessageNotice/form", data).then(res => {
        // console.log(res);
        let obj = res.data.data.Message;
        this.form = {
          id:id,
          messageTitle: obj.messageTitle, //通知标题
          messageType: obj.messageType, //通知标题后面的选择框, //通知标题后面的选择框
          calendarDate: obj.calendarDate, //日历日期
          contentType: obj.contentType, //日历日期 后面的类型
          publishDate: obj.publishDate, //发布日期
          publishPersonName: obj.publishPersonName, //发布日期后面的   发布人
          showType: obj.showType, //展示类型
          keyword: obj.keyword, //关键字
          messageContent: obj.messageContent
            // .replace(/<[^<]+?>/g, "")
            // .replace("&nbsp;", "") //原先内容转义 //正文
        };
        if(this.show){  //如果是查看详情状态,不能编辑ueditor
          this.$refs.ue.getUENoEdit();
        }
        this.defaultMsg=obj.messageContent;//UE(ueditor)的内容
        this.$refs.ue.setUEContent(obj.messageContent) //编辑状态如果有内容放入内容
        
        this.fileList = [];
        // if(obj.previewPhotoUrl){
        //    this.arr = obj.previewPhotoUrl.split("|");
        // let arrname = [];
        // this.arr.forEach(element => {
        //   //获取文件名称
        //   var index = element.lastIndexOf("/");
        //   element = element.substring(index + 1, element.length);
        //   element = decodeURI(element);
        //   if (element !== "") {
        //     arrname.push(element);
        //   }
        // });
        // arrname.forEach((item, index) => {
        //   this.fileList.push({
        //     uid: index,
        //     name: item,
        //     url: this.imgUrl + this.arr[index],
        //     imgUrl:this.attachment+item
        //   });
        // });
        // console.log(this.fileList)
        // }

 if (obj.previewPhotoUrl) {
          let tempFileArray = obj.previewPhotoUrl.split("|");
          let fileBefore = localStorage.getItem("attachment");
          for (let i in tempFileArray) {
            let tempUrl = decodeURI(fileBefore + tempFileArray[i]);
            let nameArray = tempUrl.split("/");
            let finalName = nameArray.pop();
            finalName = decodeURI(finalName);
            // console.log(finalName);
            if (tempFileArray[i] !== "") {
              this.fileList.push({
                fileName: finalName,
                url: tempUrl
              });
            }
          }
          // console.log(this.detailFileArray);
        }

       
      });
    },
    onBtn() {
      //发布
       this.form.messageContent = this.$refs.ue.getUEContent();//获取一下ueditor里面的内容
      this.fileList.forEach(item => {
        this.form.previewPhotoUrl += item.url + "|";
      });
      if (!this.form.messageTitle) {
        this.$message({
          message: "请输入通知标题",
          type: "warning"
        });
        return;
      } else {
        if (this.form.messageTitle.length > 300) {
          this.$message({
            message: "通知标题不得超过300字",
            type: "warning"
          });
          return;
        }
      }
      if (!this.form.calendarDate) {
        this.$message({
          message: "请输入日历日期",
          type: "warning"
        });
        return;
      }
      if (!this.form.publishDate) {
        this.$message({
          message: "请输入发布日期",
          type: "warning"
        });
        return;
      }
      // if (!this.form.keyword) {
      //   this.$message({
      //     message: "请输入关键字",
      //     type: "warning"
      //   });
      //   return;
      // }
      if (!this.form.contentType) {
        this.$message({
          message: "请选择类型",
          type: "warning"
        });
        return;
      }
      if (!this.form.messageContent) {
        this.$message({
          message: "请输入正文",
          type: "warning"
        });
        return;
      } else {
        if (
          this.form.messageContent
            .replace(/<[^<]+?>/g, "")
            .replace("&nbsp;", "").length > 1000
        ) {
          this.$message({
            message: "正文字符不能超过1000字",
            type: "warning"
          });
          return;
        }
      }
      this.disFb = true;
      let data = qs.stringify(this.form);
      postAjax("ajax/message/managerMessageNotice/save", data).then(res => {
        //   console.log(res);
        this.disFb = false;
        if (res.data.state == 1) {
          this.$message({
            message: res.data.message,
            type: "success"
          });
          this.$router.push({
            name: "f_supervisorNotice"
          });
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
   
    onReturn() {
      //返回
      window.history.back(-1);
    },
    handleSuccess(response, file, fileList) {
      //文件上传成功钩子
      this.fileList.push({
        uid: file.uid,
        name: file.name,
        url: response.data.url
      });
    },
    removeFile(obj, id) {
      let index = -1;
      for (let i = 0; i < obj.length; i++) {
        if (obj[i].uid === id) {
          index = i;
        }
      }
      if (index > -1) {
        obj.splice(index, 1);
      }
      return obj;
    },
    handleRemove(file, fileList) {
      //文件删除时的钩子
      this.removeFile(this.fileList, file.uid);
    },
    handleAvatarUpload(file) {
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
        "txt"
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
            "docx , ppt , pptx , xls , xlsx , pdf , txt 格式"
        );
        return false;
      }
    }
  }
};
</script>
<style scoped>
.noticeTxt {
  margin-top: 20px;
}
.boton {
  border: none;
  margin-left: 30px;
  padding: 10px 30px;
  border-radius: 5px;
  /* color: white; */
}
.boton:last-child:hover {
  background: #e6e0e0;
}
.fileA{
  padding-top: 5px
}
.fileA a{
  padding: 0 15px 10px 0;
}
.fileA a:hover{
  color: red;
}
</style>

