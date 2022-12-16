var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var UserSchema = new mongoose.Schema({
    email: String,
    password: String,
    // avatar: String,
    Name: String,
    lastName: String,
});

UserSchema.plugin(passportLocalMongoose)

module.exports = mongoose.model("User", UserSchema);