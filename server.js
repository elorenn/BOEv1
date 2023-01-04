const app = require("./app");
const mongoose = require("mongoose");
const { UserModel, UserSchema } = require("./model/userSchema");
const users = [];
const DB =
  "mongodb+srv://boepartners:missyangus123@cluster0.dm8gvgf.mongodb.net/BOE";

process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTION, APP SHUTTING NOW!!");
  console.log(err.message, err.name);
  process.exit(1);
});

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    autoIndex: true,
  })
  .then(() => {
    console.log("DB connected successfully");
  });

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, function () {
  console.log("Server has started");
});

// register sign up

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");

const bcrypt = require("bcrypt");
const passport = require("passport");
const flash = require("express-flash");
const session = require("express-session");
const methodOverride = require("method-override");
const MongoStore = require("connect-mongo");
const { School } = require("./model/schoolSchema");
const { UserLike } = require("./model/userLikeSchema");

app.set("view-engine", "ejs");
app.use(express.urlencoded({ extended: false }));
app.use(flash());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    unique: false,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl:
        "mongodb+srv://boepartners:missyangus123@cluster0.dm8gvgf.mongodb.net/BOE",
      collectionName: "sessions",
    }),
    cookie: {
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);
require("./passport-config");
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride("_method"));

// -------------------------------- ROUTES ------------------------------------- //

app.get("/", async (req, res) => {
  const schools = await School.find();
  const user = req.app.get("user");
  let name = ":name";
  let email = "";
  if (user) {
    const userLikes = await UserLike.find({ user_id: user.id });
    name = req.user.name;
    email = req.user.email;
    schools.forEach((school) => {
      const userLike = userLikes.find((like) =>
        school._id.equals(like.school_id)
      );
      school.is_liked = userLike ? userLike.is_liked : false;
    });
  }

  res.render("pages/index", {
    name: name,
    email: email,
    schools: schools,
    title: "Home Page",
    path: "/",
    isAuthenticated: req.isAuthenticated(),
  });
});

app.get("/success", (req, res) => {
  const user = req.app.get("user");
  let name = ":name";
  if (user) {
    name = req.user.name;
  }
  res.render("pages/success", {
    name: name,
    path: "/success",
    title: "Success",
    isAuthenticated: req.isAuthenticated(),
  });
});

app.get("/failure", (req, res) => {
  const user = req.app.get("user");
  let name = ":name";
  if (user) {
    name = req.user.name;
  }
  res.render("pages/failure", {
    name: name,
    path: "/failure",
    title: "Failure",
    isAuthenticated: req.isAuthenticated(),
  });
});

app.get("/applicationSubmitted", (req, res) => {
  const user = req.app.get("user");
  let name = ":name";
  if (user) {
    name = req.user.name;
  }
  res.render("pages/applicationSubmitted", {
    name: name,
    path: "/application-submitted",
    title: "Application Submitted",
    isAuthenticated: req.isAuthenticated(),
  });
});

app.get("/resources", (req, res) => {
  const user = req.app.get("user");
  let name = ":name";
  if (user) {
    name = req.user.name;
  }
  res.render("pages/resources", {
    name: name,
    title: "Resources",
    path: "/resources",
    isAuthenticated: req.isAuthenticated(),
  });
});

app.get("/contact", (req, res) => {
  const user = req.app.get("user");
  let name = ":name";
  if (user) {
    name = req.user.name;
  }
  res.render("pages/contact", {
    name: name,
    title: "Contact Us",
    path: "/contact",
    isAuthenticated: req.isAuthenticated(),
  });
});

app.get(`/profile/:name`, checkAuthenticated, async (req, res) => {
  const schools = await School.find();
  const user = req.app.get("user");
  if (user) {
    const userLikes = await UserLike.find({ user_id: user.id });
    schools.forEach((school) => {
      const userLike = userLikes.find((like) =>
        school._id.equals(like.school_id)
      );
      school.is_liked = userLike ? userLike.is_liked : false;
    });
  }
  res.render("pages/profile", {
    title: req.user.name + " Profile",
    path: "/profile",
    schools: schools,
    name: req.user.name,
    email: req.user.email,
    date: req.user.date,
    createdAt: req.user.CreatedAt,
    isAuthenticated: req.isAuthenticated(),
  });
});

// ------------------------------------- SUBSCRIBE - Save to Database ------------------------------------- //

const { subscribeModel, subscribeSchema } = require("./model/subscribeSchema");
app.set("subscribeModel", subscribeModel);

app.get("/subscribe", (req, res) => {
  const user = req.app.get("user");
  let name = ":name";
  let email = "";
  if (user) {
    name = req.user.name;
    email = req.user.email;
  }
  res.render("pages/subscribe", {
    name: name,
    email: email,
    title: "Subscribe",
    path: "/subscribe",
    isAuthenticated: req.isAuthenticated(),
  });
});

