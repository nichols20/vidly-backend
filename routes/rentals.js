const express = require("express");
const router = express.Router();
const { Rental, validateRental } = require("../models/rentals");
const { Movie } = require("../models/movies");
const { Customer } = require("../models/customer");
const { isValidObjectId, Mongoose } = require("mongoose");
const { MongoClient } = require("mongodb");

const client = new MongoClient("mongodb://localhost:27017/vidly");

client
  .connect()
  .then(console.log("transaction connection succeeded"))
  .catch((ex) => console.log(ex));

router.post("", async (req, res) => {
  const { error } = validateRental(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const movieID = isValidObjectId(req.body.movieID);
  if (!movieID)
    return res.status(404).send("The movie selected could not be found");

  const customerID = isValidObjectId(req.body.customerID);
  if (!customerID) return res.status(404).send("You must be signed in");

  const movie = await Movie.findById(req.body.movieID);
  const { name, isGold, phone } = await Customer.findById(req.body.customerID);

  const rental = new Rental({
    customer: {
      name: name,
      isGold: isGold,
      phone: phone,
    },
    movie: {
      title: movie.title,
      genre: {
        _id: movie.genre._id,
        name: movie.genre.name,
      },
      dailyRentalRate: movie.dailyRentalRate,
    },
  });

  //Currently in this try catch block we save the newly created rental object
  //and save it to the database afterwards lowering the numberInStock of movie by 1
  //then updating the movies object in the database. We want to do these same operations
  //but by using a transactions method
  try {
    const result = await client
      .db("vidly")
      .collection("rentals")
      .insertOne(rental);
    console.log(result);
    res.send(result);
  } catch (ex) {
    console.log(ex);
  }
});

module.exports = router;
