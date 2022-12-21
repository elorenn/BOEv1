const app = require("./app");
const mongoose = require("mongoose");
const http = require("http");
const https = require("https");
const path = require("path");
const schools = require("./business.json");
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

const initializePassport = require("./passport-config");

initializePassport(
  passport,
  (email) => users.find((user) => user.email === email),
  (id) => users.find((user) => user.id === id)
);

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
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride("_method"));

// --------------------------------------------------------------------- //

// --------------------------------------------------------------------- //

app.get("/", (req, res) => {
  res.render("pages/index", {
    schools: schools,
    isAuthenticated: req.isAuthenticated(),
  });
});
app.get("/subscribe", (req, res) => {
  res.render("pages/subscribe", {
    isAuthenticated: req.isAuthenticated(),
  });
});
app.get("/resources", (req, res) => {
  res.render("pages/resources", {
    isAuthenticated: req.isAuthenticated(),
  });
});
app.get("/contact", (req, res) => {
  res.render("pages/contact", {
    isAuthenticated: req.isAuthenticated(),
  });
});
app.get("/profile", checkAuthenticated, (req, res) => {
  res.render("pages/profile", {
    schools: schools,
    name: req.user.name,
    email: req.user.email,
    date: req.user.date,
    isAuthenticated: req.isAuthenticated(),
  });
});

// --------------------------------------------------------------------- //

app.get("/login", checkNotAuthenticated, (req, res) => {
  res.render("pages/login", {
    isAuthenticated: req.isAuthenticated(),
  });
});

app.post(
  "/login",
  checkNotAuthenticated,
  passport.authenticate("local", {
    successRedirect: "/profile",
    failureRedirect: "/login",
    failureFlash: true,
  })
);

// --------------------------------------------------------------------- //

app.get("/register", checkNotAuthenticated, (req, res) => {
  res.render("./pages/register", {
    isAuthenticated: req.isAuthenticated(),
  });
});

// app.post("/register", checkNotAuthenticated, async (req, res) => {
//   try {
//     const hashedPassword = await bcrypt.hash(req.body.password, 10);
//     users.push({
//       id: Date.now().toString(),
//       name: req.body.name,
//       email: req.body.email,
//       password: hashedPassword,
//     });
//     res.redirect("/login");
//   } catch {
//     res.redirect("/register");
//   }
//   console.log(users);
// });

// --------------------------------------------------------------------- //
// Register / Sign Up Page Schema - LO

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 30,
  },
  email: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 50,
    unique: false,
  },
  password: {
    type: String,
    required: true,
    minlength: 1,
    // maxlength: 15,
  },
  date: String,
  favorites: [],
});

// --------------------------------------------------------------------- //
app.post("/register", checkNotAuthenticated, async (req, res) => {

  try {
    const postedDate = new Date().toLocaleDateString("en-us", {
      year: "numeric",
      month: "numeric",
      day: "numeric",
    });
    const favSchools = [];
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const User = mongoose.model("User", UserSchema);
    const user = new User({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
      date: postedDate,
      favorites: favSchools,
    });
    user.save();
    users.push(user);
    res.redirect("/login");
  } catch {
    res.redirect("/register");
  }
});
// --------------------------------------------------------------------- //
// Register / Sign Up Page - Save to Database - LO

// app.post("/register", function (req, res) {
//   const userName = req.body.name;
//   const userEmail = req.body.email;
//   const userPassword = req.body.password;
//   const postedDate = new Date().toLocaleDateString("en-us", {
//     year: "numeric",
//     month: "numeric",
//     day: "numeric",
//   });

// // store in BOE database
//   const User = mongoose.model("User", UserSchema);
//   const user = new User({
//     Name: userName,
//     Email: userEmail,
//     Password: userPassword,
//     Date: postedDate,
//   });
//   user.save();
// });

// --------------------------------------------------------------------- //

app.delete("/logout", (req, res, next) => {
  req.logOut((err) => {
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

app.listen(4000);
