<template>
    <div style="width:100%">
        <div class="headTagLy">
            <h2 class="tag">任务详情</h2>
        </div>
        <div class="ms-articleLy shadowLy" style="padding:1px 1px 10px 1px;">
            <ul class="panel-ul">
                <div style="position: relative">
                    <span style="position: absolute;top: 0;left: 0px; font-size:14px;">上限分数</span>
                    <div class="topScore" style="width:300px;margin-top:18px; font-size:14px;">
                        <p style="background: rgb(240,240,240);border-bottom:1px solid #cccccc;">
                            <span>时效</span>
                            <span>质量</span>
                            <span>总分</span>
                        </p>
                        <p>
                            <span>{{topCon.timeScore}}</span>
                            <span>{{topCon.qualityScore}}</span>
                            <span>{{topCon.sumScore}}</span>
                        </p>
                    </div>
                </div>
                <li class="el-rowLy" style="margin-top:10px;">
                    <h2 class="mark">
                        紧急程度
                    </h2>
                    <span class="row-text">
                        {{taskData.importantLevelName?taskData.importantLevelName:"暂无紧急程度"}}
                    </span>
                </li>
                <li class="el-rowLy">
                    <h2 class="mark">
                        任务编号
                    </h2>
                    <span class="row-text">
                        {{topCon.stageNum?topCon.stageNum:"暂无任务编号"}}
                    </span>
                </li>
                <li class="el-rowLy">
                    <h2 class="mark">
                        任务名称
                    </h2>
                    <span class="row-text">
                        {{topCon.stageName?topCon.stageName:"暂无任务名称"}}
                    </span>
                </li>
                <li class="el-rowLy">
                    <h2 class="mark">
                        任务描述
                    </h2>
                    <span class="row-text">
                        {{topCon.note?topCon.note:"暂无任务描述"}}
                    </span>
                </li>
                <li class="el-rowLy">
                    <h2 class="mark">
                        起止时间
                    </h2>
                    <span class="row-text">
                        {{topCon.startDate}} -- {{topCon.endDate}}
                    </span>
                </li>
                <li class="el-rowLy">
                    <h2 class="mark" style="float:left">
                        附件下载
                    </h2>
                    <span class="row-text">
                        <span v-if="arrname.length==0">暂无上传文件</span>
                         <a style="padding:0 10px 10px 0" 
                            v-else download
                             v-for="(ite,index) in arrname"
                                :key="index" :href="ite.url" target="_blank">
                                {{ite.name}}
                            </a>
                    </span>
                </li>
            </ul>
            <!-- <div class="button-group">
                <div class="f_btn f_green default" style="margin-left:0px;" @click="taskHandle">
                    任务办理
                </div>
                <div class="f_btn f_purple default" @click="taskAnswer">
                    任务答疑
                </div>
                <div class="clear"></div>
            </div> -->
            <div class="clear"></div>
            <ul class="panel-ul" v-for="(item,index) in scheduleCon" :key="index">
                <li class="el-rowLy">
                    <h2 class="mark">
                        任务反馈
                    </h2>
                    <span class="row-text">
                        {{item.context}}
                    </span>
                </li>
                <li class="el-rowLy">
                    <h2 class="mark" style="float:left">
                        附件下载
                    </h2>
                    <span class="row-text">
                        <span v-if="item.attchment.length==0">暂无上传文件</span>
                         <a  style="padding:0 10px 10px 0" 
                            v-else download
                             v-for="(ite,index) in item.attchment"
                                :key="index" :href="ite.url" target="_blank">
                                {{ite.name}}
                            </a>
                    </span>
                </li>
                <li class="el-rowLy">
                    <h2 class="mark">
                        办结时间
                    </h2>
                    <span class="row-text">
                        {{item.createTime}}
                    </span>
                </li>
            </ul>
            <!-- <div style="height:10px;"></div> -->
            <div class="hr"></div>
            <ul class="panel-ul" style="padding-top:0">
                <li class="el-rowLy">
                    <h2 class="mark">
                        时效评分
                    </h2>
                    <span class="row-text">
                        {{underScore.timeScore?underScore.timeScore:0}}
                    </span>
                </li>
                <li class="el-rowLy">
                    <h2 class="mark">
                        时效评分描述
                    </h2>
                    <span class="row-text">
                        {{underScore.timeNote?underScore.timeNote:"暂无备注"}}
                    </span>
                </li>
                <li class="el-rowLy">
                    <h2 class="mark">
                        质量评分
                    </h2>
                    <span class="row-text">
                        {{underScore.qualityScore?underScore.qualityScore:0}}
                    </span>
                </li>
                <li class="el-rowLy">
                    <h2 class="mark">
                        质量评分描述
                    </h2>
                    <span class="row-text">
                        {{underScore.qualityNote?underScore.qualityNote:"暂无备注"}}
                    </span>
                </li>
                <li class="el-rowLy">
                    <h2 class="mark">
                        调节评分
                    </h2>
                    <span class="row-text">
                        {{underScore.score?underScore.score:0}}
                    </span>
                </li>
                <li class="el-rowLy">
                    <h2 class="mark">
                        调节评分描述
                    </h2>
                    <span class="row-text">
                        {{underScore.adjustNote?underScore.adjustNote:"暂无备注"}}
                    </span>
                </li>
            </ul>
            <!-- <div style="height:10px;"></div> -->
            <div class="button-group" style="border-bottom:none;">
                <div class="f_btn back-btn" @click="backRoute" Style="margin-left:0;color:#000">
                    返回
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import qs from "qs";
import { postAjax, getAjax, uploadImg, oUrl } from "../../../api/api.js";
export default {
  created() {
    // console.log(this.child);
    // console.log(this.parent);
    this.autoMove(this.child);
  },
  data() {
    return {
      child: this.$route.query.childId,
      parent: this.$route.query.parentId,
      topCon: "", //上半部分得内容
      scheduleCon: [], //反馈的信息
      fileUpload: [], //保存反馈的信息,下载使用
      score: "", //最先面评分得信息
      tableData: [
        {
          subNum: "1",
          subName: "XO23333",
          subDetail: "关于国资委任务标题1518号文件",
          startTime: "2018-09-11"
        }
      ],
      attachment: localStorage.getItem("attachment"), //上传文件得下载（预览）路径
      arrname: [], //附件下载用
      arr: [], //附件下载用
      taskData: {}, //整个对象
      underScore: {}
    };
  },
  methods: {
    autoMove(cid) {
      let _self = this;
      postAjax("ajax/task/taskDetail/detail?id=" + cid).then(res => {
        // console.log(res);
        _self.taskData = res.data.data.dayTask;
        _self.topCon = res.data.data.stageList[0];
        _self.fileUpload = res.data.data.scheduleList; //反馈的信息
        _self.score = res.data.data.stageList[0]; //评分 备注
        _self.underScore = res.data.data.taskDetail;
        //上半部分上传文件拆分

        if (_self.taskData.attachment) {
          _self.arr = _self.taskData.attachment.split("|");
          // this.arr.splice(0, 1);//获取文件路径地址

          _self.arr.forEach(element => {
            //获取文件名称

            var index = element.lastIndexOf("/");
            let name = element.substring(index + 1, element.length);
            name = decodeURI(name);
            if (name !== "") {
              this.arrname.push({
                name: name,
                url: this.attachment + element
              });
            }
          });
        }

        //任务反馈的附件下载
        var fileList = [];
        var fileName = [];
        _self.fileUpload.forEach((ite, ind) => {
          fileList = [];
          fileName = [];
          // console.log(ite.attchment);
          if (ite.attchment) {
            fileList = ite.attchment.split("|");
            // fileList.splice(0, 1);//获取文件路径地址
            fileList.forEach(ele => {
              //获取文件名称
              var index = ele.lastIndexOf("/");
              let name = ele.substring(index + 1, ele.length);
              name = decodeURI(name);
              fileName.push({
                name: name,
                url: this.attachment + ele
              });
            });
          } else {
            fileList = [];
            fileName = [];
          }
          _self.scheduleCon.push({
            id: ite.id,
            arr: fileList,
            attchment: fileName,
            createTime: ite.createTime,
            context: ite.context
          });
        });
      });
    },
    // lowerUpfile(num) { //附件下载
    // // console.log(num);
    //     window.open(this.attachment + this.arr[num], "_blank");
    // },
    // returnUpfile(uid, num) { //任务反馈 附件下载
    // // console.log(this.attachment)
    //     // console.log(uid, num)
    //     let bigList = this.scheduleCon;
    //     for (var i = 0; i < bigList.length; i++) {
    //         if (bigList[i].id == uid) {
    //             // console.log(this.attachment + bigList[i].arr[num])
    //             window.open(this.attachment + bigList[i].arr[num], "_blank");
    //         }
    //     }
    // },
    taskHandle() {
      //任务办理
      this.$router.push({
        path: "/taskHandle",
        query: {
          childId: this.child,
          parentId: this.parent
        }
      });
    },
    taskAnswer(id) {
      //任务答疑
      this.$router.push({
        path: "/taskAnswer",
        query: {
          what: id
        }
      });
    },
    backRoute() {
      //任务详情  返回按钮
      window.history.back(-1);
      // this.$router.push({path:'/taskDetail'});
    }
  }
};
</script>

