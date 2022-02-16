const mongoose = require("mongoose");
const joi = require("joi");
const { genreSchema } = require("./genres");
const Joi = require("joi");

//YOU DO NOT APPEND NEW TO MONGOOSE.MODEL
const Movie = mongoose.model(
  "movies",
  new mongoose.Schema({
    title: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 50,
    },
    genre: {
      type: genreSchema,
      required: true,
    },

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

function validateMovies(movie) {
  const schema = joi.object({
    title: Joi.string().required().min(5).max(50),
    genreID: Joi.string().required().min(3).max(100),
    dailyRentalRate: Joi.number().required().min(0).max(100),
    numberInStock: Joi.number().required().min(0).max(100),
  });

  return schema.validate(movie);
}

module.exports.Movie = Movie;
module.exports.validateMovies = validateMovies;
