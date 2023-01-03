// -------------------------------  Subscribe Page Schema -------------------------------------- //

const mongoose = require("mongoose");

const BoeSchema = new mongoose.Schema({
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
  Date: String,
});

const Application = mongoose.model("Application", BoeSchema);
const External_Applicant = mongoose.model("External_Applicant", BoeSchema);
const Subscriber = mongoose.model("Subscriber", BoeSchema);

exports.Application = Application;
exports.External_Applicant = External_Applicant;
exports.Subscriber = Subscriber;

exports.BOESchema = BoeSchema;
