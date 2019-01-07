<template>
    <div>
        <vue-event-calendar
                :events="demoEvents"
                @day-changed="handleDayChanged"
                @month-changed="handleMonthChanged"
        ></vue-event-calendar>
        <!-- 添加日程按钮 -->
        <p @click="addCalendar"></p>
        <ul>
            <li><i class="icon"></i>任务截止</li>
            <li><i class="icon icongreen"></i>任务已完成</li>
            <li><i class="icon iconBlue"></i>存在日程</li>
        </ul>
        <!-- 添加弹框 -->
        <el-dialog title="添加日程" :visible.sync="dialogFormVisible">
            <el-form :model="form" label-width="100px" label-position="right">
                <el-form-item label="主题">
                    <el-input type="input" v-model="form.title" style="width:80%;"></el-input>
                </el-form-item>
                <el-form-item label="提醒日期">
                    <el-date-picker
                      v-model="form.warndate"
                      value-format="yyyy-MM-dd"
                      type="date"
                      style="width:80%;"
                      placeholder="选择提醒日期">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="日程内容">
                    <el-input type="textarea" v-model="form.content" style="width:80%;"></el-input>
                </el-form-item>
                <!-- <el-form-item label="创建人">
                    <el-input type="input" v-model="form.createuser" style="width:80%;"></el-input>
                </el-form-item> -->
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="addCalendarBtn">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import {
  postAjax,
  getAjax,
  uploadImg
} from "../../../api/api.js";
import vueEventCalendar from './vueEventCalendar.vue';
let today = new Date();
export default {
  components: {
    vueEventCalendar
  },
  data() {
    return {
      dialogFormVisible: false, //添加时间弹窗
      addTime: "",  //添加日程得所需信息
      form: {
        title: "", //添加日程标题
        warndate: "",  //添加提醒日期
        content: "",   //提醒内容
        createuser: ""  //添加创建人
      },
      demoEvents: [],   //最终的日历存在历程列表
      calendarlist: [],   //存在日程（自定义任务）list
      completelist: [],   //上级考核完成（任务完成）list（结构同 endlist）
      endlist: [],        //截止任务list
    };
  },
  mounted() {
     let tempDate = new Date();
      let year = tempDate.getFullYear();
      let month = tempDate.getMonth() + 1;
      let currentDate = year + '-' + month;
    this.initcaledar(currentDate);
  },
  methods: {
    initcaledar(data) {  //初始化日历数据
      // let tempDate = new Date();
      // let year = tempDate.getFullYear();
      // let month = tempDate.getMonth() + 1;
      // let currentDate = year + '-' + month;
      this.demoEvents = [];
      getAjax("ajax/index/calendarlist?endDate=" + data)
        .then(res => {
          if (res.data.state == 1) {
            let formlist = res.data.data;

            this.calendarlist = formlist.calendarlist;
            for (let i in this.calendarlist) {
              this.demoEvents.push({
                date: this.calendarlist[i].warndate,
                title: "存在日程",
                desc: this.calendarlist[i].content
              });
            }
            this.completelist = formlist.completelist;
            for (let i in this.completelist) {
              this.demoEvents.push({
                date: this.completelist[i].warnDate,
                title: "任务已完成",
                desc: this.completelist[i].content
              });
            };
            this.endlist = formlist.endlist;
            for (let i in this.endlist) {
              this.demoEvents.push({
                date: this.endlist[i].warnDate,
                title: "任务截止",
                desc: this.endlist[i].content
              });
            };
          };
        })
    },
    addCalendarBtn() {   //添加日程
      if(this.form.title.length >=50 ){
        this.$message({
          type:"warning",
          message:"主题字数不得超过50字"
        });
        return;
      }
      if(this.form.title.length =="" ){
        this.$message({
          type:"warning",
          message:"主题字数不能为空"
        });
        return;
      }
      if(this.form.warndate == undefined ){
        this.$message({
          type:"warning",
          message:"提醒日期不能为空"
        });
        return;
      }
      if(this.form.content == "" ){
        this.$message({
          type:"warning",
          message:"日程内容不能为空"
        });
        return;
      }
      if(this.form.content.length >= 500 ){
        this.$message({
          type:"warning",
          message:"日程内容字数不得超过500字"
        });
        return;
      }
      postAjax("calendarnew/tTaskCalendar/save", this.form)
        .then(res => {
          // console.log(res);
          if (res.data.state == 1) {
            this.$message({
              message: res.data.message,
              type: "success"
            });
            this.dialogFormVisible = false;   //关闭弹窗
           //刷新日历数据
            let num =this.form.warndate.split("-");
            let date=num[0]+"-"+num[1];
            this.initcaledar(date); 

          } else {
            this.$message({
              message: res.data.message,
              type: "error"
            });
          };
        })
    },
    handleDayChanged(data) {  //点击日历获取时间
      // console.log("date-changed", data);
      this.addTime = data;
      let oldTime = data.date;
      let oldTimeArray = oldTime.split('/');
      let newTime = oldTimeArray.join('-');
      this.form.warndate = newTime; //自动获取已点击的时间值
    },
    handleMonthChanged(data) {
      /***************年月分割start*****************/
      let yearWord = data.split('年');
      let year = yearWord.shift();
      let monthWord = yearWord.pop();
      let monthArray = monthWord.split('月');
      let month = monthArray.shift();
      let finalData = year + '-' + month;
      /***************年月分割end*****************/
      this.demoEvents = [];
      getAjax("ajax/index/calendarlist?endDate=" + finalData)
        .then(res => {
          // console.log(res)
          if (res.data.state == 1) {
            let formlist = res.data.data;
            this.calendarlist = formlist.calendarlist;
            for (let i in this.calendarlist) {
              this.demoEvents.push({
                date: this.calendarlist[i].warndate,
                title: "存在日程",
                desc: this.calendarlist[i].content
              });
            }
            this.completelist = formlist.completelist;
            for (let i in this.completelist) {
              this.demoEvents.push({
                date: this.completelist[i].warnDate,
                title: "任务已完成",
                desc: this.completelist[i].content
              });
            };
            this.endlist = formlist.endlist;
            for (let i in this.endlist) {
              this.demoEvents.push({
                date: this.endlist[i].warnDate,
                title: "任务截止",
                desc: this.endlist[i].content
              });
            };
          };
        })
    },

    addCalendar() {
        this.form = {
          title: "", //添加日程标题
          content: "",   //提醒内容
          createuser: ""  //添加创建人
        }
      this.dialogFormVisible = true;
      // console.log(this.addTime);
    },
  }
};
</script>

