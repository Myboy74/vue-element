<template>
    <div class="sidebar">
        <el-menu :default-active="onRoutes" class="" theme="dark" unique-opened router>
            <template v-for="item in items">
                <template v-if="item.sub.length">
                    <el-submenu :index="item.vueurl" v-if="item.isShow">
                        <template slot="title"><i :class="item.vueicon"></i>{{ item.mname }}</template>
                        <el-menu-item v-for="(subItem,i) in item.sub" :key="i" :index="subItem.vueurl" v-if="subItem.isShow">{{ subItem.mname }}
                        </el-menu-item>
                    </el-submenu>
                </template>
                <template v-else>
                    <el-menu-item :index="item.vueurl">
                        <i :class="item.vueicon"></i>{{ item.mname }}
                    </el-menu-item>
                </template>
            </template>
        </el-menu>
    </div>
</template>

<script>
// import qs from "qs";
import { postAjax, getAjax, uploadImg } from "../../api/api.js";
export default {
  data() {
    return {
      id: sessionStorage.getItem("userId"), //获取用户id
      items:[],
    };
  },
  created() {
    this.getallRoot();//正式地址使用
    // this.autoMove();  //测试调试使用
  },
  computed: {
    onRoutes() {
      return this.$route.path.replace("/", "");
    }
  },
  methods: {
    getallRoot() {
      // console.log(this.id);
      getAjax("ajax/index/vuemenu").then(res => {
        let allData = res.data.data;
        if (allData) {
          if (allData.sub.length) {
            // console.log(res.data.data);
            this.items = allData.sub;
          }
        }
      });
    },
    autoMove(){
      this.items=[
        {
          vueicon: "el-icon-menu",
          vueurl: "welcome",
          mname: "首页",
          isShow: "1",
          sub: []
        },
        {
          vueicon: "el-icon-edit-outline",
          vueurl: "2",
          mname: "任务交办",
          isShow: "1",
          sub: [
            {
              vueurl: "f_taskManager",
              mname: "工作管理",
              isShow: "1"
            },
            {
              vueurl: "f_meeting",
              mname: "会议管理",
              isShow: "1"
            },
            {
              vueurl: "taskAudit",
              mname: "工作审核",
              isShow: "1"
            },
            {
              vueurl: "meetingAudit",
              mname: "会议审核",
              isShow: "1"
            },
            {
              vueurl: "f_InnovationWord",
              mname: "创新工作管理",
              isShow: "1"
            },
             {
              vueurl: "f_supervisorCheck",
              mname: "督导检查管理",
              isShow: "1"
            },
              {
              vueurl: "f_debriefingComment",
              mname: "述职评议管理",
              isShow: "1"
            },
            
          ]
        },
        {
          vueicon: "el-icon-tickets",
          vueurl: "3",
          mname: "任务承办",
          isShow: "1",
          sub: [
            {
              vueurl: "taskManager",
              mname: "工作管理",
              isShow: "1"
            },
            {
              vueurl: "mettingManager",
              mname: "会议管理",
              isShow: "1"
            },
             {
              vueurl: "InnovationList",
              mname: "创新工作管理",
              isShow: "1"
            },
             {
              vueurl: "supervisorCheck",
              mname: "督导检查查询",
              isShow: "1"
            },
             {
              vueurl: "debriefingComment",
              mname: "述职评议查询",
              isShow: "1"
            },
          ]
        },
        {
          vueicon: "el-icon-view",
          vueurl: "4",
          mname: "统计分析",
          isShow: "1",
          sub: [
            {
              vueurl: "orgStatistical",
              mname: "党组织信息统计",
              isShow: "1"
            },
            {
              vueurl: "scoreList",
              mname: "得分列表",
              isShow: "1"
            },
            {
              vueurl: "taskStatistics",
              mname: "任务信息统计",
              isShow: "1"
            }
          ]
        },
        {
          vueicon: "el-icon-printer",
          vueurl: "5",
          mname: "通知管理",
          isShow: "1",
          sub: [
            {
              vueurl: "f_supervisorNotice",
              mname: "通知公告管理",
              isShow:"1"
            },
            {
              vueurl: "supervisorNotice",
              mname: "通知公告查看",
              isShow:"1"
            },
          ]
        },
         {
          vueicon: "el-icon-setting",
          vueurl: "6",
          mname: "后台设置",
          isShow: "1",
          sub: [
            {
              vueurl: "userManagement",
              mname: "用户管理",
              isShow:"1"
            },
            {
              vueurl: "organizationManagement",
              mname: "组织管理",
              isShow:"1"
            },
          ]
        }
      ]
    }
  }
};
</script>

<style scoped>
.sidebar {
  display: block;
  position: absolute;
  width: 180px;
  left: 0;
  top: 88px;
  bottom: 0;
  background: #2e363f;
}
.sidebar > ul {
  height: 100%;
}
</style>
