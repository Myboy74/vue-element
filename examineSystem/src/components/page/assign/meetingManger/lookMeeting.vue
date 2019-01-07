<template>
    <div>
        <div class="headTagLy">
            <h2 class="tag">查看会议</h2>
        </div>
        <div class="shadowLy create">
            <!-- <div>
                    <label>项目名称</label>
                    <div class="detailContent">{{obj.projectName}}</div>
                </div> -->
            <!-- <div style="position: relative">
                <span style="position: absolute;top: 0;left: 20px;">上限分数</span>
                <div class="topScore" style="width:300px;">
                    <p style="background: rgb(240,240,240);border-bottom:1px solid #cccccc;">
                        <span>时效</span>
                        <span>质量</span>
                        <span>总分</span>
                    </p>
                    <p>
                        <span>{{obj.sTimeScore}}</span>
                        <span>{{obj.sQualityScore}}</span>
                        <span>{{obj.sumScore}}</span>
                    </p>
                </div>
            </div> -->
            <div>
                <label>会议编号</label>
                <div class="detailContent">{{lookObj.meetnum}}</div>
            </div>
            <div>
                <label>会议主题</label>
                <div class="detailContent">{{lookObj.title}}</div>
            </div>
            <div>
                <label>会议描述</label>
                <div class="detailContent">{{lookObj.summary}}</div>
            </div>
            <div>
                <label>参会人员要求</label>
                <div class="detailContent">{{lookObj.requirement}}</div>
            </div>
            <div>
                <label>会议时间</label>
                <div class="detailContent">{{lookObj.meetingtime}}</div>
            </div>
            <div>
                <label>会议地点</label>
                <div class="detailContent">{{lookObj.address}}</div>
            </div>
            <div>
                <label>上报截止时间</label>
                <div class="detailContent">{{lookObj.limitetime}}</div>
            </div>
            <div class="cle">
                <label>总分上限</label>
                <div class="detailContent">{{lookObj.score}}</div>
            </div>
            <div>
                <label>附件下载</label>
                <div class="detailContent">
                    <span class="row-text" v-if="detailFileArray.length">
                        <a style="padding:0 20px 10px 0;" v-for="(item,index) in detailFileArray" :key="index" download :href="item.url"
                            target="_blank">{{item.fileName}}</a>
                    </span>
                    <span v-else style="color:#aeaeae">暂无上传文件</span>
                </div>
            </div>
            <div class="cle">
                <label class="fl">下发单位</label>
                <div class="copyScore" style="margin-top: 0px;" v-if="lowerWord.length" >
                    <el-tag v-for="tag in lowerWord" :key="tag.label" :id="tag.id">
                        {{tag.label}}
                    </el-tag>
                </div> 
                <div v-else style="color:#aeaeae">暂无下发单位</div>
            </div>
            <div class="cle">
                <label class="fl">抄送单位</label> 
                <div class="copyScore choiceWork" v-if="dynamicTags.length" style="margin-top: 0px;">
                    <el-tag v-for="tag in dynamicTags" :key="tag.label" :id="tag.id">
                        {{tag.label}}
                    </el-tag>
                </div>
                 <div v-else style="color:#aeaeae">暂无抄送单位</div>
            </div>
            <div class="cle">
                <label class="fl">&nbsp;</label>

                <div class="chlidTable">
                    <el-table :data="tableData" tooltip-effect="dark" stripe border style=" margin:0px; border-radius:5px;">
                        <el-table-column prop="num" label="序号">
                        </el-table-column>
                        <el-table-column prop="officeName" label="上报单位">
                        </el-table-column>
                        <el-table-column prop="memberNum" label="上报人数">
                        </el-table-column>
                        <el-table-column prop="tel" label="联系电话">
                        </el-table-column>
                        <el-table-column label="操作" width="150">
                            <template slot-scope="scope">
                                <div class="f_box">
                                    <!-- <img src="../../../../static/img/Group145.png" alt="" title="发布任务"> -->
                                    <!-- <img src="../../../../../static/img/Group147.png" alt="" title="编辑"> -->
                                    <img src="../../../../../static/img/Group148.png" alt="" title="查看详情" @click="reportDeatails(scope.row.officeid,scope.row.id)">
                                    <!-- <img src="../../../../static/img/Group149.png" alt="" title="任务完成"> 
                    <img src="../../../../static/img/Group151.png" alt="" title="关闭任务"> -->
                                    <!-- <img src="../../../../../static/img/Group150.png" alt="" title="删除任务">  -->
                                    <!-- <img src="../../../../static/img/Group810.png" alt="" title="问题答疑"> -->
                                    <!-- <img src="../../../../static/img/Group820.png" alt="" title="接收任务"> -->
                                    <!-- <img src="../../../../static/img/Group823.png" alt="" title="任务办理"> -->
                                </div>
                            </template>
                        </el-table-column>
                    </el-table>
                    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                        :current-page.sync="currentPage1" :page-size="100" layout="prev, pager, next, jumper" :page-count="allPage">
                    </el-pagination>
                    <div class="button clear">
                        <button @click="returnTop" class="f_btn" style="color:#000!important">返回</button>

                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { postAjax, getAjax, oUrl, uploadImg } from "../../../../api/api.js";