app.post("/usersignup", async (req, res) => {
  try {
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
    });
    console.log(subscriber);
    subscriber.save();
    res.redirect("/success");
  } catch {
    res.redirect("/failure");
  }
});

// ------------------------------------- Multer file storage for premium application ------------------------------------- //

const File = require("./model/fileSchema");
const multer = require("multer");

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

// ------------------------------------- PREMIUM APPLY - Save to Database ------------------------------------- //

const {
  premiumApplicationModel,
  premiumApplicationSchema,
} = require("./model/premiumApplicationSchema");
app.set("premiumApplicationModel", premiumApplicationModel);

app.post("/", upload.single("resume"), async (req, res) => {
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
  });
  console.log(premiumApplication);
  premiumApplication.save();
  res.redirect("/applicationSubmitted");
});

// ------------------------------------- EXTERNAL APPLY - Save to Database ------------------------------------- //

const {
  externalApplicationModel,
  externalApplicationSchema,
} = require("./model/externalApplicationSchema");
app.set("externalApplicationModel", externalApplicationModel);

app.post("/externalApp", async (req, res) => {
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
  });
  console.log(externalApplication);
  externalApplication.save();
  // Redirect to external application page
  res.redirect(req.body.orgApplicationURL);
});

// -------------------------------- LOG IN ------------------------------------- //

app.get("/login", checkNotAuthenticated, (req, res) => {
  res.render("pages/login", {
    title: "Log In",
    path: "/login",
    info: req.flash("info"),
    isAuthenticated: req.isAuthenticated(),
  });
});

app.post("/login", checkNotAuthenticated, (req, res, next) => {
  passport.authenticate("local-signin", (error, user, msg) => {
    if (error) {
      console.log(error);
      next(error);
    }

    if (!user) {
      console.log("ERROR logging in: ", msg.message);
      req.flash("error", msg.message); // shows message from passport-config
      return res.redirect("back");
    }

    // Call passport logIn method
    req.logIn(user, (error) => {
      if (error) {
        console.log("ERROR reaching profile: " + error); // Failed to serialize user into session.
        req.flash("error", "Something went wrong. Please try again.");
        return res.redirect("back");
      }
      req.app.set("user", {
        id: user.id,
        name: user.name,
        email: user.email,
      });

      res.redirect("/profile/" + user.name.toLowerCase());
    });
  })(req, res, next);
});

// -------------------------------- Register / Sign Up Page - Save to Database - LO ------------------------------------- //

app.get("/register", checkNotAuthenticated, (req, res) => {
  res.render("./pages/register", {
    title: "Register",
    path: "/register",
    regError: req.flash("regError"),
    isAuthenticated: req.isAuthenticated(),
  });
});

app.set("UserModel", UserModel);

app.post("/register", checkNotAuthenticated, async (req, res) => {
  try {
    const postedDate = new Date().toLocaleDateString("en-us", {
      year: "numeric",
      month: "numeric",
      day: "numeric",
    });
    const favSchools = [];
    const hashedPassword = await bcrypt.hash(
      req.body.password,
      bcrypt.genSaltSync(8)
    );
    const User = mongoose.model("User", UserSchema);
    const user = new User({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
      date: postedDate,
      favorites: favSchools,
    });

    const err = user.validateSync();
    if (err) {
      req.flash("regError", err.message);
      return res.redirect("back");
    } else {
      // validation passed
      console.log(user);
      user.save();
      users.push(user);
      res.redirect("/login");
    }
  } catch {
    res.redirect("/register");
  }
});

// -------------------------------- USER LIKES FAVORITES ------------------------------------- //

app.post("/user-likes", async function (req, res) {
  const user = req.app.get("user");
  const schoolId = req.body.school_id;

  if (!user || !user.id || !schoolId) {
    if (!user) {
      // user not logged in
      req.flash("info", "Please log in to like listings.");
      res.redirect("/login");
    }
    return null; // @TO-DO: handle errors
  }

  const query = {
    school_id: schoolId,
    user_id: user.id,
  };

  const userLike = await UserLike.findOne(query);
  const isLiked = userLike ? !userLike.is_liked : true;

  const userLikeData = {
    user_id: user.id,
    school_id: schoolId,
    is_liked: isLiked,
  };

  const options = { upsert: true };
  await UserLike.findOneAndUpdate(query, userLikeData, options);
  res.redirect("back");
});

// -------------------------------- LOG OUT ------------------------------------- //

app.delete("/logout", (req, res, next) => {
  req.logOut((err) => {
    req.app.set("user", null);
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect("/");
  }
  next();
}

// -------------------------------- 404 Error ------------------------------------- //

// must be at the end
app.use((req, res, next) => {
  res.render("pages/404", {
    title: "Page Not Found",
    path: "",
    isAuthenticated: req.isAuthenticated(),
  });
});

// ------------------------------------------------------------------------------- //

app.listen(4000);
