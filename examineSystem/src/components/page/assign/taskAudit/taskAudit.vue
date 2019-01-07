<template>
    <div class="taskS">
        <div class="headTagLy">
            <h2 class="tag">任务审核</h2>
        </div>
        <div class="global-panel">
            <div class="left-panel shadowLy">
                <div class="left-panel-title">
                    <span>任务列表</span>
                </div>
                <div class="search-area">
                    <el-input placeholder="请输入任务编号或标题" v-model="filterText" class="input-with-select">
                        <el-button slot="append" icon="el-icon-search" @click="searchLeftTreeFn"></el-button>
                    </el-input>
                    <label class="label-search">起止时间</label>
                    <el-date-picker class="search-input" v-model="time1" type="date" value-format="yyyy-MM-dd"
                        placeholder="年/月/日">
                    </el-date-picker>
                    <br>
                    <label class="label-search">至</label>
                    <el-date-picker class="search-input" v-model="time2" type="date" value-format="yyyy-MM-dd"
                        placeholder="年/月/日">
                    </el-date-picker>
                    <label class="label-search">状态查询</label>
                    <el-select class="search-input" v-model="selStatus" placeholder="请选择状态">
                        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"
                            style="font-size:12px">
                        </el-option>
                    </el-select>
                </div>
                <div class="item-tree-area tree f_treeW">
                    <el-tree :data="treeData" :props="defaultProps" node-key="id" @node-click="handleNodeClick"
                        :filter-node-method="filterNode" :default-expanded-keys="[defaultExpandId]" ref="auditTree"></el-tree>
                </div>
            </div>
            <div class="right-panel shadowLy">
                <div class="left-panel-title">
                    <span v-html="rightTitle"></span>
                </div>
                <ul class="panel-ul">
                    <li class="el-rowLy">
                        <h2 class="mark">
                            紧急程度
                        </h2>
                        <span class="row-text">
                            {{rightFormData.dayTask.importantLevelName}}
                        </span>
                    </li>
                    <li class="el-rowLy">
                        <h2 class="mark">
                            任务状态
                        </h2>
                        <span v-if="rightFormData.dayTask.status=='1'" class="row-text">
                            已保存
                        </span>
                        <span v-if="rightFormData.dayTask.status=='2'" class="row-text">
                            已发布
                        </span>
                        <span v-if="rightFormData.dayTask.status=='3'" class="row-text">
                            已完成
                        </span>
                        <span v-if="rightFormData.dayTask.status=='4'" class="row-text">
                            已撤销
                        </span>
                    </li>
                    <li class="el-rowLy">
                        <h2 class="mark">
                            任务编号
                        </h2>
                        <span class="row-text">
                            {{rightFormData.dayTask.taskNum}}
                        </span>
                    </li>
                    <li class="el-rowLy">
                        <h2 class="mark">
                            任务名称
                        </h2>
                        <span class="row-text">
                            {{rightFormData.dayTask.name}}
                        </span>
                    </li>
                    <li class="el-rowLy">
                        <h2 class="mark">
                            任务描述
                        </h2>
                        <span class="row-text">
                            {{rightFormData.dayTask.content}}
                        </span>
                    </li>
                    <li class="el-rowLy">
                        <h2 class="mark">
                            起止时间
                        </h2>
                        <span class="row-text">
                            {{rightFormData.dayTask.startDate}}--{{rightFormData.dayTask.endDate}}
                        </span>
                    </li>
                    <li class="el-rowLy">
                        <h2 class="mark">
                            附件下载
                        </h2>
                        <span class="row-text" v-if="fileUrlArray.length">
                            <a style="padding: 0 20px 10px 0;" v-for="(item,index) in fileUrlArray" :key="index" download :href="item.fileUrl"
                                target="_blank" >{{item.fileName}}</a>
                        </span>
                        <span v-else style="color:#aeaeae;font-size:14px;">暂无文件</span>
                    </li>
                </ul>
                <div class="button-group">
                    <div v-show="hiddenOptionBtn&&rightFormData.dayTask.status!=3&&rightFormData.dayTask.status!=4"
                        class="f_btn f_green default" style="margin-left:0px;" @click="taskOver">
                        完成任务
                    </div>
                    <div v-show="hiddenOptionBtn&&rightFormData.dayTask.status!=3&&rightFormData.dayTask.status!=4"
                        class="f_btn f_purple default" @click="taskCancel">
                        撤销任务
                    </div>
                    <div class="clear"></div>
                </div>
                <div class="table-content">
                    <el-table stripe :data="tableData" style="margin:0 0 50px 25px;">
                        <el-table-column label="序号" type="index">
                        </el-table-column>
                        <el-table-column prop="shortName" label="单位名称" width="60">
                        </el-table-column>
                        <el-table-column prop="js" label="接收" width="60">
                        </el-table-column>
                        <el-table-column prop="content" label="任务反馈" width="60">
                        </el-table-column>
                        <el-table-column label="附件">
                            <template slot-scope="scope">
                                <span v-for="(tItem,tIndex) in scope.row.attachmentArray" :key="tIndex">
                                    <el-tooltip class="item" effect="dark" :content="tItem.fileName" placement="top">
                                        <a class="attachmentItem" download :href="tItem.fileUrl" target="_blank">{{tItem.fileName}}</a>&nbsp;
                                    </el-tooltip>
                                </span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="finishTime" label="办结时间">
                        </el-table-column>

                        <el-table-column label="时效" width="80">
                            <template slot-scope="scope">
                                <div class="f_box">
                                    <el-input :id="scope.row.id" @blur="inputTimeScore" :value="scope.row.timeScore"
                                        size="small" type="number"></el-input>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column label="质量" width="80">
                            <template slot-scope="scope">
                                <div class="f_box">
                                    <el-input style="wdith:20px" :id="scope.row.id" @blur="inputQualityScore" :value="scope.row.qualityScore"
                                        size="small" type="number"></el-input>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column label="调节" width="80">
                            <template slot-scope="scope">
                                <div class="f_box">
                                    <el-input :id="scope.row.id" @blur="inputTiaojieScore" :value="scope.row.score"
                                        size="small" type="number"></el-input>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column label="总分" width="80">
                            <template slot-scope="scope">
                                <div class="f_box">
                                    <el-input :id="scope.row.id" disabled="disabled" size="small" :value="scope.row.sumScore"
                                        type="number"></el-input>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作" width="120">
                            <template slot-scope="scope">
                                <div v-show="globalFlag==1&&scope.row.detailId!==undefined" class="f_box">
                                    <div class="audit-btn" @click="saveItem(scope.row)">保存</div>
                                    <div class="audit-btn" @click="toExamine(scope.row)">考核</div>
                                </div>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
                <div class="clear"></div>
            </div>
        </div>
    </div>

