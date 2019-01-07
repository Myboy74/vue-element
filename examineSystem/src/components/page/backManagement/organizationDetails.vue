<template>
    <div class="newOrganization">
        <div class="account shadowLy">
            <div class="left-panel-title">
                <span>机构详情</span>
            </div>
            <div class="create">
                <div>
                    <label>上属省企业党组织</label>
                    <div class="detailContent" :id="topName.id">{{topName.name}}</div>
                </div>

                <div>
                    <label>隶属上级党组织</label>
                    <div class="detailContent">{{content.zipCode}}</div>
                </div>
                <div v-if="false">
                    <label>党组织名称</label>
                    <div class="detailContent">{{content.orgName}}</div>
                </div>
                <div>
                    <label>所在党组织全称</label>
                    <div class="detailContent">{{content.name}}</div>
                </div>
                <div>
                    <label>所在党组织简称</label>
                    <div class="detailContent">{{content.shortName}}</div>
                </div>
                <div>
                    <label>企业分类</label>
                    <div class="detailContent">{{content.typeList}}</div>
                </div>
                <div>
                    <label>组织人数</label>
                    <div class="detailContent">{{content.fax}}</div>
                </div>
                <div>
                    <label>组织分类</label>
                    <div class="detailContent">{{content.email}}</div>
                </div>
                <div>
                    <label>负责人</label>
                    <div class="detailContent">{{content.master}}</div>
                </div>
                <div>
                    <label>联系人</label>
                    <div class="detailContent">{{content.primaryPerson}}</div>
                </div>
                <div>
                    <label>电话</label>
                    <div class="detailContent">{{content.phone}}</div>
                </div>
                <!-- <div>
                    <label>显示顺序</label>
                      <div class="detailContent"></div>
                </div> -->
                <div>
                    <label>备注</label>
                    <div class="detailContent">{{content.remarks}}</div>
                </div>
            </div>
            <div class="button">
                <input type="button" value="返回" class="f_btn" style="color:#000;margin-left:20px" @click="onReturn">
            </div>
        </div>
    </div>
</template>

<script>
    import qs from "qs";
    import {
        postAjax,
        getAjax
    } from "../../../api/api.js";

    export default {
        created() {
            if (this.lookId) {
                this.lookMechanism(this.lookId);
            }
            this.MechanismType();
        },
        data() {
            return {
                lookId: this.$route.query.lookId,
                topName: {}, //上属省企业党组织
                content: [], //机构详情信息
                tabelType: [], //企业类别
            };
        },
        methods: {
            lookMechanism(id) {
                //机构信息
                postAjax("ajax/officeTree/sysOfficeTree/info/" + id).then(res => {
                    if (res.status == 200) {
                        this.content = res.data.data;
                        this.topName = {
                            id: res.data.data.parent.id,
                            name: res.data.data.parent.shortName
                        }
                        let wordType = "";
                        for (let i = 0; i < this.tabelType.length; i++) {
                            for (let j = 0; j < this.content.typeList.length; j++) {
                                if (this.tabelType[i].value == this.content.typeList[j]) {
                                    wordType += this.tabelType[i].label + ",";
                                }
                            }
                        }
                        this.content.typeList = wordType;
                    }
                });
            },
            MechanismType() {
                //企业类别
                postAjax("ajax/meeting/taskMeeting/getDict?type=qylb").then(res => {
                    this.tabelType = res.data;
                });
            },
            onReturn() {
                //返回
                window.history.back(-1);
            }
        }
    };

</script>

<style scoped>
    .account {
        width: 99%;
        margin: 10px auto;
        box-sizing: border-box;
        border-radius: 5px;
        padding-bottom: 20px;
    }

    .button {
        margin-left: 50px;
    }

    .create {
        padding: 10px;
        margin-top: 10px;
        font-size: 14px;
    }

    .create div {
        margin: 20px 0;
    }

    .create div a {
        margin-right: 10px;
    }

    .create div>label {
        float: left;
        margin: 0 20px;
    }

    .create div .detailContent {
        width: 80%;
        min-height: 20px;
        text-align: left;
        margin-left: 95px;
        color: #898a8f;
    }

</style>
