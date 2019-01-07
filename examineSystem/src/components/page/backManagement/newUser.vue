<template>
    <div class="newUser">
        <div class="account shadowLy">
            <div class="left-panel-title">
                <span>组织机构</span>
            </div>
             <el-form ref="form" :model="form" label-width="80px" style="margin:20px">
                <el-form-item label="附属企业" class="affiliated">
                    <el-input v-model="form.shortName" disabled></el-input>
                </el-form-item>
                 <el-form-item label="姓名" class="affiliated">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="登录名"  class="affiliated">
                    <el-input v-model="form.loginName" @blur="nameSore"></el-input>
                </el-form-item>
                <el-form-item label="密码"  class="affiliated">
                    <el-input type="password" v-model="form.newPassword"></el-input>
                </el-form-item>
                <el-form-item label="确认密码" class="affiliated">
                    <el-input type="password" v-model="form.confirmPasssWord"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" class="l10">
                    <el-input v-model="form.email" class="affilPadd"></el-input>
                </el-form-item>
                 <el-form-item label="电话" class="l10">
                    <el-input v-model="form.phone" class="affilPadd"></el-input>
                </el-form-item>
                 <el-form-item label="手机"  class="l10">
                    <el-input v-model="form.mobile" class="affilPadd"></el-input>
                </el-form-item>
                <el-form-item label="备注" class="l10 ">
                    <el-input type="textarea" v-model="form.remarks" class="affilPadd"></el-input>
                </el-form-item>
            </el-form>
            <div class="button">
                <input type="button" class="f_btn f_deepBlue" @click="submitForm"  value="保存">
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
      form: {
        shortName: sessionStorage.getItem("userManageName"), //附属企业
        id: sessionStorage.getItem("userManageId"),
        name: "", //姓名
        loginName: "", //登录名
        newPassword: "", //密码
        confirmPasssWord: "", //确认密码
        email: "", //邮箱
        mobile: "", //手机
        remarks: "" //备注
      }
      // rules: {
      //   name: [
      //     {
      //       required: true,
      //       message: "请输入姓名",
      //       trigger: ["blur", "change"]
      //     }
      //   ],
      //   loginName: [
      //     {
      //       required: true,
      //       message: "请输入登录名",
      //       trigger: ["blur", "change"]
      //     }
      //   ],
      //   newPassword: [
      //     {
      //       required: true,
      //       message: "请输入密码",
      //       trigger: ["blur", "change"]
      //     }
      //   ],
      //   confirmPasssWord: [
      //     {
      //       required: true,
      //       message: "请输入确认密码",
      //       trigger: ["blur", "change"]
      //     }
      //   ],
      //   email: [
      //     {
      //       pattern: /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/,
      //       message: "请输入正确的邮箱(正确格式:contact@cnblogs.com)",
      //       trigger: ["blur", "change"]
      //     }
      //   ],
      //   phone: [
      //     {
      //       pattern: /^(\(\d{3,4}\)|\d{3,4}-)?\d{7,8}$/,
      //       message: "请输入正确的电话号码(正确格式:XXXX-XXXXXXX)",
      //       trigger: ["blur", "change"]
      //     }
      //   ],
      //   mobile: [
      //     // {
      //     // message: "请输入正确的手机号码",
      //     // trigger: ["blur", "change"]
      //     // },
      //     {
      //       pattern: /^1\d{10}$/,
      //       message: "请输入正确的手机号码",
      //       trigger: ["blur", "change"]
      //     }
      //   ]
      // }
    };
  },
  methods: {
    setWord(val) {
      this.form.shortName = val.name;
      this.form.id = val.id;
    },
    nameSore(val) {
      //判断登录名是否已存在
      // console.log(val.target.value);
      postAjax(
        "ajax/user/sysUser/checkLoginName?loginName=" + val.target.value
      ).then(res => {
        // console.log(res);
        if (!res.data) {
          this.$message({
            message: "用户名已存在,请重新输入登录名",
            type: "warning"
          });
        }
      });
    },
    submitForm() {
      //保存之前的验证
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
      if (!this.form.newPassword) {
        //密码
        this.$message({
          message: "请填写密码",
          type: "warning"
        });
        return;
      }
      if (!this.form.confirmPasssWord) {
        //确认密码
        this.$message({
          message: "请填写确认密码",
          type: "warning"
        });
        return;
      }
      if (this.form.newPassword != this.form.confirmPasssWord) {
        this.$message({
          message: "两次密码输入不一致,请重新填写",
          type: "warning"
        });
        return;
      }
      if (this.form.remarks) {
        //备注
        if (this.form.remarks.length > 1000) {
          this.$message({
            message: "备注内容不得超过1000字符",
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
      this.office(); //通过验证则保存
    },
    office() {
      //保存
      let obj = {
        name: this.form.name, //姓名
        loginName: this.form.loginName, //登录名
        "office.shortName": this.form.shortName, //企业单位名称
        "office.sysOfficeId": this.form.id,
        shortName: this.form.shortName, //企业单位名称
        email: this.form.email, //	邮箱
        phone: this.form.phone, //电话
        mobile: this.form.mobile, //	手机
        newPassword: this.form.newPassword, //新密码
        confirmNewPassword: this.form.confirmPasssWord, //确认密码
        remarks: this.form.remarks, //备注
        userType: "1"
      };
      let date = qs.stringify(obj);
      postAjax("ajax/user/sysUser/savenew", date).then(res => {
        // console.log(res)
        if (res.data.state == 1) {
          this.$message({
            message: res.data.message,
            type: "success"
          });
          this.form = {
            name: "", //姓名
            loginName: "", //登录名
            "office.shortName": this.form.shortName, //企业单位名称
            "office.sysOfficeId": this.form.id,
            shortName: this.form.shortName, //企业单位名称
            email: "", //	邮箱
            phone:"", //电话
            mobile: "", //	手机
            newPassword:"", //新密码
            confirmNewPassword:"", //确认密码
            remarks:"", //备注
            userType: "1"
          },
            this.$emit("newTask", 1); //传给父级保存了刷新一下数据
          this.$emit("tabUserTable", "0"); //切换到表格页面
        } else {
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
