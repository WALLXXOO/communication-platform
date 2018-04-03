//引用模块
//引入express框架
var express = require("express");
//引入mongoose操作数据库
var mongoose = require("mongoose");
//引入express-session包
var session = require("express-session");

//连接数据库
mongoose.connect('mongodb://localhost/usersinfo');

//引入暴露的函数
//控制首页
var indexCtrl = require("./controllers/indexCtrl.js");
//控制注册页
var registCtrl = require("./controllers/registCtrl.js");
//控制登录页
var loginCtrl = require("./controllers/loginCtrl.js");
//控制个人信息页
var infoCtrl = require("./controllers/infoCtrl.js");


//创建app对象
var app = express();

//设置session 不要求懂
app.set('trust proxy', 1);
app.use(session({
    secret: 'jason',//加密字符串 随意写
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 86400000//过期时间
    }
}));

//引入模板引擎
app.set("view engine", "ejs");

//静态化www文件夹
app.use(express.static("www"));
//静态化uploads文件夹
app.use("/uploads", express.static("uploads"));

//路由清单
//访问首页
app.get("/", indexCtrl.showIndex);
//访问注册页
app.get("/regist", registCtrl.showRegist);
//注册页提交注册信息
app.post("/regist", registCtrl.doRegist);
//验证email是否存在
app.checkout("/regist", registCtrl.findEmail);
//访问登录页
app.get("/login", loginCtrl.showLogin);
//登陆页提交登录信息
app.post("/login", loginCtrl.doLogin);
//访问个人信息页
app.get("/info", infoCtrl.showInfo);
//获取个人所有信息
app.checkout("/info", infoCtrl.showAll);
//更改个人所有信息
app.post("/info", infoCtrl.changeInfo);
//提交用户头像
app.post("/uploadavatar", infoCtrl.changeAvatar);
//给form开路由
app.get("/form", infoCtrl.showForm);
//显示图片裁切页面
app.get("/cut", infoCtrl.showCut);
//进行裁切
app.post("/cut", infoCtrl.doCut);
//接收发帖图片
app.post("/sendpic", indexCtrl.doSendPic);
//给form2开路由
app.get("/form2", indexCtrl.showForm2);
//发帖
app.post("/question", indexCtrl.doQuestion);
//拉取帖子
app.get("/question", indexCtrl.getQuestion);
//获取帖子中用户的信息
app.post("/getquestioninfo", indexCtrl.findInfo);

//开启服务器监听
app.listen(8080, function (err) {
    if (err) {
        console.log("服务器开启失败！");
    } else {
        console.log("服务器开启在8080端口！");
    }
});
