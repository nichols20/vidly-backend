const _ = require("lodash");
const { User, validate } = require("../models/users");
const express = require("express");
const router = express.Router();

router.post("", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.send(error.details[0].message).status(400);

  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send("User aready registered ");

  user = new User(_.pick(req.body, ["name", "email", "password"]));

  try {
    await user.save();
    res.send(_.pick(user, ["name", "email"]));
  } catch (ex) {
    console.log(ex);
    res.send(ex);
  }
});

module.exports = router;
