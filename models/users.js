const mongoose = require("mongoose");
const joi = require("joi");
const Joi = require("joi");

const User = mongoose.model(
  "users",
  new mongoose.Schema({
    name: {
      type: String,
      required: true,
      min: 3,
      max: 35,
    },
    email: {
      type: String,
      required: true,
      min: 8,
      max: 100,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      min: 3,
      max: 100,
    },
  })
);

function validateUsers(user) {
  const schema = joi.object({
    name: Joi.string().required().min(3).max(35),
    email: Joi.string().required().min(8).max(100).email(),
    password: Joi.string().required().min(3).max(100),
  });

  return schema.validate(user);
}

module.exports.User = User;
module.exports.validate = validateUsers;
