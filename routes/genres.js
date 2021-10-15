const express = require("express");
const router = express.Router();
const Joi = require("joi");

const mongoose = require("mongoose");

mongoose
  .connect("mongodb://localhost/vidly")
  .then(() => console.log("connected to vidly backend"))
  .catch((error) => console.error(`could not connect to mongodb ${error}`));

const genresSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
    message: "Genre must have a name",
  },
});

const Genre = mongoose.model("genres", genresSchema);

async function getGenres() {
  const genres = await Genre.find();
  return genres;
}

async function createGenre(newGenre) {
  const genre = new Genre({
    name: newGenre.name,
  });

  try {
    const result = await genre.save();
    console.log(result);
  } catch (ex) {
    for (field in ex.errors) {
      console.log(ex.errors[field].message);
    }
  }
}

//Establishing the genres url path
router.get("", (req, res) => {
  getGenres().then((result) => {
    res.send(result);
  });
});

router.post("", (req, res) => {
  createGenre(req.body);

  //return new genres object to user
  res.send(req.body);
});

router.put("/:id", (req, res) => {
  const { error } = validateGenres(req.body);
  if (error) return res.send(error.details[0].message);
  //Check to see if genre id user is searching for exists
  const genre = genres.find((g) => g.id === parseInt(req.params.id));
  //Check to see if the updated genre equals an existing genre name
  const duplicateGenre = genres.find(
    (g) => g.genre.toLowerCase() === req.body.genre.toLowerCase()
  );
  //If genre doesn't exist return error message and set not found res status
  if (!genre)
    return res.status(404).send("The genre You're looking for doesn't exist");

  if (duplicateGenre)
    return res.status(400).send("Can't rename genre to an existing genre");

  //If the genre searched exists we'll allow the user to update the genre name
  const index = genres.indexOf(genre);
  genres[index].genre = req.body.genre;

  res.send(genres);
});

router.delete("/:id", (req, res) => {
  //Check to see if object id exists or has already been deleted
  const genre = genres.find((g) => g.id === parseInt(req.params.id));

  if (!genre) return res.status(404).send(`The genre searched doesn't exist `);

  const index = genres.indexOf(genre);
  genres.splice(index, 1);
  res.send(genres);
});

function validateGenres(genre) {
  const schema = Joi.object({
    genre: Joi.string().required().min(3),
  });

  return schema.validate(genre);
}

module.exports = router;
