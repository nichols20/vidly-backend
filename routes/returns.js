const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const asyncMiddleware = require("../middleware/async");
const { validateRental, Rental } = require("../models/rentals");
const { isValidObjectId } = require("mongoose");
const { date } = require("joi");

router.post(
  "/",
  auth,
  asyncMiddleware(async (req, res) => {
    const calculateFee = (dateRented, dateReturned, rentalRate) => {
      const dateDifference = dateReturned - dateRented;
      const rentalPeriod = dateDifference / (1000 * 3600 * 24);
      let rentalFee = rentalPeriod * rentalRate;

      try {
        if (rentalFee < rentalRate) {
          rentalFee = rentalRate;
        }
      } catch (ex) {
        console.log(ex);
      }

      return rentalFee.toPrecision(4);
    };

    if (!req.body.customerId)
      return res.status(400).send("customerId is required");
    if (!req.body.movieId) return res.status(400).send("movieId is required");

    let returns = await Rental.findOne({
      customerId: req.body.customerId,
      movieId: req.body.movieId,
    });

    if (!returns)
      return res.status(404).send("Customer movie rental could not be found");

    if (returns.dateReturned)
      return res.status(400).send("Rental Already returned");

    returns.dateReturned = Date.now();

    returns.rentalFee = calculateFee(
      returns.dateOut,
      returns.dateReturned,
      returns.dailyRentalRate
    );

    await returns.save();

    console.log(returns);

    return res.status(200).send(returns);
  })
);

module.exports = router;
