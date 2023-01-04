// -------------------------------  Subscribe Page Schema -------------------------------------- //

const mongoose = require("mongoose");

const premiumApplicationSchema = new mongoose.Schema({
  Organization: String,
  First_Name: {
    type: String,
    required: [false, "Please enter first name"],
  },
  Last_Name: {
    type: String,
    required: [false, "Please enter last name"],
  },
  Email: {
    type: String,
    required: [false, "Please enter email"],
  },
  AppliedForTrade: String,
  Resume: String,
  SubscriberTradeOfInterest1: String,
  SubscriberTradeOfInterest2: String,
  SubscriberTradeOfInterest3: String,
  City: String,
  Zipcode: {
    type: Number,
    required: [false, "Please enter numeric value"],
  },
  Additional_Comments: String,
  User_Id: {
    type: mongoose.Schema.Types.ObjectId,
    required: false,
  },
  School_Id: {
    type: mongoose.Schema.Types.ObjectId,
    required: false,
  },
  Date: String,
});

const PremiumApplication = mongoose.model("PremiumApplication", premiumApplicationSchema);

exports.PremiumApplication = PremiumApplication;

exports.premiumApplicationSchema = premiumApplicationSchema;
