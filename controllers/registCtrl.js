var formidable = require("formidable");
var User = require("../models/Users.js");
var crypto = require("crypto");
//显示注册页
exports.showRegist = function (req, res) {
    res.render("regist", {
        "column": "regist",//当前所在页面是注册页面
        "login": req.session.login,
        "email": req.session.email
    });
}
//数据注册
exports.doRegist = function (req, res) {
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
        var email = fields.email;
        //利用SHA256加密password 处理为16进制
        var password = crypto.createHash("SHA256").update(fields.password_1 + "我是JASON").digest("hex");
        //前端验证email是否被占用后 后端必须要重新验证 后端验证email没有被占用后 才可以写入新的数据
        User.count({ "email": email }, function (err, count) {
            if (count == 0) {
                User.create({
                    "email": email,
                    "password": password
                }, function (err) {
                    !err && res.json({
                        "results": 1
                    });
                });
            } else {
                res.json({ "results": 2 });//email被占用
            }
        });

    });
}
//验证email是否被占用
exports.findEmail = function (req, res) {
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
        var email = fields.email;
        User.find({
            "email": email
        }, function (err, results) {

            if (!err && results.length != 0) {
                res.json({ "results": true });
            } else {
                res.json({ "results": false });
            }
        });
    });
}