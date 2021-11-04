const express = require("express");
const router = express.Router();
const { Rental, validate } = require("../models/rentals");

router.post("/api/Rental", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send((error) => console.log(error));

  //const movie = new Rental({ })
});

module.exports.router = router;
