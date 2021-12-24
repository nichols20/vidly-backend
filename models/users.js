const mongoose = require("mongoose");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const config = require("config");

const userSchema = new mongoose.Schema({
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
});

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ _id: this._id }, config.get("jwtprivatekey"));
  return token;
};

const User = mongoose.model("users", userSchema);

function validateUsers(user) {
  const schema = Joi.object({
    name: Joi.string().required().min(3).max(35),
    email: Joi.string().required().min(8).max(100).email(),
    password: Joi.string().required().min(3).max(100),
  });

  return schema.validate(user);
}

module.exports.User = User;
module.exports.validate = validateUsers;