</template>

<script>
import qs from "qs";
import {
    postAjax,
    getAjax,
    uploadImg,
    oUrl
} from "../../../../api/api.js";
export default {
    data() {
        return {
            filterText: "",
            time1: "",
            time2: "",
            defaultProps: {
                children: "children",
                label: "label"
            },
            treeData: [], //左侧树数据存储
            rightFormData: {
                dayTask: {}, //右侧任务对象
                stageList2: {} //下发单位集合
            }, //右侧信息栏对象
            fileUrlArray: [], //文件附件数组
            rightTitle: "",
            tableData: [],
            timeScore: 0, //时效评分
            qualityScore: 0, //质量评分
            adjustScore: 0, //调节评分
            totalScore: 0, //总分

            timeArray: [], //时效分数组
            qualityArray: [], //质量分数组
            scoreArray: [], //调节分数组
            sumScoreArray: [], //求和数组

            shixiaoScore: 0, //时效评分
            zhiliangScore: 0, //质量评分
            tiaojieScore: 0, //调节评分

            globalFlag: 0, //通过左侧树传过来的标志
            globalHasDetail: true, //确认是否有子集的detail
            primaryId: "", //主任务id
            limitSumScore: 0, //数据库查询出来的总时效分
            hiddenOptionBtn: true, //隐藏操作按钮状态
            selStatus: "", //状态
            options: [], //任务状态下拉列表
            defaultExpand: {}, //默认被展开节点的节点
            defaultExpandId: '', //默认被展开节点的id
        };
    },

    watch: {
        filterText(val) {
            this.$refs.auditTree.filter(val);
        }
    },
    mounted() {
        this.initRequestFn(); //初次加载左侧树
        this.taskAuditStatus(); //任务下拉列表
    },
    methods: {
        taskAuditStatus() { //任务审核状态下拉列表
            let typeLevel = 'taskStatus';
            getAjax("ajax/meeting/taskMeeting/getDict?type=" + typeLevel).then(res => {
                if (res.data) {
                    this.options.push({
                        value: '',
                        label: '全部'
                    });
                    res.data.forEach((item, index) => {
                        if (index != 0) {
                            this.options.push({
                                value: item.value,
                                label: item.label
                            });
                        }
                    })
                }
            });
        },
        scoreSum(id) {
            let time = this.sumScoreArray;
            for (let i = 0; i < time.length; i++) {
                if (time[i].id == id) {
                    for (let j = 0; j < this.tableData.length; j++) {
                        if (this.tableData[j].id == time[i].id) {
                            this.sumScoreArray[i].value =
                                Number(this.timeArray[i].value) +
                                Number(this.qualityArray[i].value) +
                                Number(this.scoreArray[i].value);
                            this.tableData[j].sumScore = this.sumScoreArray[i].value;
                        }
                    }
                }
            }
        },
        inputTimeScore(e) {
            //监听时效分
            let time = this.timeArray;
            for (let i = 0; i < time.length; i++) {
                if (time[i].id == e.target.id) {
                    for (let j = 0; j < this.tableData.length; j++) {
                        if (this.tableData[j].id == time[i].id) {
                            this.tableData[j].timeScore = e.target.value;
                            this.timeArray[i].value = e.target.value;
                        }
                    }
                }
            }
            this.scoreSum(e.target.id);
        },
        inputQualityScore(e) {
            //监听质量分
            let time = this.qualityArray;
            for (let i = 0; i < time.length; i++) {
                if (time[i].id == e.target.id) {
                    for (let j = 0; j < this.tableData.length; j++) {
                        if (this.tableData[j].id == time[i].id) {
                            this.tableData[j].qualityScore = e.target.value;
                            this.qualityArray[i].value = e.target.value;
                        }
                    }
                }
            }
            this.scoreSum(e.target.id);
        },
        inputTiaojieScore(e) {
            //监听调节分
            let time = this.scoreArray;
            for (let i = 0; i < time.length; i++) {
                if (time[i].id == e.target.id) {
                    for (let j = 0; j < this.tableData.length; j++) {
                        if (this.tableData[j].id == time[i].id) {
                            this.tableData[j].score = e.target.value;
                            this.scoreArray[i].value = e.target.value;
                        }
                    }
                }
            }
            this.scoreSum(e.target.id);
        },
        initRequestFn() {
            //初次加载左侧树请求方法
            let globalDate = new Date();
            //当月第一天时间
            let firstYear = globalDate.getFullYear();
            let firstMonth = globalDate.getMonth() + 1;
            firstMonth = firstMonth < 10 ? "0" + firstMonth : firstMonth;
            let firstDay = "01";
            let firstTime = "00:00:00";
            this.time1 = "";
            //当月当天时间
            let currentYear = globalDate.getFullYear();
            let currentMonth = globalDate.getMonth() + 1;
            currentMonth = currentMonth < 10 ? "0" + currentMonth : currentMonth;
            let currentDay = globalDate.getDate();
            currentDay = currentDay < 10 ? "0" + currentDay : currentDay;
            let currentHour = globalDate.getHours();
            currentHour = currentHour < 10 ? "0" + currentHour : currentHour;
            let currentMinutes = globalDate.getMinutes();
            currentMinutes =
                currentMinutes < 10 ? "0" + currentMinutes : currentMinutes;
            let currentSeconds = globalDate.getSeconds();
            currentSeconds =
                currentSeconds < 10 ? "0" + currentSeconds : currentSeconds;
            this.time2 = "";
            // currentYear +
            // "-" +
            // currentMonth +
            // "-" +
            // currentDay +
            // " " +
            // currentHour +
            // ":" +
            // currentMinutes +
            // ":" +
            // currentSeconds;
            let reg = /[\u4E00-\u9FA5\uF900-\uFA2D]/;

            let formatData = {
                status: "", //状态
                startDate: this.time1, //开始时间
                endDate: this.time2, //结束时间
                taskNum: reg.test(this.filterText) ? "" : this.filterText, //任务编码
                taskName: reg.test(this.filterText) ? this.filterText : "" // 任务名称
            };
            getAjax("ajax/task/taskStage/treeData", formatData).then(res => {
                if (res.status == 200) {
                    this.treeData = res.data;
                    if (this.treeData) {
                        let firstTree = this.treeData[0];
                        this.defaultExpand = JSON.parse(sessionStorage.getItem("taskKeyStand"));
                        this.defaultExpandId = this.defaultExpand ? this.defaultExpand.id : firstTree.id; //如果默认展开对象的id为undefined,则默认把第一个treeNode的id赋值给它
                        this.initRightList(
                            this.defaultExpand ? this.defaultExpand.id : firstTree.id,
                            this.defaultExpand ? this.defaultExpand.nature : firstTree.nature,
                            this.defaultExpand ? this.defaultExpand.flag : firstTree.flag,
                            this.defaultExpand ? this.defaultExpand.parentId : firstTree.parentId,
                        ); //调用初次加载右侧信息栏方法
                    }
                } else {
                    this.$message({
                        type: "error",
                        message: res.statusText
                    });
                }
            });
        },
        searchLeftTreeFn() {
            //点击按钮查询左侧树
            let reg = /[\u4E00-\u9FA5\uF900-\uFA2D]/;
            let formatData = {
                status: this.selStatus, //状态
                startDate: this.time1, //开始时间
                endDate: this.time2, //结束时间
                taskNum: reg.test(this.filterText) ? "" : this.filterText, //任务编码
                taskName: reg.test(this.filterText) ? this.filterText : "" // 任务名称
            };
            getAjax("ajax/task/taskStage/treeData", formatData).then(res => {
                if (res.status == 200) {
                    this.treeData = res.data;
                    let firstTree = this.treeData[0];
                    this.initRightList(
                        firstTree.id,
                        firstTree.nature,
                        firstTree.flag,
                        firstTree.parentId
                    ); //调用初次加载右侧信息栏方法
                } else {
                    this.$message({
                        type: "error",
                        message: res.statusText
                    });
                }
            });
        },
        initRightList(clickId, subId, selFlag, parentId) {
            //初始化右侧列表内容
            this.primaryId = clickId; //给主任务id赋值
            this.globalFlag = selFlag;
            let formatData = {
                id: selFlag == "0" ? clickId : parentId, //对应的主任务ID
                nature: subId, //点击子任务时：为detailId（实际为对
                flag: selFlag //点击主任务：flag=0,点击子任务：flag=1
            };
            getAjax("ajax/task/dayTask/listsh", formatData).then(res => {
                if (res.status == 200) {
                    this.fileUrlArray = []; //清空文件路径数组
                    this.rightFormData = res.data.data; //绑定右侧列表数据
                    this.limitSumScore = this.rightFormData.dayTask.sumScore;
                    this.rightTitle = this.rightFormData.dayTask.name; //给右侧信息栏的titile赋值
                    let fujian = this.rightFormData.dayTask.attachment;
                    if (fujian) {
                        let urlArray = [];
                        urlArray = fujian.split("|");
                        let urlNameArray = [];
                        let loadUrl = localStorage.getItem("attachment");
                        for (let i in urlArray) {
                            urlNameArray = urlArray[i].split("/");
                            let lastUrlName = urlNameArray.pop();
                            if (urlArray[i] !== '') {
                                this.fileUrlArray.push({
                                    fileUrl: loadUrl + urlArray[i],
                                    fileName: decodeURI(lastUrlName)
                                });
                            }
                        }
                    }
                    this.tableData = this.rightFormData.stageList2; //子任务集合
                    for (let i in this.tableData) {
                        this.tableData[i].attachmentArray = []; //给添加附件数组属性
                    }
                    for (let i in this.tableData) {
                        let attachmentTemp = this.tableData[i].fj; //单条记录的附件
                        if (attachmentTemp !== "") { //如果附件路径不为空字符串
                            let attacTempArray = attachmentTemp.split('|'); //分割附件地址为附件数组
                            let fileNameArray = []; //定义文件名称的数组
                            let downloadUrl = localStorage.getItem("attachment"); //获取本地缓存文件下载ip（附件前置路径地址）
                            for (let n in attacTempArray) { //   遍历附件数组
                                fileNameArray = attacTempArray[n].split("/"); //分割单条附件地址为文件名数组
                                let lastName = fileNameArray.pop(); //获取文件名数组中最后一个文件名作为页面最终显示的文件名
                                if (attacTempArray[n] !== '') { //如果路径地址不等于空
                                    this.tableData[i].attachmentArray.push({ //则开始拼接附件对象
                                        fileUrl: downloadUrl + attacTempArray[n], //拼接附件路径
                                        fileName: decodeURI(lastName) //获取最后一个文件路径，如果文件名含有unicode则转换为中文
                                    });
                                }
                            }
                        }
                    }
                    let stageArray = this.tableData;
                    stageArray.forEach(item => {
                        // console.log(item)
                        this.timeArray.push({
                            id: item.id,
                            value: item.timeScore ? Number(item.timeScore) : 0
                        });
                        this.qualityArray.push({
                            id: item.id,
                            value: item.qualityScore ? Number(item.qualityScore) : 0
                        });
                        this.scoreArray.push({
                            id: item.id,
                            value: item.score ? Number(item.score) : 0
                        });
                        this.sumScoreArray.push({
                            id: item.id,
                            value: item.sumScore ? Number(item.sumScore) : 0
                        });
                    });
                    for (let i in stageArray) {
                        this.globalHasDetail =
                            stageArray[i].detailId == undefined ? false : true;
                    }
                    for (let i in this.tableData) {
                        this.shixiaoScore = this.tableData[i].timeScore;
                        this.zhiliangScore = this.tableData[i].qualityScore;
                        this.tiaojieScore = this.tableData[i].score;
                    }
                    this.totalScore =
                        this.tableData.timeScore +
                        this.tableData.qualityScore +
                        this.tableData.score; //求每个记录的总分
                } else {
                    this.$message({
                        type: "error",
                        message: res.statusText
                    });
                }
            });
        },
        handleNodeClick(data) {
            this.globalFlag = data.flag; //赋值标志
            let KeyStandObj = {
                id: data.id,
                nature: data.nature,
                flag: data.flag,
                parentId: data.parentId
            }
            sessionStorage.setItem("taskKeyStand", JSON.stringify(KeyStandObj)); //默认被选中的节点id保存到缓存中
            this.initRequestFn(); //初始化左侧树reload;
            this.initRightList(data.id, data.nature, data.flag, data.parentId); //变换右侧信息栏
            if (data.flag == 1) { //如果点击树是子任务，则隐藏任务审核、任务关闭按钮(勿删！)
                this.hiddenOptionBtn = false;
            } else {
                this.hiddenOptionBtn = true;
            }
        },
        saveItem(fd) {
            //保存单条记录
            // console.log(this.rightFormData.dayTask.nature);
            let formatData = {
                id: fd.detailId, //信息id（detailid）
                stageId: this.rightFormData.dayTask.nature, //子任务id
                taskNum: this.rightFormData.taskNum, //任务编号
                comp: fd.id, //单位id
                timeScore: "", //时效分
                qualityScore: "", //质量分
                score: "", //调节分
                taskId: this.rightFormData.statgeList[0].taskId //任务id
            };
            this.tableData.forEach((item, index) => {
                if (item.id == fd.id) {
                    formatData.timeScore = item.timeScore, //时效分
                        formatData.qualityScore = item.qualityScore, //质量分
                        formatData.score = item.score //调节分
                }
            })
            if (parseFloat(formatData.timeScore) + parseFloat(formatData.qualityScore) >
                parseFloat(this.limitSumScore)) {
                this.$message({
                    message: "上限分数为：" + this.limitSumScore + "分，考核分数不能大于规定的上限分数",
                    type: "warning"
                });
                return;
            }
            if (parseFloat(formatData.timeScore) + parseFloat(formatData.qualityScore) + parseFloat(formatData.score) <
                0) {
                this.$message({
                    message: "考核分数不能小于0！",
                    type: "warning"
                });
                return;
            }
            postAjax("ajax/task/dayTask/ajaxSave", formatData).then(res => {
                this.$message({
                    message: res.data.msg,
                    type: "success"
                });
                this.initRequestFn();
            });
        },
        filterNode(value, data) {
            if (!value) return true;
            return data.label.indexOf(value) !== -1;
        },
        taskOver() {
            //任务完成
            this.$confirm("是否确认完成此任务?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            }).then(() => {
                let stageId = this.globalFlag == 0 ? null : this.tableData.id;
                getAjax(
                    "ajax/task/dayTask/complete?id=" +
                    this.primaryId +
                    "&stageId=" +
                    stageId +
                    "&flag=" +
                    this.globalFlag
                ).then(res => {
                    if (res.data.state == 1) {
                        this.$message({
                            message: res.data.message,
                            type: "success"
                        });
                        this.initRequestFn();
                    } else {
                        this.$message({
                            message: res.data.message,
                            type: "error"
                        });
                    }
                });
            }).catch(() => {
                this.$message({
                    type: "info",
                    message: "已取消完成任务"
                });
            });
        },
        taskCancel() {
            //任务关闭
            this.$confirm("是否确认撤销此任务?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            }).then(() => {
                let stageId = this.globalFlag == 0 ? null : this.tableData.id;
                getAjax(
                    "ajax/task/dayTask/revoke?id=" +
                    this.primaryId +
                    "&stageId=" +
                    stageId +
                    "&flag=" +
                    this.globalFlag
                ).then(res => {
                    if (res.data.state == 1) {
                        this.$message({
                            message: res.data.message,
                            type: "success"
                        });
                        this.initRequestFn(); //初始化左侧树
                    } else {
                        this.$message({
                            message: res.data.message,
                            type: "error"
                        });
                    }
                });
            }).catch(() => {
                this.$message({
                    type: "info",
                    message: "已取消撤销任务"
                });
            });
        },
        toExamine(num) {
            //考核

            let para = {
                id: num.detailId == undefined ? "" : num.detailId, //信息id（detailid）*
                stageId: num.id, //子任务id*
                taskId: this.rightFormData.dayTask.id, //任务编号*
                comp: num.id, //单位id*
                // timeScore: this.shixiaoScore,  //时效分
                // qualityScore: this.zhiliangScore, //质量分
                // score: this.tiaojieScore,   //调节分
                // subTaskId: this.rightFormData.statgeList[0].taskId,   //任务id
                degree: this.rightFormData.dayTask.importantLevelName, //紧急程度
                taskNum: this.rightFormData.dayTask.taskNum, //紧急程度
                unitName: num.shortName, //单位名称
                flag: "kaohe", //标识*,
                limitScore: parseFloat(this.limitSumScore) //上限分数
            };
            this.$router.push({
                path: "/f_taskAuditDetails",
                query: para
            });
            // sessionStorage.setItem("id");
        }
    }
};

