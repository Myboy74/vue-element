<template>
    <div>
        <div class="headTagLy">
            <h2 class="tag">得分统计</h2>
            <div class="orglist-btn active">图形</div>
            <div class="orglist-btn" @click="toList">列表</div>
            <div class="clear"></div>
        </div>
        <div style="width:100%;height:100%;float:left">
  <!-- 柱状图区域 -->
        <div class="ms-articleLy shadowLy" style="position:relative; padding:1px; width:calc(100% - 2px)">
            <el-select v-model="scoreType"  class="echart-select">
              <el-option label="总分" value="1"></el-option>
              <el-option label="时效分" value="2"></el-option>
              <el-option label="质量分" value="3"></el-option>
              <el-option label="调节分" value="4"></el-option>
            </el-select>
            <div class="pillar-content" style="border-bottom:1px solid #cccccc">
                <div id="scorePillar" class="pillar"></div>
            </div>
          <div class="clear pillar" id="scoringRate" ></div>
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
      reload: false,
      scoreType: "总分",
      ydata: [], //放总分
      dataAxis: [], //放name
      dataRate:[],//得分率
    };
  },
  mounted() {
    this.autoMove(this.scoreType);
  },
  watch: {
    scoreType(val) {
      this.autoMove(val);
    }
  },
  methods: {
    toList() {
      this.$router.push({ path: "/scoreList" });
    },
    autoMove(val) {
      // console.log(val);
      let id=sessionStorage.getItem("userWordId");
      getAjax("statisticAnalysis/statistic/statisticOrgScoreGraph?id=" + id)
        .then(res => {
          res.data.data.forEach((element, index) => {
            this.dataAxis[index] = element.shortName;
            if (this.scoreType === undefined || val == 1 ||val=="总分") {
              this.ydata[index] = element.score; //总分
            } else if (val == 2) {
              this.ydata[index] = element.timeScore; //时效分
            } else if (val == 3) {
              this.ydata[index] = element.qualityScore; //质量分
            } else if (val == 4) {
              this.ydata[index] = element.adjustScore; //调节分
            }
            this.dataRate[index]=element.scoreRate.substring(0,element.scoreRate.length - 1);//得分率
          });
          this.initPillar(this.dataAxis,this.ydata);
          this.srate(this.dataAxis,this.dataRate);
        })
        .catch(err => {
          console.log(err);
        });
    },
    initPillar(dataAxis, ydata) {
      //柱状图
      let pisllar = this.$echarts.init(document.getElementById("scorePillar"));

      var option = {
        title: {
          text: "得分统计",
          left:"2%",
          top:"5%",
          textStyle:{
           color: "#353639",
            fontSize: "14",
            fontWeight: "bold"
          }
        },
        tooltip: {
          trigger: "axis"
        },
        grid: {
          top: "25%",
          bottom: "10%",
          left: "5%",
          right: "5%"
        },
        xAxis: {
          type: "category",
          data: dataAxis
        },
        yAxis: {
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            textStyle: {
              color: "#999"
            }
          }
        },
        dataZoom: [
          {
            type: "inside"
          }
        ],
        series: [
          {
            type: "bar",
            itemStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: "#DD0000"
                  },
                  {
                    offset: 1,
                    color: "#FF7c00"
                  }
                ]),
                barBorderRadius: 30
              },
              emphasis: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: "#DD0000"
                  },
                  {
                    offset: 0.7,
                    color: "#2378f7"
                  },
                  {
                    offset: 1,
                    color: "#FF7c00"
                  }
                ])
              }
            },
            data: ydata
          }
        ],
        label: {
          normal: {
            show: true,
            position: "top",
            formatter: "{c}"
          }
        }
      };

      // Enable data zoom when user click bar.
      // var zoomSize = 6;
      // pisllar.on("click", function(params) {
      //   console.log(dataAxis[Math.max(params.dataIndex - zoomSize / 2, 0)]);
      //   pisllar.dispatchAction({
      //     type: "dataZoom",
      //     startValue: dataAxis[Math.max(params.dataIndex - zoomSize / 2, 0)],
      //     endValue:
      //       dataAxis[
      //         Math.min(params.dataIndex + zoomSize / 2, ydata.length - 1)
      //       ]
      //   });
      // });
      pisllar.setOption(option);
    },
    srate(dataAxis,ydata) {
      var f_scoreNum = echarts.init(document.getElementById("scoringRate"));
      
      var option = {
        title: {
          text: "得分率统计",
          left:"4%",
          top:"5%",
          textStyle:{
            color: "#353639",
            fontSize: "14",
            fontWeight: "bold"
          }
        },
        tooltip: {
          trigger: "axis",
          formatter:function(a){
            // console.log(a);
            return a[0].name+"<br/>得分率:"+a[0].value+"%";
          }
        },
        grid: {
          top: "20%",
          bottom: "10%",
          left: "6%",
          right: "6%"
        },
        xAxis: {
          type: "category",
          data: dataAxis
        },
        yAxis: {
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            textStyle: {
              color: "#999"
            }
          }
        },
        dataZoom: [
          {
            type: "inside"
          }
        ],
        series: [
          {
            type: "bar",
            itemStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: "#00d386"
                  },
                  {
                    offset: 1,
                    color: "#0076fc"
                  }
                ]),
                barBorderRadius: 30
              },
              emphasis: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: "#2378f7"
                  },
                  {
                    offset: 0.7,
                    color: "#2378f7"
                  },
                  {
                    offset: 1,
                    color: "#83bff6"
                  }
                ])
              }
            },
            data: ydata
          }
        ],
        label: {
          normal: {
            show: true,
            position: "top",
            formatter: "{c}"
          }
        }
      };
      f_scoreNum.setOption(option);
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
.pillar-area {
  float: left;
  width: 49.5%;
  margin: 1% 0.5% 0% 0%;
  padding-bottom: 10px;
}
.pillar-content {
  margin: 4px 0px 0px 20px;
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
/* echarts的select样式 */
.echart-select {
  cursor: pointer;
  position: absolute;
  top: 20px;
  right: 20px;
  width: 160px;
  height: 40px;
  z-index: 999;
   font-size: 12px;
}
</style>
