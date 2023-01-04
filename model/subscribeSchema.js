// -------------------------------  Subscribe Page Schema -------------------------------------- //

const mongoose = require("mongoose");

const subscribeSchema = new mongoose.Schema({
  First_Name: {
    type: String,
    required: [true, "Please enter given name or first name"],
    minlength: 1,
    maxlength: [25, "Cannot be longer than 25 characters."],
    validate: {
      validator: function (v) {
        return /^[a-zA-Z]+$/.test(v);
      },
      message: (props) =>
        `should only contain letters. No special characters or numbers.`,
    },
  },
  Last_Name: {
    type: String,
    required: [true, "Please enter surname or last name"],
    minlength: 1,
    maxlength: [25, "Cannot be longer than 25 characters."],
    validate: {
      validator: function (v) {
        return /^[a-zA-Z- ]+$/.test(v);
      },
      message: (props) =>
        `should only contain letters. No special characters or numbers.`,
    },
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
    minlength: 1,
    maxlength: [50, "Cannot be longer than 50 characters."],
  },
  SubscriberTradeOfInterest2: {
    type: String,
    required: false,
    maxlength: [50, "Cannot be longer than 50 characters."],
  },
  SubscriberTradeOfInterest3: {
    type: String,
    required: false,
    maxlength: [50, "Cannot be longer than 50 characters."],
  },
  City: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: [58, "Cannot be longer than 58 characters."],
    validate: {
      validator: function (v) {
        return /^[a-zA-Z-. ]+$/.test(v);
      },
      message: (props) =>
        `should only contain letters. No special characters or numbers.`,
    },
  },
  Zipcode: {
    type: String,
    required: [true, "Please enter valid zipcode"],
    minlength: [5, "Please enter valid zipcode"],
    maxlength: [10, "Please enter valid zipcode"],
    validate: {
      validator: function (v) {
        return /^[1-9-]+$/.test(v);
      },
      message: (props) => `should only contain numbers.`,
    },
  },
  User_Id: {
    type: mongoose.Schema.Types.ObjectId,
    required: false,
  },
  Date: {
    type: Date,
    default: Date.now,
  },
});

const Subscriber = mongoose.model("Subscriber", subscribeSchema);

exports.Subscriber = Subscriber;

exports.subscribeSchema = subscribeSchema;
