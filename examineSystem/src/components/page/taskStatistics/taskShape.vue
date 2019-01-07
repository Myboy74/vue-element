<template>
    <div>
        <div class="headTagLy">
            <h2 class="tag">任务信息统计</h2>
            <div class="orglist-btn active">图形</div>
            <div class="orglist-btn" @click="toList">列表</div>
            <div class="clear"></div>
        </div>
        <div style="width:100%;height:100%;float:left">
   <!-- 进度条区域（左） -->
        <div class="ms-articleLy left-progress shadowLy">
            <div class="progress-content">
                <div id="leftOrgProgress" class="progress fl"></div>
                <div class="fl f_sum"> 
                  <span>总数:{{sumScore}}</span>
                  <span class="sumScore">总数:{{sumScore}}</span>
                   <!-- 普通任务 -->
                <p>{{leftTask}}</p>
                  <!-- 会议调度 -->
                <p class="meetingTitle">{{leftMeeting}}</p>
                  </div>
            </div>
          <div class="clear"></div>
        </div>
        <!-- 进度条区域（右） -->
        <div class="ms-articleLy right-progress shadowLy">
            <div class="progress-content">
             
                <div id="rightOrgProgress" class="progress fl"></div>
                <div class="fl f_sum">
                  <span  class="f_scoreTop">总数:{{rightScore}}</span>
                  <span class="f_scoreTop sumScore">总数:{{rightScore}}</span>
                  <!-- 普通任务 -->
                <p class="title">{{rightTask}}</p>
                  <!-- 会议调度 -->
                <p class="title meet">{{rightMeeting}}</p>
                </div>
            </div>
          <div class="clear"></div>
        </div>
        <!-- 柱状图区域 -->
        <div class="ms-articleLy pillar-area shadowLy" style="position:relative;">
          <!-- 在顶部显示每个柱状图分值 -->
          <!-- <div class="caogaoText">{{zhuxingAllPCT.draftNumStatistic}}</div>
          <div class="jinxingText">{{zhuxingAllPCT.goingNumStatistic}}</div>
          <div class="overText">{{zhuxingAllPCT.finalNumStatistic}}</div>
          <div class="closeText">{{zhuxingAllPCT.closeNumStatistic}}</div> -->
          <!-- <div class="titleLy">直接管理党组织统计</div>
          <div class="clear"></div> -->
          <div class="pillar-content">
            <div id="orgPillar" class="pillar"></div>
          </div>
          <div class="clear"></div>
        </div>
        <!-- 饼状图区域 -->
        <div class="ms-articleLy pieChart-area shadowLy">
          <!-- <div class="titleLy">属地管理党组织统计</div> -->
          <div class="pieChart-content">
            <div id="orgPieChart" class="pieChart"></div>
          </div>
          <div class="clear"></div>
        </div>
        <div class="clear"></div>
    </div>
        </div>
             
