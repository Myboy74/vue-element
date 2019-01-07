<template>
    <div>
        <div class="headTagLy">
            <h2 class="tag">任务详情</h2>
        </div>
        <div class="ms-articleLy shadowLy" style="padding:1px 1px 10px 1px;">
            <ul class="panel-ul">
                
                <li class="el-rowLy">
                    <h2 class="mark">
                        紧急程度
                    </h2>
                    <span class="row-text">
                        {{conText.importantLevelName?conText.importantLevelName:"暂无紧急程度"}}
                    </span>
                </li>
                <li class="el-rowLy">
                    <h2 class="mark">
                        任务编号
                    </h2>
                    <span class="row-text">
                        {{conText.taskNum?conText.taskNum:"暂无任务编号"}}
                    </span>
                </li>
                <li class="el-rowLy">
                    <h2 class="mark">
                        任务名称
                    </h2>
                    <span class="row-text">
                        {{conText.name?conText.name:"暂无任务名称"}}
                    </span>
                </li>
                <li class="el-rowLy">
                    <h2 class="mark">
                        任务描述
                    </h2>
                    <span class="row-text">
                        {{conText.content?conText.content:"暂无任务描述"}}
                    </span>
                </li>
                <li class="el-rowLy" style="margin-top:5px">
                    <h2 class="mark">
                        起止时间
                    </h2>
                    <span class="row-text" v-if="conText.startDate">
                        {{conText.startDate}} --{{conText.endDate}}
                    </span>
                    <span class="row-text" v-else>
                        暂无
                    </span>
                </li>
                <li class="el-rowLy">
                    <h2 class="mark">
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
            <div class="button-group">
                <div v-if="false" class="f_btn f_green default" style="margin-left:0px;margin-bottom:20px" @click="taskNowChild">
                    任务办理
                </div>
                <div v-if="false" class="f_btn f_purple default" @click="taskAnswer">
                    任务答疑
                </div>
                <div class="clear"></div>
            </div>
            <h2 class="titleLy" style="font-size: 14px; margin: 10px 0px 0px 20px;">
                子任务
            </h2>
            <div class="table-content">
                <el-table :data="tableData" border stripe>
                    <el-table-column prop="stageNum" label="子任务编号" >
                    </el-table-column>
                    <el-table-column label="子任务名称">
                        <template slot-scope="scope">
                            <el-tooltip 
                             class="item" effect="dark" :content="scope.row.stageName" placement="right">
                                <span> {{scope.row.stageName}}</span>   
                            </el-tooltip>
                        </template>
                    </el-table-column>
                    <el-table-column  label="子任务详情">
                         <template slot-scope="scope">
                            <el-tooltip 
                             class="item" effect="dark" :content="scope.row.note" placement="right">
                                <span> {{scope.row.note}}</span>   
                            </el-tooltip>
                        </template>
                    </el-table-column>
                    <el-table-column label="起始时间">
                        <template slot-scope="scope">
                            {{scope.row.startDate}} -- {{scope.row.endDate}}
                        </template>
                    </el-table-column>
                    <el-table-column label="操作">
                        <template slot-scope="scope">
                            <div class="f_box">
                                <el-tooltip v-show="scope.row.detailId !== undefined" class="item" effect="dark"
                                    content="查看详情" placement="top">
                                    <img src="../../../../static/img/Group148.png" @click="toDetail(scope.row.detailId,scope.row.taskId)">
                                </el-tooltip>
                                <!-- <el-tooltip class="item" effect="dark" content="问题答疑" placement="top">
                                    <img v-show="scope.row.detailId !== undefined" src="../../../../static/img/Group810.png"
                                        @click="taskAnswer(scope.row.taskId)">
                                </el-tooltip> -->
                                <el-tooltip class="item" effect="dark" content="任务办理" placement="top">
                                    <img v-if="lock!=1" src="../../../../static/img/Group823.png" @click="taskHandle(scope.row.id,scope.row.taskId)">
                                </el-tooltip>
                            </div>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div class="clear"></div>
            <div class="button-group" style="border-bottom:none;">
                <div class="f_btn back-btn" @click="backRoute" style="color:#000">
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
    console.log(this.id);
    // console.log(this.topId);

    this.autoMove(this.id);
  },
  data() {
    return {
      id: sessionStorage.getItem("childTask"),
      lock: sessionStorage.getItem("childTop"), //是否显示办理按钮
      conText: "", //内容
      arr: [],
      arrname: [], //上传文件名字
      attachment: localStorage.getItem("attachment"), //上传文件得下载（预览）路径
      tableData: [] //子任务列表
    };
  },
  methods: {
    autoMove(id) {
      postAjax(
        "ajax/task/taskDetail/receive?flag=yes&status=0&taskId=" + id
      ).then(res => {
        // console.log(res);
        this.conText = res.data.data.dayTask;
        //上半部分上传文件拆分
        if (this.conText.attachment) {
          this.arr = this.conText.attachment.split("|");
          // this.arr.splice(0, 1); //获取文件路径地址

          this.arr.forEach(element => {
            //获取文件名称
            if (element !== "") {
              var index = element.lastIndexOf("/");
              let name = element.substring(index + 1, element.length);
              name = decodeURI(name);
              if (name !== "") {
                this.arrname.push({
                  name: name,
                  url: this.attachment + element
                });
              }
            }
          });
        }
        //子任务列表
        this.tableData = this.conText.stageList;
      });
    },
    taskNowChild() {
      //任务办理 没有子任务直接点击办理按钮
      let get = sessionStorage.getItem("childTask");
      this.$router.push({
        path: "/taskHandle",
        query: {
          parentId: get,
          childId: ""
        }
      });
    },
    taskHandle(id, Pid) {
      //任务办理 子任务得
      // console.log(id,Pid)
      //
      this.$router.push({
        path: "/taskHandle",
        query: {
          childId: id,
          parentId: Pid
        }
      });
    },
    taskAnswer(id, Pid) {
      //任务答疑
      this.$message("功能暂未开放,敬请期待!");
      //   this.$router.push({ path: "/taskAnswer" });
    },
    toDetail(id, Pid) {
      //进入子任务详情
      console.log(id, Pid);
      this.$router.push({
        path: "/subTaskDetail",
        query: {
          childId: id,
          parentId: Pid
        }
      });
    },
    backRoute(id, Pid) {
      //返回
      window.history.back(-1);
      //   this.$router.push({ path: "/taskManager" });
    }
  }
};
</script>

<style scoped>
.panel-ul {
  padding: 20px;
  width: 98%;
}

.el-rowLy {
  list-style-type: none;
  width: 100%;
  min-height: 40px;
}

.el-rowLy .mark {
  float: left;
  width: 75px;
  font-size: 14px;
  font-weight: normal;
  color: #353639;
}

.el-rowLy .row-text {
  display: inline-block;
  width: calc(100% - 106px);
  font-size: 14px;
  padding-top: 3px;
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
  /* height: 54px; */
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
  width: 76%;
}

.hr {
  margin: 20px 0px 0px 30px;
  width: 80%;
  border-bottom: #ececec 1px solid;
}

.back-btn {
  margin-top: 20px;
  width: 5%;
  text-align: center;
}

.f_box > img {
  cursor: pointer;
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

.item {
  margin: 4px;
}

.left .el-tooltip__popper,
.right .el-tooltip__popper {
  padding: 8px 10px;
}
</style>
