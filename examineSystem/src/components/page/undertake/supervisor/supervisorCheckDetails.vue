<template>
    <div class="innorDetail">
        <div class="headTagLy">
            <h2 class="tag">督导检查详情</h2>
        </div>
        <div style="margin-left:40px;">
           <ul class="f_ul">
            <li>
                <span>任务名称</span>
                <div>{{form.rwbt?form.rwbt:"暂无任务名称"}}</div>
            </li>
             <li>
                <span>上传附件</span>
                <div v-if="fj.length">
                    <a v-for="(item,index) in fj" :key="index" :href="item.url" download target="_blank">{{item.fileName}}</a>
                </div>
                <div v-else>暂无附件上传</div>
            </li>
             <li>
                <span>任务内容</span>
                <div>{{form.rwnr?form.rwnr:"暂无任务内容"}}</div>
            </li>
             <li>
                <span>巡视组人员</span>
                <div>{{form.xszry?form.xszry:"暂无巡视组人员"}}</div>
            </li>
              <li>
                <span>活动时间</span>
                <div>{{form.kssj}}--{{form.jssj}}</div>
            </li>
            <li>
              <span>考核打分</span>
              <div>
                <el-table :data="form.khlist"
                     border stripe 
                     style="width: 100%; margin:0 auto;">
                        <el-table-column label="单位名称" prop="shortName" width="200">
                        </el-table-column>
                        <el-table-column  label="描述" prop="ms">
                        </el-table-column>
                        <el-table-column  label="分值" prop="tjfz">
                        </el-table-column>
                        <el-table-column label="评选人" prop="jcr">
                        </el-table-column>
                        <el-table-column label="检查时间" width="200" prop="jcsj">
                        </el-table-column>
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
    if (this.id) {
      this.autoMove(this.id);
    }
  },
  data() {
    return {
      id: this.$route.query.superDetailsId,
      fj: [], //附件
      form: {} //获取到的内容
    };
  },
  methods: {
    autoMove(id) {
      postAjax("ajax/ddjc/ddjc/ddjcxq?id=" + id).then(res => {
        if (res.status == 200) {
          //  console.log(res)
          this.form = res.data.data.ddjc;
        }
        /*******附件上传**********/

        if (this.form.fj) {
          let tempFileArray = this.form.fj.split("|");
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
.f_ul li a {
  padding: 0 20px 10px 0;
}
.f_ul li a:hover {
  color: red;
}
</style>