</template>
<script>
import echarts from "echarts";
import { postAjax, getAjax } from "../../../api/api.js";
export default {
  data() {
    return {
      leftTask: "",//发布--普通任务
      leftMeeting: "",//发布--会议调度
      sumScore: "",//总数 -发布
      rightTask: "",//接收--普通任务
      rightMeeting: "",//接收--会议调度
      rightScore: "",//接收-总数
      zhuxingAllPCT: {}, //柱状图百分比
    };
  },
  mounted() {
    this.autoMove();
  },
  methods: {
    toList() {
      this.$router.push({ path: "/taskStatistics" });
    },
    autoMove() {
      let id = sessionStorage.getItem("userWordId")
      getAjax("statisticAnalysis/statistic/statisticTaskGraph?id=" + id)
        .then(res => {
          let date = res.data.data;
          // console.log(date);
          date.forEach(element => {
            if (element.type == 1) {
              this.zhuxingAllPCT = element;
              //  console.log("发布统计，")
              this.initLeftProgress(element); //显示左边进度条；
              this.initOrgPillar(element); //显示柱状图区域；

            } else if (element.type == 2) {
              // console.log("接收统计")
              this.initrightProgress(element); //显示右边进度条
              this.initOrgPie(element); //显示饼状图；
            }
          });
        })
        .catch(err => {
          console.log(err);
        });
    },

    initLeftProgress(date) {
      // console.log(date);
      //左边进度条
      let leftProgress = this.$echarts.init(
        document.getElementById("leftOrgProgress")
      );
      var score = []; //总数 

      var ydata = []; //各个数量
      for (var i = 0; i < 2; i++) {
        score[i] = date.commonTaskNum + date.meetingNum;
      }
      this.sumScore = date.commonTaskNum + date.meetingNum;
      var xData = ["会议调度", "普通任务"];
      this.leftTask = date.commonTaskNumStatistic;
      this.leftMeeting = date.meetingNumStatistic
      ydata.push(date.meetingNum);
      ydata.push(date.commonTaskNum)

      var option = {
        backgroundColor: "#fff",
        title: {
          text: "发布任务类型统计",
          textStyle: {
            color: "#353639",
            fontSize: "14",
            fontWeight: "bold"
          },

        },
        // tooltip: {
        //   show: "true",
        //   trigger: "item",
        //   backgroundColor: "rgba(0,0,0,0.7)", // 背景
        //   padding: [10, 10], //内边距
        //   formatter:function(params){
        //     // console.log(params);
        //     return "发布任务类型统计<br/>"+params.name+"数量:"+params.data+"<br/>占比:"+data[params.dataIndex];
        //   }
        // },
        grid: {
          borderWidth: 0,
          top: 30,
          left: 85,
          right: 10,
          bottom: 30,
          textStyle: {
            color: "#fff"
          }
        },
        yAxis: [
          {
            type: "category",
            axisTick: {
              show: false
            },
            axisLine: {
              show: false
            },
            splitLine: {
              show: false
            },
            axisTick: {
              show: false
            },
            axisLabel: {
              inside: false,
              textStyle: {
                color: "#353639",
                fontWeight: "normal",
                fontSize: "12"
              }
            },
            data: xData
          },
          {
            show: false,
            type: "category",
            data: xData
          }
        ],
        xAxis: {
          show: false,
          type: "value",
          axisTick: {
            show: false
          },
          axisLine: {
            show: true,
            lineStyle: {
              color: "#2f3640"
            }
          },
          splitLine: {
            show: false,
            lineStyle: {
              color: "#2f3640 "
            }
          }
        },
        series: [
          {
            label: {
              show: true,
              position: "top",
              // formatter: "{c}"
            },
            name: "",
            type: "bar",
            itemStyle: {
              normal: {
                show: true,
                color: function (params) {
                  //我这边就两个柱子，大体就两个柱子颜色渐变，所以数组只有两个值，多个颜色就多个值
                  var colorList = [
                    ["#3CC56D", "#86e9fc"],
                    ["#F95A79", "#F9BF2C"]
                  ];
                  var index = params.dataIndex;
                  if (params.dataIndex >= colorList.length) {
                    index = params.dataIndex - colorList.length;
                  }
                  return new echarts.graphic.LinearGradient(1, 0, 0, 0, [
                    { offset: 0, color: colorList[index][0] },
                    { offset: 1, color: colorList[index][1] }
                  ]);
                },
                barBorderRadius: 50,
                borderWidth: 0
              },
              emphasis: {
                shadowBlur: 15,
                shadowColor: "rgba(105,123, 214, 0.7)"
              }
            },
            zlevel: 2,
            barWidth: "20%",
            data: ydata
          },
          {
            // label: {
            //   show: true,
            //   position: "right",
            //   // formatter:"总数:{c}"
            // },
            name: "",
            type: "bar",
            yAxisIndex: 1,
            legendHoverLink: false,
            zlevel: 1,
            itemStyle: {
              normal: {
                barBorderRadius: 50,
                color: "#d4d4d4",
                borderWidth: 0,
                shadowBlur: {
                  shadowColor: "rgba(255,255,255,0.31)",
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowOffsetY: 2
                }
              }
            },
            barWidth: "20%",
            data: score
          }
        ]
      };
      leftProgress.setOption(option);
    },
    initrightProgress(data) {
      //右边进度条
      var score = []; //总数 
      var ydata = []; //各个数量
      for (var i = 0; i < 2; i++) {
        score[i] = data.commonTaskNum + data.meetingNum;
      }
      this.rightScore = data.commonTaskNum + data.meetingNum;
      var xData = ["会议调度", "普通任务"];

      this.rightTask = data.commonTaskNumStatistic;  //占比 任务
      this.rightMeeting = data.meetingNumStatistic;//占比 会议

      ydata.push(data.meetingNum);
      ydata.push(data.commonTaskNum);

      let rightProgress = this.$echarts.init(
        document.getElementById("rightOrgProgress")
      );
      // var xData = ["会议调度", "普通任务"];
      // var data = [13.7, 18];
      var option = {
        backgroundColor: "#fff",
        title: {
          text: "接收任务类型统计",
          textStyle: {
            color: "#353639",
            fontSize: "14",
            fontWeight: "bold"
          },
          subtextStyle: {
            color: "#90979c",
            fontSize: "14"
          }
        },
        //  tooltip: {
        //   show: "true",
        //   trigger: "item",
        //   backgroundColor: "rgba(0,0,0,0.7)", // 背景
        //   padding: [10, 10], //内边距
        //   formatter:function(params){
        //     console.log(params);
        //     return "接收任务类型统计<br/>"+params.name+"数量:"+params.data+"<br/>占比:"+date[params.dataIndex]+"%";
        //   }
        // },
        grid: {
          borderWidth: 0,
          top: 30,
          left: 85,
          right: 10,
          bottom: 30,
          textStyle: {
            color: "#fff"
          }
        },
        yAxis: [
          {
            type: "category",
            axisTick: {
              show: false
            },
            axisLine: {
              show: false
            },
            splitLine: {
              show: false
            },
            axisTick: {
              show: false
            },
            axisLabel: {
              inside: false,
              textStyle: {
                color: "#353639",
                fontWeight: "normal",
                fontSize: "12"
              }
            },
            data: xData
          },
          {
            show: false,
            type: "category",
            data: xData
          }
        ],
        xAxis: {
          show: false,
          type: "value",
          axisTick: {
            show: false
          },
          axisLine: {
            show: true,
            lineStyle: {
              color: "#2f3640"
            }
          },
          splitLine: {
            show: false,
            lineStyle: {
              color: "#2f3640 "
            }
          }
        },
        series: [
          {
            label: {
              show: true,
              position: "top",
              // formatter: "{c}"
            },
            name: "",
            type: "bar",
            itemStyle: {
              normal: {
                show: true,
                color: function (params) {
                  //我这边就两个柱子，大体就两个柱子颜色渐变，所以数组只有两个值，多个颜色就多个值
                  var colorList = [
                    ["#4A90e2", "#797CE6"],
                    ["#ffd533", "#F9BF2C"]
                  ];
                  var index = params.dataIndex;
                  if (params.dataIndex >= colorList.length) {
                    index = params.dataIndex - colorList.length;
                  }
                  return new echarts.graphic.LinearGradient(1, 0, 0, 0, [
                    { offset: 0.5, color: colorList[index][0] },
                    { offset: 1, color: colorList[index][1] }
                  ]);
                },
                barBorderRadius: 50,
                borderWidth: 0
              },
              emphasis: {
                shadowBlur: 15,
                shadowColor: "rgba(105,123, 214, 0.7)"
              }
            },
            zlevel: 2,
            barWidth: "20%",
            data: ydata
          },
          {
            // label: {
            //   show: true,
            //   position: "right",
            //   // formatter: "总数:{c}"
            // },
            name: "",
            type: "bar",
            yAxisIndex: 1,
            zlevel: 1,
            itemStyle: {
              normal: {
                barBorderRadius: 50,
                color: "#d4d4d4",
                borderWidth: 0,
                shadowBlur: {
                  shadowColor: "rgba(255,255,255,0.31)",
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowOffsetY: 2
                }
              }
            },
            barWidth: "20%",
            data: score
          }
        ]
      };
      rightProgress.setOption(option);
    },
    initOrgPillar(val) {
      console.log(val);
      //柱状图
      // console.log(val);
      let pillar = this.$echarts.init(document.getElementById("orgPillar"));
      var xData = [
        "草稿数量",
        "进行中数量",
        "完成数量",
        "撤销数量"
      ];
      var data = [];  //数量
      var dataSum = []; //总数
      var dataScore = [];  //占比
      var infactCount = [];   //显示的实际个数
      // let drafPCT = val.draftNumStatistic.substring(val.draftNumStatistic.length - 1, 0);
      // data.push(Number(drafPCT));
      // let goingPCT = val.goingNumStatistic.substring(val.goingNumStatistic.length - 1, 0);
      // data.push(Number(goingPCT));
      // let finalPCT = val.finalNumStatistic.substring(val.finalNumStatistic.length - 1, 0);
      // data.push(Number(finalPCT));
      // let closePCT = val.closeNumStatistic.substring(val.closeNumStatistic.length - 1, 0);
      // data.push(Number(closePCT));

      data.push(val.draftNum);
      data.push(val.goingNum);
      data.push(val.finalNum);
      data.push(val.closeNum);

      infactCount.push(val.draftNum);
      infactCount.push(val.goingNum);
      infactCount.push(val.finalNum);
      infactCount.push(val.closeNum);


      dataScore.push(val.draftNumStatistic)
      dataScore.push(val.goingNumStatistic)
      dataScore.push(val.finalNumStatistic)
      dataScore.push(val.closeNumStatistic)
      for (var i = 0; i < 4; i++) {
        dataSum[i] = val.issueTaskSum;
      }
      // var data = [16700, 24700, 31700, 30000];
      var option = {
        backgroundColor: "#fff",
        title: {
          text: "发布任务状态统计",
          textStyle: {
            color: "#353639",
            fontSize: "14",
            fontWeight: "bold"
          },
          subtextStyle: {
            color: "#90979c",
            fontSize: "14"
          }
        },
        tooltip: {
          show: "true",
          trigger: "item",
          backgroundColor: "rgba(0,0,0,0.7)", // 背景
          padding: [8, 10], //内边距
          extraCssText: "box-shadow: 0 0 3px rgba(255, 255, 255, 0.4);", //添加阴影
          formatter: function (params) {
            if (params.seriesName != "") {
              return "发布任务状态统计<br/>" + params.name + ":" + params.value + "<br/>占比:" + dataScore[params.dataIndex];
            }
          }
        },
        grid: {
          borderWidth: 0,
          top: 80,
          left: 50,
          right: 50,
          bottom: 40,
          textStyle: {
            color: "#fff"
          }
        },
        xAxis: [
          {
            type: "category",
            axisTick: {
              show: false
            },
            axisLine: {
              show: false,
              lineStyle: {
                color: "#363e83"
              }
            },
            axisLabel: {
              inside: false,
              textStyle: {
                color: "#353639",
                fontWeight: "normal",
                fontSize: "12"
              }
              // formatter:function(val){
              //     return val.split("").join("\n")
              // },
            },
            data: xData
          },
          {
            type: "category",
            axisLine: {
              show: false
            },
            axisTick: {
              show: false
            },
            axisLabel: {
              show: false
            },
            splitArea: {
              show: false
            },
            splitLine: {
              show: false
            },
            data: xData
          }
        ],
        yAxis: {
          show: false,
          type: "value",
          axisTick: {
            show: false
          },
          axisLine: {
            show: false,
            lineStyle: {
              color: "#32346c"
            }
          },
          splitLine: {
            show: false,
            lineStyle: {
              color: "#32346c"
            }
          }
        },
        series: [
          {
            label: {
              show: true,
              position: "top",
              color: function (params) {
                //我这边就两个柱子，大体就两个柱子颜色渐变，所以数组只有两个值，多个颜色就多个值
                var colorList = [
                  ["#f0db47", "#ececec"],
                  ["#F95A79", "#ececec"],
                  ["#3CC56D", "#ececec"],
                  ["#797CE6", "#ececec"]
                ];
                var index = params.dataIndex;
                if (params.dataIndex >= colorList.length) {
                  index = params.dataIndex - colorList.length;
                }
                return new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0.5, color: colorList[index][0] },
                  { offset: 1, color: colorList[index][1] }
                ]);
              },
              formatter: "{c}"
            },
            name: "发布任务状态统计(%)",
            type: "bar",
            itemStyle: {
              normal: {
                show: true,
                color: function (params) {
                  /**************************鼠标经过文字********************************/
                  var colorList = [
                    ["#F9BF2C", "#ececec"],
                    ["#39D1E8", "#ececec"],
                    ["#3CC56D", "#ececec"],
                    ["#797CE6", "#ececec"]
                  ];
                  var index = params.dataIndex;
                  if (params.dataIndex >= colorList.length) {
                    index = params.dataIndex - colorList.length;
                  }
                  return new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    { offset: 0, color: colorList[index][0] },
                    { offset: 0.8, color: colorList[index][1] }
                  ]);
                },
                barBorderRadius: [50, 50, 0, 0],
                borderWidth: 0
              },
              emphasis: {
                shadowBlur: 15,
                shadowColor: "rgba(105,123, 214, 0.7)"
              }
            },
            zlevel: 2,
            barWidth: "30%",
            data: data    /****************鼠标经过实际个数******************/
          },
          {
            label: {
              show: false,
              position: "top",
              color: "#000"
            },
            name: "",
            type: "bar",
            xAxisIndex: 1,
            zlevel: 1,
            itemStyle: {
              normal: {
                color: "#d4d4d4",
                borderWidth: 0,
                shadowBlur: {
                  shadowColor: "rgba(255,255,255,0.31)",
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowOffsetY: 2
                },
                barBorderRadius: [50, 50, 0, 0]
              }
            },
            barWidth: "30%",
            data: dataSum
          }
        ]
      };
      pillar.setOption(option);
    },
    initOrgPie(val) {
      //饼状图
      // console.log(val);
      var dateNum = [
        { value: val.draftNum, name: "待办理" },
        { value: val.goingNum, name: "已办理" },
        { value: val.finalNum, name: "已完成" },
        { value: val.closeNum, name: "已撤销" }
      ];
      var dateScore = [
        { value: val.draftNum, name: "" },
        { value: val.goingNum, name: "" },
        { value: val.finalNum, name: "" },
        { value: val.closeNum, name: "" }
      ];
      let pieChart = this.$echarts.init(document.getElementById("orgPieChart"));
      var option = {
        title: {
          text: "接收任务状态统计",
          textStyle: {
            color: "#353639",
            fontSize: "14",
            fontWeight: "bold"
          },
          subtextStyle: {
            color: "#90979c",
            fontSize: "14"
          }
        },
        backgroundColor: "#fff",
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b}: {c} ({d}%)"
        },
        legend: {
          orient: "vertical",
          x: "right",
          itemWidth: 14,
          itemHeight: 14,
          align: "left",
          data: ["待办理", "已办理", "已完成", "已撤销"],
          textStyle: {
            color: "#000"
          }
        },
        series: [
          {
            name: "接收任务状态统计",
            type: "pie",
            hoverAnimation: false,
            legendHoverLink: false,
            radius: ["58%", "45%"],
            color: ["#ececec", "#ececec", "#ececec", "#ececec"],
            label: {
              normal: {
                position: "inner"
              }
            },
            labelLine: {
              normal: {
                show: false
              }
            },
            tooltip: {
              show: false
            },
            data: dateScore
          },
          {
            name: "接收任务状态统计",
            type: "pie",
            radius: ["42%", "55%"],
            color: ["#F9BF2C", "#4A90e2", "#3CC56D", "#797CE6"],
            label: {
              normal: {
                formatter: "{b}\n{d}%"
              }
            },
            data: dateNum
          }
        ]
      };
      pieChart.setOption(option);
    }
  }
};
</script>

