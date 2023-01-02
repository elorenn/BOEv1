const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const mongoose = require("mongoose");
const File = require("./model/fileSchema");
const multer = require("multer");

const app = express();

// Set up code
app.set("view engine", "ejs");
app.set("views", "views");
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: true }));

// -------------------------------  Subscribe Page Schema -------------------------------------- //

const BOESchema = new mongoose.Schema({
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

// --------------------------------------------------------------------- //

// Multer file storage
const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public");
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split("/")[1];
    cb(null, `files/${req.body.organization + "_" + req.body.email}.${ext}`);
  },
});

const upload = multer({
  storage: multerStorage,
});

// Get application data
app.post("/", upload.single("resume"), async (req, res) => {
  const postedDate = new Date().toLocaleDateString("en-us", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
  });
  const Application = mongoose.model("Application", BOESchema);
  const application = new Application({
    Organization: req.body.organization,
    First_Name: req.body.firstname,
    Last_Name: req.body.lastname,
    Email: req.body.email,
    AppliedForTrade: req.body.appliedForTrade,
    Additional_Comments: req.body.additionalcomments,
    Date: postedDate,
  });
  application.save();
  res.redirect("/applicationSubmitted");
});

// Redirect to external application page, store user data
app.post("/index.html2", function (req, res) {
  const postedDate = new Date().toLocaleDateString("en-us", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
  });
  const External_Applicant = mongoose.model("External_Applicant", BOESchema);
  const external_applicant = new External_Applicant({
    Organization: req.body.organization,
    Date: postedDate,
  });
  external_applicant.save();
  res.redirect(req.body.orgApplicationURL);
});

// --------------------------------------------------------------------- //
// Subcriber Page - Save to Database

app.post("/usersignup", function (req, res) {
  try {
    const postedDate = new Date().toLocaleDateString("en-us", {
      year: "numeric",
      month: "numeric",
      day: "numeric",
    });

    // store in BOE database
    const Subscriber = mongoose.model("Subscriber", BOESchema);
    const subscriber = new Subscriber({
      First_Name: req.body.fname,
      Last_Name: req.body.lname,
      Email: req.body.email,
      City: req.body.city,
      Zipcode: req.body.zipcode,
      SubscriberTradeOfInterest1: req.body.trade1,
      SubscriberTradeOfInterest2: req.body.trade2,
      SubscriberTradeOfInterest3: req.body.trade3,
      Date: postedDate,
    });
    subscriber.save();
    res.redirect("/success");
  } catch {
    res.redirect("/failure");
  }
});

app.post("/failure", function (req, res) {
  res.redirect("/subscribe.ejs"); // is this doing anything?
});

app.post("/success", function (req, res) {
  res.redirect("/"); // is this doing anything?
});

module.exports = app;
