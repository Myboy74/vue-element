<template>
    <div class="innorDetail">
        <div class="headTagLy">
            <h2 class="tag">述职评议详情</h2>
        </div>
        <div style="margin-left:40px;">
           <ul class="f_ul">
            <li>
                <span>任务编号</span>
                <div>{{content.szpyNum?content.szpyNum:"暂无任务编号"}}</div>
            </li>
               <li>
                <span>任务名称</span>
                <div>{{content.rwbt?content.rwbt:"暂无任务名称"}}</div>
            </li>
               <li>
                <span>紧急程度</span>
                <div>{{content.jjcd}}</div>
            </li>
               <li>
                <span>任务内容</span>
                <div>{{content.rwnr?content.rwnr:"暂无任务内容"}}</div>
            </li>
             <li>
                <span>上传附件</span>
                <div v-if="fj.length">
                    <a v-for="(item,index) in fj" download :key="index" :href="item.url" target="_blank">{{item.fileName}}</a>
                </div>
                <div v-else>暂无附件上传</div>
            </li>
             <li>
                <span>开始时间</span>
                <div>{{content.kssj}}</div>
            </li>
            <li>
              <span>述职明细</span>
              <div>
                <el-table ref="multipleTable" :data="content.khlist" stripe border
                style="width: 100%;margin:0 auto; border-radius:5px;">
                <el-table-column prop="shortName" label="单位名称"></el-table-column>
                <el-table-column prop="ms" label="描述"></el-table-column> 
                <el-table-column prop="tjfz" label="分值"></el-table-column>
                <el-table-column prop="jcr" label="评选人"></el-table-column>
                <el-table-column prop="jcsj" label="述职时间" > </el-table-column>
                <el-table-column label="备注">
                  <template slot-scope="scope">
                    <label>{{scope.row.bz?scope.row.bz:"暂无备注"}}</label>
                  </template>
                </el-table-column>
            </el-table>
              </div>
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
    if(this.id){
      this.autoWord();
      this.autoMove(this.id);
    }
  },
  data() {
    return {
      id: this.$route.query.debriefingDetails,
      fj:[],//附件
      content: "", //获取到的内容
      options:[],//紧急程度
    };
  },
  methods: {
     autoWord() {
      //紧急程度
      postAjax("ajax/meeting/taskMeeting/getDict?type=taskLevel").then(res => {
        this.options = res.data;
      });
    },
    autoMove(id) {
      postAjax("ajax/szpy/szpy/szpyxq?id=" + id).then(res => {
        this.content = res.data.data.szpy;
        /*********紧急程度************/
        if(this.content.jjcd){
           this.options.forEach(element => {
          if(element.value==this.content.jjcd){
            this.content.jjcd=element.label;
          }
        });
        }
        /*******附件上传**********/ 
        if (this.content.fj) {
          let tempFileArray = this.content.fj.split("|");
          let fileBefore = localStorage.getItem("attachment");
          for (let i in tempFileArray) {
            let tempUrl = decodeURI(fileBefore + tempFileArray[i]);
            let nameArray = tempUrl.split("/");
            let finalName = nameArray.pop();
            finalName = decodeURI(finalName);
            if (tempFileArray[i] !== "") {
              this.fj.push({
                fileName: finalName,
                url: tempUrl
              });
            }
          }
        }
          
      });
    },
    returnTop() {
      //返回
      window.history.back(-1);
    },
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
.f_ul li a{
  padding: 0 20px 10px 0;
}
.f_ul li a:hover{
  color:red;
}
</style>
