<template>
    <div class="meetingS">
        <div class="headTagLy">
            <h2 class="tag">会议审核</h2>
        </div>
        <div class="global-panel">

            <article class="left-panel shadowLy">
                <div class="left-panel-title">
                    <span>会议列表</span>
                </div>
                <div class="search-area">
                    <el-input placeholder="请输入会议编号或标题" v-model="filterText" class="input-with-select">
                        <el-button slot="append" icon="el-icon-search" @click="searchFn"></el-button>
                    </el-input>
                    <label class="label-search">会议时间</label>
                    <el-date-picker class="search-input" v-model="time1" value-format="yyyy-MM-dd" type="date"
                        placeholder="年/月/日">
                    </el-date-picker>
                    <label class="label-search">至</label>
                    <el-date-picker class="search-input" value-format="yyyy-MM-dd" v-model="time2" type="date"
                        placeholder="年/月/日">
                    </el-date-picker>
                    <label class="label-search">状态查询</label>
                    <el-select class="search-input" v-model="selStatus" placeholder="请选择状态">
                        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"
                            style="font-size:12px">
                        </el-option>
                    </el-select>
                </div>
                <div class="item-tree-area tree f_treeW">
                    <el-tree :data="treeData" :props="defaultProps" node-key="id" default-expand-all @node-click="handleNodeClick"
                        :filter-node-method="filterNode" ref="auditTree"></el-tree>
                </div>
            </article>
            <article class="right-panel shadowLy" style="padding-bottom:30px">
                <div class="left-panel-title">
                    <span v-html="'【'+meetingTask.meetnum==undefined ? '' : meetingTask.meetnum+'】'+meetingTask.title==undefined ? '' : meetingTask.title"></span>
                </div>
                <ul class="panel-ul">
                    <li class="el-rowLy">
                        <h2 class="mark">
                            会议状态
                        </h2>
                        <span v-if="meetingTask.ext1=='1'" class="row-text">
                            已保存
                        </span>
                        <span v-if="meetingTask.ext1=='2'" class="row-text">
                            已下发
                        </span>
                        <span v-if="meetingTask.ext1=='3'" class="row-text">
                            已完成
                        </span>
                        <span v-if="meetingTask.ext1=='4'" class="row-text">
                            已撤销
                        </span>
                    </li>
                    <li class="el-rowLy">
                        <h2 class="mark">
                            会议标题
                        </h2>
                        <span class="row-text">
                            {{meetingTask.title}}
                        </span>
                    </li>
                    <li class="el-rowLy">
                        <h2 class="mark">
                            会议内容
                        </h2>
                        <span class="row-text">
                            {{meetingTask.summary}}
                        </span>
                    </li>
                    <li class="el-rowLy">
                        <h2 class="mark">
                            会议编号
                        </h2>
                        <span class="row-text">
                            {{meetingTask.meetnum}}
                        </span>
                    </li>
                    <li class="el-rowLy">
                        <h2 class="mark">
                            参会人员要求
                        </h2>
                        <span class="row-text">
                            {{meetingTask.requirement}}
                        </span>
                    </li>

                    <li class="el-rowLy">
                        <h2 class="mark">
                            会议地点
                        </h2>
                        <span class="row-text">
                            {{meetingTask.address}}
                        </span>
                    </li>
                    <li class="el-rowLy">
                        <h2 class="mark">
                            会议时间
                        </h2>
                        <span class="row-text">
                            {{meetingTask.meetingtime}}
                        </span>
                    </li>
                    <li class="el-rowLy">
                        <h2 class="mark">
                            附件上传
                        </h2>
                        <span class="row-text">
                            <span v-if="arrname.length==0" style="color:#aeaeae">暂无上传文件</span>
                            <a 
                            style="padding:0 10px 10px 0" 
                            v-else download
                             v-for="(ite,index) in arrname"
                                :key="index" :href="ite.url" target="_blank">
                                {{ite.name}}
                            </a>
                        </span>
                    </li>
                </ul>
                <div class="button-group">
                    <div v-show="meetingTask.ext1!=3&&meetingTask.ext1!=4" class="f_btn f_green default" style="margin-left:0px;"
                        @click="taskOver(meetingTask.id)">
                        完成会议
                    </div>
                    <div v-show="meetingTask.ext1!=3&&meetingTask.ext1!=4" class="f_btn f_bigRed default" @click="taskCancel(meetingTask.id)">
                        撤销会议
                    </div>
                    <div class="clear"></div>
                </div>
                <div class="table-content">
                    <el-table class="metting-table" stripe :data="tableData" border style="margin:0 0 50px 25px;">
                        <el-table-column prop="num" label="序号" width="80">
                        </el-table-column>
                        <el-table-column prop="officeName" label="单位名称" width="60">
                        </el-table-column>
                        <el-table-column prop="status" label="接收" width="60">
                            <template slot-scope="scope">
                                <span v-if="scope.row.status==1">未接收</span>
                                <span v-else>已接收</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="附件">
                            <template slot-scope="scope">
                                <span v-for="(tItem,tIndex) in scope.row.attachmentArray" :key="tIndex">
                                    <el-tooltip class="item" effect="dark" :content="tItem.fileName" placement="top">
                                        <a class="attachmentItem" :href="tItem.fileUrl"  download target="_blank">{{tItem.fileName}}</a>&nbsp;
                                    </el-tooltip>
                                </span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="memberNum" label="参会人数" width="80">
                        </el-table-column>
                        <el-table-column label="联系电话" width="110">
                            <template slot-scope="scope">
                                {{ scope.row.tel?scope.row.tel:"无" }}

                            </template>
                        </el-table-column>
                        <el-table-column prop="updateDate" label="办结时间" width="100">
                        </el-table-column>
                        <el-table-column label="总分" width="98">
                            <template slot-scope="scope">
                                <div class="f_box">
                                    <el-input size="small" :id="scope.row.id" @blur="inputScore" @input="inputid" style="width:80px;text-align:center"
                                        :value="scope.row.score" type="number"></el-input>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作" width="120">
                            <template slot-scope="scope">
                                <div class="f_box" v-show="scope.row.status!=1">
                                    <div class="audit-btn" @click="preservation(scope.row.id,scope.row.score)">保存</div>
                                    <div class="audit-btn" @click="toExamine(scope.row.id)">考核</div>
                                </div>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
                <div class="clear"></div>
            </article>
        </div>
    </div>

