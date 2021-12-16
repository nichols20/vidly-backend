const mongoose = require("mongoose");
const joi = require("joi");

const User = mongoose.model(
  "users",
  new mongoose.Schema({
    name: {
      type: String,
      required: true,
      min: 3,
      max: 35,
      unique: true,
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
