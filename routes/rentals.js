const express = require("express");
const router = express.Router();
const { Rental, validateRental } = require("../models/rentals");
const { Movie } = require("../models/movies");
const { Customer } = require("../models/customer");
const { isValidObjectId } = require("mongoose");
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
    await client.db("vidly").collection("rentals").insertOne(rental);

    await client
      .db("vidly")
      .collection("movies")
      .updateOne({ _id: movie._id }, { $inc: { numberInStock: -1 } });

    console.log(rental);
    res.send(rental);
  } catch (ex) {
    console.log(ex);
    res.status(500).send("something failed");
  }
});

module.exports = router;

//_ID strings consist of 24 characters and every 2 characters represents a byte (there are 12 bytes)

// the first four bytes represent a timestap
//The next three bytes represent a machine identifier
//The next two bytes represent a process identifier
//The final three bytes represent a counter
