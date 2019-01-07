<template>
    <div class="innorDetail">
        <div class="headTagLy">
            <h2 class="tag">创新工作管理</h2>
        </div>
        <div style="margin-left:40px;">
           <ul class="f_ul">
            <li>
                <span>任务编号</span>
                <div>{{content.rwNum?content.rwNum:"暂无任务编号"}}</div>
            </li>
               <li>
                <span>任务名称</span>
                <div>{{content.rwmc?content.rwmc:"暂无任务名称"}}</div>
            </li>
               <li>
                <span>任务时间</span>
                <div>{{content.rwkssj?content.rwkssj:"暂无任务时间"}}</div>
            </li>
               <li>
                <span>任务内容</span>
                <div>{{content.rwnr?content.rwnr:"暂无任务内容"}}</div>
            </li>
             <li>
                <span>上传附件</span>
                <div class="uploadfile">
                    <p v-if="!fileName.length">暂无上传文件</p>
                    <a v-else v-for="(item,index) in fileName" :key="index" :href="item.url" target="_blank" download>{{item.name}}</a>
                </div>
            </li>
             <li>
                <span>考核结果</span>
                <div v-if="content.zt=='1'">已通过</div>
                <div v-else-if="content.zt=='2'">未通过</div>
                <div v-else>未审核</div> 
              </li>
             <li>
                <span>考核分值</span>
                <div>{{content.khfz?content.khfz:"0"}}</div>
            </li>
             <li>
                <span>考核评价</span>
                <div>{{content.khpj?content.khpj:"暂无评价"}}</div>
            </li>
        </ul>
        <div class="button clear">
            <button class="f_btn" style="color:#000" @click="returnTop">返回</button>
        </div>
        </div>
        
    </div>
</template>

<script>
import qs from "qs";
import { postAjax, getAjax, uploadImg } from "../../../../api/api.js";
export default {
  created() {
    this.autoMove(this.id);
  },
  data() {
    return {
      attachmentUrl: localStorage.getItem("attachment"), //上传文件得下载（预览）路径
      id: this.$route.query.id,
      content: "", //获取到的内容
      fileName: [] //附件
    };
  },
  methods: {
    autoMove(id) {
      postAjax("ajax/cxgzrw/cxgzrw/cxshxq?id=" + id).then(res => {
        if (res.data.state == 1) {
          this.content = res.data.data;
          let fileUpload = this.content.fj;
          if (fileUpload) {
            if (!fileUpload.indexOf("|")) {
              fileUpload = fileUpload.slice(1);
            }
            let arr = fileUpload.split("|");
            arr.forEach((element,ind) => {
              //获取文件名称
              var index = element.lastIndexOf("/");
              element = element.substring(index + 1, element.length);
              element = decodeURI(element);
              this.fileName.push({
                name: element,
                url: this.attachmentUrl+arr[ind]
              });
            });
            // console.log(this.fileName);
          }
        }
      });
    },
    returnTop() {
      //返回
      window.history.back(-1);
    }
  }
};
</script>

<style scoped>
.f_ul {
  padding: 20px 0 20px 0;
  /* border-bottom: 1px solid #d9d9d9; */
}
.f_ul li {
  width: 100%;
  margin: 20px 0;
  font-size: 14px;
}
.f_ul li span {
  width: 80px;
  display: block;
  float: left;
  color: #353639;
}
.f_ul li div {
  min-height: 20px;
  margin-left: 80px;
  color: #898a8f;
}
.uploadfile a{
    /* display: block; */
    padding: 0 10px 10px 0;
}
.uploadfile a:hover{
    color:red;
}
</style>
