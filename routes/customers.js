const express = require("express");
const router = express.Router();
const { Customer, validate } = require("../models/customer");

router.get("", async (req, res) => {
  res.send("this is the customers route");
});

router.post("", async (req, res) => {
  const { error } = await validate(req.body);
  if (error) {
    res.send(error.details[0].message);
    return;
  }

  let customer = new Customer({
    isGold: req.body.isGold,
    name: req.body.name,
    phone: req.body.phone,
  });

  customer.save().then((result) => {
    console.log(`${result} Customer information has been saved `);
    res.send("Information has been saved");
  });
});

module.exports = router;
