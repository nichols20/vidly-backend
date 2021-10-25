const Joi = require("joi");
const mongoose = require("mongoose");

const Genre = mongoose.model(
  "genres",
  new mongoose.Schema({
    name: {
      type: String,
      required: true,
      minlength: 3,
    },
  })
);

function validateGenres(genre) {
  const schema = Joi.object({
    name: Joi.string().required().min(3),
  });

  return schema.validate(genre);
}

module.exports.Genre = Genre;
module.exports.validate = validateGenres;
