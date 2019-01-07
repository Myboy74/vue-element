<template>
    <div class="newTask">
        <div class="headTagLy ">
            <h2 class="tag">{{routerState=="true" ? '编辑任务' : '新建任务'}}</h2>
        </div>
        <div class="shadowLy create newTask">
            <el-form :rules="rules" ref="form" :model="form" label-width="80px">
                <div style="position: relative">
                    <span style="position: absolute;top: 0;left: 20px;">上限分数</span>
                    <div class="topScore" style="width:450px;">
                        <p style="background: rgb(240,240,240);border-bottom:1px solid #cccccc;">
                            <span>时效</span>
                            <span>质量</span>
                            <span>总分</span>
                        </p>
                        <p>
                            <el-input size="medium" style="width:60px;" disabled @input="handleInput" v-model="timeSum"></el-input>
                            <el-input size="medium" style="width:60px;" disabled @input="handleInput1" v-model="qualitySum"></el-input>
                            <el-input size="medium" style="width:60px;margin-left: 12px" disabled @input="handleInput1" v-model="totalSum"></el-input>
                        </p>
                    </div>
                </div>
                <div class="dict-tree-list">
                    <el-form-item label="紧急程度">
                        <!-- <dict-tree class="el-select" style="width:15%;" kt-type="input" :kt-model="form.tempLevel" kt-field='DICT_taskLevel' kt-dict="taskLevel"  @retdict='retdict' placeholder="请选择活动区域"></dict-tree> -->
                        <el-select v-model="form.importantLevel" placeholder="请选择紧急程度">
                            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </div>
                <div v-show="routerState=='true'">
                    <el-form-item label="任务编号" prop="address">
                        <el-input disabled="disabled" v-model="taskNum" class="wid"></el-input>
                    </el-form-item>
                    <!-- <label>任务编号</label> -->
                    <!-- <input type="text" value="SAF123415" style="background: #dcdcdc"> -->
                </div>
                <div>
                    <el-form-item label="任务名称" prop="name">
                        <el-input v-model="form.name" class="wid" @input="changeName" placeholder="请输入任务名称"></el-input>
                    </el-form-item>
                </div>
                <div>
                    <el-form-item label="任务描述">
                        <el-input type="textarea" style="width:350px;" v-model="form.content" placeholder="请输入任务描述"></el-input>
                    </el-form-item>
                </div>
                <div class="cle">
                    <label class="label-search" style="margin: 0 10px 0 20px;">起止时间</label>
                    <el-date-picker style="width:40%" v-model="form.time" type="datetimerange" range-separator="至"
                        value-format="yyyy-MM-dd HH:mm:ss" placeholder="年/月/日 时分秒" start-placeholder="开始日期" end-placeholder="结束日期">
                    </el-date-picker>
                </div>
                <div style="position: relative">
                    <span style="position: absolute;top: 10px;left: 20px;">附件上传</span>
                    <div style="margin-left:90px;">
                        <el-upload class="upload-demo" :action="uploadImg" :on-remove="handleRemove" :file-list="fileList"
                            :onSuccess="uploadSuccess" :with-credentials="true" :onError="uploadError" :before-upload="beforeAvatarUpload"
                            list-type="fileList">
                            <el-button size="small" type="primary">点击上传</el-button>
                            <div slot="tip" class="el-upload__tip">文件只能上传jpg,png,gif,doc,docx,ppt,pptx,xls,xlsx,pdf,txt,zip,rar格式，且不超过5MB</div>
                        </el-upload>
                    </div>
                </div>
                <div class="cle">
                    <label>下发单位</label>
                    <el-button class="copyUnit" @click="lowerUnit">选择下发单位</el-button>
                    <!-- <input type="button" value="选择下发单位" class="copyUnit"  @click="lowerWord"> -->
                    <div class="copyScore">
                        <el-tag v-for="tag in copyWord" :key="tag.id" closable :id="tag.id" :disable-transitions="false"
                            @close="copyWords(tag)">
                            {{tag.label}}
                        </el-tag>
                    </div>
                </div>
                <div class="cle">
                    <label>抄送单位</label>
                    <el-button class="copyUnit" @click="lowerUnit">选择抄送单位</el-button>
                    <!-- <input type="button" value="选择抄送单位" class="copyUnit" @click="lowerWord"> -->
                    <div class="copyScore choiceWork">
                        <el-tag v-for="tag in dynamicTags" :key="tag.id" closable :id="tag.id" :disable-transitions="false"
                            @close="handleClose(tag)">
                            {{tag.label}}
                        </el-tag>
                    </div>
                </div>
            </el-form>
            <div class="cle">
                <label>子任务</label>
                <el-button class="copyUnit" @click="addSubTask" style="margin-left:30px;width:126px;">添加子任务</el-button>
                <!-- <input type="button" value="添加子任务" id="addChildTask"  @click="dialogFormVisible = true"> -->
                <div class="chlidTable">
                    <el-table :data="subTaskList" border stripe style="width: 100%">
                        <el-table-column label="子任务编号" width="150">
                            <template slot-scope="scope">
                                <el-input disabled="disabled" style="width:130px;margin-top:0px;" class="wid" v-model="scope.row.stageNum"></el-input>
                            </template>
                        </el-table-column>
                        <el-table-column label="子任务名称" width="110">
                            <template slot-scope="scope">
                                <el-input style="width:89px;margin-top:0px;" class="wid" v-model="scope.row.stageName" @blur="editSubEvent(scope.row,scope.row.stageNum)"></el-input>
                            </template>
                        </el-table-column>
                        <el-table-column label="时效" width="96">
                            <template slot-scope="scope">
                                <el-input style="margin-top:0px;" type="number" v-model="scope.row.timeScore" @blur="editSubEvent(scope.row,scope.row.stageNum)"></el-input>
                            </template>
                        </el-table-column>
                        <el-table-column label="质量" width="96">
                            <template slot-scope="scope">
                                <el-input style="margin-top:0px;" type="number" v-model="scope.row.qualityScore" @blur="editSubEvent(scope.row,scope.row.stageNum)"></el-input>
                            </template>
                        </el-table-column>
                        <el-table-column label="总分" width="96">
                            <template slot-scope="scope">
                                <el-input disabled="disabled" style="margin-top:0px;" type="number" v-model="scope.row.sumScore"></el-input>
                            </template>
                        </el-table-column>
                        <el-table-column label="子任务描述" width="150">
                            <template slot-scope="scope">
                                <el-input style="width:130px;margin-top:0px;" class="wid" v-model="scope.row.note" @blur="editSubEvent(scope.row,scope.row.stageNum)"></el-input>
                            </template>
                        </el-table-column>
                        <el-table-column label="起止时间" width="435">
                            <template slot-scope="scope">
                                <el-date-picker style="width:415px;margin-top:0px;" @focus="subTimeClick" v-model="scope.row.subTime" @blur="editSubEvent(scope.row,scope.row.stageNum)" type="datetimerange"
                                    range-separator="至" value-format="yyyy-MM-dd HH:mm:ss" placeholder="年/月/日 时分秒"
                                    start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="fatherPickerOptions">
                                </el-date-picker>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作" width="120">
                            <template slot-scope="scope">
                                <div class="f_box">
                                    <el-tooltip class="item" effect="dark" content="上传附件" placement="top">
                                        <img src="../../../../../static/img/11282x.png" alt="" @click="editSubTask(scope.row.stageNum)">
                                    </el-tooltip>
                                    <el-tooltip class="item" effect="dark" content="编辑" placement="top">
                                        <img v-show="false" src="../../../../../static/img/Group147.png" alt="" @click="editSubItem(scope.row.stageNum)">
                                    </el-tooltip>
                                    <el-tooltip class="item" effect="dark" content="删除任务" placement="top">
                                        <img src="../../../../../static/img/Group150.png" alt="" @click="deleteSubTab(scope.row)">
                                    </el-tooltip>
                                </div>
                            </template>
                        </el-table-column>
                    </el-table>
                    <div class="button clear">
                        <button class="f_btn f_deepBlue" :plain="true" v-show="routerState=='true'" @click="preservation">保存</button>
                        <button class="f_btn f_deepBlue" :plain="true" v-show="routerState=='false'" @click="saveNewTask">保存</button>
                        <button class="f_btn f_green" :plain="true" @click="lowerHair">发布</button>
                        <button @click="retunIndex">返回</button>
                    </div>
                </div>
            </div>
            <!-- 选择下发单位弹窗 -->
            <el-dialog :visible.sync="dialogWord" class="newDialog f_lowerWord">
                <div class="headTagLy">
                    <h2 class="tag">{{wordTitle}}</h2>
                </div>
                <div style="width:80%;max-height:300px;overflow-y:auto;margin:0 auto;">
                    <el-tree :data="unitTreeData" show-checkbox node-key="id" ref="tree" :default-checked-keys="wordTitle == '选择下发单位' ? defaultCopyCheck : dynamicCheck"
                        :default-expand-all="true" highlight-current :props="defaultProps" class="cle">
                    </el-tree>
                </div>

                <div slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="getCheckedNodes">保 存</el-button>
                    <el-button @click="dialogWord = false">返 回</el-button>
                </div>
            </el-dialog>
            <!-- 添加——编辑子任务弹窗 -->
            <el-dialog :visible.sync="dialogFormVisible" class="newDialog">
                <el-form :rules="dailogRules" :model="dailogForm">
                    <div class="headTagLy">
                        <h2 class="tag">上传附件</h2>
                    </div>
                    <div style="display:none;">
                        <el-form-item label="子任务编号">
                            <el-input disabled="disabled" class="wid" v-model="dailogForm.subNum"></el-input>
                        </el-form-item>
                    </div>
                    <div v-show="false">
                        <el-form-item label="子任务名称" prop="subName">
                            <el-input v-model="dailogForm.subName" class="wid" placeholder="请输入任务名称"></el-input>
                        </el-form-item>
                    </div>
                    <div v-show="false">
                        <el-form-item label="子任务描述" :label-width="formLabelWidth">
                            <el-input type="textarea" v-model="dailogForm.content" placeholder="请输入任务描述"></el-input>
                        </el-form-item>
                    </div>
                    <div  v-show="false" style="position: relative">
                        <span style="position: absolute;top: 0;left: 20px;">上限分数</span>
                        <div class="topScore" style="width:440px;margin-left:105px;">
                            <p style="background: rgb(240,240,240);border-bottom:1px solid #cccccc;">
                                <span>时效</span>
                                <span>质量</span>
                                <span>总分</span>
                            </p>
                            <p>
                                <el-input type="number" v-model="dailogForm.sx"></el-input>
                                <el-input type="number" v-model="dailogForm.zl"></el-input>
                                <span class="total" style="margin: 18px 65px 0 0;">{{subSumScore.toFixed(2)}}</span>
                            </p>
                        </div>
                    </div>
                    <div v-show="false" class="cle">
                        <label class="label-search" style="margin-right:10px">起止时间</label>
                        <el-date-picker style="margin-left:10px" v-model="dailogForm.time" type="daterange"
                            range-separator="至" value-format="yyyy-MM-dd" placeholder="年/月/日 时分秒" start-placeholder="开始日期"
                            end-placeholder="结束日期" :picker-options="fatherPickerOptions">
                        </el-date-picker>
                    </div>
                    <div class="enclosuretop">
                        <label class="fl" style="margin-top:10px;">附件上传</label>
                        <el-upload style="margin-left:105px" :action="uploadImg" :on-remove="subhandleRemove"
                            :file-list="dailogForm.dialogfileList" :onSuccess="subuploadSuccess" :onError="subuploadError"
                            :with-credentials="true" :before-upload="subbeforeAvatarUpload" list-type="fileList">
                            <el-button size="small" type="primary">点击上传</el-button>
                            <div slot="tip" class="el-upload__tip">文件只能上传jpg,png,gif,doc,docx,ppt,pptx,xls,xlsx,pdf,txt格式，且不超过5MB</div>
                        </el-upload>
                    </div>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="saveSubTab(dailogForm.subNum),setNum">保存附件</el-button>
                    <el-button @click="dialogFormVisible = false,setNum">返 回</el-button>
                </div>
            </el-dialog>
        </div>
    </div>
