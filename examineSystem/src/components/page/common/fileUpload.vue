<template>
    <div class="f_uplaoad cle">
        <el-form-item label="附件上传">
            <el-upload
                class="upload-demo"
                :action="uploadImg"
                :on-remove="handleRemove" 
                :onSuccess="handleSuccess" 
                :before-upload="handleAvatarUpload"
                :file-list="fileList">
                <el-button size="small" type="primary">点击上传</el-button>
                <div slot="tip" class="el-upload__tip">文件只能上传jpg,png,gif,doc,docx,ppt,pptx,xls,xlsx,pdf,txt,zip,rar格式，且不超过5MB</div>
            </el-upload>
        </el-form-item>
    </div>
</template>

<script>
import qs from "qs";
import { postAjax, getAjax, uploadImg } from "../../../api/api.js";
export default {
  data() {
    return {
      uploadImg: uploadImg(), //文件上传地址
      fileList: [] //附件上传
    };
  },
  methods: {
    auto(val) { //给上传文件后面追加一个地址
      this.uploadImg = uploadImg() + val;
    },
    filelist(val) {
      this.fileList = val;
    },
    handleSuccess(response, file, fileList) {
      //文件上传成功钩子
      if (response.state == 1) {
        this.fileList.push({
          uid: file.uid,
          name: file.name,
          url: response.data.url
        });
        this.$emit("fileSuccess", this.fileList);
      }
    },
    fileRemove(obj, id) {
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
      //   console.log(file, fileList);
      //   this.fileList.splice(this.fileList.indexOf(file), 1);
      this.fileList = this.fileRemove(this.fileList, file.uid);
      this.$emit("fileSuccess", this.fileList);
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
    }
  }
};
</script>

<style>
</style>
