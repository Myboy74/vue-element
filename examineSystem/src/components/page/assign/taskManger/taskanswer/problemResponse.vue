<template>
    <div>
        <div class="headTagLy">
            <h2 class="tag" v-if="titleTxt">会议答疑</h2>
            <h2 class="tag" v-else>任务答疑</h2>
        </div>
             <div class="shadowLy create">
                 <div>
                    <label>疑问内容</label>
                    <div class="detailContent">
                      {{content.taskname}}</div>
                </div>
                <div>
                    <label>提出单位</label>
                    <div class="detailContent">{{content.dwname}}</div>
                </div>
                <div>
                    <label>提出时间</label> 
                     <div class="detailContent">{{content.twsj}}</div>
                </div>
                <div>
                    <label>附件上传</label>
                      <div v-if="fjLen" class="fileLoad fl"  style="margin:0"> 
                                <a v-for="(item,index) in content.fj"
                                :key="index" :href="item.url" 
                                target="_blank" class="oladFile">{{item.fileName}}</a>
                            </div>
                            <div v-else class="fl" style="font-size:12px;color:#aeaeae;margin:0;padding-top:2px">暂无附件上传</div>
                            <div class="cle"></div>
               </div>
              <div class="button" style="height:60px;margin-left:20px; border-bottom:1px solid #cccccc;">
                    <button  v-if="titleTxt" @click="meetingGo" class="f_btn f_deepBlue">会议详情</button>
                    <button  v-else @click="taskGo" class="f_btn f_deepBlue">任务详情</button>
                </div>
                <el-form ref="form" :model="form" label-width="80px">
                <el-form-item label="疑问回复">
                    <textarea placeholder="请输入回复内容" v-model="form.twbt"></textarea>
                    <!-- <el-input type="textarea" v-model="form.twbt"></el-input> -->
                </el-form-item> 
                 <div class="newflie">
                   <fileUpload @fileSuccess="uploadSuccess" ref="flieUpload"></fileUpload>
                </div>
            </el-form>
              <div class="button">
                <input type="button" class="f_btn f_deepBlue" value="提交" @click="onProble">
                <input type="button" value="返回" class="f_btn" style="color:#000" @click="returnTop">
              </div>
        </div>
    </div>
</template>

<script>
import qs from "qs";
import { postAjax, getAjax, oUrl, uploadImg } from "../../../../../api/api.js";
import fileUpload from "../../../common/fileUpload.vue";
import { setTimeout } from 'timers';
export default {
  components: {
    fileUpload
  },
  mounted() {
   
    if (this.id) {
      //任务
      this.titleTxt = false;
      this.autoMove(this.id);
    }
    if (this.meetingId) {
      //会议
      this.titleTxt = true;
      this.autoMove(this.meetingId);
    }
    setTimeout(()=>{  
      this.$refs.flieUpload.auto(this.uploadAdres);
    },100)
    
  }, 
  data() {
    return {
      id: this.$route.query.problemId, //有,说明是任务
      meetingId: this.$route.query.proTaskId, //有,说明是会议
      taskId: sessionStorage.getItem(""),
      titleTxt: true, //标题及按钮
      uploadAdres: "?uploadPath=taskAnswer", // //上传文件的地址
      fjLen:"",//附件的长度
      form: {
        twbt:"",
        fj:""
      },
      content:"",//疑问问题详情
    };
  },
  methods: {
    autoMove(id){
      /*************查询用哪个***********/ 
      postAjax("ajax/rwtw/rwtw/xq?id=" + id).then(res => {
        if (res.status == 200) {
          this.content= res.data.data.rwtw; //问题描述
          this.content.fj = this.fileSplit(this.content.fj);
          this.fjLen=this.content.fj.length;
         
          this.form.parentid=this.content.id;//要回复的问题ID
          this.form.taskname=this.content.taskname;//问题所属的任务（会议）名称
          this.form.answer=this.content.dw;///回复人单位ID
          this.form.taskid=this.content.taskid;//问题所属的任务（会议）ID
          this.form.ext2=0;//回复类型：0主回复 1追加回复
        }
      })
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
    onProble(){
      //提交内容
      if(!this.form.twbt){
         this.$message({
          message: '请输入回复内容',
          type: 'warning'
        });
        return;
      } 
      if(this.form.twbt.length>=1000){
         this.$message({
          message: '回复内容字符长度不能超过1000',
          type: 'warning'
        });
        return;
      }
      postAjax("ajax/rwtw/rwtw/saveHf", this.form).then(res => {
        if (res.status == 200) {
           this.$message({
            message: res.data.message,
            type: "success"
          });
          window.history.back(-1);
        }
      })


    },
    returnTop() {
      //返回
      window.history.back(-1);
    },
    taskGo() {
      //任务详情
      sessionStorage.setItem("detailId", this.id);
      this.$router.push({ name: "f_taskDetails" });
    },
    meetingGo() {
      //会议详情
      this.$router.push({
        name: "f_lookMeeting",
        query: {
          look:this.meetingId
        }
      });
    },
    uploadSuccess(val) {
      //上传文件的信息
      let str = "";
      val.forEach(element => {
        str += element.url + "|";
      });
      this.form.fj = str;
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
  margin: 20px 0;
}
.create div > label {
  display: inline-block;
  float: left;
  margin: 0 20px;
}
.create div .detailContent {
  width: 80%;
  min-height: 20px;
  text-align: left;
  margin-left: 95px;
  color:#aeaeae;
}
.create textarea {
  width: 350px;
  height: 80px;
  float: left;
  border: 1px solid #cccccc;
  padding: 10px;
  border-radius: 5px;
  resize: none; /**严禁拉伸*/
}
.copyUnit,
#addChildTask {
  border: 1px solid #cccccc;
  background: none;
  padding: 5px 20px;
  margin-left: 20px;
  border-radius: 5px;
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
.iconfont {
  margin-left: -25px;
}
.create div.copyScore,
.create div.chlidTable {
  margin-left: 90px;
  min-height: 20px;
}
.copyScore .el-tag,
.choiceWork .el-tag {
  background: #e7eaf9 !important;
  color: #5c74d8 !important;
  border: none !important;
  margin-right: 10px;
}

.choiceWork .el-tag {
  background: #ffecd9 !important;
  color: #ff7e00 !important;
}

.el-date-editor.el-input {
  margin-left: 12px;
}
</style>