<style scoped>
.orglist-btn {
  width: 28px;
  height: 26px;
  line-height: 26px;
  font-size: 14px;
  border-radius: 5px;
  background-color: #cccccc;
  color: #353639;
  float: right;
  padding: 0px 10px 0px 10px;
  margin: 8px 10px 0px 0px;
  cursor: pointer;
}
.orglist-btn:hover {
  background-color: #e91b1b;
  color: #fff;
  cursor: pointer;
}
.orglist-btn.active {
  background-color: #e91b1b;
  color: #fff;
}
.left-progress {
  float: left;
  width: 49.5%;
  margin: 1% 0.5% 0% 0%;
  padding-bottom: 10px;
}
.right-progress {
  float: left;
  width: 49.5%;
  margin: 1% 0% 0% 0.5%;
  padding-bottom: 10px;
}
.progress-content {
  float: left;
  margin: 4px 0px 0px 20px;
  width: 100%;
  box-sizing: border-box;
  padding-bottom: 5px;
  position: relative;
}
.progress-content p {
  font-size: 14px;
  font-weight: bold;
  position: absolute;
  top: 85px;
  left: 0;
  z-index: 999;
  color: #ff151a;
}
.progress-content p.meetingTitle {
  color: #20c47d;
  top: 155px;
}
.progress-content p.title {
  color: #f9bf2c;
}
.progress-content p.meet {
  color: #54b0fe;
  top: 155px;
}
.progress {
  margin-top: 10px;
  width: 85%;
  height: 200px;
}
.f_sum {
  width: 15%;
  height: 200px;
  position: relative;
}
.f_sum span {
  font-size: 12px;
  color: #aeaeae;
  position: absolute;
  top: 67px;
  left: 0;
  z-index: 999;
}
.f_sum span.sumScore {
  top: 136px;
}
.f_sum span.f_scoreTop {
  display: block;
  width: 80px;
}

