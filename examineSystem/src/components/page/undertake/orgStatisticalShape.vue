<template>
    <div>
        <div class="headTagLy">
            <h2 class="tag">党组织信息统计</h2>
            <div class="orglist-btn active">图形</div>
            <div class="orglist-btn" @click="toList">列表</div>
            <div class="clear"></div>
        </div>
        <!-- 进度条区域 -->
        <div class="ms-articleLy shadowLy">
            <div class="progress-content">
                <p>{{leftTask}}</p>
                <p class="greenTitle">{{leftMeeting}}</p>
                <div id="orgProgress" class="progress"></div>
            </div>
          <div class="clear"></div>
        </div>
        <!-- 柱状图区域 -->
        <div class="ms-articleLy pillar-area shadowLy">
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
</template>
<script>
import echarts from "echarts";
import { postAjax, getAjax ,postTaggle} from "../../../api/api.js";
export default {
  data() {
    return {
      leftTask:'',
      leftMeeting:''
    };
  },
  mounted() {
    // this.autoMove();  //正式
     this.autoMove2(); //暂用卜宪文的
  },
  methods: {
    toList() {
      this.$router.push({ path: "/orgStatistical" });
    },
    autoMove() {
      let id=sessionStorage.getItem("userWordId");
      getAjax("statisticAnalysis/statistic/statisticGraph?id=" + id)
        .then(res => {
          // console.log(res.data.data);
          let data = res.data.data.tableData;
          this.initProgress(data); //显示进度条；
          this.initOrgPillar(data); //显示柱状图区域；
          this.initOrgPie(data); //显示饼状图 ；
        })
        .catch(err => {
          console.log(err);
        });
    },
    autoMove2(){
       let id=sessionStorage.getItem("userWordId");
     postTaggle("gzwstatistic/statisticGraph?gzwid=" + id)
        .then(res => {
          // console.log(res.data.data);
          let data = res.data.data.tableData;
          this.initProgress(data); //显示进度条；
          this.initOrgPillar(data); //显示柱状图区域；
          this.initOrgPie(data); //显示饼状图 ；
        })
        .catch(err => {
          console.log(err);
        });
    },
    initProgress(data) {
      //进度条ss
      // console.log(data);
      var date = [];  //各个百分比
      var xData = [];  //名字
      var yData = [];  //具体数值
      var sumdata=[];  //总数
      this.leftTask = data[1].partyOrgSumStatistic;
      this.leftMeeting = data[0].partyOrgSumStatistic;
      let a= Number(data[1].partyOrgSum)+Number(data[0].partyOrgSum); //总数
    
      data.forEach(element => {
        xData.push(element.fieldName);
        yData.push(element.partyOrgSum);
        sumdata.push(a);//总数
        //  去除数据得% 
        date.push(
          element.partyOrgSumStatistic.substring(
            0,
            element.partyOrgSumStatistic.length - 1
          )
        );
      });
      let progress = this.$echarts.init(document.getElementById("orgProgress"));
      var option = {
        backgroundColor: "#fff",
        title: {
          text: "党组织总数统计",
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
          show: "false",
          trigger: "item",
          backgroundColor: "rgba(0,0,0,0.7)", // 背景
          padding: [10, 10], //内边距
          formatter: function(params){
            return "党组织总数统计<br/>数量:"+params.data+"<br/>占比:"+date[params.dataIndex]+"%";
          }
        },
        grid: {
          borderWidth: 0,
          top: 30,
          left: 85,
          right: 50,
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
              position: "right",
              formatter: "{c}",
                
            },
            name: "",
            type: "bar",
             hoverAnimation: false,
            legendHoverLink: false,
            itemStyle: {
              normal: {
                show: true,
                color: function(params) {
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
            data: yData
          },
          {
            label: {
              show: true,
              position: "right",
              fontSize:14,
              formatter: "{a}总数:{c}"
            },
            name: "",
            type: "bar",
            yAxisIndex: 1,
            hoverAnimation: false,
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
            data: sumdata
          }
        ]
      };
      progress.setOption(option);
    },
    initOrgPillar(date) {
      //柱状图
      var data = [];
      var score = [];
      var yData = [];
      for (var i = 0; i < 4; i++) {
        //总数
        yData[i] = date[0].partyOrgSum;
      }
      //百分比
      score.push(date[0].committeeNumStatistic);
      score.push(date[0].partyAllOrgNumStatistic);
      score.push(date[0].partyOrgNumStatistic);
      score.push(date[0].outOrgStatistic);

      // 数据数量
      data.push(date[0].committeeNum);
      data.push(date[0].partyAllOrgNum);
      data.push(date[0].partyOrgNum);
      data.push(date[0].outOrg);

      let pillar = this.$echarts.init(document.getElementById("orgPillar"));
      var xData = [
        "党委数量",
        "党总支部\n数量",
        "党支部数量",
        "灯塔外党\n组织数量"
      ];
      // var data = [30700, 24700, 31700, 30000];
      var option = {
        backgroundColor: "#fff",
        title: {
          text: "直接管理党组织统计",
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
        tooltip: {    /********鼠标滑过文字********/
          show: "true",
          trigger: "item",
          backgroundColor: "rgba(0,0,0,0.7)", // 背景
          padding: [8, 10], //内边距
          extraCssText: "box-shadow: 0 0 3px rgba(255, 255, 255, 0.4);", //添加阴影
          formatter: function(params) {
            if (params.seriesName != "") {
              return (
                params.name +
                ":" +
                params.value +
                "<br/>百分比：" +
                score[params.dataIndex]
              );
            }
          }
        },
        grid: {
          borderWidth: 0,
          top: 50,
          left: 50,
          right: 50,
          bottom: 45,
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
              color: "#32346c "
            }
          }
        },
        series: [
          {
            label: {
              show: true,    
              position: "top",
              color: function(params) {
                //我这边就两个柱子，大体就两个柱子颜色渐变，所以数组只有两个值，多个颜色就多个值
                var colorList = [
                  ["#3CC56D", "#ececec"],
                  ["#F95A79", "#ececec"],
                  ["#f0db47", "#ececec"],
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
            name: "生师比(%)",
            type: "bar",
            itemStyle: {
              normal: {
                show: true,
                color: function(params) {
                  //我这边就两个柱子，大体就两个柱子颜色渐变，所以数组只有两个值，多个颜色就多个值
                  var colorList = [
                    ["#3CC56D", "#ececec"],
                    ["#F95A79", "#ececec"],
                    ["#F9BF2C", "#ececec"],
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
            data: data
          },
          {
            label: {
              show: false,   /********显示柱状图顶部提示文字的开关********/
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
            data: yData
          }
        ]
      };
      pillar.setOption(option);
    },
    initOrgPie(data) {
      //饼状图
      // console.log(data[1]);

      // data.push(data[1].committeeNum);
      // data.push(date[1].partyAllOrgNum);
      // data.push(date[1].partyOrgNum);
      // data.push(date[1].outOrg);

      var date = ["党委数量", "党总支部数量", "党支部数量", "灯塔外党组织数量"];
      var content = [
        { value: data[1].committeeNum, name: "" },
        { value: data[1].partyAllOrgNum, name: "" },
        { value: data[1].partyOrgNum, name: "" },
        { value: data[1].outOrg, name: "" }
      ];
      var val = [
        { value: data[1].committeeNum, name: "党委数量" },
        { value: data[1].partyAllOrgNum, name: "党总支部数量" },
        { value: data[1].partyOrgNum, name: "党支部数量" },
        { value: data[1].outOrg, name: "灯塔外党组织数量" }
      ];
      let pieChart = this.$echarts.init(document.getElementById("orgPieChart"));
      var option = {
        title: {
          text: "属地管理党组织统计",
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
          data: date,
          textStyle: {
            color: "#000"
          }
        },
        series: [
          {
            name: "属地管理党组织统计",
            type: "pie",
            hoverAnimation: false,
            legendHoverLink: false,
            radius: ["58%", "45%"],
            center: ["45%", "65%"],
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

            data: content
          },
          {
            name: "属地管理党组织统计",
            type: "pie",
            radius: ["42%", "55%"],
            center: ["45%", "65%"],
            color: ["#797CE6", "#F95A79", "#F9BF2C", "#3CC56D"],
            label: {
              normal: {
                formatter: "{b}\n{d}%"
              }
            },
            data: val
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
  width: 28px;
  height: 26px;
   font-size: 14px;
  border-radius: 5px;
  background-color: #e91b1b;
  color: #fff;
  float: right;
  padding: 0px 10px 0px 10px;
  margin: 8px 10px 0px 0px;
  cursor: pointer;
}
.progress-content {
  float: left;
  margin: 4px 0px 0px 20px;
  width: 64%;
  padding-bottom: 5px;
  position: relative;
}
.progress-content p{
    font-size: 14px;
    font-weight: bold;
    position: absolute;
    top: 85px;
    right: 10px;
    z-index: 999;
    color: #ff151a;
}
.progress-content p.greenTitle{
    color: #20c47d;
    top: 155px;
}
.progress {
  margin-top: 10px;
  width: 100%;
  height: 200px;
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
</style>
