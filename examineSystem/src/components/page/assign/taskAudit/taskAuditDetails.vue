<template>
    <div>
        <div class="headTagLy">
            <h2 class="tag">任务审核</h2>
        </div>
             <div class="shadowLy create">
                 <div>
                    <label>单位名称</label>
                    <div class="detailContent">{{$route.query.unitName}}</div>
                </div>
                
                <div>
                    <label>紧急程度</label>
                    <div class="detailContent">{{$route.query.degree}}</div>
                </div>
                <div>
                    <label>任务编号</label> 
                     <div class="detailContent">{{dayTask.stageNum}}</div>
                   </div>
                <div>
                    <label>任务名称</label>
                    <div class="detailContent">{{dayTask.stageName}}</div>
                  </div>
                <div>
                     <label>任务描述</label> 
                         <div class="detailContent">{{dayTask.note}}</div>
                </div>
                <div class="cle">
                    <label>起止时间</label>
                      <div class="detailContent">{{dayTask.startDate}} -- {{dayTask.endDate}}</div>
                </div>
                <!-- <div>
                    <label>附件上传</label>
                     <div class="detailContent">
                        <a href="#"> 文件上传.jpg</a>  
                     </div>
                </div> -->
                 <!-- <div class="button clear" style="border-bottom:1px solid #cccccc;">
                     <input type="button" value="完成任务" class="f_btn f_green" @click="taskOver">
                     <input type="button" value="关闭任务" class="f_btn f_bigRed" @click="subTaskClose">
                </div> -->
                <div>
                    <!-- <label>单位名称</label>
                    <div class="detailContent">{{$route.query.unitName}}</div> -->
                      <ul class="wordName">
                          <li v-for="(item,index) in taskSubFinalArray" :key="index">
                            <div>
                                 <label>任务反馈</label> 
                                <div class="detailContent">{{item.context}}</div>
                            </div>
                             <div>
                                <label>附件上传</label>
                                <div class="detailContent">
                                    <a v-for="(aItem,aIndex) in item.attchment" :key="aIndex" download :href="aItem.url" target="_blank">{{aItem.name}}</a>  
                                </div>
                             </div>
                                <div>
                                 <label>办结时间</label>
                                <div class="detailContent">{{item.createTime}}</div>
                            </div>
                          </li>
                      </ul>
                </div>

                <div class="audit">
                    <label>时效评分</label>
                     <input type="number" placeholder="请输入评分" @input="handleInput" v-model="taskDetailForm.timeScore">
                </div>
                <div style="position: relative">
                    <span style="position: absolute;top: 0;left: 20px;">时效分描述</span>
                    <textarea placeholder="请输入备注信息" v-model.trim="taskDetailForm.timeNote"></textarea>
                </div>
                <div class="audit cle">
                    <label>质量评分</label>
                     <input type="number" placeholder="请输入评分"  @input="handleInput1" v-model="taskDetailForm.qualityScore">
                </div>
                <div style="position: relative">
                    <span style="position: absolute;top: 0;left: 20px;">质量分描述</span>
                    <textarea placeholder="请输入备注信息" v-model.trim="taskDetailForm.qualityNote"></textarea>
                </div>
                <div class="audit cle">
                    <label>调节评分</label>
                     <input type="number" placeholder="请输入评分" @input="handleInput2"  v-model="taskDetailForm.score">
                </div>
                <div style="position: relative">
                    <span style="position: absolute;top: 0;left: 20px;">调节分描述</span>
                    <textarea placeholder="请输入备注信息" v-model.trim="taskDetailForm.adjustNote"></textarea>
                </div>
                <div class="button clear">
                   <button class="f_btn f_purple" :plain="true" @click="saveSubDetail">提交</button>
                   <button @click="returnTop">返回</button>
                </div>
                 
        </div>
    </div>
</template>

