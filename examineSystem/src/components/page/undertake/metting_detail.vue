<template>
    <div>
        <div class="headTagLy">
            <h2 class="tag">会议详情</h2>
        </div>
        <div class="ms-articleLy shadowLy" style="padding:1px 1px 10px 1px;">
            <ul class="panel-ul">
                <li class="el-rowLy">
                    <h2 class="mark">
                        会议编号
                    </h2>
                    <span class="row-text">
                        {{formData.taskMeeting.meetnum}}
                    </span>
                    <div class="clear"></div>
                </li>
                <li class="el-rowLy">
                    <h2 class="mark">
                        会议主题
                    </h2>
                    <span class="row-text">
                        {{formData.taskMeeting.title}}
                    </span>
                    <div class="clear"></div>
                </li>
                <li class="el-rowLy">
                    <h2 class="mark">
                        会议概述
                    </h2>
                    <span class="row-text">
                        {{formData.taskMeeting.summary}}
                    </span>
                    <div class="clear"></div>
                </li>
                <li class="el-rowLy" style="margin-bottom:10px;">
                    <h2 class="mark">
                        参会人员要求
                    </h2>
                    <span class="row-text">
                        {{formData.taskMeeting.requirement}}
                    </span>
                    <div class="clear"></div>
                </li>
                <li class="el-rowLy">
                    <h2 class="mark">
                        会议时间
                    </h2>
                    <span class="row-text">
                        {{formData.taskMeeting.meetingtime}}
                    </span>
                    <div class="clear"></div>
                </li>
                <li class="el-rowLy">
                    <h2 class="mark">
                        会议地点
                    </h2>
                    <span class="row-text">
                        {{formData.taskMeeting.address}}
                    </span>
                    <div class="clear"></div>
                </li>
                <li class="el-rowLy">
                    <h2 class="mark">
                        上报截止
                    </h2>
                    <span class="row-text">
                        {{formData.taskMeeting.limitetime}}
                    </span>
                    <div class="clear"></div>
                </li>
                <li class="el-rowLy">
                    <h2 class="mark">
                        上限分数
                    </h2>
                    <span class="row-text">
                        {{formData.taskMeeting.score}}
                    </span>
                    <div class="clear"></div>
                </li>
                <li class="el-rowLy">
                    <h2 class="mark">
                        附件下载
                    </h2>
                    <span class="row-text">
                        <a v-for="(item,index) in assignFileUrl" :key="index" download :href="item.url" target="_blank">{{item.name}}</a>
                    </span>
                    <div class="clear"></div>
                </li>
            </ul>
            <div class="hr" style="margin:0px 0px 0px 30px;"></div>
            <div class="clear"></div>
            <h2 class="titleLy title-single">参会人员</h2>
            <div class="form-main">
                <div class="form-content" v-for="(item, index) in newFormArray.formLabelAlign" :key="index">
                    <el-form :label-position="labelPosition" label-width="100px">
                        <el-form-item label="参会人员姓名" :prop="'formLabelAlign.'+index+'.name'">
                            <div>{{item.name}}</div>
                        </el-form-item>
                        <el-form-item label="参会人员电话" :prop="'formLabelAlign.'+index+'.tel'">
                            <div>{{item.tel}}</div>
                        </el-form-item>
                        <el-form-item label="参会人员单位" :prop="'formLabelAlign.'+index+'.office'">
                            <div>{{item.office}}</div>
                        </el-form-item>
                        <el-form-item label="参会人员职位" :prop="'formLabelAlign.'+index+'.position'">
                            <div>{{item.position}}</div>
                        </el-form-item>
                        <el-form-item label="参会人员备注" :prop="'formLabelAlign.'+index+'.remark'">
                            <div>{{item.remark}}</div>
                        </el-form-item>
                        <el-form-item label="参会人员性别" :prop="'formLabelAlign.'+index+'.sexValue'">
                            <div>{{item.sexValue}}</div>
                        </el-form-item>
                    </el-form>
                </div>
            </div>
            <div class="clear"></div>
            <ul class="panel-ul">
                <li class="el-rowLy">
                    <h2 class="mark">
                        会议联系电话
                    </h2>
                    <span class="row-text">
                        {{formData.tel}}
                    </span>
                    <div class="clear"></div>
                </li>
                <li class="el-rowLy">
                    <h2 class="mark">
                        备注信息
                    </h2>
                    <span class="row-text">
                        {{formData.note? formData.note : '暂无信息'}}
                    </span>
                    <div class="clear"></div>
                </li>
            </ul>
            <ul class="panel-ul" style="margin-top: -32px;">
                <li class="el-rowLy">
                    <h2 class="mark">
                        已上传附件
                    </h2>
                      <span class="row-text" v-if="!fileUrl.length">暂无上传附件</span>
                    <span class="row-text" v-else>
                        <a v-for="(item,index) in fileUrl" :key="index" download :href="item.url" target="_blank">{{item.fileName}}</a>
                    </span>
                    <div class="clear"></div>
                </li>
            </ul>
            <div class="hr" style="margin:0px 0px 0px 30px;"></div>
            <ul class="panel-ul">
                <li class="el-rowLy">
                    <h2 class="mark">
                        总分
                    </h2>
                    <span class="row-text">
                        {{formData.score}}
                    </span>
                    <div class="clear"></div>
                </li>
                <li class="el-rowLy">
                    <h2 class="mark">
                        审核备注
                    </h2>
                    <span class="row-text">
                        {{formData.scoreRemark==undefined ? '暂无信息' : formData.scoreRemark}}
                    </span>
                    <div class="clear"></div>
                </li>
            </ul>
            <div class="button-group" style="border-bottom:none;">
                <div class="f_btn back-btn" @click="backRoute" style="color:#000">
                    返回
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import {
    postAjax,
    getAjax,
    uploadImg,
    oUrl
} from "../../../api/api.js";
export default {
    data() {
        return {
            tableData: [{
                subNum: "1",
                subName: "XO23333",
                subDetail: "关于国资委任务标题1518号文件",
                startTime: "2018-09-11"
            }],
            formData: {
                taskMeeting: {}
            }, //会议详情对象
            assignFileUrl: [], //交办方文件数组
            fileUrl: [], //承办方文件数组
            newFormArray: { //表单数据
                formLabelAlign: [{
                    name: "", //参会人员名称
                    tel: "", //参会人员电话
                    office: "", //参会人员单位
                    position: "", //参会人员职位
                    remark: "", //参会人员备注
                    sexValue: "" //参会人员性别
                }]
            },
            labelPosition: "left" //表格位置
        };
    },
    mounted() {
        this.initFn(); //加载页面数据
    },
    methods: {
        initFn() {
            //初次加载页面数据时的方法
            let id = this.$route.query.id;
            let receiveid = this.$route.query.receiveid;
            postAjax(
                "ajax/meeting/meetingDetail/detail?meetingid=" + id + "&id=" + receiveid
            ).then(res => {
                let loadUrl = localStorage.getItem("attachment");
                if (res.data.state == 1) {
                    this.formData = res.data.data.taskReceivemeeting; //会议详情对象

                    /**********************************交办上传的附件显示问题start********************************************/
                    let assignUrl = res.data.data.taskReceivemeeting.taskMeeting.attachment;
                    let assignUrlArray = [];
                    if (assignUrl) {
                        assignUrlArray = assignUrl.split('|');
                        let assignNameArray = [];
                        for (let i in assignUrlArray) {
                            assignNameArray = assignUrlArray[i].split('/');
                            let assignName = assignNameArray.pop();
                            if (assignName !== '') {
                                this.assignFileUrl.push({ url: loadUrl + assignUrlArray[i], name: assignName });
                            }
                        }
                    }
                    /**********************************交办上传的附件显示问题end********************************************/

                    /**********************************承办上传的附件显示问题start********************************************/
                    let startUrl = res.data.data.taskReceivemeeting.attachment;
                    let urlArray = [];
                    if (startUrl) {
                        urlArray = startUrl.split("|");
                        let urlNameArray = [];
                        for (let i in urlArray) {
                            urlNameArray = urlArray[i].split("/");
                            let lastName = urlNameArray.pop();
                            console.log(urlNameArray)
                            this.fileUrl.push({
                                url: loadUrl + urlArray[i],
                                fileName: lastName
                            }); //push一下文件链接和文件名
                        }; //附件数组
                    }
                    /**********************************承办上传的附件显示问题end********************************************/
                    this.newFormArray.formLabelAlign = res.data.data.taskReceivemeeting.memberList; //表单列表数组
                }
            });
        },
        taskHandle() {
            this.$router.push({
                path: "/taskHandle"
            });
        },
        taskAnswer() {
            this.$router.push({
                path: "/taskAnswer"
            });
        },
        toDetail() {
            this.$router.push({
                path: "/subTaskDetail"
            });
        },
        backRoute() {
            window.history.back(-1);
            // this.$router.push({ path: "/taskManager" });
        }
    }
};