</template>

<script>
import qs from "qs";
import {
  postAjax,
  getAjax
} from "../../../../api/api.js";
export default {
  created() {
    this.loadTree(); //加载左侧树
    this.mettingAuditStatus(); //加载默认列表
  },
  data() {
    return {
      filterText: "", //搜索会议标题
      time1: "", //搜索开始时间
      time2: "", //搜索结束时间
      defaultProps: {
        //搜索下面得节点树
        children: "",
        label: "meetnum"
      },
      treeData: [], //节点树
      meetingTask: [], //获取具体会议
      attachment: localStorage.getItem("attachment"), //上传文件得下载（预览）路径
      wordId: "", //单位id
      upperScore: "", //上限分数
      arr: [], //上传文件地址
      arrname: [], //上传文件名字
      liarr: [], //表格下部分文件地址
      liarrName: [], //表格下部分文件名字
      tableData: [], //表格内容
      sumScore: [], //表格总分
      scoreText: "", //输入分数的值
      limitScore: 0, //右侧栏上线分数
      options: [], //状态列表
      selStatus: "", //默认状态
      meetingKeyStand: "", //默认选择树节点的id
    };
  },
  watch: {
    filterText(val) {
      this.$refs.auditTree.filter(val);
    },
  },
  methods: {
    mettingAuditStatus() { //会议审核状态下拉列表
      let typeLevel = 'meetStatus';
      getAjax("ajax/meeting/taskMeeting/getDict?type=" + typeLevel).then(res => {
        if (res.data) {
          this.options.push({
            value: '',
            label: '全部'
          });
          res.data.forEach((item, index) => {
            if (index != 0) {
              this.options.push({
                value: item.value,
                label: item.label
              });
            }

          })
        }
      });
    },
    searchFn() { //多条件查询树
      let obj = {
        idOrTitle: this.filterText,
        startDate: this.time1,
        endDate: this.time2,
        status: this.selStatus
      }
      let data = qs.stringify(obj);
      postAjax("ajax/meeting/taskMeetingCheck", data)
        .then(res => {
          // console.log(res.data);
          this.treeData = res.data;
          // //右边会议默认获取第一条信息
          this.wordTask(res.data[0].id);
        })
    },
    loadTree() {
      //默认加载树
      postAjax("ajax/meeting/taskMeetingCheck")
        .then(res => {
          // console.log(res.data);
          this.treeData = res.data;
          //右边会议默认获取第一条信息
          this.meetingKeyStand = sessionStorage.getItem("mettingKeyStand");

          this.wordTask(this.meetingKeyStand ? this.meetingKeyStand : res.data[0].id);
          this.upperScore = res.data[0].score;
        })
    },
    handleNodeClick(data) {
      // console.log(data)
      this.wordId = data.id;
      this.upperScore = data.score;
      //点击节点树的时候
      this.arr = []; //每次清空一下保存的数据
      this.arrname = []; //每次清空一下保存的数据
      sessionStorage.setItem("mettingKeyStand", this.wordId);
      this.loadTree(); //初始化左侧树reload方法;
      this.wordTask(data.id);
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    wordTask(id) {
      //右侧内容
      postAjax("ajax/meeting/taskMeetingCheck/meetingDetail?id=" + id)
        .then(res => {
          // console.log(res.data);
          //获取文件上半部分内容
          this.meetingTask = res.data.taskMeeting;
          this.limitScore = res.data.taskMeeting.score; //获取上限分数
          //获取文件下半部分表格得内容  也用于完会议时使用
          this.tableData = res.data.taskReceivemeetingList;

          for (let i in this.tableData) {
            this.tableData[i].attachmentArray = []; //给添加附件数组属性
          }
          for (let i in this.tableData) {
            let attachmentTemp = this.tableData[i].attachment; //单条记录的附件
            if (attachmentTemp !== "") { //如果附件路径不为空字符串
              let attacTempArray = attachmentTemp.split('|'); //分割附件地址为附件数组
              let fileNameArray = []; //定义文件名称的数组
              let downloadUrl = localStorage.getItem("attachment"); //获取本地缓存文件下载ip（附件前置路径地址）
              for (let n in attacTempArray) { //   遍历附件数组
                fileNameArray = attacTempArray[n].split("/"); //分割单条附件地址为文件名数组
                let lastName = fileNameArray.pop(); //获取文件名数组中最后一个文件名作为页面最终显示的文件名
                if (attacTempArray[n] !== '') { //如果路径地址不等于空
                  this.tableData[i].attachmentArray.push({ //则开始拼接附件对象
                    fileUrl: downloadUrl + attacTempArray[n], //拼接附件路径
                    fileName: decodeURI(lastName) //获取最后一个文件路径，如果文件名含有unicode则转换为中文
                  });
                }
              }
            }
          }

          //上半部分上传文件拆分
          this.arrname = [];
          if (this.meetingTask.attachment) {
            this.arr = this.meetingTask.attachment.split("|");
            // this.arr.splice(0, 1);//获取文件路径地址
            this.arr.forEach(element => { //获取文件名称
              var index = element.lastIndexOf("\/");
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
        })
    },
    inputid(val) { //监测input输入内容是否为数字
      if (!Number(val) && isNaN(val)) {
        this.$message({
          message: "考核分数只能输入数字,且不能小于0",
          type: "warning"
        });
      }
    },
    inputScore(e) { //输入分数input框
      //获取到input框得内容，及单位id 
      if (this.sumScore.length == 0) {
        this.sumScore.push({
          id: e.target.id,
          value: e.target.value
        })

      } else {
        this.sumScore.forEach(item => {
          if (item.id == e.target.id) {
            this.sumScore.push({
              id: e.target.id,
              value: e.target.value
            })
          }
        })
      }
      //  console.log(this.sumScore)
    },
    taskOver(id) {
      //会议完成
      // for (var i = 0; i < this.tableData.length; i++) {
      //   // console.log(this.tableData[i].status);
      //   if (this.tableData[i].status == "1") {
      //     this.$message({
      //       message: "存在未考核项目不能完成会议",
      //       type: "warning"
      //     });
      //     return;
      //   }
      // }

      this.$confirm("是否确认完成?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          postAjax("ajax/meeting/taskMeetingCheck/finalMeeting?meetingid=" + id)
            .then(res => {
              this.$message({
                showClose: true,
                message: "操作成功",
                type: "success"
              });
              this.loadTree();
            })
        }).catch(() => {
          this.$message({
            type: "info",
            message: "已取消完成会议"
          });
        })
    },
    taskCancel(id) {
      //会议撤销
      // console.log(id);
      this.$confirm("是否确认撤销会议?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          postAjax("ajax/meeting/taskMeetingCheck/closeMeeting?meetingid=" + id)
            .then(res => {
              this.$message({
                showClose: true,
                message: "撤销成功",
                type: "success"
              });
              this.loadTree();
            })
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消撤销会议"
          });
        });
    },
    // lowerUpfile(num) {
    //   //右侧上半部分下载文件（预览）
    //   let id = this.arr[num];
    //   window.open(this.attachment + id, "_blank");
    // },
    // liLowerUpfile(num) {
    //   //表格得文件下载预览
    //   let id = [];
    //   id = num.split("|");
    //   id.splice(0, 1); //获取文件路径地址

    //   window.open(this.attachment + id.pop(), "_blank");
    // },
    preservation(id, currentScore) {
      //保存按钮
      var scoreNum = "";
      this.sumScore.forEach(item => {
        if (item.id == id) {
          scoreNum = item.value
        }
      })
      if (currentScore) {
        scoreNum = scoreNum == "" ? currentScore : scoreNum;
      }
      if (scoreNum == "") {
        this.$message({
          message: "请输入考核分数",
          type: "warning"
        });
        return;
      }
      if (scoreNum <= 0) {
        this.$message({
          message: "考核分数不能小于等于0",
          type: "warning"
        });
        return;
      }
      if (Number(scoreNum) > this.limitScore) {
        this.$message({
          message: "上限分数为：" + this.limitScore + "分，考核分数只能小于等于上限分数",
          type: "warning"
        });
        return;
      } else {
        let param = {
          id: id,
          score: scoreNum
        }
        postAjax("ajax/meeting/taskMeetingCheck/saveScore", param)
          .then(res => {
            this.$message({
              showClose: true,
              message: "保存成功",
              type: "success"
            });
          })
          .catch(err => {
            this.$message({
              showClose: true,
              message: "保存失败",
              type: "error"
            });
          });
      }
    },
    toExamine(id) {
      //考核按钮
      this.$router.push({
        path: "/f_meetingAuditDetails",
        query: {
          assessmentId: id, //接收方id
          wordId: this.wordId //会议id
        }
      });
    }
  }
};

