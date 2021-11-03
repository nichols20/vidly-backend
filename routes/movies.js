const express = require("express");
const { isValidObjectId } = require("mongoose");
const router = express.Router();
const { Genre } = require("../models/genres");
const { Movie, validateMovies } = require("../models/movies");

router.get("", async (req, res) => {
  const result = await Movie.find();
  res.send(result);
});

router.post("", async (req, res) => {
  console.log("checkpoint 1");
  const { error } = validateMovies(req.body);
  console.log("checkpoint2");
  if (error) return res.status(400).send(error.details[0].message);

  const result = isValidObjectId(req.body.genreID);
  if (!result)
    return res
      .status(404)
      .send("The genre selected could not be found or is invalid");
  const genre = await Genre.findById(req.body.genreID);
  console.log(genre, "this is the genre");

  const movie = new Movie({
    title: req.body.title,
    genre: {
      _id: genre._id,
      name: genre.name,
    },
    dailyRentalRate: req.body.dailyRentalRate,
    numberInStock: req.body.numberInStock,
  });

  try {
    const result = await movie.save();
    console.log(result);
    res.send(result);
  } catch (ex) {
    console.log("were here");
    console.log(ex);
  }
});

module.exports = router;