</script>

<style scoped>
.panel-ul {
  padding: 20px;
  width: 98%;
}

.el-rowLy {
  list-style-type: none;
  width: 100%;
  min-height: 40px;
}

.el-rowLy .mark {
   display: inline-block;
    float: left;
    width: 94px;
    margin-right: 10px;
    font-size: 14px;
    font-weight: normal;
    color: #353639;
}

.el-rowLy .row-text {
  display: inline-block;
  text-align: left;
  width: calc(100% - 10%);
 font-size: 14px;
  color: #898a8f;
}

.el-rowLy .row-text a {
  color: #4a90e2;
  cursor: pointer;
  margin: 0 20px 10px 0;
}

.el-rowLy .row-text a:hover {
  color: #dd0000;
  cursor: pointer;
}

.button-group {
  margin-left: 30px;
  width: 80%;
  height: 54px;
  border-bottom: #ececec 1px solid;
}

/* 按钮默认样式 */
.default {
  float: left;
  margin-left: 20px;
}

.table-content {
  margin-top: 20px;
  float: left;
  width: 76%;
}

.hr {
  margin: 20px 0px 0px 30px;
  width: 80%;
  border-bottom: #ececec 1px solid;
}

.back-btn {
  margin-top: 20px;
  width: 5%;
  text-align: center;
}

.f_box > img {
  cursor: pointer;
}

/* 会议记录默认样式 */
.title-single {
  display: inlline-block;
  margin-left: 10px;
  font-size: 14px;
  display: block;
  width: 60px;
}

/* 表单样式 */
.form-main {
  margin-left: 100px;
}

.form-content {
  position: relative;
  float: left;
  margin: 10px 1% 0px 0%;
  width: 26%;
  padding: 20px 20px 5px 20px;
  border: #d9d9d9 1px solid;
  border-radius: 5px;
}
</style>
