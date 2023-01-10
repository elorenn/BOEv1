// -------------------------------  Subscribe Page Schema -------------------------------------- //

const mongoose = require("mongoose");

const TradeInterestsSchema = new mongoose.Schema({
  Trade_Interest_01: {
    type: String,
    required: [
      true,
      "Please enter at least one program topic or trade that interests you in order to receive appropriate emails.",
    ],
    minlength: 1,
    maxlength: [50, "Cannot be longer than 50 characters."],
  },
  Trade_Interest_02: {
    type: String,
    required: false,
    maxlength: [50, "Cannot be longer than 50 characters."],
  },
  Trade_Interest_03: {
    type: String,
    required: false,
    maxlength: [50, "Cannot be longer than 50 characters."],
  },
});

const SubscriberLocationSchema = new mongoose.Schema({
  State: {
    type: String,
    required: [true, "Please enter your State"],
    validate: {
      validator: function (v) {
        return /^[a-zA-Z- ]+$/.test(v);
      },
      message: (props) =>
        `should only contain letters. No special characters or numbers. Please enter a valid state`,
    },
  },
  City: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: [58, "Cannot be longer than 58 characters."],
    validate: {
      validator: function (v) {
        return /^[a-zA-Z- ]+$/.test(v);
      },
      message: (props) =>
        `should only contain letters. No special characters or numbers. Please enter a valid city`,
    },
  },
  Zipcode: {
    type: String,
    required: [true, "Please enter valid ZIP code"],
    minlength: [
      5,
      "That looks too short to be a Zip code. Please enter valid ZIP code",
    ],
    maxlength: [
      10,
      "That looks too long to be a Zip code. Please enter valid ZIP code",
    ],
    validate: {
      validator: function (v) {
        return /^[0-9- ]+$/.test(v);
      },
      message: (props) =>
        `should only contain numbers.  Please enter a valid ZIP code`,
    },
  },
});

const subscribeSchema = new mongoose.Schema({
  First_Name: {
    type: String,
    required: [true, "Please enter given name or first name"],
    minlength: 1,
    maxlength: [25, "Cannot be longer than 25 characters."],
    validate: {
      validator: function (v) {
        return /^[a-zA-Z- ]+$/.test(v);
      },
      message: (props) =>
        `should only contain letters, spaces, or dashes (-). No special characters or numbers.`,
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
        `should only contain letters, spaces, or dashes (-). No special characters or numbers.`,
    },
  },
  Email: {
    type: String,
    required: [true, "Please enter your email"],
  },
  Trade_Interests: TradeInterestsSchema,
  Location: SubscriberLocationSchema,
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
