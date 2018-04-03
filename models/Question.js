var mongoose = require("mongoose");
var Schema = new mongoose.Schema({
    "email": String,
    "content": String,
    "images": [String],
    "time": Date
});
module.exports = mongoose.model("Question", Schema);