<style scoped>
.panel-ul {
  padding: 20px 20px 0 20px;
  width: 98%;
  margin: 0 auto;
  box-sizing: border-box;
  /*  */
}

.el-rowLy {
  list-style-type: none;
  width: 100%;
  min-height: 40px;
}

.el-rowLy .mark {
  display: inline-block;
  width: 86px;
  font-size: 14px;
  font-weight: normal;
  color: #353639;
}

.el-rowLy .row-text {
  display: inline-block;
  width: calc(100% - 106px);
  font-size: 14px;
  color: #898a8f;
}

.el-rowLy .row-text a {
  color: #4a90e2;
  cursor: pointer;
}

.el-rowLy .row-text a:hover {
  color: #dd0000;
  cursor: pointer;
}

.button-group {
  /* margin-left: 30px; */
  width: 98%;
  margin: 0 auto;
  padding-left: 20px;
  box-sizing: border-box;
  padding-bottom: 20px;
  border-bottom: #ececec 1px solid;
}

/* 按钮默认样式 */
.default {
  float: left;
  margin-left: 20px;
}

.table-content {
  margin-top: 20px;
  float: left;
  width: 92%;
}

.hr {
  margin: 20px auto;
  width: 98%;
  border-bottom: #ececec 1px solid;
}

.back-btn {
  margin: 4% 0% 0% 5%;
  width: 5%;
  text-align: center;
}

.f_box > img {
  cursor: pointer;
}
div.topScore {
  margin-left: 79px;
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
</style>
