const { User, validate } = require("../models/users");
const express = require("express");
const router = express.Router();

router.post("", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.send(error.details[0].message).status(400);
});

module.exports = router;