</script>

<style scoped>
.global-panel {
  width: 100%;
  height: 100%;
  float: left;
}

.search-area {
  margin: 20px auto 0px;
  width: 84%;
  height: 178px;
}

.label-search {
  text-align: left;
  width: 57px;
  /* display: inline-block; */
  color: #333;
  font-size: 12px;
  line-height: 40px;
  padding: 10px 0px 0px 5px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  float: left;
}

.search-input {
  font-size: 12px;
  /* display: inline-block; */
  margin: 12px 0px 0px 10px;
  width: 62%;
  float: left;
}

.item-tree-area {
  margin: 60px auto 0px;
  max-height: 320px;
  height: calc(100% - 250px);
  box-sizing: border-box;
  overflow-y: auto;
}

/* 右侧样式 */
.panel-ul {
  margin: 10px 0px 0px 30px;
  padding-bottom: 10px;
}

.el-rowLy {
  list-style-type: none;
  width: 100%;
  min-height: 35px;
}

.el-rowLy .mark {
  float: left;
  width: 75px;
  font-size: 14px;
  font-weight: normal;
  color: #353639;
}

.el-rowLy .row-text {
  display: inline-block;
  width: calc(100% - 106px);
  font-size: 14px;
  color: #898a8f;
  /* float: left; */
}

