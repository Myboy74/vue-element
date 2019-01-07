<template>
    <div>
        <div class="headTagLy">
            <h2 class="tag">会议审核</h2>
        </div>
             <div class="shadowLy create">
                 <div>
                    <label>会议标题</label>
                    <div class="detailContent">{{meetingTxt.title}}</div>
                </div>
                
                <div>
                    <label>会议内容</label>
                    <div class="detailContent">{{meetingTxt.summary}}</div>
                </div>
                <div>
                    <label>会议编号</label> 
                     <div class="detailContent">{{meetingTxt.meetnum}}</div>
                   </div>
                <div style="margin:0 0 40px 0;">
                    <label>参会人员要求</label>
                    <div class="detailContent">{{meetingTxt.requirement}}</div>
                  </div>
                <div>
                     <label>会议地点</label> 
                         <div class="detailContent">{{meetingTxt.address}}</div>
                </div>
                <div class="cle">
                    <label>会议时间</label>
                      <div class="detailContent">{{meetingTxt.meetingtime}}</div>
                </div>
                <div>
                    <label>附件上传</label>
                     <div class="detailContent">
                        <span style="color:#aeaeae;" v-if="wordName.length==0"
                        >暂无上传文件</span>
                         <a 
                            style="padding:0 10px 10px 0" 
                            v-else download
                             v-for="(ite,index) in wordName"
                                :key="index" :href="ite.url" target="_blank">
                                {{ite.name}}
                            </a>
                     </div>
                  
                </div>
                 <div v-show="false" class="button clear" style=" border-bottom:1px solid rgb(224, 223, 223);">
                     <input type="button" value="完成任务" class="f_btn f_green" :plain="true" @click="submission">
                     <input type="button" value="撤销任务" class="f_btn f_bigRed" :plain="true" @click="subtnClose">
                </div>
                <div>
                    <label>单位名称</label>
                      <div class="detailContent">{{wordTxt.officeName?wordTxt.officeName:"未找到单位名称"}}</div>
                      <ul class="wordName" v-if="wordTxt.memberList">
                          <li v-for="(item,index) in wordTxt.memberList" :key="index">
                            <div>
                                 <label>参会人员姓名</label> 
                                <div class="detailContent">{{item.name}}</div>
                            </div>
                            <div>
                                 <label>参会人员性别</label> 
                                <div class="detailContent">{{item.sexValue}}</div>
                            </div>
                             <div>
                                 <label>参会人员电话</label> 
                                <div class="detailContent">{{item.tel}}</div>
                            </div>
                             <div>
                                 <label>参会人员单位</label> 
                                <div class="detailContent">{{item.office}}</div>
                            </div>
                            <div>
                              <label>参会人员职务</label> 
                              <div class="detailContent">{{item.position}}</div>
                            </div>
                               <div>
                                 <label>参会人员备注</label> 
                                <div class="detailContent">{{item.remark}}</div>
                            </div>
                          </li>
                      </ul>
                </div>
                <div>
                  <label>会议联系电话</label> 
                  <div class="detailContent">{{wordTxt.tel?wordTxt.tel:"无"}}</div>
                </div>
                <div style="margin-top: 40px">
                  <label>备注信息</label> 
                  <div v-if="wordTxt.note == undefined" class="detailContent" style="color:#aeaeae">暂无</div>
                  <div v-else class="detailContent">{{wordTxt.note}}</div>
                </div>
                <div>
                  <label>附件上传</label>
                  <div class="detailContent">
                    <span v-if="arrname.length==0" style="color:#aeaeae">暂无上传文件</span>
                       <a 
                            style="padding:0 10px 10px 0" 
                            v-else download
                             v-for="(ite,index) in arrname"
                                :key="index" :href="ite.url" target="_blank">
                                {{ite.name}}
                            </a>
                  </div>
                </div>
                <el-form ref="form" :model="form" label-width="80px">
                  <div class="texttar">
                    <el-form-item label="总分评分" prop="address">
                      <el-input type="number" v-model="form.address" placeholder="请输入评分" class="wid"></el-input>
                    </el-form-item>
                    <el-form-item label="备注" prop="summary">
                      <el-input type="textarea" placeholder="请输入备注信息" v-model.trim="form.summary"></el-input>
                  </el-form-item>
                </div>
              </el-form>
              <div class="button clear" style="margin-top: 30px;border-top: 1px solid rgb(224, 223, 223);"> 
                <button class="f_btn f_green" @click="saving('form')">保存</button>
                <!-- <input type="text" value="返回" class="f_btn" @click="returnTop" style="color: rgb(0, 0, 0);"> -->
                <button @click="returnTop" class="f_btn" style="color: rgb(0, 0, 0);">返回</button>
              </div>
        </div>
    </div>
