const express = require("express");
const router = express.Router();
const { Rental, validateRental } = require("../models/rentals");
const { Movie } = require("../models/movies");
const { isValidObjectId } = require("mongoose");

router.post("", async (req, res) => {
  const { error } = validateRental(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const movieID = isValidObjectId(req.body.movieID);
  if (!movieID)
    return res.status(404).send("The movie selected could not be found");

  const { title, genre } = await Movie.findById(req.body.movieID);

  const rental = new Rental({
    customer: "",
    movie: {
      title: title,
      genre: {
        id: genre._id,
        name: genre.name,
      },
    },
    dailyRentalRate: "",
    numberInStock: "",
  });
  //const result = await rental.save();
  //console.log(result);

  //console.log(rental);
  //const movie = new Rental({ })
});

module.exports = router;