</script>

<style scoped>
.global-panel {
  width: 100%;
  height: 100%;
  float: left;
}

.search-area {
  margin: 20px auto 0px;
  width: 84%;
  height: 150px;
}

.label-search {
  text-align: left;
  width: 57px;
  color: #333;
  font-size: 12px;
  line-height: 40px;
  padding: 10px 0px 0px 5px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  float: left;
}

.search-input {
  font-size: 12px;
  margin: 12px 0px 0px 10px;
  width: 62%;
  float: left;
}

.item-tree-area {
  margin: 60px auto 0px;
  /* width: 84%; */
  max-height: 400px;
  /* height: calc(100% - 220px); */
  box-sizing: border-box;
  overflow-y: auto;
}

/* 右侧样式 */
.panel-ul {
  margin: 10px 0px 0px 30px;
  /* width: 98%; */
  padding-bottom: 10px;
}

.el-rowLy {
  list-style-type: none;
  width: 100%;
  min-height: 35px;
}

.el-rowLy .mark {
  float: left;
  width: 92px;
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
  margin-left: 30px;
  width: 80%;
  height: 54px;
  border-bottom: #ececec 1px solid;
}

/* 按钮默认样式 */
.default {
  font-size: 14px;
  float: left;
  margin-left: 20px;
}

