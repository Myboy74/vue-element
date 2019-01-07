<template>
    <div class="f_taskManager">
        <div class="headTagLy">
            <h2 class="tag">通知管理详情</h2>
        </div>
        <div class="ms-articleLy shadowLy" style="padding:1px;">
            <div class="detail-title-area">
                <h2>{{content.messageTitle}}</h2>
            </div>
            <div class="context-area">
                <div class="publishman-area">
                  <span>发布者：{{content.publishPersonName}}</span> 
                  <span style="margin-left:20px">添加日期:{{content.publishDate}}</span>
                </div> 
                <div class="context-panel" v-html="content.messageContent"></div>
                <div class="clear"></div>
            </div>
            <div class="attachment-area">
                <div class="attachment-label">附件:
                  <span v-if="!detailFileArray.length" style="color:#aeaeae">暂无附件</span>
                  
                  <a v-else v-for="(item,index) in detailFileArray" 
                  :key="index" download
                  :href="item.url" target="_black"
                  >{{item.fileName}}</a></div>
            </div>
            <div class="hr"></div>
            <div class="clear"></div>
            <div class="f_btn back-btn" @click="backRoute" style="color:#000">
                返回
            </div>
        </div>
    </div>
</template>
<script>
import qs from "qs";
import { postAjax, getAjax, uploadImg } from "../../../../api/api.js";
export default {
  data() {
    return {
      id: this.$route.query.id,
      content: "",
      detailFileArray: []
    };
  },
  mounted() {
    this.autoMove(this.id);
  },
  methods: {
    autoMove(id) {
      postAjax("ajax/message/managerMessageNotice/detail?id=" + id).then(
        res => {
          if (res.data.state == 1) {
            // console.log(res);
            this.content = res.data.data;
            let file = this.content.fjUrl;
            if (file) {
              let tempFileArray = file.split("|");
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
                  // console.log(this.detailFileArray);
                }
              }
            }
          }
        }
      );
    },
    backRoute() {
      window.history.back(-1);
    }
  }
};
</script>

<style scoped>
.f_taskManager .search-input {
  width: 242px !important;
}

.f_taskManager .el-date-editor--datetimerange {
  width: 241px !important;
}

.label-search {
  text-align: right;
  color: #333;
  font-size: 14px;
  line-height: 40px;
  padding: 10px 0px 0px 10px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  /* display: inline; */
}

.search-input {
  /* display: inline-block; */
  margin: 12px 0px 0px 10px;
}

/*分页样式*/
.fenyeCenter {
  text-align: center;
  margin: 10px auto 0px;
}

.button {
  float: right;
  margin: 7px 7px 0 0;
}

.button input {
  margin-right: 10px;
}

.el-table .cell p {
  width: 100%;
  height: 100%;
  cursor: pointer;
}

.el-table .cell p:hover {
  color: #4a90e2;
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

.detail-title-area {
  text-align: center;
  margin: 10px auto 0px;
  max-width: calc(80% - 20px);
  height: 40px;
  background: #f1f1f1;
  border-radius: 5px;
  padding: 7px 10px 7px 10px;
}

.detail-title-area h2 {
  margin: 7px auto 0px;
  font-size: 18px;
  /* color: #000; */
  color: #353639;
}

.context-area {
  margin: 10px auto 0px;
  width: 80%;
  padding-bottom: 10px;
}
/*正文样式*/
.context-area .context-panel {
  float: left;
  font-size: 14px;
  color: #353639;
  text-indent: 2em;
}

.attachment-area {
  margin: 5px auto 20px;
  width: 80%;
}

.attachment-area .attachment-label {
  font-size: 14px;
  color: #353639;
}
.attachment-area .attachment-label a {
  display: inline-block;
  margin-left: 10px;
  font-size: 14px;
}
.attachment-area .attachment-label a:hover{
  color: red;
}

.hr {
  margin: 0px 0px 20px 0px;
  width: 100%;
  border-bottom: #ececec 1px solid;
}
.back-btn {
  margin: 10px 0px 20px 10%;
  width: 3%;
  text-align: center;
}
.publishman-area {
  width: 100%;
  text-align: right;
  font-size: 14px;
  color: #999999;
}
</style>
