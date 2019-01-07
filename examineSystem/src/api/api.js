import axios from 'axios'
// 公共 url
// var oUrl = 'http://10.1.2.120:8090/gzw/admin/';//服务器
// var img = 'http://10.1.2.120:8090/gzw/admin/ajax/file/fileUpload'; //服务器附件上传
// var attachment = "http://10.1.2.120:8090"; //服务器附件上传文件预览（下载）
// var tagePage="http://10.1.2.120";  //切换页面用的地址
// var tagePageUrl = 'http://10.1.2.120:8091/gzwtj/'; //切换页面是否可以进入数据中心 查询服务器IP

// var tagePageUrl = 'http://192.168.103.116:8091/gzwtj/'; //卜宪文

// 新换的地址
// var oUrl = 'http://10.243.32.57:8090/gzw/admin/';//服务器
// var img = 'http://10.243.32.57:8090/gzw/admin/ajax/file/fileUpload'; //服务器附件上传
// var attachment = "http://10.243.32.57:8090"; //服务器附件上传文件预览（下载）
var tagePage="http://10.243.32.57:7610";  //切换页面用的地址
var tagePageUrl = 'http://10.243.32.57:8091/gzwtj/'; //切换页面是否可以进入数据中心 查询服务器IP

// 最新的地址
// var oUrl = 'http://10.1.1.156:8090/gzw/admin/';//服务器
// var img = 'http://10.1.1.156:8090/gzw/admin/ajax/file/fileUpload'; //服务器附件上传
// var attachment = "http://10.1.1.156:8090"; //服务器附件上传文件预览（下载）
// var tagePage = "http://10.1.1.156:7610";  //切换页面用的地址
// var tagePageUrl = 'http://10.1.1.156:8091/gzwtj/'; //切换页面是否可以进入数据中心 查询服务器IP

// var oUrl = 'http://192.168.103.116:80/gzw/admin/';//卜宪文
// var attachment = "http://192.168.103.116:80"; //卜宪文
// var img = 'http://192.168.103.116:80/gzw/admin/ajax/file/fileUpload'; //卜宪文

// var attachment = "http://192.168.103.172:8080"; //（张文涛）附件上传文件预览（下载）
// var oUrl = 'http://192.168.103.172:8080/gzw/admin/';//张文涛
// var img='http://192.168.103.172:8080/gzw/admin/ajax/file/fileUpload';  //张文涛

// var oUrl = 'http://liu-study.iask.in/gzw/admin/';//刘文琪(花生壳)
// var attachment = "http://liu-study.iask.in";//刘文琪(花生壳)
// var img = 'http://liu-study.iask.in/gzw/admin/ajax/file/fileUpload'; //服务器附件上传（花生壳）

var oUrl = 'http://192.168.103.126:8080/gzw/admin/';//刘文琪
var attachment = "http://192.168.103.126:8080"; //刘文琪附件上传文件预览（下载）
var img = 'http://192.168.103.126:8080/gzw/admin/ajax/file/fileUpload'; //刘文琪


// var oUrl = 'http://127.0.0.1:8090/zaozhuang-supervise/';//ng
localStorage.setItem('url', oUrl);
localStorage.setItem('attachment', attachment);
localStorage.setItem("tagePage", tagePage); //切换页面用的地址


export function oUrl() {
    return oUrl;
}
export function uploadImg() {
    return img;
}

const axiosInstance = axios.create({
    //创建一个拦截器
    timeout: 20000, //每隔20秒拦截一次
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "X-Requested-With": "XMLHttpRequest",
        "url": `${oUrl}` + `ajax/getuser`
    }
});


const axiosInstanceTwo = axios.create({  //切换页使用
  //创建一个拦截器
  timeout: 20000, //每隔20秒拦截一次
  headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "X-Requested-With": "XMLHttpRequest",
      "url": `${tagePage}` + `ajax/getuser`
  }
});

function interceptAjax(res) {
    // console.log('拦截：',res.data.state);
    //自定义一个拦截方法
    if (res.data.state == 1) {
      return res;
    }
    if (res.data.state == 0) {
        return router.push({
            path: '/sso',
        });
    }
    //系统已登录
    if (res.data.state == 401) {
        return router.push({
            path: '/sso',
        });
    }
    return res;
}

axiosInstance.interceptors.response.use(res => interceptAjax(res)); //开始拦截
axiosInstanceTwo.interceptors.response.use(res => interceptAjax(res)); //开始拦截
export function postAjax(urls, obj) { /*post方法*/
    return getPromise(`${oUrl}${urls}`, obj)
}
export function getAjax(urls, obj) { /*get方法*/
    return getPromiseget(`${oUrl}${urls}`, obj)
}

export function postTaggle(urls,obj) { /*切换页请求post方法*/
    return getPromise(`${tagePageUrl}${urls}`,obj)
}


// 封装 promise
function getPromise(url, obj) {
    return new Promise((resolve, reject) => {
        axios.post(url, obj).then(
            (response) => {
                resolve(response)
            }
        ).catch(
            (err) => {
                reject(console.log(err))
            }
        )
    })
}

function getPromiseget(url, obj) {
    return new Promise((resolve, reject) => {
        axios.get(url, {
            params: obj
        }).then(
            (response) => {
                resolve(response)
            }
        ).catch(
            (err) => {
                reject(console.log(err))
            }
        )
    })
}

