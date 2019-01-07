<template>
    <div>
        <div class="headTagLy">
            <h2 class="tag">子任务详情</h2>
        </div>
             <div class="shadowLy create">
                 <!-- <div v-show="false">
                    <label>项目名称</label>
                    <div class="detailContent">这里没有给复制死数据</div>
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
                           <span>{{subObj.timeScore}}</span>
                           <span>{{subObj.qualityScore}}</span>
                           <span>{{subObj.sumScore}}</span>
                      </p>
                  </div>
                    
                </div>
                <div>
                    <label>紧急程度</label>
                    <div class="detailContent">{{$route.query.state}}</div>
                </div>
                <div>
                    <label>任务编号</label> 
                     <div class="detailContent">{{subObj.stageNum}}</div>
                   </div>
                <div>
                    <label>任务名称</label>
                    <div class="detailContent">{{subObj.stageName}}</div>
                  </div>
                <div>
                     <label>任务描述</label> 
                         <div class="detailContent">{{subObj.note}}</div>
                    </div>
                <div class="cle">
                    <label>起止时间</label>
                      <div class="detailContent">{{subObj.startDate}} -- {{subObj.endDate}}</div>
                </div>
                <div>
                    <label>附件下载</label>
                     <div class="detailContent">
                        <span class="row-text" v-if="detailFileArray.length">
                            <a style="margin:0 20px 10px 0;" v-for="(item,index) in detailFileArray" :key="index" download :href="item.url" target="_blank">{{item.fileName}}</a>
                        </span>  
                        <span v-else style="color:#aeaeae">暂无上传文件</span>
                     </div>
                  
                </div>
                <!-- <div class="cle">
                    <label class="fl">下发单位</label>
                    <div class="copyScore">
                          <el-tag
                    v-for="tag in lowerWord"
                    :key="tag.name"
                   
                    :id=tag.id>
                    {{tag.name}}
                    </el-tag>
                    </div>
                </div>
                <div class="cle">
                    <label class="fl">抄送单位</label>
                    <div class="copyScore choiceWork">
                          <el-tag
                    v-for="tag in dynamicTags"
                    :key="tag.name"
                    :id=tag.id >
                    {{tag.name}}
                    </el-tag>
                    </div>
                </div> -->
              <div class="button clear">
                     <button @click="returnTop">返回</button>
                </div>   
        </div>
    </div>
</template>

<script>
import { postAjax, getAjax, oUrl, uploadImg } from "../../../../api/api.js";
export default {
    data() {
        return {
            time: "2018-03-10----2018-04-30", //起止时间  
            fileList: [], //文件上传
            dynamicTags: [  //抄送单位
                { id: 1, name: '标签一' },
                { id: 2, name: '标签二' },
                { id: 3, name: '标签三' },
                { id: 4, name: '标签四' },
                { id: 5, name: '标签五' }
            ],
            lowerWord: [  //下发单位
                { id: 1, name: '标签一' },
                { id: 2, name: '标签二' },
                { id: 3, name: '标签三' },
                { id: 4, name: '标签四' },
                { id: 5, name: '标签五' }
            ],
            subId: sessionStorage.getItem("subTaskId"), //查询子任务详情的id
            subObj: {},    //子任务详情对象
            detailFileArray:[],   //子任务附件数组
        };
    },
    mounted() {
        this.initSubTask(this.subId); //初始化子任务详情页面
    },
    computed:{
      totalNum:{
        get:function() {
          let subtotal =  Number(this.$route.query.timeScore) + Number(this.$route.query.qualityScore);
          return subtotal;
        }
      }
    },
    methods: {
        initSubTask(subId) {   //初始化子任务详情页面
            // console.log(subId);
            getAjax("ajax/task/taskStage/form?id=" + subId).then(res => {
                this.subObj = res.data;
                /***************文件附件字符串转换数组***start***************/
                // console.log(this.subObj.attachment)
                if (this.subObj.attachment) {
                    let tempFileArray = this.subObj.attachment.split('|');
                    let tempFinalArray = tempFileArray;
                    let fileBefore = localStorage.getItem("attachment");
                    for (let i in tempFinalArray) {
                        let tempUrl = decodeURI(fileBefore + tempFinalArray[i]);
                        let nameArray = tempUrl.split('/');
                        let finalName = nameArray.pop();
                        // console.log(finalName);
                        if(tempFinalArray[i] !==''){
                          this.detailFileArray.push({ fileName: finalName, url: tempUrl });
                        }
                    }
                }
                /***************文件附件字符串转换数组***end***************/
            });
        },
        handleClose(tag) {  //抄送单位
            // console.log(tag);
            this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
        },
        returnTop() { //返回
            window.history.back(-1);
            //    this.$router.push({name:'f_newTask'});
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
  margin-right: 10px;
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



