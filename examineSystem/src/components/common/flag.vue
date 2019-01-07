<template>
    
</template>

<script>
export default {
   mounted(){
       this.ssoLogin();
   },
   methods:{
       ssoLogin(){
           let thisUrl = localStorage.getItem("url");
           window.location.href = thisUrl + "ajax/login";//跳转sso登录页面
           //window.location.href = thisUrl + "ajax/login";
       }
   }
}
</script>

<style scoped>

</style>
