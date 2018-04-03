var formidable = require("formidable");
var User = require("../models/Users.js");
var crypto = require("crypto");
var path = require("path");
var url = require("url");
var gm = require("gm");
//显示个人信息页
exports.showInfo = function (req, res) {
    if (!req.session.login) {
        res.render("infoagain", {
            "column": "infoagain",
            "login": req.session.login,
            "email": req.session.email
        });
        return;
    }
    res.render("info", {
        "column": "info",//当前所在页面是个人信息页面
        "login": req.session.login,
        "email": req.session.email
    });
}

//显示个人全部资料
exports.showAll = function (req, res) {
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
        var email = fields.email;
        User.find({
            "email": email
        }, function (err, results) {
            if (!err && results.length != 0) {
                res.json({ "results": results });
            }
        });
    });
}

//更改个人全部资料
exports.changeInfo = function (req, res) {
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
        var email = fields.email;
        var k = fields.k;
        var v = fields.v;
        User.find({ "email": email }, function (err, results) {
            var item = results[0];
            item[k] = v;
            console.log(item);
            item.save((err) => {
                !err && res.json({ "results": 1 });
            });
        });
    });
}

//提交用户上传的头像
exports.changeAvatar = function (req, res) {
    var form = new formidable.IncomingForm();
    form.uploadDir = path.resolve(__dirname, "../uploads");
    form.keepExtensions = true;
    form.parse(req, function (err, fields, files) {
        var picname = (url.parse(files.avatar.path).pathname.match(/\/(upload_.+)$/)[1]);
        req.session.picname = picname;
        res.redirect("/cut");
    });
}

//显示form页面
exports.showForm = function (req, res) {
    res.render("form", {
        "column": "form",
        "login": req.session.login,
        "email": req.session.email
    });
}


//显示裁切页面
exports.showCut = function (req, res) {
    //在这里用gm得到图片的尺寸！
    var avatarurl = path.resolve(__dirname, "../uploads") + "\\" + req.session.picname;
    console.log(avatarurl);
    gm(avatarurl).size(function (err, size) {
        //得到尺寸，用户上传图片的原始尺寸我们称为origin_w、origin_h
        var origin_w = size.width;
        var origin_h = size.height;
        //约束图片在410*400之间
        //看看这个图片宽高比有没有超过410 / 400 看看这个图片是宽图还是高图
        if (origin_w / origin_h >= 410 / 400 && origin_w > 410) {
            //让图片的显示尺寸为（等比例变化）
            var view_w = 410;
            var view_h = (410 / origin_w) * origin_h;
        } else if (origin_w / origin_h <= 410 / 400 && origin_h > 400) {
            var view_h = 400;
            var view_w = (400 / origin_h) * origin_w;
        } else {
            var view_w = origin_w;
            var view_h = origin_h;
        }
        console.log(view_w, view_h);
        res.render("cut", {
            "picname": req.session.picname,
            "view_w": view_w,
            "view_h": view_h,
            "origin_w": origin_w,
            "origin_h": origin_h
        });
    });
}

//进行裁切
exports.doCut = function (req, res) {
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
        //得到前端传过来的四个参数：
        var rate = fields.rate;
        var cut_x_position = Number(fields.cut_x_position) * rate;
        var cut_y_position = Number(fields.cut_y_position) * rate;
        var cut_pic_width = Number(fields.cut_pic_width) * rate;
        var cut_pic_height = Number(fields.cut_pic_height) * rate;


        var picurl = path.resolve(__dirname, "../uploads") + "\\" + req.session.picname;
        //让gm开始裁剪！
        gm(picurl).crop(cut_pic_width, cut_pic_height, cut_x_position, cut_y_position).write(picurl, function (err) {
            //数据库持久
            User.update({ "email": req.session.email }, { "$set": { "avatar": "/uploads/" + req.session.picname } }, function () {
                res.json({ "result": 1 });
            })

        });
    });
}