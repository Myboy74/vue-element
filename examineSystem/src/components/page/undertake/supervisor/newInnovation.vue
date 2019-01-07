<template>
    <div>
      <div class="headTagLy ">
        <h2 class="tag">新建创新工作</h2>
      </div>
      <div class="shadowLy create newTask">
        <el-form :rules="rules" ref="form" :model="form" label-width="80px">
          <div>
            <el-form-item label="任务名称" prop="rwmc">
              <el-input v-model="form.rwmc" class="wid" placeholder="请输入任务名称" style="margin-top:10px"></el-input>
            </el-form-item>
          </div>
            <div>
            <el-form-item label="任务时间" prop="rwkssj">
              <el-date-picker
               class="wid"
                v-model="form.rwkssj"
                type="datetime"
                placeholder="选择日期"
                  value-format="yyyy-MM-dd HH:mm:ss"
                style="margin-top:10px;margin-left:0">
              </el-date-picker>
            </el-form-item>
          </div>
          <!-- 文件上传 -->
         <fileUpload @fileAddress="uploadAdres" @fileSuccess="uploadSuccess"></fileUpload>
        <div>
            <el-form-item label="任务内容" prop="rwnr">
              <el-input type="textarea" style="width:350px;margin-top:10px" v-model="form.rwnr" placeholder="请输入任务描述"></el-input>
            </el-form-item>
        </div>
      </el-form>
      <div class="botton">
         <el-button type="success" class="f_btn f_green"  @click="onBtn('form')">发布</el-button>
          <!-- <input type="text" value="发布" :disabled="lock" class="f_btn f_green" @click="onBtn('form')"> -->
          <button class="f_btn" style="color:#000;margin-left:10px" @click="retunIndex">返回</button>
      </div>
    </div>
  </div>
</template>

<script>
import qs from "qs";
import { postAjax, getAjax, oUrl, uploadImg } from "../../../../api/api.js";
import fileUpload from "../../common/fileUpload.vue";
export default {
  components: {
    fileUpload
  },
  data() {
    return {
      uploadAdres: "?uploadPath=innovation", //上传文件的地址
      attachmentUrl: localStorage.getItem("attachment"), //上传文件得下载（预览）路径
      form: {
        id: "", //交办方审核保存、修改保存时需要传的主键值
        rwmc: "", //任务名称
        rwnr: "", //创新工作任务内容
        rwkssj: "", //	创新工作任务时间
        fj: "", //附件地址
        flag: 2 //1表示交办方审核保存、2表示承办方添加保存和修改保存
      },
      addChildTable: true, //用于验证通过不通过
      rules: {
        rwmc: [
          {
            required: true,
            message: "请输入任务名称",
            trigger: ["blur", "change"]
          }
        ],
        rwkssj: [
          {
            required: true,
            message: "请输入任务时间",
            trigger: ["blur", "change"]
          }
        ],
        rwnr: [
          {
            required: true,
            message: "请输入任务描述",
            trigger: ["blur", "change"]
          }
        ]
      }
    };
  },
  methods: {
    uploadSuccess(val) {
      //上传文件的信息
      let str = "";
      val.forEach(element => {
        str += element.url + "|";
      });
      this.form.fj = str;
    },
    onBtn(formName) {
      //保存之前的验证
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.verifyContent();
          if (this.addChildTable) {
            this.correct(); //通过验证则保存
          }
          //如果通过验证 to do...
        } else {
          this.$message({
            message: "您填的信息有误,请进行核实后再保存!!!",
            type: "warning"
          });
          // 'console.log('error submit!!')
          return false;
        }
      });
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
      let maxChars = 200; //任务名称
      let curr = maxChars - this.verifyLen(this.form.rwmc);
      if (curr < 0) {
        this.$message({
          message: "任务名称字符不得超过200!!!",
          type: "warning"
        });
        this.addChildTable = false;
        return false;
      }
      let maxrwbt = 1000; //任务内容
      let currlen = maxrwbt - this.verifyLen(this.form.rwnr);
      if (currlen < 0) {
        this.$message({
          message: "任务内容字符不得超过1000!!!",
          type: "warning"
        });
        this.addChildTable = false;
        return false;
      }
    },
    correct() {
      //发布
      let obj = qs.stringify(this.form);
      postAjax("ajax/cxgzrw/cxgzrw/save", obj).then(res => {
        if (res.data.state == 1) {
          this.$message({
            message: res.data.message,
            type: "success"
          });
          this.$router.push({
            name: "InnovationList"
          });
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    retunIndex() {
      //返回
      window.history.go(-1);
    }
  }
};
</script>

<style scoped>
.create {
  padding: 10px;
  margin-top: 10px;
  font-size: 14px;
}
.create div label {
  margin-left: 20px;
}

.wid {
  width: 230px;
}

.create .ui-selectmenu-button.ui-button {
  height: 25px !important;
  margin-left: 10px;
}

.create .ui-selectmenu-text {
  margin-top: 5px;
}

.create .ui-selectmenu-icon.ui-icon {
  margin-top: 3px;
}

.create div input.scoreInput {
  width: 45px;
  margin: 10px 25px;
  padding-left: 0;
  text-align: center;
}

.copyUnit {
  margin: 10px 15px 0;
}

.create .childTable {
  text-align: center;
}

.create .childTable p {
  border: 1px solid black;
  border-bottom: none;
  color: black;
  margin: 20px 0 0 0;
  padding: 10px 0;
  font-weight: bold;
  background: #3dadf2;
}

.create .button {
  height: 30px;
  margin: 20px auto;
}

.create .button button {
  border: none;
  float: left;
  margin-right: 30px;
  padding: 10px 30px;
  border-radius: 5px;
  /* color: white; */
}

.create .button button:last-child:hover {
  background: #e6e0e0;
}

.create div.topScore {
  margin-left: 90px;
  border: 1px solid #cccccc;
  border-radius: 5px;
}

.topScore p span {
  display: inline-block;
  padding: 5px 56px;
}

.topScore p span.total {
  display: block;
  float: right;
  padding: 0;
  margin: 18px 42px 0 0;
}

.topScore p span + span {
  border-left: 1px solid #cccccc;
}

.iconfont {
  margin-left: -25px;
}

.create div.copyScore,
.create div.chlidTable {
  margin-left: 90px;
}

.copyScore .el-tag,
.choiceWork .el-tag {
  background: #e7eaf9 !important;
  color: #5c74d8 !important;
  border: none !important;
  margin: 0 10px 10px 0;
}

.choiceWork .el-tag {
  background: #ffecd9 !important;
  color: #ff7e00 !important;
}

.el-date-editor.el-input {
  margin-left: 12px;
}

.dict-tree-list > .el-tree {
  width: 228px !important;
}

.dict-tree-list > .el-tree .el-tree-node__content {
  width: 49% !important;
  text-align: left !important;
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
.botton {
  margin-left: 20px;
}
.f_btn {
  width: 80px;
  text-align: center;
  padding: 10px 0;
}
</style>
