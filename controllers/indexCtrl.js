var formidable = require("formidable");
var path = require("path");
var url = require("url");
var Question = require("../models/Question.js");
var User = require("../models/Users.js");

//显示首页
exports.showIndex = function (req, res) {
    res.render("index", {
        "column": "index",
        "login": req.session.login,
        "email": req.session.email
    });
}
//接收发帖图片
exports.doSendPic = function (req, res) {
    var form = new formidable.IncomingForm();
    var callback = url.parse(req.url, true).query.callback;
    form.keepExtensions = true;
    form.uploadDir = path.resolve(__dirname, "../uploads");
    form.parse(req, function (err, fields, files) {
        var picname = (url.parse(files.pic.path).pathname.match(/\/(upload_.+)$/)[1]);
        res.send("<script>window.parent.send_pic_finish" + callback + "('" + picname + "');</script>");
    });
}
//显示form2
exports.showForm2 = function (req, res) {
    res.render("form2", {
        callback: url.parse(req.url, true).query.callback
    });
}
//发帖
exports.doQuestion = function (req, res) {
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
        var email = req.session.email;
        var content = fields.content;
        var images = fields.images;
        var time = new Date();
        console.log(fields);

        //保存
        Question.create({
            email: email,
            content: content,
            images: images,
            time: time
        }, function () {
            res.json({
                "results": 1
            });
        });
    });
}

exports.getQuestion = function (req, res) {
    var page = Number(url.parse(req.url, true).query.page);
    var pagesize = Number(url.parse(req.url, true).query.pagesize);
    //统计总条数
    Question.count({}, function (err, count) {
        //得到当前页的帖子，按时间倒序
        Question.find({}).sort({
            "time": -1
        }).skip((page - 1) * pagesize).limit(pagesize).exec(function (err, results) {
            res.json({
                "count": count,
                "results": results
            });
        });
    });
}

exports.findInfo = function (req, res) {
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
        var email = fields.email;
        User.find({
            "email": email
        }, function (err, results) {

            if (!err && results.length != 0) {
                res.json({
                    "results": results
                });
            } else {
                res.json({
                    "results": false
                });
            }
        });
    });
}