<template>
    <div>
        <div class="headTagLy">
            <h2 class="tag">任务详情</h2>
        </div>
             <div class="shadowLy create">
                 <!-- <div>
                    <label>项目名称</label>
                    <div class="detailContent">{{obj.projectName}}</div>
                </div> -->
                  <div style="position: relative">
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
                           <span>{{Number(obj.sumScore).toFixed(2)}}</span>
                      </p>
                  </div>
                    
                </div>
                <div>
                    <label>紧急程度</label>
                    <div class="detailContent">{{obj.importantLevelName}}</div>
                </div>
                <div>
                    <label>任务编号</label> 
                     <div class="detailContent">{{obj.taskNum}}</div>
                   </div>
                <div>
                    <label>任务名称</label>
                    <div class="detailContent">{{obj.name}}</div>
                  </div>
                <div>
                     <label>任务描述</label> 
                         <div class="detailContent">{{obj.content}}</div>
                    </div>
                <div class="cle">
                    <label>起止时间</label>
                      <div class="detailContent">{{obj.startDate}} -- {{obj.endDate}}</div>
                </div>
                <div>
                    <label>附件下载</label>
                     <div class="detailContent">
                        <span class="row-text" v-if="detailFileArray.length">
                            <a style="margin:0 20px 10px 0;" v-for="(item,index) in detailFileArray" :key="index" download :href="item.url" target="_blank">{{item.fileName}}</a>
                        </span>
                        <span v-else style="color:#aeaeae;font-size:14px">暂无上传文件</span>
                     </div>
                </div>
                <div class="cle">
                    <label class="fl">下发单位</label>
                    <div class="copyScore" v-if="lowerWord.length">
                          <el-tag
                    v-for="tag in lowerWord"
                    :key="tag.label"
                    :id="tag.id">
                    {{tag.label}}
                    </el-tag>
                    </div>
                    <div v-else style="color:#aeaeae;">暂无下发单位</div>
                </div>
                <div class="cle">
                    <label class="fl">抄送单位</label>
                    <div class="copyScore choiceWork" v-if="dynamicTags.legnth">
                          <el-tag
                    v-for="tag in dynamicTags"
                    :key="tag.label"
                    :id="tag.id" >
                    {{tag.label}}
                    </el-tag>
                    </div>
                    <div v-else style="color:#aeaeae;">暂无抄送单位</div>
                </div>
                <div class="cle">
                    <label class="fl">子任务</label>
            
                    <div class="chlidTable">
                          <el-table
                    :data="tableData"
                    border
                    stripe
                    style="width: 80%">
                    <el-table-column
                    prop="stageNum"
                    label="子任务编号"
                    width="180">
                    </el-table-column>
                    <el-table-column
                    prop="stageName"
                    label="子任务名称"
                    width="140">
                    </el-table-column>
                    <el-table-column
                    prop="timeScore"
                    label="时效"
                    width="50">
                    </el-table-column>
                    <el-table-column
                    prop="qualityScore"
                    label="质量"
                    width="50">
                    </el-table-column>
                    <el-table-column
                    label="总分"
                    width="90">
                        <template slot-scope="scope">
                            {{Number(scope.row.sumScore).toFixed(2)}}
                        </template>
                    </el-table-column>
                    <el-table-column
                    prop="note"
                    label="详情">
                    </el-table-column>
                      <el-table-column
                    prop="endDate"
                    label="截止时间"
                    width="100">
                    </el-table-column>
                     <el-table-column
              label="操作" width="80">
              <template slot-scope="scope">
                <div class="f_box">
                    <!-- <img src="../../../../../static/img/Group145.png" alt="" title="发布任务"> -->
                    <!-- <img src="../../../../../static/img/Group147.png" alt="" title="编辑"> -->
                    <img src="../../../../../static/img/Group148.png" alt="" title="查看详情" @click="childTask(scope.row.id)">
                    <!-- <img src="../../../../../static/img/Group149.png" alt="" title="任务完成"> 
                    <img src="../../../../../static/img/Group151.png" alt="" title="撤销任务">
                    <img src="../../../../../static/img/Group150.png" alt="" title="删除任务"> -->
                    <!-- <img src="../../../../../static/img/Group810.png" alt="" title="问题答疑"> -->
                    <!-- <img src="../../../../../static/img/Group820.png" alt="" title="接收任务"> -->
                    <!-- <img src="../../../../../static/img/Group823.png" alt="" title="任务办理"> -->
                  </div>        
                   </template>
                 </el-table-column>
                </el-table>
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
            },   //初始化的整个页面对象
            time: "2018-01-05—2018-03-05", // 起止时间  
            fileList: [],//文件上传
            dynamicTags: [],  //抄送单位
            lowerWord: [],  //下发单位
            tableData: [],//子任务
            detailId: sessionStorage.getItem("detailId"),   //任务详情页面id
            detailFileArray: [],  //详情附件数组
        };
    },
    mounted() {
        this.detailRequest(this.detailId); //进入页面获取内容
    },
    methods: {
        detailRequest(id) {
            getAjax("ajax/task/dayTask/detail?id=" + id).then(res => {
                if (res.data.state == 1) {
                    this.obj = res.data.data.dayTask;
                    // console.log(this.obj);
                    if(this.obj.copyCompMap){
                        this.dynamicTags = this.obj.copyCompMap; //给抄送单位的tag数组赋值
                    }
                    if(this.obj.receiveCompMap){
                        this.lowerWord = this.obj.receiveCompMap; //给下发单位的tag数组赋值
                    }
                    if(this.obj.stageList){
                        this.tableData = this.obj.stageList; //给子任务列表赋值
                    }
                    
                    /***************文件附件字符串转换数组***start***************/
                    if (this.obj.attachment) {
                        // console.log(this.obj.attachment)
                        let tempFileArray = this.obj.attachment.split('|');
                        let fileBefore = localStorage.getItem("attachment");
                        for (let i in tempFileArray) {
                            let tempUrl = decodeURI(fileBefore + tempFileArray[i]);
                            let nameArray = tempUrl.split('/');
                            let finalName = nameArray.pop();
                            finalName = decodeURI(finalName)
                            // console.log(finalName);
                            if (tempFileArray[i] !== '') {
                                this.detailFileArray.push({ fileName: finalName, url: tempUrl });
                            }
                        }
                    }
                    /***************文件附件字符串转换数组***end***************/
                    // console.log(this.detailFileArray);
                } else {
                    this.$message({
                        type: 'error',
                        message: res.data.message
                    });
                }
            });
        },
        handleClose(tag) {  //抄送单位
            // console.log(tag);
            this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
        },
        returnTop() { //返回
            window.history.back(-1);
            //    this.$router.push({name:'f_newTask'});
        },
        childTask(subId) { //子任务详情
            let status = this.obj.importantLevelName
            this.$router.push({ name: 'f_childTaskDetails', query: { state: status } });
            sessionStorage.setItem("subTaskId", subId);
        }
    }
}
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
  margin-left: 90px;
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
</style>



