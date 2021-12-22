const _ = require("lodash");
const { User } = require("../models/users");
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");

router.post("", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.send(error.details[0].message).status(400);

  let user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send(" Invalid Email or Password ");

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send("Invalid Email or Password");

  res.send(true);
});

function validate(req) {
  const schema = joi.object({
    email: Joi.string().required().min(8).max(100).email(),
    password: Joi.string().required().min(3).max(100),
  });

  return schema.validate(req);
}

module.exports = router;
