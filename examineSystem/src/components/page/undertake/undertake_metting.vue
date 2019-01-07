<template>
    <div>
        <div class="headTagLy">
            <h2 class="tag">会议办理</h2>
        </div>
        <div class="ms-articleLy shadowLy">
            <div class="block">
                <label class="label-search">会议时间</label>
                <el-date-picker class="search-input" v-model="startTime" type="datetime" value-format="yyyy-MM-dd HH:mm:ss"
                    placeholder="年/月/日">
                </el-date-picker>
                <label class="label-search">至</label>
                <el-date-picker class="search-input" v-model="endTime" type="datetime" value-format="yyyy-MM-dd HH:mm:ss"
                    placeholder="年/月/日">
                </el-date-picker>
                <label class="label-search">上报截止日期</label>
                <el-date-picker class="search-input" v-model="closeDate" type="date" value-format="yyyy-MM-dd"
                    placeholder="年/月/日">
                </el-date-picker>
                <div style="width:100%;">
                    <label class="label-search">会议状态</label>
                    <el-select class="search-input" v-model="searchtesk.state" clearable placeholder="全部">
                        <el-option v-for="item in optionsDuty" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                    <label class="label-search">会议标题关键字</label>
                    <el-input class="search-input" v-model="searchNum.title" placeholder="请输入关键字">
                        <el-option v-for="item in optionsNum" :key="item.orgId" :label="item.orgName" :value="item.orgId">
                        </el-option>
                    </el-input>
                    <el-button type="primary" @click="search" style="padding:10px 26px;margin-left:10px">搜索</el-button>
                </div>
            </div>
        </div>
        <div class="ms-articleLy shadowLy">
            <h2 class="titleLy">会议列表</h2>
            <div class="clear"></div>
            <div class="table-content">
                <el-table :data="tableData" border stripe style="width: 100%">
                    <el-table-column prop="num" label="序号" width="50">
                    </el-table-column>
                    <el-table-column prop="meetnum" label="会议编号">
                    </el-table-column>
                    <el-table-column prop="title" label="会议标题">
                        <template slot-scope="scope">
                            <el-tooltip class="item" effect="dark" :content="scope.row.title" placement="right">
                                <span>{{scope.row.title}}</span>
                            </el-tooltip>
                        </template>
                    </el-table-column>
                    <el-table-column prop="meetingtime" label="会议时间">
                    </el-table-column>
                    <el-table-column prop="limitetime" label="上报截止时间">
                    </el-table-column>
                    <el-table-column prop="meetStatus" label="会议状态" style="margin-left:2%;">
                        <template slot-scope="scope">
                            <div v-if="scope.row.meetStatus=='待接收'">
                                <span :class="{orangeState:(scope.row.meetStatus=='待接收')}">{{scope.row.meetStatus}}</span>
                            </div>
                            <div v-if="scope.row.meetStatus=='待办理'">
                                <span :class="{orangeState:(scope.row.meetStatus=='待办理')}">{{scope.row.meetStatus}}</span>
                            </div>
                            <div v-if="scope.row.meetStatus=='已办理'">
                                <span :class="{greenState:(scope.row.meetStatus=='已办理')}">{{scope.row.meetStatus}}</span>
                            </div>
                            <div v-if="scope.row.meetStatus=='抄送'">
                                <span :class="{greenState:(scope.row.meetStatus=='抄送')}">{{scope.row.meetStatus}}</span>
                            </div>
                            <div v-if="scope.row.meetStatus=='已撤销'">
                                <span :class="{greyState:(scope.row.meetStatus=='已撤销')}">{{scope.row.meetStatus}}</span>
                            </div>
                            <div v-if="scope.row.meetStatus=='已完成'">
                                <span :class="{greenState:(scope.row.meetStatus=='已完成')}">{{scope.row.meetStatus}}</span>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" width="180">
                        <template slot-scope="scope">
                            <div class="f_box">
                                <div v-if="scope.row.meetStatus=='待接收'">
                                    <el-tooltip class="item" effect="dark" content="接收会议" placement="top">
                                         <!-- style="color:#4A90e2; font-size:21px; margin-right:2px; font-weight:bold; cursor:pointer;" -->
                                        <img src="../../../../static/img/jieshou_btn.png" alt=""
                                            @click="acceptFn(scope.row.receiveid)" />
                                    </el-tooltip>
                                    <el-tooltip class="item" effect="dark" content="查看详情" placement="top">
                                        <img src="../../../../static/img/Group148.png" @click="toDetail(scope.row.id,scope.row.receiveid)">
                                    </el-tooltip>
                                    <el-tooltip class="item" effect="dark" content="会议答疑" placement="top">
                                        <img src="../../../../static/img/Group810.png" @click="answer(scope.row.id)">
                                    </el-tooltip>
                                </div>
                                <div v-if="scope.row.meetStatus=='待办理'">
                                    <el-tooltip class="item" effect="dark" content="查看详情" placement="top">
                                        <img src="../../../../static/img/Group148.png" @click="toDetail(scope.row.id,scope.row.receiveid)">
                                    </el-tooltip>
                                    <el-tooltip class="item" effect="dark" content="会议答疑" placement="top">
                                        <img src="../../../../static/img/Group810.png" @click="answer(scope.row.id)">
                                    </el-tooltip>
                                    <el-tooltip class="item" effect="dark" content="会议上报" placement="top">
                                        <img src="../../../../static/img/Group823.png" @click="mettingAction(scope.row.id,scope.row.receiveid)">
                                    </el-tooltip>
                                </div>
                                <div v-if="scope.row.meetStatus=='已办理'">
                                    <el-tooltip class="item" effect="dark" content="查看详情" placement="top">
                                        <img src="../../../../static/img/Group148.png" @click="toDetail(scope.row.id,scope.row.receiveid)">
                                    </el-tooltip>
                                    <el-tooltip class="item" effect="dark" content="会议上报" placement="top">
                                        <img src="../../../../static/img/Group823.png" @click="mettingAction(scope.row.id,scope.row.receiveid)">
                                    </el-tooltip>
                                </div>
                                <div v-if="scope.row.meetStatus=='抄送'">
                                    <el-tooltip class="item" effect="dark" content="查看详情" placement="top">
                                        <img src="../../../../static/img/Group148.png" @click="toDetail(scope.row.id,scope.row.receiveid)">
                                    </el-tooltip>
                                </div>
                                <div v-if="scope.row.meetStatus=='已撤销'">
                                    <el-tooltip class="item" effect="dark" content="查看详情" placement="top">
                                        <img src="../../../../static/img/Group148.png" @click="toDetail(scope.row.id,scope.row.receiveid)">
                                    </el-tooltip>
                                </div>
                                <div v-if="scope.row.meetStatus=='已完成'">
                                    <el-tooltip class="item" effect="dark" content="查看详情" placement="top">
                                        <img src="../../../../static/img/Group148.png" @click="toDetail(scope.row.id,scope.row.receiveid)">
                                    </el-tooltip>
                                    <!-- <el-tooltip class="item" effect="dark" content="会议答疑" placement="top">
                                        <img src="../../../../static/img/Group810.png" @click="answer">
                                    </el-tooltip> -->
                                </div>
                            </div>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <el-pagination class="fenyeCenter" @size-change="handleSizeChange" @current-change="handleCurrentChange"
                :current-page.sync="currentPage3" :page-size="pageSize" layout="prev, pager, next, jumper" :page-count="total">
            </el-pagination>
        </div>
    </div>
