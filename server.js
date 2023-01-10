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

// ------------------ TO REDIRECT HTTP TO HTTPS SECURE CONNECTION IN PRODUCTION ONLY: ------------------ //
// app.enable("trust proxy");
// app.use(function (request, response, next) {
//   if (process.env.NODE_ENV != "development" && !request.secure) {
//     return response.redirect(
//       "https://" + request.headers.host + request.url
//     );
//   }
//   next();
// });


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
  const schools = await School.find().sort({ name: 1, _id: 1 });
  const user = req.app.get("user");
  let firstName = ":firstName";
  let lastName = ":lastName";
  let email = "";
  if (user) {
    const userLikes = await UserLike.find({ user_id: user.id });
    firstName = req.user.firstName;
    lastName = req.user.lastName;
    email = req.user.email;
    schools.forEach((school) => {
      const userLike = userLikes.find((like) =>
        school._id.equals(like.school_id)
      );
      school.is_liked = userLike ? userLike.is_liked : false;
    });
  }

  res.render("pages/index", {
    firstName: firstName,
    lastName: lastName,
    email: email,
    schools: schools,
    title: "Home Page",
    path: "/",
    appError: req.flash("appError"),
    isAuthenticated: req.isAuthenticated(),
  });
});

app.get("/success", (req, res) => {
  const user = req.app.get("user");
  let firstName = ":firstName";
  let lastName = ":lastName";
  if (user) {
    firstName = req.user.firstName;
    lastName = req.user.lastName;
  }
  res.render("pages/success", {
    firstName: firstName,
    lastName: lastName,
    path: "/success",
    title: "Success",
    isAuthenticated: req.isAuthenticated(),
  });
});

app.get("/failure", (req, res) => {
  const user = req.app.get("user");
  let firstName = ":firstName";
  let lastName = ":lastName";
  if (user) {
    firstName = req.user.firstName;
    lastName = req.user.lastName;
  }
  res.render("pages/failure", {
    firstName: firstName,
    lastName: lastName,
    path: "/failure",
    title: "Failure",
    isAuthenticated: req.isAuthenticated(),
  });
});

app.get("/applicationSubmitted", (req, res) => {
  const user = req.app.get("user");
  let firstName = ":firstName";
  let lastName = ":lastName";
  if (user) {
    firstName = req.user.firstName;
    lastName = req.user.lastName;
  }
  res.render("pages/applicationSubmitted", {
    firstName: firstName,
    lastName: lastName,
    path: "/application-submitted",
    title: "Application Submitted",
    isAuthenticated: req.isAuthenticated(),
  });
});

// app.get("/resources", (req, res) => {
//   const user = req.app.get("user");
//   let firstName = ":firstName";
//   let lastName = ":lastName";
//   if (user) {
//      firstName = req.user.firstName;
//      lastName = req.user.lastName;
//   }
//   res.render("pages/resources", {
//     firstName: firstName,
//     lastName: lastName,
//     title: "Resources",
//     path: "/resources",
//     isAuthenticated: req.isAuthenticated(),
//   });
// });

app.get("/contact", (req, res) => {
  const user = req.app.get("user");
  let firstName = ":firstName";
  let lastName = ":lastName";
  if (user) {
    firstName = req.user.firstName;
    lastName = req.user.lastName;
  }
  res.render("pages/contact", {
    firstName: firstName,
    lastName: lastName,
    title: "Contact Us",
    path: "/contact",
    isAuthenticated: req.isAuthenticated(),
  });
});

app.get(
  `/profile/:firstName.:lastName`,
  checkAuthenticated,
  async (req, res) => {
    const schools = await School.find().sort({ name: 1, _id: 1 });
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
      title: req.body.firstName + " " + req.body.lastName + " Profile",
      path: "/profile",
      schools: schools,
      firstName: req.user.firstName,
      lastName: req.user.lastName,
      email: req.user.email,
      date: req.user.date,
      isAuthenticated: req.isAuthenticated(),
    });
  }
);

// ------------------------------------- SUBSCRIBE - Save to Database ------------------------------------- //

const { subscribeModel, subscribeSchema } = require("./model/subscribeSchema");
app.set("subscribeModel", subscribeModel);

app.get("/subscribe", async (req, res) => {
  const user = req.app.get("user");
  let firstName = ":firstName";
  let lastName = ":lastName";
  let email = "";
  if (user) {
    firstName = req.user.firstName;
    lastName = req.user.lastName;
    email = req.user.email;
  }

  const schools = await School.find();
  const programs = [];
  schools.forEach((school) => {
    if (programs.indexOf(school.program) === -1) {
      programs.push(school.program);
    }
  });

  res.render("pages/subscribe", {
    firstName: firstName,
    lastName: lastName,
    email: email,
    title: "Subscribe",
    path: "/subscribe",
    programs: programs.sort(),
    subError: req.flash("subError"),
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
      Location: {
        State: req.body.state,
        City: req.body.city,
        Zipcode: req.body.zipcode,
      },
      Trade_Interests: {
        Trade_Interest_01: req.body.trade1,
        Trade_Interest_02: req.body.trade2,
        Trade_Interest_03: req.body.trade3,
      },
      User_Id: userId,
    });

    const err = subscriber.validateSync();
    if (err) {
      req.flash("subError", err.message);
      return res.redirect("/subscribe");
    } else {
      // validation passed
      subscriber.save();
      res.redirect("/success");
    }
  } catch (e) {
    console.log(e);
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
  try {
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

    const err = premiumApplication.validateSync();
    if (err) {
      req.flash("appError", err.message);
      return res.redirect("back");
    } else {
      // validation passed
      premiumApplication.save();
      res.redirect("/applicationSubmitted");
    }
  } catch (e) {
    console.log(e);
    res.redirect("/failure");
  }
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
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      });

      res.redirect(
        "/profile/" +
          user.firstName.toLowerCase() +
          "." +
          user.lastName.toLowerCase()
      );
    });
  })(req, res, next);
});

// -------------------------------- Register / Sign Up Page - Save User to Database ------------------------------------- //

app.get("/register", checkNotAuthenticated, (req, res) => {
  res.render("./pages/register", {
    title: "Register",
    path: "/register",
    regError: req.flash("regError"),
    existError: req.flash("existError"),
    isAuthenticated: req.isAuthenticated(),
  });
});

app.set("UserModel", UserModel);

app.post("/register", checkNotAuthenticated, async (req, res, done) => {
  try {
    UserEmail = req.app.get("UserModel");
    let userEmail = await UserEmail.findOne({ email: req.body.email });
    if (userEmail) {
      req.flash(
        "existError",
        req.body.email + " already exists. Please register with another email."
      );
      return res.redirect("back");
    }
    const hashedPassword = await bcrypt.hash(
      req.body.password,
      bcrypt.genSaltSync(8)
    );
    const User = mongoose.model("User", UserSchema);
    const user = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: hashedPassword,
    });
    const err = user.validateSync();
    if (err) {
      req.flash("regError", err.message);
      return res.redirect("back");
    } else {
      // validation passed
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
app.use(async (req, res, next) => {
  const user = await req.app.get("user");
  let firstName = ":firstName";
  let lastName = ":lastName";
  if (user) {
    firstName = req.user.firstName;
    lastName = req.user.lastName;
  }
  res.render("pages/404", {
    title: "Page Not Found",
    path: "",
    firstName: firstName,
    lastName: lastName,
    isAuthenticated: req.isAuthenticated(),
  });
});

// ------------------------------------------------------------------------------- //

app.listen(4000);
