<template>
<div>
  <div class="wrapper" @click="open(event)">
    <!-- <h3 class="title">{{index+1}}. {{event.title}}</h3> -->
      <p class="time">{{dateTimeFormatter(Date.parse(new Date(event.date)),i18n[locale].fullFormat)}}</p>
      <p class="desc">{{event.desc}}</p>

    
  </div>
  <el-dialog title="日程详情" :visible.sync="dialogTableVisible" class="box">
    <ul>
       <li>
         <strong>日程主题:</strong>
         <div>{{content.title}}</div>
         </li>
       <li>
         <strong>日程内容:</strong>
         <div>{{content.desc}}</div>
         </li>
       <li>
         <strong>提醒日期:</strong>
         <div>{{content.date}}</div>
         </li>
    </ul>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogTableVisible = false">确 定</el-button>
      </div>
</el-dialog>
</div>
  
</template>
<script>
import i18n from '../i18n.js'
import { dateTimeFormatter } from '../tools.js'
export default {
  data () {
    return {
      i18n,
      content:"",
      dialogTableVisible:false
    }
  },
  props: {
    event: {
      type: Object,
      required: true
    },
    index: {
      type: Number,
      required: true
    },
    locale: {
      type: String,
      required: true
    }
  },
  methods: {
    dateTimeFormatter,
    open(title){
      this.content=title;
      this.dialogTableVisible=true;
     
    }
  }
}
</script>
<style scoped>
.box{
  width: 90%;
  margin: 0 auto;
}
.box li{
  width: 80%;
  min-height: 30px;
  margin: 0 auto;
  padding: 5px 0;
} 
.box li strong{
  padding-right: 10px;
  float: left;
}
.box li div{
  margin-left: 80px;
}
</style>
