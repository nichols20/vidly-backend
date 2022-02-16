const Joi = require("joi");
const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50,
  },
});

const Genre = mongoose.model("genres", schema);

function validateGenres(genre) {
  const schema = Joi.object({
    name: Joi.string().required().min(5).max(50),
  });

  return schema.validate(genre);
}

module.exports.Genre = Genre;
module.exports.validate = validateGenres;
module.exports.genreSchema = schema;
