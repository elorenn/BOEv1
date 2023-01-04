const { User, validate } = require("../model/userSchema");
const express = require("express");
const router = express.Router();

router.post("/", async (req, res) => {
  // First Validate The Request
  const { error } = validate(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  // Check if this user already exists
  let user = await User.findOne({ email: req.body.email });
  if (user) {
    console.log(user + "already exists!");
    return res.status(400).send("That user already exists!");
  } else {
    // Insert the new user if they do not exist yet
    user = new User({
      firstName: req.user.firstName,
      lastName: req.user.lastName,
      email: req.body.email,
      password: req.body.password,
    });
    await user.save();
    res.send(user);
  }
});

module.exports = router;