<style scoped>
.__vev_calendar-wrapper .cal-wrapper {
  width: 50%;
  padding: 100px 50px;
}

.__vev_calendar-wrapper .cal-wrapper .date-num {
  line-height: 50px;
}

.__vev_calendar-wrapper .events-wrapper .cal-events {
  height: 90% !important;
  overflow-y: auto;
}
.events-wrapper {
  width: 50%;
  background-color: #f29543;
  color: #ffffff;
  padding: 40px 45px;
  position: absolute;
  left: 50%;
  top: 0;
  bottom: 0;
}

.calendar p {
  width: 25px;
  height: 25px;
  background-image: url("../../../../static/img/add.png");
  background-size: 25px 25px;
  /* font-size: 20px;
  line-height: 27px;
  text-align: center;
  font-weight: bolder;
  color: white;
  background-color: #e68285; */
  position: absolute;
  top: 10px;
  right: 32px;
  /* border-radius: 50%; */
  cursor: pointer;
}
.calendar ul {
  width: 48%;
  border: 1px solid #cccccc;
  border-radius: 5px;
  position: absolute;
  bottom: 0;
  left: 0;
}
.calendar ul li {
  width: 29%;
  text-align: right;
  padding: 10px 0;
  margin: 0 2px;
  float: left;
  position: relative;
  margin-right: 5px;
}
.calendar ul li:nth-child(2) {
  margin-left: 10px;
}
.icon {
  width: 20px;
  height: 20px;
  position: absolute;
  top: 10px;
  left: 30px;
  background: #f4b1b1;
  border-radius: 50%;
}
.icongreen {
  left: 15px;
  background: #c3edd2;
}
.iconBlue {
  background: #d6d7f7;
}
</style>