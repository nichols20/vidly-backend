const { User } = require("../models/users");
const express = require("express");
const _ = require("lodash");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const config = require("config");
const router = express.Router();
const bcrypt = require("bcrypt");

router.post("", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.send(error.details[0].message).status(400);

  let user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send(" Invalid Email or Password ");

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send("Invalid Email or Password");

  //A Json Web Token is a long string that identifies a user
  const token = jwt.sign({ _id: user._id }, config.get("jwtprivatekey"));

  res.send(token);
});

function validate(req) {
  const schema = Joi.object({
    email: Joi.string().required().min(8).max(100).email(),
    password: Joi.string().required().min(3).max(100),
  });

  return schema.validate(req);
}

module.exports = router;
