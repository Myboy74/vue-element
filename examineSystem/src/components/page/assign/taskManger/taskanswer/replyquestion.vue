<template>
    <div class="answerDstails">
         <div class="headTagLy">   
             <h2 class="tag" v-if="btnName">任务答疑</h2> 
             <h2 class="tag"  v-else>会议答疑</h2>
          
           
        </div>
         <div class="ms-articleLy shadowLy">
        <div style=" width: 98%;margin: 0 auto;">
            <div class="f_proDestion" style="padding-bottom:30px">
                <span>问题答疑</span>
                <div>  {{titleContent.twbt}}</div>
                <div style="padding-top:10px">
                    <span class="fl" style="padding-right: 10px;">附件:</span>
                     <div v-if="fileLen" class="fl fileLoad" style="margin-left:0;padding-top:2px">
                        <a v-for="(item,index) in titleContent.fj"
                         :key="index" :href="item.url" 
                         target="_blank" class="oladFile">{{item.fileName}}</a>
                    </div>
                    <div v-else class="fl" style="font-size:12px;color:#aeaeae;margin-left:0;padding-top:2px">暂无附件上传</div>
                </div>
            </div>
            <div v-for="(item,index) in content" :key="index">
                <div class="f_problem" v-if="item.ext2=='0'" >
                <p>
                    <span style="color: #4bdae8">答疑</span>
                    <span style="padding: 0 5px">|</span>
                    <span id="f_time"> {{item.twsj}}</span>
                </p>
                <div> {{item.twbt}}</div>
                <div>
                    <span class="fl" style="padding-right: 10px;">附件:</span>
                     <div v-if="item.fj.length" class="fileLoad fl"> 
                        <a v-for="(item,index) in item.fj"
                         :key="index" :href="item.url" 
                         target="_blank" class="oladFile">{{item.fileName}}</a>
                    </div>
                    <div v-else class="fl" style="font-size:12px;color:#aeaeae;margin:0;padding-top:2px">暂无附件上传</div>
                    <div class="clear"></div>
                </div>
            </div>
               <div class="f_answering" v-if="item.ext2=='1'" >
                <ul>
                    <li>
                        <p>
                            <span style="color: #e1663f">追问</span>
                            <span style="padding: 0 5px">|</span>
                            <span id="f_anTime"> {{item.twsj}}</span>
                        </p>
                        <div>{{item.twbt}}</div>
                        <div>
                            <span class="fl" style="padding-right: 10px;">附件:</span>
                             <div v-if="item.fj.length" class="fileLoad fl"  style="margin:0"> 
                                <a v-for="(item,index) in item.fj"
                                :key="index" :href="item.url" 
                                target="_blank" class="oladFile">{{item.fileName}}</a>
                            </div>
                            <div v-else class="fl" style="font-size:12px;color:#aeaeae;margin:0;padding-top:2px">暂无附件上传</div>
                            <div class="clear"></div>
                        </div>
                        <p style="text-align:right"><span class="f_return" @click="replayDoubt(item.id)"><i class="f_icon"></i> 回复</span></p>
                    </li>
                      <li style="border-top: 1px solid rgba(225, 102, 63,0.3)"
                       v-if="item.hflist.length" v-for="(val,ind) in item.hflist" :key="ind">
                        <div><span style="font-weight: bolder;color: black">回复追问：</span> {{val.twbt}}</div>
                        <div>
                            <span class="fl" style="padding-right: 10px;">附件:</span>
                             <div v-if="val.fj.length" class="fileLoad fl"  style="margin:0"> 
                                <a v-for="(name,num) in val.fj"
                                :key="num" :href="name.url" 
                                target="_blank" class="oladFile">{{name.fileName}}</a>
                            </div>
                            <div v-else class="fl" style="font-size:12px;color:#aeaeae;margin:0;padding-top:2px">暂无附件上传</div>
                            <div class="clear"></div>
                        </div>
                    </li>
                </ul>
            </div>
                </div>
            </div>
            <el-dialog title="追问回复" :visible.sync="dialogFormVisible">
            <el-form ref="form" :model="form" label-width="80px">
                <el-form-item label="回复内容" :label-width="formLabelWidth">
                    <el-input type="textarea" v-model="form.twbt"></el-input>
                </el-form-item> 
                 <div class="newflie">
                   <fileUpload @fileSuccess="uploadSuccess" ref="flieUpload"></fileUpload>
                </div>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <div class="f_btn f_deepBlue default" @click="onSave">保 存</div>
                <div class="f_btn default" style="color:#000" @click="dialogFormVisible = false">返 回</div>
            </div>
        </el-dialog>
            <div class="button">
                <input  type="button"  class="f_btn f_lightGreen" value="问题回复" @click="response">
                <button class="f_btn" style="color:#000;" @click="returnTop">返回</button>
            </div>
        </div>
    </div>
</template>

