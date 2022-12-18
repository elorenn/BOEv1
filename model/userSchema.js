const Joi = require("joi");
const mongoose = require("mongoose");

const UserSchema = mongoose.model(
  "User",
  new mongoose.Schema({
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
      maxlength: 7,
    },
  })
);

function validateUser(user) {
  const schema = {
    name: Joi.string().min(1).max(20).required(),
    email: Joi.string().min(2).max(20).required().email(),
    password: Joi.string().min(1).max(7).required(),
  };
  return Joi.validate(user, schema);
}

exports.UserSchema = UserSchema;
exports.validate = validateUser;
