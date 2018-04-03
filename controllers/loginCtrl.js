var formidable = require("formidable");
var User = require("../models/Users.js");
var crypto = require("crypto");
//显示登录页
exports.showLogin = function (req, res) {
    if (req.session.login) {
        res.render("dologinagain", {
            "column": "login", //当前所在页面是登录页面
            "login": req.session.login,
            "email": req.session.email
        });
        return;
    }
    res.render("login", {
        "column": "login", //当前所在页面是登录页面
        "login": req.session.login,
        "email": req.session.email
    });
}
//数据登录
exports.doLogin = function (req, res) {
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
        var email = fields.email;
        //利用SHA256加密password 处理为16进制
        var password = crypto.createHash("SHA256").update(fields.password + "我是JASON").digest("hex");
        //前端验证email是否被占用后 后端必须要重新验证 后端验证email没有被占用后 才可以写入新的数据
        User.count({
            "email": email,
            "password": password
        }, function (err, count) {
            if (count == 1) {
                req.session.login = true;
                req.session.email = email;
                res.json({
                    "results": 1
                }); //登录成功
            } else {
                res.json({
                    "results": 0
                }); //登录失败
            }
        });

    });
}