const express = require("express");
const router = express.Router();
const Joi = require("joi");
const mongoose = require("mongoose");

const genresSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
  },
});

const Genre = mongoose.model("genres", genresSchema);

async function getGenres() {
  const genres = await Genre.find();
  return genres;
}

async function createGenre(newGenre) {
  //create new genre object then attribute requested name to objects name value
  const genre = new Genre({
    name: newGenre.name,
  });

  try {
    //attempt to save genre in database, display result of save method
    const result = await genre.save();
    console.log(result);
  } catch (ex) {
    for (field in ex.errors) {
      console.log(ex.errors[field].message);
    }
  }
}

async function updateGenre(id, updateName) {
  //find genre user wishes to update
  const genre = await Genre.findById(id);
  /* more validation required that I will get back to later
   */
  //change old genre name to the new name user requested
  genre.name = updateName.name;

  try {
    const result = await genre.save();
    console.log(result);
    return result;
  } catch (ex) {
    console.log(ex);
  }
}

async function deleteGenre(id) {
  await Genre.deleteOne({ _id: id });
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
  updateGenre(req.params.id, req.body).then((result) => {
    res.send(result);
  });
});

router.delete("/:id", (req, res) => {
  deleteGenre(req.params.id).then(() => {
    res.send("The requested Object has been deleted");
  });
});

function validateGenres(genre) {
  const schema = Joi.object({
    genre: Joi.string().required().min(3),
  });

  return schema.validate(genre);
}

module.exports = router;