<script>
import qs from "qs";
import { postAjax, getAjax, oUrl, uploadImg } from "../../../../../api/api.js";
import fileUpload from "../../../common/fileUpload.vue";
export default {
  components: {
    fileUpload
  },
  created() {
    if (this.id) {
      //任务
      this.btnName = true;
      this.autoMove(this.id);
    }
    if (this.meetingId) {
      //会议
      this.btnName = false;
      this.autoMove(this.meetingId);
    }
  },
  data() {
    return {
      id: this.$route.query.f_replayId,
      meetingId: this.$route.query.meetingId, //会议id
      btnName: true, //判断是任务还是会议
      dialogFormVisible: false, //弹框
      uploadAdres: "?uploadPath=taskAnswer", // //上传文件的地址
      attachment: localStorage.getItem("attachment"), //文件预览地址
      titleContent: "", //最上面的答疑内容
      fileLen: 0, //最上面文件上传
      content: "", //答疑及继续追问的内容
      form: {},
      formLabelWidth: "120px"
    };
  },
  methods: {
    autoMove(id) {
      postAjax("ajax/rwtw/rwtw/xq?id=" + id).then(res => {
        if (res.status == 200) {
          //   console.log(res);
          this.titleContent = res.data.data.rwtw; //问题描述
          /******将回复问题 上传的一些信息先取到********/
          this.form.answer = res.data.data.rwtw.dw; //回复人单位ID
          this.form.taskid = res.data.data.rwtw.taskid; //问题所属的任务（会议）ID
          this.form.taskname = res.data.data.rwtw.taskname; //问题所属的任务（会议）名称

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
    returnTop() {
      //返回
      window.history.back(-1);
    },
    response() {
      //问题回复
      if (this.id) {
        //有,说明是会议
        this.$router.push({
          name: "f_problemResponse",
          query: {
            problemId: this.id
          }
        });
      }
      if (this.meetingId) {
        //否则是任务
        this.$router.push({
          name: "f_problemResponse",
          query: {
            proTaskId: this.meetingId
          }
        });
      }
    },
    replayDoubt(id) {
      //点击右面的回复
      this.dialogFormVisible = true;
      setTimeout(() => {
        this.$refs.flieUpload.auto(this.uploadAdres);
      }, 100);
      (this.form.ext2 = "1"), //	回复类型：0主回复 1追加回复
        (this.form.parentid = id);
    },
    onSave() {
      //保存
      // console.log(this.form);
      // return;
      //   let data = qs.stringify(this.form);
      postAjax("ajax/rwtw/rwtw/saveHf", this.form).then(res => {
        if (res.status == 200) {
          this.$message({
            message: res.data.message,
            type: "success"
          });
          this.dialogFormVisible = false;
          this.form.twbt = "";
          this.$refs.flieUpload.filelist([]);
          if (this.id) {
            //任务
            this.btnName = true;
            this.autoMove(this.id);
          }
          if (this.meetingId) {
            //会议
            this.btnName = false;
            this.autoMove(this.meetingId);
          }
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
.f_main {
  width: 100%;
  margin-top: 10px;
  padding: 10px 0;
  border: 1px solid #cccccc;
  border-radius: 10px;
}
.f_proDestion {
  padding: 10px 0 20px 0;
  border-bottom: 1px solid #cccccc;
  font-size: 12px;
}
.ms-articleLy a {
  margin-right: 10px;
  font-size: 12px;
  color: #4a90e2;
}
.f_proDestion > span {
  color: red;
  padding: 5px 10px;
  border: 1px solid red;
  border-radius: 5px;
  float: left;
}
.f_proDestion div {
  margin-left: 90px;
  font-size: 14px;
}
.f_proDestion p {
  margin-left: 90px;
  margin-top: 10px;
}
.f_problem,
.f_answering {
  padding: 20px;
  margin-top: 20px;
  border-radius: 5px;
  border: #3cc56d 1px solid;
  background-color: rgb(233, 247, 238);
  /* border: 1px solid rgb(162,225,210);
    background: rgba(33, 226, 255, 0.22); */
}
.f_problem > p,
.f_answering p {
  color: #c5c5c5;
  font-size: 14px;
}

.f_problem > div,
.f_answering div {
  color: #545454;
  margin-top: 10px;
  font-size: 14px;
}
.f_answering {
  border: #f9bf2c 1px solid;
  background-color: rgb(245, 239, 224);
  /* border: 1px solid rgb(236, 152, 125);
     background: rgba(255, 111, 48, 0.22); */
}
.f_answering ul li {
  margin-bottom: 10px;
}
.button {
  margin: 20px 0 0 15px;
}
/* 弹窗 */
.el-form-item {
  margin-top: 20px;
}
.enclosuretop {
  margin-left: 50px;
  min-height: 30px;
  padding-bottom: 10px;
  border-bottom: 1px solid #cccccc;
}

.f_return {
  position: relative;
  cursor: pointer;
  font-size: 12px;
  color: coral;
}
.f_icon {
  width: 20px;
  height: 20px;
  background-image: url(../../../../../../static/img/Group742.png);
  background-size: 15px;
  background-repeat: no-repeat;
  position: absolute;
  top: 3px;
  right: 25px;
}
.f_dialog {
  text-align: left !important;
  margin-left: 120px;
}
.newflie {
  margin-left: 40px;
}
.fileLoad a:hover {
  color: red;
}
.default {
  display: inline-block;
  text-align: center;
  font-size: 14px;
}
</style>
