const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const asyncMiddleware = require("../middleware/async");
const { Rental } = require("../models/rentals");
const { Movie } = require("../models/movies");
const Joi = require("joi");
const validate = require("../middleware/validate");

function validateReturns(returns) {
  const schema = Joi.object({
    customerId: Joi.string().required(),
    movieId: Joi.string().required(),
  });

  return schema.validate(returns);
}

router.post(
  "/",
  [auth, validate(validateReturns)],
  asyncMiddleware(async (req, res) => {
    let returns = await Rental.lookUp(req.body.customerId, req.body.movieId);

    if (!returns)
      return res.status(404).send("Customer movie rental could not be found");

    if (returns.dateReturned)
      return res.status(400).send("Rental Already returned");

    returns.return();

    await returns.save();

    await Movie.updateOne(
      { _id: req.body.movieId },
      { $inc: { numberInStock: 1 } }
    );

    return res.send(returns);
  })
);

module.exports = router;
