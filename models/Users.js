var mongoose = require("mongoose");
var Schema = new mongoose.Schema({
    "email": String,
    "password": String,
    "nickname": {
        "type": String,
        "default": "绝对帅气"
    },
    "sex": {
        "type": String,
        "default": "男(默认)"
    },
    "introduction": {
        "type": String,
        "default": "这个家伙很懒，什么都没有留下哦！"
    },
    "avatar": {
        "type": String,
        "default": "images/qq.jpg"
    }
});
module.exports = mongoose.model("User", Schema);