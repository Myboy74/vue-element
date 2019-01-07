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
                <div v-if="fj.length">
                    <a v-for="(item,index) in fj" :key="index" :href="item.url" target="_blank">{{item.fileName}}</a>
                </div>
                <div v-else>暂无附件上传</div>
            </li>
        </ul>
        <div style="margin:20px 0;">
            <el-form ref="form" :model="form">
                <el-form-item label="考核结果"  class="cle">
                    <el-radio-group v-model="form.zt" style="margin-left:20px">
                        <el-radio label="1">通过</el-radio>
                        <el-radio label="2">不通过</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="考核分值" >
                    <el-input v-model="form.khfz" type="number" placeholder="请输入考核分值"></el-input>
                </el-form-item>
                <el-form-item label="考核评价">
                    <el-input type="textarea" v-model="form.khpj" placeholder="请输入考核评价"></el-input>
                </el-form-item>
         </el-form> 
        </div>
        <div class="button clear">
            <button class="f_btn f_green" :plain="true" @click="saveSubDetail">保存</button>
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
    if (this.id) {
      this.autoMove(this.id);
    }
  },
  data() {
    return {
      id: this.$route.query.id,
      fj: [], //附件
      form: {
        id: "",
        zt: "1", //考核结果
        khfz: "", //考核分值
        khpj: "", //考核评价
        flag: "1" //操作标识 1、表示交办方审核保存
      },
      content: "", //获取到的内容
      addChildTable:true,//验证审核的是否符合条件
    };
  },
  methods: {
    autoMove(id) {
      postAjax("ajax/cxgzrw/cxgzrw/cxshxq?id=" + id).then(res => {
        // console.log(res)
        this.content = res.data.data;
        this.form = {
          id: this.content.id,
          zt: this.content.zt != "0" ? this.content.zt : "1",
          khfz: this.content.khfz,
          khpj: this.content.khpj,
          flag: "1" //操作标识 1、表示交办方审核保存
        };
        /*******附件上传**********/

        if (this.content.fj) {
          let tempFileArray = this.content.fj.split("|");
          let fileBefore = localStorage.getItem("attachment");
          for (let i in tempFileArray) {
            let tempUrl = decodeURI(fileBefore + tempFileArray[i]);
            let nameArray = tempUrl.split("/");
            let finalName = nameArray.pop();
            finalName = decodeURI(finalName);
            // console.log(finalName);
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
     verifyLen(val) {
      //验证字符长度
      var len = 0;
      for (var i = 0; i < val.length; i++) {
        var a = val.charAt(i);
        if (a.match(/[^\x00-\xff]/gi) != null) {
          len += 2;
        } else {
          len += 1;
        }
      }
      return len;
    },
    verifyContent() {
      //验证需要验证的内容长度
      this.addChildTable = true;
      let maxrwbt = 1000;//任务内容
      let currlen = maxrwbt - this.verifyLen(this.form.khpj);
      if (currlen < 0) {
        this.$message({
          message: "考核评价字符不得超过1000!!!",
          type: "warning"
        });
        this.addChildTable = false;
        return false;
      }
    },
    saveSubDetail() {
      //保存
      if (!this.form.khfz) {
        this.$message({
          message: "请输入考核分值",
          type: "warning"
        });
        return;
      }
      if (!this.form.khpj) {
        this.$message({
          message: "请输入考核评价",
          type: "warning"
        });
        return;
      }

      if (this.form.khfz) { 
        // let numLen=Number(this.form.khfz);
          let num = this.form.khfz.indexOf(".");
          if (num) {
            //如果是小数
            let len = this.form.khfz.split(".")[1];
            if (len.length > 2) {
              this.$message({
                message: "请提交2位小数以内分数!!!",
                type: "warning"
              });
              return false;
            }
          }
      }
      this.verifyContent();
      if(!this.addChildTable){
        return;
      }
 
      let data = qs.stringify(this.form);
      postAjax("ajax/cxgzrw/cxgzrw/save", data).then(res => {
        // console.log(res);
        if (res.data.state == 1) {
          this.$message({
            message: res.data.message,
            type: "success"
          });
          this.$router.push({ name: "f_InnovationWord" });
        } else {
          this.$message.error(res.data.message);
        }
      });
    }
  }
};
</script>

<style scoped>
.f_ul {
  padding: 20px 0 20px 0;
  border-bottom: 1px solid #d9d9d9;
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
.f_ul li a {
  padding: 0 20px 10px 0;
}
.f_ul li a:hover {
  color: red;
}
</style>
