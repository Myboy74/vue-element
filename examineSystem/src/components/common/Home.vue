<template>
    <div class="wrapper">
        <link rel='icon' href="../../../static/img/bitbug_favicon.ico" type='image/x-ico' />
        <v-head :isShow="isTaggle"></v-head>
        <v-taggle v-if="isTaggle"></v-taggle>  
        <v-sidebar v-else></v-sidebar>
         <v-bottom v-if="isTaggle"></v-bottom>
        <div class="content" v-else>
            <transition name="move" mode="out-in"><router-view></router-view></transition>
        </div>
       
    </div>
</template>

<script>
import vHead from "./Header.vue";
import vSidebar from "./Sidebar.vue";
import vBottom from "./bottom.vue";
import vTaggle from "../page/tagglePage.vue";
export default {
  created() {
    let name = this.$route.name;
    if (name == "tagglePage") {
      this.isTaggle = true;
    } else {
      this.isTaggle = false;
    }
  },
  data() {
    return {
      isTaggle:true
    };
  },
  components: {
    vHead,
    vSidebar,
    vTaggle,
    vBottom
  },
  watch: {
    //监听路由变化
    $route(to, from) {
      if (to.name == "tagglePage") {
        this.isTaggle = true;
      } else {
        this.isTaggle = false;
      }
    }
  }
};
</script>
