// -------------------------------  Subscribe Page Schema -------------------------------------- //

const mongoose = require("mongoose");

const externalApplicationSchema = new mongoose.Schema({
  Organization: {
    type: String,
    required: true,
  },
  User_Id: {
    type: mongoose.Schema.Types.ObjectId,
    required: false,
  },
  School_Id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  Date: {
    type: String,
    required: true,
  },
});

const ExternalApplication = mongoose.model(
  "ExternalApplication",
  externalApplicationSchema
);

exports.ExternalApplication = ExternalApplication;

exports.externalApplicationSchema = externalApplicationSchema;
