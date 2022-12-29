const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 20,
  },
  email: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 20,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: null,
  },
  date: String,
});

const UserModel = mongoose.model("User", UserSchema);

exports.UserModel = UserModel;
exports.UserSchema = UserSchema;
