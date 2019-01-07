import Vue from 'vue';
import App from './App';
import router from './router';
import axios from 'axios';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';    // 默认主题
import echarts from 'echarts';
// import '../static/css/theme-green/index.css';       // 浅绿色主题
import '../static/css/biangeng.css'
 
//日历
import 'vue-event-calendar/dist/style.css' //1.1.10之后的版本，css被放在了单独的文件中，方便替换
import vueEventCalendar from 'vue-event-calendar'
Vue.use(vueEventCalendar, { weekStartOn: 1}) //可以设置语言，支持中文和英文
// import vueEventCalendar from '../src/'
// Vue.use(vueEventCalendar, { weekStartOn: 1})

Vue.use(require('vue-wechat-title'));

// //引入ueditor工具
import '../static/ueditor/ueditor.config.js'
import '../static/ueditor/ueditor.all.min.js'
import '../static/ueditor/lang/zh-cn/zh-cn.js'
import '../static/ueditor/ueditor.parse.min.js'


import "babel-polyfill";
window.eventBus = new Vue();
axios.defaults.withCredentials=true;//让ajax携带cookie
Vue.use(ElementUI);
Vue.prototype.$echarts = echarts;
Vue.prototype.$axios = axios;
new Vue({
    router,
    render: h => h(App)
}).$mount('#app');