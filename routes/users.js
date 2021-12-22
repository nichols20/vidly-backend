const { User, validate } = require("../models/users");
const express = require("express");
const router = express.Router();

router.post("", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.send(error.details[0].message).status(400);

  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send("User aready registered ");

  user = new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });

  try {
    const result = await user.save();
    console.log(result);
    res.send(result);
  } catch (ex) {
    console.log(ex);
    res.send(ex);
  }
});

module.exports = router;
