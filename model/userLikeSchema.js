const mongoose = require("mongoose");

const UserLikeSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  school_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  is_liked: {
    type: Boolean,
    required: true,
  },
  Date: {
    type: Date,
    default: Date.now,
  },
});

const UserLikeModel = mongoose.model("UserLike", UserLikeSchema);

exports.UserLike = UserLikeModel;
exports.UserLikeSchema = UserLikeSchema;
