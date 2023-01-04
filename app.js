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

// -------------------------------  Schemas -------------------------------------- //

const { subscribeModel, subscribeSchema } = require("./model/subscribeSchema");
app.set("subscribeModel", subscribeModel);

const {
  externalApplicationModel,
  externalApplicationSchema,
} = require("./model/externalApplicationSchema");
app.set("externalApplicationModel", externalApplicationModel);

const {
  premiumApplicationModel,
  premiumApplicationSchema,
} = require("./model/premiumApplicationSchema");
app.set("premiumApplicationModel", premiumApplicationModel);

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
  const user = await req.app.get("user");
  let userId;
  if (user) {
    userId = user.id;
  }
  const PremiumApplication = mongoose.model(
    "PremiumApplication",
    premiumApplicationSchema
  );
  const premiumApplication = await new PremiumApplication({
    Organization: req.body.organization,
    First_Name: req.body.firstname,
    Last_Name: req.body.lastname,
    Email: req.body.email,
    AppliedForTrade: req.body.appliedForTrade,
    Additional_Comments: req.body.additionalcomments,
    User_Id: userId,
    School_Id: req.body.org_id,
    Date: postedDate,
  });
  console.log(premiumApplication);
  premiumApplication.save();
  res.redirect("/applicationSubmitted");
});

// Redirect to external application page, store user data
app.post("/externalApp", async (req, res) => {
  const postedDate = new Date().toLocaleDateString("en-us", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
  });
  const user = await req.app.get("user");
  let userId;
  if (user) {
    // if user is logged in, save user id with application
    userId = user.id;
  }
  const ExternalApplication = mongoose.model(
    "ExternalApplication",
    externalApplicationSchema
  );
  const externalApplication = await new ExternalApplication({
    Organization: req.body.organization,
    User_Id: userId,
    School_Id: req.body.org_id,
    Date: postedDate,
  });
  console.log(externalApplication);
  externalApplication.save();
  res.redirect(req.body.orgApplicationURL);
});

// --------------------------------------------------------------------- //
// Subcriber Page - Save to Database

app.post("/usersignup", async (req, res) => {
  try {
    const postedDate = new Date().toLocaleDateString("en-us", {
      year: "numeric",
      month: "numeric",
      day: "numeric",
    });
    const user = await req.app.get("user");
    let userId;
    if (user) {
      userId = user.id;
    }
    // store in BOE database for email newsletter
    const Subscriber = mongoose.model("Subscriber", subscribeSchema);
    const subscriber = await new Subscriber({
      First_Name: req.body.fname,
      Last_Name: req.body.lname,
      Email: req.body.email,
      City: req.body.city,
      Zipcode: req.body.zipcode,
      SubscriberTradeOfInterest1: req.body.trade1,
      SubscriberTradeOfInterest2: req.body.trade2,
      SubscriberTradeOfInterest3: req.body.trade3,
      User_Id: userId,
      Date: postedDate,
    });
    console.log(subscriber);
    subscriber.save();
    res.redirect("/success");
  } catch {
    res.redirect("/failure");
  }
});

module.exports = app;
