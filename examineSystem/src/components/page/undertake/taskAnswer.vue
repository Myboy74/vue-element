<template>
    <div class="taskAnser">
        <div class="headTagLy">
            <h2 class="tag">答疑列表</h2>
        </div>
        <div class="ms-articleLy shadowLy" 
        style="padding:1px 1px 10px 1px;"
        v-if="content.length"
        v-for="(item,index) in content" :key="index" >
            <div class="question-article">
                <div class="question-date">
                   {{item.twsj}}
                </div>
                <div class="question-text" @click="toAnswerDetail(item.id)">
                    {{item.taskname}}
                </div>
                <div class="question-talk-tag">
                    <span class="tag-num">{{item.zwcount}}</span>
                    <p class="iconfont"></p>
                    <div class="clear"></div>
                </div>
                <div class="clear"></div>
            </div>
        </div>
        <div v-if="!content.length" style="padding-top:50px;font-size:14px;text-align: center">暂无数据</div>
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
        <div class="button-group" style="border-bottom:none;margin:3% 0% 0% 2%;">
            <div class="f_btn f_orange default"  @click="addTask">
                添加问题
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
  created(){
     if(this.id){
      this.autoMove(this.id);
    }
  },
  data() {
    return {
      id:this.$route.query.taskAnswer,
      uploadAdres:"?uploadPath=taskAnswer",// //上传文件的地址
      attachmentUrl: localStorage.getItem("attachment"), //上传文件得下载（预览）路径
      dialogFormVisible: false,//弹窗
      form: {
        taskid:"",//任务（会议）ID
        parentid:"",//被追加问题ID，追加问题保存时属于必选项
        twbt:"",//提问内容
        fj:"",//附件地址
        ext2:"0",//提问类型：0主题问、1追问
      },
      formLabelWidth: "120px",
      content:[],//答疑内容
    };
  },
  methods: {
    autoMove(id){
      postAjax("ajax/rwtw/rwtw/dy?id="+id).then(res => {
        if(res.status==200){
          this.content=res.data.data.rwtwList;
        }
      })
    },
    addTask(){
      this.dialogFormVisible = true;
      setTimeout(()=>{ //创建dome后才能找到
        this.$refs.flieUpload.auto(this.uploadAdres);//给上传地址传一个后缀地址
      },100);
    },
    uploadSuccess(val) {
      //上传文件的信息
      let str = "";
      val.forEach(element => {
        str += element.url + "|";
      });
      this.form.fj = str;
    },
    backRoute() {  //返回
      window.history.go(-1);
    },
    onSave(){  //保存
      this.form.taskid=this.id;
      // let data = qs.stringify(this.form);
       postAjax("ajax/rwtw/rwtw/save",this.form).then(res => {
        if(res.status==200){
           this.$message({
            message: res.data.message,
            type: "success"
          });
          this.dialogFormVisible = false;
          this.form={}
          this.$refs.flieUpload.filelist();
          this.autoMove(this.id);
        }
      })
    },
    toAnswerDetail(id){  //进入详情
      this.$router.push({
        name:'answerDetail',
        query:{
          answerDetail:id
        }
      });
    }
  }
};
</script>

<style scoped>
.button-group {
  width: 80%;
  padding-bottom: 5px;
  border-bottom: #ececec 1px solid;
}
/* 按钮默认样式 */
.default {
  display: inline-block;
  /* margin: 4% 0% 0% 2%; */
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
  /* padding-bottom: 15px; */
}
/* 日期样式 */
.question-date {
  font-size: 12px;
  color: #898a8f;
}
.question-text {
  width: 100%;
  margin-top: 20px;
  font-size: 14px;
  color: #353639;
  word-wrap: break-word;
  padding-bottom: 5px;
}
.question-text:hover{
  color: red;
  cursor: pointer;
}
.question-talk-tag {
  float:right;
  /* width: 5%; */
  /* cursor: pointer; */
  font-size: 14px;
  color: #898a8f;
  text-align: right;
  margin: 0;
  /* justify-content:center;
    align-items:center */
  vertical-align: middle;
  position: relative;
}
.tag-num {
  display: block;
  float: right;
  padding-left: 20px;
}
.newflie{
  margin-left:40px;
}
.iconfont{
  width: 15px;
  height: 14px;
  background-image: url(../../../../static/img/taskicon.png);
  background-size: 100%;
  margin-top: 4px;
}

</style>