</template>

<script>
import {
    postAjax,
    getAjax,
    oUrl,
    uploadImg
} from "../../../../api/api.js";
let _self = this;
export default {
    data() {
        return {
            uploadImg: uploadImg() + "?uploadPath=task", //文件上传地址
            attachmentUrl: localStorage.getItem("attachment"), //上传文件得下载（预览）路径
            attachmentsId: [], //上传文件
            fileList: [],
            taskNum: this.$route.query.taskNum, //任务编号
            // form: {
            //   region: "", //项目名称
            //   sx: "", //时效分
            //   zl: "", //质量分
            //   totalScore: "", //总分
            //   urgent: "", //紧急程度
            //   taskName: "", //任务名称
            //   desc: "", //任务描述
            //   time: "", //起止时间
            // },
            form: {
                stageList: [], //子任务表格
                importantLevel: "3"
            },
            subTaskList: [], //子任务表格
            options: [], //项目名称下拉列表
            unitTreeData: [], //选择下发、抄送单位节点树
            defaultProps: {
                children: "children",
                label: "label"
            },
            copyWord: [], //下发单位
            dynamicTags: [], //选择抄送单位
            tableData: [], //抄送单位
            dialogWord: false, //弹框
            wordTitle: "", //弹窗标题
            // 子任务弹窗
            dialogFormVisible: false, //弹框
            dailogForm: {
                subNum: "", //子任务编号
                subName: "", //子任务编号
                content: "", //子任务描述
                subName: "", //子任务名称
                sx: 0, //子任务时效分
                zl: 0, //子任务质量分
                dialogfileList: [], //子任务附件数组
                time: ""
            },
            formLabelWidth: "120px",
            globalLength: 0, //子任务表格总长度
            receiveIdList: "", //接收单位id字符串
            xiafaUnitList: "", //下发单位id字符串
            defaultCopyCheck: [], //默认选择下发和树
            dynamicCheck: [], //默认选择抄送和树
            routerState: sessionStorage.getItem("routeState"), //保存在session里面的路由状态
            isEditDialog: false, //判断是否打开的是子任务编辑页面
            taskLevel: '', //字典项
            DICT_taskLevel: '',
            rules: {
                name: [{
                    required: true,
                    message: "请输入任务名称",
                    trigger: ["blur", "change"]
                },
                {
                    pattern: /^([\w\W]){1,300}$/,
                    message: "输入的是字符不能超过300",
                    trigger: ["blur", "change"]
                }
                ],
                content: [{
                    required: true,
                    message: "请输入任务描述",
                    trigger: ["blur", "change"]
                },
                {
                    pattern: /^([\w\W]){1,1000}$/,
                    message: "输入的是字符不能超过1000",
                    trigger: ["blur", "change"]
                }
                ],
                totalSum: [{
                    required: true,
                    pattern: !0
                },],
                time: [{
                    required: true,
                    message: "请输选择时间",
                    trigger: ["blur", "change"]
                }]
            },
            dailogRules: {
                time: {
                    required: true,
                    message: "请输选择时间",
                    trigger: ["blur", "change"]
                }
            },
            taskDateTime: "",
            fatherPickerOptions: { //时间区间在父级的区间之内
                disabledDate(time) {
                    let fatherDate = sessionStorage.getItem("fatherTime");
                    if (fatherDate !== 'null' && fatherDate !== 'undefined') {
                        let fatherArray = fatherDate.split(',');
                        let fatherStartArray = fatherArray[0].split(' ');
                        let fatherStart = fatherStartArray.shift();
                        let fatherEndArray = fatherArray[1].split(' ');
                        let fatherEnd = fatherEndArray.shift();
                        // console.log(time.getTime());
                        // console.log(new Date(fatherStart).getTime());
                        // console.log(new Date(fatherEnd).getTime());
                        return time.getTime() == new Date(fatherStart).getTime() || time.getTime() >= new Date(fatherEnd).getTime();
                    } else {
                        console.log("请选择主任务时间!")
                    }
                }
            },
            nodeBootId: "", //树节点根目录id
            showSubTab: [],   //用来显示到子任务表格的数组
        };
    },
    mounted() {
        this.programNameList(); //初始化项目名称下拉列表
        this.setNum(); //设置编号方法
    },
    methods: {
        disabledDate(time) {
            return time.getTime() < Date.now() - 8.64e7;
        },
        editSubEvent(item, num) {  //子任务列表输入框鼠标离开事件的编辑修改以及求和子集总和运算
            // console.log(this.subTaskList);
            for (let i in this.subTaskList) {
                if (item.stageName.length >= 300) {
                    debugger;
                    this.$message({
                        type: "warning",
                        message: "此条子任务名称字数大于300，不能保存此条子任务！"
                    });
                    return;
                }
                if (item.timeScore < 0) {
                    this.$message({
                        type: "warning",
                        message: "此条子任务时效分不能小于0，不能保存此条子任务！"
                    });
                    return;
                } else if (item.timeScore == 0) {
                    this.$message({
                        type: "warning",
                        message: "此条子任务时效分不能为0，不能保存此条子任务！"
                    });
                    return;
                }

                if (item.qualityScore < 0) {
                    this.$message({
                        type: "warning",
                        message: "此条子任务质量分不能小于0，不能保存此条子任务！"
                    });
                    return;
                } else if (item.qualityScore == 0) {
                    this.$message({
                        type: "warning",
                        message: "此条子任务质量分不能为0，不能保存此条子任务！"
                    });
                    return;
                }
                if (this.subTaskList[i].stageNum == num) {
                    this.subTaskList[i].stageNum = num;
                    this.subTaskList[i].stageName = item.stageName;
                    this.subTaskList[i].timeScore = item.timeScore;
                    this.subTaskList[i].qualityScore = item.qualityScore;
                    this.subTaskList[i].sumScore = Number(item.timeScore) + Number(item.qualityScore);
                    this.subTaskList[i].note = item.note;
                    if (item.subTime && item.subTime.toString() !== "") { //如果子集时间不等于空对象数组则把起始时间赋值以及时间数组
                        this.subTaskList[i].startDate = item.subTime[0];
                        this.subTaskList[i].endDate = item.subTime[1];
                        this.subTaskList[i].subTime = [item.subTime[0], item.subTime[1]]
                    }
                }
            }
        },
        editSubItem(num) {   //编辑子任务方法
        },
        setNum() { //设置编号方法
            let eidtState = sessionStorage.getItem("routeState");
            let tempDate = new Date();
            let year = tempDate.getFullYear();
            let month = tempDate.getMonth() + 1;
            let today = tempDate.getDate();
            if (today < 10) {
                today = "0" + today;
            }
            let hour = tempDate.getHours();
            if (hour < 10) {
                hour = "0" + hour;
            }
            let minute = tempDate.getMinutes();
            if (minute < 10) {
                minute = "0" + minute;
            }
            let second = tempDate.getSeconds();
            if (second < 10) {
                second = "0" + second;
            }
            // + hour.toString() + minute.toString() + second.toString()
            this.taskDateTime = year.toString() + month.toString() + today.toString();
            this.taskDateTime = this.taskDateTime.slice(2);
            if (eidtState == "true") { //如果从路由获取的routeState值是true怎初始化编辑信息
                this.editInitData(this.$route.query.selId); //编辑信息初始化
            } else {
                this.dailogForm.subNum = "ZRW" + this.taskDateTime + "01";
            }
        },
        subTimeClick() {  //单击子任务时间控件的事件
            // console.log(this.form.time);
            sessionStorage.setItem("fatherTime", this.form.time);
        },
        addSubTask() { //新建子任务
            sessionStorage.setItem("fatherTime", this.form.time);
            this.isEditDialog = false; //改变编辑状态值
            let eidtState = sessionStorage.getItem("routeState");
            let newNum = "";
            let tempDate = new Date();
            let year = tempDate.getFullYear();
            let month = tempDate.getMonth() + 1;
            let today = tempDate.getDate();
            if (today < 10) {
                today = "0" + today;
            }
            let hour = tempDate.getHours();
            if (hour < 10) {
                hour = "0" + hour;
            }
            let minute = tempDate.getMinutes();
            if (minute < 10) {
                minute = "0" + minute;
            }
            let second = tempDate.getSeconds();
            if (second < 10) {
                second = "0" + second;
            }
            this.taskDateTime = year.toString() + month.toString() + today.toString();
            this.taskDateTime = this.taskDateTime.slice(2);
            if (eidtState == "true") {
                let arrLength = this.subTaskList == undefined ? 0 : this.subTaskList.length;
                this.globalLength = arrLength;
                if (arrLength > 9) {
                    newNum = "ZRW" + this.taskDateTime + (arrLength + 1).toString(); //子任务编号=子任务列表数组长度
                } else {
                    newNum = "ZRW" + this.taskDateTime + "0" + (arrLength + 1).toString(); //子任务编号=子任务列表数组长度
                }
            } else {
                if (this.subTaskList !== []) {
                    let arrLength = this.subTaskList == undefined ? 0 : this.subTaskList.length;
                    this.globalLength = arrLength;
                    if (arrLength > 9) {
                        newNum = "ZRW" + this.taskDateTime + (arrLength + 1).toString(); //子任务编号=子任务列表数组长度
                    } else {
                        newNum = "ZRW" + this.taskDateTime + "0" + (arrLength + 1).toString(); //子任务编号=子任务列表数组长度
                    }
                } else {
                    newNum = "ZRW" + this.taskDateTime + "01";
                }
            }
            let subattachementArray = this.dailogForm.dialogfileList; //子任务的url路径数组
            /*************子窗口文件附件上传start************/
            let subfileUrlArray = [];
            for (let i in subattachementArray) {
                subfileUrlArray.push(subattachementArray[i].url)
            }
            let subattachmentFinal = subfileUrlArray.join('|'); //最后数组用"|"拼接起来
            if (subattachementArray !== []) { } else {
                subattachmentFinal = "";
            }
            for (let i in this.subTaskList) {
                if (this.subTaskList[i].stageName == "") {
                    this.$message({
                        type: "warning",
                        message: "上一条子任务名称为空，不能新建子任务！"
                    });
                    return;
                }
                // console.log(this.subTaskList[i].stageName);
                if (this.subTaskList[i].stageName.length >= 300) {
                    this.$message({
                        type: "warning",
                        message: "上一条子任务名称字数超过300字，不能新建子任务！"
                    });
                    return;
                }
                if (this.subTaskList[i].stageName == "") {
                    this.$message({
                        type: "warning",
                        message: "上一条子任务名称为空，不能新建子任务！"
                    });
                    return;
                }
                if (this.subTaskList[i].note == "") {
                    this.$message({
                        type: "warning",
                        message: "上一条子任务描述为空，不能新建子任务！"
                    });
                    return;
                }
                if (this.subTaskList[i].timeScore == 0) {
                    this.$message({
                        type: "warning",
                        message: "上一条子任务时效分不能为0，不能新建子任务！"
                    });
                    return;
                } else if (this.subTaskList[i].timeScore < 0) {
                    this.$message({
                        type: "warning",
                        message: "上一条子任务时效分不能小于0，不能新建子任务！"
                    });
                    return;
                }
                if (this.subTaskList[i].qualityScore == 0) {
                    this.$message({
                        type: "warning",
                        message: "上一条子任务质量分不能为0，不能新建子任务！"
                    });
                    return;
                } else if (this.subTaskList[i].qualityScore < 0) {
                    this.$message({
                        type: "warning",
                        message: "上一条子任务质量分不能小于0，不能新建子任务！"
                    });
                    return;
                }
                if (this.subTaskList[i].startDate == "") {
                    this.$message({
                        type: "warning",
                        message: "上一条子任务时间不能为空，不能新建子任务！"
                    });
                    return;
                }
                if (this.subTaskList[i].endDate == "") {
                    this.$message({
                        type: "warning",
                        message: "上一条子任务时间不能为空，不能新建子任务！"
                    });
                    return;
                }
            }
            this.subTaskList.push({
                stageNum: newNum, //子任务编号
                stageName: "", //子任务名称
                note: "", //子任务描述
                timeScore: 0, //子任务时效分
                qualityScore: 0, //子任务质量分
                sumScore: "0.00", //子任务总和
                startDate: "", //子任务开始时间
                endDate: "", //子任务结束时间
                attachment: subattachmentFinal, //附件地址
                attachementObj: {}, //附件对象
                subTime: [],   //用来显示时间的
            });
            // }
            this.dialogFormVisible = false; //关闭对话框
            /****新建时初始化表单****/
            // this.dailogForm = {
            //     subNum: newNum, //子任务编号
            //     subName: "", //子任务编号
            //     content: "", //子任务描述
            //     time: "", //起止时间
            //     subName: "", //子任务名称
            //     sx: 0, //子任务时效分
            //     zl: 0, //子任务质量分
            //     time: "", //子任务起止时间段  
            //     dialogfileList: [] //子任务附件数组
            // }
        },
        editSubTask(index) { //打开上传附件弹窗
            // console.log('附件框：', index);
            this.dialogFormVisible = true;
            this.isEditDialog = true;
            for (let i in this.subTaskList) {
                if (this.subTaskList[i].stageNum == index) {
                    /*************把数据库附件字符串转换为附件数组的方法start************/
                    let thisDialogFileList = [];
                    if (this.subTaskList[i].attachment) {
                        let fileArray = this.subTaskList[i].attachment.split('|');
                        let fileName = "";
                        for (let i in fileArray) {
                            let tempArray = fileArray[i].split('/');
                            fileName = tempArray.pop();
                            let attaItem = fileArray[i]
                            thisDialogFileList.push({
                                name: fileName,
                                url: attaItem
                            });
                        }
                    }
                    /*************把数据库附件字符串转换为附件数组的方法end************/
                    this.dailogForm.subNum = this.subTaskList[i].stageNum; //子任务id
                    // this.dailogForm.time = [this.subTaskList[i].startDate, this.subTaskList[i].endDate];  //子任务起止时间
                    // this.dailogForm.time = this.subTaskList[i].time; //子任务起止时间
                    this.dailogForm.dialogfileList = thisDialogFileList; //给附件赋值
                }
            }
        },
        deleteSubTab(obj) { //删除子任务
            this.$confirm("是否删除此条子任务, 是否继续?", "温馨提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            }).then(() => {
                this.subTaskList.splice(this.subTaskList.indexOf(obj), 1)
                // console.log(this.subTaskList);
            }).catch(() => {
                this.$message({
                    type: "info",
                    message: "已取消子任务删除"
                });
            });
        },
        changeName(val) { //当任务名称input框发生变化时就新建一条子任务
            if (val.length >= 300) {
                this.$message({
                    type: "warning",
                    message: "任务名称不得超过300字"
                });
                return;
            }
            if (this.subTaskList.length == 0) {
                this.subTaskList.push({
                    stageNum: this.dailogForm.subNum, //子任务编号
                    stageName: val, //子任务名称
                    note: "", //子任务描述
                    timeScore: 0, //子任务时效分
                    qualityScore: 0, //子任务质量分
                    sumScore: "0.00", //子任务总和
                    startDate: "", //子任务开始时间
                    endDate: "", //子任务结束时间
                    attachment: "", //附件地址
                    attachementObj: [] //附件对象
                });
            }
            this.subTaskList[0].stageName = val;  //这句话最关键-change赋值
        },
        saveSubTab(num) { //保存弹窗的子任务附件
            let subattachementArray = this.dailogForm.dialogfileList; //子任务的url路径数组
            /*************子窗口文件附件上传start************/
            let subfileUrlArray = [];
            for (let i in subattachementArray) {
                subfileUrlArray.push(subattachementArray[i].url)
            }
            let subattachmentFinal = subfileUrlArray.join('|'); //最后数组用"|"拼接起来
            if (subattachementArray !== []) { } else {
                subattachmentFinal = "";
            }
            // console.log(subattachmentFinal);
            /*************子窗口文件附件上传end************/
            if (this.isEditDialog) { //如果不是编辑状态那就往子任务集里push
                let tempSubTab = this.subTaskList;
                for (let i in tempSubTab) {
                    if (tempSubTab[i].stageNum == num) {
                        tempSubTab[i].stageNum = this.dailogForm.subNum;
                        tempSubTab[i].attachment = subattachmentFinal;
                    }
                }
            } else {
                // let startTime = this.dailogForm.time[0]; //子任务结束时间
                // let endTime = this.dailogForm.time[1]; //子任务结束时间
                this.subTaskList.push({
                    stageNum: this.dailogForm.subNum, //子任务编号
                    attachment: subattachmentFinal, //附件地址
                    attachementObj: this.dailogForm.dialogfileList //附件对象
                });
            }
            this.dialogFormVisible = false; //关闭对话框
        },
        editInitData(selId) { //编辑时编辑信息初始化
            postAjax("ajax/task/dayTask/form?id=" + selId).then(res => {
                // console.table(res.data.data.dayTask.stageList);
                let tempDate = new Date();
                let year = tempDate.getFullYear();
                let month = tempDate.getMonth() + 1;
                let today = tempDate.getDate();
                if (today < 10) {
                    today = "0" + today;
                }
                let hour = tempDate.getHours();
                if (hour < 10) {
                    hour = "0" + hour;
                }
                let minute = tempDate.getMinutes();
                if (minute < 10) {
                    minute = "0" + minute;
                }
                let second = tempDate.getSeconds();
                if (second < 10) {
                    second = "0" + second;
                }
                //  + hour.toString() +minute.toString() + second.toString()
                this.taskDateTime = year.toString() + month.toString() + today.toString();
                this.form = res.data.data.dayTask; //给编辑对象赋值
                for (let i in this.form.stageList) {
                    this.subTaskList.push({
                        stageNum: this.form.stageList[i].stageNum,
                        stageName: this.form.stageList[i].stageName,
                        timeScore: this.form.stageList[i].timeScore,
                        qualityScore: this.form.stageList[i].qualityScore,
                        sumScore: this.form.stageList[i].sumScore,
                        note: this.form.stageList[i].note,
                        startDate: this.form.stageList[i].startDate,
                        endDate: this.form.stageList[i].endDate,
                        subTime: [this.form.stageList[i].startDate, this.form.stageList[i].endDate],
                        attachment: this.form.stageList[i].attachment
                    });
                };
                // console.log(this.subTaskList);
                let arrLength = this.subTaskList == undefined ? 0 : this.subTaskList.length;
                this.globalLength = arrLength;
                this.dailogForm.subNum = "ZRW" + this.taskDateTime; //子任务编号=子任务列表数组长度
                if (arrLength > 9) {
                    this.dailogForm.subNum = "ZRW" + this.taskDateTime + "0" + this.dailogForm.subNum.substring(
                        1, this.dailogForm.subNum.length - 1);
                }
                this.copyWord = this.form.receiveCompMap; //编辑功能 -- 下发列表
                /***把接收单位的数组赋值给传给后台的字符串变量**Start***/
                let copyList = this.copyWord;
                let copyTempArray = [];
                for (let i in copyList) {
                    copyTempArray.push(copyList[i].id);
                }
                this.receiveIdList = copyTempArray.join(',');
                this.defaultCopyCheck = this.receiveIdList.split(','); //给接收单位默认展开数组赋值
                /***把接收单位的数组赋值给传给后台的字符串变量***End***/

                let copyTemp = this.form.copyCompMap == undefined ? [] : this.form.copyCompMap; //抄送单位
                this.dynamicTags = copyTemp; //编辑功能 -- 抄送列表
                /***把抄送单位单位的数组赋值给传给后台的字符串变量**Start***/
                let dynamicList = this.dynamicTags;
                let dynamicTempArray = [];
                for (let i in dynamicList) {
                    dynamicTempArray.push(dynamicList[i].id);
                }
                this.xiafaUnitList = dynamicTempArray.join(',');
                this.dynamicCheck = this.xiafaUnitList.split(','); //给抄送单位默认展开数组赋值
                /***把抄送单位单位的数组赋值给传给后台的字符串变量***End***/
                if (this.form.attachment) {
                    let fileArray = this.form.attachment.split('|');
                    let fileName = "";
                    for (let i in fileArray) {
                        let tempArray = fileArray[i].split('/');
                        fileName = tempArray.pop();
                        let attaItem = fileArray[i]
                        this.fileList.push({
                            name: fileName,
                            url: attaItem
                        });
                    }
                }
                if (this.subTaskList) {
                    if (this.subTaskList.attachment) {
                        let fileArray = this.subTaskList.attachment.split('|');
                        let fileName = "";
                        for (let i in fileArray) {
                            let tempArray = fileArray[i].split('/');
                            fileName = tempArray.pop();
                            let attaItem = fileArray[i]
                            this.dailogForm.dialogfileList.push({
                                name: fileName,
                                url: attaItem
                            });
                        }
                    }
                }
            });
        },
        programNameList() { //项目名称下拉列表
            let typeLevel = 'taskLevel';
            getAjax("ajax/meeting/taskMeeting/getDict?type=" + typeLevel).then(res => {
                this.options = res.data;
                // console.log(res.data);
                // console.log(this.options);
            });
        },
        //已选择的树节点
        getCheckedNodes() {
            this.dialogWord = false;
            //通过node获取
            if (this.wordTitle == "选择下发单位") {
                let tempUnitArray = this.$refs.tree.getCheckedNodes();
                let unitArray = tempUnitArray.filter(x => x.id !== this.nodeBootId);
                let idArray = [];
                let finalToAjax = [];
                for (let i in unitArray) {
                    idArray.push(unitArray[i].id);
                }
                if (this.copyWord) {
                    this.copyWord = unitArray;
                    for (let i in unitArray) {
                        finalToAjax.push(unitArray[i].id)
                    }
                    this.receiveIdList = finalToAjax.join(',');
                    this.defaultCopyCheck = this.receiveIdList.split(','); //给接收单位默认展开数组赋值
                } else {
                    this.receiveIdList = idArray.join(',');
                    this.copyWord = this.$refs.tree.getCheckedNodes();
                    this.defaultCopyCheck = this.receiveIdList.split(','); //给接收单位默认展开数组赋值
                }
            } else if (this.wordTitle == "选择抄送单位") {
                let tempUnitArray = this.$refs.tree.getCheckedNodes();
                let unitArray = tempUnitArray.filter(x => x.id !== this.nodeBootId);
                let idArray = [];
                let finalToAjax = [];
                for (let i in unitArray) {
                    // console.log(unitArray[i].id);
                    idArray.push(unitArray[i].id);
                };
                if (this.dynamicTags) {
                    this.dynamicTags = unitArray;
                    // let copyArray = this.dynamicTags;
                    for (let i in unitArray) {
                        finalToAjax.push(unitArray[i].id)
                    }
                    this.xiafaUnitList = finalToAjax.join(',');
                    this.dynamicCheck = this.xiafaUnitList.split(','); //给抄送单位默认展开数组赋值
                } else {
                    this.xiafaUnitList = idArray.join(',');
                    this.dynamicTags = this.$refs.tree.getCheckedNodes();
                    this.dynamicCheck = this.xiafaUnitList.split(','); //给抄送单位默认展开数组赋值
                };
            }
        },
        //上传附件限制
        beforeAvatarUpload(file) {
            var flag = false; //状态
            var arr = [
                "jpg",
                "png",
                "gif",
                "doc",
                "docx",
                "ppt",
                "pptx",
                "xls",
                "xlsx",
                "pdf",
                "txt",
                "zip",
                "rar",
                "JPG",
                "PNG",
                "GIF",
                "DOC",
                "DOCX",
                "PPT",
                "PPTX",
                "XLS",
                "XLSX",
                "PDF",
                "TXT",
                "ZIP",
                "RAR"
            ];
            //取出上传文件的扩展名
            var index = file.name.lastIndexOf(".");
            var ext = file.name.substr(index + 1);
            //循环比较
            for (var i = 0; i < arr.length; i++) {
                if (ext == arr[i]) {
                    flag = true; //一旦找到合适的，立即退出循环
                    break;
                }
            }
            var fileSize = file.size / 1024 / 1024 < 5;
            //条件判断
            if (!fileSize) {
                this.$message.error("上传附件大小不能超过 5MB!");
                return false;
            }
            if (!flag) {
                this.$message.error(
                    "文件只能上传  jpg , png , gif , doc ," +
                    "docx , ppt , pptx , xls , xlsx , pdf , txt 格式"
                );
                return false;
            }
        },
        //子窗口上传附件限制
        subbeforeAvatarUpload(file) {
            var flag = false; //状态
            var arr = [
                "jpg",
                "png",
                "gif",
                "doc",
                "docx",
                "ppt",
                "pptx",
                "xls",
                "xlsx",
                "pdf",
                "txt",
                "zip",
                "rar",
                "JPG",
                "PNG",
                "GIF",
                "DOC",
                "DOCX",
                "PPT",
                "PPTX",
                "XLS",
                "XLSX",
                "PDF",
                "TXT",
                "ZIP",
                "RAR"
            ];
            //取出上传文件的扩展名
            var index = file.name.lastIndexOf(".");
            var ext = file.name.substr(index + 1);
            //循环比较
            for (var i = 0; i < arr.length; i++) {
                if (ext == arr[i]) {
                    flag = true; //一旦找到合适的，立即退出循环
                    break;
                }
            }
            var fileSize = file.size / 1024 / 1024 < 5;
            //条件判断
            if (!fileSize) {
                this.$message.error("上传附件大小不能超过 5MB!");
                return false;
            }
            if (!flag) {
                this.$message.error(
                    "文件只能上传  jpg , png , gif , doc ," +
                    "docx , ppt , pptx , xls , xlsx , pdf , txt 格式"
                );
                return false;
            }
        },
        beforeRemove(file, fileList) {
            //删除文件之前的钩子，参数为上传的文件和文件列表，
            //若返回 false 或者返回 Promise 且被 reject，则停止上传。
            return this.$confirm(`确定移除 ${file.name}？`);
        },
        subbeforeRemove(file, fileList) {
            //子窗口删除文件之前的钩子，参数为上传的文件和文件列表，
            //若返回 false 或者返回 Promise 且被 reject，则停止上传。
            return this.$confirm(`确定移除 ${file.name}？`);
        },
        //附件上传失败的返回值
        uploadError(err, file, fileList) { },
        //子窗口附件上传失败的返回值
        subuploadError(err, file, fileList) { },
        //附件上传成功的返回值
        uploadSuccess(response, file, fileList) {
            this.fileList.push({
                name: file.name,
                url: response.data.url
            });
            // console.log(this.fileList);
        },
        //附件上传成功的返回值
        subuploadSuccess(response, file, fileList) {
            this.dailogForm.dialogfileList.push({
                name: file.name,
                url: response.data.url
            });
        },
        removeFuJian(obj, id) {
            let index = -1;
            for (let i = 0; i < obj.length; i++) {
                if (obj[i].uid === id) {
                    index = i;
                }
            }
            if (index > -1) {
                obj.splice(index, 1);
            }
            return obj;
        },
        handleRemove(file, fileList) {
            //文件列表移除文件时的钩子
            this.removeFuJian(this.fileList, file.uid);
        },
        subhandleRemove(file, fileList) {
            //文件列表移除文件时的钩子
            this.removeFuJian(this.dailogForm.dialogfileList, file.uid);
        },
        handleInput(e) {
            //时效评分
            // this.form.sx = e.target.value.replace(/[^\d]/g, "");
        },
        handleInput1(e) {
            //质量评分
            // this.form.zl = e.target.value.replace(/[^\d]/g, "");
        },
        lowerUnit(e) {
            //选择下发单位 ---弹窗
            this.wordTitle = e.target.innerText;
            // console.log(this.wordTitle);
            if (this.wordTitle == "选择下发单位") { } else if (this.wordTitle == "选择抄送单位") { }
            postAjax("ajax/office/sysOffice/treeData")
                .then(res => {
                    this.nodeBootId = res.data[0].id;
                    this.unitTreeData = res.data
                })
            // unitTreeData
            this.dialogWord = true;
        },
        copyWords(tag) { //移除下发单位的tag
            //下送单位---已选择的单位
            // console.log(tag);
            this.copyWord.splice(this.copyWord.indexOf(tag), 1);
            // console.log(this.copyWord);
            /***把接收单位的数组赋值给传给后台的字符串变量**Start***/
            let copyList = this.copyWord;
            let copyTempArray = [];
            for (let i in copyList) {
                copyTempArray.push(copyList[i].id);
            }
            this.receiveIdList = copyTempArray.join(',');
            this.defaultCopyCheck = this.receiveIdList.split(','); //给接收单位默认展开数组赋值
            /***把接收单位的数组赋值给传给后台的字符串变量***End***/
        },
        handleClose(tag) {
            //选择抄送单位---已选择的单位
            this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
            // console.log(this.dynamicTags);
            /***把抄送单位单位的数组赋值给传给后台的字符串变量**Start***/
            let dynamicList = this.dynamicTags;
            let dynamicTempArray = [];
            for (let i in dynamicList) {
                dynamicTempArray.push(dynamicList[i].id);
            }
            this.xiafaUnitList = dynamicTempArray.join(',');
            this.dynamicCheck = this.xiafaUnitList.split(','); //给抄送单位默认展开数组赋值
            /***把抄送单位单位的数组赋值给传给后台的字符串变量***End***/
        },
        taskDeatails() {
            //编辑  任务详情
            this.$router.push({
                name: "f_taskDetails"
            });
        },
        childTask(index) {
            let tempSubTab = this.subTaskList;
            let timeScore = 0;
            let qualityScore = 0;
            let totalScore = 0;
            for (let i in tempSubTab) {
                if (tempSubTab[i].stageNum == index) {
                    timeScore = tempSubTab[i].timeScore;
                    qualityScore = tempSubTab[i].qualityScore;
                }
            }
            //子任务详情
            let subTaskInfo = {
                chengdu: this.form.importantLevel, //紧急程度
                taskNum: this.taskNum, //任务编号
                taskName: this.form.name, //任务名称
                content: this.form.content, //任务描述
                dataTime: this.form.time,
                file: this.fileList, //附件下载
                timeScore: timeScore, //时效总分
                qualityScore: qualityScore, //质量总分
            }
            this.$router.push({
                name: "f_childTaskDetails",
                query: subTaskInfo
            });
        },
        retunIndex() {
            //返回到首页
            window.history.back(-1);
            //  this.$router.push({name:'f_taskManager'});
        },
        preservation() {   //编辑保存功能
            this.form.importantLevel = this.form.importantLevel == '' ? '3' : this.form.importantLevel;
            if (!this.form.name) {
                this.$message({
                    message: "任务名称未填",
                    type: "warning"
                });
                return;
            } else {
                if (this.form.name.length > 300) {
                    this.$message({
                        message: "任务名称不得超过300字",
                        type: "warning"
                    });
                    return;
                }
            }
            if (this.totalSum == 0) {
                this.$message({
                    message: "上限分数未填",
                    type: "warning"
                });
                return;
            } else if (this.totalSum < 0) {
                this.$message({
                    message: "上限不能小于0",
                    type: "warning"
                });
                return;
            }
            if (this.form.importantLevel == "") {
                this.$message({
                    message: "紧急程度未填",
                    type: "warning"
                });
                return;
            }
            if (!this.form.content) {
                this.$message({
                    message: "任务描述未填",
                    type: "warning"
                });
                return;
            } else {
                if (this.form.content.length > 1000) {
                    this.$message({
                        message: "任务描述字符不能超过1000字",
                        type: "warning"
                    });
                    return;
                }
            }
            if (!this.form.time) {
                this.$message({
                    message: "请选择起止时间",
                    type: "warning"
                });
                return;
            }
            if (this.copyWord.length == 0) {
                this.$message({
                    message: "请选择下发单位",
                    type: "warning"
                });
                return;
            }
            //点击保存 下发
            let status = this.$route.query.routeState;
            let tempStartTime = this.form.time[0]; //开始时间
            let tempEndTime = this.form.time[1]; //结束时间
            let attachementArray = this.fileList; //url路径数组
            /*************父窗口文件附件上传start************/
            let fileUrlArray = [];
            for (let i in attachementArray) {
                fileUrlArray.push(attachementArray[i].url)
            }
            let attachmentFinal = fileUrlArray.join('|'); //最后数组用"|"拼接起来
            if (attachementArray !== []) { } else {
                attachmentFinal = "";
            }
            // console.log(attachmentFinal);
            /*************父窗口文件附件上传end************/
            let subTaskMap = this.subTaskList;
            for (let i in subTaskMap) {
                delete subTaskMap[i].attachementObj;
                delete subTaskMap[i].subTime;
            }
            // if (status) {
            let fomatData1 = {
                id: this.$route.query.selId, //任务ID
                taskNum: this.taskNum, //任务编号
                name: this.form.name, //任务名称
                importantLevel: this.form.importantLevel, //紧急程度
                receiveComp: this.receiveIdList, //接收单位ID,多个单位用逗号拼接
                copyComp: this.xiafaUnitList, //抄送单位ID,多个单位用逗号拼接
                content: this.form.content, //内容 --任务描述
                projectId: this.form.projectId, //项目id
                sTimeScore: this.timeSum, //总时效分
                sQualityScore: this.qualitySum, //总质量分
                sumScore: this.totalSum, //总分和
                startDate: tempStartTime, //开始时间
                endDate: tempEndTime, //结束时间
                attachment: attachmentFinal, //附件地址
                stageList: subTaskMap, //子任务集合
                status: this.form.status //状态值
            }
            postAjax("ajax/task/dayTask/save", fomatData1)
                .then(res => {
                    if (res.data.state == 1) {
                        this.$message({
                            message: res.data.message,
                            type: "success"
                        });
                        this.$router.push({
                            path: "/f_taskManager"
                        });
                    } else {
                        this.$message({
                            message: res.data.message,
                            type: "error"
                        });
                    }
                })
        },
        saveNewTask() {
            this.form.importantLevel = this.form.importantLevel == '' ? '3' : this.form.importantLevel;
            //新建保存
            if (!this.form.name) {
                this.$message({
                    message: "任务名称未填",
                    type: "warning"
                });
                return;
            } else {
                if (this.form.name.length > 300) {
                    this.$message({
                        message: "任务名称不得超过300字",
                        type: "warning"
                    });
                    return;
                }
            }
            if (this.totalSum == 0) {
                this.$message({
                    message: "上限分数未填",
                    type: "warning"
                });
                return;
            } else if (this.totalSum < 0) {
                this.$message({
                    message: "上限不能小于0",
                    type: "warning"
                });
                return;
            }
            if (this.form.importantLevel == "") {
                this.$message({
                    message: "紧急程度未填",
                    type: "warning"
                });
                return;
            }
            if (!this.form.content) {
                this.$message({
                    message: "任务描述未填",
                    type: "warning"
                });
                return;
            } else {
                if (this.form.content.length > 1000) {
                    this.$message({
                        message: "任务描述字符不能超过1000字",
                        type: "warning"
                    });
                    return;
                }
            }
            if (!this.form.time) {
                this.$message({
                    message: "请选择起止时间",
                    type: "warning"
                });
                return;
            }
            if (this.copyWord.length == 0) {
                this.$message({
                    message: "请选择下发单位",
                    type: "warning"
                });
                return;
            }
            let status = this.$route.query.routeState;
            let tempStartTime = this.form.time[0]; //开始时间
            let tempEndTime = this.form.time[1]; //结束时间
            let attachementArray = this.fileList; //url路径数组
            /*************父窗口文件附件上传start************/
            let fileUrlArray = [];
            for (let i in attachementArray) {
                fileUrlArray.push(attachementArray[i].url)
            }
            let attachmentFinal = fileUrlArray.join('|'); //最后数组用"|"拼接起来
            if (attachementArray !== []) { } else {
                attachmentFinal = "";
            }
            console.log(attachmentFinal);
            /*************父窗口文件附件上传end************/
            let subTaskMap = this.subTaskList;
            for (let i in subTaskMap) {
                delete subTaskMap[i].attachementObj;
                delete subTaskMap[i].subTime;
            }
            // if (status) {
            // console.log(this.form.importantLevel);
            let fomatData1 = {
                id: this.$route.query.selId, //任务ID
                taskNum: this.taskNum, //任务编号
                name: this.form.name, //任务名称
                importantLevel: this.form.importantLevel, //紧急程度
                receiveComp: this.receiveIdList, //接收单位ID,多个单位用逗号拼接
                copyComp: this.xiafaUnitList, //抄送单位ID,多个单位用逗号拼接
                content: this.form.content, //内容 --任务描述
                projectId: this.form.projectId, //项目id
                sTimeScore: this.timeSum, //总时效分
                sQualityScore: this.qualitySum, //总质量分
                sumScore: this.totalSum, //总分和
                startDate: tempStartTime, //开始时间
                endDate: tempEndTime, //结束时间
                attachment: attachmentFinal, //附件地址
                stageList: subTaskMap, //子任务集合
                status: "1"
            }
            postAjax("ajax/task/dayTask/save", fomatData1)
                .then(res => {
                    if (res.data.state == 1) {
                        this.$message({
                            message: res.data.message,
                            type: "success"
                        });
                        this.$router.push({
                            path: "/f_taskManager"
                        });
                    } else {
                        this.$message({
                            message: res.data.message,
                            type: "error"
                        });
                    }
                })
        },
        lowerHair() {
            this.form.importantLevel = this.form.importantLevel == '' ? '3' : this.form.importantLevel;
            //新建保存
            if (!this.form.name) {
                this.$message({
                    message: "任务名称未填",
                    type: "warning"
                });
                return;
            } else {
                if (this.form.name.length > 300) {
                    this.$message({
                        message: "任务名称不得超过300字",
                        type: "warning"
                    });
                    return;
                }
            }
            if (this.totalSum == 0) {
                this.$message({
                    message: "上限分数未填",
                    type: "warning"
                });
                return;
            } else if (this.totalSum < 0) {
                this.$message({
                    message: "上限不能小于0",
                    type: "warning"
                });
                return;
            }
            if (this.form.importantLevel == "") {
                this.$message({
                    message: "紧急程度未填",
                    type: "warning"
                });
                return;
            }
            if (!this.form.content) {
                this.$message({
                    message: "任务描述未填",
                    type: "warning"
                });
                return;
            } else {
                if (this.form.content.length > 1000) {
                    this.$message({
                        message: "任务描述字符不能超过1000字",
                        type: "warning"
                    });
                    return;
                }
            }
            if (!this.form.time) {
                this.$message({
                    message: "请选择起止时间",
                    type: "warning"
                });
                return;
            }
            if (this.copyWord.length == 0) {
                this.$message({
                    message: "请选择下发单位",
                    type: "warning"
                });
                return;
            }
            let status = this.$route.query.routeState;
            let tempStartTime = this.form.time[0]; //开始时间
            let tempEndTime = this.form.time[1]; //结束时间
            let attachementArray = this.fileList; //url路径数组
            /*************父窗口文件附件上传start************/
            let fileUrlArray = [];
            for (let i in attachementArray) {
                fileUrlArray.push(attachementArray[i].url)
            }
            let attachmentFinal = fileUrlArray.join('|'); //最后数组用"|"拼接起来
            if (attachementArray !== []) { } else {
                attachmentFinal = "";
            }
            // console.log(attachmentFinal);
            /*************父窗口文件附件上传end************/
            let subTaskMap = this.subTaskList;
            for (let i in subTaskMap) {
                delete subTaskMap[i].attachementObj;
            }
            // if (status) {
            let fomatData1 = {
                id: this.$route.query.selId, //任务ID
                taskNum: this.taskNum, //任务编号
                name: this.form.name, //任务名称
                importantLevel: this.form.importantLevel, //紧急程度
                receiveComp: this.receiveIdList, //接收单位ID,多个单位用逗号拼接
                copyComp: this.xiafaUnitList, //抄送单位ID,多个单位用逗号拼接
                content: this.form.content, //内容 --任务描述
                projectId: this.form.projectId, //项目id
                sTimeScore: this.timeSum, //总时效分
                sQualityScore: this.qualitySum, //总质量分
                sumScore: this.totalSum, //总分和
                startDate: tempStartTime, //开始时间
                endDate: tempEndTime, //结束时间
                attachment: attachmentFinal, //附件地址
                stageList: subTaskMap, //子任务集合
                status: "2" //状态值
            }
            postAjax("ajax/task/dayTask/save", fomatData1)
                .then(res => {
                    if (res.data.state == 1) {
                        this.$message({
                            message: res.data.message,
                            type: "success"
                        });
                        this.$router.push({
                            path: "/f_taskManager"
                        });
                    } else {
                        this.$message({
                            message: res.data.message,
                            type: "error"
                        });
                    }
                })
        }
    },
    computed: {
        totalScore(val) {
            //根据 时效+质量 = 总分
            if (isNaN(parseFloat(this.form.sx)) || isNaN(parseFloat(this.form.zl))) {
                return (val = "");
            } else {
                val = parseFloat(this.form.sx) + parseFloat(this.form.zl);
                this.form.totalScore = val;
                return val;
            }
        },
        timeSum: {
            get: function () {
                let tempItem = 0;
                let oldtime = 0;
                let globalSubTable = this.subTaskList;
                let tempTimeSum = this.form.sTimeScore == undefined ? 0 : this.form.sTimeScore;
                let isEdit = this.isEditDialog == false ? false : this.$route.query.routeState; //改变计算属性的编辑值
                if (isEdit) {
                    oldtime = Number(tempTimeSum);
                } else {
                    for (let i in globalSubTable) {
                        tempItem = globalSubTable[i].timeScore == undefined ? 0 : globalSubTable[i].timeScore;
                        oldtime += Number(tempItem)
                    }
                }
                return oldtime;
            } //时效和

        },
        qualitySum: {
            get: function () {
                let tempItem = 0;
                let oldquality = 0;
                let globalSubTable = this.subTaskList;
                let tempQualitySum = this.form.sQualityScore == undefined ? 0 : this.form.sQualityScore;
                let isEdit = this.isEditDialog == false ? false : this.$route.query.routeState; //改变计算属性的编辑值
                if (isEdit) {
                    oldquality = Number(tempQualitySum);
                } else {
                    for (let i in globalSubTable) {
                        tempItem = globalSubTable[i].qualityScore == undefined ? 0 : globalSubTable[i].qualityScore;
                        oldquality += Number(tempItem)
                    }
                }
                return oldquality;
            } //质量和
        },
        totalSum: {
            get: function () { //监听总和
                return (this.timeSum + this.qualitySum).toFixed(2)
            }
        },
        subTabLength: { //监听子任务表格总长度
            get: function () {
                return this.globalLength;
            }
        },
        subSumScore: {
            get: function () {
                let shixiao = this.dailogForm.sx == undefined ? 0 : this.dailogForm.sx;
                let zhiliang = this.dailogForm.zl == undefined ? 0 : this.dailogForm.zl;
                let subSum = Number(shixiao) + Number(zhiliang);
                return subSum
            }
        }
    }
};