</template>
<script>
import qs from 'qs';
import {
    postAjax,
    getAjax,
    uploadImg,
    oUrl
} from "../../../api/api.js";
export default {
    data() {
        return {
            tableData: [],
            optionsDuty: [],
            optionsNum: [{
                orgId: 4,
                orgName: "国资委4"
            },
            {
                orgId: 5,
                orgName: "国资委5"
            },
            {
                orgId: 6,
                orgName: "国资委6"
            }
            ],
            searchtesk: {
                state: ""
            },
            searchNum: {
                title: ""
            },
            startTime: "",
            endTime: "",
            closeDate: "",
            currentPage3: 1,
            pageSize: 15,
            pageNum: 1,
            total: 1
        };
    },
    mounted() {
        this.selectEvent(); //状态下拉列表加载
        this.initialize(); //初始化表格
    },
    methods: {
        selectEvent() {
            //状态选择选择框
            let selVal = "1";
            postAjax(
                "ajax/meeting/taskMeeting/getDict?type=receive_meeting_status"
            ).then(res => {
                this.optionsDuty = res.data;
                this.optionsDuty.unshift({ value: '', label: '全部' });

            });
        },
        search() {
            //查询按钮分条件查询
            let param = {
                startDate: this.startTime,
                endDate: this.endTime,
                limitetime: this.closeDate,
                status: this.searchtesk.state,
                title: this.searchNum.title
            };
            postAjax("ajax/meeting/meetingDetail", qs.stringify(param)).then(
                res => {
                    this.tableData = res.data.data.page.list;
                }
            );
        },
        pagingFn() {
            /*******************************跳转顶部方法start***************************************/ 
            let contentScrollTop = document.getElementsByClassName('content');
            let scrollTop = contentScrollTop[0].scrollTop;
            if (scrollTop !== 0) {
                document.getElementsByClassName('content')[0].scrollTop = 0;
            }
            /*******************************跳转顶部方法end***************************************/
            //分页
            let fenyeSel = {
                pageNo: this.pageNum,
                pageSize: this.pageSize
            };
            postAjax("ajax/meeting/meetingDetail", qs.stringify(fenyeSel)).then(
                res => {
                    this.total = res.data.data.page.pageCount; //总条目
                    this.currentPage1 = res.data.data.page.pageNo; //页数
                    this.tableData = res.data.data.page.list;
                }
            );
        },
        initialize() {
            //初始化加载列表
            let param = {
                startDate: this.startTime,
                endDate: this.endTime,
                limitetime: this.closeDate,
                status: this.searchtesk.state,
                title: this.searchNum.title
            };
            postAjax("ajax/meeting/meetingDetail", param).then(res => {
                this.tableData = res.data.data.page.list;
                this.total = res.data.data.page.pageCount; //总条目
            });
        },
        acceptFn(val) {
            //接收任务功能
            // console.log(val);
            let id = val; //从外部接收到id
            postAjax("ajax/meeting/meetingDetail/receive?id=" + id).then(res => {
                if (res.data.state == 1) {
                    this.$message({
                        type: "success",
                        message: res.data.message
                    });
                    this.initialize(); //初始化表格 
                }
            });
        },
        /* 分页start */
        handleSizeChange(val) {
            //每页条数
            this.pageSize = val;
            this.pagingFn();
        },
        handleCurrentChange(val) {
            //条目改变时
            this.pageNum = val;
            this.pagingFn();
            this.initialize(); //初始化表格
        },
        /* 分页end */
        taskHandle() {
            this.$router.push({
                path: "/taskHandle"
            });
        },
        answer(id) {
            // this.$message('功能暂未开放,敬请期待!');
            // return;
            this.$router.push({ 
                name: "taskAnswer",
                query:{
                    taskAnswer: id
                }
            });
        },
        toDetail(id, receiveid) {
            this.$router.push({
                path: "/mettingDetail",
                query: {
                    id: id,
                    receiveid: receiveid
                }
            }); //跳转并携带id和receiveid给详情页
        },
        mettingAction(id, receiveid) {
            //跳转至任务上报页面
            this.$router.push({
                path: "/mettingAction",
                query: {
                    id: id,
                    receive: receiveid
                }
            }); //跳转并携带id和receiveid给详情页
        }
    }
};

</script>

<style scoped>
.label-search {
  text-align: right;
  color: #333;
  font-size: 14px;
  line-height: 40px;
  padding: 10px 0px 0px 10px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
}

.search-input {
  display: inline-block;
  margin: 12px 0px 0px 10px;
  width: 20%;
}

/*分页样式*/
.fenyeCenter {
  text-align: center;
  margin: 10px auto 0px;
}

/*状态样式 start*/
.orangeState {
  color: orange;
}

.greenState {
  color: green;
}

.greyState {
  color: grey;
}

.f_box > img {
  cursor: pointer;
}

.table-content {
  margin: 0 auto;
  width: 96%;
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
</style>
