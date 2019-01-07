<template>
    <div class="newUser">
        <div class="account shadowLy">
            <div class="left-panel-title">
                <span>组织机构</span>
            </div>
            <el-form ref="form" :model="form" label-width="80px" style="margin:20px">
                <el-form-item label="附属企业">
                    <el-input v-model="wordObj.shortName" disabled class="affilPadd"></el-input>
                </el-form-item>
                <el-form-item label="姓名" prop="name" class="affiliated">
                    <el-input :disabled="form.userType=='2'" v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="登录名" prop="loginName" class="affiliated">
                    <el-input :disabled="form.userType=='2'" v-model="form.loginName" @change="EditloginName(form.id,form.loginName)"></el-input>
                    <span style="color:red;" class="warning-info">{{yanzhengUser}}</span>
                </el-form-item>
                <el-form-item label="密码" prop="newPassword" class="l10">
                    <el-input type="password" :disabled="form.userType=='2'" v-model="form.newPassword" class="affilPadd"></el-input>
                </el-form-item>
                <div v-if="form.newPassword!==''">
                    <el-form-item label="确认密码" prop="confirmPasssWord" class="l10">
                        <el-input type="password" :disabled="form.userType=='2'" v-model="form.confirmPasssWord" class="affilPadd"></el-input>
                    </el-form-item>
                </div>
                <el-form-item label="邮箱" prop="email" class="l10">
                    <el-input v-model="form.email" class="affilPadd"></el-input>
                </el-form-item>
                <el-form-item label="电话" prop="phone" class="l10">
                    <el-input v-model="form.phone" class="affilPadd"></el-input>
                </el-form-item>
                <el-form-item label="手机" prop="mobile" class="l10">
                    <el-input v-model="form.mobile" class="affilPadd"></el-input>
                </el-form-item>
                <el-form-item label="备注" prop="remarks" class="l10">
                    <el-input type="textarea" v-model="form.remarks" class="affilPadd"></el-input>
                </el-form-item>
            </el-form>
            <div class="button">
                <input type="button" class="f_btn f_deepBlue" @click="submitForm" value="保存">
                <input type="button" value="返回" class="f_btn" style="color:#000;margin-left:20px" @click="onReturn">
            </div>
        </div>
    </div>
</template>

<script>
import qs from "qs";
import { postAjax, getAjax } from "../../../api/api.js";

