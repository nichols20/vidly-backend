const mongoose = require("mongoose");
const Joi = require("joi");

const Rental = new mongoose.model(
  "Rentals",
  new mongoose.Schema({
    customer: {
      name: { type: String, required: true, min: 5, max: 55 },
      isGold: { type: Boolean, default: false },
      phone: { type: String, required: true, min: 5, max: 55 },
    },
    movie: {
      title: { type: String, required: true, min: 5, max: 55 },
      genre: { type: String, required: true, min: 5, max: 55 },
    },
    dailyRentalRate: {
      type: Number,
      required: true,
      min: 5,
      max: 100,
    },
    numberInStock: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    dateOut: {
      type: Date,
      required: true,
      default: Date.now,
    },
    dateReturned: {
      type: Date,
      required: true,
      default: Date.now,
    },
    rentalFee: {
      type: Number,
      min: 0,
    },
  })
);

async function validateCustomers(rental) {
  const schema = Joi.object({
    customer: Joi.string().required.min(5).max(55),
    moviedID: Joi.string().required().min(6).max(100),
  });

  return schema.validate(rental);
}

module.exports.validate = validateCustomers;
module.exports.Rental = Rental;