.table-content {
  margin-top: 20px;
  float: left;
  width: 90%;
}

.hr {
  margin: 20px 0px 0px 30px;
  width: 80%;
  border-bottom: #ececec 1px solid;
}

.back-btn {
  margin: 4% 0% 0% 5%;
  width: 5%;
  text-align: center;
}

.audit-btn {
  font-size: 14px;
  border-radius: 5px;
  border: solid 1px #39d1e8;
  color: #39d1e8;
  display: inline-block;
  padding: 3px 10px;
  margin-right: 5px;
  cursor: pointer;
}

.audit-btn:hover {
  border: solid 1px #ff7291;
  color: #ff7291;
  cursor: pointer;
}

/* .item-tree-area > .el-tree {
  width: 98%;
} */

/* .item-tree-area .el-tree-node__label {
  width: 100%;
  word-break: break-word;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
} */

.f_btn {
  width: 80px;
  height: 36px;
  line-height: 36px;
  padding: 0;
  text-align: center;
}

.attachmentItem {
  width: 100%;
  font: 14px/18px Microsoft Yahei;
  word-wrap: break-word;
  text-align: center;
}

.box {
  width: 400px;
}
.top {
  text-align: center;
}

.left {
  float: left;
  width: 60px;
}

.right {
  float: right;
  width: 60px;
}

.bottom {
  clear: both;
  text-align: center;
}
.table-content .el-table .cell, .el-table th div, .el-table--border td:first-child .cell, .el-table--border th:first-child .cell{
    text-align: center;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    overflow: hidden;
    max-height: 250px !important;
}
.item {
  margin: 4px;
  display: block;
}

.left .el-tooltip__popper,
.right .el-tooltip__popper {
  padding: 8px 10px;
}
</style>
