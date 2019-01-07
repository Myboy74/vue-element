<template>
    <div class="taskAnswer">
         <div class="headTagLy"> 
           <h2 class="tag" v-if="btnDetail">会议答疑</h2>
            <h2 class="tag" v-else>任务答疑</h2>
           
        </div>
        <ul  v-if="content.length">
            <li class="shadowLy greyState"
            v-for="(item,index) in content" :key="index">
                <i v-if="!item.hfzt"></i>
                <div>
                    <span>{{item.dwname}}</span>
                    <span style="padding:0 10px;">|</span>
                    <span>{{item.twsj}}</span>
                 </div>
                 <div class="answerContent" @click="question(item.id)">
                     {{item.taskname}}
                 </div>
                 <p class="reply"><span>{{item.zwcount}}</span><i class="iconfont icon-duanxinxi"></i> </p>
                 </li> 
        </ul>
        <div v-else style="text-align:center;padding:30px 0 0 0;">暂无数据</div>
        <div class="button"> 
            <input v-if="btnDetail" type="button" value="会议详情" class="f_btn f_deepBlue" @click="meetingDetails">
            <input v-else type="button" value="任务详情" class="f_btn f_deepBlue" @click="taskDetails">
            <button class="f_btn" style="color:#000;" @click="returnTop">返回</button>
        </div>
    </div>
</template>

<script>
import qs from "qs";
import { postAjax, getAjax, uploadImg } from "../../../../api/api.js";
export default {
  created() {
    if (this.id) {
      //如果地址栏有说明是会议否则走session任务
      this.btnDetail = true;
      this.autoMove(this.id);
    } else {
      this.btnDetail = false;
      this.autoMove(this.taskId);
    }
  },
  data() {
    return {
      id: this.$route.query.f_answerId, //会议
      taskId: sessionStorage.getItem("detailId"), //任务
      btnDetail: true, //显示详情按钮
      content: "" //内容
    };
  },
  methods: {
    autoMove(id) {
      postAjax("ajax/rwtw/rwtw/dy?id=" + id).then(res => {
        if (res.status == 200) {
          // console.log(res)
          this.content = res.data.data.rwtwList;
        }
      });
    },
    returnTop() {
      //后退
      window.history.back(-1);
    },
    question(id) {
      //任务(会议)答疑---问题答疑
      // console.log(this.id);
      // console.log(this.taskId);
      if (this.id) {
        //会议
        this.$router.push({
          name: "f_replyquestion",
          query: {
            meetingId: id
          }
        });
      }else{
        if (this.taskId) {
        //任务
        this.$router.push({
          name: "f_replyquestion",
          query: {
            f_replayId: id
          }
        });
      }
      }
      
    },
    taskDetails() {
      //任务详情
      this.$router.push({ name: "f_taskDetails" });
    },
    meetingDetails() {
      //会议详情
      this.$router.push({
        name: "f_lookMeeting",
        query: {
          look: this.id
        }
      });
    }
  }
};
</script>

<style scoped>
.taskAnswer ul {
  margin-top: 20px;
  font-size: 14px;
}
.taskAnswer ul li {
  min-height: 100px;
  padding: 20px 20px 10px 30px;
  border-radius: 5px;
  margin-top: 20px;
  position: relative;
}
.taskAnswer ul li > i {
  width: 10px;
  height: 10px;
  position: absolute;
  top: 10px;
  left: 10px;
  background: red;
  border-radius: 50%;
}
.answerContent {
  margin-top: 20px;
}
.answerContent:hover {
  cursor: pointer;
  color: red;
}
.reply {
  text-align: right;
  padding: 10px 0;
}
.reply {
  text-align: right;
  padding: 10px 0;

  /* position: relative */
}
.icon-duanxinxi {
  font-size: 25px;
  margin-top: -5px;
  float: right;
}
.reply span {
  float: right;
  /* margin-left: 5px; */
}
.button {
  margin-top: 20px;
}
</style>