.el-rowLy .row-text a {
  color: #4a90e2;
  cursor: pointer;
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
  font-size: 14px;
  float: left;
  margin-left: 20px;
}

.table-content {
  margin-top: 20px;
  float: left;
  width: 90%;
}

.hr {
  margin: 20px 0px 0px 30px;
  width: 80%;
  border-bottom: #ececec 1px solid;
}

.back-btn {
  margin: 4% 0% 0% 5%;
  width: 5%;
  text-align: center;
}

.audit-btn {
  font-size: 14px;
  border-radius: 5px;
  border: solid 1px #39d1e8;
  color: #39d1e8;
  display: inline-block;
  padding: 3px 10px;
  margin-right: 5px;
  cursor: pointer;
}

.audit-btn:hover {
  border: solid 1px #ff7291;
  color: #ff7291;
  cursor: pointer;
}

/* .item-tree-area > .el-tree {
  width: 98%;
} */

/* .item-tree-area .el-tree-node__label {
  width: 100%;
  word-break: break-word;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
} */

.f_btn {
  width: 80px;
  height: 36px;
  line-height: 36px;
  padding: 0;
  text-align: center;
}

.attachmentItem {
  width: 100%;
  font: 14px/18px Microsoft Yahei;
  word-wrap: break-word;
  text-align: center;
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
  display: block;
}
/* .table-content > .item >>> .cell{
    text-align: center;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    overflow: hidden;
    max-height: 250px;
    text-overflow: ellipsis;
    white-space: nowrap;
} */
.left .el-tooltip__popper,
.right .el-tooltip__popper {
  padding: 8px 10px;
}
</style>
