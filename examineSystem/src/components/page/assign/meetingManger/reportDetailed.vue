<template>
    <div>
        <div class="headTagLy">
            <h2 class="tag">上报明细</h2>
        </div>
        <div class="ms-articleLy shadowLy" style="overflow:hidden;">
            <div class="meetingContent">
                <div>
                     <span class="fl">会议信息</span>
                <ul class="information" v-if="tableData.length">
                    <li v-for="(item,index) in tableData"
                    :key="index">
                        <div class="peopleMation">
                            <span class="fl">参会人员姓名</span>
                            <p>{{item.name?item.name:"暂无信息"}}</p>
                        </div>
                        <div class="peopleMation">
                            <span class="fl">参会人员性别</span>
                            <p>{{item.sexValue?item.sexValue:"暂无信息"}}</p>
                        </div>
                         <div class="peopleMation">
                            <span class="fl">参会人员电话</span>
                            <p>{{item.tel?item.tel:"暂无信息"}}</p>
                        </div>
                         <div class="peopleMation">
                            <span class="fl">参会人员单位</span>
                            <p>{{item.office?item.office:"暂无信息"}}</p>
                        </div>
                         <div class="peopleMation">
                            <span class="fl">参会人员职务</span>
                            <p>{{item.position?item.position:"暂无信息"}}</p>
                        </div>
                          <div class="peopleMation">
                            <span class="fl">备注信息</span>
                            <p>{{item.remark?item.remark:"暂无信息"}}</p>
                        </div>
                    </li>
                </ul>
                <div v-else class="information">暂无会议信息</div>
                </div>
                <div class="cle">
                     <span class="fl">会议联系电话</span>
                    <div class="information">{{meeting.tel?meeting.tel:"暂无信息"}}</div>
                </div>
                <div class="cle">
                     <span class="fl">备注信息</span>
                    <div class="information">{{meeting.note?meeting.note:"暂无信息"}}</div>
                </div>
                 <div class="cle">
                     <span class="fl">附件上传</span>
                    <div class="information">
                        <span v-show="fileUrl.length==0" style="color:#aeaeae">暂无上传文件</span>
                        <a v-for="(item,index) in fileUrl" :key="index" download :href="item.url" target="_blank">{{item.name}}</a>
                    </div>
                </div>
                 <button class="f_btn" style="color:#000;" @click="returnTop">返回</button>
            </div>
           
        </div>
    </div>
</template>

<script>
import { postAjax, getAjax, uploadImg } from "../../../../api/api.js";
export default {
  created() {
    // console.log("接收方"+this.report);
    // console.log("会议id"+this.meetingid);
    this.autoMove(this.reportid, this.wid);
  },
  data() {
    return {
      tableData: [],//上报人员信息
      meeting: "",//上报单位得信息
      attachment: localStorage.getItem("attachment"),//上传文件得下载（预览）路径
      reportid: this.$route.query.report,
      wid: this.$route.query.meetingid,
      arr: [],
      arrname: [],
      fileUrl:[],  //承办方文件数组
    };
  },
  methods: {
    autoMove(num, id) {
      //会议上报详情进入
      // console.log(num);
      postAjax(
        "ajax/meeting/taskMeetingmember/meetingMemberDetail?id=" + id
      )
        .then(res => {
          this.tableData = res.data.data.receiveMeeting.memberList;
          this.meeting = res.data.data.receiveMeeting;
          //上传文件拆分
          // if(this.meeting.attachment){
          //   this.arr=this.meeting.attachment.split("|");
          //   console.log(this.arr);
          //   // this.arr.splice(0, 1);//获取文件路径地址

          //   this.arr.forEach(element => {  //获取文件名称
          //     var index = element .lastIndexOf("\/");  
          //     element  = element .substring(index + 1, element.length);
          //     this.arrname.push(element);
          //   });
          // }
          /**********************************承办上传的附件显示问题start********************************************/
          let loadUrl = localStorage.getItem("attachment");
          let startUrl = this.meeting.attachment;
          // console.log(startUrl);
          let urlArray = [];
          if (startUrl) {
            urlArray = startUrl.split("|");
            let urlNameArray = [];
            for (let i in urlArray) {
              urlNameArray = urlArray[i].split("/");
              let lastName = urlNameArray.pop();
              if (lastName !== "") {
                this.fileUrl.push({ url: loadUrl + urlArray[i], name: lastName, });  //push一下文件链接和文件名
              }
            };  //附件数组
            console.log(this.fileUrl);
          }
          /**********************************承办上传的附件显示问题end********************************************/
        })
    },
    liLowerUpfile(num) {
      //表格得文件下载预览
      // console.log(this.arr[num]);
      // return
      window.open(this.attachment + this.arr[num], "_blank");
    },
    returnTop() {
      window.history.back(-1);
    }
  }
};
</script>

<style scoped>
.meetingContent {
  width: 80%;
  margin: 20px;
  font-size: 14px;
}
.meetingContent > div {
  margin-bottom: 20px;
}
.information span {
  color: #353639;
}
.information {
  /* width: 95%; */
  min-height: 15px;
  margin-left: 100px;
  color: #898a8f;
}
.information li {
  width: 300px;
  height: 240px;
  float: left;
  overflow: auto;
  overflow-x: hidden;
  margin: 0 20px 20px 0;
  border: 1px solid #cccccc;
  padding: 20px 20px 0 20px;
  border-radius: 5px;
}
.peopleMation {
  margin-bottom: 20px;
}
.peopleMation p {
  margin-left: 100px;
  min-height: 20px;
}
.information a {
  margin:0 20px 10px 0;
}
</style>
