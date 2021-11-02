const mongoose = require("mongoose");
const joe = require("joi");
const { genreSchema, Genre } = require("./genres");

//YOU DO NOT APPEND NEW TO MONGOOSE.MODEL
const Movie = mongoose.model(
  "movies",
  new mongoose.Schema({
    title: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 50,
    },
    genre: genreSchema,
    dailyRentalRate: {
      type: Number,
      required: true,
      max: 100,
      min: 0,
    },
    numberInStock: {
      type: Number,
      required: true,
      max: 100,
      min: 0,
    },
  })
);

module.exports.Movie = Movie;
