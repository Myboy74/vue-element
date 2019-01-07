import Vue from 'vue';
import Router from 'vue-router';
import axios from 'axios';
Vue.use(Router);
// const routers=new Router({
const routers = new Router({
    routes: [
        // {
        //     path: '/',
        //     redirect: 'home',
        // },
        // {

        //     path: '/',
        //     component: resolve => require(['../components/common/loadding.vue'], resolve)
        // },
        {

            path: '/',
            meta:{
                title: "督查考核系统"
            },
            component: resolve => require(['../components/common/loadding.vue'], resolve)
        },
        {
            path: '/login',
            name: 'login',
            meta:{
                title: "督查考核系统"
            },
            component: resolve => require(['../components/page/Login.vue'], resolve)
        },
        {
            path: '/sso',
            name:"sso",
            meta:{
                title: "督查考核系统"
            },
            component: resolve => require(['../components/common/flag.vue'], resolve)
        },

        // {

        //     path: '/logout',
        //     component: resolve => require(['../components/common/logout.vue'], resolve)
        // },
      
        {
            path: '/home',
            // redirect:'welcome',
            name: 'home',
            meta:{
                title: "督查考核系统"
            },
            component: resolve => require(['../components/common/Home.vue'], resolve),
            children: [
                {
                    path: '/tagglePage',
                    name: 'tagglePage', //考核系统与信息中心切换页
                    meta:{
                        title: "山东省属企业委智慧党建平台"
                    },
                    component: resolve => require(['../components/page/tagglePage.vue'], resolve)
                },
                {
                    path: '/welcome', //首页
                    name: 'welcome',
                    meta:{
                        title: "督查考核系统"
                    },
                    component: resolve => require(['../components/page/assign/welcome.vue'], resolve)
                },
                {
                    path: '/f_taskManager', //任务交办  任务管理--首页
                    name: 'f_taskManager',
                    meta:{
                        title: "督查考核系统"
                    },
                    component: resolve => require(['../components/page/assign/taskManager.vue'], resolve)

                },
                {
                    path: '/f_newTask', //任务交办  任务管理--新建任务
                    name: 'f_newTask',
                    meta:{
                        title: "督查考核系统"
                    },
                    component: resolve => require(['../components/page/assign/taskManger/newTask.vue'], resolve)

                },
                {
                    path: '/f_taskDetails', //任务交办  任务管理--任务详情
                    name: 'f_taskDetails',
                    meta:{
                        title: "督查考核系统"
                    },
                    component: resolve => require(['../components/page/assign/taskManger/taskDetails.vue'], resolve)

                },
                {
                    path: '/f_childTaskDetails', //任务交办  任务管理--子任务详情
                    name: 'f_childTaskDetails',
                    meta:{
                        title: "督查考核系统"
                    },
                    component: resolve => require(['../components/page/assign/taskManger/childTaskDetails.vue'], resolve)

                },
                {
                    path: '/f_taskAnswer', //任务交办  任务管理--任务答疑
                    name: 'f_taskAnswer',
                    meta:{
                        title: "督查考核系统"
                    },
                    component: resolve => require(['../components/page/assign/taskManger/taskAnswer.vue'], resolve)

                },
                {
                    path: '/f_replyquestion', //任务交办  任务答疑--追问未回复
                    name: 'f_replyquestion',
                    meta:{
                        title: "督查考核系统"
                    },
                    component: resolve => require(['../components/page/assign/taskManger/taskanswer/replyquestion.vue'], resolve)

                },
                {
                    path: '/f_problemResponse', //任务交办  任务答疑--问题回复
                    name: 'f_problemResponse',
                    meta:{
                        title: "督查考核系统"
                    },
                    component: resolve => require(['../components/page/assign/taskManger/taskanswer/problemResponse.vue'], resolve)

                },
                {
                    path: '/f_lowerNumber', //任务交办  任务管理--下发数量详情
                    name: 'f_lowerNumber',
                    meta:{
                        title: "督查考核系统"
                    },
                    component: resolve => require(['../components/page/assign/taskManger/lowerNumber.vue'], resolve)
                },
                {
                    path: '/f_receiveNumber', //任务交办  任务管理--接收数量详情
                    name: 'f_receiveNumber',
                    meta:{
                        title: "督查考核系统"
                    },
                    component: resolve => require(['../components/page/assign/taskManger/receiveNumber.vue'], resolve)

                },
                {
                    path: '/f_completeNumber', //任务交办  任务管理--完成数量详情
                    name: 'f_completeNumber',
                    meta:{
                        title: "督查考核系统"
                    },
                    component: resolve => require(['../components/page/assign/taskManger/completeNumber.vue'], resolve)

                },
                {
                    path: '/f_meeting', //任务交办-- 会议管理--首页
                    name: 'f_meeting',
                    meta:{
                        title: "督查考核系统"
                    },
                    component: resolve => require(['../components/page/assign/meetingManger.vue'], resolve)

                },
                {
                    path: '/m_lowerNumber', //任务交办  会议管理--下发数量详情
                    name: 'm_lowerNumber',
                    meta:{
                        title: "督查考核系统"
                    },
                    component: resolve => require(['../components/page/assign/meetingManger/lowerNumber.vue'], resolve)

                },
                {
                    path: '/m_receiveNumber', //任务交办  会议管理--接收数量详情
                    name: 'm_receiveNumber',
                    meta:{
                        title: "督查考核系统"
                    },
                    component: resolve => require(['../components/page/assign/meetingManger/receiveNumber.vue'], resolve)

                },
                {
                    path: '/m_completeNumber', //任务交办  会议管理--完成数量详情
                    name: 'm_completeNumber',
                    meta:{
                        title: "督查考核系统"
                    },
                    component: resolve => require(['../components/page/assign/meetingManger/completeNumber.vue'], resolve)

                },
                {
                    path: '/f_newMeeting', //任务交办  会议管理--新建会议
                    name: 'f_newMeeting',
                    meta:{
                        title: "督查考核系统"
                    },
                    component: resolve => require(['../components/page/assign/meetingManger/newMeeting.vue'], resolve)

                },
                {
                    path: '/f_lookMeeting', //任务交办--会议管理--查看会议
                    name: 'f_lookMeeting',
                    meta:{
                        title: "督查考核系统"
                    },
                    component: resolve => require(['../components/page/assign/meetingManger/lookMeeting.vue'], resolve)

                },
                {
                    path: '/f_reportDetails', //任务交办--会议管理--上报明细
                    name: 'f_reportDetails',
                    meta:{
                        title: "督查考核系统"
                    },
                    component: resolve => require(['../components/page/assign/meetingManger/reportDetailed.vue'], resolve)

                },
                {
                    path: '/taskAudit', //任务交办--任务审核
                    name: 'taskAudit',
                    meta:{
                        title: "督查考核系统"
                    },
                    component: resolve => require(['../components/page/assign/taskAudit/taskAudit.vue'], resolve)
                },
                {
                    path: '/f_taskAuditDetails', //任务交办--任务审核--审核详情
                    name: 'f_taskAuditDetails',
                    meta:{
                        title: "督查考核系统"
                    },
                    component: resolve => require(['../components/page/assign/taskAudit/taskAuditDetails.vue'], resolve)
                },
                {
                    path: '/meetingAudit', //任务交办--会议审核
                    name: 'meetingAudit',
                    meta:{
                        title: "督查考核系统"
                    },
                    component: resolve => require(['../components/page/assign/meetingAudit/meetingAudit.vue'], resolve)
                },
                {
                    path: '/f_meetingAuditDetails', //任务交办--会议审核--审核详情
                    name: 'f_meetingAuditDetails',
                    meta:{
                        title: "督查考核系统"
                    },
                    component: resolve => require(['../components/page/assign/meetingAudit/meetingAuditDetails.vue'], resolve)
                },
                {
                    path: '/f_InnovationWord', //任务交办-创新工作任务列表
                    name: 'f_InnovationWord',
                    meta:{
                        title: "督查考核系统"
                    },
                    component: resolve => require(['../components/page/assign/supervisor/InnovationWordList.vue'], resolve)
                },
                {
                    path: '/f_InnovationDetails', //任务交办-创新工作任务列表--详情--审核
                    name: 'f_InnovationDetails',
                    meta:{
                        title: "督查考核系统"
                    },
                    component: resolve => require(['../components/page/assign/supervisor/InnovationWordDetails.vue'], resolve)
                },
                {
                    path: '/f_debriefingComment', //任务交办--述职评议列表
                    name: 'f_debriefingComment',
                    meta:{
                        title: "督查考核系统"
                    },
                    component: resolve => require(['../components/page/assign/supervisor/debriefingComment.vue'], resolve)
                },
                {
                    path: '/f_newDebriefingDetails', //任务交办--述职评议列表==创建及修改
                    name: 'f_newDebriefingDetails',
                    meta:{
                        title: "督查考核系统"
                    },
                    component: resolve => require(['../components/page/assign/supervisor/newDebriefingDetails.vue'], resolve)
                },
                {
                    path: '/f_debriefingDetails', //任务交办--述职评议详情
                    name: 'f_debriefingDetails',
                    meta:{
                        title: "督查考核系统"
                    },
                    component: resolve => require(['../components/page/assign/supervisor/debriefingDetails.vue'], resolve)
                },
                // ------------------承办------------------
                {
                    path: '/taskManager',
                    name: 'taskManager', //任务管理
                    meta:{
                        title: "督查考核系统"
                    },
                    component: resolve => require(['../components/page/undertake/undertake_home.vue'], resolve)
                },
                {
                    path: '/taskDetail',
                    name: 'taskDetail', //任务详情
                    meta:{
                        title: "督查考核系统"
                    },
                    component: resolve => require(['../components/page/undertake/undertake_detail.vue'], resolve)
                },
                {
                    path: '/subTaskDetail',
                    name: 'subTaskDetail', //子任务详情
                    meta:{
                        title: "督查考核系统"
                    },
                    component: resolve => require(['../components/page/undertake/undertake_subDetail.vue'], resolve)
                },
                {
                    path: '/taskHandle',
                    name: 'taskHandle', //任务办理
                    meta:{
                        title: "督查考核系统"
                    },
                    component: resolve => require(['../components/page/undertake/taskHandle.vue'], resolve)
                },
                {
                    path: '/InnovationList', //任务承办--创新工作任务列表
                    name: 'InnovationList',
                    meta:{
                        title: "督查考核系统"
                    },
                    component: resolve => require(['../components/page/undertake/supervisor/InnovationList.vue'], resolve)
                },
                {
                    path: '/newInnovation', //任务承办--创新工作任务--添加
                    name: 'newInnovation',
                    meta:{
                        title: "督查考核系统"
                    },
                    component: resolve => require(['../components/page/undertake/supervisor/newInnovation.vue'], resolve)
                },
                {
                    path: '/innovationDetails', //任务承办--创建工作任务详情
                    name: 'innovationDetails',
                    meta:{
                        title: "督查考核系统"
                    },
                    component: resolve => require(['../components/page/undertake/supervisor/innovationDetails.vue'], resolve)
                },
                {
                    path: '/taskAnswer',//任务承办---任务答疑
                    name: 'taskAnswer',
                    meta:{
                        title: "督查考核系统"
                    },
                    component: resolve => require(['../components/page/undertake/taskAnswer.vue'], resolve)
                },
                {
                    path: '/mettingManager',
                    name: 'mettingManager', //会议管理
                    meta:{
                        title: "督查考核系统"
                    },
                    component: resolve => require(['../components/page/undertake/undertake_metting.vue'], resolve)
                },
                {
                    path: '/mettingDetail',
                    name: 'mettingDetail', //会议详情
                    meta:{
                        title: "督查考核系统"
                    },
                    component: resolve => require(['../components/page/undertake/metting_detail.vue'], resolve)
                },
                {
                    path: '/mettingAction',
                    name: 'mettingAction', //任务上报
                    meta:{
                        title: "督查考核系统"
                    },
                    component: resolve => require(['../components/page/undertake/metting_manager.vue'], resolve)
                },
                {
                    path: '/answerDetail',
                    name: 'answerDetail', //答疑详情
                    meta:{
                        title: "督查考核系统"
                    },
                    component: resolve => require(['../components/page/undertake/answerDetail.vue'], resolve)
                },
                // ************统计分析***************
                {
                    path: '/orgStatistical',
                    name: 'orgStatistical', //党组织信息统计
                    meta:{
                        title: "督查考核系统"
                    },
                    component: resolve => require(['../components/page/undertake/orgStatistical.vue'], resolve)
                },
                {
                    path: '/orgShape',
                    name: 'orgShape', //党组织信息统计-图表
                    meta:{
                        title: "督查考核系统"
                    },
                    component: resolve => require(['../components/page/undertake/orgStatisticalShape.vue'], resolve)
                },

                {
                    path: '/scoreList',
                    name: 'scoreList', //得分统计-得分列表
                    meta:{
                        title: "督查考核系统"
                    },
                    component: resolve => require(['../components/page/score/score_statistics.vue'], resolve)
                },
                {
                    path: '/scoreDetail',
                    name: 'scoreDetail', //得分统计-得分明细
                    meta:{
                        title: "督查考核系统"
                    },
                    component: resolve => require(['../components/page/score/score_detail.vue'], resolve)
                },
                // {
                //     path: '/scoreCharts',
                //     name: 'scoreCharts', //得分统计-得分-得分图表
                //     component: resolve => require(['../components/page/score/score_charts.vue'], resolve)
                // },
                {
                    path: '/scoreShape',
                    name: 'scoreShape', //得分统计-得分统计-图表
                    meta:{
                        title: "督查考核系统"
                    },
                    component: resolve => require(['../components/page/score/score_shape.vue'], resolve)
                },
                {
                    path: '/taskStatistics',
                    name: 'taskStatistics', //得分统计-任务信息统计
                    meta:{
                        title: "督查考核系统"
                    },
                    component: resolve => require(['../components/page/taskStatistics/taskStatistics.vue'], resolve)
                },
                {
                    path: '/taskShape',
                    name: 'taskShape', //得分统计-任务信息统计-图表
                    meta:{
                        title: "督查考核系统"
                    },
                    component: resolve => require(['../components/page/taskStatistics/taskShape.vue'], resolve)
                },
                //-**************通知公告***************
                {
                    path: '/f_supervisorNotice', //任务交办--通知公告--通知公告管理
                    name: 'f_supervisorNotice',
                    meta:{
                        title: "督查考核系统"
                    },
                    component: resolve => require(['../components/page/assign/supervisor/supervisorNotice.vue'], resolve)
                },
                {
                    path: '/f_noticeAdministration', //任务交办--通知公告--通知管理详情
                    name: 'f_noticeAdministration',
                    meta:{
                        title: "督查考核系统"
                    },
                    component: resolve => require(['../components/page/assign/supervisor/noticeAdministration.vue'], resolve)
                },
              
                {
                    path: '/supervisorNoticeDetail', //任务承办--通知公告--通知管理详情
                    name: 'supervisorNoticeDetail',
                    meta:{
                        title: "督查考核系统"
                    },
                    component: resolve => require(['../components/page/undertake/supervisor/supervisorNoticeDetail.vue'], resolve)
                },
                {
                    path: '/supervisorNotice', //任务承办--通知公告--督导通知管理查看
                    name: 'supervisorNotice',
                    meta:{
                        title: "督查考核系统"
                    },
                    component: resolve => require(['../components/page/undertake/supervisor/supervisorNotice.vue'], resolve)

                },


                {
                    path: '/f_supervisorCheck', //任务交办--督导检查列表
                    name: 'f_supervisorCheck',
                    meta:{
                        title: "督查考核系统"
                    },
                    component: resolve => require(['../components/page/assign/supervisor/supervisorCheck.vue'], resolve)
                },
                {
                    path: '/f_newSupervisor', //任务交办--督导检查列表--创建
                    name: 'f_newSupervisor',
                    meta:{
                        title: "督查考核系统"
                    },
                    component: resolve => require(['../components/page/assign/supervisor/newSupervisor.vue'], resolve)
                },
                {
                    path: '/f_supervisorInspectionDetail', //任务交办--督导详情
                    name: 'f_supervisorInspectionDetail',
                    meta:{
                        title: "督查考核系统"
                    },
                    component: resolve => require(['../components/page/assign/supervisor/supervisorInspectionDetail.vue'], resolve)
                },
               
                {
                    path: '/supervisorCheck', //任务承办--督导检查列表
                    name: 'supervisorCheck',
                    meta:{
                        title: "督查考核系统"
                    },
                    component: resolve => require(['../components/page/undertake/supervisor/supervisorCheck.vue'], resolve)
                },
                {
                    path: '/supervisorCheckDetails', //任务承办--督导检查列表
                    name: 'supervisorCheckDetails',
                    meta:{
                        title: "督查考核系统"
                    },
                    component: resolve => require(['../components/page/undertake/supervisor/supervisorCheckDetails.vue'], resolve)
                },

                {
                    path: '/debriefingComment', //任务承办--述职评议列表
                    name: 'debriefingComment',
                    meta:{
                        title: "督查考核系统"
                    },
                    component: resolve => require(['../components/page/undertake/supervisor/debriefingComment.vue'], resolve)
                },
                {
                    path: '/defingDetails', //任务承办--述职评议列表
                    name: 'defingDetails',
                    meta:{
                        title: "督查考核系统"
                    },
                    component: resolve => require(['../components/page/undertake/supervisor/defingDetails.vue'], resolve)
                },
                /*************后台管理**************/
                {
                    path: '/userManagement', //后台管理---用户管理
                    name: 'userManagement',
                    meta:{
                        title: "督查考核系统"
                    },
                    component: resolve => require(['../components/page/backManagement/userManagement.vue'], resolve)
                },
                {
                    path: '/organizationManagement', //后台管理---组织管理
                    name: 'organizationManagement',
                    meta:{
                        title: "督查考核系统"
                    },
                    component: resolve => require(['../components/page/backManagement/organizationManagement.vue'], resolve)
                },
                {
                    path: '/newOrganization', //后台管理---组织管理--添加机构
                    name: 'newOrganization',
                    meta:{
                        title: "督查考核系统"
                    },
                    component: resolve => require(['../components/page/backManagement/newOrganization.vue'], resolve)
                },
                {
                    path: '/organizationDetails', //后台管理---组织管理--查看详情
                    name: 'organizationDetails',
                    meta:{
                        title: "督查考核系统"
                    },
                    component: resolve => require(['../components/page/backManagement/organizationDetails.vue'], resolve)
                },
                
                // {
                //     path: '/ueditor', //ueditor插件
                //     name: 'ueditor',
                //     component: resolve => require(['../components/page/common/udit.vue'], resolve)
                // },
            ]

        },
        // {
        //     path: '/home',
        //     component: resolve => require(['../components/common/Home.vue'], resolve)
        // },
    ]
})
// window.location.href=res.data.url
import {
    postAjax,
    getAjax,
    uploadImg
} from "../api/api.js";
// 全局路由守卫
routers.beforeEach(function (to, from, next) {
    const nextRoute = ['tagglePage','welcome', 'f_taskManager', 'f_newTask','sso','f_taskDetails', 'f_childTaskDetails', 'f_taskAnswer', 'f_replyquestion', 'f_problemResponse', 'f_lowerNumber', 'f_receiveNumber', 'f_completeNumber', 'f_meeting', 'm_lowerNumber', 'm_receiveNumber', 'm_completeNumber', 'f_newMeeting', 'f_lookMeeting', 'f_reportDetails', 'taskAudit', 'f_taskAuditDetails', 'meetingAudit', 'f_meetingAuditDetails', 'taskManager', 'taskDetail', 'subTaskDetail', 'taskHandle', 'taskAnswer', 'mettingManager', 'mettingDetail', 'mettingAction', 'answerDetail', 'orgShape', 'scoreList', 'scoreDetail', 'scoreCharts', 'scoreShape', 'taskStatistics', 'taskShape', 'demo'];
    if (nextRoute.indexOf(to.name) >= 0) {
        if (sessionStorage.getItem("sysOfficeId")) {
            getAjax("ajax/getuser").then(res => {
                //初次登录页面时去请求getuser接口把officeId取到
                let sysOfficeId = res.data.data.sysOfficeId;
                sysOfficeId = sysOfficeId == undefined ? "" : sysOfficeId;
                sessionStorage.setItem("sysOfficeId", sysOfficeId); //在sso登录后则把user的officeId存放到cookie，
                if (sysOfficeId !== "") {
                    //如果user为空则跳转sso或者login登录，如果不为空则跳转welcome页面
                    next()
                } else {
                    getAjax("ajax/loginUrl").then(res => {
                        let thisFlag = res.data.data;
                        // console.log(thisFlag);
                        if (thisFlag.indexOf("login") >= 0) {
                            routers.push({
                                name: "login"
                            }); //如果路由是'/login'跳转至login页面
                        } else {
                            routers.push({
                                path: "/sso"
                            }); // 如果路由是'/'跳转flag页面重定向至sso
                        }
                    });
                }
            });
        } else {
           next();
        // console.log("走!")
        // routers.push({
        //     path:'/sso'
        // });
        }
        
        // getAjax("ajax/getuser").then(res => {
        //     if (res.data.code == 401) {
        //         window.location.href = res.data.data
        //         sessionStorage.setItem('uid', JSON.stringify(res.data.data))
        //     }
        // })
    } else {
        next();
    }
    //已登录的情况再去登录页，跳转至首页
    // if (sessionStorage.getItem('sysOfficeId')) {
    //     next();
    // }
    // next();
});
export default routers;
