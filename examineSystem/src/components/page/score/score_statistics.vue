<template>
    <div>
        <div class="headTagLy">
            <h2 class="tag" style="width:150px;">得分统计</h2>
            <div class="orglist-btn" @click="toShape">图形</div>
            <div class="orglist-btn active">列表</div>
            <div class="clear"></div>
        </div>
        <div style="width:100%;height:100%;float:left">
            <div class="ms-articleLy shadowLy">
                <div class="titleLy">得分列表</div>
                <div class="clear"></div>
                <div class="list-content">
                    <el-table border stripe :data="tableData" style="width: 100%">
                        <el-table-column type="index" label="序号" width="50">
                        </el-table-column>
                        <el-table-column prop="shortName" label="党组织名称" width="180">
                        </el-table-column>
                        <el-table-column label="日常工作得分">
                            <el-table-column sortable prop="timeScore" label="时效评分">
                            </el-table-column>
                            <el-table-column sortable prop="qualityScore" label="质量评分">
                            </el-table-column>
                            <el-table-column sortable prop="adjustScore" label="调度评分">
                            </el-table-column>
                            <el-table-column sortable prop="meetingScore" label="会议得分">
                            </el-table-column>
                            <el-table-column sortable prop="cxgzScore" label="创新工作得分">
                            </el-table-column>
                            <el-table-column sortable prop="daySumScore" label="日常总分">
                            </el-table-column>
                        </el-table-column>
                        <el-table-column sortable prop="ddjcScore" label="督导检查分数">
                        </el-table-column>
                        <el-table-column sortable prop="szpyScore" label="述职评议分数">
                        </el-table-column>
                        <el-table-column sortable prop="score" label="总得分">
                        </el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="scope" width="180">
                                <div class="f_box">
                                    <img src="../../../../static/img/Group148.png" alt="" title="查看详情" @click="toScoreDetail(scope.row.officeId)">
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
    import {
        postAjax,
        getAjax
    } from "../../../api/api.js";
    export default {
        created() {
            this.autoMove();
        },
        data() {
            return {
                tableData: [
                    // {
                    //   scoreNum: 1, //序号
                    //   orgName: "省再担保", //党组织名称
                    //   timeScore: 2, //时效评分
                    //   qualityScore: 3, //质量评分
                    //   dispatchScore: 4, //调度评分
                    //   totalScore: 9, //总得分
                    //   totalPercentage: "10%" //总得分率
                    // },
                ]
            };
        },
        methods: {
            toShape() {
                this.$router.push({
                    path: "/scoreShape"
                });
            },
            toScoreDetail(id) {
                // console.log(id);
                this.$router.push({
                    path: "/scoreDetail",
                    query: {
                        uid: id
                    }
                });
            },
            autoMove() {
                // let id=sessionStorage.getItem("id");
                let id = sessionStorage.getItem("userWordId");
                getAjax("statisticAnalysis/statistic/statisticOrgScore2?id=" + id)
                    .then(res => {
                        this.tableData = res.data.data;
                        // console.log(res.data.data);
                    })
                    .catch(err => {
                        console.log(err);
                    });
            }
        }
    };

</script>

<style scoped>
    .orglist-btn {
        width: 28px;
        height: 26px;
        line-height: 26px;
        font-size: 14px;
        border-radius: 5px;
        background-color: #cccccc;
        color: #353639;
        float: right;
        padding: 0px 10px 0px 10px;
        margin: 8px 10px 0px 0px;
        cursor: pointer;
    }

    .orglist-btn:hover {
        background-color: #e91b1b;
        color: #fff;
        cursor: pointer;
    }

    .orglist-btn.active {
        background-color: #e91b1b;
        color: #fff;
    }

    .green-article {
        border: #3cc56d 1px solid;
        background-color: rgb(233, 247, 238);
    }

    .orange-article {
        border: #f9bf2c 1px solid;
        background-color: rgb(245, 239, 224);
    }

    .list-content {
        float: left;
        margin: 4px 0px 0px 20px;
        width: 97%;
        padding-bottom: 5px;
    }

    /* table的公共样式 */
    .has-gutter {
        height: 25px;
    }

    .el-table th,
    .el-table tr>th {
        background: #ececec;
    }

    .el-table {
        position: relative;
        overflow: hidden;
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
        -webkit-box-flex: 1;
        -ms-flex: 1;
        flex: 1;
        width: 100%;
        max-width: 100%;
        font-size: 14px;
        color: #606266;
        border: solid 1px #ececec;
        border-radius: 5px;
        /* border: #ccc solid 1px; */
    }

</style>
