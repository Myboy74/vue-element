<template>
 <div class="page">
    <div><img src="../../../static/img/left.png" alt=""></div>
    <div class="pageRight pagerightB"></div>
       <ul>
      <li>
        <p> <img src="../../../static/img/Group41.png" alt=""> </p><span>考核系统</span>
        <a :href='kh' class="btn" target="_blank">进入</a>
        <!-- <a href="localhost:8080/#/welcome" class="btn" target="_blank">进入</a> -->
      </li>
      <li>
        <p> <img src="../../../static/img/Group40.png" alt="" style="width:35px"> </p><span>数据中心</span>
        <a  class="btn" :href="sjzx" @click="onGoData" target="_blank">进入</a>
      </li>
   </ul>
 </div>

</template>
<script>
import qs from "qs";
import { postAjax, getAjax, uploadImg, postTaggle } from "../../api/api.js";
export default {
  data() {
    return {
      username: sessionStorage.getItem("userName"),
      useRLoginTime: sessionStorage.getItem("userLoginTime"),
      optionChange: sessionStorage.getItem("userWork"),
      userWordId: sessionStorage.getItem("userWordId"),
      url: localStorage.getItem("tagePage"),//跳转地址
      kh:"",//考核跳转使用
      taggleUrl:"",//数据中心地址拼接使用
      sjzx: "",//跳转数据中心使用
    };
  },
  mounted() {
    this.init();
    if(!this.url){  /*****解决有时候没有存sesstion localstion 跳转页面出现的问题******/
      //考核系统的
      let herf=window.location.href;
      let title=herf.split("/"); 
      title.pop();
      title.push("welcome");
      title=title.join("/") 
      this.kh=title;
  
      //数据中心的
      let tageUrl=herf.split("/");
      let newTage=[];
     for(let i=0; i<3;i++){
        newTage.push(tageUrl[i]);
     }
    this.taggleUrl=newTage.join("/");

    
    }else{
        this.kh=this.url+"/gzwkh/#/welcome";
    }
   
  },
  methods: {
    init() {
      // 转译一下用户信息
      postTaggle(
        "statistic/orgStatisticGraph/" + this.userWordId + "?isCenterCom=" + 0
      ).then(res => {
        if (res.data.code == "401") {
          this.sjzx = "javascript:onGoData";
        } else {
          let user = this.encodeUnicode(this.username);
          let time = this.encodeUnicode(this.useRLoginTime);
          let word = this.encodeUnicode(this.optionChange);
          let wordId = this.encodeUnicode(this.userWordId);
          let tageUrl="";
          if(this.url){
            tageUrl=this.url;
          }else{
            tageUrl=this.taggleUrl;
          }
          this.sjzx =
            tageUrl +
            "/#/partyCompany?user=" +
            user +
            "&time=" +
            time +
            "&word=" +
            word +
            "&wordId=" +
            wordId;

          // window.open (
          //   "http://192.168.103.190:8084/#/partyCompany?user=" +
          //   user +
          //   "&time=" +
          //   time +
          //   "&word=" +
          //   word +
          //   "&wordId=" +
          //   wordId);
        }
      });
    },
    onGoData() {
      this.$message({
        message: "您暂无权限进入数据中心",
        type: "warning"
      });
    },
    encodeUnicode(str) {
      var res = [];
      for (var i = 0; i < str.length; i++) {
        res[i] = ("00" + str.charCodeAt(i).toString(16)).slice(-4);
      }
      return "\\u" + res.join("\\u");
    }
  }
};
</script>
<style scoped>
.page {
  width: 80%;
  height: 350px;
  /* height: calc(100% - 450px); */
  margin: 50px auto;
  /* background: #D91E18; */
  border-radius: 10px;
  position: relative;
}
.page > div {
  width: 50%;
  height: 100%;
  float: left;
}
.page > div img {
  width: 100%;
  height: 100%;
}
.page .pageRight {
  width: 50%;
  height: 100%;
  background: url(../../../static/img/tabRightb1.png),
    url(../../../static/img/tabrightb.png);
}
.page .pagerightB {
  width: 50%;
  height: 100%;
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  -webkit-filter: blur(3px);
  -moz-filter: blur(3px);
  -o-filter: blur(3px);
  -ms-filter: blur(3px);
  filter: blur(3px);
}
.page ul {
  width: 50%;
  height: 100%;
  position: absolute;
  top: 0;
  right: 0;
  z-index: 999;
}

.page ul li {
  width: 90%;
  height: 30%;
  margin: 8% 0 0 5%;
  background: white;
  position: relative;
  border-radius: 10px;
}
.page ul li > p {
  width: 18%;
  height: 50%;
  position: absolute;
  top: 25%;
  left: 0;
  border-right: 1px dashed red;
  padding: 0 10px;
  box-sizing: border-box;
}
.page ul li > p img {
  margin-top: 10%;
  width: 40px;
  height: 45px;
  display: block;
  margin-left: 24%;
}
span {
  display: block;
  color: red;
  position: absolute;
  top: 40%;
  left: 22%;
  font-size: 18px;
}
.btn {
  padding: 10px 60px;
  text-align: center;
  background: #e61010;
  border-radius: 5px;
  color: white;
  cursor: pointer;
  position: absolute;
  top: 30%;
  right: 10%;
}
.btn:hover {
  background: #9e0f0f;
}
</style>
