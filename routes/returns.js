const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const asyncMiddleware = require("../middleware/async");
const { Rental } = require("../models/rentals");
const { Movie } = require("../models/movies");
const Joi = require("joi");

function validateReturns(returns) {
  const schema = Joi.object({
    customerId: Joi.string().required(),
    movieId: Joi.string().required(),
  });

  return schema.validate(returns);
}

const validate = (validator) => {
  return (req, res, next) => {
    const { error } = validator(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    next();
  };
};

router.post(
  "/",
  [auth, validate(validateReturns)],
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

    await Movie.updateOne(
      { _id: req.body.movieId },
      { $inc: { numberInStock: 1 } }
    );

    return res.status(200).send(returns);
  })
);

module.exports = router;
