<template>
    <div style="width:100%;height:100%;box-sizing:border-box;">
        <div class="taskState">
            <div class="taskNum" v-if="wordId!=gzwid">
                <div class="taskScore" style="margin-right: 15px">
                    <p>当前任务数量</p>
                    <ul>
                        <li>
                            <img src="../../../../static/img/dayTask.png" alt="">
                            <div class="taskNumber">
                                <p><span>{{echartForm.taskNum?echartForm.taskNum:0}}</span>个</p>
                                <p>日常任务数量</p>
                            </div>
                        </li>
                        <li>
                            <img src="../../../../static/img/meeting.png" alt="">
                            <div class="taskNumber">
                                <p><span>{{echartForm.meetingNum?echartForm.meetingNum:0}}</span>个</p>
                                <p>会议任务数量</p>
                            </div>
                        </li>
                    </ul>
                </div>
                <div class="taskScore">
                    <p class="nowScore">当前得分情况</p>
                    <ul>
                        <li style=" border-right: 1px dashed #cccccc;">
                            <img src="../../../../static/img/nowScore.png" alt="">
                            <div class="taskNumber orrange">
                                <p><span>{{echartForm.sumScore?Number(echartForm.sumScore).toFixed(2):0}}</span></p>
                                <p>当前得分</p>
                            </div>
                        </li>
                        <li style="border:none;position: relative;">
                            <!-- <img src="../../../../static/img/doc.png" alt=""> -->
                            <div id="scoringSta" style="width:80px;height:80px;position: absolute; top:-6px;left:20px"></div>
                            <div class="taskNumber orrange" style="margin-left:80px;">
                                <p><span>{{infactPCT?Number(infactPCT).toFixed(2):0}}</span>%</p>
                                <p>得分率</p>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="calendar">
                <!--日历-->
                <Calendar></Calendar>
            </div>
            <!--新任务-->
            <div class="newTask cle" style="margin-bottom:50px">
                <p>新任务</p>
                <ul>
                    <li>
                        <div class="taskText">
                          <div v-for="(item,index) in taskList" :key="index">【{{item.taskNum}}】{{item.title}}</div>
                          <div class="taskSummary">任务：{{taskList.length}}个待接收</div>
                        </div>
                        
                    </li>
                    <li>
                        <div class="taskText">
                          <div v-for="(item,index) in mettinglist" :key="index">【{{item.taskNum}}】{{item.title}}</div>
                          <div class="taskSummary">会议：{{mettinglist.length}}个待接收</div>
                        </div>
                      
                    </li>
                    <li>
                        <div class="taskText">
                          <div v-for="(item,index) in auditList" :key="index">【{{item.taskNum}}】{{item.title}}</div>
                          <div class="taskSummary">审核：{{auditList.length}}个待审核</div>
                       </div>
                    </li>
                </ul>
               
            </div>
        </div>
        <!--通知公告-->
        <div class="contentBulletin">
            <p>通知公告</p>
            <ul>
                <li style="cursor:pointer;" v-for="(item,index) in publishList" :key="index" @click="toNoticeAdmin(item)">
                    <div class="bulletin">
                       {{item.messageTitle}}
                    </div>
                    <p>发布者：{{item.publishPersonName}}</p>
                    <p>{{item.publishDate}}</p>
                </li>
            </ul>
        </div>
    </div>

</template>

