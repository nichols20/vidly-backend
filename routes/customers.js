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

router.put("/:id", async (req, res) => {
  const { error } = await validate(req.body);
  if (error) {
    res.send(error.details[0].message);
    return;
  }

  const customer = await Customer.findById(req.params.id);
  console.log(customer);
  if (!customer)
    return res
      .status(404)
      .send("The customer you are searching for does not exist");

  try {
    const updateCustomer = await Customer.updateOne(
      { _id: req.params.id },
      {
        isGold: req.body.isGold,
        name: req.body.name,
        phone: req.body.phone,
      }
    );
    console.log(updateCustomer);
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
