// -------------------------------  Subscribe Page Schema -------------------------------------- //

const mongoose = require("mongoose");

const premiumApplicationSchema = new mongoose.Schema({
  Organization: {
    type: String,
    required: true,
  },
  First_Name: {
    type: String,
    required: [true, "Please enter first name"],
    validate: {
      validator: function (v) {
        return /^[a-zA-Z-. ]+$/.test(v);
      },
      message: (props) =>
        `should only contain letters, spaces, or dashes (-). No special characters or numbers.`,
    },
  },
  Last_Name: {
    type: String,
    required: [true, "Please enter last name"],
    validate: {
      validator: function (v) {
        return /^[a-zA-Z-. ]+$/.test(v);
      },
      message: (props) =>
        `should only contain letters, spaces, or dashes (-). No special characters or numbers.`,
    },
  },
  Email: {
    type: String,
    required: [true, "Please enter email"],
  },
  AppliedForTrade: {
    type: String,
    required: [true, "Please enter your trade of interest"],
  },
  Resume: String,
  Additional_Comments: {
    type: String,
    required: false,
    maxlength: [1000, "Cannot be longer than 1000 characters."],
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
    type: Date,
    default: Date.now,
  },
});

const PremiumApplication = mongoose.model(
  "PremiumApplication",
  premiumApplicationSchema
);

exports.PremiumApplication = PremiumApplication;

exports.premiumApplicationSchema = premiumApplicationSchema;
