<template>
    <div class="meetingAction">
        <div class="headTagLy">
            <h2 class="tag">会议上报</h2>
        </div>
        <div class="ms-articleLy shadowLy" style="padding:1px 1px 10px 1px;">
            <ul class="panel-ul">
                <li class="el-rowLy">
                    <h2 class="mark">
                        会议主题
                    </h2>
                    <span class="row-text">
                        {{formData.taskMeeting.title}}
                    </span>
                </li>
                <li class="el-rowLy">
                    <h2 class="mark">
                        会议概述
                    </h2>
                    <span class="row-text">
                        {{formData.taskMeeting.summary}}
                    </span>
                </li>
                <li class="el-rowLy">
                    <h2 class="mark">
                        会议人员要求
                    </h2>
                    <span class="row-text">
                        {{formData.taskMeeting.requirement}}
                    </span>
                </li>
                <li class="el-rowLy">
                    <h2 class="mark">
                        会议时间
                    </h2>
                    <span class="row-text">
                        {{formData.taskMeeting.meetingtime}}
                    </span>
                </li>
                <li class="el-rowLy">
                    <h2 class="mark">
                        会议地点
                    </h2>
                    <span class="row-text">
                        {{formData.taskMeeting.address}}
                    </span>
                </li>
                <li class="el-rowLy">
                    <h2 class="mark">
                        上报截止
                    </h2>
                    <span class="row-text">
                        {{formData.taskMeeting.limitetime}}
                    </span>
                </li>
                <li class="el-rowLy" style="height:auto;">
                    <h2 class="mark">
                        附件下载
                    </h2>
                    <span style="margin:0 20px 10px 0;" 
                    v-for="(item,index) in fileUrl" 
                    :key="index">
                        <a download :href="item.url" target="_blank">{{item.name}}</a>
                    </span>
                    <div class="clear"></div>
                </li>
            </ul>
            <div class="hr" style="margin:0px 0px 0px 30px;"></div>
            <div class="clear"></div>
            <h2 class="titleLy title-single">参会人员</h2>
            <div class="form-main">
                <div class="form-content" v-for="(item, index) in newFormArray.formLabelAlign" :key="index">
                    <img src="../../../../static/img/close.png" onMouseOver="this.src='../../../../static/img/close2.png'" onMouseOut="this.src='../../../../static/img/close.png'" class="delete-btn" @click="deleteHuman(index,item.id)"></i>
                    <el-form :label-position="labelPosition" label-width="110px">
                        <el-form-item label="参会人员姓名" :rules="subyz.name" :prop="'formLabelAlign.'+index+'.name'">
                            <el-input v-model="item.name" placeholder="请输入参会人员姓名"></el-input>
                        </el-form-item>
                        <el-form-item label="参会人员电话" :rules="subyz.tel" :prop="'formLabelAlign.'+index+'.tel'">
                            <el-input v-model="item.tel" placeholder="请输入参会人员电话"></el-input>
                        </el-form-item>
                        <el-form-item label="参会人员单位" :rules="subyz.office" :prop="'formLabelAlign.'+index+'.office'">
                            <el-input v-model="item.office" placeholder="请输入参会人员单位"></el-input>
                        </el-form-item>
                        <el-form-item label="参会人员职务" :rules="subyz.position" :prop="'formLabelAlign.'+index+'.position'">
                            <el-input v-model="item.position" placeholder="请输入参会人员职务"></el-input>
                        </el-form-item>
                        <el-form-item label="参会人员备注" :rules="subyz.remark" :prop="'formLabelAlign.'+index+'.remark'">
                            <el-input v-model="item.remark" placeholder="请输入参会人员备注"></el-input>
                        </el-form-item>
                        <el-form-item label="参会人员性别" :rules="subyz.sex" :prop="'formLabelAlign.'+index+'.sexValue'">
                            <el-select v-model="item.sexValue" clearable placeholder="请输入参会人员性别" style="width:100%;">
                                <el-option
                                v-for="item in options"
                                :key="item.value"
                                :label="item.label"
                                :value="item.label">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-form>
                </div>
                <div class="form-content-new" style="">
                    <span class="new-formBtn" @click="addForm">
                        <img class="plus" src="../../../../static/img/add.png" width="40" height="40" />
                        <!-- <i class="iconfont icon-jiahao plus"></i> -->
                        <span class="new-word">新增信息</span>
                    </span>
                </div>
                <div class="clear"></div>
            </div>
            <div class="clear"></div>
            <div style="height:10px;"></div>
            <div class="hr" style="margin: 5px 0px 0px 30px;"></div>
            <ul class="panel-ul">
                <el-form :rules="subyz" label-position="left" label-width="110px" :model="otherForm">
                    <el-form-item label="会议联系电话" prop="tel">
                        <el-input v-model="otherForm.tel" style="width:30%;"></el-input>
                    </el-form-item>
                    <el-form-item label="备注信息">
                        <el-input v-model="otherForm.note" type="textarea" style="width:60%;"></el-input>
                    </el-form-item>
                <!-- </el-form> -->
                 <el-form-item label="附件上传">
                <el-upload class="upload-demo" 
                :action="uploadImg" 
                :on-remove="handleRemove" 
                :onSuccess="subuploadSuccess"
                :with-credentials="true" 
                :before-upload="beforeAvatarUpload"
                :file-list="fileList"
                :on-exceed="handleExceed">
                    <el-button size="small" type="primary">点击上传</el-button>
                    <div slot="tip" class="el-upload__tip" style="margin-left: 12px !important;">文件只能上传jpg,png,gif,doc,docx,ppt,pptx,xls,xlsx,pdf,txt,zip,rar格式，且不超过5MB</div>
                </el-upload>
                 </el-form-item>
                  </el-form>
            </ul>
            <div style="height:10px;"></div>
            <div class="hr" style="margin: 5px 0px 0px 30px;"></div>
            <div class="button-group" style="border-bottom:none;">
                <div class="f_btn back-btn f_deepBlue" @click="submitInfo" style="display:inline-block;">
                    提交
                </div>
                <div class="f_btn back-btn" @click="backRoute" style="color:#000; display:inline-block;">
                    返回
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { postAjax, getAjax, uploadImg, oUrl } from "../../../api/api.js";
import qs from "qs";
export default {
    data() {
        return {
            uploadImg: uploadImg() + "?uploadPath=taskMeeting", //文件上传地址
            attachmentUrl: localStorage.getItem("attachment"), //上传文件得下载（预览）路径
            attachmentsId: [], //上传文件
            fileList: [],
            tableData: [
                {
                    subNum: "1",
                    subName: "XO23333",
                    subDetail: "关于国资委会议标题1518号文件",
                    startTime: "2018-09-11"
                }
            ],
            labelPosition: "left",
            formData: {
                taskMeeting: {}
            }, //后台表单对象
            newFormArray: {
                formLabelAlign: [
                    {
                        name: "", //参会人员名称
                        tel: "", //参会人员电话
                        office: "", //参会人员单位
                        position: "", //参会人员职位
                        remark: "", //参会人员备注
                        sexValue: "", //参会人员性别
                        sex: 1 //参会性别值
                    }
                ]
            },
            otherForm: {},
            options: [{ value: 1, label: "男" }, { value: 2, label: "女" }],
            fileUrl: [], //交办方附件下载列表
            fileList: [], //承办方附件上传列表
            subyz: {
                name: [
                    {
                        // required: true,
                        // message: '请输入姓名',
                        trigger: "blur"
                    }
                ],
                tel: [
                    {
                        // required: true,
                        // message: '请输入参会人员电话',
                        trigger: "blur"
                    },
                    {
                        // pattern: /^[0-9]*$/,
                        // message: '请输入正确的号码',
                        trigger: ["blur", "change"]
                    }
                ],
                office: [
                    {
                        // required: true,
                        // message: '请输入参会人员单位',
                        trigger: "blur"
                    }
                ],
                position: [
                    {
                        // required: true,
                        // message: '请输入参会人员职位',
                        trigger: "blur"
                    }
                ],
                remark: [
                    {
                        // required: true,
                        // message: '请输入参会人员备注',
                        trigger: "blur"
                    }
                ],
                sex: [
                    {
                        // required: true,
                        // message: '请输入性别',
                        trigger: "blur"
                    }
                ]
            }
        };
    },
    mounted() {
        this.initLoadFn(); //初次加载数据
    },
    methods: {
        initLoadFn() {
            //会议上报加载接口
            let id = this.$route.query.id;
            let receiveid = this.$route.query.receive;
            postAjax(
                "ajax/meeting/meetingDetail/handle?meetingid=" + id + "&id=" + receiveid
            ).then(res => {
                if (res.data.state == 1) {
                    this.formData = res.data.data.taskReceivemeeting; //获取上报详情表单
                    let loadUrl = localStorage.getItem("attachment");
                    this.formData = res.data.data.taskReceivemeeting; //会议详情对象
                    /**********************************交办上传的附件显示问题start********************************************/
                    let assignUrl =
                        res.data.data.taskReceivemeeting.taskMeeting.attachment;
                    let assignUrlArray = [];
                    if (assignUrl) {
                        assignUrlArray = assignUrl.split("|");
                        let assignNameArray = [];
                        for (let i in assignUrlArray) {
                            assignNameArray = assignUrlArray[i].split("/");
                            let assignName = assignNameArray.pop();
                            if (assignName !== "") {
                                this.fileUrl.push({
                                    url: loadUrl + assignUrlArray[i],
                                    name: assignName
                                });
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
                            if (lastName !== "") {
                                this.fileList.push({
                                    url: loadUrl + urlArray[i],
                                    name: lastName
                                }); //push一下文件链接和文件名
                            }
                        } //附件数组
                        // console.log(this.fileList);
                    }
                    /**********************************承办上传的附件显示问题end********************************************/
                    let formListArray = res.data.data.taskReceivemeeting.memberList;
                    this.newFormArray.formLabelAlign =
                        formListArray == undefined ? [] : formListArray; //表单列表数组
                    this.otherForm.tel = this.formData.tel;
                    this.otherForm.note = this.formData.note;
                }
            });
        },
        addForm() {
            //增加人员信息功能
            this.newFormArray.formLabelAlign.push({
                name: "", //参会人员名称
                tel: "", //参会人员电话
                office: "", //参会人员单位
                position: "", //参会人员职位
                remark: "", //参会人员备注
                sexValue: "", //参会人员性别
                sex: 1 //参会人员性别值
            });
        },
        deleteHuman(selindex, selId) {
            let idsArray = [];
            idsArray.push(selId);
            let ids = idsArray.join(",");
            getAjax("ajax/meeting/taskMeetingmember/deleteMember?ids=" + ids).then(
                res => {
                    // console.log(res)
                    if (res.data.state == 1) {
                        this.$message({
                            type: "success",
                            message: res.data.message
                        });
                    } else {
                        this.$message({
                            type: "error",
                            message: res.data.message
                        });
                    }
                }
            );
            //删除人员信息功能
            this.newFormArray.formLabelAlign.findIndex((item, index) => {
                if (index == selindex) {
                    this.newFormArray.formLabelAlign.splice(index, 1);
                }
            });
        },
        handleRemove(file, fileList) {
            //附件删除
            //文件删除时的钩子
            Array.prototype.remove = function (val) {
                let index = -1;
                for (let i = 0; i < this.length; i++) {
                    if (this[i].uid === val) {
                        index = i;
                    }
                }
                if (index > -1) {
                    this.splice(index, 1);
                }
            };
            this.fileList.remove(file.uid);
        },
        handleExceed(files, fileList) {
            this.$message.warning(
                `当前限制选择 3 个文件，本次选择了 ${
                files.length
                } 个文件，共选择了 ${files.length + fileList.length} 个文件`
            );
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
        subuploadSuccess(response, file, fileList) {
            //上传附件成功
            this.fileList.push({ name: file.name, url: response.data.url });
            // console.log(this.fileList);
        },
        backRoute() {
            //返回按钮
            window.history.back(-1);
        },
        submitInfo() {
            //保存提交按钮
            if (this.newFormArray.formLabelAlign.join(",") == "") {
                this.$message({
                    message: "参会人员列表不能为空！",
                    type: "warning"
                });
                return;
            }
            if (!this.otherForm.tel) {
                this.$message({
                    message: "会议电话为空",
                    type: "warning"
                });
                return;
            }
            let attachementArray = this.fileList; //url路径数组
            /*************文件附件上传转为url字符串start************/
            let fileUrlArray = [];
            for (let i in attachementArray) {
                fileUrlArray.push(attachementArray[i].url);
            }
            let attachmentFinal = fileUrlArray.join("|"); //最后数组用"|"拼接起来
            if (attachementArray !== []) {
            } else {
                attachmentFinal = "";
            }
            // console.log(attachmentFinal);
            /*************文件附件上传转为url字符串end************/
            let humanList = this.newFormArray.formLabelAlign;
            for (let i in humanList) {
                // console.log(humanList);
                if (humanList[i].sexValue == "男") {
                    humanList[i].sex = 1;
                } else {
                    humanList[i].sex = 2;
                }
            }
            for (let i in humanList) {
                delete humanList[i].sexValue; //删除人员性别列表里的性别名称
            }

            let param = {
                id: this.$route.query.receive, //会议接收方id
                meetingid: this.$route.query.id,
                memberList: humanList, //会议人员信息列表
                tel: this.otherForm.tel, //电话
                note: this.otherForm.note, //会议备注
                attachment: attachmentFinal //附件
            };
            postAjax("ajax/meeting/meetingDetail/save", param).then(res => {
                if (res.data.state == 1) {
                    this.$message({
                        type: "success",
                        message: res.data.message
                    });
                    this.$router.push({ name: "mettingManager" });
                } else {
                    this.$message({
                        type: "error",
                        message: res.data.message
                    });
                }
            });
        }
    }
};
</script>

<style scoped>
.panel-ul {
  margin: 10px 0px 0px 30px;
  width: 900px;
  padding-bottom: 1%;
}

.el-rowLy {
  list-style-type: none;
  width: 100%;
  line-height: 30px;
}

.el-rowLy .mark {
  width: 90px;
  float: left;
  text-align: left;
  margin-right: 14px;
  font-size: 14px;
  color: #353639;
  font-weight: normal;
}

.el-rowLy .row-text {
  display: inline-block;
  width: calc(100% - 106px);
  font-size: 14px;
  color: #898a8f;
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
  padding-bottom: 5px;
  border-bottom: #ececec 1px solid;
}

/* 按钮默认样式 */
.default {
  width: 5%;
  text-align: center;
}

.table-content {
  margin-top: 20px;
  float: left;
  width: 92%;
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

.f_box > img {
  cursor: pointer;
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

.form-content-new {
  float: left;
  margin: 10px 1% 0px 0%;
  width: 20%;
  padding: 20px 20px 5px 20px;
  border: #d9d9d9 1px solid;
  border-radius: 5px;
  background-color: #f1f1f1;
  height: 242px;
  padding: 20px 20px 11px 20px;
}

/* 会议记录默认样式 */
.title-single {
  display: inlline-block;
  margin-left: 10px;
  font-size: 14px;
  display: block;
  width: 60px;
}

/* 新增图标区域 */
.new-formBtn {
  display: block;
  width: 30%;
  height: 30%;
  margin: 23% 0% 0% 34%;
  text-align: center;
  cursor: pointer;
}

/* 加号注释 */
.plus {
  display: block;
  color: #f95a79;
  font-size: 40px;
  margin-left: 29%;
  margin-bottom: 10%;
}

.new-word {
  color: #353639;
  font-size: 16px;
}

/* 删除人员按钮 */
.delete-btn {
  position: absolute;
  top: -11px;
  right: -12px;
  width: 30px;
  height: 30px;
  z-index: 999;
  cursor: pointer;
  background: #fff;
  text-align: center;
  font-size: 24px;
  color: #cccccc;
  border-radius: 50%;
}

.delete-btn:hover {
  color: #dd0000;
  cursor: pointer;
}
</style>