</script>

<style scoped>
.chlidTable
  >>> .el-date-editor--datetimerange
  > .el-date-editor
  > .el-range-input {
  border: none;
  outline: 0;
  padding: 0;
  width: 40% !important;
  color: #606266;
  height: 20px;
}
.create {
  padding: 10px;
  margin-top: 10px;
  font-size: 14px;
}

.create div {
  margin-top: 15px;
}

.create div label {
  margin-left: 20px;
}

.wid {
  width: 230px;
}

.create .ui-selectmenu-button.ui-button {
  height: 25px !important;
  margin-left: 10px;
}

.create .ui-selectmenu-text {
  margin-top: 5px;
}

.create .ui-selectmenu-icon.ui-icon {
  margin-top: 3px;
}

.create div input.scoreInput {
  width: 45px;
  margin: 10px 25px;
  padding-left: 0;
  text-align: center;
}

.copyUnit {
  margin: 10px 15px 0;
}

.create .childTable {
  text-align: center;
}

.create .childTable p {
  border: 1px solid black;
  border-bottom: none;
  color: black;
  margin: 20px 0 0 0;
  padding: 10px 0;
  font-weight: bold;
  background: #3dadf2;
}

.create .button {
  height: 30px;
  margin: 20px auto;
}

.create .button button {
  border: none;
  float: left;
  margin-right: 30px;
  padding: 10px 30px;
  border-radius: 5px;
  /* color: white; */
}

.create .button button:last-child:hover {
  background: #e6e0e0;
}

.create div.topScore {
  margin-left: 90px;
  border: 1px solid #cccccc;
  border-radius: 5px;
}

.topScore p span {
  display: inline-block;
  padding: 5px 56px;
}

.topScore p span.total {
  display: block;
  float: right;
  padding: 0;
  margin: 18px 42px 0 0;
}

.topScore p span + span {
  border-left: 1px solid #cccccc;
}

.iconfont {
  margin-left: -25px;
}

.create div.copyScore,
.create div.chlidTable {
  margin-left: 90px;
}

.copyScore .el-tag,
.choiceWork .el-tag {
  background: #e7eaf9 !important;
  color: #5c74d8 !important;
  border: none !important;
  margin: 0 10px 10px 0;
}

.choiceWork .el-tag {
  background: #ffecd9 !important;
  color: #ff7e00 !important;
}

.el-date-editor.el-input {
  margin-left: 12px;
}

.dict-tree-list > .el-tree {
  width: 228px !important;
}

.dict-tree-list > .el-tree .el-tree-node__content {
  width: 49% !important;
  text-align: left !important;
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
