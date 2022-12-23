// const LocalStrategy = require("passport-local");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const passport = require("passport");
const { Strategy } = require("passport-local");
const { UserSchema } = require("./model/userSchema");

let User = null;

const isValidPassword = async (userInput, password) => {
  console.log("invalid password: " + userInput + " does not equal " + password);
  return await bcrypt.compare(userInput, password);
};

const LoginStrategy = new Strategy(
  {
    usernameField: "email",
    passwordField: "password",
    passReqToCallback: true,
  },
  async (req, email, password, done) => {
    try {
      User = req.app.get("UserModel");
      const user = await User.findOne({ email: email });
      if (!user) {
        return done(null, false, {
          message: "No user found with those credentials. Please try again.",
        });
      }

      if (!isValidPassword(password, user.password)) {
        console.log("password not valid!");
        return done(null, false, {
          message: "Incorrect password. Please try again.",
        });
      }
      return done(null, user);
    } catch (e) {
      return done(null, false, {
        message: "Something went wrong with your sign in. Please try again.",
      });
    }
  }
);

passport.serializeUser((user, done) => {
  // This saves the whole user obj into the session cookie,
  // but typically you will see just user.id passed in.
  done(null, user.id);
});

passport.deserializeUser(async ({ _id }, done) => {
  const User = mongoose.model("User", UserSchema);
  User.findById(_id).then((user) => {
    console.log('FIND');
    if (user) {
      console.log(user);
      return done(null, user);
    } else {
      console.log("ELSE");
      done(null, null);
    }
  });
});

passport.use("local-signin", LoginStrategy);
