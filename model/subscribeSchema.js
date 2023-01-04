// -------------------------------  Subscribe Page Schema -------------------------------------- //

const mongoose = require("mongoose");

const subscribeSchema = new mongoose.Schema({
  First_Name: {
    type: String,
    required: [true, "Please enter given name or first name"],
  },
  Last_Name: {
    type: String,
    required: [true, "Please enter surname or last name"],
  },
  Email: {
    type: String,
    required: [true, "Please enter your email"],
  },
  SubscriberTradeOfInterest1: {
    type: String,
    required: [
      true,
      "Please enter at least one program topic or trade that interests you in order to receive appropriate emails.",
    ],
  },
  SubscriberTradeOfInterest2: {
    type: String,
    required: false,
  },
  SubscriberTradeOfInterest3: {
    type: String,
    required: false,
  },
  City: {
    type: String,
    required: true,
  },
  Zipcode: {
    type: Number,
    required: [true, "Please enter valid zipcode"],
  },
  User_Id: {
    type: mongoose.Schema.Types.ObjectId,
    required: false,
  },
  Date: String,
});

const Subscriber = mongoose.model("Subscriber", subscribeSchema);

exports.Subscriber = Subscriber;

exports.subscribeSchema = subscribeSchema;
