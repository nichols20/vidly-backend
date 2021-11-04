const express = require("express");
const router = express.Router();
const { Rental, validateRental } = require("../models/rentals");
const { Movie } = require("../models/movies");
const { Customer } = require("../models/customer");
const { isValidObjectId } = require("mongoose");

router.post("", async (req, res) => {
  const { error } = validateRental(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const movieID = isValidObjectId(req.body.movieID);
  if (!movieID)
    return res.status(404).send("The movie selected could not be found");

  const customerID = isValidObjectId(req.body.customerID);
  if (!customerID) return res.status(404).send("You must be signed in");

  const { title, genre } = await Movie.findById(req.body.movieID);
  const { name, isGold, phone } = await Customer.findById(req.body.customerID);

  const rental = new Rental({
    customer: {
      name: name,
      isGold: isGold,
      phone: phone,
    },
    movie: {
      title: title,
      genre: {
        _id: genre._id,
        name: genre.name,
      },
    },
    dailyRentalRate: "5",
    numberInStock: "5",
  });

  try {
    const result = await rental.save();
    console.log(result);
    res.send(result);
  } catch (ex) {
    console.log(ex);
  }
});

module.exports = router;