.pillar-area {
  float: left;
  width: 49.5%;
  margin: 1% 0.5% 0% 0%;
  padding-bottom: 10px;
}
.pillar-content {
  margin: 2.5% 0% 0% 2%;
  width: 96%;
  padding-bottom: 5px;
}
.pillar {
  margin-top: 10px;
  width: 100%;
  height: 350px;
}
.pieChart-area {
  float: left;
  width: 49.5%;
  margin: 1% 0% 0% 0.5%;
  padding-bottom: 10px;
}
.pieChart-content {
  margin: 2.5% 0% 0% 2%;
  width: 96%;
  padding-bottom: 5px;
}
.pieChart {
  margin-top: 10px;
  width: 100%;
  height: 350px;
}
.green-article {
  border: #3cc56d 1px solid;
  background-color: rgb(233, 247, 238);
}
.orange-article {
  border: #f9bf2c 1px solid;
  background-color: rgb(245, 239, 224);
}
.caogaoText {
  position: absolute;
  top: 17%;
  left: 12%;
  width: 100px;
  height: 30px;
  z-index: 100;
  text-align: center;
  font-size: 12px;
  color: #f9bf2c;
}
.jinxingText {
  position: absolute;
  top: 17%;
  left: 31.5%;
  width: 100px;
  height: 30px;
  z-index: 100;
  text-align: center;
  font-size: 12px;
  color: #39d1e8;
}
.overText {
  position: absolute;
  top: 17%;
  left: 51%;
  width: 100px;
  height: 30px;
  z-index: 100;
  text-align: center;
  font-size: 12px;
  color: #3cc56d;
}
.closeText {
  position: absolute;
  top: 17%;
  left: 70.5%;
  width: 100px;
  height: 30px;
  z-index: 100;
  text-align: center;
  font-size: 12px;
  color: #797ce6;
}
</style>
