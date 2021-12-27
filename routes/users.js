const _ = require("lodash");
const { User, validate } = require("../models/users");
const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const bcrypt = require("bcrypt");

router.get("/me", auth, async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  res.send(user);
});

router.post("", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.send(error.details[0].message).status(400);

  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send("User aready registered ");

  user = new User(_.pick(req.body, ["name", "email", "password"]));

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);

  try {
    await user.save();
    const token = user.generateAuthToken();
    //custom headers that we define in an app should be prefixed with x-
    res.header("x-auth-token", token).send(_.pick(user, ["name", "email"]));
  } catch (ex) {
    console.log(ex);
    res.send(ex);
  }
});

module.exports = router;
