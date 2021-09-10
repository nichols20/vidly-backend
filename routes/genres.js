const express = require("express");
const router = express.Router();
const Joi = require("joi");

const genres = [
  { id: 1, genre: "Action" },
  { id: 2, genre: "Thriller" },
  { id: 3, genre: "Comedy" },
];

//Establishing the genres url path
router.get("", (req, res) => {
  res.send(genres);
});

router.post("", (req, res) => {
  //Validating if the property requested passes the Joi schema before adding it to the database
  const { error } = validateGenres(req.body);
  if (error) return res.send(error.details[0].message);
  //Look to see if post request genre already exists
  const duplicateGenre = genres.find(
    (g) => g.genre.toLowerCase() === req.body.genre.toLowerCase()
  );
  //If the genre exists send error message set bad request status
  if (duplicateGenre) return res.status(400).send(`genre already exists`);

  //If no duplicate genre exists push requested genre to genres object
  const genre = { id: genres.length + 1, genre: req.body.genre };
  genres.push(genre);

  //return new genres object to user
  res.send(genres);
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