<script>
import qs from 'qs';
import {
  postAjax,
  getAjax,
  uploadImg,
  oUrl
} from "../../../../api/api.js";
export default {
  data() {
    return {
      assessmentId: this.$route.query.assessmentId,
      time: "2018-01-05—2018-03-05", // 截止时间
      fileList: [],//文件上传
      taskDetailForm: {},    //任务审核详情对象
      taskDetailArray: [],    //任务审核详情数组
      taskSubFinalArray: [],   //最终子任务审核详情数组
      dayTask: {},   //dayTask对象
    };
  },
  mounted() {
    this.initAuditDetail(this.$route.query);  //初始化审核详情
  },
  methods: {
    initAuditDetail(obj) {  //初始化审核详情页面
      console.log(obj);
      getAjax(
        "ajax/task/dayTask/schedule?id=" + obj.id + "&flag=" + obj.flag
      ).then(res => {
        console.log(res.data.data)
        if (res.data.state == 1) {
          this.taskDetailForm = res.data.data.taskDetail;
          this.dayTask = res.data.data.taskStage;     //任务审核详情的taskStage对象
          this.taskDetailArray = res.data.data.scheduleList;
          // for (let i = 0; i < this.taskDetailArray.length; i++) {
          //   this.taskSubFinalArray.push({
          //     context: this.taskDetailArray[i].context,
          //     attchment: [],
          //     createTime: this.taskDetailArray[i].createTime
          //   })
          //   let fileName = "";
          //   let attaItem = "";
          //   if (this.taskDetailArray[i].attchment !== "") {
          //     let fileArray = this.taskDetailArray[i].attchment.split('|');
          //     for (let s in fileArray) {
          //       let tempArray = fileArray[s].lastIndexOf("/");
          //       fileName = fileArray[s].substring(tempArray + 1, fileArray[s].length);
          //       fileName = unescape(fileName.replace(/\u/g, "%u"));
          //       console.log(fileName)
          //       let downLoad = localStorage.getItem('attachment');
          //       attaItem = downLoad + fileArray[s];
          //       if (fileArray[s] !== '') {
          //         this.taskSubFinalArray[i].attchment.push({ name: fileName, url: attaItem });
          //       }
          //     }
          //   } else {
          //     this.taskSubFinalArray[i].attchment.push({ name: fileName, url: attaItem });
          //   }

          // }

          /************************************把数据库附件字符串转换为附件数组的方法start************************************/ 
          let subTaskArray = this.taskDetailArray;
          for (let i in subTaskArray) {
            this.taskSubFinalArray.push({
              context: subTaskArray[i].context,
              attchment: [],
              createTime: subTaskArray[i].createTime
            })
            let fileName = "暂无文件上传";
            let attaItem = "";
            if (subTaskArray[i].attchment !== "") {
              // console.log(subTaskArray[i].attchment);
              let fileArray = subTaskArray[i].attchment.split('|');
              for (let s in fileArray) {
                let tempArray = fileArray[s].split('/');
                let downLoad = localStorage.getItem('attachment');
                attaItem = downLoad + fileArray[s];
                fileName = tempArray.pop();
                fileName = decodeURI(fileName);
                if (fileArray[s] !== '') {
                  this.taskSubFinalArray[i].attchment.push({ name: fileName, url: attaItem });
                }
              }
            } else {
              this.taskSubFinalArray[i].attchment.push({ name: fileName, url: attaItem });
            }
          }
          /************************************把数据库附件字符串转换为附件数组的方法end************************************/
          console.log(this.taskDetailArray)
        } else {
          this.$message({
            type: 'error',
            message: res.data.message
          });
        }
      });
    },
    saveSubDetail() {
      let limitSum = this.$route.query.limitScore;
      if (parseFloat(this.taskDetailForm.timeScore) + parseFloat(this.taskDetailForm.qualityScore) > limitSum) {
        this.$message({
          message: "上限分数为：" + limitSum + "分，考核分数不能大于规定的上限分数",
          type: "warning"
        });
        return;
      }
      if (parseFloat(this.taskDetailForm.timeScore) + parseFloat(this.taskDetailForm.qualityScore) + parseFloat(this.taskDetailForm.score) < 0) {
        this.$message({
          message: "考核分数不能小于0！",
          type: "warning"
        });
        return;
      }
      let formatData = {
        id: this.$route.query.id,  //信息id
        taskId: this.$route.query.stageId,  //子任务id
        timeScore: this.taskDetailForm.timeScore,  //时效评分
        timeNote: this.taskDetailForm.timeNote,  //时效评分说明
        qualityScore: this.taskDetailForm.qualityScore,  //质量评分
        qualityNote: this.taskDetailForm.qualityNote, //质量评分说明
        score: this.taskDetailForm.score,  //调节评分
        adjustNote: this.taskDetailForm.adjustNote,   //调节评分说明
      }
      postAjax(
        "ajax/task/dayTask/saveScore2?flag=kaohe", qs.stringify(formatData)
      ).then(res => {
        if (res.data.state == 1) {
          this.$message({
            message: res.data.message,
            type: "success"
          });
          this.$router.push({
            path: "/taskAudit"
          });
        } else {
          this.$message({
            message: res.data.message,
            type: "error"
          });
        };
      })
    },
    taskOver() {  //任务完成
      let flag = 1;   //子任务完成默认传flag为1
      getAjax(
        "ajax/task/dayTask/complete?id=" + this.$route.query.taskId + "&stageId=" + this.$route.query.stageId + "&flag=" + flag
      ).then(res => {
        if (res.data.state == 1) {
          this.$message({
            message: res.data.message,
            type: "success"
          });
        } else {
          this.$message({
            message: res.data.message,
            type: "error"
          });
        };
      })
    },
    subTaskClose() {  //任务关闭
      let flag = 1;   //子任务关闭默认传flag为1
      getAjax(
        "ajax/task/dayTask/revoke?id=" + this.$route.query.taskId + "&stageId=" + this.$route.query.stageId + "&flag=" + flag
      ).then(res => {
        if (res.data.state == 1) {
          this.$message({
            message: res.data.message,
            type: "success"
          });
        } else {
          this.$message({
            message: res.data.message,
            type: "error"
          });
        };
      })
    },
    defaultRequest(id) {
      console.log(id);
    },
    handleClose(tag) {
      //抄送单位
      console.log(tag);
      this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
    },
    returnTop() {
      //返回
      window.history.back(-1);
      //    this.$router.push({name:'f_newTask'});
    },
    childTask() {
      //子任务详情
      this.$router.push({ name: "f_childTaskDetails" });
    },
    handleInput(e) {
      //时效评分
      this.val = e.target.value.replace(/[^\d]/g, "");
    },
    handleInput1(e) {
      //质量评分
      this.vals = e.target.value.replace(/[^\d]/g, "");
    },
    handleInput2(e) {
      //调节评分
      this.vales = e.target.value.replace(/[^\d]/g, "");
    },
    submission() {
      //提交
      //判断备注信息字符不超过500
      if (
        this.taskname.length > 500 ||
        this.taskname1.length > 500 ||
        this.taskname2.length > 500
      ) {
        this.$message({
          message: "备注信息字符不能超过500",
          type: "warning"
        });
        return;
      }
      let obj = {  //评分、描述
        sx: {
          id: this.val ? "" : 0,
          value: this.taskname
        },
        zl: {
          id: this.vals ? "" : 0,
          value: this.taskname1
        },
        tj: {
          id: this.vales ? "" : 0,
          value: this.taskname2
        }
      };
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
.create div a {
  margin-right: 10px;
}
.create div > label {
  display: inline-block;
  float: left;
  margin: 0 20px;
}
.create div.audit > input {
  width: 120px;
  height: 35px;
  border: 1px solid #cccccc;
  border-radius: 5px;
  text-align: center;
  /* padding-left: 10px; */
}
.create textarea {
  width: 300px;
  height: 80px;
  float: left;
  border: 1px solid #cccccc;
  margin-left: 95px;
  margin-bottom: 20px;
  padding: 10px;
  border-radius: 5px;
  resize: none; /**严禁拉伸*/
}
.create div .detailContent {
  width: 80%;
  min-height: 20px;
  text-align: left;
  margin-left: 95px;
  color: #898a8f;
}
.audit {
  line-height: 40px;
}
.create .button {
  height: 50px;
  margin-left: 20px;
}
.create .button button {
  border: none;
  float: left;
  margin-right: 30px;
  padding: 10px 30px;
  border-radius: 5px;
}
.create .button button:last-child:hover {
  background: #e6e0e0;
}
.create div.topScore {
  margin-left: 100px;
  border: 1px solid #cccccc;
  border-radius: 5px;
}
.wordName {
  margin-left: 20px;
}
.wordName li {
  width: 350px;
  padding: 10px;
  border: 1px solid #cccccc;
  margin-top: 20px;
  border-radius: 5px;
}
.wordName div.detailContent {
  width: 70%;
  word-wrap: break-word;
}
</style>



