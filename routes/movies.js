const express = require("express");
const router = express.Router();
const { Genre } = require("../models/genres");
const { Movie } = require("../models/movies");

router.get("", async (req, res) => {
  const result = await Movie.find();
  res.send(result);
});

router.post("", async (req, res) => {
  const movie = new Movie({
    title: req.body.title,
    genre: await Genre.findById(req.body.genreID),
    dailyRentalRate: req.body.dailyRentalRate,
    numberInStock: req.body.numberInStock,
  });

  console.log(movie);

  try {
    const result = await movie.save();
    console.log(result);
    res.send(result);
  } catch (ex) {
    console.log(ex);
  }
});

module.exports = router;