</template>

<script>
import qs from "qs";
import { postAjax, getAjax, oUrl, uploadImg } from "../../../../api/api.js";
export default {
  created() {
    this.autoMove(this.assessmentId, this.wordId); //进入页面获取内容
  },
  data() {
    return {
      assessmentId: this.$route.query.assessmentId, //接收方id
      wordId: this.$route.query.wordId, //会议id
      attachment: localStorage.getItem("attachment"), //上传文件得下载（预览）路径
      meetingTxt: "", //上面会议信息
      wordTxt: "", //下面会议信息
      arr: [], //获取会议文件路径地址
      arrname: [], //获取会议文件名称
      wordArr: [], //获取单位上传得文件路径地址
      wordName: [], //获取单位上传文件得名称
      time: "2018-10-1 12:30",
      form: {},
      rules: {
        address: [
          {
            required: true,
            message: "请输入总分评分",
            trigger: ["blur", "change"]
          },
          {
            pattern: /^[\d]+$/,
            message: "输入必须是数字",
            trigger: ["blur", "change"]
          }
        ],
        summary: [
          {
            required: true,
            message: "请输入备注信息",
            trigger: ["blur", "change"]
          },
          {
            pattern: /^([\w\W]){1,500}$/,
            message: "输入的是字符不能超过500",
            trigger: ["blur", "change"]
          }
        ]
      },
      fileList: [], //文件上传
      limitScore: 0, //上限分数
      globalInfo: {} //全局信息对象
    };
  },
  methods: {
    autoMove(id, wId) {
      //通过id来获取页面信息
      //id:单位id  wId:会议id
      postAjax(
        "ajax/meeting/taskMeetingCheck/toCheckPage?receiveid=" +
          id +
          "&meetingid=" +
          wId
      ).then(res => {
        if (res.status == 200) {
          let otherData = res.data.taskReceivemeeting;
          this.form.address = otherData.score;
          this.form.summary = otherData.scoreRemark;
          this.meetingTxt = res.data.taskReceivemeeting.taskMeeting; //会议信息
          this.wordTxt = res.data.taskReceivemeeting; //单位信息
          this.limitScore = otherData.taskMeeting.score;
          if (this.wordTxt.attachment) {
            //会议文件
            this.arr = this.wordTxt.attachment.split("|");
            // this.arr.splice(0, 1); //获取文件路径地址

            this.arr.forEach(element => {
              //获取文件名称
              var index = element.lastIndexOf("/");
              let name = element.substring(index + 1, element.length);
              name = decodeURI(name);
              if (name !== '') {
                this.arrname.push({
                  name:name,
                  url:this.attachment+element

                });
              }
            });
          }

          if (this.meetingTxt) {
            //会议文件
            this.wordArr = this.meetingTxt.attachment.split("|");
            // this.wordArr.splice(0, 1); //获取文件路径地址

            this.wordArr.forEach(element => {
              //获取文件名称
              var index = element.lastIndexOf("/");
              let name = element.substring(index + 1, element.length);
              if (element !== "") {
                this.wordName.push({
                  name: name,
                  url: this.attachment + element
                });
              }
            });
          }
        } else {
          this.$message({
            showClose: true,
            message: "会议信息获取失败",
            type: "error"
          });
        }
      });
    },
    saving(formName) {
      //保存下测试是否填写评分及备注
      let self = this;
      if (this.form.address == undefined) {
        this.$message({
          type: "warning",
          message: "总分评分为必填项，请输入总评分！"
        });
        return;
      }
      if (this.form.address == "") {
        this.$message({
          type: "warning",
          message: "总分评分为必填项，请输入总评分！"
        });
        return;
      }
      if (this.form.address > this.limitScore) {
        this.$message({
          type: "warning",
          message:
            "上限分数为：" +
            this.limitScore +
            "分，考核分数不能大于规定的上限分数"
        });
        return;
      }
      if (this.form.address < 0) {
        this.$message({
          type: "warning",
          message: "考核分数不能小于0"
        });
        return;
      }
      if (this.form.summary == undefined) {
        this.$message({
          type: "warning",
          message: "备注信息为空，请输入备注信息！"
        });
        return;
      }
      if (this.form.summary == "") {
        this.$message({
          type: "warning",
          message: "备注信息为空，请输入备注信息！"
        });
        return;
      }
      if (this.form.summary.length > 500) {
        this.$message({
          type: "warning",
          message: "备注信息字数不得超过500字！"
        });
        return;
      }
      // this.$refs[formName].validate(valid => {
      //   if (valid) {
      self.btnVation(); //没问题在执行ajax(下面得方法)
      //   } else {
      //     self.$message.error("请您输入总分评分及备注信息");
      //     return false;
      //   }
      // });
    },
    btnVation() {
      //先执行上面得方法 保存按钮
      let param = {
        id: this.assessmentId,
        score: this.form.address,
        scoreRemark: this.form.summary
      };
      postAjax("ajax/meeting/taskMeetingCheck/saveScore", param)
        .then(res => {
          this.$message({
            showClose: true,
            message: "会议保存成功",
            type: "success"
          });
          this.$router.push({ name: "meetingAudit" });
        })
        .catch(err => {
          this.$message({
            showClose: true,
            message: "会议保存失败",
            type: "error"
          });
        });
    },
    returnTop() {
      //返回按钮
      window.history.back(-1);
    },
    submission() {
      //完成任务按钮
      postAjax(
        "ajax/meeting/taskMeetingCheck/meetingDetail?id=" + this.wordId
      ).then(res => {
        let date = res.data.taskReceivemeetingList;
        for (var i = 0; i < date.length; i++) {
          if (date[i].status == "1") {
            this.$message({
              message: "存在未考核项目不能完成任务",
              type: "warning"
            });
            return;
          }
        }
        this.$confirm("是否确认完成?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            postAjax(
              "ajax/meeting/taskMeetingCheck/finalMeeting?meetingid=" +
                this.wordId
            )
              .then(res => {
                // console.log(res);
                this.$message({
                  showClose: true,
                  message: "操作成功",
                  type: "success"
                });
                this.$router.push({ name: "meetingAudit" });
              })
              .catch(err => {
                this.$message({
                  showClose: true,
                  message: "操作失败",
                  type: "error"
                });
              });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消完成任务"
            });
          });
      });
    },
    subtnClose() {
      //关闭任务按钮
      let _this = this;
      this.$confirm("此操作将永久撤销该会议, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          //如果确定关闭走ajax
          postAjax(
            "ajax/meeting/taskMeetingCheck/closeMeeting?meetingid=" +
              this.wordId
          )
            .then(res => {
              console.log(res);
              this.$message({
                showClose: true,
                message: "会议撤销成功",
                type: "success"
              });
              this.$router.push({ name: "meetingAudit" });
            })
            .catch(err => {
              this.$message({
                showClose: true,
                message: "会议撤销失败",
                type: "error"
              });
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消撤销"
          });
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
.create div {
  word-wrap: break-word;
  margin: 20px 0;
  min-height: 10px;
}
.create div a {
  margin: 0 10px 10px 0;
}
.create div > label {
  display: inline-block;
  float: left;
  width: 64px;
  margin: 0 20px;
  color: #606266;
}
.create div .wordName li div .detailContent {
  /* width: 80%; */
  width: 70%;
  min-height: 20px;
  text-align: left;
  margin-left: 100px;
  color: #898a8f;
}
.create .button {
  height: 50px;
  margin-left: 20px;
}
.create .button button {
  border: none;
  float: left;
  margin-top: 20px;
  margin-right: 30px;
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
  width: 430px;
  padding: 10px;
  border: 1px solid rgb(224, 223, 223);
  margin-top: 20px;
  border-radius: 5px;
}
.create div .wordName li div {
  margin: 20px 0 30px 0;
}
</style>