<script>
import qs from "qs";
import { postAjax, getAjax, uploadImg } from "../../../api/api.js";
import Calendar from "../common/caledar.vue";
export default {
  mounted() {
  
    if (this.wordId != this.gzwid) {
      //如果不是国资委  
      this.initLoadData(); //初次加载数据
      this.initPublicInfo(); //初始化公告数据
    } else {
      //如果是国资委
      this.NointPublicInfo();
    }
    this.initTaskList(); //初始化任务列表
  },
  data() {
    return {
      echartForm: {}, //整个首页对象
      plusPCT: 0, //100-实际的百分比减剩下的百分比
      infactPCT: 0, //后台传过来的实际百分比
      publishList: [], //发布列表
      taskList: [], //任务列表
      mettinglist: [], //会议列表
      auditList: [], //审核列表
      gzwid:"14192eae-57dd-11e7-9694-0050569a68e4",//国资委id
      wordId: sessionStorage.getItem("userWordId") //用户的单位id
    };
  },
  methods: {
    toNoticeAdmin(item) {
      //跳转通知公告页面
      this.$router.push({
        path: "/supervisorNoticeDetail",
        query: {
          id: item.id
        }
      });
    },
    initLoadData() {
      //加载数据的入口
      postAjax("ajax/index/tasknum").then(res => {
        if (res.data.state == 1) {
          this.echartForm = res.data.data;
          // console.table(this.echartForm);
          this.infactPCT = Number(this.echartForm.persentScore) * 100; //后台传过来的实际百分比
          // console.log(this.infactPCT);
          // console.log(this.infactPCT)
          this.plusPCT = 100 - this.infactPCT; //100-实际的百分比减剩下的百分比
          // console.log(this.plusPCT)
          this.autoMove(this.infactPCT, this.plusPCT); //加载echarts饼状图
        }
      });
    },
    initPublicInfo() {
      //初始化公告
      postAjax("ajax/index/indexmessge").then(res => {
        if (res.data.state == 1) {
          this.publishList = res.data.data;
        }
      });
    },
    NointPublicInfo() {
      //如果是国资委通知公告显示这个
      let form = {
        pageNo: 0, //分页
        pageSize: 15, //每页数据行数
        messageTitle: "" //通知标题
      }; //默认查询参数的对象
      let data = qs.stringify(form);
      postAjax("ajax/message/managerMessageNotice/list", data).then(res => {
        if (res.data.state == 1) {
          this.publishList = res.data.data.list;
        }
      });
    },
    initTaskList() {
      //初始化任务列表
      postAjax("ajax/index/rwlist").then(res => {
        if (res.data.state == 1) {
          let arrayObj = res.data.data;
          this.taskList = arrayObj.jsrwlist;
          this.mettinglist = arrayObj.jshylist;
          this.auditList = arrayObj.shrwlist;
        }
      });
    },
    autoMove(infactNum, plusNum) {
      let myChart = this.$echarts.init(document.getElementById("scoringSta"));
      var option = {
        tooltip: {
          trigger: "item",
          formatter: "{a}{b} : {d}%"
        },
        series: [
          {
            name: "得分率",
            type: "pie",
            hoverAnimation: false,
            radius: ["45%", "65%"],
            center: ["50%", "33%"],
            label: {
              normal: {
                position: "center"
              }
            },
            data: [
              {
                value: infactNum
                // name: "占有率",
                // label: {
                // normal: {
                // formatter: "{d} %",
                // textStyle: {
                // fontSize: 12,
                // align: 'right',
                // verticalAlign:'middle'
                // }
                // }
                // }
              },
              {
                value: plusNum,
                // name: '占位',
                label: {
                  normal: {
                    // formatter: '\n完成率',
                    textStyle: {
                      color: "#555",
                      fontSize: 10
                    }
                  }
                },
                tooltip: {
                  show: false
                },
                itemStyle: {
                  normal: {
                    color: "#aaa"
                  },
                  emphasis: {
                    color: "#aaa"
                  }
                },
                hoverAnimation: false
              }
            ]
          }
        ]
      };
      myChart.setOption(option);
    }
  },
  components: {
    Calendar
  }
};
</script>
<style scoped>
.taskState {
  width: 70%;
  height: 100%;
  float: left;
  font-size: 14px;
}
.taskScore {
  width: 48%;
  height: 100px;
  float: left;
  margin-bottom: 20px;
  border: 1px solid #cccccc;
  border-radius: 5px;
}
.taskScore > p {
  padding: 10px 0 10px 20px;
  position: relative;
}
.taskScore > p::before {
  content: "";
  position: absolute;
  width: 2px;
  height: 16px;
  top: 12px;
  left: 10px;
  background-color: #e91b1b;
}
.taskScore > p.nowScore::before {
  background-color: #e9a01b;
}

.taskScore ul li {
  width: 50%;
  float: left;
  padding-left: 20px;
  box-sizing: border-box;
}
.taskScore ul li + li {
  border-left: 1px dashed #cccccc;
}
.taskState ul li img {
  width: 31px;
  height: 40px;
  display: block;
  float: left;
  margin-right: 10px;
}
.taskNumber {
  font-size: 12px;
}
.taskNumber p:first-child {
  color: #e64242;
}
.taskNumber p:first-child span {
  font-size: 20px;
  padding-right: 5px;
}
.orrange p:first-child {
  color: #f9bf2c;
}

.calendar {
  clear: both;
  position: relative;
}
.newTask {
  width: 98%;
  margin-top: 20px;
  border: 1px solid #cccccc;
  border-radius: 5px;
}
/*新任务  通知公告 */
.newTask p,
.contentBulletin > p {
  height: 40px;
  line-height: 40px;
  background-color: rgb(240, 240, 240);
  font-size: 14px;
  padding-left: 25px;
  border-bottom: 1px solid #cccccc;
  position: relative;
}
.newTask > ul {
  box-sizing: border-box;
  width: 100%;
  max-height: 300px;
  overflow: auto;
}
.newTask p::before,
.contentBulletin > p::before {
  content: "";
  position: absolute;
  width: 2px;
  height: 17px;
  background-color: #e91b1b;
  top: 11px;
  left: 15px;
}
.newTask ul li {
  padding: 10px;
  min-height: 30px;
  position: relative;
  border-top: none;
}
.newTask ul li + li,
.contentBulletin ul li + li {
  border-top: 1px dashed #cccccc;
}
.taskText {
  width: 100%;
  line-height: 20px;
  color: #000;
}
.taskText div {
  padding: 5px 0;
}
.taskText div.taskSummary {
  text-align: right;
}
/*内容中间右边    通知公告*/
.contentBulletin {
  width: 30%;
  height: 100%;
  box-sizing: border-box;
  border: 1px solid #cccccc;
  font-size: 14px;
  padding-left: 1px;
  border-radius: 5px;
  float: right;
}
.contentBulletin ul {
  box-sizing: border-box;
  width: 100%;
  height: calc(100% - 44px);
  overflow-y: auto;
}
.contentBulletin ul li {
  padding: 10px;
}
.contentBulletin ul li div {
  width: 90%;
  line-height: 20px;
  padding-left: 25px;
  color: #000;
  position: relative;
}
.contentBulletin ul li p {
  text-align: right;
}
.contentBulletin ul li div.bulletin::before {
  content: "";
  width: 10px;
  height: 10px;
  border-radius: 50px;
  background: #e10000;
  position: absolute;
  top: 5px;
  left: 5px;
}
</style>