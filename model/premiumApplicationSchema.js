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
  },
  Last_Name: {
    type: String,
    required: [true, "Please enter last name"],
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
  Additional_Comments: String,
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

const PremiumApplication = mongoose.model(
  "PremiumApplication",
  premiumApplicationSchema
);

exports.PremiumApplication = PremiumApplication;

exports.premiumApplicationSchema = premiumApplicationSchema;
