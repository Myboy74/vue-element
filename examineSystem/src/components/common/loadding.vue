<template>
    <div class="wrapper">
        <link rel='icon' href="../../../static/img/bitbug_favicon.ico" type='image/x-ico' />
        <div
            v-loading="loading"
            element-loading-text="拼命加载中"
            element-loading-spinner="el-icon-loading"
            element-loading-background="rgba(255, 255, 255)"
            style="width: 100%;height:100%">
        </div>
    </div>
</template>

<script>
import { postAjax, getAjax, uploadImg, oUrl } from "../../api/api.js";
import qs from "qs";
import axios from "axios";
export default {
  data() {
    return {
      code: "",
      loading: true,
      state: ""
    };
  },
  mounted() {
    this.code = this.getQueryVariable("code");
    this.secondLogin();
  },
  methods: {
    getQueryVariable(variable) {
      var query = window.location.search.substring(1);
      var vars = query.split("&");
      for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        if (pair[0] == variable) {
          return pair[1];
        }
      }
      return false;
    },
    secondLogin() {
      let _self = this;
      getAjax("ajax/getuser").then(res => {
        //初次登录页面时去请求getuser接口把officeId取到
        let sysOfficeId = res.data.data.sysOfficeId;
        sysOfficeId = sysOfficeId == undefined ? "" : sysOfficeId;
        sessionStorage.setItem("sysOfficeId", sysOfficeId); //在sso登录后则把user的officeId存放到cookie，
        // console.log("loadding页面")
        // console.log(res.data.data);
        let userInformation = res.data.data;
        if (sysOfficeId !== "") {
          //如果user为空则跳转sso或者login登录，如果不为空则跳转welcome页面
          sessionStorage.setItem("userId",res.data.data.id);//用户id 菜单显示
          sessionStorage.setItem("userName",res.data.data.name);  //用户名称  
          sessionStorage.setItem("userLoginTime",res.data.data.loginDate)//用户登录时间
          sessionStorage.setItem("userWork",res.data.data.sysOfficeName)//用户所属单位
          sessionStorage.setItem("userWordId",res.data.data.sysOfficeId);//用户的单位id
          _self.$router.push({ path: "/tagglePage" });
        } else {
          getAjax("ajax/loginUrl").then(res => {
            let thisFlag = _self.$route.path;
            // console.log(thisFlag);
            if (thisFlag.indexOf("login") >= 0) {
              _self.$router.push({ path: "/login" }); //如果路由是'/login'跳转至login页面
            } else {
              _self.$router.push({ path: "/sso" }); // 如果路由是'/'跳转flag页面重定向至sso
            }
          });
        }
      });
    }
  }
};
</script>