export default {
  data() {
    return {
      obj: {
        stageList: []
      }, //初始化的整个页面对象
      time: "2018-01-05—2018-03-05", // 起止时间
      fileList: [], //文件上传
      dynamicTags: [], //抄送单位
      lowerWord: [], //下发单位
      tableData: [], //子任务
      detailId: sessionStorage.getItem("detailId"), //任务详情页面id
      detailFileArray: [], //详情附件数组
      look: this.$route.query.look,
      lookObj: {}, //会议详情对象
      currentPage1: 1, //当前页码
      allPage: 1, //总目录数
      pageSize: 1 //每页条数
    };
  },
  mounted() {
    this.autoMove(this.look);
  },
  methods: {
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.fenyeFn(this.look, val);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.fenyeFn(this.look, val);
      // this.autoMove(this.look); //重新初始化页面
    },
    fenyeFn(look, pageNo) {
      /*******************************跳转顶部方法start***************************************/
      let contentScrollTop = document.getElementsByClassName("content");
      let scrollTop = contentScrollTop[0].scrollTop;
      if (scrollTop !== 0) {
        document.getElementsByClassName("content")[0].scrollTop = 0;
      }
      /*******************************跳转顶部方法end***************************************/
      postAjax(
        "ajax/meeting/taskReceivemeeting/meetingOrgDetail?meetingid=" +
          look +
          "&pageNo=" +
          pageNo
      ).then(res => {
        this.allPage = res.data.data.page.pageCount; //总条目数
        this.pageSize = res.data.data.page.pageSize; //每页条数
        this.tableData = res.data.data.page.list;
      });
    },
    autoMove(num) {
      //会议详情进入
      postAjax(
        "ajax/meeting/taskReceivemeeting/meetingOrgDetail?meetingid=" + num
      ).then(res => {
        this.allPage = res.data.data.page.pageCount; //总条目数
        this.pageSize = res.data.data.page.pageSize; //每页条数
        if (res.data.data.page.list) {
          this.tableData = res.data.data.page.list;
        }
        if (res.data.data.taskMeeting) {
          this.lookObj = res.data.data.taskMeeting;
        }
        if (this.lookObj.receiveOrgMap) {
          this.lowerWord = this.lookObj.receiveOrgMap;
        }
        //下发单位
        if (this.lookObj.duplicateOrgMap) {
          this.dynamicTags = this.lookObj.duplicateOrgMap;
        } // 抄送单位
        // console.log(this.lookObj)
        /***************文件附件字符串转换数组***start***************/
        if (this.lookObj.attachment) {
          let tempFileArray = this.lookObj.attachment.split("|");
          let fileBefore = localStorage.getItem("attachment");
          for (let i in tempFileArray) {
            let tempUrl = decodeURI(fileBefore + tempFileArray[i]);
            let nameArray = tempUrl.split("/");
            let finalName = nameArray.pop();
            finalName = decodeURI(finalName);
            // console.log(finalName);
            if (tempFileArray[i] !== "") {
              this.detailFileArray.push({
                fileName: finalName,
                url: tempUrl
              });
            }
          }
          // console.log(this.detailFileArray);
        }
        /***************文件附件字符串转换数组***end***************/
      });
    },
    handleClose(tag) {
      //抄送单位
      // console.log(tag);
      this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
    },
    returnTop() {
      //返回
      window.history.back(-1);
      //    this.$router.push({name:'f_newTask'});
    },
    reportDeatails(num, id) {
      //进入上报明细
      //  console.log("接收方"+num);
      //   console.log("会议id"+id);
      this.$router.push({
        name: "f_reportDetails",
        query: {
          report: num, //接收方
          meetingid: id //会议方
        }
      });
    },
    childTask(subId) {
      //子任务详情
      let status = this.obj.importantLevelName;
      this.$router.push({
        name: "f_childTaskDetails",
        query: {
          state: status
        }
      });
      sessionStorage.setItem("subTaskId", subId);
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
  /* margin: 20px 0; */
  margin-top: 20px;
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
  color: #898a8f;
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

.create div.topScore {
  margin-left: 100px;
  border: 1px solid #cccccc;
  border-radius: 5px;
}

.topScore p span {
  width: 95px;
  text-align: center;
  display: inline-block;
  padding: 10px 0;
}

.topScore p:first span + span {
  border-left: 1px solid #cccccc;
}

.iconfont {
  margin-left: -25px;
}

.create div.copyScore,
.create div.chlidTable {
  display: inline-block;
  width: 80%;
  margin-left: 0px;
  min-height: 20px;
}

.copyScore .el-tag,
.choiceWork .el-tag {
  background: #e7eaf9 !important;
  color: #5c74d8 !important;
  border: none !important;
  margin: 0 10px 10px 0;
}

.choiceWork .el-tag {
  background: #ffecd9 !important;
  color: #ff7e00 !important;
}

.el-date-editor.el-input {
  margin-left: 12px;
}

.detailContent .row-text {
  display: inline-block;
  width: calc(100% - 106px);
  font-size: 14px;
  color: #898a8f;
}

.detailContent .row-text a {
  color: #4a90e2;
  cursor: pointer;
}

.detailContent .row-text a:hover {
  color: #dd0000;
  cursor: pointer;
}

.create > div > label {
  word-wrap: break-word;
  width: 100px;
}
</style>