export default {
  created() {
    this.form.shortName = sessionStorage.getItem("userManageName");
    this.form.id == sessionStorage.getItem("userManageId");
  },
  data() {
    return {
      userId: "", //修改得到的用户企业id
      wordObj: {}, //保存附属企业的名及id
      form: {
        name: "", //姓名
        loginName: "", //登录名
        newPassword: "", //密码
        confirmPasssWord: "", //确认密码
        email: "", //邮箱
        mobile: "", //手机
        remarks: "" //备注
      },
      oldName: "", //修改登录名时使用
      yanzhengUser: "" //验证用户名是否存在提示
    };
  },
  methods: {
    setWord(val) {
      this.wordObj.shortName = val.name;
      this.wordObj.id = val.id;
    },
    auto() {
      let id = sessionStorage.getItem("editUserInformation");
      this.autoMove(id);
    },
    autoMove(id) {
      // 修改状态查询用户信息
      // console.log(id);
      this.form = {};
      postAjax("ajax/user/sysUser/form?id=" + id).then(res => {
        if (res.status == 200) {
          this.form = res.data.data.user;
          this.oldName = this.form.loginName; //保存一下原先的登录名,当修改了的话做判断
          this.userId = res.data.data.user.sysOffice.id;
        }
      });
    },
    submitForm() {
      //保存之前的验证
      if (this.form.userType != "2") {
        //只有不等于2才修改,等于2即使是空的也不可填,修改
        if (!this.form.name) {
          //姓名
          this.$message({
            message: "请填写姓名",
            type: "warning"
          });
          return;
        }
        if (!this.form.loginName) {
          //登录名
          this.$message({
            message: "请填写登录名",
            type: "warning"
          });
          return;
        }
        if (this.form.newPassword) {
          //密码
          if (!this.form.confirmPasssWord) {
            //确认密码
            this.$message({
              message: "请填写确认密码",
              type: "warning"
            });
            return;
            if (this.form.newPassword != this.form.confirmPasssWord) {
              this.$message({
                message: "两次密码输入不一致,请重新填写",
                type: "warning"
              });
              return;
            }
          }
          //密码长度不允许少于6位数
          if (this.form.newPassword.length < 6) {
            //长度不允许少于6位数
            this.$message({
              message: "密码长度不能少于6位数，请重新输入",
              type: "warning"
            });
            return;
          }
          //密码长度不允许少于6位数
          if (this.form.confirmPasssWord.length < 6) {
            //长度不允许少于6位数
            this.$message({
              message: "密码长度不能少于6位数，请重新输入",
              type: "warning"
            });
            return;
          }
        }
      }
      if (this.form.remarks) {
        //备注
        if (this.form.remarks.length > 1000) {
          this.$message({
            message: "内容不得超过1000字符",
            type: "warning"
          });
          return;
        }
      }
      if (this.form.name) {
        let res = /^[\u4e00-\u9fa5]+$/gi;
        if (!res.test(this.form.name)) {
          this.$message({
            message: "姓名请输入汉字",
            type: "warning"
          });
          return;
        }
      }
      if (this.form.loginName) {
        let res = /^[A-Za-z0-9]+$/gi;
        if (!res.test(this.form.loginName)) {
          this.$message({
            message: "登录名请输入字母或数字",
            type: "warning"
          });
          return;
        }
      }

      this.office();
    },
    //判断登录名是否存在
    EditloginName(val, name) {
      postAjax(
        "ajax/user/sysUser/checkUserLoginName_New?id=" +
          val +
          "&loginName=" +
          name
      ).then(res => {
        this.yanzhengUser = res.data.message;
      });
    },
    office() {
      //修改
      let obj = {
        id: this.form.id,
        name: this.form.name, //姓名
        loginName: this.form.loginName, //登录名
        oldLoginName: this.form.loginName, //旧得登录名
        "office.sysOfficeId": this.userId, //企业单位id
        "office.shortName": this.wordObj.shortName, //企业单位名称
        email: this.form.email, //	邮箱
        phone: this.form.phone, //电话
        mobile: this.form.mobile, //	手机
        newPassword: this.form.newPassword ? this.form.newPassword : "", //新密码
        confirmNewPassword: this.form.confirmPasssWord
          ? this.form.confirmPasssWord
          : "", //确认密码
        remarks: this.form.remarks, //备注
        userType: this.form.userType
      };
      let date = qs.stringify(obj);
      postAjax("ajax/user/sysUser/savenew", date).then(res => {
        if (res.data.state == 1) {
          this.$message({
            message: res.data.message,
            type: "success"
          });
          this.$emit("newTask", 1); //传给父级保存了刷新一下数据
          this.$emit("tabUserTable", "0");
        } else {
          /*********测试一下有误  *****/
          this.$message.error(res.data.message);
        }
      });
    },
    onReturn() {
      //返回
      this.$emit("tabUserTable", "0");
      this.$emit("newTask", 1); //传给父级保存了刷新一下数据
    }
  }
};
</script>

<style scoped>
.affiliated > .warning-info {
  color: red;
}

.account {
  width: 99%;
  margin: 10px auto;
  box-sizing: border-box;
  border-radius: 5px;
  padding-bottom: 20px;
}

.button {
  margin-left: 50px;
}

.el-input {
  width: 280px;
}

.enterise {
  margin-left: -10px;
}

.enterise::after {
  content: "";
  width: 40px;
  height: 100%;
  border-top-right-radius: 5px;
  border-bottom-right-radius: 5px;
  position: absolute;
  top: 0;
  right: 0;
  cursor: pointer;
  background: #cccc;
}

.el-icon-search {
  position: absolute;
  top: 0;
  left: 0;
}

.affiliated {
  padding-left: 10px;
  position: relative;
}

.affiliated::after {
  content: "*";
  color: #f56c6c;
  position: absolute;
  top: 10px;
  left: 0;
}

.affilPadd {
  padding-left: 10px;
}
</style>
