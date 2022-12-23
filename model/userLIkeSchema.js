const Joi = require("joi");
const mongoose = require("mongoose");

const UserLikeSchema = new mongoose.Schema({
  user_id: {
    type: String,
    required: true,
  },
  school_id: {
    type: String,
    required: true,
  },
});

const UserLikeModel = mongoose.model("UserLike", UserLikeSchema);

exports.UserLike = UserLikeModel;
exports.UserLikeSchema = UserLikeSchema;
